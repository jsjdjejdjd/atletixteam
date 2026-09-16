import os from "node:os";
import type { NextConfig } from "next";

// En desarrollo Next.js bloquea por seguridad cualquier acceso desde una
// computadora/celular distinta de localhost. Permitimos las IPs locales
// automáticamente así la app se puede abrir desde el celular en la misma red
// (http://192.168.x.x:3000) sin romper los clics.
const localIpv4: string[] = [];
for (const list of Object.values(os.networkInterfaces())) {
  for (const ni of list ?? []) {
    if (ni.family === "IPv4" && !ni.internal) localIpv4.push(ni.address);
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins: localIpv4,
};

export default nextConfig;
