document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            // Simple icon toggle logic if using an icon library, or just text
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Sticky Header Shadow
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Dynamic Year in Footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Active Link Highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Check if href matches current path (handling root / and index.html)
        if (href === currentPath || (currentPath === '/' && href === 'index.html') || (currentPath.endsWith('/') && href === 'index.html')) {
            link.classList.add('active');
        } else if (currentPath.includes(href) && href !== 'index.html') {
            link.classList.add('active');
        }
    });

    // Contact form subject prefill via query param (?objet=...)
    const subjectSelect = document.getElementById('objet');
    if (subjectSelect) {
        const params = new URLSearchParams(window.location.search);
        const subject = params.get('objet');
        if (subject) {
            const hasOption = Array.from(subjectSelect.options).some(option => option.value === subject);
            if (hasOption) {
                subjectSelect.value = subject;
            }
        }
    }

    // Hero Slider
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const slides = Array.from(heroSlider.querySelectorAll('.hero-slide'));
        if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            let current = 0;
            let slideInterval;
            let transitionTimeout;

            const goTo = (next) => {
                // Handle looping
                let target = next;
                if (target < 0) target = slides.length - 1;
                else if (target >= slides.length) target = 0;

                if (target === current) return;

                // Stop previous cleanups to prevent glitches during rapid clicking
                clearTimeout(transitionTimeout);

                // Clean up any slides that are not part of this specific transition immediately
                slides.forEach((slide, index) => {
                    if (index !== current && index !== target) {
                        slide.classList.remove('active', 'leaving');
                    }
                });

                const outgoing = slides[current];
                const incoming = slides[target];

                // Change states
                outgoing.classList.remove('active');
                outgoing.classList.add('leaving');

                incoming.classList.remove('leaving');
                incoming.classList.add('active');

                // Set new current immediately
                current = target;

                const dur = parseFloat(
                    getComputedStyle(incoming).transitionDuration || '0.9'
                ) * 1000 + 50;

                transitionTimeout = setTimeout(() => {
                    outgoing.classList.remove('leaving');
                }, dur);
            };

            const startInterval = () => {
                clearInterval(slideInterval);
                slideInterval = setInterval(() => {
                    goTo(current + 1);
                }, 5000);
            };

            startInterval();

            // Controls
            const prevBtn = heroSlider.querySelector('.hero-prev');
            const nextBtn = heroSlider.querySelector('.hero-next');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    goTo(current - 1);
                    startInterval(); // Reset timer if the user clicks manually
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    goTo(current + 1);
                    startInterval();
                });
            }
        }
    }

    // Reviews Carousel (Homepage)
    const reviewData = [
        {
            name: 'Céline',
            date: 'Janvier 2026',
            rating: 5,
            initial: 'C',
            text: 'Après avoir consulté plusieurs avocats pour mon divorce, Maître François-Xavier a été le seul à réellement m’écouter et à comprendre ma situation. Clair, honnête et efficace, il m’a permis de me sentir enfin défendue et respectée. Un avocat humain et investi, que je recommande sans hésiter.'
        },
        {
            name: 'Kaoutar',
            date: 'Décembre 2025',
            rating: 5,
            initial: 'K',
            text: 'J’ai confié à Maître Cressent un changement de statut de carte de séjour. Il a été professionnel, clair dans ses explications et a assuré un suivi sérieux jusqu’à l’obtention de ma carte. Je le recommande.'
        },
        {
            name: 'Nicolas',
            date: 'Mai 2024',
            rating: 5,
            initial: 'N',
            text: 'Excellent et réactif. Nous avons fait appel à Maître Cressent pour la vente d’un fonds de commerce. Il nous a fourni toutes les informations et conseils nécessaires pour avancer rapidement et efficacement. Un professionnel investi et rigoureux. Merci.'
        },
        {
            name: 'Naili Ahmed',
            date: 'Mai 2024',
            rating: 5,
            initial: 'N',
            text: 'Maître Cressent est avant tout humain, honnête et pragmatique. À l’écoute et disponible tout au long de la procédure, il fait preuve d’un professionnalisme exemplaire, avec des tarifs raisonnables. Je recommande vivement.'
        },
        {
            name: 'Val Bazairi',
            date: 'Mai 2021',
            rating: 5,
            initial: 'V',
            text: 'Après avoir consulté de nombreux avocats à Versailles et Paris, trouver à Mantes-la-Jolie un avocat du niveau de Maître Cressent a été une vraie surprise. Professionnel, à l’écoute et rigoureux, il a su gérer un dossier complexe et délicat qu’un cabinet parisien n’avait pas réussi à mener à bien. Honoraires raisonnables au regard de la qualité du travail. Je recommande vivement.'
        },
        {
            name: 'O. Lopi',
            date: 'Février 2024',
            rating: 5,
            initial: 'O',
            text: 'Un grand merci à Maître Cressent de m’avoir sorti de détention. Efficace et déterminé.'
        }
    ];

    const reviewsTrack = document.getElementById('reviews-track');
    const reviewsCarousel = document.querySelector('.reviews-carousel');

    if (reviewsTrack && reviewsCarousel && reviewData.length > 0) {
        const clampRating = rating => Math.max(0, Math.min(5, rating));
        const createStars = rating => {
            const full = clampRating(rating);
            const empty = 5 - full;
            return `${'★'.repeat(full)}${'☆'.repeat(empty)}`;
        };

        const hslToRgb = (h, s, l) => {
            const sat = s / 100;
            const light = l / 100;
            const c = (1 - Math.abs(2 * light - 1)) * sat;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = light - c / 2;
            let r = 0;
            let g = 0;
            let b = 0;

            if (h < 60) { r = c; g = x; b = 0; }
            else if (h < 120) { r = x; g = c; b = 0; }
            else if (h < 180) { r = 0; g = c; b = x; }
            else if (h < 240) { r = 0; g = x; b = c; }
            else if (h < 300) { r = x; g = 0; b = c; }
            else { r = c; g = 0; b = x; }

            return [
                Math.round((r + m) * 255),
                Math.round((g + m) * 255),
                Math.round((b + m) * 255)
            ];
        };

        const relativeLuminance = ([r, g, b]) => {
            const toLinear = channel => {
                const c = channel / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            };
            const [rl, gl, bl] = [r, g, b].map(toLinear);
            return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
        };

        const contrastRatio = (rgb1, rgb2) => {
            const l1 = relativeLuminance(rgb1);
            const l2 = relativeLuminance(rgb2);
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            return (lighter + 0.05) / (darker + 0.05);
        };

        const pickTextColor = backgroundRgb => {
            const white = [255, 255, 255];
            const navy = [15, 44, 89];
            return contrastRatio(backgroundRgb, navy) >= contrastRatio(backgroundRgb, white)
                ? 'rgb(15, 44, 89)'
                : '#ffffff';
        };

        const randomBetween = (min, max) => Math.random() * (max - min) + min;

        const getRandomAvatarColors = () => {
            const minContrast = 4.5;
            for (let attempt = 0; attempt < 12; attempt += 1) {
                const hue = Math.floor(randomBetween(0, 360));
                const saturation = Math.floor(randomBetween(35, 95));
                const lightness = Math.floor(randomBetween(30, 85));
                const rgb = hslToRgb(hue, saturation, lightness);
                const textColor = pickTextColor(rgb);
                const textRgb = textColor === '#ffffff' ? [255, 255, 255] : [15, 44, 89];
                if (contrastRatio(rgb, textRgb) >= minContrast) {
                    return {
                        bg: `hsl(${hue} ${saturation}% ${lightness}%)`,
                        text: textColor
                    };
                }
            }

            const fallbackHue = Math.floor(randomBetween(0, 360));
            const fallbackSaturation = Math.floor(randomBetween(60, 90));
            const lightness = randomBetween(22, 30);
            const rgb = hslToRgb(fallbackHue, fallbackSaturation, lightness);
            return {
                bg: `hsl(${fallbackHue} ${fallbackSaturation}% ${lightness}%)`,
                text: '#ffffff'
            };
        };

        const avatarColorsByIndex = reviewData.map(() => getRandomAvatarColors());

        const renderReviewCard = (review, index) => {
            const stars = createStars(review.rating);
            const avatarColors = avatarColorsByIndex[index];
            return `
                <article class="review-card" role="listitem" aria-label="Avis de ${review.name}, ${review.rating} sur 5">
                    <div class="review-header">
                        <div class="review-avatar" style="background: ${avatarColors.bg}; color: ${avatarColors.text};" aria-hidden="true">${review.initial}</div>
                        <div>
                            <div class="review-name">${review.name}</div>
                            <div class="review-meta">
                                <span class="review-stars" aria-hidden="true">${stars}</span>
                                <span class="review-score">${review.rating}/5</span>
                                <span class="review-date">${review.date}</span>
                            </div>
                        </div>
                    </div>
                    <p class="review-text">${review.text}</p>
                </article>
            `;
        };

        const cardsMarkup = reviewData.map((review, index) => renderReviewCard(review, index)).join('');
        reviewsTrack.innerHTML = `
            <div class="reviews-group" role="presentation">${cardsMarkup}</div>
            <div class="reviews-group" role="presentation" aria-hidden="true">${cardsMarkup}</div>
        `;

        const updateMarquee = () => {
            const group = reviewsTrack.querySelector('.reviews-group');
            if (!group) return;
            const groupWidth = group.getBoundingClientRect().width;
            if (!groupWidth) return;
            const isMobile = window.innerWidth <= 768;
            const speed = isMobile ? 18 : 35; // Plus lent sur mobile (18px/s vs 35px/s)
            const duration = Math.max(20, groupWidth / speed);
            reviewsTrack.style.setProperty('--marquee-distance', `${groupWidth}px`);
            reviewsTrack.style.setProperty('--marquee-duration', `${duration}s`);
        };

        updateMarquee();
        window.addEventListener('resize', () => requestAnimationFrame(updateMarquee));
        window.addEventListener('load', updateMarquee);

        const pause = () => reviewsCarousel.classList.add('is-paused');
        const resume = () => reviewsCarousel.classList.remove('is-paused');

        reviewsCarousel.addEventListener('pointerdown', pause);
        reviewsCarousel.addEventListener('pointerup', resume);
        reviewsCarousel.addEventListener('pointercancel', resume);
        reviewsCarousel.addEventListener('pointerleave', resume);
        reviewsCarousel.addEventListener('touchstart', pause, { passive: true });
        reviewsCarousel.addEventListener('touchend', resume);
    }

    // Observer pour l'effet 'hover' automatique sur mobile
    const hoverCards = document.querySelectorAll('.card, .domain-link-card');
    if (hoverCards.length > 0) {
        let isMobile = window.matchMedia("(max-width: 768px)").matches;

        const removeAllMobileHovers = () => {
            hoverCards.forEach(c => c.classList.remove('mobile-hover'));
        };

        const hoverObserver = new IntersectionObserver((entries) => {
            if (!isMobile) return;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    removeAllMobileHovers();
                    entry.target.classList.add('mobile-hover');
                } else {
                    entry.target.classList.remove('mobile-hover');
                }
            });
        }, {
            // Déclenche l'effet de croisement uniquement au centre de l'écran (-40% en haut et en bas)
            rootMargin: "-40% 0px -40% 0px",
            threshold: 0
        });

        hoverCards.forEach(card => hoverObserver.observe(card));

        // Désactive la simulation de hover si la fenêtre rebascule en format bureau
        window.addEventListener('resize', () => {
            let newlyMobile = window.matchMedia("(max-width: 768px)").matches;
            if (isMobile !== newlyMobile) {
                isMobile = newlyMobile;
                if (!isMobile) removeAllMobileHovers();
            }
        });
    }

    // Animation au scroll des titres de section (h2)
    const sectionObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.35 // Se déclenche quand 35% de la section est visible (plus tard qu'avant)
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // On cherche les titres à animer dans cette section précise
                const titles = entry.target.querySelectorAll('.section-title-reveal');
                titles.forEach(title => {
                    title.classList.add('active');
                });
                // Une seule fois (ne pas re-déclencher)
                observer.unobserve(entry.target);
            }
        });
    }, sectionObserverOptions);

    // Observer les sections parentes pour déclencher le titre
    const sectionsToObserve = document.querySelectorAll('.section, footer');
    sectionsToObserve.forEach(section => {
        sectionObserver.observe(section);
    });
});
