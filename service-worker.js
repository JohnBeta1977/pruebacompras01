const CACHE_NAME = 'mi-tienda-pwa-v2'; // Incrementamos la versión para forzar una nueva caché
const urlsToCache = [
    '/pruebacompras01/', // Ruta base de tu repositorio GitHub Pages
    '/pruebacompras01/index.html',
    '/pruebacompras01/style.css',
    '/pruebacompras01/script.js',
    '/pruebacompras01/logo.png', // Único logo para favicon e íconos PWA
    '/pruebacompras01/fondo.jpg', // Tu imagen de fondo
    '/pruebacompras01/manifest.json',
    // Imágenes de productos (asegúrate de que estas rutas sean exactas y los archivos existan en la raíz)
    '/pruebacompras01/productos_oferta1.jpg',
    '/pruebacompras01/productos_oferta1_alt1.jpg',
    '/pruebacompras01/productos_oferta1_alt2.jpg',
    '/pruebacompras01/productos_oferta2.jpg',
    '/pruebacompras01/productos_categoria1_producto1.jpg',
    '/pruebacompras01/productos_categoria1_producto1_alt1.jpg',
    // Agrega aquí todas las demás imágenes, videos, y assets que uses en tu página y que estén en la raíz
    // Por ejemplo:
    // '/pruebacompras01/video_cafetera.mp4',
    // '/pruebacompras01/productos_oferta3.jpg',
    // '/pruebacompras01/video_dron.mp4',
    // etc.
];

// Instalación del Service Worker: Cacha los recursos estáticos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Cacheando archivos estáticos');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Error al cachear archivos:', error);
            })
    );
});

// Activación del Service Worker: Limpia cachés antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Eliminando caché antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Estrategia de red: Cache-first para recursos estáticos, Network-first para todo lo demás
self.addEventListener('fetch', event => {
    // Para las URLs que ya están en caché (recursos estáticos), intenta responder desde la caché primero
    // Si no está en caché, va a la red y luego lo guarda en caché para futuras solicitudes
    if (urlsToCache.some(url => event.request.url.includes(url.replace('/pruebacompras01/', '')))) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response; // Si está en caché, devuelve la versión cacheada
                    }
                    return fetch(event.request).then(response => {
                        // Si no está en caché, va a la red y luego lo clona para cachear
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
                })
                .catch(error => {
                    console.error('Service Worker: Fallo en el fetch (cache-first):', error);
                    // Aquí podrías servir una página offline si lo deseas
                })
        );
    } else {
        // Para todas las demás solicitudes (ej. APIs, enlaces externos), usa network-first
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    return networkResponse;
                })
                .catch(() => {
                    // Si la red falla para estos recursos, intenta servir desde la caché
                    return caches.match(event.request);
                })
        );
    }
});
