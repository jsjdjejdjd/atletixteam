const CACHE = "atletix-v4";

// ---- Estado del cronómetro de descanso en el SW ----
// La página le envía `rest:start`/`rest:stop` con `endsAt` (timestamp ms).
// El SW mantiene una notificación con el countdown vivo y, si el navegador
// soporta Notification Triggers, programa la notificación de fin para que
// aparezca en la pantalla de bloqueo incluso con la app cerrada.
const REST_TAG = "atletix-rest";
const REST_FIN_TAG = "atletix-rest-fin";
let restTimer = null;
let restEndsAt = null;

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

function tickRest() {
  if (restEndsAt === null) return;
  const remain = restEndsAt - Date.now();
  if (remain <= 0) {
    clearRest();
    self.registration
      .showNotification("Descanso terminado 💪", {
        body: "A entrenar de nuevo",
        tag: REST_TAG,
        renotify: true,
      })
      .catch(() => {});
    return;
  }
  self.registration
    .showNotification(`Descanso · ${fmtRemaining(remain)}`, {
      body: "tiempo de descanso restante",
      tag: REST_TAG,
      renotify: false,
    })
    .catch(() => {});
}

function startRest(endsAt, titulo, body) {
  clearRest();
  restEndsAt = endsAt;
  tickRest();
  restTimer = setInterval(tickRest, 1000);

  // Notificación programada para la pantalla de bloqueo (Android/Chrome):
  // aparece a la hora exacta del fin aunque cierres la app.
  if (typeof TimestampTrigger !== "undefined") {
    try {
      self.registration
        .showNotification("Descanso terminado 💪", {
          body: "A entrenar de nuevo",
          tag: REST_FIN_TAG,
          renotify: true,
          showTrigger: new TimestampTrigger(new Date(endsAt)),
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

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() =>
        caches.match(req).then(
          (r) => r || (req.mode === "navigate" ? caches.match("/") : undefined)
        )
      )
  );
});