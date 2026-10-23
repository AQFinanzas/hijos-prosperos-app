/* Guarda la app en el celular para que abra rápido y funcione sin internet.
   Cada vez que se publique un cambio, subir el número de VERSION. */
const VERSION = "hp-v5";
const ARCHIVOS = [
  "./", "index.html", "css/app.css", "js/app.js", "js/contenido.js", "js/dinerito.js",
  "manifest.webmanifest", "assets/img/logo-hp.png", "assets/img/patron-azul.png",
  "assets/img/icono-192.png", "assets/img/icono-512.png"
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then((r) => {
      const copia = r.clone();
      if (r.ok && new URL(e.request.url).origin === location.origin) caches.open(VERSION).then((c) => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
