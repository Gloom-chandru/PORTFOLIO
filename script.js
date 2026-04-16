// Advanced animations and interactive effects
document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // CUSTOM CURSOR
    // ============================================
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor with smooth follow effect
    function animateCursor() {
        // Cursor follows directly
        cursorX += (mouseX - cursorX) * 0.9;
        cursorY += (mouseY - cursorY) * 0.9;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower lags behind
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .cta-button, .resume-button, .project-card, .skill-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorFollower.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorFollower.classList.remove('cursor-hover');
        });
    });

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================
    const scrollProgress = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = progress + '%';
    });

    // ============================================
    // ANIMATED STATS COUNTER
    // ============================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    }

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((statNumber, index) => {
                    setTimeout(() => {
                        animateCounter(statNumber);
                    }, index * 200);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('#stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    function createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        document.body.appendChild(particleContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
            particleContainer.appendChild(particle);
        }
    }
    createParticles();

    // ============================================
    // FLOATING SHAPES
    // ============================================
    function createFloatingShapes() {
        const shapesContainer = document.createElement('div');
        shapesContainer.className = 'floating-shapes';
        document.querySelector('#hero').appendChild(shapesContainer);

        const shapes = ['circle', 'square', 'triangle'];
        for (let i = 0; i < 15; i++) {
            const shape = document.createElement('div');
            shape.className = `floating-shape ${shapes[Math.floor(Math.random() * shapes.length)]}`;
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            shape.style.animationDelay = Math.random() * 10 + 's';
            shape.style.animationDuration = (Math.random() * 15 + 10) + 's';
            shapesContainer.appendChild(shape);
        }
    }
    createFloatingShapes();

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Stagger timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    const items = document.querySelectorAll('.timeline-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 200);
                    });
                }

                // Stagger skill cards
                if (entry.target.classList.contains('skill-card')) {
                    const cards = document.querySelectorAll('.skill-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 100);
                    });
                }

                // Stagger project cards
                if (entry.target.classList.contains('project-card')) {
                    const cards = document.querySelectorAll('.project-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 150);
                    });
                }

                // Stagger social icons
                if (entry.target.classList.contains('social-icon')) {
                    const icons = document.querySelectorAll('.social-icon');
                    icons.forEach((icon, index) => {
                        setTimeout(() => {
                            icon.classList.add('animate');
                        }, index * 100);
                    });
                }

                // Stagger stat cards
                if (entry.target.classList.contains('stat-card')) {
                    const cards = document.querySelectorAll('.stat-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in, .timeline-item, .skill-card, .project-card, .social-icon, .stat-card');
    fadeElements.forEach(el => observer.observe(el));

    // ============================================
    // MAGNETIC BUTTONS
    // ============================================
    const magneticButtons = document.querySelectorAll('.cta-button, .resume-button, .contact-page-button, .submit-button');
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0) scale(1)';
        });
    });

    // ============================================
    // NAVIGATION ACTIVE STATE & SMOOTH SCROLL
    // ============================================
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    function updateActiveNav() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    const hamburger = document.querySelector('#hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            if (navLinksContainer && navLinksContainer.classList.contains('mobile-open')) {
                navLinksContainer.classList.remove('mobile-open');
                hamburger.classList.remove('active');
            }
        });
    });

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('mobile-open');
        });
    }

    // ============================================
    // PARALLAX EFFECT
    // ============================================
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');

        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        // Parallax for floating shapes
        const shapes = document.querySelectorAll('.floating-shape');
        shapes.forEach((shape, index) => {
            const speed = (index % 3 + 1) * 0.1;
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // ============================================
    // NAVBAR BACKGROUND ON SCROLL
    // ============================================
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(15, 23, 42, 0.95)';
            nav.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
        } else {
            nav.style.background = 'rgba(15, 23, 42, 0.8)';
            nav.style.boxShadow = 'none';
        }
    });

    // ============================================
    // PROJECT CARDS TILT EFFECT
    // ============================================
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    // ============================================
    // SKILL CARDS MICRO-INTERACTIONS
    // ============================================
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            const progressBar = this.querySelector('.skill-progress');
            if (progressBar) {
                progressBar.style.filter = 'brightness(1.2)';
                progressBar.style.boxShadow = '0 0 20px rgba(255, 107, 53, 0.6)';
            }
        });

        card.addEventListener('mouseleave', function () {
            const progressBar = this.querySelector('.skill-progress');
            if (progressBar) {
                progressBar.style.filter = 'brightness(1)';
                progressBar.style.boxShadow = 'none';
            }
        });
    });

    // ============================================
    // TYPING EFFECT FOR HERO SUBTITLE
    // ============================================
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        let index = 0;

        setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (index < text.length) {
                    subtitle.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, 1000);
    }

    // ============================================
    // RIPPLE EFFECT ON CLICK
    // ============================================
    function createRipple(e) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';
        document.body.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }

    document.addEventListener('click', createRipple);

    // ============================================
    // TEXT REVEAL ANIMATION
    // ============================================
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        title.innerHTML = text.split('').map(letter =>
            `<span class="letter">${letter === ' ' ? '&nbsp;' : letter}</span>`
        ).join('');
    });

    // Console welcome message
    console.log('%c🚀 Portfolio Loaded with Pro Features!', 'color: #ff6b35; font-size: 20px; font-weight: bold;');
    console.log('%c✨ Scroll Progress • Animated Stats • Download Resume • Custom Cursor • 3D Transforms', 'color: #f7931e; font-size: 14px;');
});
