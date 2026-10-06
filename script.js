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

        document.querySelectorAll('.stat-card, .skill-category-card, .project-card, .achievement-card, .timeline-entry, .pillar-card, .lab-control-card, .lab-telemetry-card, .yolo-viewport-card, .iot-graph-card').forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ====================================================================
    // 11. NOVELTY: SYNTHESIZED WEB AUDIO FEEDBACK (Native Web Audio API)
    // ====================================================================
    const SoundFX = (() => {
        let audioCtx = null;
        let enabled = localStorage.getItem('portfolioSound') === 'true';

        const getContext = () => {
            if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            return audioCtx;
        };

        return {
            isEnabled: () => enabled,
            toggle: () => {
                enabled = !enabled;
                localStorage.setItem('portfolioSound', enabled.toString());
                return enabled;
            },
            click: () => {
                if (!enabled) return;
                try {
                    const ctx = getContext();
                    if (!ctx) return;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(800, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.04);
                    gain.gain.setValueAtTime(0.06, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.04);
                } catch (e) {}
            },
            scan: () => {
                if (!enabled) return;
                try {
                    const ctx = getContext();
                    if (!ctx) return;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(320, ctx.currentTime);
                    osc.frequency.linearRampToValueAtTime(950, ctx.currentTime + 0.15);
                    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.35);
                    gain.gain.setValueAtTime(0.08, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.35);
                } catch (e) {}
            },
            alert: () => {
                if (!enabled) return;
                try {
                    const ctx = getContext();
                    if (!ctx) return;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(440, ctx.currentTime);
                    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
                    gain.gain.setValueAtTime(0.06, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.2);
                } catch (e) {}
            },
            babyGiggle: () => {
                if (!enabled) return;
                try {
                    const ctx = getContext();
                    if (!ctx) return;
                    const pitches = [580, 720, 880, 1050, 1280];
                    pitches.forEach((f, idx) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sine';
                        const t = ctx.currentTime + idx * 0.045;
                        osc.frequency.setValueAtTime(f, t);
                        osc.frequency.exponentialRampToValueAtTime(f * 1.2, t + 0.038);
                        gain.gain.setValueAtTime(0.07, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(t);
                        osc.stop(t + 0.042);
                    });
                } catch (e) {}
            },
            cookieChime: () => {
                if (!enabled) return;
                try {
                    const ctx = getContext();
                    if (!ctx) return;
                    const notes = [523.25, 659.25, 783.99, 1046.5];
                    notes.forEach((freq, i) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'triangle';
                        const t = ctx.currentTime + i * 0.07;
                        osc.frequency.setValueAtTime(freq, t);
                        gain.gain.setValueAtTime(0.08, t);
                        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(t);
                        osc.stop(t + 0.3);
                    });
                } catch (e) {}
            }
        };
    })();

    // ====================================================================
    // 12. NOVELTY: INTERACTIVE NEURAL SYNAPSE CANVAS (Hero Particle Mesh)
    // ====================================================================
    const initNeuralCanvas = () => {
        const canvas = document.getElementById('neuralCanvas');
        const heroSection = document.getElementById('hero');
        if (!canvas || !heroSection) return;

        const ctx = canvas.getContext('2d');
        let width = canvas.width = heroSection.clientWidth;
        let height = canvas.height = heroSection.clientHeight;

        const isLightMode = () => document.documentElement.classList.contains('light-mode');

        let particles = [];
        const count = Math.min(Math.floor((width * height) / 16000), 55);

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.65,
                vy: (Math.random() - 0.5) * 0.65,
                radius: Math.random() * 1.8 + 1.2,
                type: Math.random() > 0.4 ? 'cyan' : 'purple'
            });
        }

        let mouse = { x: -1000, y: -1000, active: false };

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.active = true;
        }, { passive: true });

        heroSection.addEventListener('mouseleave', () => {
            mouse.active = false;
        });

        window.addEventListener('resize', () => {
            if (heroSection) {
                width = canvas.width = heroSection.clientWidth;
                height = canvas.height = heroSection.clientHeight;
            }
        }, { passive: true });

        let isHeroVisible = true;
        if ('IntersectionObserver' in window) {
            const heroObserver = new IntersectionObserver(([entry]) => {
                isHeroVisible = entry.isIntersecting;
            }, { threshold: 0.05 });
            heroObserver.observe(heroSection);
        }

        let impulse = 0;

        const render = () => {
            if (isHeroVisible && width > 0 && height > 0) {
                ctx.clearRect(0, 0, width, height);
                const light = isLightMode();
                const maxDist = 110;
                impulse = (impulse + 0.012) % 1;

                for (let i = 0; i < particles.length; i++) {
                    const p1 = particles[i];

                    // Draw connecting synapses
                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < maxDist) {
                            const alpha = (1 - dist / maxDist) * (light ? 0.22 : 0.26);
                            ctx.strokeStyle = p1.type === 'cyan' 
                                ? `rgba(6, 182, 212, ${alpha})` 
                                : `rgba(139, 92, 246, ${alpha})`;
                            ctx.lineWidth = 0.85;
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();

                            // Periodic neural pulse along axon
                            if (i % 3 === 0) {
                                const px = p1.x + (p2.x - p1.x) * impulse;
                                const py = p1.y + (p2.y - p1.y) * impulse;
                                ctx.fillStyle = light ? 'rgba(59, 130, 246, 0.75)' : 'rgba(56, 189, 248, 0.9)';
                                ctx.beginPath();
                                ctx.arc(px, py, 1.4, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        }
                    }

                    // Mouse interaction
                    if (mouse.active) {
                        const mdx = p1.x - mouse.x;
                        const mdy = p1.y - mouse.y;
                        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                        if (mdist < 140) {
                            const malpha = (1 - mdist / 140) * 0.4;
                            ctx.strokeStyle = `rgba(6, 182, 212, ${malpha})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(p1.x, p1.y);
                            ctx.lineTo(mouse.x, mouse.y);
                            ctx.stroke();

                            p1.x -= (mdx / mdist) * 0.3;
                            p1.y -= (mdy / mdist) * 0.3;
                        }
                    }

                    p1.x += p1.vx;
                    p1.y += p1.vy;

                    if (p1.x < 0 || p1.x > width) p1.vx *= -1;
                    if (p1.y < 0 || p1.y > height) p1.vy *= -1;

                    ctx.fillStyle = p1.type === 'cyan'
                        ? (light ? '#0284c7' : '#06b6d4')
                        : (light ? '#7c3aed' : '#8b5cf6');
                    ctx.beginPath();
                    ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            requestAnimationFrame(render);
        };

        render();
    };
    initNeuralCanvas();

    // ====================================================================
    // 13. NOVELTY: RECRUITER LENS (1-Click Role Alignment)
    // ====================================================================
    const initRecruiterLens = () => {
        const lensButtons = document.querySelectorAll('.lens-btn');
        const intelText = document.getElementById('lensIntelText');
        const heroDesc = document.getElementById('heroDescription');
        const projectCards = document.querySelectorAll('.project-card, .featured-primary-card');
        const filterBtns = document.querySelectorAll('.filter-btn');

        const narratives = {
            all: {
                intel: 'Viewing full multidimensional portfolio across ML pipelines, Computer Vision, Generative AI, and IoT systems.',
                desc: 'Building robust machine learning pipelines, generative AI solutions, and real-time computer vision systems. Pursuing B.Tech in Artificial Intelligence & Data Science at Velammal Institute of Technology with an academic GPA of <strong>8.8 / 10</strong>.'
            },
            cv: {
                intel: 'Customized for Computer Vision roles: Prioritizing real-time YOLOv8 hazard localization (30+ FPS), OpenCV camera stream processing, and VISAI 2025 inspection engineering.',
                desc: 'Specializing in computer vision pipelines, custom YOLOv8 model training, OpenCV high-framerate stream processing, and edge camera inference with strict FPS guarantees.'
            },
            genai: {
                intel: 'Customized for Generative AI & NLP roles: Showcasing Resume AI with Groq LLaMA-3.3 70B reasoning, Sentence-BERT 384-D vector cosine retrieval, and ATS gap parsing.',
                desc: 'Architecting LLM solutions and dense vector search pipelines. Combining Sentence-BERT embeddings with ultra-low latency Groq LLaMA-3.3 70B inference for semantic document intelligence.'
            },
            iot: {
                intel: 'Customized for Embedded & IoT roles: Highlighting ESP32 telemetry arrays, multi-sensor microclimate gas monitoring, and SDG VISAI 2025 international project honors.',
                desc: 'Connecting edge microcontroller sensor arrays (ESP32) with predictive telemetry algorithms to monitor real-time microclimates and trigger emergency automated actuators.'
            },
            research: {
                intel: 'Customized for Graduate Admissions & Research: Highlighting GPA 8.8/10, NPTEL Elite Algorithms 70%, and reproducible machine learning experiments.',
                desc: 'Undergraduate researcher in AI & Data Science (GPA 8.8 / 10.0, Semester 1-5). Rigorous foundation in algorithmic complexity (NPTEL Elite 70%), cross-validation, and empirical ML evaluation.'
            }
        };

        lensButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                SoundFX.click();
                lensButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const lens = btn.getAttribute('data-lens');
                const data = narratives[lens] || narratives.all;

                if (intelText) {
                    intelText.style.opacity = '0';
                    setTimeout(() => {
                        intelText.innerHTML = data.intel;
                        intelText.style.opacity = '1';
                    }, 150);
                }

                if (heroDesc) {
                    heroDesc.style.opacity = '0.5';
                    setTimeout(() => {
                        heroDesc.innerHTML = data.desc;
                        heroDesc.style.opacity = '1';
                    }, 150);
                }

                // Synchronize with project cards
                if (lens === 'cv') {
                    const aiBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === 'ai');
                    if (aiBtn) aiBtn.click();
                } else if (lens === 'genai') {
                    const dataBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === 'data');
                    if (dataBtn) dataBtn.click();
                } else if (lens === 'iot') {
                    const iotBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === 'iot');
                    if (iotBtn) iotBtn.click();
                } else if (lens === 'all' || lens === 'research') {
                    const allBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter') === 'all');
                    if (allBtn) allBtn.click();
                }
            });
        });
    };
    initRecruiterLens();

    // ====================================================================
    // 14. NOVELTY: INTERACTIVE AI ENGINEERING LAB CONTROLLER
    // ====================================================================
    const initAiLab = () => {
        // --- Tab Navigation ---
        const labTabs = document.querySelectorAll('.lab-tab-btn');
        const labPanels = {
            resume: document.getElementById('labPanelResume'),
            yolo: document.getElementById('labPanelYolo'),
            iot: document.getElementById('labPanelIot')
        };

        labTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                SoundFX.click();
                const targetKey = tab.getAttribute('data-lab');
                labTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                Object.keys(labPanels).forEach(key => {
                    if (labPanels[key]) {
                        labPanels[key].classList.toggle('active', key === targetKey);
                    }
                });

                if (targetKey === 'yolo') {
                    drawYoloFrame();
                }
            });
        });

        // -------------------------------------------------------------
        // SANDBOX 1: RESUME AI VECTOR COSINE ENGINE
        // -------------------------------------------------------------
        const presetBtns = document.querySelectorAll('.preset-btn[data-preset]');
        const jobInput = document.getElementById('labJobDescInput');
        const resumeInput = document.getElementById('labResumeInput');
        const btnRunResume = document.getElementById('btnRunResumeAI');
        const gaugeCircle = document.getElementById('gaugeCircle');
        const gaugeScoreText = document.getElementById('gaugeScoreText');
        const matchLevelPill = document.getElementById('matchLevelPill');
        const matchedTokensWrap = document.getElementById('matchedTokensWrap');
        const gapTokensWrap = document.getElementById('gapTokensWrap');
        const groqTypewriter = document.getElementById('groqTypewriterOutput');
        const groqBadge = document.getElementById('groqLatencyBadge');

        const presetData = {
            ml: {
                job: 'PyTorch, Deep Learning pipelines, Model Optimization, Distributed Training, Scikit-learn, Docker CI/CD',
                resume: 'Developed deep learning convolutional neural network models in PyTorch with cross-validation and hyperparameter tuning for classification on image datasets.',
                score: 89.4,
                matched: ['PyTorch', 'Deep Learning', 'Classification', 'Model Tuning'],
                gaps: ['+ Distributed Training', '+ Docker CI/CD'],
                rewrite: 'Engineered PyTorch deep learning convolutional neural network pipelines with 5-fold cross-validation and Bayesian hyperparameter tuning, achieving 93.8% validation accuracy and containerizing training routines for CI/CD reproduction.'
            },
            cv: {
                job: 'YOLOv8, OpenCV, Real-time Object Detection, Edge Inference, TensorRT, Spatial Bounding Box Regression',
                resume: 'Implemented computer vision pipeline using OpenCV and YOLO to detect visual anomalies and roadway defects with high frame rate.',
                score: 93.2,
                matched: ['YOLOv8', 'OpenCV', 'Object Detection', 'High Frame Rate'],
                gaps: ['+ TensorRT Quantization', '+ Edge Hardware Benchmarking'],
                rewrite: 'Architected real-time YOLOv8 defect localization pipeline in OpenCV processing 35+ FPS on edge video streams; optimized spatial bounding box regression with non-maximum suppression (IoU 0.45) for high-recall road hazard detection.'
            },
            genai: {
                job: 'Large Language Models, Sentence-BERT, Vector Embeddings, RAG Architectures, Prompt Engineering, Groq Inference',
                resume: 'Designed an automated career roadmap assistant that evaluates user documents using embedding similarity and generates structured recommendations.',
                score: 91.8,
                matched: ['Embedding Similarity', 'Automated Assistant', 'Document Evaluation'],
                gaps: ['+ Sentence-BERT Vectors', '+ Groq LLaMA-3.3 Acceleration', '+ Dense RAG Indexing'],
                rewrite: 'Spearheaded full-stack GenAI application utilizing Sentence-BERT (all-MiniLM-L6-v2) for 384-dimensional cosine similarity indexing, paired with Groq-accelerated LLaMA-3.3 70B producing tailored ATS rewrites under 1.2s.'
            }
        };

        presetBtns.forEach(pbtn => {
            pbtn.addEventListener('click', () => {
                SoundFX.click();
                presetBtns.forEach(b => b.classList.remove('active'));
                pbtn.classList.add('active');
                const p = presetData[pbtn.getAttribute('data-preset')];
                if (p) {
                    if (jobInput) jobInput.value = p.job;
                    if (resumeInput) resumeInput.value = p.resume;
                    executeResumeScoring(p);
                }
            });
        });

        const executeResumeScoring = (dataOverride) => {
            SoundFX.scan();
            const data = dataOverride || {
                score: 88.5,
                matched: ['Neural Networks', 'Python', 'Feature Engineering'],
                gaps: ['+ Docker CI/CD', '+ Quantization'],
                rewrite: 'Developed high-performance machine learning pipelines with rigorous cross-validation and modular feature extractors, deploying inference endpoints with robust error logging.'
            };

            if (gaugeScoreText) gaugeScoreText.textContent = `${data.score}%`;
            if (gaugeCircle) {
                gaugeCircle.style.background = `conic-gradient(var(--accent-cyan) 0% ${data.score}%, rgba(255, 255, 255, 0.08) ${data.score}% 100%)`;
            }

            if (matchLevelPill) {
                if (data.score >= 90) {
                    matchLevelPill.textContent = 'Elite ATS Match (Top 5%)';
                    matchLevelPill.style.color = 'var(--accent-emerald)';
                } else {
                    matchLevelPill.textContent = 'Strong ATS Alignment';
                    matchLevelPill.style.color = 'var(--accent-cyan)';
                }
            }

            if (matchedTokensWrap) {
                matchedTokensWrap.innerHTML = data.matched.map(t => `<span class="token-chip hit"><i class="fas fa-check"></i> ${t}</span>`).join('');
            }

            if (gapTokensWrap) {
                gapTokensWrap.innerHTML = data.gaps.map(g => `<span class="token-chip gap">${g}</span>`).join('');
            }

            // Typewriter effect
            if (groqTypewriter) {
                groqTypewriter.innerHTML = '';
                const text = data.rewrite;
                let i = 0;
                const speed = 12;

                const typeStep = () => {
                    if (i < text.length) {
                        groqTypewriter.textContent = text.substring(0, i + 1);
                        i++;
                        setTimeout(typeStep, speed);
                    }
                };
                typeStep();
            }

            if (groqBadge) {
                groqBadge.textContent = `Inference: ${(0.85 + Math.random() * 0.35).toFixed(2)}s | 1,420 tok/s`;
            }
        };

        if (btnRunResume) {
            btnRunResume.addEventListener('click', () => {
                const activePreset = document.querySelector('.preset-btn[data-preset].active');
                const presetKey = activePreset ? activePreset.getAttribute('data-preset') : 'ml';
                executeResumeScoring(presetData[presetKey]);
            });
        }

        // Initialize with default
        executeResumeScoring(presetData.ml);

        // -------------------------------------------------------------
        // SANDBOX 2: YOLOV8 REAL-TIME HAZARD SCANNER
        // -------------------------------------------------------------
        const yoloCanvas = document.getElementById('yoloCanvas');
        const sliderConfidence = document.getElementById('sliderConfidence');
        const sliderIou = document.getElementById('sliderIou');
        const valConfidenceBadge = document.getElementById('valConfidenceBadge');
        const valIouBadge = document.getElementById('valIouBadge');
        const toggleBoxes = document.getElementById('toggleBoxes');
        const toggleLabels = document.getElementById('toggleLabels');
        const toggleScanEffect = document.getElementById('toggleScanEffect');
        const laserLine = document.getElementById('laserScanLine');
        const frameSelectBtns = document.querySelectorAll('.frame-select-btn');
        const btnRescan = document.getElementById('btnRescanYolo');
        const yoloCountLabel = document.getElementById('yoloCountLabel');
        const detectionItemsList = document.getElementById('detectionItemsList');

        let currentFrame = 'frame1';

        const frameDefects = {
            frame1: [
                { id: 'box1', label: 'asphalt_pothole', conf: 0.94, x: 190, y: 160, w: 180, h: 120, severity: 'Critical Void (8cm)' },
                { id: 'box2', label: 'longitudinal_crack', conf: 0.72, x: 390, y: 130, w: 90, h: 190, severity: 'Thermal Stress' },
                { id: 'box3', label: 'surface_raveling', conf: 0.44, x: 90, y: 220, w: 75, h: 65, severity: 'Minor Aggregate' }
            ],
            frame2: [
                { id: 'box4', label: 'transverse_crevice', conf: 0.91, x: 140, y: 190, w: 320, h: 80, severity: 'Structural Rift' },
                { id: 'box5', label: 'edge_void', conf: 0.68, x: 470, y: 110, w: 85, h: 140, severity: 'Shoulder Defect' }
            ],
            frame3: [
                { id: 'box6', label: 'waterlogged_pothole', conf: 0.88, x: 210, y: 180, w: 195, h: 135, severity: 'Submerged Void' },
                { id: 'box7', label: 'surface_depression', conf: 0.58, x: 80, y: 150, w: 110, h: 95, severity: 'Subgrade Rutting' }
            ]
        };

        const drawYoloFrame = () => {
            if (!yoloCanvas) return;
            const ctx = yoloCanvas.getContext('2d');
            const cw = yoloCanvas.width = 600;
            const ch = yoloCanvas.height = 400;

            // Draw simulated road pavement surface
            ctx.fillStyle = '#1e2430';
            ctx.fillRect(0, 0, cw, ch);

            // Asphalt texture specks
            ctx.fillStyle = '#283142';
            for (let i = 0; i < 400; i++) {
                ctx.fillRect((i * 37) % cw, (i * 29) % ch, 2, 2);
            }

            // Road lane divider marking
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 6;
            ctx.setLineDash([35, 30]);
            ctx.beginPath();
            ctx.moveTo(300, 0);
            ctx.lineTo(300, ch);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw defect visual representations based on currentFrame
            if (currentFrame === 'frame1') {
                // Primary Pothole crater
                const grad = ctx.createRadialGradient(280, 220, 15, 280, 220, 75);
                grad.addColorStop(0, '#090b0e');
                grad.addColorStop(0.7, '#131822');
                grad.addColorStop(1, '#1e2430');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(280, 220, 80, 50, -0.1, 0, Math.PI * 2);
                ctx.fill();

                // Crack line
                ctx.strokeStyle = '#0a0d13';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(435, 140);
                ctx.lineTo(425, 210);
                ctx.lineTo(445, 270);
                ctx.lineTo(430, 310);
                ctx.stroke();
            } else if (currentFrame === 'frame2') {
                // Transverse crack
                ctx.strokeStyle = '#090c12';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(150, 230);
                ctx.lineTo(240, 225);
                ctx.lineTo(330, 240);
                ctx.lineTo(450, 220);
                ctx.stroke();

                // Edge void
                ctx.fillStyle = '#0f141d';
                ctx.beginPath();
                ctx.ellipse(510, 180, 35, 60, 0.2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Waterlogged pothole puddle with reflection
                const grad = ctx.createRadialGradient(310, 240, 10, 310, 240, 80);
                grad.addColorStop(0, '#102538');
                grad.addColorStop(0.7, '#0c1a27');
                grad.addColorStop(1, '#1e2430');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(310, 245, 90, 55, 0.05, 0, Math.PI * 2);
                ctx.fill();

                // Water reflection ripple
                ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(310, 245, 35, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Filter defects by confidence threshold
            const confThreshold = sliderConfidence ? parseInt(sliderConfidence.value, 10) / 100 : 0.65;
            const defects = frameDefects[currentFrame] || [];
            const activeDefects = defects.filter(d => d.conf >= confThreshold);

            if (yoloCountLabel) {
                yoloCountLabel.textContent = `${activeDefects.length} Hazard${activeDefects.length !== 1 ? 's' : ''}`;
            }

            // Draw Bounding Boxes and Labels
            if (toggleBoxes && toggleBoxes.checked) {
                activeDefects.forEach(d => {
                    const isHigh = d.conf > 0.85;
                    ctx.strokeStyle = isHigh ? '#06b6d4' : '#f59e0b';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(d.x, d.y, d.w, d.h);

                    // Corner brackets for high-tech HUD look
                    const cornerLen = 12;
                    ctx.strokeStyle = isHigh ? '#38bdf8' : '#fbbf24';
                    ctx.lineWidth = 3;
                    // Top-left
                    ctx.beginPath();
                    ctx.moveTo(d.x, d.y + cornerLen);
                    ctx.lineTo(d.x, d.y);
                    ctx.lineTo(d.x + cornerLen, d.y);
                    ctx.stroke();
                    // Bottom-right
                    ctx.beginPath();
                    ctx.moveTo(d.x + d.w, d.y + d.h - cornerLen);
                    ctx.lineTo(d.x + d.w, d.y + d.h);
                    ctx.lineTo(d.x + d.w - cornerLen, d.y + d.h);
                    ctx.stroke();

                    // Label Tag
                    if (toggleLabels && toggleLabels.checked) {
                        const tagText = `${d.label} ${(d.conf * 100).toFixed(1)}%`;
                        ctx.font = '600 11px "JetBrains Mono", monospace';
                        const textWidth = ctx.measureText(tagText).width;
                        
                        ctx.fillStyle = isHigh ? 'rgba(6, 182, 212, 0.9)' : 'rgba(245, 158, 11, 0.9)';
                        ctx.fillRect(d.x, d.y - 18, textWidth + 8, 18);

                        ctx.fillStyle = '#090d16';
                        ctx.fillText(tagText, d.x + 4, d.y - 5);
                    }
                });
            }

            // Update telemetry list table
            if (detectionItemsList) {
                if (activeDefects.length === 0) {
                    detectionItemsList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.76rem; padding: 0.3rem;">No defects exceed current confidence threshold (${(confThreshold * 100).toFixed(0)}%).</div>`;
                } else {
                    detectionItemsList.innerHTML = activeDefects.map(d => `
                        <div class="detection-item-row">
                            <span style="font-weight: 700; color: ${d.conf > 0.85 ? 'var(--accent-cyan)' : 'var(--accent-amber)'};">${d.label}</span>
                            <span>Conf: <strong>${(d.conf * 100).toFixed(1)}%</strong></span>
                            <span style="color: var(--text-muted);">[${d.x}, ${d.y}, ${d.w}, ${d.h}]</span>
                            <span style="font-size: 0.68rem; color: var(--accent-emerald);">${d.severity}</span>
                        </div>
                    `).join('');
                }
            }
        };

        const triggerLaserSweep = () => {
            SoundFX.scan();
            if (laserLine) {
                laserLine.classList.remove('scanning');
                void laserLine.offsetWidth; // Trigger reflow
                laserLine.classList.add('scanning');
                setTimeout(() => laserLine.classList.remove('scanning'), 1600);
            }
            drawYoloFrame();
        };

        if (sliderConfidence) {
            sliderConfidence.addEventListener('input', () => {
                if (valConfidenceBadge) valConfidenceBadge.textContent = `${sliderConfidence.value}%`;
                drawYoloFrame();
            });
        }

        if (sliderIou) {
            sliderIou.addEventListener('input', () => {
                if (valIouBadge) valIouBadge.textContent = (sliderIou.value / 100).toFixed(2);
                drawYoloFrame();
            });
        }

        [toggleBoxes, toggleLabels].forEach(toggle => {
            if (toggle) toggle.addEventListener('change', drawYoloFrame);
        });

        frameSelectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                SoundFX.click();
                frameSelectBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFrame = btn.getAttribute('data-frame');
                triggerLaserSweep();
            });
        });

        if (btnRescan) {
            btnRescan.addEventListener('click', triggerLaserSweep);
        }

        // -------------------------------------------------------------
        // SANDBOX 3: IOT SMART STORAGE & TELEMETRY OSCILLOSCOPE
        // -------------------------------------------------------------
        const oscCanvas = document.getElementById('iotOscilloscopeCanvas');
        const sliderTemp = document.getElementById('sliderTemp');
        const sliderHumidity = document.getElementById('sliderHumidity');
        const sliderGas = document.getElementById('sliderGas');
        const valTempBadge = document.getElementById('valTempBadge');
        const valHumidityBadge = document.getElementById('valHumidityBadge');
        const valGasBadge = document.getElementById('valGasBadge');
        const fanBadge = document.getElementById('iotFanStatus');
        const mqttBadge = document.getElementById('iotMqttStatus');
        const riskBadge = document.getElementById('iotRiskLevelBadge');
        const alertBox = document.getElementById('iotAlertBox');
        const alertIcon = document.getElementById('iotAlertIcon');
        const alertTitle = document.getElementById('iotAlertTitle');
        const alertDesc = document.getElementById('iotAlertDesc');

        const btnIotNormal = document.getElementById('btnIotNormal');
        const btnIotHumidity = document.getElementById('btnIotHumidity');
        const btnIotRot = document.getElementById('btnIotRot');

        let waveOffset = 0;

        const updateIotSimulation = () => {
            const temp = sliderTemp ? parseFloat(sliderTemp.value) : 22;
            const humidity = sliderHumidity ? parseFloat(sliderHumidity.value) : 58;
            const gas = sliderGas ? parseFloat(sliderGas.value) : 18;

            if (valTempBadge) valTempBadge.textContent = `${temp} °C`;
            if (valHumidityBadge) valHumidityBadge.textContent = `${humidity} %`;
            if (valGasBadge) valGasBadge.textContent = `${gas} ppm`;

            // Spoilage calculation algorithm based on VISAI 2025 produce storage model
            // Humidity > 75% triggers condensation rot, NH3 gas > 40ppm indicates volatile bacteria
            const risk = Math.min(Math.round(((temp / 45) * 20) + ((humidity / 100) * 45) + ((gas / 150) * 35)), 100);

            if (riskBadge) {
                if (risk < 45) {
                    riskBadge.textContent = `${risk}% (OPTIMAL)`;
                    riskBadge.style.color = 'var(--accent-emerald)';
                } else if (risk < 75) {
                    riskBadge.textContent = `${risk}% (WARNING: DRIFT)`;
                    riskBadge.style.color = 'var(--accent-amber)';
                } else {
                    riskBadge.textContent = `${risk}% (CRITICAL ROT)`;
                    riskBadge.style.color = '#ef4444';
                }
            }

            if (fanBadge) {
                if (risk < 45) {
                    fanBadge.innerHTML = '<i class="fas fa-fan"></i> STANDBY (0 RPM)';
                    fanBadge.style.color = 'var(--text-primary)';
                } else if (risk < 75) {
                    fanBadge.innerHTML = '<i class="fas fa-fan fa-spin" style="color: var(--accent-amber);"></i> VENTILATING (1,200 RPM)';
                    fanBadge.style.color = 'var(--accent-amber)';
                } else {
                    fanBadge.innerHTML = '<i class="fas fa-fan fa-spin" style="color: #ef4444;"></i> EMERGENCY EXHAUST (2,800 RPM)';
                    fanBadge.style.color = '#ef4444';
                }
            }

            if (mqttBadge) {
                if (risk < 45) {
                    mqttBadge.innerHTML = '<i class="fas fa-check-circle" style="color: var(--accent-emerald);"></i> TELEMETRY OK (200)';
                } else if (risk < 75) {
                    mqttBadge.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: var(--accent-amber);"></i> DISPATCH: /storage/humidity_warn';
                } else {
                    mqttBadge.innerHTML = '<i class="fas fa-bell" style="color: #ef4444;"></i> DISPATCH: /storage/EMERGENCY_ROT';
                }
            }

            if (alertBox && alertIcon && alertTitle && alertDesc) {
                alertBox.className = 'iot-alert-box';
                if (risk < 45) {
                    alertBox.classList.add('safe');
                    alertIcon.className = 'fas fa-shield-alt';
                    alertTitle.textContent = 'All Storage Systems Nominal';
                    alertDesc.textContent = `Microclimate optimal (Temp ${temp}°C, Humidity ${humidity}%). NH3 gas is at baseline (${gas} ppm / 45 ppm threshold). No action required.`;
                } else if (risk < 75) {
                    alertBox.classList.add('warning');
                    alertIcon.className = 'fas fa-exclamation-triangle';
                    alertTitle.textContent = 'Warning: Microclimate Humidity Spike Detected';
                    alertDesc.textContent = `Elevated relative humidity (${humidity}%) creates conditions for fungal rotting. ESP32 fan relay triggered to circulate air before decay starts.`;
                    SoundFX.alert();
                } else {
                    alertBox.classList.add('critical');
                    alertIcon.className = 'fas fa-skull-crossbones';
                    alertTitle.textContent = 'CRITICAL HAZARD: Microbial Bacterial Rot Confirmed!';
                    alertDesc.textContent = `Dangerous NH3/VOC gas concentration (${gas} ppm) indicates decaying produce! Emergency exhaust activated and real-time SMS/MQTT warning broadcast to warehouse operator.`;
                    SoundFX.alert();
                }
            }
        };

        [sliderTemp, sliderHumidity, sliderGas].forEach(slider => {
            if (slider) slider.addEventListener('input', updateIotSimulation);
        });

        if (btnIotNormal) {
            btnIotNormal.addEventListener('click', () => {
                SoundFX.click();
                if (sliderTemp) sliderTemp.value = 22;
                if (sliderHumidity) sliderHumidity.value = 58;
                if (sliderGas) sliderGas.value = 18;
                updateIotSimulation();
            });
        }

        if (btnIotHumidity) {
            btnIotHumidity.addEventListener('click', () => {
                SoundFX.click();
                if (sliderTemp) sliderTemp.value = 28;
                if (sliderHumidity) sliderHumidity.value = 85;
                if (sliderGas) sliderGas.value = 32;
                updateIotSimulation();
            });
        }

        if (btnIotRot) {
            btnIotRot.addEventListener('click', () => {
                SoundFX.click();
                if (sliderTemp) sliderTemp.value = 36;
                if (sliderHumidity) sliderHumidity.value = 94;
                if (sliderGas) sliderGas.value = 98;
                updateIotSimulation();
            });
        }

        // Oscilloscope Wave Loop
        const drawOscilloscope = () => {
            if (oscCanvas) {
                const ctx = oscCanvas.getContext('2d');
                const w = oscCanvas.width = 600;
                const h = oscCanvas.height = 240;

                ctx.fillStyle = '#020610';
                ctx.fillRect(0, 0, w, h);

                // Grid background
                ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
                ctx.lineWidth = 1;
                for (let x = 0; x < w; x += 40) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, h);
                    ctx.stroke();
                }
                for (let y = 0; y < h; y += 30) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(w, y);
                    ctx.stroke();
                }

                waveOffset += 0.04;
                const temp = sliderTemp ? parseFloat(sliderTemp.value) : 22;
                const humidity = sliderHumidity ? parseFloat(sliderHumidity.value) : 58;
                const gas = sliderGas ? parseFloat(sliderGas.value) : 18;

                // Series 1: Temperature (Cyan)
                ctx.strokeStyle = '#06b6d4';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x = 0; x < w; x += 4) {
                    const y = (h * 0.3) + Math.sin(x * 0.03 + waveOffset) * (temp * 0.4) + Math.sin(x * 0.08) * 3;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();

                // Series 2: Humidity (Blue)
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x = 0; x < w; x += 4) {
                    const y = (h * 0.6) + Math.cos(x * 0.02 + waveOffset * 0.8) * (humidity * 0.3) + Math.cos(x * 0.05) * 4;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();

                // Series 3: Gas PPM (Amber)
                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (let x = 0; x < w; x += 4) {
                    const y = (h * 0.85) - ((gas / 150) * 80) + Math.sin(x * 0.04 + waveOffset * 1.2) * (gas * 0.12);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            requestAnimationFrame(drawOscilloscope);
        };
        drawOscilloscope();
        updateIotSimulation();
    };
    initAiLab();

    // ====================================================================
    // 15. NOVELTY: NEURAL COMMAND TERMINAL & RECRUITER COPILOT (Ctrl+K)
    // ====================================================================
    const initAiTerminal = () => {
        const modal = document.getElementById('aiTerminalModal');
        const triggerNavBtn = document.getElementById('cmdPaletteBtn');
        const triggerFloatingBtn = document.getElementById('floatingHudBtn');
        const closeBtnRed = document.getElementById('terminalCloseBtn');
        const closeBtnX = document.getElementById('btnTerminalCloseX');
        const soundBtn = document.getElementById('btnSoundToggle');
        const soundIcon = document.getElementById('soundIcon');
        const modeChatBtn = document.getElementById('modeChatBtn');
        const modeCliBtn = document.getElementById('modeCliBtn');
        const terminalForm = document.getElementById('terminalInputForm');
        const terminalInput = document.getElementById('terminalInput');
        const messagesContainer = document.getElementById('chatMessagesContainer');
        const promptChips = document.querySelectorAll('.prompt-chip');

        let currentMode = 'chat'; // 'chat' or 'cli'

        const openTerminal = () => {
            if (!modal) return;
            SoundFX.click();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                if (terminalInput) terminalInput.focus();
            }, 100);
        };

        const closeTerminal = () => {
            if (!modal) return;
            modal.classList.remove('open');
            document.body.style.overflow = '';
        };

        if (triggerNavBtn) triggerNavBtn.addEventListener('click', openTerminal);
        if (triggerFloatingBtn) triggerFloatingBtn.addEventListener('click', openTerminal);
        if (closeBtnRed) closeBtnRed.addEventListener('click', closeTerminal);
        if (closeBtnX) closeBtnX.addEventListener('click', closeTerminal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeTerminal();
        });

        // Global Keybindings: Ctrl+K, Cmd+K, Escape
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (modal.classList.contains('open')) {
                    closeTerminal();
                } else {
                    openTerminal();
                }
            } else if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeTerminal();
            }
        });

        // Sound Toggle
        const updateSoundIcon = () => {
            if (soundIcon) {
                soundIcon.className = SoundFX.isEnabled() ? 'fas fa-volume-up' : 'fas fa-volume-mute';
                soundIcon.style.color = SoundFX.isEnabled() ? 'var(--accent-cyan)' : 'var(--text-muted)';
            }
        };
        updateSoundIcon();

        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                const newState = SoundFX.toggle();
                updateSoundIcon();
                if (newState) SoundFX.click();
            });
        }

        // Mode Switching
        if (modeChatBtn && modeCliBtn) {
            modeChatBtn.addEventListener('click', () => {
                currentMode = 'chat';
                modeChatBtn.classList.add('active');
                modeCliBtn.classList.remove('active');
                if (terminalInput) terminalInput.placeholder = "Ask anything about Chandru or type a question...";
            });

            modeCliBtn.addEventListener('click', () => {
                currentMode = 'cli';
                modeCliBtn.classList.add('active');
                modeChatBtn.classList.remove('active');
                if (terminalInput) terminalInput.placeholder = "Type command: 'help', 'projects', 'lab', 'resume', 'matrix'...";
            });
        }

        // Knowledge Base for Chandru M
        const queryKnowledge = (q) => {
            const query = q.toLowerCase().trim();

            if (query.includes('why hire') || query.includes('strength') || query.includes('summary') || query.includes('hire chandru')) {
                return {
                    title: 'Why Hire Chandru M?',
                    content: `Chandru combines **high academic rigor (GPA 8.8 / 10 at Velammal Institute of Tech)** with **production-tested ML pipelines**:
                        <ul>
                            <li><strong>Proven In Hackathons:</strong> VISAI 2025 International Project Exhibition honoree (SDG Industry & Innovation) and KEC 30-Hour Hackathon winner.</li>
                            <li><strong>Full-Lifecycle AI Engineer:</strong> Not just notebooks — deploys real-time computer vision (YOLOv8 30+ FPS), LLM apps (Sentence-BERT + Groq LLaMA-3.3), and edge microcontrollers (ESP32).</li>
                            <li><strong>Verified Track Record:</strong> Dual industrial internships at YBI Foundation (ML) & IBM Naan Mudhalvan (Full Stack AI).</li>
                        </ul>`,
                    actions: [
                        { label: 'Explore Projects', href: '#projects' },
                        { label: 'Download Resume', href: 'resume.pdf', download: true }
                    ]
                };
            }

            if (query.includes('resume ai') || query.includes('ats') || query.includes('groq') || query.includes('bert') || query.includes('llm')) {
                return {
                    title: 'Flagship: Resume AI & Skill Roadmap',
                    content: `Chandru engineered a high-precision ATS gap analyzer:
                        <ul>
                            <li><strong>Sentence-BERT 384-D Embeddings:</strong> Calculates cosine semantic distance between candidate bullets and job specs.</li>
                            <li><strong>Groq LLaMA-3.3 70B:</strong> Dynamic prompt synthesis delivering optimized rewrites in <strong>under 1.5 seconds</strong>.</li>
                            <li><strong>Live In-Browser Demo:</strong> Test the vector similarity engine right now in Section 6.5!</li>
                        </ul>`,
                    actions: [
                        { label: 'Test Live in AI Lab', href: '#ai-lab' },
                        { label: 'View GitHub Repo', href: 'https://github.com/Gloom-chandru/resume-ai' }
                    ]
                };
            }

            if (query.includes('yolo') || query.includes('vision') || query.includes('pothole') || query.includes('cv') || query.includes('camera')) {
                return {
                    title: 'Computer Vision: YOLOv8 Road Hazard Detector',
                    content: `Automated road surface defect detection pipeline:
                        <ul>
                            <li><strong>YOLOv8 Custom Backbone:</strong> Trained on diverse asphalt asphalt cracks, rifts, and deep potholes.</li>
                            <li><strong>30+ FPS Edge Stream:</strong> Built with OpenCV for low-latency vehicle dashcam feeds.</li>
                            <li><strong>Spatial IoU Localization:</strong> Real-time bounding box regression with non-maximum suppression.</li>
                        </ul>`,
                    actions: [
                        { label: 'Test YOLO Scanner', href: '#ai-lab' },
                        { label: 'View GitHub Repo', href: 'https://github.com/Gloom-chandru/ROAD-PATHOLE-DETECTION' }
                    ]
                };
            }

            if (query.includes('gpa') || query.includes('college') || query.includes('education') || query.includes('velammal') || query.includes('degree')) {
                return {
                    title: 'Academic Standing & Education',
                    content: `<ul>
                        <li><strong>Degree:</strong> B.Tech in Artificial Intelligence & Data Science (2023 — Exp. Jan 2027)</li>
                        <li><strong>Institution:</strong> Velammal Institute of Technology, Chennai, Tamil Nadu</li>
                        <li><strong>GPA:</strong> <span style="color: var(--accent-emerald); font-weight: 700;">8.8 / 10.0</span> (Across Semesters 1 to 5)</li>
                        <li><strong>National Algorithm Honor:</strong> NPTEL "Design & Analysis of Algorithms" Elite 70% Score</li>
                    </ul>`,
                    actions: [
                        { label: 'View Timeline', href: '#education' }
                    ]
                };
            }

            if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('phone') || query.includes('linkedin')) {
                return {
                    title: 'Direct Contact Details',
                    content: `<ul>
                        <li><strong>Email:</strong> <a href="mailto:chandrusanthosh553@gmail.com" style="color: var(--accent-cyan);">chandrusanthosh553@gmail.com</a></li>
                        <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/chandru-m-082b99292/" target="_blank" style="color: var(--accent-cyan);">linkedin.com/in/chandru-m-082b99292</a></li>
                        <li><strong>GitHub:</strong> <a href="https://github.com/Gloom-chandru" target="_blank" style="color: var(--accent-cyan);">github.com/Gloom-chandru</a></li>
                        <li><strong>Location:</strong> Tamil Nadu, India (Available for Remote & Relocation)</li>
                    </ul>`,
                    actions: [
                        { label: 'Open Contact Form', href: '#contact' }
                    ]
                };
            }

            if (query.includes('iot') || query.includes('storage') || query.includes('onion') || query.includes('esp32') || query.includes('visai')) {
                return {
                    title: 'IoT Produce Storage & Spoilage Prevention',
                    content: `Exhibited at the prestigious <strong>VISAI 2025</strong> International Competition:
                        <ul>
                            <li><strong>ESP32 Sensor Array:</strong> Multi-channel telemetry of microclimate humidity, temperature, and NH3 bacterial decay gases.</li>
                            <li><strong>Automated Mitigation:</strong> Actuates exhaust ventilation fans and MQTT emergency telemetry before visual crop rot begins.</li>
                            <li><strong>Hackathon Built:</strong> Developed during the 30-Hour KEC National Hackathon sprint.</li>
                        </ul>`,
                    actions: [
                        { label: 'Test Telemetry Oscilloscope', href: '#ai-lab' }
                    ]
                };
            }

            // General / Fallback Answer
            return {
                title: 'Chandru M — AI / ML Systems Engineer',
                content: `Chandru is an AI & Data Science engineer with an 8.8 GPA at Velammal Institute of Technology, specializing in:
                    <ul>
                        <li><strong>Machine Learning:</strong> Scikit-learn, PyTorch, Supervised classification, cross-validation.</li>
                        <li><strong>Computer Vision:</strong> Real-time YOLOv8 hazard localization at 30+ FPS, OpenCV.</li>
                        <li><strong>Generative AI:</strong> Sentence-BERT 384-D vector search, Groq LLaMA-3.3 70B, RAG.</li>
                        <li><strong>Edge IoT:</strong> ESP32 microcontrollers, MQTT telemetry, sensor anomaly detection.</li>
                    </ul>
                    Ask about specific projects, hackathons, GPA, or test the in-browser AI Lab!`,
                actions: [
                    { label: 'Launch AI Lab', href: '#ai-lab' },
                    { label: 'Download Resume', href: 'resume.pdf', download: true }
                ]
            };
        };

        const executeCli = (cmd) => {
            const command = cmd.toLowerCase().trim();

            if (command === 'help') {
                return `AVAILABLE COMMANDS:
  projects   - Navigate to featured projects
  skills     - View technical competencies matrix
  lab        - Jump to interactive AI Engineering Lab
  yolo       - Launch YOLOv8 computer vision scanner
  resume     - Download Chandru M official resume PDF
  contact    - Go to direct contact details
  theme      - Toggle between Dark and Light mode
  sound      - Toggle Web Audio UI sound effects
  matrix     - Render system architecture ASCII art
  clear      - Clear terminal console history`;
            }

            if (command === 'projects') {
                closeTerminal();
                window.location.hash = '#projects';
                return 'Navigating to #projects...';
            }

            if (command === 'skills') {
                closeTerminal();
                window.location.hash = '#skills';
                return 'Navigating to #skills...';
            }

            if (command === 'lab') {
                closeTerminal();
                window.location.hash = '#ai-lab';
                return 'Launching Interactive AI Engineering Lab...';
            }

            if (command === 'yolo') {
                closeTerminal();
                window.location.hash = '#ai-lab';
                const yoloTab = document.getElementById('tabLabYolo');
                if (yoloTab) yoloTab.click();
                return 'Opening YOLOv8 defect scanner...';
            }

            if (command === 'resume') {
                window.open('resume.pdf', '_blank');
                return 'Initiating resume PDF download...';
            }

            if (command === 'contact') {
                closeTerminal();
                window.location.hash = '#contact';
                return 'Navigating to #contact...';
            }

            if (command === 'theme') {
                const themeBtn = document.getElementById('themeToggle');
                if (themeBtn) themeBtn.click();
                return 'Switched color theme.';
            }

            if (command === 'sound') {
                const s = SoundFX.toggle();
                updateSoundIcon();
                return `Sound effects: ${s ? 'ENABLED (Web Audio synthesizer active)' : 'DISABLED (Muted)'}`;
            }

            if (command === 'clear') {
                if (messagesContainer) messagesContainer.innerHTML = '';
                return 'Console cleared.';
            }

            if (command === 'matrix') {
                return `[SYSTEM ARCHITECTURE STACK]
┌──────────────────────────────────────────────┐
│ CORE: PyTorch • Scikit-Learn • Python 3.10   │
│ VISION: YOLOv8 • OpenCV • 30+ FPS Edge       │
│ GENAI: Groq LLaMA-3.3 70B • Sentence-BERT    │
│ IOT: ESP32 • DHT11 • MQ-137 • MQTT Telemetry │
│ ACADEMIC: GPA 8.8/10 • Velammal Inst of Tech │
└──────────────────────────────────────────────┘`;
            }

            // Fallback for CLI: run through knowledge engine
            const res = queryKnowledge(command);
            return `[RESPONSE]: ${res.title}\n${res.content.replace(/<[^>]*>/g, '')}`;
        };

        const postMessage = (text) => {
            if (!text || !text.trim()) return;
            const query = text.trim();
            SoundFX.click();

            // Append User message
            const userMsg = document.createElement('div');
            userMsg.className = 'chat-bubble-user';
            userMsg.textContent = query;
            messagesContainer.appendChild(userMsg);

            // Generate AI / CLI response
            setTimeout(() => {
                const aiMsg = document.createElement('div');
                aiMsg.className = 'chat-bubble-ai';

                if (currentMode === 'cli') {
                    const output = executeCli(query);
                    aiMsg.innerHTML = `<pre style="font-family: var(--font-mono); font-size: 0.8rem; margin: 0; white-space: pre-wrap; color: var(--accent-cyan);">${output}</pre>`;
                } else {
                    const res = queryKnowledge(query);
                    aiMsg.innerHTML = `
                        <h4><i class="fas fa-brain"></i> ${res.title}</h4>
                        <div>${res.content}</div>
                        ${res.actions ? `
                            <div class="chat-actions-row">
                                ${res.actions.map(a => `
                                    <a href="${a.href}" ${a.download ? 'download' : ''} class="chat-action-btn" target="${a.href.startsWith('http') ? '_blank' : '_self'}">
                                        <i class="fas fa-arrow-right"></i> ${a.label}
                                    </a>
                                `).join('')}
                            </div>
                        ` : ''}
                    `;

                    // Close terminal if user clicks an internal jump link
                    aiMsg.querySelectorAll('.chat-action-btn[href^="#"]').forEach(btn => {
                        btn.addEventListener('click', closeTerminal);
                    });
                }

                messagesContainer.appendChild(aiMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                SoundFX.click();
            }, 120);

            if (terminalInput) terminalInput.value = '';
        };

        if (terminalForm) {
            terminalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (terminalInput) postMessage(terminalInput.value);
            });
        }

        promptChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const q = chip.getAttribute('data-query');
                postMessage(q);
            });
        });
    };
    initAiTerminal();
});

