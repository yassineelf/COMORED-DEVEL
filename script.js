document.addEventListener('DOMContentLoaded', function () {
  var header = document.getElementById('header');
  var navToggle = document.getElementById('navToggle');
  var navList = document.querySelector('.nav-list');
  var navOverlay = document.getElementById('navOverlay');
  var bodyEl = document.body;
  var dropdownItems = document.querySelectorAll('.nav-item-dropdown');
  function closeMobile() {
    if (navList) navList.classList.remove('open');
    if (navToggle) navToggle.classList.remove('active');
    if (navOverlay) {
      navOverlay.classList.remove('open');
      navOverlay.setAttribute('aria-hidden', 'true');
    }
    if (bodyEl) bodyEl.classList.remove('menu-open');
  }
  function toggleMobile() {
    if (!navList || !navToggle) return;
    var isOpen = navList.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    if (navOverlay) {
      navOverlay.classList.toggle('open', isOpen);
      navOverlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    }
    if (bodyEl) bodyEl.classList.toggle('menu-open', isOpen);
  }
  if (navToggle) {
    navToggle.addEventListener('click', toggleMobile);
  }
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobile);
  }
  var navLinks = document.querySelectorAll('.nav-list a');
  if (navLinks.length) {
    navLinks.forEach(function (a) {
      a.addEventListener('click', closeMobile);
    });
  }
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) {
      closeMobile();
    }
  });
  var faqButtons = document.querySelectorAll('.faq-question');
  function closeAllFaq() {
    document.querySelectorAll('.faq-item').forEach(function (it) {
      it.setAttribute('aria-expanded', 'false');
      var b = it.querySelector('.faq-question');
      if (b) b.setAttribute('aria-expanded', 'false');
      var a = it.querySelector('.faq-answer');
      if (a) a.hidden = true;
    });
  }
  if (faqButtons.length) {
    faqButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        var item = btn.closest('.faq-item');
        var answerId = btn.getAttribute('aria-controls');
        var answer = answerId ? document.getElementById(answerId) : null;
        closeAllFaq();
        if (!expanded) {
          if (item) item.setAttribute('aria-expanded', 'true');
          btn.setAttribute('aria-expanded', 'true');
          if (answer) answer.hidden = false;
        }
      });
    });
  }
  function setDropdown(item, expanded) {
    if (!item) return;
    item.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    var menu = item.querySelector('.nav-dropdown');
    if (menu) menu.setAttribute('aria-hidden', expanded ? 'false' : 'true');
  }
  if (dropdownItems.length) {
    dropdownItems.forEach(function (item) {
      var btn = item.querySelector('.nav-link-dropdown');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isExpanded = item.getAttribute('aria-expanded') === 'true';
        dropdownItems.forEach(function (other) {
          if (other !== item) setDropdown(other, false);
        });
        setDropdown(item, !isExpanded);
      });
    });
  }
  document.addEventListener('click', function (e) {
    dropdownItems.forEach(function (item) { setDropdown(item, false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      dropdownItems.forEach(function (item) { setDropdown(item, false); });
      closeMobile();
    }
  });
  var hero = document.querySelector('.hero');
  function applyHeaderTransparency() {
    if (!header) return;
    var scrolled = window.scrollY > 10;
    header.classList.toggle('scrolled', scrolled);
    var overHero = hero && window.scrollY < 10;
    header.classList.toggle('transparent', !!overHero);
  }


  // Hero slider (ensure Import & Export appears on phones)
  var slides = document.querySelectorAll('.hero-slide');
  var dotsWrap = document.getElementById('heroDots');
  var btnPrev = document.getElementById('heroPrev');
  var btnNext = document.getElementById('heroNext');
  var current = 0;
  var autoTimer = null;

  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach(function (s, i) {
      s.classList.toggle('hero-slide-active', i === index);
    });
    var dots = dotsWrap ? dotsWrap.querySelectorAll('.hero-dot') : [];
    if (dots.length) {
      dots.forEach(function (d, i) {
        d.classList.toggle('hero-dot-active', i === index);
      });
    }
    current = index;
  }

  function nextSlide() { showSlide((current + 1) % slides.length); }
  function prevSlide() { showSlide((current - 1 + slides.length) % slides.length); }

  function buildDots() {
    if (!dotsWrap || !slides.length) return;
    dotsWrap.innerHTML = '';
    slides.forEach(function (_s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hero-dot' + (i === 0 ? ' hero-dot-active' : '');
      b.setAttribute('aria-label', 'Aller au slide ' + (i + 1));
      b.addEventListener('click', function () { showSlide(i); resetAuto(); });
      dotsWrap.appendChild(b);
    });
  }

  function startAuto() {
    if (slides.length < 2) return;
    stopAuto();
    autoTimer = setInterval(nextSlide, 6000);
  }
  function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
  function resetAuto() { stopAuto(); startAuto(); }

  if (slides.length) {
    buildDots();
    // Ensure first visible is slide 0 on load, then auto-play so second slide (Import & Export) appears on phones
    var initial = Array.prototype.findIndex.call(slides, function (el) { return el.classList.contains('hero-slide-active'); });
    if (initial < 0) initial = 0;
    showSlide(initial);
    if (btnPrev) btnPrev.addEventListener('click', function () { prevSlide(); resetAuto(); });
    if (btnNext) btnNext.addEventListener('click', function () { nextSlide(); resetAuto(); });
    startAuto();
  }

  var revealSelectors = [
    '.section-title',
    '.section-subtitle',
    '.application-card',
    '.service-card',
    '.about-content > *',
    '.solution-card',
    '.faq-item',
    '.contact-layout > *',
    '.footer .footer-col',
    '.value-content > *'
  ];
  var revealEls = [];
  revealSelectors.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      revealEls.push(el);
    });
  });
  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        entry.target.classList.remove('reveal-init');
        ro.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  revealEls.forEach(function (el) {
    el.classList.add('reveal-init');
    ro.observe(el);
    var parent = el.parentElement;
    if (parent && (parent.classList.contains('applications-grid') ||
      parent.classList.contains('services-grid') ||
      parent.classList.contains('solutions-grid') ||
      parent.classList.contains('about-stats') ||
      parent.classList.contains('footer-grid') ||
      parent.classList.contains('contact-layout'))) {
      Array.prototype.forEach.call(parent.children, function (child, idx) {
        child.style.transitionDelay = (idx * 80) + 'ms';
      });
    }
  });

  var contactForms = document.querySelectorAll('#contactForm');
  if (contactForms.length) {
    contactForms.forEach(function (form) {
      var submitBtn = form.querySelector('button[type="submit"]');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (form.querySelector('#name') || {}).value || '';
        var email = (form.querySelector('#email') || {}).value || '';
        var phone = (form.querySelector('#phone') || {}).value || '';
        var subject = (form.querySelector('#subject') || {}).value || '';
        var message = (form.querySelector('#message') || {}).value || '';
        var to = 'comoredevel@gmail.com';
        var body = [
          'Nom: ' + name,
          'Email: ' + email,
          'Téléphone: ' + phone,
          'Sujet: ' + subject,
          '',
          'Message:',
          message
        ].join('\n');
        var mailto = 'mailto:' + to + '?subject=' + encodeURIComponent('[Réservation] ' + subject) + '&body=' + encodeURIComponent(body);
        window.location.href = mailto;
        if (submitBtn) {
          submitBtn.classList.add('btn-sent');
          submitBtn.textContent = 'Envoyé ✓';
          submitBtn.disabled = true;
        }
        ['name', 'email', 'phone', 'subject', 'message'].forEach(function (id) {
          var field = form.querySelector('#' + id);
          if (field && 'placeholder' in field) {
            field.value = '';
            field.placeholder = 'Envoyé';
          }
        });
        setTimeout(function () {
          if (submitBtn) {
            submitBtn.classList.remove('btn-sent');
            submitBtn.textContent = 'Envoyer le message';
            submitBtn.disabled = false;
          }
          ['name', 'email', 'phone', 'subject', 'message'].forEach(function (id) {
            var field = form.querySelector('#' + id);
            if (field && 'placeholder' in field) {
              field.placeholder = '';
            }
          });
        }, 6000);
      });
    });
  }
  
  var chatToggle = document.createElement('button');
  chatToggle.className = 'ai-chat-toggle';
  chatToggle.setAttribute('aria-label', 'Ouvrir le chat');
  chatToggle.textContent = '💬';
  var chatPanel = document.createElement('div');
  chatPanel.className = 'ai-chat-panel';
  var chatHeader = document.createElement('div');
  chatHeader.className = 'ai-chat-header';
  chatHeader.textContent = 'Assistant';
  var chatMessages = document.createElement('div');
  chatMessages.className = 'ai-chat-messages';
  var chatInputWrap = document.createElement('div');
  chatInputWrap.className = 'ai-chat-input';
  var chatInput = document.createElement('input');
  chatInput.type = 'text';
  chatInput.placeholder = 'Écrire un message...';
  var chatSend = document.createElement('button');
  chatSend.type = 'button';
  chatSend.textContent = 'Envoyer';
  chatInputWrap.appendChild(chatInput);
  chatInputWrap.appendChild(chatSend);
  chatPanel.appendChild(chatHeader);
  chatPanel.appendChild(chatMessages);
  chatPanel.appendChild(chatInputWrap);
  document.body.appendChild(chatToggle);
  document.body.appendChild(chatPanel);
  function addMsg(role, text) {
    var d = document.createElement('div');
    d.className = 'ai-chat-msg ' + (role === 'user' ? 'user' : 'ai');
    d.textContent = text;
    chatMessages.appendChild(d);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function sendChat() {
    var text = chatInput.value.trim();
    if (!text) return;
    addMsg('user', text);
    chatInput.value = '';
    var typing = document.createElement('div');
    typing.className = 'ai-chat-msg ai';
    typing.textContent = '…';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    var candidates = [];
    if (window.AI_CHAT_ENDPOINT) candidates.push(window.AI_CHAT_ENDPOINT);
    candidates.push('api/chat.php');
    candidates.push('/api/chat.php');
    function tryFetch(i) {
      if (i >= candidates.length) {
        typing.remove();
        addMsg('ai', 'Le service n’est pas configuré. Vérifiez le chemin de api/chat.php et la clé serveur.');
        return;
      }
      var url = candidates[i];
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      }).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      }).then(function (data) {
        typing.remove();
        var reply = (data && (data.reply || data.message)) || 'Réponse indisponible';
        addMsg('ai', reply);
      }).catch(function () {
        tryFetch(i + 1);
      });
    }
    tryFetch(0);
  }
  chatToggle.addEventListener('click', function () {
    chatPanel.classList.toggle('open');
  });
  chatSend.addEventListener('click', sendChat);
  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') sendChat();
  });
});
