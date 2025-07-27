document.addEventListener('DOMContentLoaded', () => {
    // 1. Splash Screen
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        // Retraso para mostrar el splash screen por un tiempo mínimo
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            // Opcional: Eliminar el elemento del DOM después de la transición
            splashScreen.addEventListener('transitionend', () => {
                splashScreen.remove();
            });
        }, 2000); // Muestra por 2 segundos
    }

    // 2. Transparencia del Navbar al hacer scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Ajusta 50px según cuando quieras que aparezca la transparencia
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
            // Verifica si el clic no fue dentro del sidebar ni en el botón de toggle
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
    const closeModalButton = productModal.querySelector('.close-button');
    const modalTitle = productModal.querySelector('.modal-title');
    const modalDescription = productModal.querySelector('.modal-description');
    const modalPrice = productModal.querySelector('.modal-price');
    const imageSlider = productModal.querySelector('.image-slider');
    const prevButton = productModal.querySelector('.slider-navigation .prev');
    const nextButton = productModal.querySelector('.slider-navigation .next');
    const buyButton = productModal.querySelector('.buy-button');
    const videoContainer = productModal.querySelector('.video-container'); // Contenedor de video
    const shareButton = productModal.querySelector('.share-button'); // Botón de compartir

    let currentSlideIndex = 0;
    let productVideos = { // Objeto para almacenar URLs de video por ID de producto
        "1": "https://www.youtube.com/embed/YOUR_DRONE_VIDEO_ID", // Reemplaza con ID real de YouTube
        "2": "", // Sin video para auriculares
        "3": "https://www.youtube.com/embed/YOUR_SMARTWATCH_VIDEO_ID", // Reemplaza con ID real de YouTube
        "4": "" // Sin video para cámara
        // Agrega más IDs de producto y sus videos aquí
    };

    function showSlides() {
        const slides = imageSlider.querySelectorAll('img');
        if (slides.length === 0) return;

        imageSlider.style.transform = `translateX(${-currentSlideIndex * 100}%)`;

        // Mostrar/ocultar botones de navegación si solo hay una imagen
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

    prevButton.addEventListener('click', () => changeSlide(-1));
    nextButton.addEventListener('click', () => changeSlide(1));

    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.productId;
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('.description').textContent;
            const price = card.querySelector('.price').textContent;
            const mainImageSrc = card.querySelector('.product-images .main-image').src;
            // Solo toma las imágenes alternativas si existen
            const altImagesSrc = Array.from(card.querySelectorAll('.product-images .alt-images img')).map(img => img.src);
            
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalPrice.textContent = price;

            // Rellenar el slider de imágenes
            imageSlider.innerHTML = ''; // Limpiar imágenes anteriores
            imageSlider.appendChild(createImageElement(mainImageSrc, 'Imagen principal'));
            altImagesSrc.forEach(src => imageSlider.appendChild(createImageElement(src, 'Imagen alternativa')));
            
            currentSlideIndex = 0;
            showSlides();

            // Insertar video si existe
            videoContainer.innerHTML = ''; // Limpiar video anterior
            const videoUrl = productVideos[productId];
            if (videoUrl) {
                const iframe = document.createElement('iframe');
                iframe.src = videoUrl;
                iframe.allow = "autoplay; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                videoContainer.appendChild(iframe);
                videoContainer.style.display = 'block'; // Mostrar el contenedor de video
            } else {
                videoContainer.style.display = 'none'; // Ocultar si no hay video
            }

            // Actualizar el enlace de WhatsApp dinámicamente
            const whatsappLink = `https://wa.me/573205893469?text=Me%20interesa%20comprar%20este%20producto:%20${encodeURIComponent(title)} - Ver más: ${encodeURIComponent(window.location.href)}`;
            buyButton.href = whatsappLink;

            // Configurar el botón de compartir
            shareButton.onclick = () => {
                if (navigator.share) {
                    navigator.share({
                        title: title,
                        text: description,
                        url: window.location.href // Compartir la URL actual de la página
                    }).then(() => {
                        console.log('Contenido compartido con éxito');
                    }).catch((error) => {
                        console.error('Error al compartir:', error);
                    });
                } else {
                    alert('La función de compartir no está disponible en este navegador.');
                    // Opción de fallback: copiar al portapapeles
                    navigator.clipboard.writeText(`¡Mira este producto: ${title}! ${window.location.href}`).then(() => {
                        alert('Enlace copiado al portapapeles.');
                    }).catch(err => {
                        console.error('No se pudo copiar el enlace: ', err);
                    });
                }
            };

            productModal.style.display = "flex"; // Usar flex para centrar la modal
        });
    });

    function createImageElement(src, alt) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        return img;
    }

    closeModalButton.addEventListener('click', () => {
        productModal.style.display = "none";
        videoContainer.innerHTML = ''; // Limpiar video al cerrar
    });

    window.addEventListener('click', (event) => {
        if (event.target == productModal) {
            productModal.style.display = "none";
            videoContainer.innerHTML = ''; // Limpiar video al cerrar
        }
    });


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
    });
});
