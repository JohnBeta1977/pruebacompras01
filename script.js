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
    const closeModalButton = document.getElementById('closeModalButton'); // Nuevo ID para el botón de cerrar
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
    // Ejemplo: "https://www.youtube.com/embed/TU_ID_DE_YOUTUBE?autoplay=1&mute=1"
    const productVideos = {
        "1": "https://www.youtube.com/embed/bC2T89yG46c?autoplay=1&mute=1&loop=1&playlist=bC2T89yG46c", // Ejemplo Drone
        "2": "", // Sin video para auriculares
        "3": "https://www.youtube.com/embed/5qF_qiq_v1Y?autoplay=1&mute=1&loop=1&playlist=5qF_qiq_v1Y", // Ejemplo Smartwatch
        "4": "", // Sin video para cámara
        "e1": "https://www.youtube.com/embed/fWzXpX8lHqY?autoplay=1&mute=1&loop=1&playlist=fWzXpX8lHqY", // Ejemplo TV
        "e2": "https://www.youtube.com/embed/y-F7kXlC0Sg?autoplay=1&mute=1&loop=1&playlist=y-F7kXlC0Sg", // Ejemplo Laptop
        "e3": "", // Sin video para altavoz
        "e4": "https://www.youtube.com/embed/Xq4M1l8aW6Q?autoplay=1&mute=1&loop=1&playlist=Xq4M1l8aW6Q", // Ejemplo Consola
        "m1": "https://www.youtube.com/embed/exampleVideoID_moda1?autoplay=1&mute=1&loop=1&playlist=exampleVideoID_moda1", // Ejemplo Moda Chaqueta
        "m2": "", // Sin video para reloj
        "m3": "https://www.youtube.com/embed/exampleVideoID_moda3?autoplay=1&mute=1&loop=1&playlist=exampleVideoID_moda3", // Ejemplo Moda Zapatillas
        "m4": "", // Sin video para bolso
        "h1": "https://www.youtube.com/embed/exampleVideoID_hogar1?autoplay=1&mute=1&loop=1&playlist=exampleVideoID_hogar1", // Ejemplo Hogar Aspiradora
        "h2": "", // Sin video para cafetera
        "h3": "https://www.youtube.com/embed/exampleVideoID_hogar3?autoplay=1&mute=1&loop=1&playlist=exampleVideoID_hogar3", // Ejemplo Hogar Lámpara
        "h4": "", // Sin video para sábanas
        "u1": "https://www.youtube.com/embed/exampleVideoID_usados1?autoplay=1&mute=1&loop=1&playlist=exampleVideoID_usados1", // Ejemplo Usados Celular
        "u2": "", // Sin video para bici
        "u3": "https://www.youtube.com/embed/exampleVideoID_usados3?autoplay=1&mute=1&loop=1&playlist=exampleVideoID_usados3", // Ejemplo Usados Tablet
        "u4": "" // Sin video para libros
    };

    function showSlides() {
        const slides = imageSlider.querySelectorAll('img');
        if (slides.length === 0) return;

        imageSlider.style.transform = `translateX(${-currentSlideIndex * 100}%)`;

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
        card.addEventListener('click', (event) => {
            // Prevenir que el click en el botón "Comprar" active la modal dos veces
            if (event.target.classList.contains('buy-now-btn')) {
                return;
            }

            const productId = card.dataset.productId;
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('.description').textContent;
            const price = card.querySelector('.price').textContent;
            const mainImageSrc = card.querySelector('.product-images .main-image').src;
            const altImagesSrc = Array.from(card.querySelectorAll('.product-images .alt-images img')).map(img => img.src);
            
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalPrice.textContent = price;

            imageSlider.innerHTML = '';
            imageSlider.appendChild(createImageElement(mainImageSrc, 'Imagen principal'));
            altImagesSrc.forEach(src => imageSlider.appendChild(createImageElement(src, 'Imagen alternativa')));
            
            currentSlideIndex = 0;
            showSlides();

            videoContainer.innerHTML = '';
            const videoUrl = productVideos[productId];
            if (videoUrl) {
                const iframe = document.createElement('iframe');
                iframe.src = videoUrl;
                iframe.allow = "autoplay; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                videoContainer.appendChild(iframe);
                videoContainer.style.display = 'block';
            } else {
                videoContainer.style.display = 'none';
            }

            const whatsappLink = `https://wa.me/573205893469?text=Hola,%20me%20interesa%20comprar%20este%20producto:%20${encodeURIComponent(title)} - ${encodeURIComponent(window.location.href.split('#')[0])}`;
            buyButton.href = whatsappLink;

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
                    alert('La función de compartir no está disponible en este navegador.');
                    navigator.clipboard.writeText(`¡Mira este producto: ${title}! ${window.location.href.split('#')[0]}`).then(() => {
                        alert('Enlace copiado al portapapeles.');
                    }).catch(err => {
                        console.error('No se pudo copiar el enlace: ', err);
                    });
                }
            };

            productModal.style.display = "flex";
        });
    });

    // Delegación de eventos para los botones de comprar en las tarjetas
    document.querySelectorAll('.buy-now-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.dataset.productName;
            const whatsappLink = `https://wa.me/573205893469?text=Hola,%20me%20interesa%20comprar%20este%20producto:%20${encodeURIComponent(productName)}`;
            window.open(whatsappLink, '_blank');
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
        videoContainer.innerHTML = '';
    });

    window.addEventListener('click', (event) => {
        if (event.target == productModal) {
            productModal.style.display = "none";
            videoContainer.innerHTML = '';
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
        // Aquí podrías hacer visible un botón o banner para "Instalar App"
        const installButton = document.querySelector('.download-btn');
        if (installButton) {
            installButton.style.display = 'flex'; // O 'block'
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
                    });
                }
            });
        }
    });
});
