import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getAuthContext();

  if (!ctx) redirect("/login");

  const { nombre, apellido, rol } = ctx.profile;

  const nombreCompleto = [nombre, apellido].filter(Boolean).join(" ");

  return (
    <DashboardShell rol={rol ?? "alumno"} nombre={nombreCompleto || "usuario"}>
      {children}
    </DashboardShell>
  );
}