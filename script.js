// Section switching with fade-in
const buttons = document.querySelectorAll('.section-btn');
const sections = document.querySelectorAll('.section');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.section;
        sections.forEach(section => {
            if (section.id === target) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
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
