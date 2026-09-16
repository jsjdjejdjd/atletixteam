import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white font-black text-2xl text-zinc-950">
            A
          </div>
          <h1 className="text-2xl font-black tracking-widest">ATLETIX</h1>
          <p className="mt-1 text-xs font-medium tracking-[0.3em] text-zinc-500 uppercase">
            Donde los fuertes se crean
          </p>
        </div>
        {children}
        <p className="mt-8 text-center text-xs text-zinc-600">
          <Link href="/" className="transition hover:text-zinc-400">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}