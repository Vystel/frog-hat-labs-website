const navBtns = document.querySelectorAll('.section-btn');
const sections = document.querySelectorAll('.section');
const siteHeader = document.querySelector('.header');
const teamMembersGrid = document.getElementById('teamGrid');
const enemyArts = document.querySelectorAll('.enemy-art');
const bulletsLayer = document.querySelector('.falling-bullets');
const voidfaceSection = document.getElementById('VOIDFACE');

const BULLET_IMAGES = Array.from({ length: 6 }, (_, index) => `/images/bullets/bullet${index}.png`);
const BULLET_COUNT = 32;

const getRandomRange = (min, max) => min + Math.random() * (max - min);
const getRandomBulletImage = () => BULLET_IMAGES[Math.floor(Math.random() * BULLET_IMAGES.length)];

const ROUTES = {
    '/VOIDFACE': 0,
    '/about-us': 1,
};

const INDEX_TO_PATH = Object.fromEntries(
    Object.entries(ROUTES).map(([path, index]) => [index, path])
);

function getInitialSection(pathname) {
    const clean = pathname.replace(/\/$/, '') || '/';
    return ROUTES[clean] ?? 0;
}

document.addEventListener('DOMContentLoaded', () => {
    // put the sections side-by-side horizontally
    sections.forEach((section, index) => {
        section.style.transform = `translateX(${index * 100}%)`;
    });
    void document.body.offsetHeight;
    sections.forEach(section => section.style.transition = 'transform 0.4s ease');

    const initialIndex = getInitialSection(window.location.pathname);
    navigateToSection(initialIndex, { pushState: false, animate: false });
});

// section sliding
function navigateToSection(targetIndex, { pushState = true, animate = true } = {}) {
    // slide to the current section index
    sections.forEach((section, index) => {
        section.style.transform = `translateX(${(index - targetIndex) * 100}%)`;
    });

    // scroll back to top smoothly
    window.scrollTo({ top: 0, behavior: animate ? 'smooth' : 'instant' });

    setTimeout(() => {
        sections.forEach(section => section.classList.remove('active'));
        sections[targetIndex].classList.add('active');
        refreshParallaxAnchors();
    }, animate ? 500 : 0);

    if (pushState) {
        const path = INDEX_TO_PATH[targetIndex] ?? '/';
        history.pushState({ sectionIndex: targetIndex }, '', path);
    }
}

navBtns.forEach((button, targetIndex) => {
    button.addEventListener('click', () => {
        navigateToSection(targetIndex);
    });
});

window.addEventListener('popstate', (event) => {
    const targetIndex = event.state?.sectionIndex
        ?? getInitialSection(window.location.pathname);
    navigateToSection(targetIndex, { pushState: false });
});

// hide header on scroll
let lastScroll = window.scrollY;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const isScrollingDown = currentScroll > lastScroll;
    
    siteHeader.style.transform =
        isScrollingDown && currentScroll > 100 ? 'translateY(-100%)' : 'translateY(0)';
    
    lastScroll = currentScroll;
});

// parallax
function refreshParallaxAnchors() {
    enemyArts.forEach(image => {
        image.style.transform = 'translateY(0)';
        const absoluteTop = image.getBoundingClientRect().top + window.scrollY;
        image.dataset.parallaxAnchor = absoluteTop - window.innerHeight * 0.35;
    });
}

function applyParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        enemyArts.forEach(image => image.style.transform = 'translateY(0)');
        return;
    }
    const currentScrollY = window.scrollY;
    const intensity = window.innerWidth < 900 ? 0.3 : 1.0;
    enemyArts.forEach(image => {
        const baseSpeed = Number(image.dataset.parallaxSpeed ?? 0.06);
        const anchorPoint = Number(image.dataset.parallaxAnchor ?? 0);
        const movementSpeed = baseSpeed * intensity;
        
        // move image vertically based on scroll distance from its anchor
        const offset = -(currentScrollY - anchorPoint) * movementSpeed;
        image.style.transform = `translateY(${offset}px)`;
    });
}

window.addEventListener('scroll', applyParallax, { passive: true });

const bullets = [];

// find the boundaries of the voidface section for bullets
function getBulletBounds() {
    if (!voidfaceSection) return { top: 0, height: window.innerHeight };
    const rect = voidfaceSection.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;
    return { top: absoluteTop, height: Math.max(rect.height, window.innerHeight) };
}

// move bullet to the top of the container
function resetBullet(bullet) {
    const { top } = getBulletBounds();
    bullet.xPercentage = Math.random();
    bullet.yPosition = top - 120 - getRandomRange(0, 200);
    bullet.fallSpeed = getRandomRange(0.4, 1.2);
    bullet.wavePhase = getRandomRange(0, Math.PI * 2);
    bullet.baseRotation = getRandomRange(-180, 180);
    bullet.element.src = getRandomBulletImage();
}

