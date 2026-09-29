import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth";

export default async function EntrenadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = await getAuthContext();

  if (!ctx) redirect("/login");

  if (ctx.profile.rol && ctx.profile.rol !== "admin") redirect("/alumno");

  return <>{children}</>;
}