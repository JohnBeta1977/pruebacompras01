document.addEventListener('DOMContentLoaded', () => {
    // 1. Splash Screen
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            splashScreen.addEventListener('transitionend', () => {
                splashScreen.remove();
            });
        }, 2000); // Muestra por 2 segundos
    }

    // 2. Transparencia y Reducción del Navbar al hacer scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Ajusta 50px según cuando quieras la reducción
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 3. Toggle del Sidebar (Menú móvil)
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const closeSidebar = document.getElementById('closeSidebar');

    if (menuToggle && sidebar && closeSidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
        });

        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });

        // Cerrar sidebar al hacer clic fuera de él
        document.addEventListener('click', (event) => {
            // Asegura que el click no fue en el toggle ni dentro del sidebar
            if (sidebar.classList.contains('active') &&
                !sidebar.contains(event.target) &&
                !menuToggle.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        });

        // Cerrar sidebar al hacer clic en un enlace de navegación
        sidebar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });
        });
    }

    // 4. Modal de productos y slider de imágenes
    const productCards = document.querySelectorAll('.product-card');
    const productModal = document.getElementById('productModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const modalTitle = productModal.querySelector('.modal-title');
    const modalDescription = productModal.querySelector('.modal-description');
    const modalPrice = productModal.querySelector('.modal-price');
    const imageSlider = productModal.querySelector('.image-slider');
    const prevButton = productModal.querySelector('.slider-navigation .prev');
    const nextButton = productModal.querySelector('.slider-navigation .next');
    const buyButton = productModal.querySelector('.buy-button');
    const videoContainer = productModal.querySelector('.video-container');
    const shareButton = productModal.querySelector('.share-button');

    let currentSlideIndex = 0;
    // URLs de video de YouTube. Reemplaza los IDs con los de tus videos reales.
    // Formato: `https://www.youtube.com/embed/TU_ID_DE_YOUTUBE?autoplay=1&rel=0`
    // El 'autoplay=1' hará que se reproduzca automáticamente al abrir la modal, y 'rel=0' previene videos relacionados al final.
    const productVideos = {
        "1": "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0", // Ejemplo Drone (Rick Roll)
        "2": "", // Sin video para auriculares
        "3": "https://www.youtube.com/embed/J7pC_k705cQ?autoplay=1&rel=0", // Ejemplo Smartwatch
        "4": "", // Sin video para cámara
        "e1": "https://www.youtube.com/embed/kYjD0gH1aYg?autoplay=1&rel=0", // Ejemplo TV
        "e2": "https://www.youtube.com/embed/M0m6A2b-eT4?autoplay=1&rel=0", // Ejemplo Laptop
        "e3": "", // Sin video para altavoz
        "e4": "https://www.youtube.com/embed/p1_r4zLwB1Q?autoplay=1&rel=0", // Ejemplo Consola
        "m1": "https://www.youtube.com/embed/1Jc991qE9f0?autoplay=1&rel=0", // Ejemplo Moda Chaqueta
        "m2": "", // Sin video para reloj
        "m3": "https://www.youtube.com/embed/q_mYF620K70?autoplay=1&rel=0", // Ejemplo Moda Zapatillas
        "m4": "", // Sin video para bolso
        "h1": "https://www.youtube.com/embed/E-0F3X8yX7M?autoplay=1&rel=0", // Ejemplo Hogar Aspiradora
        "h2": "", // Sin video para cafetera
        "h3": "https://www.youtube.com/embed/t_jD-1pG2Q4?autoplay=1&rel=0", // Ejemplo Hogar Lámpara
        "h4": "", // Sin video para sábanas
        "u1": "https://www.youtube.com/embed/oG9pB7C6n68?autoplay=1&rel=0", // Ejemplo Usados Celular
        "u2": "", // Sin video para bici
        "u3": "https://www.youtube.com/embed/i0WlM-qP9dE?autoplay=1&rel=0", // Ejemplo Usados Tablet
        "u4": "" // Sin video para libros
    };

    function showSlides() {
        const slides = imageSlider.querySelectorAll('img');
        if (slides.length === 0) return;

        imageSlider.style.transform = `translateX(${-currentSlideIndex * 100}%)`;

        // Ocultar botones de navegación si solo hay una imagen
        if (slides.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        } else {
            prevButton.style.display = 'flex';
            nextButton.style.display = 'flex';
        }
    }

    function changeSlide(n) {
        const slides = imageSlider.querySelectorAll('img');
        currentSlideIndex += n;
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = 0;
        }
        if (currentSlideIndex < 0) {
            currentSlideIndex = slides.length - 1;
        }
        showSlides();
    }

    prevButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevenir que el click se propague a la tarjeta de producto
        changeSlide(-1);
    });
    nextButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevenir que el click se propague a la tarjeta de producto
        changeSlide(1);
    });

    productCards.forEach(card => {
        card.addEventListener('click', (event) => {
            // Asegurarse de que el click no sea en el botón "Comprar"
            if (event.target.classList.contains('buy-now-btn') || event.target.closest('.buy-now-btn')) {
                return;
            }

            const productId = card.dataset.productId;
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('.description').textContent;
            const price = card.querySelector('.price').textContent;
            
            // Obtener todas las imágenes de la tarjeta
            const mainImageSrc = card.querySelector('.product-images .main-image').src;
            const altImagesSrc = Array.from(card.querySelectorAll('.product-images .alt-images img')).map(img => img.src);
            
            // Llenar la modal
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalPrice.textContent = price;

            // Limpiar slider y añadir imágenes
            imageSlider.innerHTML = '';
            // Añadir imagen principal primero
            imageSlider.appendChild(createImageElement(mainImageSrc, title));
            // Luego añadir imágenes alternativas
            altImagesSrc.forEach(src => imageSlider.appendChild(createImageElement(src, `${title} - vista alternativa`)));
            
            currentSlideIndex = 0; // Resetear a la primera imagen al abrir
            showSlides();

            // Configurar video de YouTube
            videoContainer.innerHTML = ''; // Limpiar video anterior
            const videoUrl = productVideos[productId];
            if (videoUrl) {
                const iframe = document.createElement('iframe');
                iframe.src = videoUrl;
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                videoContainer.appendChild(iframe);
                videoContainer.style.display = 'block';
            } else {
                videoContainer.style.display = 'none'; // Ocultar si no hay video
            }

            // Enlace de WhatsApp para "Comprar" en la modal
            const whatsappLink = `https://wa.me/573205893469?text=Hola,%20me%20interesa%20comprar%20este%20producto:%20${encodeURIComponent(title)}%0A${encodeURIComponent(window.location.href.split('#')[0])}`;
            buyButton.href = whatsappLink;

            // Funcionalidad de compartir
            shareButton.onclick = () => {
                if (navigator.share) {
                    navigator.share({
                        title: title,
                        text: description,
                        url: window.location.href.split('#')[0] // Compartir la URL base de la página
                    }).then(() => {
                        console.log('Contenido compartido con éxito');
                    }).catch((error) => {
                        console.error('Error al compartir:', error);
                    });
                } else {
                    alert('La función de compartir no está disponible en este navegador. Copiando el enlace...');
                    navigator.clipboard.writeText(`¡Mira este producto: ${title}! ${window.location.href.split('#')[0]}`).then(() => {
                        alert('Enlace copiado al portapapeles.');
                    }).catch(err => {
                        console.error('No se pudo copiar el enlace: ', err);
                    });
                }
            };

            // Mostrar la modal
            productModal.style.display = "flex";
        });
    });

    // Delegación de eventos para los botones de comprar en las tarjetas (directo a WhatsApp)
    document.querySelectorAll('.buy-now-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que el click en el botón active la modal de la tarjeta
            const productName = button.dataset.productName;
            const whatsappLink = `https://wa.me/573205893469?text=Hola,%20me%20interesa%20comprar%20este%20producto:%20${encodeURIComponent(productName)}`;
            window.open(whatsappLink, '_blank');
        });
    });

    // Función auxiliar para crear elementos de imagen
    function createImageElement(src, alt) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        return img;
    }

    // Eventos para cerrar la modal
    closeModalButton.addEventListener('click', () => {
        productModal.style.display = "none";
        videoContainer.innerHTML = ''; // Detener y limpiar el video al cerrar
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target == productModal) {
            productModal.style.display = "none";
            videoContainer.innerHTML = ''; // Detener y limpiar el video al cerrar
        }
    });

    // --- NUEVA FUNCIONALIDAD: Formulario de Contacto a WhatsApp ---
    const contactForm = document.getElementById('contactForm'); //
    const contactName = document.getElementById('contactName'); //
    const contactEmail = document.getElementById('contactEmail'); //
    const contactMessage = document.getElementById('contactMessage'); //

    if (contactForm && contactName && contactEmail && contactMessage) { //
        contactForm.addEventListener('submit', function(event) { //
            event.preventDefault(); // Evita el envío estándar del formulario

            const name = contactName.value; //
            const email = contactEmail.value; //
            const message = contactMessage.value; //
            const whatsappNumber = '573205893469'; //

            // Construir el mensaje de WhatsApp
            const fullMessage = `Hola, soy ${name} (${email}). Mi mensaje es: ${message}`; //
            const encodedMessage = encodeURIComponent(fullMessage); //

            // Abrir WhatsApp con el mensaje pre-rellenado
            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank'); //

            // Opcional: Limpiar el formulario después de enviar
            contactForm.reset(); //
        });
    }
    // --- FIN NUEVA FUNCIONALIDAD ---
    
    // 5. Toggle de respuestas en la sección FAQ
    document.querySelectorAll('.faq-item h3').forEach(faqQuestion => {
        faqQuestion.addEventListener('click', () => {
            const answer = faqQuestion.nextElementSibling;
            answer.classList.toggle('active');
        });
    });

    // 6. Smooth Scroll para anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Cerrar sidebar si está abierto al hacer click en un enlace
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // PWA: Manejo del evento beforeinstallprompt (opcional, para banners personalizados)
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); 
        deferredPrompt = e;
        console.log('Evento beforeinstallprompt disparado. Puedes mostrar tu botón de instalación.');
        const installButton = document.querySelector('.download-btn');
        if (installButton) {
            installButton.style.display = 'flex'; // Asegúrate de que el botón sea visible
            installButton.addEventListener('click', () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('Usuario aceptó la instalación de la PWA');
                        } else {
                            console.log('Usuario canceló la instalación de la PWA');
                        }
                        deferredPrompt = null;
                        installButton.style.display = 'none'; // Ocultar el botón después de la elección
                    });
                }
            }, { once: true }); // El evento solo se activará una vez
        }
    });
});
