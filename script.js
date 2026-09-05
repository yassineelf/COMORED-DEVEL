(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var nav = document.getElementById('siteNav');
  var toggle = document.getElementById('navToggle');
  var overlay = document.getElementById('navOverlay');

  function setMenu(open) {
    if (!nav || !toggle) return;

    nav.classList.toggle('open', open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute(
      'aria-label',
      open ? 'Fermer le menu' : 'Ouvrir le menu'
    );

    if (overlay) {
      overlay.classList.toggle('open', open);
      overlay.setAttribute('aria-hidden', String(!open));
    }

    document.body.classList.toggle('menu-open', open);
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function () {
      setMenu(false);
    });
  }

  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false);
    });
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) {
      setMenu(false);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      setMenu(false);
    }
  });

  function updateHeader() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }
  }

  updateHeader();

  window.addEventListener('scroll', updateHeader, {
    passive: true
  });

  document.querySelectorAll('[data-year]').forEach(function (element) {
    element.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll('.faq-question').forEach(function (button) {
    button.addEventListener('click', function () {
      var isOpen = button.getAttribute('aria-expanded') === 'true';
      var targetId = button.getAttribute('aria-controls');
      var answer = targetId
        ? document.getElementById(targetId)
        : null;

      document.querySelectorAll('.faq-question').forEach(function (other) {
        var otherId = other.getAttribute('aria-controls');
        var otherAnswer = otherId
          ? document.getElementById(otherId)
          : null;

        other.setAttribute('aria-expanded', 'false');

        if (otherAnswer) {
          otherAnswer.hidden = true;
        }
      });

      if (!isOpen) {
        button.setAttribute('aria-expanded', 'true');

        if (answer) {
          answer.hidden = false;
        }
      }
    });
  });

  document.documentElement.classList.add('js-enabled');

  var reducedMotion = window
    .matchMedia('(prefers-reduced-motion: reduce)')
    .matches;

  var revealItems = document.querySelectorAll('.reveal');

  if (!reducedMotion && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('visible');
    });
  }
})();
