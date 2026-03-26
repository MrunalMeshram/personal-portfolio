/* ================================================
   Portfolio JavaScript
   Constellation Canvas + Interactions
   ================================================ */

(function () {
    'use strict';

    // ==================== CONSTELLATION CANVAS ====================
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles, mouse;

        mouse = { x: -9999, y: -9999 };

        function resize() {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        }

        function createParticles() {
            const count = Math.floor((width * height) / 12000);
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    r: Math.random() * 1.8 + 0.5,
                    alpha: Math.random() * 0.5 + 0.3
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                // Mouse proximity glow
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = dx * dx + dy * dy;
                const glowRadius = 160;
                const glowFactor = dist < glowRadius * glowRadius
                    ? 1 - Math.sqrt(dist) / glowRadius
                    : 0;

                const alpha = p.alpha + glowFactor * 0.5;
                const radius = p.r + glowFactor * 2;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(240, 165, 0, ${alpha})`;
                ctx.fill();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const ddx = p.x - p2.x;
                    const ddy = p.y - p2.y;
                    const d2 = ddx * ddx + ddy * ddy;

                    if (d2 < 18000) {
                        const lineAlpha = (1 - d2 / 18000) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(240, 165, 0, ${lineAlpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', function () {
            resize();
            createParticles();
        });

        canvas.addEventListener('mousemove', function (e) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', function () {
            mouse.x = -9999;
            mouse.y = -9999;
        });

        resize();
        createParticles();
        draw();
    }

    // ==================== TYPING ANIMATION ====================
    const roleEl = document.getElementById('roleText');
    if (roleEl) {
        const roles = [
            'Software Engineer',
            'Data Engineer',
            'AI Practitioner',
            'Backend Developer',
            'BI & Analytics Expert',
            'Cloud Solutions Builder',
            'Problem Solver'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;
        let pauseCounter = 0;

        function typeRole() {
            const current = roles[roleIndex];

            if (!deleting) {
                roleEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === current.length) {
                    pauseCounter = 0;
                    deleting = true;
                    setTimeout(typeRole, 2000);
                    return;
                }
                setTimeout(typeRole, 80);
            } else {
                roleEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(typeRole, 400);
                    return;
                }
                setTimeout(typeRole, 40);
            }
        }

        setTimeout(typeRole, 1000);
    }

    // ==================== NAVBAR SCROLL ====================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    });

    // ==================== ACTIVE NAV LINK ====================
    const sections = document.querySelectorAll('.section, #hero');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(function (section) {
        sectionObserver.observe(section);
    });

    // ==================== THEME TOGGLE ====================
    const themeBubble = document.getElementById('themeBubble');
    if (themeBubble) {
        // Restore saved theme
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        }

        themeBubble.addEventListener('click', function () {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            if (isLight) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // ==================== MOBILE NAV TOGGLE ====================
    const navToggle = document.getElementById('navToggle');
    const navLinksEl = document.getElementById('navLinks');

    if (navToggle && navLinksEl) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('active');
            navLinksEl.classList.toggle('open');
        });

        navLinksEl.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navToggle.classList.remove('active');
                navLinksEl.classList.remove('open');
            });
        });
    }

    // ==================== SCROLL REVEAL ====================
    const revealElements = document.querySelectorAll('[data-aos], .timeline-item, .education-card');

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(function (el) {
        revealObserver.observe(el);
    });

    // ==================== PROJECT FILTER ====================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(function (card) {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

})();
