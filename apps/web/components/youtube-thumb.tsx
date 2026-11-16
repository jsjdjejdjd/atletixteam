const YOUTUBE_ID_RE =
  /(?:youtube\.com\/(?:shorts\/|watch\?v=|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

/** Devuelve el ID de YouTube de un link (shorts, watch, embed, live o youtu.be). */
export function youtubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(YOUTUBE_ID_RE);
  return match ? match[1] : null;
}

/**
 * Miniatura clickeable de un video de YouTube.
 * Si el link no es de YouTube (o no se puede extraer el ID), cae a un
 * botón "Ver video" para no perder el acceso al contenido.
 */
export function YouTubeThumb({
  url,
  title,
  className = "",
}: {
  url: string | null | undefined;
  title?: string;
  className?: string;
}) {
  if (!url) return null;

  const id = youtubeVideoId(url);

  if (!id) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex w-fit items-center gap-1.5 rounded-md border border-zinc-700 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-500 ${className}`}
      >
        ▶ Ver video
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={title ? `Ver video: ${title}` : "Ver video"}
      className={`group relative block w-fit overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 transition hover:border-zinc-600 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`}
        alt={title ? `Miniatura del video de ${title}` : "Miniatura del video"}
        loading="lazy"
        className="aspect-video w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/35">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/70 pl-0.5 text-sm text-white shadow-lg ring-1 ring-white/30">
          ▶
        </span>
      </span>
      <span className="absolute bottom-1 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white/90">
        Video
      </span>
    </a>
  );
}
