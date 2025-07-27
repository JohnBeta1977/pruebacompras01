const CACHE_NAME = 'tiendaonline-cache-v2'; // Incrementa la versión del caché para forzar la actualización
const urlsToCache = [
    './',
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    'fondo.jpg',
    'logo.png',
    // Iconos PWA
    'icon-72x72.png',
    'icon-96x96.png',
    'icon-128x128.png',
    'icon-144x144.png',
    'icon-152x152.png',
    'icon-192x192.png',
    'icon-384x384.png',
    'icon-512x512.png',
    // Imágenes de productos (asegúrate de que todas estén aquí)
    'productos_oferta1.jpg',
    'productos_oferta1_alt1.jpg',
    'productos_oferta1_alt2.jpg',
    'productos_oferta2.jpg',
    'productos_oferta2_alt1.jpg',
    'productos_oferta3.jpg',
    'productos_oferta3_alt1.jpg',
    'productos_oferta4.jpg',
    'productos_oferta4_alt1.jpg',
    'productos_oferta5.jpg',
    'productos_oferta5_alt1.jpg',
    'productos_oferta6.jpg',
    'productos_oferta6_alt1.jpg',
    'productos_categoria1_producto1.jpg',
    'productos_categoria1_producto1_alt1.jpg',
    'productos_categoria1_producto2.jpg',
    'productos_categoria1_producto2_alt1.jpg',
    'productos_categoria1_producto3.jpg',
    'productos_categoria1_producto3_alt1.jpg',
    'productos_categoria1_producto4.jpg',
    'productos_categoria1_producto4_alt1.jpg',
    'productos_categoria1_producto5.jpg',
    'productos_categoria1_producto5_alt1.jpg',
    'productos_categoria1_producto6.jpg',
    'productos_categoria1_producto6_alt1.jpg',
    'productos_categoria2_producto1.jpg',
    'productos_categoria2_producto1_alt1.jpg',
    'productos_categoria2_producto2.jpg',
    'productos_categoria2_producto2_alt1.jpg',
    'productos_categoria2_producto3.jpg',
    'productos_categoria2_producto3_alt1.jpg',
    'productos_categoria2_producto4.jpg',
    'productos_categoria2_producto4_alt1.jpg',
    'productos_categoria2_producto5.jpg',
    'productos_categoria2_producto5_alt1.jpg',
    'productos_categoria2_producto6.jpg',
    'productos_categoria2_producto6_alt1.jpg',
    'productos_categoria3_producto1.jpg',
    'productos_categoria3_producto1_alt1.jpg',
    'productos_categoria3_producto2.jpg',
    'productos_categoria3_producto2_alt1.jpg',
    'productos_categoria3_producto3.jpg',
    'productos_categoria3_producto3_alt1.jpg',
    'productos_categoria3_producto4.jpg',
    'productos_categoria3_producto4_alt1.jpg',
    'productos_categoria3_producto5.jpg',
    'productos_categoria3_producto5_alt1.jpg',
    'productos_categoria3_producto6.jpg',
    'productos_categoria3_producto6_alt1.jpg',
    'productos_categoria4_producto1.jpg',
    'productos_categoria4_producto1_alt1.jpg',
    'productos_categoria4_producto2.jpg',
    'productos_categoria4_producto2_alt1.jpg',
    'productos_categoria4_producto3.jpg',
    'productos_categoria4_producto3_alt1.jpg',
    'productos_categoria4_producto4.jpg',
    'productos_categoria4_producto4_alt1.jpg',
    'productos_categoria4_producto5.jpg',
    'productos_categoria4_producto5_alt1.jpg',
    'productos_categoria4_producto6.jpg',
    'productos_categoria4_producto6_alt1.jpg',
    'placeholder.jpg',
    // **NUEVOS VIDEOS** - Asegúrate de que los nombres coincidan con los de `script.js`
    'video_cafetera.mp4',
    'video_dron.mp4',
    // Si tienes imágenes de poster para los videos, también cachalas:
    // 'video_cafetera.jpg',
    // 'video_dron.jpg',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-I-rkPt5FzO5S_JusyYv9tX_s.woff2',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap',
    'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JPXPjOcFVFSA.woff2',
    'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JPXPjOcFVFSA.woff2'
];

// ... (El resto del código del Service Worker permanece igual) ...

// Evento de instalación: cachea los archivos estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cacheando archivos estáticos');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Fallo al cachear', error);
            })
    );
    self.skipWaiting();
});

// Evento de activación: limpia cachés antiguas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando caché antigua', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Evento de fetch: estrategia de caché primero, luego red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then((fetchResponse) => {
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }
                        const responseToCache = fetchResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return fetchResponse;
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                             return caches.match('index.html');
                        }
                        return new Response('Offline content unavailable.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
                    });
            })
    );
});
