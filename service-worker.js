const CACHE_NAME = 'mi-tienda-pwa-v4'; // ¡Incrementamos la versión para forzar una nueva caché!
const urlsToCache = [
    '/pruebacompras01/', // Ruta base de tu repositorio GitHub Pages (si aplica)
    '/pruebacompras01/index.html',
    '/pruebacompras01/style.css',
    '/pruebacompras01/script.js',
    '/pruebacompras01/logo.png', // Único logo para favicon e íconos PWA
    '/pruebacompras01/fondo.jpg', // Tu imagen de fondo
    '/pruebacompras01/manifest.json',
    
    // Material Icons (ya están en CDN, no necesitan cacheo local, pero si quieres precargarlos puedes)
    // 'https://fonts.googleapis.com/icon?family=Material+Icons',
    // 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Roboto:wght@300;400;500;700&display=swap',

    // Imágenes de productos - DEBEN ESTAR EN LA RAÍZ DE TU REPOSITORIO
    '/pruebacompras01/productos_oferta1.jpg',
    '/pruebacompras01/productos_oferta1_alt1.jpg',
    '/pruebacompras01/productos_oferta1_alt2.jpg',
    '/pruebacompras01/productos_oferta2.jpg',
    '/pruebacompras01/productos_categoria1_producto1.jpg', // Si esta imagen se usa en algún lado, cachearla
    '/pruebacompras01/productos_categoria1_producto1_alt1.jpg', // Si esta imagen se usa en algún lado, cachearla
    
    // Imágenes de las secciones de beneficios si las tuvieras (aunque ahora usamos iconos de Material Design)
    // Si todavía usas imagenes para envio_gratis, pago_seguro, soporte_24_7, ponlas aquí:
    // '/pruebacompras01/envio_gratis.png', 
    // '/pruebacompras01/pago_seguro.png',
    // '/pruebacompras01/soporte_24_7.png',

    // Imágenes de Categorías (si fueran imágenes y no solo colores)
    // '/pruebacompras01/electronica.jpg', // Ya no se usan como imágenes de fondo de categoría
    // '/pruebacompras01/moda.jpg',
    // '/pruebacompras01/hogar.jpg',
    // '/pruebacompras01/deportes.jpg'

    // Agrega aquí CUALQUIER otra imagen, video o recurso que uses y quieras que se cachee para offline.
    // Asegúrate de que las rutas coincidan con la ubicación real de tus archivos.
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
        // Normaliza las rutas para una comparación correcta (elimina el prefijo del repositorio)
        const cleanedRequestPathname = requestUrl.pathname.replace('/pruebacompras01/', '/');
        const cleanedCachePathname = cacheUrl.replace('/pruebacompras01/', '/');
        return cleanedRequestPathname === cleanedCachePathname;
    });

    // Manejar solo solicitudes GET para evitar problemas con POST u otros métodos
    if (event.request.method === 'GET' && isCacheableAsset) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response; // Si está en caché, devuelve la versión cacheada
                    }
                    // Si no está en caché, va a la red y luego lo guarda en caché
                    return fetch(event.request).then(response => {
                        // Verifica que la respuesta sea válida antes de cachearla
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
                    // return caches.match('/pruebacompras01/offline.html'); // Ejemplo de página offline
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
                    // Esto es útil para recursos no críticos o si se desea un fallback general
                    return caches.match(event.request);
                })
        );
    }
});
