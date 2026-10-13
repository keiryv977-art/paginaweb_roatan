/* =========================================================
   ISLA AZUL TOURS ROATÁN — Lógica principal
   Render de catálogos, cotizador en Lempiras, PDF y descargas
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Utilidades ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const fmtL = (n) => "L " + Number(n).toLocaleString("es-HN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtUSD = (n) => "$ " + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const byId = (arr, id) => arr.find((x) => x.id === id);
  const toast = (msg, ms = 2600) => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), ms);
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  /* ---------- Videos en tarjetas (se cargan y reproducen solo cuando están visibles) ---------- */
  const vidTag = (src, cls = "", label = "") =>
    `<video class="lazy__video ${cls}" data-src="${src}" muted loop playsinline webkit-playsinline preload="none" aria-label="${esc(label)}"></video>`;
  const videoObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          const v = en.target;
          if (en.isIntersecting) {
            if (!v.src) { v.src = v.dataset.src; v.load(); }
            const p = v.play();
            if (p && p.catch) p.catch(() => {});
          } else if (v.src) {
            v.pause();
          }
        });
      }, { rootMargin: "200px 0px" })
    : null;
  function observeVideos(root = document) {
    $$("video.lazy__video", root).forEach((v) => {
      if (videoObserver) videoObserver.observe(v);
      else if (!v.src) { v.src = v.dataset.src; v.play().catch(() => {}); }
    });
  }

  /* ---------- Datos de empresa en footer ---------- */
  $("#ft-tel").textContent = EMPRESA.telefono;
  $("#ft-mail").textContent = EMPRESA.correo;
  $("#ft-dir").textContent = EMPRESA.direccion;
  $("#year").textContent = new Date().getFullYear();
  const waBase = "https://wa.me/" + EMPRESA.whatsapp;
  $("#wa-float").href = waBase + "?text=" + encodeURIComponent("¡Hola Isla Azul Tours! Quiero información sobre Roatán.");
  $("#footer-wa").href = $("#wa-float").href;
  $("#footer-wa").target = "_blank";

  /* ---------- NAV ---------- */
  const nav = $("#main-nav");
  const navLinks = $("#nav-links");
  const menuIcon = $("#menu-btn i");
  $("#menu-btn").addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuIcon.className = open ? "ri-close-line" : "ri-menu-line";
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      menuIcon.className = "ri-menu-line";
    }
  });
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* =========================================================
     RENDER CATÁLOGOS
     ========================================================= */
  const selectedTours = new Set();

  function renderDestinos(cat = "Todos") {
    const list = cat === "Todos" ? DESTINOS : DESTINOS.filter((d) => d.categoria === cat);
    $("#destino-grid").innerHTML = list.map((d) => `
      <article class="destino__card">
        <div class="destino__img">
          ${vidTag(d.video, "", d.nombre + " en Roatán")}
          <span class="badge">${d.categoria}</span>
          <span class="rating"><i class="ri-star-fill"></i> ${d.rating}</span>
        </div>
        <div class="destino__body">
          <h4>${esc(d.nombre)}</h4>
          <div class="meta"><span><i class="ri-map-pin-line"></i> ${esc(d.zona)}</span><span><i class="ri-time-line"></i> ${d.duracion}</span></div>
          <p>${esc(d.desc)}</p>
          <div class="card__foot">
            <div class="price"><small>Desde / adulto</small><b>${fmtL(d.precio)}</b></div>
            <button class="add__btn ${selectedTours.has(d.id) ? "added" : ""}" data-tour="${d.id}" aria-label="Agregar ${esc(d.nombre)} a la cotización" title="Agregar a la cotización">
              <i class="${selectedTours.has(d.id) ? "ri-check-line" : "ri-add-line"}"></i>
            </button>
          </div>
        </div>
      </article>`).join("");
    observeVideos($("#destino-grid"));
  }

  $("#destino-filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $$(".chip", e.currentTarget).forEach((c) => c.classList.remove("active"));
    b.classList.add("active");
    renderDestinos(b.dataset.cat);
  });

  $("#destino-grid").addEventListener("click", (e) => {
    const b = e.target.closest(".add__btn");
    if (!b) return;
    const id = b.dataset.tour;
    const cb = $(`#q-tours input[value="${id}"]`);
    cb.checked = !cb.checked;
    cb.dispatchEvent(new Event("change", { bubbles: true }));
    toast(cb.checked ? "✔ Tour agregado a tu cotización" : "Tour quitado de la cotización");
  });

  function renderHoteles() {
    $("#hotel-grid").innerHTML = HOTELES.map((h) => `
      <article class="hotel__card">
        <div class="destino__img">
          ${vidTag(h.video, "", h.nombre)}
          <span class="badge"><i class="ri-map-pin-line"></i> ${esc(h.zona)}</span>
        </div>
        <div class="destino__body">
          <span class="stars">${"★".repeat(h.estrellas)}${"☆".repeat(5 - h.estrellas)}</span>
          <h4>${esc(h.nombre)}</h4>
          <div class="amenities">${h.amenidades.map((a) => `<span>${esc(a)}</span>`).join("")}</div>
          <div class="card__foot">
            <div class="price"><small>Por noche</small><b>${fmtL(h.precio)}</b></div>
            <button class="btn btn--sm" data-hotel="${h.id}">Cotizar</button>
          </div>
        </div>
      </article>`).join("");
    observeVideos($("#hotel-grid"));
  }
  $("#hotel-grid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-hotel]");
    if (!b) return;
    $("#q-hotel").value = b.dataset.hotel;
    updateQuote();
    $("#cotizador").scrollIntoView({ behavior: "smooth" });
    toast("Hotel seleccionado en el cotizador");
  });

  function renderPaquetes() {
    $("#paquete-grid").innerHTML = PAQUETES.map((p) => `
      <article class="paquete__card">
        <div class="paquete__img">
          ${vidTag(p.video, "", "Paquete " + p.nombre)}
          <span class="badge">${esc(p.etiqueta)}</span>
          <span class="paquete__noches"><i class="ri-moon-line"></i> ${p.noches} noches / ${p.noches + 1} días</span>
        </div>
        <div class="paquete__body">
          <h4>${esc(p.nombre)}</h4>
          <ul>${p.incluye.map((i) => `<li><i class="ri-check-line"></i>${esc(i)}</li>`).join("")}</ul>
          <div class="paquete__price">
            <div><small>Por persona desde</small><b>${fmtL(p.precioAdulto)}</b></div>
            <button class="btn btn--sm" data-paquete="${p.id}">Cotizar <i class="ri-arrow-right-line"></i></button>
          </div>
        </div>
      </article>`).join("");
    observeVideos($("#paquete-grid"));
  }
  $("#paquete-grid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-paquete]");
    if (!b) return;
    const r = $(`#q-paquetes input[value="${b.dataset.paquete}"]`);
    r.checked = true;
    updateQuote();
    $("#cotizador").scrollIntoView({ behavior: "smooth" });
    toast("Paquete seleccionado en el cotizador");
  });

  /* ---------- Formulario del cotizador ---------- */
  function renderQuoteForm() {
    $("#q-paquetes").innerHTML =
      `<label class="pick__item none"><input type="radio" name="paquete" value="" checked /><span><i class="ri-close-circle-line"></i><br/>Sin paquete</span></label>` +
      PAQUETES.map((p) => `
        <label class="pick__item">
          <input type="radio" name="paquete" value="${p.id}" />
          ${vidTag(p.video)}
          <div>${esc(p.nombre)}<b>${fmtL(p.precioAdulto)} p/p</b></div>
        </label>`).join("");

    $("#q-hotel").insertAdjacentHTML("beforeend",
      HOTELES.map((h) => `<option value="${h.id}">${esc(h.nombre)} — ${fmtL(h.precio)} / noche</option>`).join(""));

    $("#q-tours").innerHTML = DESTINOS.map((d) => `
      <label class="tour__check">
        ${vidTag(d.video)}
        <span>${esc(d.nombre)}<small>${fmtL(d.precio)}</small></span>
        <input type="checkbox" value="${d.id}" />
      </label>`).join("");
    observeVideos($("#q-paquetes"));
    observeVideos($("#q-tours"));

    $("#lbl-traslado").textContent = fmtL(EXTRAS.trasladoAeropuerto.precio) + " / vehículo";
    $("#lbl-ferry").textContent = fmtL(EXTRAS.ferry.precioAdulto) + " / adulto";
    $("#lbl-seguro").textContent = fmtL(EXTRAS.seguro.precio) + " / pax";

    const hoy = new Date();
    const iso = hoy.toISOString().slice(0, 10);
    $("#q-fecha").min = iso;
    const def = new Date(hoy.getTime() + 14 * 864e5);
    $("#q-fecha").value = def.toISOString().slice(0, 10);
  }

  /* =========================================================
     CÁLCULO DE COTIZACIÓN
     ========================================================= */
  const intVal = (sel, min, max) => {
    let v = parseInt($(sel).value, 10);
    if (isNaN(v)) v = min;
    return Math.min(Math.max(v, min), max);
  };

  function computeQuote() {
    const adultos = intVal("#q-adultos", 1, 30);
    const ninos = intVal("#q-ninos", 0, 20);
    const pax = adultos + ninos;
    const items = [];

    // Paquete
    const pId = ($("#q-paquetes input:checked") || {}).value;
    const paquete = pId ? byId(PAQUETES, pId) : null;
    if (paquete) {
      const sub = paquete.precioAdulto * adultos + paquete.precioNino * ninos;
      items.push({
        tipo: "Paquete", concepto: `Paquete "${paquete.nombre}" (${paquete.noches} noches)`,
        detalle: `${adultos} adulto(s) x ${fmtL(paquete.precioAdulto)}` + (ninos ? ` + ${ninos} niño(s) x ${fmtL(paquete.precioNino)}` : ""),
        incluye: paquete.incluye, total: sub, video: paquete.video
      });
    }

    // Hotel
    const hId = $("#q-hotel").value;
    const hotel = hId ? byId(HOTELES, hId) : null;
    const noches = intVal("#q-noches", 1, 30);
    const habs = intVal("#q-habitaciones", 1, 15);
    if (hotel) {
      items.push({
        tipo: "Hotel", concepto: hotel.nombre + " (" + hotel.zona + ")",
        detalle: `${habs} hab. x ${noches} noche(s) x ${fmtL(hotel.precio)}`,
        total: hotel.precio * noches * habs, video: hotel.video
      });
    }

    // Tours
    $$("#q-tours input:checked").forEach((cb) => {
      const d = byId(DESTINOS, cb.value);
      const ninoP = d.precio * 0.5;
      items.push({
        tipo: "Tour", concepto: d.nombre,
        detalle: `${adultos} adulto(s) x ${fmtL(d.precio)}` + (ninos ? ` + ${ninos} niño(s) x ${fmtL(ninoP)}` : ""),
        total: d.precio * adultos + ninoP * ninos, video: d.video
      });
    });

    // Extras
    if ($("#q-traslado").checked) {
      const veh = Math.ceil(pax / 4);
      items.push({ tipo: "Extra", concepto: "Traslado aeropuerto RTB (ida y vuelta)", detalle: `${veh} vehículo(s) x ${fmtL(EXTRAS.trasladoAeropuerto.precio)}`, total: veh * EXTRAS.trasladoAeropuerto.precio });
    }
    if ($("#q-ferry").checked) {
      const f = EXTRAS.ferry;
      items.push({ tipo: "Extra", concepto: "Ferry La Ceiba - Roatán (ida y vuelta)", detalle: `${adultos} adulto(s) x ${fmtL(f.precioAdulto)}` + (ninos ? ` + ${ninos} niño(s) x ${fmtL(f.precioNino)}` : ""), total: f.precioAdulto * adultos + f.precioNino * ninos });
    }
    if ($("#q-seguro").checked) {
      items.push({ tipo: "Extra", concepto: "Seguro de viaje", detalle: `${pax} persona(s) x ${fmtL(EXTRAS.seguro.precio)}`, total: pax * EXTRAS.seguro.precio });
    }

    const subtotal = items.reduce((a, i) => a + i.total, 0);
    const isv = subtotal * EMPRESA.isv;
    const total = subtotal + isv;
    return { adultos, ninos, pax, items, subtotal, isv, total, usd: total / EMPRESA.tasaUSD, paquete, hotel, noches, habs };
  }

  function updateQuote() {
    const q = computeQuote();
    const list = $("#summary-list");
    if (!q.items.length) {
      list.innerHTML = `<li class="empty">Selecciona un paquete, hotel o tour para comenzar.</li>`;
    } else {
      list.innerHTML = q.items.map((i) => `<li><span>${esc(i.concepto)}<small>${esc(i.detalle)}</small></span><b>${fmtL(i.total)}</b></li>`).join("");
    }
    $("#sum-subtotal").textContent = fmtL(q.subtotal);
    $("#sum-isv").textContent = fmtL(q.isv);
    $("#sum-total").textContent = fmtL(q.total);
    $("#sum-usd").textContent = fmtUSD(q.usd);

    // Sincroniza botones "+" de las tarjetas de destinos
    selectedTours.clear();
    $$("#q-tours input:checked").forEach((c) => selectedTours.add(c.value));
    $$("#destino-grid .add__btn").forEach((b) => {
      const on = selectedTours.has(b.dataset.tour);
      b.classList.toggle("added", on);
      b.querySelector("i").className = on ? "ri-check-line" : "ri-add-line";
    });
    return q;
  }

  $("#quote-form").addEventListener("input", updateQuote);
  $("#quote-form").addEventListener("change", updateQuote);
  $("#quote-form").addEventListener("submit", (e) => e.preventDefault());

  $("#btn-reset").addEventListener("click", () => {
    $("#quote-form").reset();
    renderQuoteFormDefaults();
    updateQuote();
    toast("Cotización reiniciada");
  });
  function renderQuoteFormDefaults() {
    const def = new Date(Date.now() + 14 * 864e5);
    $("#q-fecha").value = def.toISOString().slice(0, 10);
  }

  function validate() {
    let ok = true;
    ["#q-nombre", "#q-fecha"].forEach((s) => {
      const el = $(s);
      const bad = !el.value.trim();
      el.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) {
      toast("Completa tu nombre y la fecha de llegada");
      $("#q-nombre").scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    if (!computeQuote().items.length) {
      toast("Agrega al menos un paquete, hotel o tour");
      return false;
    }
    return true;
  }

  /* =========================================================
     GENERACIÓN DE PDF (jsPDF + AutoTable)
     ========================================================= */
  // Texto seguro para las fuentes estándar del PDF (Latin-1)
  const pdfTxt = (s) => String(s)
    .replace(/[⇄↔]/g, "-").replace(/[—–]/g, "-").replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    .replace(/[^\x00-\xFF]/g, "");

  // Captura un fotograma del video para usarlo en el PDF (el sitio ya no usa imágenes)
  const frameCache = {};
  function loadImageData(src) {
    if (frameCache[src]) return frameCache[src];
    frameCache[src] = new Promise((resolve) => {
      const v = document.createElement("video");
      v.muted = true;
      v.playsInline = true;
      v.preload = "auto";
      let done = false;
      const finish = (val) => { if (!done) { done = true; resolve(val); v.removeAttribute("src"); v.load(); } };
      const timer = setTimeout(() => finish(null), 8000);
      v.addEventListener("loadedmetadata", () => {
        try { v.currentTime = Math.min(1.5, (v.duration || 2) / 2); } catch (e) { finish(null); }
      });
      v.addEventListener("seeked", () => {
        try {
          const max = 700;
          const ratio = Math.min(1, max / v.videoWidth);
          const c = document.createElement("canvas");
          c.width = Math.round(v.videoWidth * ratio);
          c.height = Math.round(v.videoHeight * ratio);
          c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
          clearTimeout(timer);
          finish({ data: c.toDataURL("image/jpeg", 0.8), w: c.width, h: c.height });
        } catch (e) { clearTimeout(timer); finish(null); }
      });
      v.addEventListener("error", () => { clearTimeout(timer); finish(null); });
      v.src = src;
    });
    return frameCache[src];
  }

  async function buildPDF() {
    const { jsPDF } = window.jspdf;
    const q = computeQuote();
    const doc = new jsPDF({ unit: "mm", format: "letter" });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 14;
    const navy = [11, 29, 51], cyan = [8, 145, 178], amber = [245, 158, 11];

    const hoy = new Date();
    const folio = "IAT-" + hoy.toISOString().slice(0, 10).replace(/-/g, "") + "-" + String(Math.floor(Math.random() * 9000) + 1000);
    const vence = new Date(hoy.getTime() + EMPRESA.validezDias * 864e5);
    const fDate = (d) => d.toLocaleDateString("es-HN", { day: "2-digit", month: "long", year: "numeric" });

    // ---------- Encabezado con fotograma de video ----------
    const hero = await loadImageData("videos/playa-turquesa.mp4");
    if (hero) {
      // recorte para cubrir banda superior
      const bandH = 46;
      const scale = W / hero.w;
      const imgH = hero.h * scale;
      doc.addImage(hero.data, "JPEG", 0, (bandH - imgH) / 2, W, imgH);
    }
    doc.setFillColor(...navy);
    doc.setGState && doc.setGState(new doc.GState({ opacity: 0.78 }));
    doc.rect(0, 0, W, 46, "F");
    doc.setGState && doc.setGState(new doc.GState({ opacity: 1 }));
    // Tapamos la parte de imagen que sobresale
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 46, W, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(pdfTxt(EMPRESA.nombre), M, 19);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(pdfTxt(EMPRESA.eslogan), M, 26);
    doc.text(pdfTxt(`${EMPRESA.telefono}  |  ${EMPRESA.correo}`), M, 32);
    doc.text(pdfTxt(EMPRESA.rtn), M, 38);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("COTIZACIÓN", W - M, 19, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("No. " + folio, W - M, 26, { align: "right" });
    doc.text("Emitida: " + fDate(hoy), W - M, 32, { align: "right" });
    doc.text("Válida hasta: " + fDate(vence), W - M, 38, { align: "right" });

    doc.setFillColor(...amber);
    doc.rect(0, 46, W, 1.6, "F");

    // ---------- Datos del cliente ----------
    let y = 56;
    doc.setTextColor(...navy);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("DATOS DEL CLIENTE", M, y);
    doc.text("DETALLES DEL VIAJE", W / 2 + 4, y);
    doc.setDrawColor(...cyan);
    doc.setLineWidth(0.5);
    doc.line(M, y + 1.5, W / 2 - 4, y + 1.5);
    doc.line(W / 2 + 4, y + 1.5, W - M, y + 1.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const fechaLleg = $("#q-fecha").value ? new Date($("#q-fecha").value + "T12:00:00") : null;
    const cli = [
      ["Nombre:", $("#q-nombre").value.trim()],
      ["Teléfono:", $("#q-telefono").value.trim() || "-"],
      ["Correo:", $("#q-correo").value.trim() || "-"]
    ];
    const viaje = [
      ["Destino:", "Roatán, Islas de la Bahía"],
      ["Llegada:", fechaLleg ? fDate(fechaLleg) : "-"],
      ["Viajeros:", `${q.adultos} adulto(s), ${q.ninos} niño(s)`]
    ];
    cli.forEach((r, i) => {
      doc.setFont("helvetica", "bold"); doc.text(pdfTxt(r[0]), M, y + 8 + i * 6);
      doc.setFont("helvetica", "normal"); doc.text(pdfTxt(r[1]).slice(0, 48), M + 20, y + 8 + i * 6);
    });
    viaje.forEach((r, i) => {
      doc.setFont("helvetica", "bold"); doc.text(pdfTxt(r[0]), W / 2 + 4, y + 8 + i * 6);
      doc.setFont("helvetica", "normal"); doc.text(pdfTxt(r[1]), W / 2 + 24, y + 8 + i * 6);
    });
    y += 30;

    // ---------- Tabla de conceptos ----------
    const body = q.items.map((it, idx) => [
      String(idx + 1),
      it.tipo,
      pdfTxt(it.concepto) + "\n" + pdfTxt(it.detalle) + (it.incluye ? "\nIncluye: " + pdfTxt(it.incluye.join(", ")) : ""),
      pdfTxt(fmtL(it.total))
    ]);

    doc.autoTable({
      startY: y,
      head: [["#", "Tipo", "Descripción", "Importe (HNL)"]],
      body,
      margin: { left: M, right: M },
      theme: "grid",
      styles: { font: "helvetica", fontSize: 9, cellPadding: 3, textColor: [30, 41, 59], lineColor: [226, 232, 240], valign: "middle" },
      headStyles: { fillColor: navy, textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [240, 249, 255] },
      columnStyles: { 0: { cellWidth: 8, halign: "center" }, 1: { cellWidth: 20, fontStyle: "bold", textColor: cyan }, 3: { cellWidth: 34, halign: "right", fontStyle: "bold" } }
    });

    y = doc.lastAutoTable.finalY + 6;
    if (y > H - 75) { doc.addPage(); y = 20; }

    // ---------- Totales ----------
    const bx = W - M - 82;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(bx, y, 82, 40, 3, 3, "F");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal", bx + 5, y + 8); doc.text(pdfTxt(fmtL(q.subtotal)), bx + 77, y + 8, { align: "right" });
    doc.text("ISV (15 %)", bx + 5, y + 15); doc.text(pdfTxt(fmtL(q.isv)), bx + 77, y + 15, { align: "right" });
    doc.setFillColor(...cyan);
    doc.roundedRect(bx, y + 19, 82, 12, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL", bx + 5, y + 27); doc.text(pdfTxt(fmtL(q.total)), bx + 77, y + 27, { align: "right" });
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`Equivalente aprox.: ${fmtUSD(q.usd)} (tasa L ${EMPRESA.tasaUSD.toFixed(2)} x USD)`, bx + 77, y + 37, { align: "right" });

    // ---------- Fotogramas de lo cotizado ----------
    const thumbs = q.items.filter((i) => i.video).slice(0, 3);
    const tw = (bx - M - 8) / 3, th = 26;
    for (let i = 0; i < thumbs.length; i++) {
      const im = await loadImageData(thumbs[i].video);
      if (im) {
        // recorte tipo "cover"
        const x = M + i * (tw + 4);
        const r = Math.max(tw / im.w, th / im.h);
        const c = document.createElement("canvas");
        c.width = Math.round(tw * 10); c.height = Math.round(th * 10);
        const img = new Image();
        await new Promise((ok) => { img.onload = ok; img.onerror = ok; img.src = im.data; });
        const ctx = c.getContext("2d");
        const sw = tw / r, sh = th / r;
        ctx.drawImage(img, (im.w - sw) / 2, (im.h - sh) / 2, sw, sh, 0, 0, c.width, c.height);
        doc.addImage(c.toDataURL("image/jpeg", 0.8), "JPEG", x, y, tw, th);
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        const cap = doc.splitTextToSize(pdfTxt(thumbs[i].concepto), tw - 5);
        doc.text(cap[0] + (cap.length > 1 ? "..." : ""), x, y + th + 4);
      }
    }
    y += 46;

    // ---------- Notas ----------
    const notas = $("#q-notas").value.trim();
    if (y > H - 55) { doc.addPage(); y = 20; }
    doc.setTextColor(...navy);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("CONDICIONES", M, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    const cond = [
      `- Cotización válida por ${EMPRESA.validezDias} días. Precios en Lempiras (HNL) con ISV incluido en el total.`,
      "- Niños de 3 a 11 años pagan 50 % en tours. Menores de 3 años gratis (sin asiento ni cama).",
      "- Para confirmar se requiere un anticipo del 50 %. Saldo 7 días antes de la llegada.",
      "- Tarifas sujetas a disponibilidad de hoteles y operadores al momento de la reserva.",
      "- Pagos: transferencia bancaria, depósito o tarjeta de crédito/débito."
    ];
    if (notas) cond.push("- Comentarios del cliente: " + pdfTxt(notas));
    const lines = doc.splitTextToSize(cond.join("\n"), W - M * 2);
    doc.text(lines, M, y + 6);

    // ---------- Pie ----------
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFillColor(...navy);
      doc.rect(0, H - 14, W, 14, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.text(pdfTxt(`${EMPRESA.nombre} · ${EMPRESA.direccion}`), M, H - 5.5);
      doc.text(`Página ${p} de ${pages}`, W - M, H - 5.5, { align: "right" });
    }

    return { doc, folio };
  }

  let lastPdfUrl = null;
  $("#btn-pdf").addEventListener("click", async () => {
    if (!validate()) return;
    if (!window.jspdf) { toast("No se pudo cargar el generador de PDF. Revisa tu conexión."); return; }
    const btn = $("#btn-pdf");
    btn.disabled = true;
    btn.innerHTML = '<i class="ri-loader-4-line"></i> Generando PDF...';
    try {
      const { doc, folio } = await buildPDF();
      const blob = doc.output("blob");
      if (lastPdfUrl) URL.revokeObjectURL(lastPdfUrl);
      lastPdfUrl = URL.createObjectURL(blob);
      const fname = `Cotizacion-${folio}.pdf`;
      $("#pdf-download").href = lastPdfUrl;
      $("#pdf-download").download = fname;
      $("#pdf-open").href = lastPdfUrl;
      const frame = $("#pdf-frame");
      if (isMobile()) {
        // Los navegadores móviles no muestran PDF dentro de iframes: se ofrece abrir/descargar
        frame.removeAttribute("src");
        frame.srcdoc = '<body style="font-family:sans-serif;display:grid;place-items:center;height:95vh;margin:0;background:#f1f5f9;color:#0b1d33;text-align:center;padding:20px"><div><h2>¡Tu cotización está lista!</h2><p>Toca <b>Abrir</b> para verla o <b>Descargar</b> para guardarla en tu teléfono.</p></div></body>';
      } else {
        frame.removeAttribute("srcdoc");
        frame.src = lastPdfUrl;
      }
      $("#pdf-modal").classList.add("open");
      $("#pdf-modal").setAttribute("aria-hidden", "false");
    } catch (err) {
      console.error(err);
      toast("Ocurrió un error al generar el PDF");
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="ri-file-pdf-2-line"></i> Ver cotización en PDF';
    }
  });
  const closeModal = () => { $("#pdf-modal").classList.remove("open"); $("#pdf-modal").setAttribute("aria-hidden", "true"); };
  $("#pdf-close").addEventListener("click", closeModal);
  $("#pdf-modal").addEventListener("click", (e) => { if (e.target.id === "pdf-modal") closeModal(); });

  /* ---------- WhatsApp ---------- */
  $("#btn-whatsapp").addEventListener("click", () => {
    const q = computeQuote();
    if (!q.items.length) { toast("Agrega al menos un paquete, hotel o tour"); return; }
    let msg = `¡Hola ${EMPRESA.nombre}! Quiero confirmar esta cotización:\n\n`;
    msg += `Nombre: ${$("#q-nombre").value || "-"}\nLlegada: ${$("#q-fecha").value || "-"}\nViajeros: ${q.adultos} adulto(s), ${q.ninos} niño(s)\n\n`;
    q.items.forEach((i) => { msg += `• ${i.concepto}: ${fmtL(i.total)}\n`; });
    msg += `\nSubtotal: ${fmtL(q.subtotal)}\nISV 15%: ${fmtL(q.isv)}\nTOTAL: ${fmtL(q.total)}`;
    window.open(waBase + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  });

  /* =========================================================
     GALERÍA Y DESCARGAS
     ========================================================= */
  const fileName = (p) => p.split("/").pop();

  $("#video-grid").innerHTML = VIDEOS.map((v) => `
    <article class="video__card">
      <video controls playsinline webkit-playsinline preload="metadata"><source src="${v.archivo}#t=1" type="video/mp4" /></video>
      <div class="media__foot"><span>${esc(v.titulo)}</span><a class="dl__btn" href="${v.archivo}" download="${fileName(v.archivo)}"><i class="ri-download-2-line"></i> MP4</a></div>
    </article>`).join("");

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  // ZIP
  async function downloadZip(files, zipName, btn) {
    if (!window.JSZip) { toast("No se pudo cargar el compresor ZIP. Revisa tu conexión."); return; }
    const status = $("#zip-status");
    const original = btn.innerHTML;
    btn.disabled = true;
    try {
      const zip = new JSZip();
      let done = 0, fails = 0;
      for (const f of files) {
        status.textContent = `Preparando ${zipName}: ${done + 1} de ${files.length} archivos...`;
        try {
          const res = await fetch(f);
          if (!res.ok) throw new Error(res.status);
          zip.file(f, await res.blob());
        } catch (e) { fails++; }
        done++;
      }
      status.textContent = "Comprimiendo...";
      const blob = await zip.generateAsync({ type: "blob" }, (m) => { status.textContent = `Comprimiendo... ${Math.round(m.percent)} %`; });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = zipName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 60000);
      status.textContent = `✔ ${zipName} listo (${files.length - fails} archivos)` + (fails ? ` · ${fails} no se pudieron incluir` : "");
    } catch (e) {
      console.error(e);
      status.textContent = "Ocurrió un error al crear el ZIP.";
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  }
  const vidFiles = [...new Set(VIDEOS.map((v) => v.archivo))];
  $("#btn-zip-vid").addEventListener("click", (e) => downloadZip(vidFiles, "IslaAzul-Roatan-videos.zip", e.currentTarget));
  $("#btn-zip-web").addEventListener("click", (e) => downloadZip(["index.html", "style.css", "main.js", "data.js", "README.md", ...vidFiles], "IslaAzul-Roatan-sitio-web.zip", e.currentTarget));

  /* ---------- Newsletter ---------- */
  $("#newsletter-form").addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    toast("¡Gracias! Te enviaremos nuestras mejores ofertas.");
  });

  /* ---------- Inicialización ---------- */
  renderDestinos();
  renderHoteles();
  renderPaquetes();
  renderQuoteForm();
  updateQuote();

  /* ---------- Animaciones ---------- */
  if (window.ScrollReveal) {
    const sr = ScrollReveal({ origin: "bottom", distance: "40px", duration: 900, reset: false, cleanup: true });
    sr.reveal(".hero__content > *", { interval: 150 });
    sr.reveal(".hero__stats", { delay: 600 });
    sr.reveal(".why__card", { interval: 120 });
    sr.reveal(".section__header, .section__kicker, .section__description");
    sr.reveal(".showcase__image", { origin: "left" });
    sr.reveal(".showcase__content", { origin: "right" });
    sr.reveal(".testi__card", { interval: 150 });
  }
})();
