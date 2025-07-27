document.addEventListener('DOMContentLoaded', () => {
    // --- Splash Screen ---
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('hidden');
        }, 1500); // 1.5 segundos
    }

    // --- Menú Deslizable Móvil y Cerrar al Tocar Fuera ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que el clic en el botón se propague y cierre el menú
            mainNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll', mainNav.classList.contains('active'));
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        // Cerrar menú al hacer clic fuera de él
        document.addEventListener('click', (event) => {
            // Si el menú está abierto y el clic no fue dentro del menú ni en el botón de toggle
            if (mainNav.classList.contains('active') && !mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                mainNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // --- Lógica del Modal de Producto y Slider ---
    const productModal = document.getElementById('product-modal');
    const closeButton = document.querySelector('.modal .close-button');
    const galleryMainImageContainer = document.querySelector('.gallery-main-image');
    const modalProductTitle = document.getElementById('modal-product-title');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalBuyButton = document.getElementById('modal-buy-btn');
    const modalShareButton = document.getElementById('modal-share-btn');
    const galleryThumbnails = document.getElementById('modal-product-thumbnails');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');

    let currentMediaIndex = 0;
    let productMedia = [];

    // Datos de productos (se mantiene igual, ya está actualizado con media)
    const productsData = {
        'oferta1': {
            name: 'Smart TV 4K 50"',
            description: 'Disfruta de una calidad de imagen inmersiva y funciones inteligentes. Conexión Wi-Fi y múltiples puertos HDMI.',
            price: '$999.000 COP',
            originalPrice: '$1.500.000 COP',
            media: [
                { src: 'productos_oferta1.jpg', type: 'image' },
                { src: 'productos_oferta1_alt1.jpg', type: 'image' },
                { src: 'productos_oferta1_alt2.jpg', type: 'image' }
            ]
        },
        'oferta2': {
            name: 'Cafetera Programable',
            description: 'Prepara tu café favorito a la hora deseada. Capacidad para 12 tazas y función de mantenimiento de calor.',
            price: '$140.000 COP',
            originalPrice: '$200.000 COP',
            media: [
                { src: 'productos_oferta2.jpg', type: 'image' },
                { src: 'video_cafetera.mp4', type: 'video' }
            ]
        },
        'oferta3': {
            name: 'Dron con Cámara HD',
            description: 'Explora los cielos con este dron fácil de volar y captura videos en alta definición. Ideal para principiantes y entusiastas.',
            price: '$320.000 COP',
            originalPrice: '$450.000 COP',
            media: [
                { src: 'productos_oferta3.jpg', type: 'image' },
                { src: 'productos_oferta3_alt1.jpg', type: 'image' },
                { src: 'video_dron.mp4', type: 'video' }
            ]
        },
        'oferta4': {
            name: 'Mochila Antirrobo USB',
            description: 'Diseño seguro y compartimento para laptop con puerto USB integrado. Perfecta para viajes y uso diario en la ciudad.',
            price: '$65.000 COP',
            originalPrice: '$90.000 COP',
            media: [
                { src: 'productos_oferta4.jpg', type: 'image' },
                { src: 'productos_oferta4_alt1.jpg', type: 'image' }
            ]
        },
        'oferta5': {
            name: 'Auriculares Gaming RGB',
            description: 'Sumérgete en tus juegos con sonido envolvente y luces RGB personalizables. Micrófono retráctil de alta calidad.',
            price: '$100.000 COP',
            originalPrice: '$150.000 COP',
            media: [
                { src: 'productos_oferta5.jpg', type: 'image' },
                { src: 'productos_oferta5_alt1.jpg', type: 'image' }
            ]
        },
        'oferta6': {
            name: 'Set de Cuchillos de Cocina Profesional',
            description: 'Cuchillos de acero inoxidable de alta precisión para todas tus necesidades culinarias. Mango ergonómico.',
            price: '$85.000 COP',
            originalPrice: '$120.000 COP',
            media: [
                { src: 'productos_oferta6.jpg', type: 'image' },
                { src: 'productos_oferta6_alt1.jpg', type: 'image' }
            ]
        },
        'elec1': {
            name: 'Auriculares Inalámbricos',
            description: 'Sonido de alta fidelidad, cómodos y con gran autonomía de batería. Perfectos para el día a día y tus entrenamientos.',
            price: '$50.000 COP',
            media: [
                { src: 'productos_categoria1_producto1.jpg', type: 'image' },
                { src: 'productos_categoria1_producto1_alt1.jpg', type: 'image' }
            ]
        },
        'elec2': {
            name: 'Smartwatch',
            description: 'Controla tu salud, recibe notificaciones y monitorea tu actividad física desde tu muñeca. Compatible con iOS y Android.',
            price: '$120.000 COP',
            media: [
                { src: 'productos_categoria1_producto2.jpg', type: 'image' },
                { src: 'productos_categoria1_producto2_alt1.jpg', type: 'image' }
            ]
        },
        'elec3': {
            name: 'Power Bank 10000mAh',
            description: 'Mantén tus dispositivos cargados en cualquier lugar con esta batería portátil de alta capacidad. Diseño compacto y ligero.',
            price: '$35.000 COP',
            media: [
                { src: 'productos_categoria1_producto3.jpg', type: 'image' },
                { src: 'productos_categoria1_producto3_alt1.jpg', type: 'image' }
            ]
        },
        'elec4': {
            name: 'Mini Proyector Portátil',
            description: 'Transforma cualquier pared en una pantalla de cine. Ideal para noches de películas, presentaciones o gaming.',
            price: '$250.000 COP',
            media: [
                { src: 'productos_categoria1_producto4.jpg', type: 'image' },
                { src: 'productos_categoria1_producto4_alt1.jpg', type: 'image' }
            ]
        },
        'elec5': {
            name: 'Teclado Bluetooth',
            description: 'Compacto y perfecto para trabajar desde cualquier lugar con tu tablet o smartphone. Conexión rápida y estable.',
            price: '$45.000 COP',
            media: [
                { src: 'productos_categoria1_producto5.jpg', type: 'image' },
                { src: 'productos_categoria1_producto5_alt1.jpg', type: 'image' }
            ]
        },
        'elec6': {
            name: 'Cámara Web Full HD',
            description: 'Calidad de video nítida para tus videollamadas, streaming y grabaciones. Micrófono incorporado con reducción de ruido.',
            price: '$70.000 COP',
            media: [
                { src: 'productos_categoria1_producto6.jpg', type: 'image' },
                { src: 'productos_categoria1_producto6_alt1.jpg', type: 'image' }
            ]
        },
        'moda1': {
            name: 'Bolso de Cuero Unisex',
            description: 'Elegante y práctico para el día a día, con múltiples compartimentos para organizar tus pertenencias.',
            price: '$80.000 COP',
            media: [
                { src: 'productos_categoria2_producto1.jpg', type: 'image' },
                { src: 'productos_categoria2_producto1_alt1.jpg', type: 'image' }
            ]
        },
        'moda2': {
            name: 'Gafas de Sol Polarizadas',
            description: 'Protección UV y diseño moderno que se adapta a cualquier estilo. Ideales para conducir o disfrutar del aire libre.',
            price: '$40.000 COP',
            media: [
                { src: 'productos_categoria2_producto2.jpg', type: 'image' },
                { src: 'productos_categoria2_producto2_alt1.jpg', type: 'image' }
            ]
        },
        'moda3': {
            name: 'Bufanda de Lana Tejida',
            description: 'Suave y cálida, ideal para el invierno. Un accesorio esencial para mantenerte abrigado con estilo.',
            price: '$25.000 COP',
            media: [
                { src: 'productos_categoria2_producto3.jpg', type: 'image' },
                { src: 'productos_categoria2_producto3_alt1.jpg', type: 'image' }
            ]
        },
        'moda4': {
            name: 'Reloj Casual Hombre',
            description: 'Diseño minimalista y elegante, perfecto para cualquier ocasión. Resistente al agua para el uso diario.',
            price: '$95.000 COP',
            media: [
                { src: 'productos_categoria2_producto4.jpg', type: 'image' },
                { src: 'productos_categoria2_producto4_alt1.jpg', type: 'image' }
            ]
        },
        'moda5': {
            name: 'Aretes de Plata 925',
            description: 'Elegancia y brillo para tu estilo. Diseño clásico y atemporal, perfectos para cualquier evento.',
            price: '$30.000 COP',
            media: [
                { src: 'productos_categoria2_producto5.jpg', type: 'image' },
                { src: 'productos_categoria2_producto5_alt1.jpg', type: 'image' }
            ]
        },
        'moda6': {
            name: 'Cinturón de Cuero Reversible',
            description: 'Dos estilos en uno, versátil y duradero para combinar con diferentes atuendos.',
            price: '$55.000 COP',
            media: [
                { src: 'productos_categoria2_producto6.jpg', type: 'image' },
                { src: 'productos_categoria2_producto6_alt1.jpg', type: 'image' }
            ]
        },
        'hogar1': {
            name: 'Juego de Sábanas de Algodón',
            description: 'Confort y suavidad para un descanso perfecto. Tejido transpirable y resistente al lavado.',
            price: '$75.000 COP',
            media: [
                { src: 'productos_categoria3_producto1.jpg', type: 'image' },
                { src: 'productos_categoria3_producto1_alt1.jpg', type: 'image' }
            ]
        },
        'hogar2': {
            name: 'Set de Herramientas Básicas',
            description: 'Imprescindible para cualquier arreglo en casa. Incluye martillo, destornilladores, alicates y más, en un estuche compacto.',
            price: '$60.000 COP',
            media: [
                { src: 'productos_categoria3_producto2.jpg', type: 'image' },
                { src: 'productos_categoria3_producto2_alt1.jpg', type: 'image' }
            ]
        },
        'hogar3': {
            name: 'Maceta Colgante Decorativa',
            description: 'Añade un toque verde y moderno a tus espacios interiores o exteriores. Fácil de instalar y limpiar.',
            price: '$20.000 COP',
            media: [
                { src: 'productos_categoria3_producto3.jpg', type: 'image' },
                { src: 'productos_categoria3_producto3_alt1.jpg', type: 'image' }
            ]
        },
        'hogar4': {
            name: 'Lámpara de Escritorio LED',
            description: 'Iluminación ajustable y diseño moderno. Ideal para estudiar, trabajar o leer. Con control táctil.',
            price: '$48.000 COP',
            media: [
                { src: 'productos_categoria3_producto4.jpg', type: 'image' },
                { src: 'productos_categoria3_producto4_alt1.jpg', type: 'image' }
            ]
        },
        'hogar5': {
            name: 'Robot Aspirador Inteligente',
            description: 'Limpieza automática para tu hogar. Programa su funcionamiento y olvídate de la suciedad. Compatible con asistentes de voz.',
            price: '$300.000 COP',
            media: [
                { src: 'productos_categoria3_producto5.jpg', type: 'image' },
                { src: 'productos_categoria3_producto5_alt1.jpg', type: 'image' }
            ]
        },
        'hogar6': {
            name: 'Mantel Antimanchas',
            description: 'Ideal para proteger tu mesa con estilo. Fácil de limpiar y resistente a derrames. Perfecto para uso diario o eventos.',
            price: '$38.000 COP',
            media: [
                { src: 'productos_categoria3_producto6.jpg', type: 'image' },
                { src: 'productos_categoria3_producto6_alt1.jpg', type: 'image' }
            ]
        },
        'deporte1': {
            name: 'Botella de Agua Deportiva',
            description: 'Hidratación garantizada para tus entrenamientos. Diseño ergonómico y material duradero, libre de BPA.',
            price: '$20.000 COP',
            media: [
                { src: 'productos_categoria4_producto1.jpg', type: 'image' },
                { src: 'productos_categoria4_producto1_alt1.jpg', type: 'image' }
            ]
        },
        'deporte2': {
            name: 'Bandas de Resistencia',
            description: 'Perfectas para entrenar en casa o al aire libre. Incluye diferentes niveles de resistencia para todos los niveles de fitness.',
            price: '$30.000 COP',
            media: [
                { src: 'productos_categoria4_producto2.jpg', type: 'image' },
                { src: 'productos_categoria4_producto2_alt1.jpg', type: 'image' }
            ]
        },
        'deporte3': {
            name: 'Tienda de Campaña Individual',
            description: 'Ligera y fácil de montar para tus aventuras al aire libre. Impermeable y resistente al viento, ideal para senderismo.',
            price: '$150.000 COP',
            media: [
                { src: 'productos_categoria4_producto3.jpg', type: 'image' },
                { src: 'productos_categoria4_producto3_alt1.jpg', type: 'image' }
            ]
        },
        'deporte4': {
            name: 'Mancuernas Ajustables',
            description: 'Versatilidad para tus rutinas de fuerza. Ajusta el peso rápidamente para diferentes ejercicios. Ahorra espacio en casa.',
            price: '$180.000 COP',
            media: [
                { src: 'productos_categoria4_producto4.jpg', type: 'image' },
                { src: 'productos_categoria4_producto4_alt1.jpg', type: 'image' }
            ]
        },
        'deporte5': {
            name: 'Kit de Snorkel',
            description: 'Explora el mundo submarino con comodidad y claridad. Incluye máscara, tubo y aletas de alta calidad.',
            price: '$65.000 COP',
            media: [
                { src: 'productos_categoria4_producto5.jpg', type: 'image' },
                { src: 'productos_categoria4_producto5_alt1.jpg', type: 'image' }
            ]
        },
        'deporte6': {
            name: 'Mochila de Senderismo 30L',
            description: 'Espaciosa y cómoda para tus excursiones. Múltiples bolsillos y soporte lumbar para mayor confort.',
            price: '$90.000 COP',
            media: [
                { src: 'productos_categoria4_producto6.jpg', type: 'image' },
                { src: 'productos_categoria4_producto6_alt1.jpg', type: 'image' }
            ]
        }
    };


    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (event) => {
            if (event.target.classList.contains('buy-btn')) {
                return;
            }

            const productId = card.dataset.productId;
            const product = productsData[productId];

            if (product) {
                modalProductTitle.textContent = product.name;
                modalProductDescription.textContent = product.description;

                if (product.originalPrice) {
                    modalProductPrice.innerHTML = `<span class="old-price">${product.originalPrice}</span> <span class="new-price">${product.price}</span>`;
                } else {
                    modalProductPrice.textContent = product.price;
                }

                modalBuyButton.dataset.product = product.name;
                modalShareButton.dataset.productId = productId;

                productMedia = product.media;
                currentMediaIndex = 0;
                updateModalMediaAndThumbnails();

                productModal.classList.add('active');
                document.body.classList.add('no-scroll');
            }
        });
    });

    closeButton.addEventListener('click', () => {
        productModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        const currentMediaElement = galleryMainImageContainer.querySelector('img, video');
        if (currentMediaElement && currentMediaElement.tagName === 'VIDEO') {
            currentMediaElement.pause();
        }
    });

    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            productModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
            const currentMediaElement = galleryMainImageContainer.querySelector('img, video');
            if (currentMediaElement && currentMediaElement.tagName === 'VIDEO') {
                currentMediaElement.pause();
            }
        }
    });

    galleryPrev.addEventListener('click', () => {
        currentMediaIndex = (currentMediaIndex > 0) ? currentMediaIndex - 1 : productMedia.length - 1;
        updateModalMediaAndThumbnails();
    });

    galleryNext.addEventListener('click', () => {
        currentMediaIndex = (currentMediaIndex < productMedia.length - 1) ? currentMediaIndex + 1 : 0;
        updateModalMediaAndThumbnails();
    });

    function updateModalMediaAndThumbnails() {
        if (productMedia.length === 0) {
            galleryMainImageContainer.innerHTML = '<img src="placeholder.jpg" alt="No media available">';
            galleryThumbnails.innerHTML = '';
            galleryPrev.style.display = 'none';
            galleryNext.style.display = 'none';
            return;
        } else if (productMedia.length === 1) {
            galleryPrev.style.display = 'none';
            galleryNext.style.display = 'none';
        } else {
            galleryPrev.style.display = 'block';
            galleryNext.style.display = 'block';
        }

        galleryMainImageContainer.innerHTML = '';

        const currentMedia = productMedia[currentMediaIndex];
        let mediaElement;

        if (currentMedia.type === 'image') {
            mediaElement = document.createElement('img');
            mediaElement.src = currentMedia.src;
            mediaElement.alt = modalProductTitle.textContent;
        } else if (currentMedia.type === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.src = currentMedia.src;
            mediaElement.controls = true;
            mediaElement.loop = true;
            mediaElement.muted = true;
            mediaElement.autoplay = false;
            mediaElement.load();
        }

        if (mediaElement) {
            galleryMainImageContainer.appendChild(mediaElement);
            if (mediaElement.tagName === 'VIDEO' && currentMediaIndex === 0) {
                mediaElement.muted = true;
                mediaElement.play().catch(error => console.log("Video autoplay prevented:", error));
            }
        }

        galleryThumbnails.innerHTML = '';
        productMedia.forEach((mediaItem, index) => {
            const thumbnailWrapper = document.createElement('div');
            thumbnailWrapper.classList.add('thumbnail-item');

            let thumbnailElement;
            if (mediaItem.type === 'image') {
                thumbnailElement = document.createElement('img');
                thumbnailElement.src = mediaItem.src;
                thumbnailElement.alt = `Thumbnail ${index + 1}`;
            } else if (mediaItem.type === 'video') {
                thumbnailWrapper.classList.add('video-thumbnail');
                thumbnailElement = document.createElement('span');
                thumbnailElement.classList.add('material-icons');
                thumbnailElement.textContent = 'play_circle_filled';
                const posterPath = mediaItem.src.replace(/\.(mp4|webm|ogg)$/i, '.jpg');
                thumbnailWrapper.style.backgroundImage = `url('${posterPath}')`;
            }

            if (thumbnailElement) {
                thumbnailWrapper.appendChild(thumbnailElement);
                if (index === currentMediaIndex) {
                    thumbnailWrapper.classList.add('active');
                }
                thumbnailWrapper.addEventListener('click', () => {
                    const currentMainMedia = galleryMainImageContainer.querySelector('img, video');
                    if (currentMainMedia && currentMainMedia.tagName === 'VIDEO') {
                        currentMainMedia.pause();
                    }
                    currentMediaIndex = index;
                    updateModalMediaAndThumbnails();
                });
                galleryThumbnails.appendChild(thumbnailWrapper);
            }
        });
    }

    // --- Botones de Comprar a WhatsApp ---
    const whatsappNumber = '573205893469';

    document.querySelectorAll('.product-card .buy-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productName = event.target.dataset.product;
            const message = `Hola, estoy interesado en comprar el siguiente producto: ${encodeURIComponent(productName)}. Por favor, dame más información.`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    });

    modalBuyButton.addEventListener('click', (event) => {
        const productName = event.target.dataset.product;
        const message = `Hola, estoy interesado en comprar el siguiente producto (desde el modal): ${encodeURIComponent(productName)}. Por favor, dame más información.`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        productModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });

    // --- Lógica del Botón de Compartir Producto (en el modal) ---
    if (modalShareButton) {
        modalShareButton.addEventListener('click', async () => {
            const productIdToShare = modalShareButton.dataset.productId;
            const productToShare = productsData[productIdToShare];

            if (navigator.share && productToShare) {
                try {
                    await navigator.share({
                        title: productToShare.name,
                        text: `¡Mira este increíble producto: ${productToShare.name} - ${productToShare.description} en nuestra Tienda Online!`,
                        url: window.location.origin + window.location.pathname
                    });
                    console.log('Producto compartido con éxito');
                } catch (error) {
                    console.error('Error al compartir el producto:', error);
                }
            } else {
                alert(`Para compartir: ${productToShare.name}\n${productToShare.description}\nVisita: ${window.location.href}`);
            }
            productModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    // --- Lógica del Botón de Compartir Tienda (en el footer) ---
    const footerShareButton = document.getElementById('footer-share-btn');
    if (footerShareButton) {
        footerShareButton.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Tienda Online - Tu mejor opción para comprar productos de calidad',
                        text: '¡Descubre ofertas increíbles en electrónica, moda, hogar y deportes! Visita nuestra tienda hoy mismo.',
                        url: window.location.origin + window.location.pathname
                    });
                    console.log('Tienda compartida con éxito');
                } catch (error) {
                    console.error('Error al compartir la tienda:', error);
                }
            } else {
                alert(`Comparte nuestra tienda: ¡Descubre ofertas increíbles en electrónica, moda, hogar y deportes!\nVisita: ${window.location.href}`);
            }
        });
    }

    // --- Preguntas Frecuentes Desplegables ---
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.expand-icon');

            document.querySelectorAll('.faq-question.active').forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.classList.remove('active');
                    otherQuestion.nextElementSibling.style.maxHeight = '0';
                    otherQuestion.nextElementSibling.style.paddingTop = '0';
                    otherQuestion.nextElementSibling.style.paddingBottom = '0';
                    otherQuestion.querySelector('.expand-icon').style.transform = 'rotate(0deg)';
                }
            });

            question.classList.toggle('active');

            if (question.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.paddingTop = '15px';
                answer.style.paddingBottom = '20px';
            } else {
                icon.style.transform = 'rotate(0deg)';
                answer.style.maxHeight = '0';
                answer.style.paddingTop = '0';
                answer.style.paddingBottom = '0';
            }
        });
    });

    // --- Service Worker para PWA (Desactivado para revisión) ---
    // NOTA: Se ha comentado la lógica del Service Worker y manifest para depurar
    // Si la PWA no funciona, es mejor revisar la configuración y despliegue por separado.
    // Una vez que el resto de la web funcione, podemos reintroducir el PWA de forma controlada.
    /*
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('Service Worker registrado con éxito:', registration);
                })
                .catch(error => {
                    console.error('Fallo el registro del Service Worker:', error);
                });
        });
    }
    */
});
