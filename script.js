const sectionButtons = document.querySelectorAll('.section-btn');
const sections = document.querySelectorAll('.section');
const header = document.querySelector('.header');
const teamGrid = document.getElementById('teamGrid');
const enemyArt = document.querySelectorAll('.enemy-art');
let lastScrollY = window.scrollY;
let parallaxTicking = false;

sectionButtons.forEach((button, targetIndex) => {
    button.addEventListener('click', () => {
        sections.forEach((section, index) => {
            section.style.transform = `translateX(${(index - targetIndex) * 100}%)`;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            sections.forEach(section => section.classList.remove('active'));
            sections[targetIndex].classList.add('active');
        }, 500);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    sections.forEach((section, index) => {
        section.style.transform = `translateX(${index * 100}%)`;
    });
    void document.body.offsetHeight;
    sections.forEach(section => {
        section.style.transition = 'transform 0.4s ease';
    });
});

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    header.style.transform = currentScrollY > lastScrollY && currentScrollY > 100 ? 'translateY(-100%)' : 'translateY(0)';
    lastScrollY = currentScrollY;
    if (!parallaxTicking) {
        requestAnimationFrame(() => {
            updateEnemyParallax();
            parallaxTicking = false;
        });
        parallaxTicking = true;
    }
});

function updateEnemyParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        enemyArt.forEach((img) => {
            img.style.transform = 'translateY(0)';
        });
        return;
    }

    const scrollY = window.scrollY;
    enemyArt.forEach((img) => {
        const speed = Number(img.dataset.parallaxSpeed || 0.06);
        const anchor = Number(img.dataset.parallaxAnchor || 0);
        const deltaFromAnchor = scrollY - anchor;
        img.style.transform = `translateY(${-(deltaFromAnchor * speed)}px)`;
    });
}

function updateEnemyParallaxAnchors() {
    enemyArt.forEach((img) => {
        const previousTransform = img.style.transform;
        img.style.transform = 'translateY(0)';
        const topInDocument = img.getBoundingClientRect().top + window.scrollY;
        const viewportAnchorOffset = window.innerHeight * 0.35;
        img.dataset.parallaxAnchor = String(topInDocument - viewportAnchorOffset);
        img.style.transform = previousTransform;
    });
}

window.addEventListener('resize', () => {
    updateEnemyParallaxAnchors();
    updateEnemyParallax();
});

window.addEventListener('load', () => {
    updateEnemyParallaxAnchors();
    updateEnemyParallax();
});

sectionButtons.forEach((button) => {
    button.addEventListener('click', () => {
        setTimeout(() => {
            updateEnemyParallaxAnchors();
            updateEnemyParallax();
        }, 500);
    });
});

const teamMembers = [
    { name: 'abho', icon: 'images/icon-abho.png', socials: [
        { platform: 'itchio', url: 'https://abho.itch.io/' },
        { platform: 'youtube', url: 'https://www.youtube.com/@aabho' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/abho.bsky.social' }
    ]},
    { name: 'PoeDev', icon: 'images/icon-poedev.png', socials: [
        { platform: 'youtube', url: 'https://www.youtube.com/@poedev08' },
        { platform: 'github', url: 'https://github.com/poec987' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/poedev.bsky.social' },
        { platform: 'x', url: 'https://x.com/poedev08' }
    ]},
    { name: 'Vystel', icon: 'images/icon-vystel.png', socials: [
        { platform: 'soundcloud', url: 'https://soundcloud.com/vystelmusic' },
        { platform: 'newgrounds', url: 'https://vystel.newgrounds.com/' },
        { platform: 'youtube', url: 'https://www.youtube.com/@VystelMusic' },
        { platform: 'github', url: 'https://github.com/vystel' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/vystel.bsky.social' },
        { platform: 'x', url: 'https://x.com/Vystel_' }
    ]},
    { name: 'Jo560hs', icon: 'images/icon-jo560hs.png', socials: [
        { platform: 'website', url: 'https://josupesa.nekoweb.org/' },
        { platform: 'newgrounds', url: 'https://jo560hs.newgrounds.com/' },
        { platform: 'youtube', url: 'https://www.youtube.com/@Jo560hs' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/josupesa.bsky.social' },
        { platform: 'bandcamp', url: 'https://jo560hs.bandcamp.com/' }
    ]},
    { name: 'frost', icon: 'images/icon-frost.png', socials: [
        { platform: 'website', url: 'https://frost.nekoweb.org/' },
        { platform: 'soundcloud', url: 'https://soundcloud.com/frostbitten200' },
        { platform: 'youtube', url: 'https://www.youtube.com/@frost-tm1rx' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/cabbitcentral.bsky.social' },
        { platform: 'x', url: 'https://x.com/cabbitfreedom' },
        { platform: 'bandcamp', url: 'https://olivialapicque.bandcamp.com/' }
    ]},
    { name: 'Jimmy', icon: 'images/icon-jimmy.png', socials: [
        { platform: 'youtube', url: 'https://www.youtube.com/@sirjimjamthefourth' },
        { platform: 'x', url: 'https://x.com/jimmybeebucks' }
    ]},
    { name: 'Psycadeluxe', icon: 'images/icon-psycadeluxe.png', socials: [
        { platform: 'youtube', url: 'https://www.youtube.com/@Psycadelux' },
        { platform: 'bluesky', url: 'https://bsky.app/profile/psycadeluxe.bsky.social' }
    ]}
];

function createSocialButton(platform, url) {
    const label = platform.charAt(0).toUpperCase() + platform.slice(1);
    return `<a class="icon-btn" href="${url}" target="_blank" rel="noopener noreferrer"><img src="images/socials-${platform}.png" alt="${label}"></a>`;
}

teamMembers.forEach(member => {
    const socials = member.socials.map(({ platform, url }) => createSocialButton(platform, url)).join('');
    teamGrid.insertAdjacentHTML('beforeend', `
        <div class="team-card">
            <img class="team-icon" src="${member.icon}" alt="${member.name}">
            <h3>${member.name}</h3>
            ${socials ? `<div class="team-socials">${socials}</div>` : ''}
        </div>
    `);
});
