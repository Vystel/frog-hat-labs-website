// Side scroll section switching effect
const buttons = document.querySelectorAll('.section-btn');
const sections = document.querySelectorAll('.section');

buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {

        sections.forEach((section, i) => {
            section.classList.remove('active');
            section.style.transform = `translateX(${(i - index) * 100}%)`;
        });

        sections[index].classList.add('active');

        // Smooth-scroll the page to the top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');

    sections.forEach((section, index) => {
        section.style.transform = `translateX(${index * 100}%)`;
    });
    
    // Enable transition AFTER layout is calculated
    void document.body.offsetHeight;
    sections.forEach(section => {
        section.style.transition = 'transform 0.4s ease';
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

// Team members data
const teamMembers = [
    {
        name: "abho",
        icon: "images/icon-abho.png",
        socials: [
            { platform: "itchio", url: "https://abho.itch.io/" },
            { platform: "youtube", url: "https://www.youtube.com/@aabho" },
            { platform: "bluesky", url: "https://bsky.app/profile/abho.bsky.social" }
        ]
    },
    {
        name: "PoeDev",
        icon: "images/icon-poedev.png",
        socials: [
            { platform: "youtube", url: "https://www.youtube.com/@poedev08" },
            { platform: "github", url: "https://github.com/poec987"},
            { platform: "bluesky", url: "https://bsky.app/profile/poedev.bsky.social" },
            { platform: "x", url: "https://x.com/poedev08" },
        ]
    },
    {
        name: "Vystel",
        icon: "images/icon-vystel.png",
        socials: [
            { platform: "soundcloud", url: "https://soundcloud.com/vystelmusic" },
            { platform: "newgrounds", url: "https://jo560hs.newgrounds.com/" },
            { platform: "youtube", url: "https://www.youtube.com/@VystelMusic" },
            { platform: "github", url: "https://github.com/vystel"},
            { platform: "bluesky", url: "https://bsky.app/profile/vystel.bsky.social" },
            { platform: "x", url: "https://x.com/Vystel_" }
        ]
    },
    {
        name: "Jo560hs",
        icon: "images/icon-jo560hs.png",
        socials: [
            { platform: "website", url: "https://josupesa.nekoweb.org/" },
            { platform: "newgrounds", url: "https://jo560hs.newgrounds.com/" },
            { platform: "youtube", url: "https://www.youtube.com/@Jo560hs" },
            { platform: "bluesky", url: "https://bsky.app/profile/josupesa.bsky.social" }
        ]
    },
    {
        name: "frost",
        icon: "images/icon-frost.png",
        socials: [
            { platform: "website", url: "https://frost.nekoweb.org/" },
            { platform: "soundcloud", url: "https://soundcloud.com/frostbitten200" },
            { platform: "youtube", url: "https://www.youtube.com/@frost-tm1rx" },
            { platform: "bluesky", url: "https://bsky.app/profile/cabbitcentral.bsky.social" },
            { platform: "x", url: "https://x.com/cabbitfreedom" }
        ]
    },
    {
        name: "Jimmy",
        icon: "images/icon-jimmy.png",
        socials: [
            { platform: "youtube", url: "https://www.youtube.com/@sirjimjamthefourth" },
            { platform: "x", url: "https://x.com/jimmybeebucks" }
        ]
    },
    {
        name: "Psycadeluxe",
        icon: "images/icon-psycadeluxe.png",
        socials: [
            { platform: "youtube", url: "https://www.youtube.com/@Psycadelux" },
            { platform: "bluesky", url: "https://bsky.app/profile/psycadeluxe.bsky.social" },
        ]
    }
];

function createSocialButton(platform, url) {
    return `
        <a href="${url}" target="_blank">
            <button class="icon-btn">
                <img src="images/socials-${platform}.png" alt="${platform.charAt(0).toUpperCase() + platform.slice(1)}">
            </button>
        </a>
    `;
}

// Populate the team grid
const teamGrid = document.getElementById("teamGrid");
teamMembers.forEach(member => {
    const socialsHTML = member.socials.map(s => createSocialButton(s.platform, s.url)).join("");
    const memberHTML = `
        <div class="team-card">
            <img class="team-icon" src="${member.icon}" alt="${member.name}">
            <h3>${member.name}</h3>
            ${socialsHTML ? `<div class="team-socials">${socialsHTML}</div>` : ""}
        </div>
    `;
    teamGrid.insertAdjacentHTML("beforeend", memberHTML);
});