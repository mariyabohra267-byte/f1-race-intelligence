/**
 * Formula 1 Race Intelligence - Main UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar styling on scroll
    const navbar = document.querySelector('.f1-navbar');
    const btnScrollTop = document.getElementById('btn-scroll-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            if (navbar) navbar.classList.add('scrolled');
            if (btnScrollTop) btnScrollTop.classList.add('show');
        } else {
            if (navbar) navbar.classList.remove('scrolled');
            if (btnScrollTop) btnScrollTop.classList.remove('show');
        }
    });

    // 2. Scroll to top button
    if (btnScrollTop) {
        btnScrollTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 3. Animated Number Counter for KPIs
    const counters = document.querySelectorAll('.counter-animate');
    let hasAnimated = false;

    const animateCounters = () => {
        if (hasAnimated) return;
        const triggerPos = window.innerHeight * 0.85;

        counters.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            if (rect.top <= triggerPos) {
                const target = parseInt(counter.getAttribute('data-target')) || 0;
                const suffix = counter.getAttribute('data-suffix') || '';
                let current = 0;
                const increment = Math.ceil(target / 40);

                const updateCounter = () => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + suffix;
                    } else {
                        counter.textContent = current + suffix;
                        requestAnimationFrame(updateCounter);
                    }
                };
                updateCounter();
            }
        });
        hasAnimated = true;
    };

    window.addEventListener('scroll', animateCounters);
    animateCounters(); // Run once in case already visible

    // 4. Mobile Menu Toggle
    const navToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.querySelector('.f1-nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '72px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#0d0f14';
                navLinks.style.padding = '20px 24px';
                navLinks.style.borderBottom = '1px solid rgba(225, 6, 0, 0.4)';
            }
        });
    }
});
