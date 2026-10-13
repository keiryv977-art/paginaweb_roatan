/* =========================================================
   ISLA AZUL TOURS ROATÁN — Catálogo de datos
   Todos los precios están en Lempiras (HNL).
   Edita aquí precios, nombres o videos y la web +
   el cotizador + el PDF se actualizan automáticamente.
   ========================================================= */

const EMPRESA = {
  nombre: "Isla Azul Tours",
  eslogan: "Roatán, Islas de la Bahía · Honduras",
  telefono: "+504 9876-5432",
  whatsapp: "50498765432",
  correo: "reservas@islaazultours.hn",
  direccion: "Calle Principal, West End, Roatán, Islas de la Bahía",
  rtn: "RTN 0501-2025-000123",
  tasaUSD: 26.2, // 1 USD = L 26.20 (referencial)
  isv: 0.15,     // Impuesto sobre ventas 15 %
  validezDias: 15
};

/* ---------- Lugares turísticos / tours (precio por adulto) ---------- */
const DESTINOS = [
  { id: "west-bay", nombre: "Playa West Bay", zona: "West Bay", categoria: "Playas", rating: 4.9, duracion: "Día completo", precio: 1300,
    video: "videos/playa-palmeras.mp4",
    desc: "La playa más famosa de Roatán: arena blanca, agua turquesa y arrecife a pocos metros de la orilla. Incluye silla, sombrilla y transporte." },
  { id: "west-end", nombre: "Pueblo de West End", zona: "West End", categoria: "Cultura", rating: 4.7, duracion: "4 horas", precio: 900,
    video: "videos/banco-de-arena.mp4",
    desc: "Calle de arena llena de restaurantes, bares y tiendas frente al mar. Tour guiado con degustación de comida isleña." },
  { id: "little-french-key", nombre: "Little French Key", zona: "French Harbour", categoria: "Playas", rating: 4.8, duracion: "Día completo", precio: 2100,
    video: "videos/isla-muelle.mp4",
    desc: "Cayo privado con playa, piscina natural, hamacas y santuario de animales. Day pass con almuerzo incluido." },
  { id: "gumbalimba", nombre: "Gumbalimba Park", zona: "West Bay", categoria: "Naturaleza", rating: 4.7, duracion: "5 horas", precio: 1950,
    video: "videos/playa-turquesa.mp4",
    desc: "Parque ecológico con monos cariblancos, guacamayas, cuevas piratas, jardín botánico y playa privada." },
  { id: "snorkel", nombre: "Snorkel en el Arrecife", zona: "Costa Norte", categoria: "Mar", rating: 4.9, duracion: "3 horas", precio: 1200,
    video: "videos/isla-muelle.mp4",
    desc: "Explora el Arrecife Mesoamericano, el segundo más grande del mundo. Equipo y guía certificado incluidos." },
  { id: "buceo", nombre: "Buceo 2 Tanques", zona: "Sandy Bay", categoria: "Mar", rating: 4.9, duracion: "4 horas", precio: 3100,
    video: "videos/playa-turquesa.mp4",
    desc: "Dos inmersiones guiadas por instructores PADI en paredes de coral, naufragios y tortugas marinas." },
  { id: "delfines", nombre: "Encuentro con Delfines", zona: "Anthony's Key", categoria: "Mar", rating: 4.8, duracion: "2 horas", precio: 4200,
    video: "videos/playa-palmeras.mp4",
    desc: "Nada junto a delfines nariz de botella en el Roatan Institute for Marine Sciences (RIMS)." },
  { id: "canopy", nombre: "Canopy Zipline", zona: "South Shore", categoria: "Aventura", rating: 4.8, duracion: "3 horas", precio: 1800,
    video: "videos/isla-atardecer.mp4",
    desc: "Vuela sobre la selva tropical con vistas al Caribe en uno de los circuitos de canopy más largos de la isla." },
  { id: "iguanas", nombre: "Granja de Iguanas", zona: "French Cay", categoria: "Naturaleza", rating: 4.6, duracion: "2 horas", precio: 650,
    video: "videos/playa-turquesa.mp4",
    desc: "Santuario con miles de iguanas, tiburones gata y peces tropicales. Ideal para niños." },
  { id: "perezosos", nombre: "Monos y Perezosos", zona: "French Harbour", categoria: "Naturaleza", rating: 4.8, duracion: "2 horas", precio: 1050,
    video: "videos/isla-muelle.mp4",
    desc: "Abraza un perezoso y convive con monos en Daniel Johnson's Monkey & Sloth Hangout." },
  { id: "punta-gorda", nombre: "Punta Gorda Garífuna", zona: "Punta Gorda", categoria: "Cultura", rating: 4.6, duracion: "4 horas", precio: 1400,
    video: "videos/banco-de-arena.mp4",
    desc: "Conoce la primera comunidad garífuna de Centroamérica: danza punta, tambores y comida típica." },
  { id: "manglares", nombre: "Túneles de Manglar", zona: "Jonesville", categoria: "Naturaleza", rating: 4.7, duracion: "3 horas", precio: 1500,
    video: "videos/isla-atardecer.mp4",
    desc: "Recorrido en lancha por los túneles naturales de manglar que usaban los piratas como escondite." },
  { id: "camp-bay", nombre: "Playa Camp Bay", zona: "East End", categoria: "Playas", rating: 4.8, duracion: "Día completo", precio: 1700,
    video: "videos/playa-palmeras.mp4",
    desc: "La playa virgen más larga de Roatán, lejos de las multitudes, en el tranquilo extremo este de la isla." },
  { id: "catamaran", nombre: "Catamarán al Atardecer", zona: "West End", categoria: "Mar", rating: 4.9, duracion: "3 horas", precio: 2300,
    video: "videos/atardecer-caribe.mp4",
    desc: "Navega al atardecer con barra libre, música y parada de snorkel. La experiencia más romántica." },
  { id: "mahogany-bay", nombre: "Mahogany Bay", zona: "Dixon Cove", categoria: "Playas", rating: 4.5, duracion: "4 horas", precio: 800,
    video: "videos/isla-muelle.mp4",
    desc: "Puerto de cruceros con playa privada, telesilla panorámica, tiendas y restaurantes." },
  { id: "coxen-hole", nombre: "City Tour Coxen Hole", zona: "Coxen Hole", categoria: "Cultura", rating: 4.4, duracion: "3 horas", precio: 700,
    video: "videos/banco-de-arena.mp4",
    desc: "Recorre la capital de las Islas de la Bahía: mercado local, museo, artesanías y miradores." }
];

