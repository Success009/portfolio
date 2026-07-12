// Initialize Lucide Icons First
lucide.createIcons();

gsap.registerPlugin(ScrollTrigger);

// Navigation Background Shift
gsap.to('.nav', {
    scrollTrigger: {
        start: 'top top',
        end: '+=100',
        toggleActions: 'play none none reverse'
    },
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    duration: 0.3
});

// Hero Section Entry Timeline
const heroTl = gsap.timeline();
heroTl.from('.hero-text h1', { opacity: 0, y: 50, duration: 1, delay: 0.3 })
      .from('.hero-text .subtitle', { opacity: 0, y: 30, duration: 0.8 }, '-=0.5')
      .from('.hero-text p', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
      .from('.hero-stats', { opacity: 0, scale: 0.8, duration: 0.8 }, '-=0.3')
      .from('.hero-buttons', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
      .from('.profile-img', { opacity: 0, scale: 0.8, duration: 1 }, '-=0.8');

// Section Content Reveal Pattern
const revealOnScroll = (elements, xValue) => {
    elements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: xValue,
            duration: 1,
            ease: "power2.out"
        });
    });
};

// Apply Revealing Patterns (Responsive)
const isMobile = window.innerWidth <= 768;

if (!isMobile) {
    revealOnScroll(['.about-text', '.skill-card', '.contact-text'], -50);
    revealOnScroll(['.about-highlights', '.project-card', '.contact-details'], 50);
} else {
    // Simple fade up for mobile to prevent horizontal layout issues
    const mobileElements = document.querySelectorAll('.about-text, .skill-card, .contact-text, .about-highlights, .project-card, .contact-details');
    mobileElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power2.out"
        });
    });
}

// Experience Timeline Sequential Reveal (Lighter for Mobile)
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
    gsap.from(item.querySelector('.timeline-content'), {
        scrollTrigger: {
            trigger: item,
            start: isMobile ? 'top 90%' : 'top 85%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: isMobile ? 20 : 50,
        scale: isMobile ? 1 : 0.95,
        duration: isMobile ? 0.7 : 1,
        ease: isMobile ? "power2.out" : "back.out(1.7)"
    });
    
    gsap.from(item.querySelector('.timeline-dot'), {
        scrollTrigger: {
            trigger: item,
            start: isMobile ? 'top 90%' : 'top 85%',
        },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: 0.1
    });
});

// Mobile Nav Active State Handler
if (isMobile) {
    const navItems = document.querySelectorAll('.mobile-nav-item');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
}

// Smooth Scroll for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.classList.contains('mobile-nav-item') && !this.getAttribute('href').startsWith('#')) return;
        
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - (isMobile ? 20 : 70), 
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Progress Bar
const createProgressBar = () => {
    const bar = document.createElement('div');
    bar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--accent);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = scrolled + '%';
    });
};

createProgressBar();

// Handle Window Resize / Refresh
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
});
