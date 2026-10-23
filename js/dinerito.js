/* Dinerito: la mascota de Hijos Prósperos.
   Es una moneda dorada con cara, brazos y piernas.
   dinerito(pose, tamaño) devuelve el dibujo (SVG) listo para poner en la página.
   Poses: "feliz", "celebrando", "pensando", "saludando". */

const DINERITO_COLORES = {
  oro: "#FFB81C",
  oroOscuro: "#E89A00",
  borde: "#ED480F",
  navy: "#170B5B",
  cielo: "#2D8EBB",
  mejilla: "#FF8A5C",
};

function dinerito(pose = "feliz", tam = 160) {
  const c = DINERITO_COLORES;
  const brazos = {
    feliz: `
      <path d="M30 120 q-10 6 -13 18" class="extremidad" stroke="${c.navy}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M170 120 q10 6 13 18" class="extremidad" stroke="${c.navy}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle class="extremidad" cx="17" cy="138" r="8" fill="${c.navy}"/><circle class="extremidad" cx="183" cy="138" r="8" fill="${c.navy}"/>`,
    celebrando: `
      <path d="M32 86 q-10 -14 -12 -40" class="extremidad" stroke="${c.navy}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M168 86 q10 -14 12 -40" class="extremidad" stroke="${c.navy}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle class="extremidad" cx="20" cy="46" r="8" fill="${c.navy}"/><circle class="extremidad" cx="180" cy="46" r="8" fill="${c.navy}"/>
      <g fill="${c.borde}"><path d="M14 18 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4z"/><path d="M186 12 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"/></g>
      <g fill="${c.cielo}"><circle cx="40" cy="20" r="4"/><circle cx="164" cy="28" r="4"/></g>`,
    pensando: `
      <path d="M30 120 q-10 6 -13 18" class="extremidad" stroke="${c.navy}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle class="extremidad" cx="17" cy="138" r="8" fill="${c.navy}"/>
      <path d="M164 132 q-10 18 -38 12" class="extremidad" stroke="${c.navy}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle class="extremidad" cx="124" cy="142" r="9" fill="${c.navy}"/>
      <g fill="${c.cielo}"><circle cx="176" cy="40" r="6"/><circle cx="188" cy="22" r="9"/></g>`,
    saludando: `
      <path d="M30 120 q-10 6 -13 18" class="extremidad" stroke="${c.navy}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle class="extremidad" cx="17" cy="138" r="8" fill="${c.navy}"/>
      <g class="brazo-saludo">
        <path d="M170 100 q12 -10 8 -48" class="extremidad" stroke="${c.navy}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <circle class="extremidad" cx="178" cy="52" r="9" fill="${c.navy}"/>
      </g>`,
  }[pose] || "";

  const ojos =
    pose === "pensando"
      ? `<ellipse cx="80" cy="92" rx="8" ry="10" fill="${c.navy}"/><ellipse cx="120" cy="92" rx="8" ry="10" fill="${c.navy}"/>
         <circle cx="83" cy="86" r="3" fill="#fff"/><circle cx="123" cy="86" r="3" fill="#fff"/>`
      : pose === "celebrando"
      ? `<path d="M70 94 q10 -12 20 0" stroke="${c.navy}" stroke-width="6" fill="none" stroke-linecap="round"/>
         <path d="M110 94 q10 -12 20 0" stroke="${c.navy}" stroke-width="6" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="80" cy="94" rx="8" ry="10" fill="${c.navy}"/><ellipse cx="120" cy="94" rx="8" ry="10" fill="${c.navy}"/>
         <circle cx="83" cy="90" r="3" fill="#fff"/><circle cx="123" cy="90" r="3" fill="#fff"/>`;

  const boca =
    pose === "pensando"
      ? `<ellipse cx="104" cy="124" rx="7" ry="6" fill="${c.navy}"/>`
      : pose === "celebrando"
      ? `<path d="M82 116 q18 26 36 0 z" fill="${c.navy}"/><path d="M90 124 q10 8 20 0" fill="${c.borde}"/>`
      : `<path d="M84 118 q16 16 32 0" stroke="${c.navy}" stroke-width="5" fill="none" stroke-linecap="round"/>`;

  return `
  <svg class="dinerito dinerito-${pose}" data-pose="${pose}" width="${tam}" height="${tam * 1.1}" viewBox="0 0 200 220" role="img" aria-label="Dinerito">
    <path d="M78 176 v22 h-12" class="extremidad" stroke="${c.navy}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M122 176 v22 h12" class="extremidad" stroke="${c.navy}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="100" cy="104" r="76" fill="${c.borde}"/>
    <circle cx="100" cy="104" r="68" fill="${c.oro}"/>
    <circle cx="100" cy="104" r="58" fill="none" stroke="${c.oroOscuro}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>
    <path d="M52 70 a56 56 0 0 1 40 -30" stroke="#fff" stroke-opacity=".6" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M62 46 q38 -44 76 0 z" fill="${c.cielo}"/><rect x="100" y="40" width="50" height="9" rx="4.5" fill="${c.navy}"/><circle cx="100" cy="22" r="6" fill="${c.borde}"/>
    ${brazos}
    <g class="ojos">${ojos}</g>
    <circle cx="66" cy="114" r="7" fill="${c.mejilla}" opacity=".55"/>
    <circle cx="134" cy="114" r="7" fill="${c.mejilla}" opacity=".55"/>
    ${boca}
  </svg>`;
}
