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

    // 4. Cambio de imágenes de productos alternas
    document.querySelectorAll('.product-card').forEach(card => {
        const mainImage = card.querySelector('.product-images .main-image');
        const altImages = card.querySelectorAll('.product-images .alt-images img');

        altImages.forEach(altImg => {
            altImg.addEventListener('click', () => {
                // Guarda la ruta de la imagen principal actual
                const currentMainSrc = mainImage.src;
                // Intercambia la imagen principal con la alterna clickeada
                mainImage.src = altImg.src;
                altImg.src = currentMainSrc;
            });
        });
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
        // Previene que Chrome 67 y anteriores muestren automáticamente el prompt
        e.preventDefault();
        // Guarda el evento para poder dispararlo después
        deferredPrompt = e;
        console.log('Evento beforeinstallprompt disparado. Puede mostrar su botón de instalación.');
        // Aquí podrías mostrar un botón o banner para "Instalar App"
        // Por ejemplo: const installButton = document.getElementById('installAppButton');
        // if (installButton) installButton.style.display = 'block';
    });

    // Si tuvieras un botón de instalación personalizado, podrías hacer algo como:
    // document.getElementById('installAppButton').addEventListener('click', () => {
    //     if (deferredPrompt) {
    //         deferredPrompt.prompt();
    //         deferredPrompt.userChoice.then((choiceResult) => {
    //             if (choiceResult.outcome === 'accepted') {
    //                 console.log('Usuario aceptó instalar la PWA');
    //             } else {
    //                 console.log('Usuario rechazó instalar la PWA');
    //             }
    //             deferredPrompt = null; // Limpia el evento
    //         });
    //     }
    // });
});
