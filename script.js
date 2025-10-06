// Section switching with side scroll effect
const buttons = document.querySelectorAll('.section-btn');
const container = document.querySelector('.sections-container');

buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        container.style.transform = `translateX(-${index * 100}%)`;
        // Smooth-scroll the page to the top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});


// Hide header on scroll down, show on scroll up
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
});
