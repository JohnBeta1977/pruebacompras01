const CACHE_NAME = 'comprasymas-v1';
const urlsToCache = [
    './',
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    'favicon.ico',
    'https://github.com/JohnBeta1977/pruebacompras01/blob/main/logo.png?raw=true', // Logo desde GitHub
    'img/hero-bg.jpg', // Imagen de fondo del héroe (asegúrate de que exista)

    // Iconos de la PWA (asegúrate de que estos archivos existan en img/icons/)
    'img/icons/icon-72x72.png',
    'img/icons/icon-96x96.png',
    'img/icons/icon-128x128.png',
    'img/icons/icon-144x144.png',
    'img/icons/icon-152x152.png',
    'img/icons/icon-192x192.png',
    'img/icons/icon-384x384.png',
    'img/icons/icon-512x512.png',

    // Imágenes de productos (asegúrate de que todas estas existan en productos/)
    // Ofertas
    'productos/oferta_producto1.jpg',
    'productos/oferta_producto1_alt1.jpg',
    'productos/oferta_producto1_alt2.jpg',
    'productos/oferta_producto2.jpg',
    'productos/oferta_producto2_alt1.jpg',
    'productos/oferta_producto3.jpg',
    'productos/oferta_producto3_alt1.jpg',
    'productos/oferta_producto4.jpg',
    'productos/oferta_producto4_alt1.jpg',
    'productos/oferta_producto5.jpg',
    'productos/oferta_producto5_alt1.jpg',
    'productos/oferta_producto6.jpg',
    'productos/oferta_producto6_alt1.jpg',
    // Categoria 1
    'productos/categoria1_producto1.jpg',
    'productos/categoria1_producto1_alt1.jpg',
    'productos/categoria1_producto2.jpg',
    'productos/categoria1_producto2_alt1.jpg',
    'productos/categoria1_producto3.jpg',
    'productos/categoria1_producto3_alt1.jpg',
    'productos/categoria1_producto4.jpg',
    'productos/categoria1_producto4_alt1.jpg',
    'productos/categoria1_producto5.jpg',
    'productos/categoria1_producto5_alt1.jpg',
    'productos/categoria1_producto6.jpg',
    'productos/categoria1_producto6_alt1.jpg',
    // Categoria 2
    'productos/categoria2_producto1.jpg',
    'productos/categoria2_producto1_alt1.jpg',
    'productos/categoria2_producto2.jpg',
    'productos/categoria2_producto2_alt1.jpg',
    'productos/categoria2_producto3.jpg',
    'productos/categoria2_producto3_alt1.jpg',
    'productos/categoria2_producto4.jpg',
    'productos/categoria2_producto4_alt1.jpg',
    'productos/categoria2_producto5.jpg',
    'productos/categoria2_producto5_alt1.jpg',
    'productos/categoria2_producto6.jpg',
    'productos/categoria2_producto6_alt1.jpg',
    // Categoria 3
    'productos/categoria3_producto1.jpg',
    'productos/categoria3_producto1_alt1.jpg',
    'productos/categoria3_producto2.jpg',
    'productos/categoria3_producto2_alt1.jpg',
    'productos/categoria3_producto3.jpg',
    'productos/categoria3_producto3_alt1.jpg',
    'productos/categoria3_producto4.jpg',
    'productos/categoria3_producto4_alt1.jpg',
    'productos/categoria3_producto5.jpg',
    'productos/categoria3_producto5_alt1.jpg',
    'productos/categoria3_producto6.jpg',
    'productos/categoria3_producto6_alt1.jpg',
    // Categoria 4
    'productos/categoria4_producto1.jpg',
    'productos/categoria4_producto1_alt1.jpg',
    'productos/categoria4_producto2.jpg',
    'productos/categoria4_producto2_alt1.jpg',
    'productos/categoria4_producto3.jpg',
    'productos/categoria4_producto3_alt1.jpg',
    'productos/categoria4_producto4.jpg',
    'productos/categoria4_producto4_alt1.jpg',
    'productos/categoria4_producto5.jpg',
    'productos/categoria4_producto5_alt1.jpg',
    'productos/categoria4_producto6.jpg',
    'productos/categoria4_producto6_alt1.jpg',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No hay respuesta en caché, ir a la red
                return fetch(event.request).then(
                    (response) => {
                        // Comprobar si recibimos una respuesta válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // IMPORTANTE: Clonar la respuesta. Una respuesta es un stream
                        // y solo puede ser consumida una vez. Como queremos que el
                        // navegador la consuma y el cache la consuma, necesitamos clonarla.
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    }
                );
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Eliminar caches viejos
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
