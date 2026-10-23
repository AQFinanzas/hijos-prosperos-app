/* LÓGICA DE LA APP
   Aquí está cómo funciona todo: pantallas, misiones, monedas, racha e insignias.
   El progreso se guarda en el celular (localStorage). Más adelante se guardará en una base de datos.
*/

(() => {
  "use strict";

  /* ---------- Guardado del progreso ---------- */
  const CLAVE = "hp-app-v1";
  const ESTADO_INICIAL = {
    familia: null,         // { nombre, correo, whatsapp } de papá o mamá
    perfil: null,          // { nombre, edad: "chico" | "grande", avatar }
    monedas: 0,
    racha: 0,
    ultimaFecha: null,     // "AAAA-MM-DD" del último día con misión
    completados: {},       // { 1: { fecha, familia: true/false } }
    insignias: [],
    mesada: 30,
    meta: null,            // { nombre, precio, hijo, padre }
    unaPorDia: false,      // false = prototipo: se abren seguidas
    sonido: true,
    vioIntro: false,
  };
  let estado = cargar();

  function cargar() {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE));
      return Object.assign({}, ESTADO_INICIAL, guardado || {});
    } catch (e) {
      return Object.assign({}, ESTADO_INICIAL);
    }
  }
  function guardar() {
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* sin guardado */ }
  }

  /* ---------- Ayudas ---------- */
  const $ = (sel) => document.querySelector(sel);
  const hoy = () => new Date().toLocaleDateString("en-CA");
  const ayer = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toLocaleDateString("en-CA"); };
  const chico = () => estado.perfil && estado.perfil.edad === "chico";
  const texto = (paso) => (chico() ? paso.chico : paso.grande).replace("{nombre}", estado.perfil ? estado.perfil.nombre : "");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const barajar = (arr) => arr.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);

  const INSIGNIAS = [
    { id: "bienvenido", nombre: "Bienvenido", como: "Terminar el día 1", color: "#2D8EBB" },
    { id: "ahorro", nombre: "Mi primer 10%", como: "Terminar el día 4", color: "#FFB81C" },
    { id: "meta", nombre: "Tengo una meta", como: "Terminar el día 5", color: "#2FA36B" },
    { id: "juego", nombre: "Conozco el juego", como: "Terminar el día 7", color: "#ED480F" },
    { id: "racha7", nombre: "Racha de 7", como: "7 días seguidos", color: "#9B5DE5" },
    { id: "familia", nombre: "Equipo familiar", como: "7 misiones en familia", color: "#170B5B" },
  ];
  const INSIGNIA_POR_DIA = { 1: "bienvenido", 4: "ahorro", 5: "meta", 7: "juego" };

  function medalla(color, tam = 72) {
    return `<svg class="medalla" width="${tam}" height="${tam}" viewBox="0 0 72 72" aria-hidden="true">
      <path d="M24 4h10l-6 22h-10z M38 4h10l4 22h-10z" fill="#ED480F"/>
      <circle cx="36" cy="44" r="24" fill="${color}"/><circle cx="36" cy="44" r="17" fill="none" stroke="#fff" stroke-width="3" stroke-opacity=".7"/>
      <path d="M36 32l3.6 7.4 8.1 1.2-5.9 5.7 1.4 8.1-7.2-3.8-7.2 3.8 1.4-8.1-5.9-5.7 8.1-1.2z" fill="#fff"/></svg>`;
  }
  const CANDADO = `<svg class="candado" viewBox="0 0 40 40" aria-hidden="true"><rect x="7" y="17" width="26" height="19" rx="5" fill="#FFB81C"/><path d="M13 17v-5a7 7 0 0 1 14 0v5" stroke="#FFB81C" stroke-width="4" fill="none"/><circle cx="20" cy="26" r="3" fill="#170B5B"/></svg>`;

  /* ---------- Sonidos (sin archivos) ---------- */
  let audio;
  function sonar(tipo) {
    if (!estado.sonido) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const notas = tipo === "premio" ? [660, 880, 1320] : tipo === "mal" ? [220] : [880, 1320];
      notas.forEach((f, i) => {
        const o = audio.createOscillator(), g = audio.createGain();
        o.type = tipo === "mal" ? "triangle" : "sine";
        o.frequency.value = f;
        const t = audio.currentTime + i * 0.09;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        o.connect(g).connect(audio.destination);
        o.start(t); o.stop(t + 0.3);
      });
    } catch (e) { /* sin sonido */ }
  }
  // Voz de Dinerito: usa la voz en español del celular, tablet o computadora.
  // Prefiere voces latinoamericanas y las más naturales (Google, Microsoft "Natural", Siri).
  function elegirVoz() {
    const voces = speechSynthesis.getVoices().filter((v) => v.lang && v.lang.toLowerCase().startsWith("es"));
    const puntos = (v) => {
      const l = v.lang.toLowerCase(), n = v.name.toLowerCase();
      let p = 0;
      if (/(419|mx|us|co|ar|cl|pe|ve)/.test(l)) p += 4;
      if (/natural|neural|google|siri|premium|enhanced|mejorad/.test(n)) p += 3;
      if (l === "es-es") p += 1;
      return p;
    };
    return voces.sort((a, b) => puntos(b) - puntos(a))[0];
  }
  function hablar(t) {
    try {
      if (!("speechSynthesis" in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t);
      const voz = elegirVoz();
      if (voz) { u.voice = voz; u.lang = voz.lang; } else u.lang = "es-419";
      u.rate = 0.95; u.pitch = 1.1;
      speechSynthesis.speak(u);
    } catch (e) { /* sin voz */ }
  }
  try { speechSynthesis.onvoiceschanged = () => {}; } catch (e) {}
  const ICONO_AUDIO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
  const botonAudio = (t, etiqueta = "Escuchar") =>
    `<button class="boton-audio" type="button" data-texto="${esc(t)}">${ICONO_AUDIO}<span>${etiqueta}</span></button>`;
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".boton-audio");
    if (b) hablar(b.dataset.texto);
  });

  /* ---------- Navegación entre pantallas ---------- */
  function ir(nombre) {
    document.querySelectorAll(".pantalla").forEach((p) => p.classList.remove("activa"));
    $("#pantalla-" + nombre).classList.add("activa");
    window.scrollTo(0, 0);
    try { speechSynthesis.cancel(); } catch (e) {}
    if (nombre === "mapa") pintarMapa();
    if (nombre === "insignias") pintarInsignias();
  }
  document.querySelectorAll("[data-volver]").forEach((b) => b.addEventListener("click", () => ir(b.dataset.volver)));

  /* ---------- Bienvenida ---------- */
  const SALUDOS = [
    "¡Hola! Soy Dinerito.",
    "¡Vamos a ganar, guardar y hacer crecer el dinero!",
    "¡Me encanta que estés aquí!",
    "¿Listo para tu primera misión?",
  ];
  function iniciarBienvenida() {
    const caja = $("#bienvenida-dinerito");
    const globo = $("#globo-saludo");
    caja.innerHTML = dinerito("saludando", 180);
    let i = 0, ocupado = false;
    caja.addEventListener("click", () => {
      if (ocupado) return;
      ocupado = true;
      const frase = SALUDOS[i % SALUDOS.length]; i++;
      caja.innerHTML = dinerito("celebrando", 180);
      caja.classList.remove("saltando"); void caja.offsetWidth; caja.classList.add("saltando");
      globo.textContent = frase;
      globo.classList.remove("visible"); void globo.offsetWidth; globo.classList.add("visible");
      sonar("bien");
      hablar(frase);
      setTimeout(() => { caja.innerHTML = dinerito("saludando", 180); caja.classList.remove("saltando"); ocupado = false; }, 1100);
    });
    $("#btn-empezar").addEventListener("click", () => {
      estado.vioIntro = true; guardar();
      ir(estado.perfil ? "mapa" : "registro");
    });
  }

  /* ---------- Registro ---------- */
  function iniciarRegistro() {
    let avatar = AVATARES[0];
    const caja = $("#opciones-avatar");
    caja.innerHTML = AVATARES.map((c, i) =>
      `<button type="button" class="avatar-opcion" style="background:${c}" data-color="${c}" aria-pressed="${i === 0}" aria-label="Color ${i + 1}"></button>`).join("");
    caja.addEventListener("click", (e) => {
      const b = e.target.closest(".avatar-opcion"); if (!b) return;
      caja.querySelectorAll(".avatar-opcion").forEach((x) => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true"); avatar = b.dataset.color;
    });
    const paso = (n) => {
      $("#form-familia").hidden = n !== 1;
      $("#form-registro").hidden = n !== 2;
      $("#punto-1").classList.toggle("activo", n === 1);
      $("#punto-2").classList.toggle("activo", n === 2);
      (n === 1 ? $("#input-adulto") : $("#input-nombre")).focus({ preventScroll: true });
    };
    if (estado.familia) {
      $("#input-adulto").value = estado.familia.nombre;
      $("#input-correo").value = estado.familia.correo;
      $("#input-whatsapp").value = estado.familia.whatsapp || "";
      $("#input-acepto").checked = true;
    }
    $("#form-familia").addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = $("#input-adulto").value.trim();
      const correo = $("#input-correo").value.trim();
      const whatsapp = $("#input-whatsapp").value.trim();
      const err = $("#error-familia");
      if (!nombre) return (err.textContent = "Escribe tu nombre.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) return (err.textContent = "Escribe un correo válido, por ejemplo nombre@gmail.com.");
      if (!$("#input-acepto").checked) return (err.textContent = "Marca la casilla para continuar.");
      err.textContent = "";
      estado.familia = { nombre, correo, whatsapp };
      guardar();
      paso(2);
    });
    $("#btn-atras-registro").addEventListener("click", () => paso(1));
    $("#form-registro").addEventListener("submit", (e) => {
      e.preventDefault();
      const nombre = $("#input-nombre").value.trim();
      const edad = (document.querySelector("input[name=edad]:checked") || {}).value;
      if (!nombre) return ($("#error-registro").textContent = "Escribe el nombre del niño o la niña.");
      if (!edad) return ($("#error-registro").textContent = "Elige la edad para ajustar las misiones.");
      estado.perfil = { nombre, edad, avatar };
      guardar();
      ir("mapa");
    });
    if (estado.familia && !estado.perfil) paso(2);
  }

  /* ---------- Mapa ---------- */
  function diaAbierto(n) {
    if (n === 1) return true;
    const previo = estado.completados[n - 1];
    if (!previo) return false;
    if (estado.unaPorDia && previo.fecha === hoy()) return false;
    return true;
  }
  function diaActual() {
    for (let n = 1; n <= DIAS.length; n++) if (!estado.completados[n]) return n;
    return null;
  }

  function pintarMapa() {
    if (!estado.perfil) return;
    document.body.classList.toggle("modo-chico", chico());
    $("#barra-avatar").style.background = estado.perfil.avatar;
    $("#barra-nombre").textContent = estado.perfil.nombre;
    $("#barra-monedas").textContent = estado.monedas;
    $("#barra-racha").textContent = estado.racha;

    if (estado.meta) {
      const meses = Math.ceil(estado.meta.precio / Math.max(1, estado.meta.hijo + estado.meta.padre));
      $("#meta-barra").hidden = false;
      $("#meta-texto").textContent = `Mi meta: ${estado.meta.nombre}, ${estado.meta.precio} dólares en ${meses} ${meses === 1 ? "mes" : "meses"}`;
      $("#meta-progreso").style.width = "4%";
    } else {
      $("#meta-barra").hidden = true;
    }

    const actual = diaActual();
    const posiciones = [[50, 9], [26, 21], [68, 33], [30, 46], [70, 58], [32, 70], [62, 83]];
    const sendero = posiciones.map(([x, y], i) => (i === 0 ? "M" : "L") + x + " " + y).join(" ");
    const nodos = DIAS.map((d, i) => {
      const [x, y] = posiciones[i];
      const hecho = !!estado.completados[d.dia];
      const abierto = diaAbierto(d.dia);
      const clase = hecho ? "hecho" : abierto ? (d.dia === actual ? "actual" : "") : "cerrado";
      const etiqueta = hecho ? "✓" : abierto ? d.dia : d.dia;
      const aviso = !abierto && !hecho && estado.unaPorDia && estado.completados[d.dia - 1] ? "Se abre mañana" : d.titulo;
      return `<button class="nodo ${clase}" style="left:${x}%;top:${y}%" data-dia="${d.dia}" ${!abierto && !hecho ? 'aria-disabled="true"' : ""}
        aria-label="Día ${d.dia}: ${esc(d.titulo)}${hecho ? ", hecho" : !abierto ? ", cerrado" : ""}">${etiqueta}<small>${esc(aviso)}</small></button>`;
    }).join("");

    const pos = actual ? posiciones[actual - 1] : posiciones[6];
    const dx = pos[0] > 50 ? pos[0] - 34 : pos[0] + 14;
    const terminado = !actual;

    $("#mapa").innerHTML = `
      <div class="isla">
        <span class="isla-nombre">Isla del Dinero</span>
        <span class="isla-sub">${terminado ? "¡Terminaste los 7 días!" : "7 días gratis"}</span>
        <div class="camino">
          <svg class="sendero" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="${sendero}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.6" stroke-dasharray="1 2.6" stroke-linecap="round" vector-effect="non-scaling-stroke" style="stroke-width:6px"/>
          </svg>
          ${nodos}
          <div class="dinerito-mapa" style="left:${dx}%;top:calc(${pos[1]}% - 40px)">${dinerito(terminado ? "celebrando" : "feliz", 70)}</div>
        </div>
      </div>
      <div class="isla-cerradas">${ISLAS_SIGUIENTES.map((i) => `
        <div class="isla-cerrada">${CANDADO}<div><strong>${i.nombre}</strong><span>${i.semana}, con la membresía</span></div></div>`).join("")}</div>
    `;
    $("#mapa").querySelectorAll(".nodo").forEach((n) => n.addEventListener("click", () => {
      const dia = +n.dataset.dia;
      if (!diaAbierto(dia) && !estado.completados[dia]) return;
      abrirMision(dia);
    }));
  }
  /* ---------- Misión ---------- */
  let mision = null; // { dia, paso, fase: "pasos" | "actividad" | "familia" }

  function abrirMision(n) {
    mision = { dia: DIAS[n - 1], paso: 0, fase: "pasos" };
    ir("mision");
    pintarMision();
  }
  function avance() {
    const total = mision.dia.pasos.length + 2;
    const hecho = mision.fase === "pasos" ? mision.paso : mision.fase === "actividad" ? mision.dia.pasos.length : total - 1;
    $("#mision-progreso").style.width = ((hecho + 0.5) / total) * 100 + "%";
  }

  function pintarMision() {
    avance();
    const cuerpo = $("#mision-cuerpo");
    const d = mision.dia;
    if (mision.fase === "pasos") {
      const t = texto(d.pasos[mision.paso]);
      cuerpo.innerHTML = `
        <p class="mision-dia">Día ${d.dia}: ${esc(d.titulo)}</p>
        <div class="escena">
          <div class="globo">${esc(t)}</div>
          ${dinerito(mision.paso === 0 ? d.pose : mision.paso === 1 ? "feliz" : "pensando", 170)}
          ${botonAudio(t, "Escuchar a Dinerito")}
        </div>
        <div class="empuje"></div>
        <div class="botones"><button class="boton boton-principal boton-ancho" id="btn-seguir">Seguir</button></div>`;
      if (chico()) hablar(t);
      $("#btn-seguir").onclick = () => {
        if (mision.paso < d.pasos.length - 1) mision.paso++;
        else mision.fase = "actividad";
        pintarMision();
      };
      return;
    }
    if (mision.fase === "actividad") {
      const a = d.actividad;
      cuerpo.innerHTML = `<p class="mision-dia">Día ${d.dia}: ${esc(d.titulo)}</p><h2 class="instruccion">${esc(a.instruccion)}</h2><div class="centrar">${botonAudio(a.instruccion)}</div><div id="actividad"></div>
        <div class="empuje"></div><div class="botones"><button class="boton boton-principal boton-ancho" id="btn-seguir" disabled>Seguir</button></div>`;
      const listo = () => { const b = $("#btn-seguir"); b.disabled = false; b.focus(); };
      $("#btn-seguir").onclick = () => { mision.fase = "familia"; pintarMision(); };
      ACTIVIDADES[a.tipo](a, $("#actividad"), listo);
      if (chico()) hablar(a.instruccion);
      return;
    }
    // Familia
    cuerpo.innerHTML = `
      <p class="mision-dia">Día ${d.dia}: ${esc(d.titulo)}</p>
      <div class="escena">${dinerito("saludando", 120)}</div>
      <div class="familia-tarjeta">
        <h3>Misión en familia</h3>
        <p>${esc(d.familia)}</p>
        <p class="extra">Si la hacen juntos, ganas el doble de monedas.</p>
        ${botonAudio(d.familia + " Si la hacen juntos, ganas el doble de monedas.")}
      </div>
      <div class="empuje"></div>
      <div class="botones">
        <button class="boton boton-principal boton-ancho" id="btn-familia">La hicimos en familia</button>
        <button class="boton boton-secundario boton-ancho" id="btn-despues">La hacemos después</button>
      </div>`;
    if (chico()) hablar(d.familia);
    $("#btn-familia").onclick = () => terminarMision(true);
    $("#btn-despues").onclick = () => terminarMision(false);
  }

  function terminarMision(conFamilia) {
    const n = mision.dia.dia;
    const yaEstaba = estado.completados[n];
    let ganadas = 0;
    if (!yaEstaba) {
      ganadas = conFamilia ? 20 : 10;
      estado.completados[n] = { fecha: hoy(), familia: conFamilia };
      if (estado.ultimaFecha !== hoy()) {
        estado.racha = estado.ultimaFecha === ayer() ? estado.racha + 1 : 1;
        estado.ultimaFecha = hoy();
      }
    } else if (conFamilia && !yaEstaba.familia) {
      ganadas = 10;
      yaEstaba.familia = true;
    }
    estado.monedas += ganadas;
    const nuevas = [];
    const ganar = (id) => { if (!estado.insignias.includes(id)) { estado.insignias.push(id); nuevas.push(id); } };
    if (INSIGNIA_POR_DIA[n]) ganar(INSIGNIA_POR_DIA[n]);
    if (estado.racha >= 7) ganar("racha7");
    if (Object.values(estado.completados).filter((c) => c.familia).length >= 7) ganar("familia");
    guardar();
    mostrarPremio(ganadas, nuevas, n === 7);
  }

  function mostrarPremio(ganadas, nuevas, final) {
    $("#premio-dinerito").innerHTML = dinerito("celebrando", 130);
    $("#premio-monedas").textContent = ganadas ? `+${ganadas} monedas` : "¡Repaso completo!";
    $("#premio-insignia").innerHTML = nuevas.map((id) => {
      const i = INSIGNIAS.find((x) => x.id === id);
      return `<div class="insignia-ganada">${medalla(i.color, 56)}<div><strong>Nueva insignia</strong><br>${esc(i.nombre)}</div></div>`;
    }).join("");
    const lluvia = $("#lluvia");
    lluvia.innerHTML = Array.from({ length: 14 }, (_, i) =>
      `<i style="left:${(i * 7 + Math.random() * 6).toFixed(1)}%;animation-delay:${(Math.random() * 0.5).toFixed(2)}s"></i>`).join("");
    $("#btn-premio").textContent = final ? "Ver lo que sigue" : "Volver al mapa";
    $("#premio").hidden = false;
    $("#btn-premio").focus();
    sonar("premio");
    $("#btn-premio").onclick = () => {
      $("#premio").hidden = true;
      if (final) { pintarFin(); ir("fin"); } else ir("mapa");
    };
  }

  /* ---------- Actividades del día ---------- */
  function pregunta(p, caja, listo) {
    caja.insertAdjacentHTML("beforeend", `
      <div class="pregunta"><h3 class="instruccion">${esc(p.texto)}</h3>
      <div class="opciones">${p.opciones.map((o, i) => `<button class="opcion" data-i="${i}">${esc(o)}</button>`).join("")}</div>
      <p class="respuesta" aria-live="polite"></p></div>`);
    const zona = caja.querySelector(".pregunta:last-child");
    zona.querySelectorAll(".opcion").forEach((b) => b.addEventListener("click", () => {
      const r = zona.querySelector(".respuesta");
      if (+b.dataset.i === p.correcta) {
        b.classList.add("bien"); r.className = "respuesta bien"; r.textContent = "¡Muy bien!"; sonar("bien");
        zona.querySelectorAll(".opcion").forEach((x) => (x.disabled = true));
        listo();
      } else {
        b.classList.remove("mal"); void b.offsetWidth; b.classList.add("mal");
        r.className = "respuesta mal"; r.textContent = "Casi. Intenta otra vez."; sonar("mal");
      }
    }));
  }

  const ACTIVIDADES = {
    revelar(a, caja, listo) {
      caja.innerHTML = `<div class="cofres">${a.cartas.map((c, i) => `<button class="cofre" data-i="${i}">${esc(c.frente)}</button>`).join("")}</div>`;
      const vistos = new Set();
      caja.querySelectorAll(".cofre").forEach((b) => b.addEventListener("click", () => {
        const c = a.cartas[+b.dataset.i];
        b.classList.add("abierto");
        b.innerHTML = `<strong>${esc(c.frente)}</strong>${esc(c.detras)}`;
        if (chico()) hablar(c.detras);
        if (!vistos.has(b.dataset.i)) { vistos.add(b.dataset.i); sonar("bien"); }
        if (vistos.size === a.cartas.length) listo();
      }));
    },

    clasificar(a, caja, listo) {
      const usarChico = chico() && a.opcionesChico;
      const opciones = usarChico ? a.opcionesChico : a.opciones;
      const items = barajar(a.items);
      let i = 0;
      const pintar = () => {
        const it = items[i];
        caja.innerHTML = `
          <div class="tarjeta-item">${esc(it.texto)}</div>
          <p class="contador">${i + 1} de ${items.length}</p>
          <div class="opciones ${opciones.length === 2 ? "dos" : "dos"}">${opciones.map((o, k) => `<button class="opcion" data-k="${k}">${esc(o)}</button>`).join("")}</div>
          <p class="respuesta" aria-live="polite"></p>`;
        if (chico()) hablar(it.texto);
        caja.querySelectorAll(".opcion").forEach((b) => b.addEventListener("click", () => {
          const correcta = usarChico ? it.chico : it.correcta;
          const r = caja.querySelector(".respuesta");
          if (+b.dataset.k === correcta) {
            b.classList.add("bien"); r.className = "respuesta bien"; r.textContent = "¡Correcto!"; sonar("bien");
            caja.querySelectorAll(".opcion").forEach((x) => (x.disabled = true));
            setTimeout(() => { i++; if (i < items.length) pintar(); else { caja.innerHTML = `<div class="escena">${dinerito("celebrando", 140)}<div class="globo">¡Las clasificaste todas!</div></div>`; listo(); } }, 700);
          } else {
            b.classList.remove("mal"); void b.offsetWidth; b.classList.add("mal");
            r.className = "respuesta mal"; r.textContent = "Piénsalo otra vez."; sonar("mal");
          }
        }));
      };
      pintar();
    },

    frascos(a, caja, listo) {
      const parte = Math.round((estado.mesada / 3) * 100) / 100;
      caja.innerHTML = `
        ${chico() ? "" : `<p class="calculo">Tu mesada: <strong>${estado.mesada}</strong> dólares, dividida en 3 partes de ${parte}</p>`}
        <div class="frascos">${a.frascos.map((f, i) => `
          <button class="frasco" data-i="${i}"><span class="tapa"></span>${chico() ? "" : `<span class="cantidad">${parte}</span>`}<span>${esc(f.nombre)}</span></button>`).join("")}</div>
        <p class="detalle-frasco" aria-live="polite">Toca un frasco.</p>`;
      const vistos = new Set();
      caja.querySelectorAll(".frasco").forEach((b) => b.addEventListener("click", () => {
        const f = a.frascos[+b.dataset.i];
        b.classList.add("visto");
        caja.querySelector(".detalle-frasco").textContent = f.detalle;
        if (chico()) hablar(f.detalle);
        vistos.add(b.dataset.i); sonar("bien");
        if (vistos.size === a.frascos.length && !caja.querySelector(".pregunta")) pregunta(a.pregunta, caja, listo);
      }));
    },

    diezporciento(a, caja, listo) {
      const diez = Math.round(estado.mesada * 10) / 100;
      caja.innerHTML = `
        ${chico() ? "" : `<p class="calculo">De tu mesada de ${estado.mesada} dólares, tu 10% es <strong>${diez}</strong> dólares</p>`}
        <div class="monedas-fila">${Array.from({ length: 10 }, (_, i) =>
          `<button class="moneda ${i === 9 ? "elegida" : ""}" ${i === 9 ? 'aria-label="Esta moneda va a la alcancía"' : 'tabindex="-1" aria-hidden="true"'}></button>`).join("")}</div>
        <div class="alcancia">
          <svg viewBox="0 0 140 100" aria-hidden="true">
            <ellipse cx="70" cy="58" rx="56" ry="38" fill="#ED480F"/><rect x="54" y="20" width="32" height="6" rx="3" fill="#170B5B"/>
            <circle cx="104" cy="50" r="5" fill="#170B5B"/><ellipse cx="124" cy="62" rx="10" ry="12" fill="#F26A3A"/>
            <rect x="34" y="88" width="14" height="12" rx="4" fill="#ED480F"/><rect x="92" y="88" width="14" height="12" rx="4" fill="#ED480F"/>
            <path d="M20 46 q-12 -8 -8 -18" stroke="#ED480F" stroke-width="5" fill="none" stroke-linecap="round"/>
          </svg>
          <span id="texto-alcancia">De cada 10 monedas, toca la que va a tu alcancía.</span>
        </div>`;
      const m = caja.querySelector(".moneda.elegida");
      m.addEventListener("click", () => {
        m.classList.remove("elegida"); m.classList.add("cayo"); m.disabled = true;
        sonar("premio");
        $("#texto-alcancia").textContent = "¡Muy bien! Ya te pagaste a ti primero.";
        if (chico()) { hablar("¡Muy bien! Ya te pagaste a ti primero."); listo(); }
        else pregunta(a.pregunta, caja, listo);
      });
    },

    meta(a, caja, listo) {
      let elegida = estado.meta ? METAS_OPCIONES.find((o) => o.nombre === estado.meta.nombre) || METAS_OPCIONES[0] : null;
      const sugeridoHijo = Math.max(1, Math.round(estado.mesada * 0.2));
      caja.innerHTML = `
        <div class="metas">${METAS_OPCIONES.map((o, i) => `<button class="meta-opcion" data-i="${i}" aria-pressed="false">${esc(o.nombre)}</button>`).join("")}</div>
        <div id="plan-meta"></div>`;
      const pintarPlan = () => {
        if (!elegida) return;
        const plan = $("#plan-meta");
        const precio = estado.meta && estado.meta.nombre === elegida.nombre ? estado.meta.precio : elegida.precio;
        const hijo = estado.meta && estado.meta.nombre === elegida.nombre ? estado.meta.hijo : sugeridoHijo;
        const padre = estado.meta && estado.meta.nombre === elegida.nombre ? estado.meta.padre : Math.max(0, Math.round(precio / 5) - hijo);
        plan.innerHTML = `
          <label class="fila-campo"><span>¿Cuánto cuesta? (dólares)</span><input type="number" min="1" max="5000" id="m-precio" value="${precio}" inputmode="numeric"></label>
          <label class="fila-campo"><span>¿Cuánto ahorras tú cada mes?</span><input type="number" min="1" max="1000" id="m-hijo" value="${hijo}" inputmode="numeric"></label>
          <label class="fila-campo"><span>¿Cuánto te ayuda tu familia cada mes?</span><input type="number" min="0" max="5000" id="m-padre" value="${padre}" inputmode="numeric"></label>
          <div class="resultado-meta" aria-live="polite" id="m-resultado"></div>`;
        const calcular = () => {
          const p = Math.max(1, +$("#m-precio").value || 1), h = Math.max(0, +$("#m-hijo").value || 0), f = Math.max(0, +$("#m-padre").value || 0);
          const meses = h + f > 0 ? Math.ceil(p / (h + f)) : null;
          $("#m-resultado").innerHTML = meses
            ? `Tu ${esc(elegida.nombre.toLowerCase())} llega en<strong>${meses} ${meses === 1 ? "mes" : "meses"}</strong>Ahorrando ${h + f} dólares al mes entre los dos.`
            : "Escribe cuánto van a ahorrar cada mes.";
          if (meses) { estado.meta = { nombre: elegida.nombre, precio: p, hijo: h, padre: f }; guardar(); listo(); }
        };
        plan.querySelectorAll("input").forEach((inp) => inp.addEventListener("input", calcular));
        calcular();
      };
      caja.querySelectorAll(".meta-opcion").forEach((b) => {
        if (elegida && METAS_OPCIONES[+b.dataset.i] === elegida) b.setAttribute("aria-pressed", "true");
        b.addEventListener("click", () => {
          caja.querySelectorAll(".meta-opcion").forEach((x) => x.setAttribute("aria-pressed", "false"));
          b.setAttribute("aria-pressed", "true");
          elegida = METAS_OPCIONES[+b.dataset.i];
          if (estado.meta && estado.meta.nombre !== elegida.nombre) estado.meta = null;
          sonar("bien"); pintarPlan();
        });
      });
      pintarPlan();
    },

    frase(a, caja, listo) {
      let siguiente = 0;
      caja.innerHTML = `<div class="frase-armada" aria-live="polite"></div>
        <div class="chips">${barajar(a.partes.map((p, i) => ({ p, i }))).map((x) => `<button class="chip" data-i="${x.i}">${esc(x.p)}</button>`).join("")}</div>`;
      const armada = caja.querySelector(".frase-armada");
      caja.querySelectorAll(".chips .chip").forEach((b) => b.addEventListener("click", () => {
        if (+b.dataset.i === siguiente) {
          siguiente++; sonar("bien");
          armada.insertAdjacentHTML("beforeend", `<span class="chip puesto">${esc(a.partes[+b.dataset.i])}</span>`);
          b.remove();
          if (siguiente === a.partes.length) {
            const completa = a.partes.join(" ") + ".";
            caja.querySelector(".chips").innerHTML = `<div class="escena">${dinerito("celebrando", 120)}<div class="globo">¡Esa es la frase! ${esc(completa)}</div></div>`;
            hablar(completa);
            listo();
          }
        } else {
          b.classList.remove("mal"); void b.offsetWidth; b.classList.add("mal"); sonar("mal");
        }
      }));
    },
  };

  /* ---------- Insignias ---------- */
  function pintarInsignias() {
    $("#lista-insignias").innerHTML = `
      <p class="nota">${estado.insignias.length} de ${INSIGNIAS.length} insignias. Llevas ${estado.monedas} monedas.</p>
      <div class="insignias">${INSIGNIAS.map((i) => {
        const tiene = estado.insignias.includes(i.id);
        return `<div class="insignia ${tiene ? "" : "bloqueada"}">${medalla(i.color)}<strong>${esc(i.nombre)}</strong><span>${esc(i.como)}</span></div>`;
      }).join("")}</div>`;
  }
  $("#btn-perfil").addEventListener("click", () => ir("insignias"));

  /* ---------- Fin de los 7 días ---------- */
  function pintarFin() {
    const nombre = estado.perfil ? estado.perfil.nombre : "";
    $("#fin-cuerpo").innerHTML = `
      ${dinerito("celebrando", 170)}
      <h1 class="titulo-grande">¡Lo lograste, ${esc(nombre)}!</h1>
      <p class="texto-claro">Terminaste los 7 días en la Isla del Dinero. Ya sabes en qué consiste el juego del dinero.</p>
      <div class="isla-cerradas">${ISLAS_SIGUIENTES.map((i) => `<div class="isla-cerrada">${CANDADO}<div><strong>${i.nombre}</strong><span>${i.semana}</span></div></div>`).join("")}</div>
      <div class="botones">
        <button class="boton boton-principal boton-ancho" id="btn-seguir-aventura">Quiero seguir la aventura</button>
        <button class="boton boton-secundario boton-ancho" id="btn-fin-mapa">Volver al mapa</button>
      </div>`;
    $("#btn-seguir-aventura").onclick = () => abrirPadres("membresia");
    $("#btn-fin-mapa").onclick = () => ir("mapa");
  }

  /* ---------- Panel de papá y mamá ---------- */
  let destinoPadres = "panel";
  function abrirPadres(destino = "panel") {
    destinoPadres = destino;
    const a = 3 + Math.floor(Math.random() * 6), b = 4 + Math.floor(Math.random() * 6);
    $("#padres-cuerpo").innerHTML = `
      <div class="puerta">
        <p class="nota">Esta parte es para papá o mamá.</p>
        <h2 class="titulo">¿Cuánto es ${a} × ${b}?</h2>
        <input type="number" inputmode="numeric" id="puerta-respuesta" aria-label="Respuesta">
        <p class="error" id="puerta-error" role="alert"></p>
        <button class="boton boton-principal" id="puerta-ok">Entrar</button>
      </div>`;
    ir("padres");
    const entrar = () => {
      if (+$("#puerta-respuesta").value === a * b) pintarPanel();
      else $("#puerta-error").textContent = "Esa no es la respuesta. Intente de nuevo.";
    };
    $("#puerta-ok").onclick = entrar;
    $("#puerta-respuesta").addEventListener("keydown", (e) => { if (e.key === "Enter") entrar(); });
  }
  $("#btn-padres").addEventListener("click", () => abrirPadres());

  let eventoInstalar = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); eventoInstalar = e; });

  function pintarPanel() {
    const hechos = Object.keys(estado.completados).length;
    const membresia = `
      <div class="bloque">
        <h2>La aventura sigue en la membresía</h2>
        <p>En el mes 1, su hijo completa el reto: la Isla de la Mesada, la Isla de la Alcancía, las 4 Piezas y el Monopolio Próspero. Después llega una temporada nueva cada mes.</p>
        <p>Cada mes incluye una clase en vivo para las familias sobre el fondo de inversión de su hijo.</p>
        <p><strong>Las familias registradas antes del lanzamiento tienen precio de fundador.</strong></p>
      </div>`;
    $("#padres-cuerpo").innerHTML = `
      ${destinoPadres === "membresia" ? membresia : ""}
      <div class="bloque">
        <h2>Avance de ${esc(estado.perfil ? estado.perfil.nombre : "su hijo")}</h2>
        ${estado.familia ? `<p>Cuenta de ${esc(estado.familia.nombre)} (${esc(estado.familia.correo)}${estado.familia.whatsapp ? ", " + esc(estado.familia.whatsapp) : ""}).</p>` : ""}
        <p>${hechos} de 7 días terminados. ${estado.monedas} monedas, racha de ${estado.racha} ${estado.racha === 1 ? "día" : "días"}.</p>
        ${estado.meta ? `<p>Meta: ${esc(estado.meta.nombre)} de ${estado.meta.precio} dólares. Su hijo ahorra ${estado.meta.hijo} y usted ${estado.meta.padre} al mes.</p>` : ""}
      </div>
      <div class="bloque">
        <h2>Mesada</h2>
        <label class="fila-campo"><span>Monto mensual (dólares)</span><input type="number" min="3" max="1000" id="p-mesada" value="${estado.mesada}" inputmode="numeric"></label>
        <p>Se divide en 3 partes: notas, tareas de la casa y aprender de dinero.</p>
      </div>
      <div class="bloque">
        <h2>Guía de cada día</h2>
        ${DIAS.map((d) => `<div class="guia"><h3><span>Día ${d.dia}: ${esc(d.titulo)}</span>${estado.completados[d.dia] ? `<em>${estado.completados[d.dia].familia ? "Hecho en familia" : "Hecho"}</em>` : ""}</h3><p>${esc(d.guiaPadres)}</p></div>`).join("")}
      </div>
      <div class="bloque">
        <h2>Ajustes</h2>
        <label class="interruptor"><span>Edad: 5 a 7 años (más dibujos y voz)</span><input type="checkbox" id="p-chico" ${chico() ? "checked" : ""}></label>
        <label class="interruptor"><span>Abrir una misión por día</span><input type="checkbox" id="p-unapordia" ${estado.unaPorDia ? "checked" : ""}></label>
        <label class="interruptor"><span>Sonidos</span><input type="checkbox" id="p-sonido" ${estado.sonido ? "checked" : ""}></label>
      </div>
      <div class="bloque">
        <h2>Instalar en el celular</h2>
        <p>En Android: toque el botón o, en Chrome, el menú ⋮ y "Instalar app".</p>
        <p>En iPhone: en Safari, toque Compartir y luego "Agregar a pantalla de inicio".</p>
        <button class="boton boton-secundario" id="p-instalar" ${eventoInstalar ? "" : "hidden"}>Instalar la app</button>
      </div>
      <div class="bloque">
        <h2>Empezar de cero</h2>
        <p>Borra el perfil, las monedas y el avance de este celular.</p>
        <button class="boton boton-secundario" id="p-borrar">Borrar el progreso</button>
      </div>`;
    $("#p-mesada").addEventListener("change", (e) => { estado.mesada = Math.max(3, Math.min(1000, +e.target.value || 30)); guardar(); });
    $("#p-chico").addEventListener("change", (e) => { estado.perfil.edad = e.target.checked ? "chico" : "grande"; guardar(); });
    $("#p-unapordia").addEventListener("change", (e) => { estado.unaPorDia = e.target.checked; guardar(); });
    $("#p-sonido").addEventListener("change", (e) => { estado.sonido = e.target.checked; guardar(); });
    const inst = $("#p-instalar");
    inst.addEventListener("click", async () => { if (!eventoInstalar) return; eventoInstalar.prompt(); eventoInstalar = null; inst.hidden = true; });
    const borrar = $("#p-borrar");
    borrar.addEventListener("click", () => {
      if (borrar.dataset.seguro) {
        estado = Object.assign({}, ESTADO_INICIAL, { vioIntro: true });
        guardar(); ir("registro");
      } else {
        borrar.dataset.seguro = "1"; borrar.textContent = "Toque otra vez para borrar todo";
      }
    });
  }

  /* ---------- Arranque ---------- */
  iniciarRegistro();
  if (estado.vioIntro && estado.perfil) ir("mapa");
  else if (estado.vioIntro) ir("registro");
  else iniciarBienvenida();

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