/* ---------- Hoteles (precio por habitación por noche, 2 personas) ---------- */
const HOTELES = [
  { id: "kimpton", nombre: "Kimpton Grand Roatán Resort & Spa", zona: "West Bay", estrellas: 5, precio: 8900,
    video: "videos/playa-turquesa.mp4",
    amenidades: ["Piscina infinita", "Spa", "Frente a la playa", "Wi-Fi"] },
  { id: "little-french-key-resort", nombre: "Little French Key Resort", zona: "French Harbour", estrellas: 5, precio: 9800,
    video: "videos/isla-muelle.mp4",
    amenidades: ["Isla privada", "Todo incluido", "Villas sobre el mar", "Traslado en lancha"] },
  { id: "henry-morgan", nombre: "Henry Morgan Resort", zona: "West Bay", estrellas: 4, precio: 7900,
    video: "videos/playa-palmeras.mp4",
    amenidades: ["Todo incluido", "Piscinas", "Club de niños", "Bar en la playa"] },
  { id: "anthonys-key", nombre: "Anthony's Key Resort", zona: "Sandy Bay", estrellas: 4, precio: 7400,
    video: "videos/isla-atardecer.mp4",
    amenidades: ["Bungalows sobre el agua", "Centro de buceo", "Delfines", "Comidas incluidas"] },
  { id: "infinity-bay", nombre: "Infinity Bay Spa & Beach Resort", zona: "West Bay", estrellas: 4, precio: 6200,
    video: "videos/banco-de-arena.mp4",
    amenidades: ["Suites con cocina", "Spa", "Piscina", "Frente a la playa"] },
  { id: "mayan-princess", nombre: "Mayan Princess Beach & Dive", zona: "West Bay", estrellas: 4, precio: 5600,
    video: "videos/playa-turquesa.mp4",
    amenidades: ["Frente a la playa", "Centro de buceo", "Piscina", "Restaurante"] },
  { id: "paya-bay", nombre: "Paya Bay Resort", zona: "East End", estrellas: 3, precio: 5200,
    video: "videos/atardecer-caribe.mp4",
    amenidades: ["Ecológico", "Playas privadas", "Snorkel", "Vista al mar"] },
  { id: "half-moon", nombre: "Half Moon Bay Boutique", zona: "West End", estrellas: 3, precio: 3900,
    video: "videos/playa-palmeras.mp4",
    amenidades: ["Boutique", "Cerca de bares", "Muelle de snorkel", "Desayuno"] }
];

