# StatBench360

Aplicación web para que el entrenador lleve las **estadísticas y el seguimiento de partidos de Fútbol 11 en tiempo real**: marcador, goles, asistencias, tarjetas, cambios, minutos jugados y cronología. Funciona en el móvil, se puede instalar como app y se usa también **sin cobertura**.

> Los datos (partidos, plantilla e histórico) se guardan **solo en el navegador de cada dispositivo**. Este repositorio contiene únicamente la aplicación: no incluye datos de nadie.

## Funcionalidades

- **Directo:** cronómetro, descanso, marcador y registro rápido de gol, gol rival y tarjeta con un toque.
- **Menú del jugador:** al tocar a un jugador, gol, amarilla, roja, cambio o asistencia.
- **Cambios:** varios cambios en una sola ventana, cambios que no cuentan ventana y **planificador** con aviso (voz, vibración y pantalla).
- **Cronología editable:** editar o borrar cualquier suceso; el marcador y las estadísticas se recalculan solos.
- **Plantilla:** pegar una lista de nombres, subir un archivo o una foto (OCR), o crear jugadores a mano. Cada jugador tiene un **ID permanente**.
- **Vista de campo** (opcional) por formación.
- **Acta:** estadísticas completas, PDF, CSV y **resumen para compartir** por WhatsApp (texto o imagen).
- **Histórico y temporada:** partidos guardados y acumulados por jugador (por ID, no por dorsal), con filtros.
- **Datos:** copias de seguridad completas, copias automáticas, PIN opcional y borrado de datos con aviso previo.
- **Recorrido guiado** para usuarios nuevos, con opción "No mostrar más", y manual integrado (botón **?** de la cabecera).
- **Pantalla encendida y vibración** durante el partido (si el navegador lo permite).

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | La aplicación completa (un solo archivo). La primera línea indica la fecha y hora de generación de la versión. |
| `sw.js` | Service worker: guarda la app en el dispositivo para el uso sin conexión. |
| `manifest.webmanifest` | Permite instalarla como app en el móvil. |
| `icons/` | Iconos de la app. |

Todos deben estar juntos, con `index.html` y `sw.js` en la raíz del repositorio.

## Publicar en GitHub Pages

1. Crea un repositorio **público** (por ejemplo `statbench360`) y sube los archivos anteriores a la raíz.
2. Entra en **Settings → Pages**.
3. En "Build and deployment", elige **Deploy from a branch**, rama **main** y carpeta **/(root)**. Pulsa **Save**.
4. Espera 1–2 minutos. La app quedará en `https://TU_USUARIO.github.io/NOMBRE_DEL_REPOSITORIO/`.

El modo sin conexión necesita una dirección `https://`; GitHub Pages la proporciona. No funciona abriendo `index.html` como archivo local.

## Instalar y usar sin conexión (en cada móvil)

Una sola vez, con Wi-Fi:

1. Abre la dirección de la app en Chrome (Android) o Safari (iPhone).
2. Pulsa el botón **Sin conexión** de la cabecera y luego **Preparar uso sin conexión**. Espera a ver "Lista para usar sin conexión".
3. Instala la app: en Android, "Instalar app" o menú ⋮ → Instalar aplicación; en iPhone, Compartir → Añadir a pantalla de inicio. Ábrela siempre desde ese icono.
4. Opcional: **Preparar lector de fotos** (unos 15 MB) para leer plantillas desde fotos sin conexión.
5. Prueba con el modo avión: debe aparecer **SIN CONEXIÓN** en la cabecera y funcionar el partido.

Sin conexión funcionan el partido, el cronómetro, el histórico, las copias, el PDF y el CSV. La voz depende de las voces instaladas en el móvil y en algunos teléfonos solo funciona con conexión.

## Compartirla con otras personas

Comparte **solo la dirección web**. Cada persona la instala en su móvil y empieza con el histórico vacío, porque los datos viven en su propio dispositivo. No compartas copias descargadas (`.json`) ni plantillas con IDs.

## Actualizar la app

1. Sustituye `index.html` (y `sw.js`) en el repositorio.
2. **Sube el número `VERSION`** en `sw.js` (por ejemplo, de `'v5'` a `'v6'`) para que todos los móviles renueven su copia.
3. Los móviles se actualizan solos al abrir la app con internet. La versión nueva se ve la segunda vez que se abre: basta con cerrarla del todo y volver a abrirla.

Una actualización normal no borra los datos de los usuarios.

## Datos y privacidad

- Todo se guarda en el almacenamiento local del navegador. No se envía nada a ningún servidor.
- Si se borran los datos del navegador o se cambia de móvil, los datos se pierden. Haz **copias completas** de vez en cuando (Inicio → Copia completa) y guárdalas en tu nube o correo.
- Las copias automáticas están en el mismo navegador que el histórico; no sustituyen a una copia descargada.
- El **PIN** es una barrera sencilla para abrir la app; no cifra los datos.
- En iPhone, Safari puede borrar los datos de webs que no se usan en 7 días si la app no está instalada en la pantalla de inicio.

## Problemas típicos

| Síntoma | Solución |
| --- | --- |
| Error 404 al abrir la dirección | Comprueba que `index.html` esté en la raíz y espera unos minutos a que Pages publique. |
| La app se ve sin diseño | Ábrela una vez con internet y prepara el uso sin conexión. |
| "Preparar" dice que faltan recursos | Conéctate a internet y vuelve a pulsarlo. |
| No se actualiza en un móvil | Ciérrala del todo y ábrela con conexión. Como último recurso, haz antes una copia completa y borra los datos del sitio. |

## Tecnología

Archivo único en HTML y JavaScript, sin servidor. Usa Tailwind CSS, Font Awesome, jsPDF y Tesseract.js desde CDN (el modo sin conexión los guarda en el dispositivo).

## Licencia

Licencia **MIT** © 2026 GpM1978. Puedes usar, copiar, modificar y compartir la aplicación, conservando el aviso de autor y la licencia. Se entrega "tal cual", sin garantía de ningún tipo.

El texto completo está en el archivo `LICENSE` del repositorio.
