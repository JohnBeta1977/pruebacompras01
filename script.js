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
        });

        // Cerrar el menú si se hace clic en un enlace (opcional)
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
            });
        });
    }

    // --- Botones de Comprar a WhatsApp ---
    const buyButtons = document.querySelectorAll('.buy-btn');
    const whatsappNumber = '573205893469'; // Tu número incluyendo el código de país (57 para Colombia)

    buyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productName = event.target.dataset.product;
            const message = `Hola, estoy interesado en comprar el siguiente producto: ${encodeURIComponent(productName)}. Por favor, dame más información.`;
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    });
});

// Opcional: Detectar si el usuario está añadiendo la PWA a su pantalla de inicio
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (event) => {
    // Evitar que Chrome muestre automáticamente el prompt de instalación
    event.preventDefault();
    // Guardar el evento para mostrarlo más tarde
    deferredPrompt = event;
    console.log('👍', 'beforeinstallprompt', deferredPrompt);
    // Puedes aquí mostrar un botón o elemento de UI para invitar al usuario a instalar
});

window.addEventListener('appinstalled', (event) => {
    console.log('👍', 'appinstalled', event);
    // Limpiar el deferredPrompt para que no se pueda usar de nuevo
    deferredPrompt = null;
    // Puedes mostrar un mensaje de éxito o hacer un seguimiento aquí
});
