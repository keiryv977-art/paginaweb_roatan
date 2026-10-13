# Isla Azul Tours · Turismo en Roatán, Honduras

Sitio web moderno y responsive para una agencia de turismo en **Roatán, Islas de la Bahía**. Se hizo a partir de la plantilla *BusTraveller* (MIT, Code Prashtt / ThemeWagon), cambiada por completo al tema de Roatán.

> **Cambio reciente:** se quitaron todas las imágenes. Cada tarjeta (destinos, hoteles, paquetes, cotizador y sección "Por qué Roatán") ahora muestra un **video de playa en bucle**, sin sonido. Los videos se cargan solo cuando aparecen en pantalla. La estructura del sitio sigue igual.

## ✅ Qué incluye
- **Inicio** con video de fondo, logo "Isla Azul Tours", estadísticas y botones de acción.
- **16 lugares turísticos y tours** con video, filtros por categoría (Playas, Mar, Naturaleza, Aventura, Cultura), calificación, duración y precio en Lempiras. Tienen un botón **+** para agregarlos al cotizador.
- **8 hoteles** con video, estrellas, servicios y precio por noche.
- **6 paquetes de viaje** con video, lo que incluye cada uno y precio por persona.
- **Cotizador en Lempiras (HNL)**, con todo lo anterior:
  - datos del viajero, adultos y niños (los niños pagan 50 %)
  - paquete, hotel adicional (noches y habitaciones), tours, traslado al aeropuerto, ferry y seguro
  - subtotal, ISV de 15 %, total y su equivalente aproximado en USD, que se actualizan al momento
  - **PDF al instante** (jsPDF): se abre en una ventana con botones *Descargar* y *Abrir*. Lleva folio, fechas, datos del cliente, una tabla de conceptos, fotogramas tomados de los videos, totales y condiciones.
  - botón para enviar la cotización por **WhatsApp**
- **Galería de videos y descargas**: 6 videos de playas. Cada uno se puede descargar por separado, y hay botones para descargar en **ZIP** todos los videos o **el sitio web completo**.
- Opiniones de clientes, pie de página con contacto, botón flotante de WhatsApp y animaciones con ScrollReveal.

## 📁 Estructura
```
index.html     Página principal
style.css      Estilos
data.js        CATÁLOGO: empresa, destinos, hoteles, paquetes, extras y videos (precios en L)
main.js        Lógica: muestra el catálogo, hace el cotizador, el PDF y los ZIP
videos/playa-turquesa.mp4    (playa turquesa con palmeras, también en el fondo del inicio)
videos/isla-muelle.mp4       (isla y muelle desde el aire)
videos/playa-palmeras.mp4    (día de playa con palmeras)
videos/isla-atardecer.mp4    (isla al atardecer desde el aire)
videos/atardecer-caribe.mp4  (atardecer sobre el mar)
videos/banco-de-arena.mp4    (banco de arena al atardecer)
```

## 🔗 Secciones (anclas)
`#home`, `#destinos`, `#hoteles`, `#paquetes`, `#cotizador`, `#galeria`, `#testimonios`, `#contacto`

## ✏️ Cómo editar
Todo se cambia en **`data.js`**: nombre de la empresa, teléfono, WhatsApp, correo, RTN, tasa del dólar, ISV, precios, nombres y videos (campo `video` de cada destino, hotel o paquete). La web, el cotizador y el PDF toman los cambios automáticamente.

## ⚠️ Importante
- El teléfono, WhatsApp, correo, RTN y precios son **de ejemplo**. Pon los datos reales en `data.js`.
- Los videos son de stock libre (Mixkit). Muestran playas tropicales del Caribe, pero no se grabaron en Roatán. Para mostrar las playas reales, cámbialos por videos propios en `videos/` con el mismo nombre de archivo.
- Los botones ZIP y el PDF funcionan cuando la página se abre desde un servidor o desde el sitio publicado. Si abres `index.html` con doble clic (file://), el ZIP no funciona por seguridad del navegador.
- Es un sitio estático: no guarda reservas ni recibe pagos.

## 🚀 Próximos pasos
- Guardar las cotizaciones en una base de datos (Table API).
- Pasarela de pago para el anticipo.
- Versión en inglés.
- Calendario de disponibilidad por hotel.
