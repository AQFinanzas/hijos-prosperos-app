# App Hijos Prósperos

Manual de la app, en lenguaje sencillo. Si algún día otra persona tiene que trabajar en la app, debe empezar por aquí.

## Qué es

Es la app de educación financiera de **Hijos Prósperos** para niños de 5 a 13 años. Dinerito, la mascota, los guía por un mapa de islas con misiones cortas, monedas, rachas e insignias.

Esta primera versión (prototipo) tiene los **7 días gratis** de la Isla del Dinero, que salen del Módulo 5 del curso "Programa Hijos Prósperos".

- Dueño: Alejandro A. Quiñones Y. (info@aqfinanzas.com)
- Dirección pública: https://aqfinanzas.github.io/hijos-prosperos-app/

## Cómo se usa

1. Abrir la dirección en el celular, la tablet o la computadora.
2. Papá o mamá escribe sus datos (nombre, correo y WhatsApp opcional) y luego crea el perfil del niño: nombre, edad (5–7 o 8–13) y color.
3. El niño juega una misión por día desde el mapa.
4. El botón **Papá y mamá** abre el panel de padres. Pide resolver una multiplicación para que el niño no entre solo.

**Para instalarla con ícono:**
- Android: en Chrome, menú ⋮ → "Instalar app".
- iPhone y iPad: en Safari, botón Compartir → "Agregar a pantalla de inicio".
- Computadora: en Chrome, el ícono de instalar en la barra de direcciones.

## Cómo está armada

Es una página web normal (HTML, CSS y JavaScript), sin programas extra que instalar. Cualquier programador web la entiende.

| Archivo | Qué tiene |
| --- | --- |
| `index.html` | Las pantallas: bienvenida con Dinerito, registro, mapa, misión, insignias, fin y panel de padres |
| `css/app.css` | El diseño. Los colores de la marca están al inicio del archivo |
| `js/contenido.js` | **Todo el texto de las misiones.** Para cambiar una frase, se cambia aquí |
| `js/app.js` | Cómo funciona: misiones, monedas, racha, insignias y panel de padres |
| `js/dinerito.js` | El dibujo de Dinerito en sus 4 poses |
| `sw.js` | Hace que la app abra rápido y funcione sin internet |
| `manifest.webmanifest` | El nombre y el ícono que se ven al instalarla |
| `assets/` | Logo, patrón de fondo e íconos |
| `docs/` | Decisiones, marca, mapa de niveles y cuentas |

**Dónde se guarda el progreso y los datos de la familia:** por ahora, en el mismo dispositivo (localStorage). Todavía no se envían a ninguna base de datos. La próxima versión los guardará en una base de datos con cuenta de familia y los correos llegarán a la lista de Hijos Prósperos.

**Audio:** Dinerito lee los textos con la voz en español del dispositivo (función gratuita del navegador). Más adelante se puede reemplazar por audios grabados o una voz de IA más natural.

## Cómo se publica un cambio

1. Cambiar el archivo en este repositorio (desde GitHub o con Claude).
2. Si se cambió cualquier archivo, subir el número de `VERSION` en `sw.js` (por ejemplo, de `hp-v1` a `hp-v2`). Así los celulares bajan la versión nueva.
3. Guardar el cambio (commit) en la rama `main`. GitHub Pages lo publica solo en 1 o 2 minutos.
4. Anotar el cambio en `CHANGELOG.md`.

## Si algo falla

- **La app no abre o se ve vieja:** revisar que GitHub Pages esté activo (Settings → Pages → rama `main`). Subir la `VERSION` de `sw.js`.
- **Se rompió después de un cambio:** en GitHub, ir a "Commits", buscar el último que funcionaba y revertir el cambio con "Revert".
- **Los niños perdieron su progreso:** en esta versión el progreso vive en cada dispositivo; no hay copia en la nube todavía.

## Documentos

- [docs/decisiones.md](docs/decisiones.md): qué se decidió y por qué.
- [docs/mapa-de-niveles.md](docs/mapa-de-niveles.md): los 7 días, el mes 1 y las temporadas.
- [docs/marca.md](docs/marca.md): colores, letras y Dinerito.
- [docs/cuentas.md](docs/cuentas.md): dónde vive cada cosa y a nombre de quién.
- [CHANGELOG.md](CHANGELOG.md): bitácora de cambios.