/* ---------- Paquetes (precio por persona, base ocupación doble) ---------- */
const PAQUETES = [
  { id: "escapada-west-bay", nombre: "Escapada West Bay", noches: 3, hotel: "mayan-princess",
    precioAdulto: 14900, precioNino: 7450, etiqueta: "Más vendido",
    video: "videos/playa-palmeras.mp4",
    incluye: ["3 noches en Mayan Princess", "Desayunos", "Tour de snorkel", "Catamarán al atardecer", "Traslado aeropuerto"] },
  { id: "aventura-total", nombre: "Aventura Total", noches: 4, hotel: "infinity-bay",
    precioAdulto: 22500, precioNino: 11250, etiqueta: "Adrenalina",
    video: "videos/isla-atardecer.mp4",
    incluye: ["4 noches en Infinity Bay", "Canopy zipline", "Buceo 2 tanques", "Túneles de manglar", "Gumbalimba Park", "Traslados"] },
  { id: "luna-de-miel", nombre: "Luna de Miel en el Caribe", noches: 5, hotel: "kimpton",
    precioAdulto: 34900, precioNino: 17450, etiqueta: "Romántico",
    video: "videos/atardecer-caribe.mp4",
    incluye: ["5 noches en Kimpton Grand Roatán", "Cena romántica en la playa", "Catamarán privado", "Day pass Little French Key", "Masaje en pareja"] },
  { id: "familia-feliz", nombre: "Familia Feliz Todo Incluido", noches: 4, hotel: "henry-morgan",
    precioAdulto: 24800, precioNino: 12400, etiqueta: "Familiar",
    video: "videos/playa-turquesa.mp4",
    incluye: ["4 noches Henry Morgan todo incluido", "Encuentro con delfines", "Monos y perezosos", "Granja de iguanas", "Traslados"] },
  { id: "cultura-naturaleza", nombre: "Cultura & Naturaleza", noches: 3, hotel: "paya-bay",
    precioAdulto: 15900, precioNino: 7950, etiqueta: "Eco",
    video: "videos/banco-de-arena.mp4",
    incluye: ["3 noches en Paya Bay", "Punta Gorda Garífuna", "Playa Camp Bay", "Túneles de manglar", "Desayunos"] },
  { id: "buceo-pro", nombre: "Buceo Pro Roatán", noches: 5, hotel: "anthonys-key",
    precioAdulto: 31500, precioNino: 15750, etiqueta: "Buceo",
    video: "videos/isla-muelle.mp4",
    incluye: ["5 noches Anthony's Key con comidas", "6 inmersiones guiadas", "Encuentro con delfines", "Snorkel nocturno", "Traslados"] }
];

/* ---------- Servicios extra ---------- */
const EXTRAS = {
  trasladoAeropuerto: { nombre: "Traslado aeropuerto RTB (ida y vuelta, por vehículo hasta 4 pax)", precio: 1300 },
  ferry: { nombre: "Ferry Galaxy Wave La Ceiba ⇄ Roatán (ida y vuelta)", precioAdulto: 1950, precioNino: 1300 },
  seguro: { nombre: "Seguro de viaje (por persona)", precio: 350 }
};

/* ---------- Videos ---------- */
const VIDEOS = [
  { titulo: "Playa turquesa y palmeras", archivo: "videos/playa-turquesa.mp4" },
  { titulo: "Isla y muelle desde el aire", archivo: "videos/isla-muelle.mp4" },
  { titulo: "Día de playa en el Caribe", archivo: "videos/playa-palmeras.mp4" },
  { titulo: "Isla al atardecer", archivo: "videos/isla-atardecer.mp4" },
  { titulo: "Atardecer en el Caribe", archivo: "videos/atardecer-caribe.mp4" },
  { titulo: "Banco de arena al atardecer", archivo: "videos/banco-de-arena.mp4" }
];
