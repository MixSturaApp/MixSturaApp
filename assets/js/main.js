/**
 * MixStūra — Video Downloader & Stream Muxer
 * Product Landing Page Script
 * 
 * Minimal vanilla JavaScript for navigation, link management, and UI states.
 * No external dependencies.
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Centralized External Links Configuration
     ========================================================================== */
  const LINKS = {
    github: 'https://github.com/MixSturaApp/MixSturaApp',
    issues: 'https://github.com/MixSturaApp/MixSturaApp/issues',
    discussions: 'https://github.com/MixSturaApp/MixSturaApp/discussions',
    discussionsIdeas: 'https://github.com/MixSturaApp/MixSturaApp/discussions/categories/ideas',
    downloadChrome: 'CONFIGURE_ME',
    downloadFirefox: 'CONFIGURE_ME'
  };

  /**
   * Apply configured links to DOM elements with [data-link] attributes.
   */
  function initLinks() {
    const linkMap = {
      'github': { url: LINKS.github, external: true },
      'bug': { url: LINKS.issues, external: true },
      'feedback': { url: LINKS.discussions, external: true },
      'ideas': { url: LINKS.discussionsIdeas, external: true },
      'download-chrome': {
        url: LINKS.downloadChrome === 'CONFIGURE_ME' ? '#browsers' : LINKS.downloadChrome,
        external: LINKS.downloadChrome !== 'CONFIGURE_ME'
      },
      'download-firefox': {
        url: LINKS.downloadFirefox === 'CONFIGURE_ME' ? '#browsers' : LINKS.downloadFirefox,
        external: LINKS.downloadFirefox !== 'CONFIGURE_ME'
      }
    };

    document.querySelectorAll('[data-link]').forEach(function (el) {
      const key = el.getAttribute('data-link');
      if (key && linkMap[key]) {
        const config = linkMap[key];
        el.setAttribute('href', config.url);
        if (config.external) {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
        }
      }
    });
  }

  /* ==========================================================================
     2. Mobile Navigation Toggle & Accessibility
     ========================================================================== */
  function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navBackdrop = document.getElementById('nav-backdrop');
    const navLinks = document.querySelectorAll('.nav__link, .nav__cta');
    const header = document.querySelector('.header');

    if (!navToggle || !navMenu) return;

    function openMenu() {
      navToggle.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('is-open');
      if (navBackdrop) navBackdrop.classList.add('is-visible');
      document.body.classList.add('menu-open');
    }

    function closeMenu(returnFocus) {
      const wasOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (!wasOpen) return;

      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      if (navBackdrop) navBackdrop.classList.remove('is-visible');
      document.body.classList.remove('menu-open');

      if (returnFocus) {
        navToggle.focus();
      }
    }

    navToggle.addEventListener('click', function () {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu(false);
      } else {
        openMenu();
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', function () {
        closeMenu(true);
      });
    }

    // Close menu when a navigation item is clicked
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu(false);
      });
    });

    // Close menu on Escape key and return focus
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        if (navToggle.getAttribute('aria-expanded') === 'true') {
          closeMenu(true);
        }
      }
    });

    /* ==========================================================================
       3. Header Scroll Elevation
       ========================================================================== */
    function handleScroll() {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ==========================================================================
       4. Active Navigation Observer
       ========================================================================== */
    if ('IntersectionObserver' in window) {
      const sections = document.querySelectorAll('section[id]');
      const navLinksMap = new Map();

      document.querySelectorAll('.nav__link[href^="#"]').forEach(function (link) {
        const id = link.getAttribute('href').substring(1);
        if (id) {
          navLinksMap.set(id, link);
        }
      });

      const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
      };

      const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinksMap.forEach(function (link, id) {
              if (id === currentId) {
                link.classList.add('is-active');
              } else {
                link.classList.remove('is-active');
              }
            });
          }
        });
      }, observerOptions);

      sections.forEach(function (section) {
        sectionObserver.observe(section);
      });
    }
  }

  /* ==========================================================================
     5. Initialization
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initLinks();
    initNavigation();
  });
})();
