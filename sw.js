/* StatBench360 - Service Worker (uso sin conexión)
 *
 * - Guarda la propia app (index.html, iconos, manifiesto) y las librerías externas que carga
 *   (Tailwind, Font Awesome, jsPDF, Tesseract, tipografías) para que funcione sin cobertura.
 * - La app se sirve desde la copia local y se actualiza en segundo plano cuando hay red.
 * - Solo se guardan los dominios de la lista CDN_HOSTS. Cualquier otra petición NO se intercepta ni se guarda.
 * - Si cambias algo y quieres forzar que todos los dispositivos renueven sus copias, sube VERSION.
 */
const VERSION = 'v11';
const CACHE_PREFIX = 'statbench360-';
const CACHE = CACHE_PREFIX + VERSION;
const SCOPE = self.registration.scope;
const INDEX_URL = new URL('index.html', SCOPE).href;

// Archivos propios imprescindibles: si alguno falla, la instalación se reintenta
const SHELL = ['index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png']
    .map(p => new URL(p, SCOPE).href);

// Dominios externos permitidos (librerías, tipografías y datos del lector de imágenes)
const CDN_HOSTS = ['cdn.tailwindcss.com', 'cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'unpkg.com',
    'fonts.googleapis.com', 'fonts.gstatic.com', 'tessdata.projectnaptha.com'];

const isAllowedCdn = u => {
    try { const x = new URL(u); return /^https?:$/.test(x.protocol) && CDN_HOSTS.includes(x.hostname); } catch (e) { return false; }
};

const fetchCors = async url => {
    const res = await fetch(new Request(url, { mode: 'cors', credentials: 'omit' }));
    if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + url);
    return res;
};

// Descarga con CORS si es posible; si la web externa no lo permite, hace la petición normal
// (respuesta "opaca": se puede guardar y servir, aunque no se pueda leer). Así nunca se rompe la carga.
const fetchAny = async url => {
    try { return await fetchCors(url); }
    catch (e) { return await fetch(new Request(url, { mode: 'no-cors', credentials: 'omit' })); }
};

// Descarga un recurso externo y, si es una hoja de estilos, también sus fuentes e importaciones
async function fetchAndStore(cache, url, depth) {
    const res = await fetchAny(url);
    await cache.put(url, res.clone());
    if (depth < 2 && /css/i.test(res.headers.get('content-type') || '')) {
        const css = await res.text();
        const refs = new Set();
        for (const m of css.matchAll(/url\(\s*['"]?([^'")\s]+)['"]?\s*\)/g)) {
            if (!m[1].startsWith('data:')) { try { refs.add(new URL(m[1], url).href); } catch (e) { /* url no válida */ } }
        }
        for (const m of css.matchAll(/@import\s+['"]([^'"]+)['"]/g)) {
            try { refs.add(new URL(m[1], url).href); } catch (e) { /* url no válida */ }
        }
        await Promise.allSettled(Array.from(refs).filter(isAllowedCdn).slice(0, 60).map(u => fetchAndStore(cache, u, depth + 1)));
    }
}

// Busca en el index.html guardado las librerías externas y las descarga (mejor esfuerzo)
async function cacheExternalAssets(cache) {
    const indexRes = await cache.match(INDEX_URL);
    if (!indexRes) return;
    const html = await indexRes.text();
    const urls = new Set();
    for (const m of html.matchAll(/<script[^>]+src=["'](https?:\/\/[^"']+)["']/gi)) urls.add(m[1]);
    for (const m of html.matchAll(/<link[^>]+href=["'](https?:\/\/[^"']+)["']/gi)) urls.add(m[1]);
    for (const m of html.matchAll(/@import\s+url\(\s*['"]?(https?:\/\/[^'")\s]+)['"]?\s*\)/gi)) urls.add(m[1]);
    await Promise.allSettled(Array.from(urls).filter(isAllowedCdn).map(u => fetchAndStore(cache, u, 0)));
}

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        await Promise.all(SHELL.map(async url => {
            const res = await fetch(new Request(url, { cache: 'reload' }));
            if (!res.ok) throw new Error('No se pudo guardar ' + url);
            await cache.put(url, res);
        }));
        await cacheExternalAssets(cache).catch(() => {});
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        for (const name of await caches.keys()) {
            if (name.startsWith(CACHE_PREFIX) && name !== CACHE) await caches.delete(name);
        }
        await self.clients.claim();
    })());
});

self.addEventListener('message', event => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
    if (event.data === 'REFRESH_ASSETS') {
        event.waitUntil((async () => {
            const cache = await caches.open(CACHE);
            await Promise.allSettled(SHELL.map(async url => {
                const res = await fetch(new Request(url, { cache: 'reload' }));
                if (res.ok) await cache.put(url, res);
            }));
            await cacheExternalAssets(cache).catch(() => {});
        })());
    }
});

// Archivos propios: se sirve la copia guardada al instante y se actualiza en segundo plano
async function handleOwn(event, req) {
    const cache = await caches.open(CACHE);
    const isNav = req.mode === 'navigate';
    const key = isNav ? INDEX_URL : req.url;
    const cached = await cache.match(key);
    const update = fetch(isNav ? INDEX_URL : req)
        .then(res => { if (res && res.ok) cache.put(key, res.clone()); return res; });
    if (cached) {
        event.waitUntil(update.catch(() => {}));
        return cached;
    }
    try { return await update; }
    catch (e) {
        if (isNav) {
            return new Response('<meta charset="utf-8"><title>StatBench360</title><p style="font-family:sans-serif;padding:2rem">Sin conexión y la app todavía no se ha guardado en este dispositivo. Ábrela una vez con internet.</p>',
                { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
        return Response.error();
    }
}

// Librerías externas: primero la copia guardada; si falta, se descarga y se guarda
async function handleCdn(req) {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req.url, { ignoreVary: true });
    if (cached) return cached;
    try {
        const res = await fetchAny(req.url);
        cache.put(req.url, res.clone()).catch(() => {});
        return res;
    } catch (e) { return Response.error(); }
}

self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin === self.location.origin) {
        if (url.pathname.endsWith('/sw.js')) return;
        event.respondWith(handleOwn(event, req));
    } else if (isAllowedCdn(req.url)) {
        event.respondWith(handleCdn(req));
    }
});
