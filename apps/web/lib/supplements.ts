export type Producto = {
  id: string;
  marca: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  etiqueta?: string;
};

// ============================================================
// NÚMERO DE WHATSAPP (configurable)
// ============================================================
export const WHATSAPP_NUMERO = "5493482651550";

const WHATSAPP_MENSAJE_BASE = "Hola Gonzalo! Quiero consultar por";

// ============================================================
// PRODUCTOS — cambiá los precios DIRECTAMENTE acá ($65.000 = 65000)
// ============================================================
export const PRODUCTOS: Producto[] = [
  {
    id: "proteina-1kg",
    marca: "Star Nutrition",
    nombre: "Proteína 1kg — Chocolate",
    descripcion: "Whey protein para recuperación y masa muscular.",
    precio: 65000,
    imagen: "/suplementos/proteina-1kg.jpg",
  },
  {
    id: "creatina-300g",
    marca: "Star Nutrition",
    nombre: "Creatina 300g",
    descripcion: "Monohidratada. Fuerza, potencia y volumen.",
    precio: 32000,
    imagen: "/suplementos/creatina-300g.jpg",
  },
  {
    id: "citrato-magnesio-60",
    marca: "Star Nutrition",
    nombre: "Citrato de Magnesio 60 cápsulas",
    descripcion: "Alta absorción. Mejor contracción muscular y descanso.",
    precio: 20000,
    imagen: "/suplementos/citrato-magnesio-60.jpg",
  },
  {
    id: "combo-proteina-creatina",
    marca: "Star Nutrition",
    nombre: "Combo Proteína 1kg + Creatina",
    descripcion: "Proteína (gusto a elección / stock) + creatina 300g.",
    etiqueta: "Ahorrás más",
    precio: 92000,
    imagen: "/suplementos/combo.jpg",
  },
];

// ============================================================
// Utilidades (NO editar)
// ============================================================
export function formatearPrecio(precio: number): string {
  return "$" + precio.toLocaleString("es-AR");
}

export function linkWhatsApp(nombreProducto?: string): string {
  const texto = nombreProducto
    ? `${WHATSAPP_MENSAJE_BASE} ${nombreProducto}`
    : "Hola Gonzalo! Quiero asesorarme sobre suplementos";
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
}