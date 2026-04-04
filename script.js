// ============================================
// GEDEXCOM - JavaScript pour le site web
// ============================================

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // INTERSECTION OBSERVER POUR ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les cartes de services
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });

    // Observer les cartes de contact
    document.querySelectorAll('.contact-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });

    // ============================================
    // FORMULAIRE DE CONTACT
    // ============================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Afficher un message de succès
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;
            
            // Simuler l'envoi (à remplacer par une vraie requête API)
            setTimeout(() => {
                submitButton.textContent = '✓ Message envoyé!';
                submitButton.style.background = '#4CAF50';
                
                // Réinitialiser le formulaire
                contactForm.reset();
                
                // Réinitialiser le bouton après 3 secondes
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                }, 3000);
                
                // Afficher une notification
                showNotification('Merci! Votre message a été envoyé avec succès.', 'success');
            }, 1500);
        });
    }

    // ============================================
    // FONCTION DE NOTIFICATION
    // ============================================
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // ============================================
    // ANIMATION HERO AU SCROLL
    // ============================================
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            hero.style.opacity = 1 - scrolled / 500;
        }
    });

    // ============================================
    // EFFET PARALLAXE POUR LES IMAGES
    // ============================================
    const parallaxElements = document.querySelectorAll('.placeholder-image');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight && rect.bottom > 0) {
                const speed = 0.1;
                const elementTop = rect.top + scrolled;
                const yPos = -(scrolled - elementTop) * speed;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    });

    // ============================================
    // COMPTEUR ANIMÉ (pour statistiques)
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // ============================================
    // MISE À JOUR EMAIL DYNAMIQUE
    // ============================================
    const emailLink = document.getElementById('emailLink');
    if (emailLink) {
        // L'utilisateur pourra mettre à jour l'email plus tard
        // emailLink.href = 'mailto:votre-email@gedexcom.com';
        // emailLink.textContent = 'votre-email@gedexcom.com';
    }

    // ============================================
    // EFFET HOVER SUR LES CARTES
    // ============================================
    document.querySelectorAll('.service-card, .contact-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // ============================================
    // LAZY LOADING POUR LES IMAGES
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // ANIMATIONS CSS DYNAMIQUES
    // ============================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);


    // ============================================
    // PRÉCHARGEMENT DES POLICES
    // ============================================
    document.fonts.ready.then(() => {
        document.body.style.opacity = '1';
    });

    console.log('GEDEXCOM - Site web chargé avec succès!');
});

