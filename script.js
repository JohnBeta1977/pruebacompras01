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

    function changeSlide(
