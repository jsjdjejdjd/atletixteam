const REST_TAG = "atletix-rest";

/**
 * Navegador con service worker activo y notificaciones permitidas.
 */
export function notificacionesDisponibles(): boolean {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  return Notification.permission === "granted";
}

/**
 * Pide permiso de notificaciones si todavía no fue otorgado.
 * Devuelve true si quedaron permitidas.
 */
export async function pedirPermisoNotificaciones(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    const res = await Notification.requestPermission();
    return res === "granted";
  } catch {
    return false;
  }
}

async function post(ws: { type: string; [k: string]: unknown }) {
  try {
    if (!("serviceWorker" in navigator)) return false;
    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage(ws);
    return true;
  } catch {
    return false;
  }
}

/**
 * Arranca el cronómetro en las notificaciones: el SW muestra el countdown
 * vivo y programa el aviso de fin en la pantalla de bloqueo.
 */
export async function iniciarCronometroNotificacion(
  seconds: number,
  body?: string
): Promise<void> {
  await post({
    type: "rest:start",
    endsAt: Date.now() + seconds * 1000,
    body: body ?? "tiempo de descanso restante",
  });
  if (!notificacionesDisponibles()) await pedirPermisoNotificaciones();
}

/**
 * Detiene la notificación del cronómetro (pausa / fin / cancelación).
 */
export async function detenerCronometroNotificacion(): Promise<void> {
  await post({ type: "rest:stop" });
}