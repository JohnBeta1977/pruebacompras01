const CACHE_NAME = 'mi-tienda-pwa-v3'; // Incrementamos la versión para forzar una nueva caché
const urlsToCache = [
    '/pruebacompras01/', // Ruta base de tu repositorio GitHub Pages (si aplica)
    '/pruebacompras01/index.html',
    '/pruebacompras01/style.css',
    '/pruebacompras01/script.js',
    '/pruebacompras01/logo.png', // Único logo para favicon e íconos PWA
    '/pruebacompras01/fondo.jpg', // Tu imagen de fondo
    '/pruebacompras01/manifest.json',
    // Íconos del menú (Flaticon) - DEBEN ESTAR EN LA RAÍZ DE TU REPOSITORIO
    '/pruebacompras01/home.png',
    '/pruebacompras01/products.png',
    '/pruebacompras01/categories.png',
    '/pruebacompras01/faq.png',
    '/pruebacompras01/contact.png',
    '/pruebacompras01/facebook.png',
    '/pruebacompras01/instagram.png',
    '/pruebacompras01/twitter.png',
    '/pruebacompras01/envio_gratis.png',
    '/pruebacompras01/pago_seguro.png',
    '/pruebacompras01/soporte_24_7.png',
    // Imágenes de productos - DEBEN ESTAR EN LA RAÍZ DE TU REPOSITORIO
    '/pruebacompras01/productos_oferta1.jpg',
    '/pruebacompras01/productos_oferta1_alt1.jpg',
    '/pruebacompras01/productos_oferta1_alt2.jpg',
    '/pruebacompras01/productos_oferta2.jpg',
    '/pruebacompras01/productos_categoria1_producto1.jpg',
    '/pruebacompras01/productos_categoria1_producto1_alt1.jpg',
    // Imágenes de Categorías - DEBEN ESTAR EN LA RAÍZ DE TU REPOSITORIO
    '/pruebacompras01/electronica.jpg',
    '/pruebacompras01/moda.jpg',
    '/pruebacompras01/hogar.jpg',
    '/pruebacompras01/deportes.jpg'
    // Agrega aquí CUALQUIER otra imagen, video o recurso que uses y quieras que se cachee para offline.
    // Ejemplo: '/pruebacompras01/video_cafetera.mp4',
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
    // Verifica si la solicitud es una de nuestras URLs a cachear
    const requestUrl = new URL(event.request.url);
    const isCacheableAsset = urlsToCache.some(cacheUrl => {
        // Elimina el prefijo del repositorio para la comparación si la URL de la solicitud lo tiene
        const cleanedCacheUrl = cacheUrl.replace('/pruebacompras01/', '');
        return requestUrl.pathname.includes(cleanedCacheUrl);
    });

    if (isCacheableAsset) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response; // Si está en caché, devuelve la versión cacheada
                    }
                    // Si no está en caché, va a la red y luego lo guarda en caché
                    return fetch(event.request).then(response => {
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
                    // Aquí podrías servir una página offline genérica si es necesario
                })
        );
    } else {
        // Para todas las demás solicitudes (ej. APIs externas, etc.), usa network-first
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
