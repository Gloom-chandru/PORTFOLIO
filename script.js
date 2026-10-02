/**
 * CHANDRU M - Portfolio Scripts
 * High-performance, accessible, and conflict-free interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
    // ====================================================================
    // 1. THEME SWITCHER (Dark & Light Mode Persistence)
    // ====================================================================
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    const applyTheme = (theme) => {
        if (theme === 'light') {
            htmlElement.classList.add('light-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>';
                themeToggle.setAttribute('aria-label', 'Switch to dark theme');
            }
        } else {
            htmlElement.classList.remove('light-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
                themeToggle.setAttribute('aria-label', 'Switch to light theme');
            }
        }
    };

    // Load saved preference or check system preference
    const savedTheme = localStorage.getItem('portfolioTheme') || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isCurrentlyLight = htmlElement.classList.contains('light-mode');
            const newTheme = isCurrentlyLight ? 'dark' : 'light';
            localStorage.setItem('portfolioTheme', newTheme);
            applyTheme(newTheme);
        });
    }

    // ====================================================================
    // 2. FAST PRELOADER FADE-OUT (Zero Frustration for Recruiters)
    // ====================================================================
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        const dismissLoader = () => {
            loadingScreen.style.transition = 'opacity 0.25s ease, visibility 0.25s ease';
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 250);
        };

        if (document.readyState === 'complete') {
            dismissLoader();
        } else {
            window.addEventListener('load', dismissLoader);
            setTimeout(dismissLoader, 600); // Safety fallback
        }
    }

    // ====================================================================
    // 3. SCROLL PROGRESS BAR & STICKY NAV
    // ====================================================================
    const scrollProgress = document.querySelector('.scroll-progress');
    const navbar = document.querySelector('nav');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (scrollProgress && docHeight > 0) {
            const progress = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Sticky nav styling
        if (navbar) {
            if (scrollTop > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back to top visibility
        if (backToTopBtn) {
            if (scrollTop > 350) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ====================================================================
    // 4. MOBILE HAMBURGER NAVIGATION
    // ====================================================================
    const hamburger = document.getElementById('hamburger');
    const navLinksMenu = document.getElementById('navLinks');

    if (hamburger && navLinksMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('active');
            navLinksMenu.classList.toggle('mobile-open');
            hamburger.setAttribute('aria-expanded', isOpen.toString());
        });

        // Close when clicking any nav link
        navLinksMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinksMenu.classList.remove('mobile-open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinksMenu.classList.contains('mobile-open')) {
                hamburger.classList.remove('active');
                navLinksMenu.classList.remove('mobile-open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ====================================================================
    // 5. ACTIVE NAV LINK ON SCROLL
    // ====================================================================
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    const updateActiveNav = () => {
        const scrollPosition = window.pageYOffset + 140;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navAnchors.forEach(anchor => {
                    if (anchor.getAttribute('href') === `#${sectionId}`) {
                        anchor.classList.add('active');
                    } else {
                        anchor.classList.remove('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ====================================================================
    // 6. ANIMATED IMPACT COUNTERS (Runs once when visible)
    // ====================================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const animateCounters = () => {
        if (countersAnimated) return;
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isDecimal = target % 1 !== 0;
            const suffix = stat.getAttribute('data-suffix') || '';
            const prefix = stat.getAttribute('data-prefix') || '';
            const duration = 1200;
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out quad
                const easeProgress = 1 - (1 - progress) * (1 - progress);
                const current = easeProgress * target;

                stat.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    stat.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
                }
            };
            requestAnimationFrame(update);
        });
        countersAnimated = true;
    };

    const statsSection = document.getElementById('stats');
    if (statsSection && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.2 });
        statsObserver.observe(statsSection);
    } else {
        animateCounters();
    }

    // ====================================================================
    // 7. PROJECT FILTERING
    // ====================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card, .featured-primary-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category') || '';
                const categories = cardCategory.split(' ');

                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ====================================================================
    // 8. CASE STUDY TABS
    // ====================================================================
    const caseTabs = document.querySelectorAll('.case-tab-btn');
    const casePanels = document.querySelectorAll('.case-study-content');

    caseTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');

            caseTabs.forEach(t => t.classList.remove('active'));
            casePanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // ====================================================================
    // 9. CASE STUDY MODAL DEEP-DIVE
    // ====================================================================
    const modalOverlay = document.getElementById('caseStudyModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    const openModalBtns = document.querySelectorAll('[data-open-modal]');

    const caseStudyData = {
        'resume-ai': {
            title: 'Resume AI — Career Gap Analyzer & Skill Roadmap',
            category: 'Generative AI & NLP',
            github: 'https://github.com/Gloom-chandru/resume-ai',
            problem: 'Job seekers struggle to understand why their resumes fail automated ATS systems, and lack actionable, role-aligned skill recommendations.',
            architecture: 'FastAPI/Streamlit Engine + Sentence-BERT Vector Embeddings + Groq LLaMA-3.3 70B for generative semantic rewriting.',
            pipeline: [
                'Resume PDF Parsing & Named Entity Recognition (NER)',
                'Sentence-BERT Semantic Cosine Similarity against Job Descriptions',
                'Identification of critical skill gaps & missing domain competencies',
                'Groq LLaMA-3.3 dynamic prompt synthesis producing actionable ATS bullet optimizations'
            ],
            outcomes: 'Accurately parses multi-page CVs, delivers real-time semantic match scores, and recommends personalized learning milestones with Groq inference in under 1.5 seconds.'
        },
        'pothole-detection': {
            title: 'Road Pothole Detection & Surface Hazard System',
            category: 'Computer Vision & Deep Learning',
            github: 'https://github.com/Gloom-chandru/ROAD-PATHOLE-DETECTION',
            problem: 'Undetected road potholes and surface hazards cause severe vehicle damage and road accidents. Manual municipal inspection is slow and costly.',
            architecture: 'Custom YOLOv8 Object Detection Model + OpenCV Video Pipeline + Bounding Box Localization.',
            pipeline: [
                'Data collection & augmentation of diverse road surface defects and illumination variations',
                'YOLOv8 convolutional backbone training with custom anchor boxes',
                'Real-time frame ingestion via OpenCV video streams',
                'Spatial bounding box regression and confidence thresholding'
            ],
            outcomes: 'Maintains real-time inference (30+ FPS) on live video streams with high recall on pothole detection under changing daylight conditions.'
        },
        'onion-storage': {
            title: 'IoT-Based Smart Produce Storage & Spoilage Prevention',
            category: 'IoT, Sensors & Predictive Analytics',
            github: 'https://github.com/Gloom-chandru',
            problem: 'Agricultural produce like onions suffer significant post-harvest losses due to undetected microclimate humidity spikes and bacterial decay gases in storage.',
            architecture: 'ESP32 Microcontroller + Multi-sensor Array (DHT11, MQ-137 Ammonia/Gas) + Predictive Spoilage Logic + Remote Dashboard.',
            pipeline: [
                'Continuous telemetry logging of temperature, ambient humidity, and VOC gas concentrations',
                'Threshold and drift monitoring in sensor readings to detect early signs of bacterial rotting',
                'Automated ventilation triggering and real-time SMS/MQTT warning dispatch to farmers'
            ],
            outcomes: 'Exhibited at VISAI 2025 (15th International Project Competition) under SDG Industry & Innovation, and developed during the 30-hour KEC Hackathon.'
        }
    };

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectKey = btn.getAttribute('data-open-modal');
            const data = caseStudyData[projectKey];
            if (!data || !modalOverlay || !modalBody) return;

            modalBody.innerHTML = `
                <div class="modal-badge-row" style="margin-bottom: 0.75rem;">
                    <span class="badge badge-cyan">${data.category}</span>
                </div>
                <h2 style="font-family: var(--font-heading); font-size: 1.6rem; margin-bottom: 1rem; color: var(--text-primary);">${data.title}</h2>
                
                <div style="margin-bottom: 1.25rem;">
                    <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.25rem;">Problem Statement</h4>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${data.problem}</p>
                </div>

                <div style="margin-bottom: 1.25rem;">
                    <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.25rem;">Technical Architecture</h4>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${data.architecture}</p>
                </div>

                <div style="margin-bottom: 1.25rem;">
                    <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.5rem;">Pipeline & Workflow</h4>
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem;">
                        ${data.pipeline.map((step, idx) => `
                            <li style="font-size: 0.88rem; color: var(--text-secondary); display: flex; gap: 0.5rem;">
                                <span style="color: var(--accent-cyan); font-weight: 700; font-family: var(--font-mono);">0${idx + 1}.</span>
                                <span>${step}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.25rem;">Outcomes & Validation</h4>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${data.outcomes}</p>
                </div>

                <div style="display: flex; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
                    <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                        <i class="fab fa-github"></i> View GitHub Repository
                    </a>
                </div>
            `;

            modalOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
            closeModal();
        }
    });

    // ====================================================================
    // 10. SCROLL REVEAL (IntersectionObserver for smooth fading)
    // ====================================================================
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.stat-card, .skill-category-card, .project-card, .achievement-card, .timeline-entry, .pillar-card').forEach(el => {
            revealObserver.observe(el);
        });
    }
});
