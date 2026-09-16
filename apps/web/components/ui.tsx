import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      {children}
      {hint ? <span className="text-xs text-zinc-600">{hint}</span> : null}
    </label>
  );
}

const inputBase =
  "rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-zinc-500";

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputBase, className)} {...props} />;
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(inputBase, "min-h-24 resize-y", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(inputBase, className)} {...props} />;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  return (
    <button
      className={cn(
        "rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-white text-zinc-950 hover:bg-zinc-200",
        variant === "secondary" &&
          "border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white",
        variant === "danger" &&
          "border border-red-900/70 text-red-300 hover:bg-red-950/40",
        className
      )}
      {...props}
    />
  );
}

export function LinkButton({
  href,
  variant = "secondary",
  className,
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition",
        variant === "primary" &&
          "bg-white text-zinc-950 hover:bg-zinc-200",
        variant === "secondary" &&
          "border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white",
        className
      )}
    >
      {children}
    </a>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 px-6 py-12 text-center">
      <p className="text-sm font-semibold text-zinc-400">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-zinc-600">{description}</p>
      ) : null}
    </div>
  );
}

export function SectionCard({
  title,
  children,
  actions,
}: {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40">
      {title || actions ? (
        <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-6 py-4">
          {title ? <h2 className="text-lg font-bold">{title}</h2> : null}
          {actions}
        </div>
      ) : null}
      {children}
    </div>
  );
}