function initBullets() {
    if (!bulletsLayer || bullets.length) return;

    const { top, height } = getBulletBounds();

    // create bullets
    for (let i = 0; i < BULLET_COUNT; i++) {
        const bulletImage = Object.assign(document.createElement('img'), {
            className: 'falling-bullet', alt: '', src: getRandomBulletImage()
        });

        const bulletObject = {
            element: bulletImage,
            xPercentage: Math.random(),
            yPosition: top + getRandomRange(0, height),
            fallSpeed: getRandomRange(0.4, 1.2),
            baseRotation: getRandomRange(-180, 180),
            wavePhase: getRandomRange(0, Math.PI * 2)
        };

        bullets.push(bulletObject);
        bulletsLayer.appendChild(bulletImage);
    }

    let lastTimestamp = performance.now();

    // main falling logic
    const updateBullets = (currentTime) => {
        const deltaTime = Math.min(33, currentTime - lastTimestamp);
        lastTimestamp = currentTime;
        
        const timeFactor = currentTime * 0.0025;
        const { top, height } = getBulletBounds();
        const viewportWidth = window.innerWidth;

        for (const bullet of bullets) {
            // downward movement
            bullet.yPosition += bullet.fallSpeed * deltaTime * 0.06;

            // loop bullet back to top if it goes past the bottom
            if (bullet.yPosition > top + height + 140) {
                resetBullet(bullet);
            }

            // move bullets back and forth with angle and horizontal movement
            const horizontalOffset = bullet.xPercentage * viewportWidth + Math.sin(currentTime * 0.0018 + bullet.wavePhase) * 4;
            const currentRotation = bullet.baseRotation + Math.sin(timeFactor + bullet.wavePhase) * 15;

            bullet.element.style.transform = `translate(${horizontalOffset}px, ${bullet.yPosition}px) rotate(${currentRotation}deg)`;
        }

        applyParallax();
        requestAnimationFrame(updateBullets);
    };

    requestAnimationFrame(updateBullets);
}

window.addEventListener('resize', refreshParallaxAnchors);
window.addEventListener('load', () => {
    refreshParallaxAnchors();
    initBullets();
});

const teamMembers = [
    { name: 'abho', icon: '/images/team/icon-abho.png', socials: [
        { platform: 'itchio', url: 'https://abho.itch.io/' },
        { platform: 'youtube', url: 'https://www.youtube.com/@aabho' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/abho.bsky.social' }]},
    { name: 'PoeDev', icon: '/images/team/icon-poedev.png', socials: [
        { platform: 'youtube', url: 'https://www.youtube.com/@poedev08' },
        { platform: 'github', url: 'https://github.com/poec987' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/poedev.bsky.social' },
        { platform: 'x', url: 'https://x.com/poedev08' }]},
    { name: 'Vystel', icon: '/images/team/icon-vystel.png', socials: [
        { platform: 'soundcloud', url: 'https://soundcloud.com/vystelmusic' },
        { platform: 'newgrounds', url: 'https://vystel.newgrounds.com/' },
        { platform: 'youtube', url: 'https://www.youtube.com/@VystelMusic' },
        { platform: 'github', url: 'https://github.com/vystel' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/vystel.bsky.social' },
        { platform: 'x', url: 'https://x.com/Vystel_' }]},
    { name: 'Jo560hs', icon: '/images/team/icon-jo560hs.png', socials: [
        { platform: 'website', url: 'https://josupesa.nekoweb.org/' },
        { platform: 'newgrounds', url: 'https://jo560hs.newgrounds.com/' },
        { platform: 'youtube', url: 'https://www.youtube.com/@Jo560hs' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/josupesa.bsky.social' },
        { platform: 'bandcamp', url: 'https://jo560hs.bandcamp.com/' }]},
    { name: 'frost', icon: '/images/team/icon-frost.png', socials: [
        { platform: 'website', url: 'https://frost.nekoweb.org/' },
        { platform: 'soundcloud', url: 'https://soundcloud.com/frostbitten200' },
        { platform: 'youtube', url: 'https://www.youtube.com/@frost-tm1rx' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/cabbitcentral.bsky.social' },
        { platform: 'x', url: 'https://x.com/cabbitfreedom' },
        { platform: 'bandcamp', url: 'https://olivialapicque.bandcamp.com/' }]},
    { name: 'Jimmy', icon: '/images/team/icon-jimmy.png', socials: [
        { platform: 'youtube', url: 'https://www.youtube.com/@sirjimjamthefourth' },
        { platform: 'x', url: 'https://x.com/jimmybeebucks' }]},
    { name: 'Psycadeluxe', icon: '/images/team/icon-psycadeluxe.png', socials: [
        { platform: 'youtube', url: 'https://www.youtube.com/@Psycadelux' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/psycadeluxe.bsky.social' }]},
];

teamMembersGrid.insertAdjacentHTML('beforeend', teamMembers.map(({ name, icon, socials }) => `
    <div class="team-card">
        <img class="team-icon" src="${icon}" alt="${name}">
        <h3>${name}</h3>
        ${socials.length ? `<div class="team-socials">${socials.map(({ platform, url }) =>
            `<a class="icon-btn" href="${url}" target="_blank" rel="noopener noreferrer">
                <img src="/images/socials/socials-${platform}.png" alt="${platform}">
            </a>`).join('')}</div>` : ''}
    </div>`).join(''));