/* ============================================
   ARTE EM MADEIRA — Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================
  // HEADER SCROLL BEHAVIOR (Intersection Observer)
  // ============================================
  const header = document.getElementById('header');
  const sentinel = document.getElementById('scroll-sentinel');

  if (header && sentinel) {
    const headerObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, {
      root: null, // Viewport
      threshold: 0
    });
    headerObserver.observe(sentinel);
  }

  // ============================================
  // MOBILE NAVIGATION
  // ============================================
  const hamburger = document.getElementById('hamburger-btn');
  const navDrawer = document.getElementById('nav-drawer');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = navDrawer.querySelectorAll('.nav-link');

  function openMenu() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Fechar menu');
    navDrawer.classList.add('active');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menu');
    navDrawer.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('active');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navOverlay.addEventListener('click', closeMenu);

  // Close menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('active')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } catch (err) {
        console.warn(`Smooth scroll target selection failed for selector "${targetId}":`, err);
      }
    });
  });

  // ============================================
  // ACTIVE NAV LINK ON SCROLL (Intersection Observer)
  // ============================================
  const allNavLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && allNavLinks.length > 0) {
    const activeLinkObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          allNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
          });
        }
      });
    }, {
      rootMargin: '-25% 0px -55% 0px', // Trigger when section occupies the active reading area
      threshold: 0
    });

    // Only observe sections that have corresponding navigation links to avoid gaps
    allNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        try {
          const section = document.querySelector(href);
          if (section) {
            activeLinkObserver.observe(section);
          }
        } catch (err) {
          console.warn(`Could not observe section for link "${href}":`, err);
        }
      }
    });
  }

  // ============================================
  // INTERSECTION OBSERVER — SCROLL ANIMATIONS
  // ============================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));
  } else {
    // Fallback: show all elements
    animatedElements.forEach(el => el.classList.add('animated'));
  }

  // ============================================
  // WHATSAPP FLOATING BUTTON VISIBILITY
  // ============================================
  const whatsappFloat = document.getElementById('whatsapp-float');
  const footer = document.getElementById('footer');

  if (whatsappFloat && footer) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          whatsappFloat.classList.add('hidden');
        } else {
          whatsappFloat.classList.remove('hidden');
        }
      });
    }, {
      threshold: 0.1
    });

    footerObserver.observe(footer);
  }

  // ============================================
  // GALLERY HOVER EFFECTS (Touch support)
  // ============================================
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    // On touch devices, toggle caption on tap
    item.addEventListener('touchstart', function (e) {
      // Remove active from all other items
      galleryItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('touch-active');
        }
      });
      this.classList.toggle('touch-active');
    }, { passive: true });
  });

  // Add CSS for touch-active state
  const touchStyle = document.createElement('style');
  touchStyle.textContent = `
    .gallery-item.touch-active .gallery-caption {
      transform: translateY(0);
    }
    .gallery-item.touch-active img {
      transform: scale(1.05);
    }
  `;
  document.head.appendChild(touchStyle);

  // ============================================
  // MOBILE TESTIMONIAL CAROUSEL
  // ============================================
  function initTestimonialCarousel() {
    const grid = document.querySelector('.depoimentos-grid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.depoimento-card');
    if (cards.length <= 1) return;

    const dotsContainer = document.getElementById('carousel-dots');

    if (window.innerWidth >= 768) {
      // Remove carousel mode
      grid.style.cssText = '';
      cards.forEach(card => card.style.cssText = '');
      if (dotsContainer) dotsContainer.innerHTML = '';
      return;
    }

    // Carousel mode for mobile (break out of container for edge-to-edge scroll with margins)
    grid.style.cssText = `
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      gap: 1rem;
      padding-bottom: 1rem;
      scrollbar-width: none;
      -ms-overflow-style: none;
      width: 100vw;
      margin-left: -1.25rem;
      margin-right: -1.25rem;
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    `;

    // Hide scrollbar
    const carouselStyle = document.getElementById('carousel-style') || document.createElement('style');
    carouselStyle.id = 'carousel-style';
    carouselStyle.textContent = `
      .depoimentos-grid::-webkit-scrollbar { display: none; }
    `;
    if (!document.getElementById('carousel-style')) {
      document.head.appendChild(carouselStyle);
    }

    cards.forEach(card => {
      card.style.cssText = `
        width: calc(100vw - 3.5rem);
        min-width: calc(100vw - 3.5rem);
        max-width: calc(100vw - 3.5rem);
        scroll-snap-align: start;
        flex-shrink: 0;
      `;
    });

    // Generate indicator dots dynamically
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      cards.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Ir para depoimento ${idx + 1}`);
        if (idx === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
          const cardWidth = cards[0].offsetWidth + 16; // width + gap (1rem = 16px)
          grid.scrollTo({
            left: idx * cardWidth,
            behavior: 'smooth'
          });
        });
        dotsContainer.appendChild(dot);
      });

      // Synchronize active dot with scroll swipe
      grid.addEventListener('scroll', () => {
        const scrollPosition = grid.scrollLeft;
        const cardWidth = cards[0].offsetWidth + 16; // width + gap (1rem = 16px)
        const activeIndex = Math.round(scrollPosition / cardWidth);
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });
      }, { passive: true });
    }
  }

  initTestimonialCarousel();
  window.addEventListener('resize', debounce(initTestimonialCarousel, 250));

  // ============================================
  // UTILITY: DEBOUNCE
  // ============================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ============================================
  // METRIC COUNTER ANIMATION
  // ============================================
  const metricsSection = document.querySelector('.sobre-metrics');
  const metricValues = document.querySelectorAll('.metric-value[data-count]');

  if (metricsSection && metricValues.length > 0 && 'IntersectionObserver' in window) {
    let animated = false;

    const countUp = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1500; // 1.5s animation
      const startTime = performance.now();

      const updateCount = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out quad function for smooth deceleration
        const easeProgress = progress * (2 - progress);
        const currentCount = Math.floor(easeProgress * target);

        el.textContent = currentCount + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCount);
    };

    const metricsObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !animated) {
        metricValues.forEach(val => countUp(val));
        animated = true;
        metricsObserver.unobserve(entry.target);
      }
    }, {
      threshold: 0.1
    });

    metricsObserver.observe(metricsSection);
  }

  // ============================================
  // PARALLAX EFFECT ON HERO (Performance Optimized)
  // ============================================
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg img');
  if (hero && heroBg && window.matchMedia('(min-width: 768px)').matches) {
    let cachedHeroHeight = hero.offsetHeight;

    // Update cached height only on resize (debounced)
    window.addEventListener('resize', debounce(() => {
      cachedHeroHeight = hero.offsetHeight;
    }, 250));

    // Track hero visibility so scroll event doesn't do work when hero is offscreen
    let isHeroVisible = true;
    const heroObserver = new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
    }, { threshold: 0 });

    heroObserver.observe(hero);

    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
      if (!isHeroVisible) return;
      if (!parallaxTicking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY <= cachedHeroHeight) {
            heroBg.style.transform = `translate3d(0, ${scrollY * 0.25}px, 0) scale(1.1)`;
          }
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });

    // Initial scale and layer promotion for parallax
    heroBg.style.transform = 'translate3d(0, 0, 0) scale(1.1)';
  }

  // ============================================
  // FAQ ACCORDION
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items for a clean single-open accordion feel
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          otherAnswer.style.maxHeight = null;
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle active class and expand/collapse answer container
      item.classList.toggle('active');
      
      if (isActive) {
        answer.style.maxHeight = null;
        question.setAttribute('aria-expanded', 'false');
      } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ============================================
  // INITIAL STATE
  // ============================================
  // IntersectionObservers handle initial state detection automatically on setup
});
