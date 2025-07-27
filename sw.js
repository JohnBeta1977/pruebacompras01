const CACHE_NAME = 'tiendaonline-cache-v1';
const urlsToCache = [
    './', // Esto es crucial para la página de inicio
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    'fondo.jpg', // La nueva imagen de fondo
    'logo.png', // Tu logo
    // Iconos para PWA (asegúrate de que existan)
    'icon-72x72.png',
    'icon-96x96.png',
    'icon-128x128.png',
    'icon-144x144.png',
    'icon-152x152.png',
    'icon-192x192.png',
    'icon-384x384.png',
    'icon-512x512.png',
    // Imágenes de productos - renombra estas a lo que tengas en tu carpeta raíz
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
    'placeholder.jpg', // Si usas una imagen de placeholder
    'https://fonts.googleapis.com/icon?family=Material+Icons', // Íconos de Material Design
    'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-I-rkPt5FzO5S_JusyYv9tX_s.woff2', // Cachear la fuente real de los íconos
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Roboto:wght@300;400;500&display=swap', // Cachear las fuentes de Google Fonts
    'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JPXPjOcFVFSA.woff2', // Ejemplo de fuente Poppins
    'https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JPXPjOcFVFSA.woff2', // Ejemplo de fuente Roboto
    // Añade aquí cualquier otro activo que quieras cachear (videos, otros CSS/JS externos)
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
    self.skipWaiting(); // Fuerza la activación del nuevo Service Worker inmediatamente
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
    // Asegura que el Service Worker tome el control de los clientes existentes
    return self.clients.claim();
});

// Evento de fetch: estrategia de caché primero, luego red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si está en caché, lo devuelve
                if (response) {
                    return response;
                }
                // Si no, intenta obtenerlo de la red
                return fetch(event.request)
                    .then((fetchResponse) => {
                        // Si la respuesta de la red es válida, la cachea y la devuelve
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
                        // Opcional: Si falla la red, puedes servir una página offline
                        // Por ejemplo, si un archivo crucial como index.html no está disponible
                        if (event.request.mode === 'navigate') {
                             return caches.match('index.html'); // O una página offline.html si la tuvieras
                        }
                        return new Response('Offline content unavailable.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
                    });
            })
    );
});
