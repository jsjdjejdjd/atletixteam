// v6: se dejo de cachear respuestas (ver handler "fetch"). El activate borra
// todo lo que dejo la v5, que tiene HTML autenticado y RSC viejos guardados.
const CACHE = "atletix-v6";

// ---- Estado del cronómetro de descanso en el SW ----
// La página le envía `rest:start`/`rest:stop` con `endsAt` (timestamp ms).
// El SW mantiene una notificación con el countdown vivo y, si el navegador
// soporta Notification Triggers, programa la notificación de fin para que
// aparezca en la pantalla de bloqueo incluso con la app cerrada.
const REST_TAG = "atletix-rest";
const REST_FIN_TAG = "atletix-rest-fin";
let restTimer = null;
let restEndsAt = null;

// El descanso se anuncia en silencio (sin sonido, sin vibración) y el contador
// se refresca cada 30 segundos en vez de cada segundo: refrescarlo cada segundo
// generaba un heads-up por segundo en Android, muy molesto.
const SILENT = { silent: true, vibrate: 0, requireInteraction: false };
const REFRESH_MS = 30000;

function fmtRemaining(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function clearRest() {
  if (restTimer !== null) {
    clearInterval(restTimer);
    restTimer = null;
  }
  restEndsAt = null;
  self.registration
    .getNotifications({ tag: REST_TAG })
    .then((list) => list.forEach((n) => n.close()))
    .catch(() => {});
  self.registration
    .getNotifications({ tag: REST_FIN_TAG })
    .then((list) => list.forEach((n) => n.close()))
    .catch(() => {});
}

function showRestFinished() {
  self.registration
    .showNotification("Descanso terminado 💪", {
      body: "A entrenar de nuevo",
      tag: REST_FIN_TAG,
      renotify: false,
      ...SILENT,
    })
    .catch(() => {});
}

function tickRest() {
  if (restEndsAt === null) return;
  const remain = restEndsAt - Date.now();
  if (remain <= 0) {
    clearRest();
    showRestFinished();
    return;
  }
  self.registration
    .showNotification("Descanso en curso", {
      body: `Quedan ${fmtRemaining(remain)}`,
      tag: REST_TAG,
      renotify: false,
      ...SILENT,
    })
    .catch(() => {});
}

function startRest(endsAt, titulo, body) {
  clearRest();
  restEndsAt = endsAt;
  tickRest();
  restTimer = setInterval(tickRest, REFRESH_MS);

  if (typeof TimestampTrigger !== "undefined") {
    try {
      self.registration
        .showNotification("Descanso terminado 💪", {
          body: "A entrenar de nuevo",
          tag: REST_FIN_TAG,
          renotify: false,
          showTrigger: new TimestampTrigger(new Date(endsAt)),
          ...SILENT,
        })
        .catch(() => {});
    } catch {
      /* triggers no disponibles */
    }
  }
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

// Mensajes del cronómetro de descanso enviados desde la app.
self.addEventListener("message", (e) => {
  const data = e.data;
  if (!data || typeof data !== "object") return;
  if (data.type === "rest:start") {
    const endsAt = Number(data.endsAt);
    if (!Number.isFinite(endsAt)) return;
    startRest(endsAt, data.titulo, data.body);
  } else if (data.type === "rest:stop") {
    clearRest();
  }
});

// Tocar una notificación enfoca/abre la app.
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  if (e.notification.tag === REST_FIN_TAG) {
    clearRest();
  }
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ("focus" in c) {
          c.focus();
          return;
        }
      }
      if ("openWindow" in self) return self.clients.openWindow("/");
    })
  );
});

// No cacheamos respuestas. El SW existe para el cronómetro de descanso, y
// cachear el resto era contraproducente:
//
//   - Los payloads RSC de Next llevan un hash del build. Servir uno viejo
//     después de un deploy rompe la hidratación y deja la página en error.
//   - El HTML va autenticado pero la clave es solo la URL: si la red fallaba,
//     se le servía la página cacheada de quien hubiera usado el dispositivo
//     antes, con los datos de esa persona.
//   - La búsqueda y las APIs quedaban pegadas con resultados viejos.
//
// Los assets estaticos de /_next/static/ ya los cachea el navegador con
// immutable, asi que no hacia falta duplicarlo aqui.
//
// Un catch-all sobre GET es justamente lo que hacia que un alumno con la app
// instalada anduviera con datos viejos mientras otro recien actualizado andaba
// bien.

self.addEventListener("fetch", () => {
  // Dejar que la red atienda todo. Sin respondWith no hay cacheo.
});
