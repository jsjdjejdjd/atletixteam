import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth";

export default async function AlumnoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getAuthContext();

  if (!ctx) redirect("/login");

  if (ctx.profile.rol === "admin") redirect("/entrenador");

  return <>{children}</>;
}