const CACHE_NAME = 'tiendaonline-cache-v4'; // ¡IMPORTANTE: Incrementa la versión cada vez que cambies los archivos a cachear!
const urlsToCache = [
    './',
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    'fondo.jpg',
    'logo.png',
    'favicon.png', // Asegúrate de que esta ruta sea correcta
    // Iconos PWA (asegúrate de que todas estas imágenes existan)
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
    // Si tienes una imagen de poster para el video de la cafetera (video_cafetera.jpg), añádela aquí
    'productos_oferta3.jpg',
    'productos_oferta3_alt1.jpg',
    // Si tienes una imagen de poster para el video del dron (video_dron.jpg), añádela aquí
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
    'placeholder.jpg', // Si usas una imagen de placeholder
    // Iconos de redes sociales del footer (si existen)
    'facebook.png',
    'instagram.png',
    'twitter.png',
    // **NUEVOS VIDEOS** - ¡Verifica que estos archivos existan en la raíz!
    'video_cafetera.mp4',
    'video_dron.mp4',
    // URLs de Google Fonts (pueden variar, verifica las que realmente se cargan en tu navegador si hay problemas)
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-I-rkPt5FzO5S_JusyYv9tX_s.woff2',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap',
    'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JPXPjOcFVFSA.woff2',
    'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2'
];

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
    self.skipWaiting(); // Fuerza la activación del nuevo Service Worker
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
    return self.clients.claim(); // Toma el control de las pestañas existentes
});

// Evento de fetch: estrategia de caché primero, luego red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; // Si está en caché, lo devuelve
                }
                // Si no está en caché, intenta obtenerlo de la red
                return fetch(event.request)
                    .then((fetchResponse) => {
                        // Verifica si la respuesta es válida antes de cachearla
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }
                        // Clona la respuesta para que pueda ser leída tanto por el navegador como por el caché
                        const responseToCache = fetchResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return fetchResponse;
                    })
                    .catch(() => {
                        // Si falla la red y es una solicitud de navegación, devuelve index.html desde caché
                        if (event.request.mode === 'navigate') {
                             return caches.match('index.html');
                        }
                        // Para otros recursos, devuelve una respuesta de error o un fallback específico
                        return new Response('Contenido offline no disponible.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
                    });
            })
    );
});
