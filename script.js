document.addEventListener('DOMContentLoaded', () => {
    // --- Splash Screen ---
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('hidden');
        }, 1500); // 1.5 segundos
    }

    // --- Menú Deslizable Móvil ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Deshabilita/habilita el scroll del body cuando el menú está abierto/cerrado
            document.body.classList.toggle('no-scroll', mainNav.classList.contains('active'));
        });

        // Cerrar el menú si se hace clic en un enlace
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // --- Lógica del Modal de Producto y Slider ---
    const productModal = document.getElementById('product-modal');
    const closeButton = document.querySelector('.modal .close-button');
    const modalProductImage = document.getElementById('modal-product-image');
    const modalProductTitle = document.getElementById('modal-product-title');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalBuyButton = document.getElementById('modal-buy-btn');
    const galleryThumbnails = document.getElementById('modal-product-thumbnails');
    const galleryPrev = document.querySelector('.gallery-prev');
    const galleryNext = document.querySelector('.gallery-next');

    let currentImageIndex = 0;
    let productImages = [];

    // Datos de productos (ejemplo). En un proyecto real, esto vendría de una API o JSON.
    // **Asegúrate de que estas rutas de imagen sean correctas y existan en tu proyecto**
    const productsData = {
        'oferta1': {
            name: 'Reloj Hombre y Mujer',
            description: 'Pulsera de Cuarzo para Hombres y Mujeres, Moda Deportiva Romántica Sencilla para Parejas, Correa de Cuero PU para Fiestas, Regalo Ideal para Ella en Cumpleaños, Día de la Madre o Día del Padre, La Mejor Elección para Regalos en Colores Variados.',
            price: '$12.000 COP',
            originalPrice: '$18.000 COP',
            images: [
                'https://img.kwcdn.com/product/fancy/a5d647be-0a89-4fb1-935f-fe49a0c1efd2.jpg?imageView2/2/w/800/q/70/format/webp',
                'productos/oferta_producto1_alt1.jpg',
                'productos/oferta_producto1_alt2.jpg'
            ]
        },
        'oferta2': {
            name: 'Cafetera Programable',
            description: 'Prepara tu café favorito a la hora deseada. Capacidad para 12 tazas y función de mantenimiento de calor.',
            price: '$140.000 COP',
            originalPrice: '$200.000 COP',
            images: [
                'productos/oferta_producto2.jpg',
                'productos/oferta_producto2_alt1.jpg'
            ]
        },
        'oferta3': {
            name: 'Dron con Cámara HD',
            description: 'Explora los cielos con este dron fácil de volar y captura videos en alta definición. Ideal para principiantes y entusiastas.',
            price: '$320.000 COP',
            originalPrice: '$450.000 COP',
            images: [
                'productos/oferta_producto3.jpg',
                'productos/oferta_producto3_alt1.jpg'
            ]
        },
        'oferta4': {
            name: 'Mochila Antirrobo USB',
            description: 'Diseño seguro y compartimento para laptop con puerto USB integrado. Perfecta para viajes y uso diario en la ciudad.',
            price: '$65.000 COP',
            originalPrice: '$90.000 COP',
            images: [
                'productos/oferta_producto4.jpg',
                'productos/oferta_producto4_alt1.jpg'
            ]
        },
        'oferta5': {
            name: 'Auriculares Gaming RGB',
            description: 'Sumérgete en tus juegos con sonido envolvente y luces RGB personalizables. Micrófono retráctil de alta calidad.',
            price: '$100.000 COP',
            originalPrice: '$150.000 COP',
            images: [
                'productos/oferta_producto5.jpg',
                'productos/oferta_producto5_alt1.jpg'
            ]
        },
        'oferta6': {
            name: 'Set de Cuchillos de Cocina Profesional',
            description: 'Cuchillos de acero inoxidable de alta precisión para todas tus necesidades culinarias. Mango ergonómico.',
            price: '$85.000 COP',
            originalPrice: '$120.000 COP',
            images: [
                'productos/oferta_producto6.jpg',
                'productos/oferta_producto6_alt1.jpg'
            ]
        },
        'elec1': {
            name: 'Auriculares Inalámbricos',
            description: 'Sonido de alta fidelidad, cómodos y con gran autonomía de batería. Perfectos para el día a día y tus entrenamientos.',
            price: '$50.000 COP',
            images: [
                'productos/categoria1_producto1.jpg',
                'productos/categoria1_producto1_alt1.jpg'
            ]
        },
        'elec2': {
            name: 'Smartwatch',
            description: 'Controla tu salud, recibe notificaciones y monitorea tu actividad física desde tu muñeca. Compatible con iOS y Android.',
            price: '$120.000 COP',
            images: [
                'productos/categoria1_producto2.jpg',
                'productos/categoria1_producto2_alt1.jpg'
            ]
        },
        'elec3': {
            name: 'Power Bank 10000mAh',
            description: 'Mantén tus dispositivos cargados en cualquier lugar con esta batería portátil de alta capacidad. Diseño compacto y ligero.',
            price: '$35.000 COP',
            images: [
                'productos/categoria1_producto3.jpg',
                'productos/categoria1_producto3_alt1.jpg'
            ]
        },
        'elec4': {
            name: 'Mini Proyector Portátil',
            description: 'Transforma cualquier pared en una pantalla de cine. Ideal para noches de películas, presentaciones o gaming.',
            price: '$250.000 COP',
            images: [
                'productos/categoria1_producto4.jpg',
                'productos/categoria1_producto4_alt1.jpg'
            ]
        },
        'elec5': {
            name: 'Teclado Bluetooth',
            description: 'Compacto y perfecto para trabajar desde cualquier lugar con tu tablet o smartphone. Conexión rápida y estable.',
            price: '$45.000 COP',
            images: [
                'productos/categoria1_producto5.jpg',
                'productos/categoria1_producto5_alt1.jpg'
            ]
        },
        'elec6': {
            name: 'Cámara Web Full HD',
            description: 'Calidad de video nítida para tus videollamadas, streaming y grabaciones. Micrófono incorporado con reducción de ruido.',
            price: '$70.000 COP',
            images: [
                'productos/categoria1_producto6.jpg',
                'productos/categoria1_producto6_alt1.jpg'
            ]
        },
        'moda1': {
            name: 'Bolso de Cuero Unisex',
            description: 'Elegante y práctico para el día a día, con múltiples compartimentos para organizar tus pertenencias.',
            price: '$80.000 COP',
            images: [
                'productos/categoria2_producto1.jpg',
                'productos/categoria2_producto1_alt1.jpg'
            ]
        },
        'moda2': {
            name: 'Gafas de Sol Polarizadas',
            description: 'Protección UV y diseño moderno que se adapta a cualquier estilo. Ideales para conducir o disfrutar del aire libre.',
            price: '$40.000 COP',
            images: [
                'productos/categoria2_producto2.jpg',
                'productos/categoria2_producto2_alt1.jpg'
            ]
        },
        'moda3': {
            name: 'Bufanda de Lana Tejida',
            description: 'Suave y cálida, ideal para el invierno. Un accesorio esencial para mantenerte abrigado con estilo.',
            price: '$25.000 COP',
            images: [
                'productos/categoria2_producto3.jpg',
                'productos/categoria2_producto3_alt1.jpg'
            ]
        },
        'moda4': {
            name: 'Reloj Casual Hombre',
            description: 'Diseño minimalista y elegante, perfecto para cualquier ocasión. Resistente al agua para el uso diario.',
            price: '$95.000 COP',
            images: [
                'productos/categoria2_producto4.jpg',
                'productos/categoria2_producto4_alt1.jpg'
            ]
        },
        'moda5': {
            name: 'Aretes de Plata 925',
            description: 'Elegancia y brillo para tu estilo. Diseño clásico y atemporal, perfectos para cualquier evento.',
            price: '$30.000 COP',
            images: [
                'productos/categoria2_producto5.jpg',
                'productos/categoria2_producto5_alt1.jpg'
            ]
        },
        'moda6': {
            name: 'Cinturón de Cuero Reversible',
            description: 'Dos estilos en uno, versátil y duradero para combinar con diferentes atuendos.',
            price: '$55.000 COP',
            images: [
                'productos/categoria2_producto6.jpg',
                'productos/categoria2_producto6_alt1.jpg'
            ]
        },
        'hogar1': {
            name: 'Juego de Sábanas de Algodón',
            description: 'Confort y suavidad para un descanso perfecto. Tejido transpirable y resistente al lavado.',
            price: '$75.000 COP',
            images: [
                'productos/categoria3_producto1.jpg',
                'productos/categoria3_producto1_alt1.jpg'
            ]
        },
        'hogar2': {
            name: 'Set de Herramientas Básicas',
            description: 'Imprescindible para cualquier arreglo en casa. Incluye martillo, destornilladores, alicates y más, en un estuche compacto.',
            price: '$60.000 COP',
            images: [
                'productos/categoria3_producto2.jpg',
                'productos/categoria3_producto2_alt1.jpg'
            ]
        },
        'hogar3': {
            name: 'Maceta Colgante Decorativa',
            description: 'Añade un toque verde y moderno a tus espacios interiores o exteriores. Fácil de instalar y limpiar.',
            price: '$20.000 COP',
            images: [
                'productos/categoria3_producto3.jpg',
                'productos/categoria3_producto3_alt1.jpg'
            ]
        },
        'hogar4': {
            name: 'Lámpara de Escritorio LED',
            description: 'Iluminación ajustable y diseño moderno. Ideal para estudiar, trabajar o leer. Con control táctil.',
            price: '$48.000 COP',
            images: [
                'productos/categoria3_producto4.jpg',
                'productos/categoria3_producto4_alt1.jpg'
            ]
        },
        'hogar5': {
            name: 'Robot Aspirador Inteligente',
            description: 'Limpieza automática para tu hogar. Programa su funcionamiento y olvídate de la suciedad. Compatible con asistentes de voz.',
            price: '$300.000 COP',
            images: [
                'productos/categoria3_producto5.jpg',
                'productos/categoria3_producto5_alt1.jpg'
            ]
        },
        'hogar6': {
            name: 'Mantel Antimanchas',
            description: 'Ideal para proteger tu mesa con estilo. Fácil de limpiar y resistente a derrames. Perfecto para uso diario o eventos.',
            price: '$38.000 COP',
            images: [
                'productos/categoria3_producto6.jpg',
                'productos/categoria3_producto6_alt1.jpg'
            ]
        },
        'deporte1': {
            name: 'Botella de Agua Deportiva',
            description: 'Hidratación garantizada para tus entrenamientos. Diseño ergonómico y material duradero, libre de BPA.',
            price: '$20.000 COP',
            images: [
                'productos/categoria4_producto1.jpg',
                'productos/categoria4_producto1_alt1.jpg'
            ]
        },
        'deporte2': {
            name: 'Bandas de Resistencia',
            description: 'Perfectas para entrenar en casa o al aire libre. Incluye diferentes niveles de resistencia para todos los niveles de fitness.',
            price: '$30.000 COP',
            images: [
                'productos/categoria4_producto2.jpg',
                'productos/categoria4_producto2_alt1.jpg'
            ]
        },
        'deporte3': {
            name: 'Tienda de Campaña Individual',
            description: 'Ligera y fácil de montar para tus aventuras al aire libre. Impermeable y resistente al viento, ideal para senderismo.',
            price: '$150.000 COP',
            images: [
                'productos/categoria4_producto3.jpg',
                'productos/categoria4_producto3_alt1.jpg'
            ]
        },
        'deporte4': {
            name: 'Mancuernas Ajustables',
            description: 'Versatilidad para tus rutinas de fuerza. Ajusta el peso rápidamente para diferentes ejercicios. Ahorra espacio en casa.',
            price: '$180.000 COP',
            images: [
                'productos/categoria4_producto4.jpg',
                'productos/categoria4_producto4_alt1.jpg'
            ]
        },
        'deporte5': {
            name: 'Kit de Snorkel',
            description: 'Explora el mundo submarino con comodidad y claridad. Incluye máscara, tubo y aletas de alta calidad.',
            price: '$65.000 COP',
            images: [
                'productos/categoria4_producto5.jpg',
                'productos/categoria4_producto5_alt1.jpg'
            ]
        },
        'deporte6': {
            name: 'Mochila de Senderismo 30L',
            description: 'Espaciosa y cómoda para tus excursiones. Múltiples bolsillos y soporte lumbar para mayor confort.',
            price: '$90.000 COP',
            images: [
                'productos/categoria4_producto6.jpg',
                'productos/categoria4_producto6_alt1.jpg'
            ]
        }
    };


    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (event) => {
            // Evita que el clic en el botón de "Comprar" active el modal
            if (event.target.classList.contains('buy-btn')) {
                return;
            }

            const productId = card.dataset.productId;
            const product = productsData[productId];

            if (product) {
                modalProductTitle.textContent = product.name;
                modalProductDescription.textContent = product.description;

                // Manejar precio con o sin oferta
                if (product.originalPrice) {
                    modalProductPrice.innerHTML = `<span class="old-price">${product.originalPrice}</span> <span class="new-price">${product.price}</span>`;
                } else {
                    modalProductPrice.textContent = product.price;
                }

                modalBuyButton.dataset.product = product.name; // Para el botón de WhatsApp del modal

                productImages = product.images;
                currentImageIndex = 0;
                updateModalImageAndThumbnails();

                productModal.classList.add('active');
                // Deshabilita el scroll del body
                document.body.classList.add('no-scroll');
            }
        });
    });

    closeButton.addEventListener('click', () => {
        productModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === productModal) {
            productModal.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });

    galleryPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : productImages.length - 1;
        updateModalImageAndThumbnails();
    });

    galleryNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex < productImages.length - 1) ? currentImageIndex + 1 : 0;
        updateModalImageAndThumbnails();
    });

    function updateModalImageAndThumbnails() {
        if (productImages.length === 0) {
            modalProductImage.src = 'placeholder.jpg';
            galleryThumbnails.innerHTML = '';
            galleryPrev.style.display = 'none';
            galleryNext.style.display = 'none';
            return;
        } else if (productImages.length === 1) {
            galleryPrev.style.display = 'none';
            galleryNext.style.display = 'none';
        } else {
            galleryPrev.style.display = 'block';
            galleryNext.style.display = 'block';
        }

        modalProductImage.src = productImages[currentImageIndex];
        galleryThumbnails.innerHTML = '';

        productImages.forEach((imageSrc, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = imageSrc;
            thumbnail.classList.add('thumbnail-item');
            if (index === currentImageIndex) {
                thumbnail.classList.add('active');
            }
            thumbnail.addEventListener('click', () => {
                currentImageIndex = index;
                updateModalImageAndThumbnails();
            });
            galleryThumbnails.appendChild(thumbnail);
        });
    }

    // --- Botones de Comprar a WhatsApp ---
    const whatsappNumber = '573205893469'; // Tu número incluyendo el código de país (57 para Colombia)

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

    // --- Preguntas Frecuentes Desplegables ---
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.expand-icon');

            // Toggle la clase 'active' en la pregunta y la respuesta
            question.classList.toggle('active');
            answer.classList.toggle('active');

            // Controla la rotación del icono
            if (question.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }

            // Opcional: Cerrar otros acordeones si se abre uno nuevo
            document.querySelectorAll('.faq-question.active').forEach(otherQuestion => {
                if (otherQuestion !== question) { // Si no es la pregunta actual
                    otherQuestion.classList.remove('active');
                    otherQuestion.nextElementSibling.classList.remove('active');
                    otherQuestion.querySelector('.expand-icon').style.transform = 'rotate(0deg)';
                }
            });
        });
    });

    // --- Service Worker para PWA ---
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
});
