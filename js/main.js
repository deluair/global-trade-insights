// Global Trade Insights - Main JS

'use strict';

// Main application object
const App = {
    // Initialize the application
    init: function() {
        this.initNavigation();
        this.initScrollEffects();
        this.initFormValidation();
        this.initCookieConsent();
        this.initLazyLoading();
        this.initAccessibility();
        
        // Dispatch event for other scripts to know the app is ready
        document.dispatchEvent(new Event('app:ready'));
    },
    
    // Initialize navigation functionality
    initNavigation: function() {
        // Mobile menu toggle
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function() {
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                navMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                
                // Update the button text for screen readers
                this.querySelector('.sr-only').textContent = expanded ? 'Open Menu' : 'Close Menu';
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                if (navMenu.classList.contains('active') && 
                    !navMenu.contains(event.target) && 
                    !menuToggle.contains(event.target)) {
                    menuToggle.click();
                }
            });
        }
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                
                // Only process if the href is a valid ID selector
                if (targetId.length > 1) {
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Close mobile menu if open
                        if (navMenu && navMenu.classList.contains('active')) {
                            menuToggle.click();
                        }
                        
                        // Smooth scroll to target
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update URL without page reload
                        history.pushState(null, '', targetId);
                        
                        // Set focus to the section for accessibility
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus();
                    }
                }
            });
        });
    },
    
    // Initialize scroll effects
    initScrollEffects: function() {
        // Highlight active navigation item on scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        if (sections.length && navLinks.length) {
            // Create an Intersection Observer to detect when sections are in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeId = entry.target.getAttribute('id');
                        
                        // Update active navigation link
                        navLinks.forEach(link => {
                            const linkHref = link.getAttribute('href').substring(1);
                            if (linkHref === activeId) {
                                link.classList.add('active');
                                link.setAttribute('aria-current', 'page');
                            } else {
                                link.classList.remove('active');
                                link.removeAttribute('aria-current');
                            }
                        });
                        
                        // Update URL without causing a page reload
                        history.replaceState(null, null, `#${activeId}`);
                    }
                });
            }, { threshold: 0.5 });
            
            // Observe all sections
            sections.forEach(section => observer.observe(section));
        }
        
        // Fade-in animations for elements
        const fadeElements = document.querySelectorAll('.fade-in');
        
        if (fadeElements.length) {
            const fadeObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        fadeObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            fadeElements.forEach(element => fadeObserver.observe(element));
        }
    },
    
    // Initialize form validation
    initFormValidation: function() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            // Form validation messages
            const errorMessages = {
                required: 'This field is required.',
                email: 'Please enter a valid email address.',
                minLength: 'Please enter at least {min} characters.',
                maxLength: 'Please enter no more than {max} characters.'
            };
            
            // Form submission handler
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Reset previous validation state
                const errorElements = this.querySelectorAll('.error-message');
                errorElements.forEach(el => el.remove());
                this.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
                
                // Validate all required fields
                let isValid = true;
                
                // Name validation
                const nameInput = this.querySelector('#name');
                if (!nameInput.value.trim()) {
                    showError(nameInput, errorMessages.required);
                    isValid = false;
                } else if (nameInput.value.trim().length < 2) {
                    showError(nameInput, errorMessages.minLength.replace('{min}', '2'));
                    isValid = false;
                }
                
                // Email validation
                const emailInput = this.querySelector('#email');
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailInput.value.trim()) {
                    showError(emailInput, errorMessages.required);
                    isValid = false;
                } else if (!emailPattern.test(emailInput.value)) {
                    showError(emailInput, errorMessages.email);
                    isValid = false;
                }
                
                // Message validation
                const messageInput = this.querySelector('#message');
                if (!messageInput.value.trim()) {
                    showError(messageInput, errorMessages.required);
                    isValid = false;
                } else if (messageInput.value.trim().length < 10) {
                    showError(messageInput, errorMessages.minLength.replace('{min}', '10'));
                    isValid = false;
                }
                
                // If valid, submit the form or show success message
                if (isValid) {
                    // Show success message
                    const formElements = this.elements;
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                    
                    // Hide form elements and show success message
                    Array.from(formElements).forEach(el => {
                        if (el.type !== 'hidden') {
                            el.style.display = 'none';
                        }
                    });
                    
                    this.appendChild(successMessage);
                    
                    // Reset form after delay (simulating form submission)
                    setTimeout(() => {
                        // Reset the form
                        this.reset();
                        
                        // Remove success message
                        successMessage.remove();
                        
                        // Show form elements again
                        Array.from(formElements).forEach(el => {
                            if (el.type !== 'hidden') {
                                el.style.display = '';
                            }
                        });
                    }, 5000);
                }
            });
            
            // Function to show error message
            function showError(inputElement, message) {
                const formGroup = inputElement.closest('.form-group');
                formGroup.classList.add('has-error');
                
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = message;
                
                formGroup.appendChild(errorElement);
                
                // Add aria attributes for accessibility
                inputElement.setAttribute('aria-invalid', 'true');
                errorElement.id = inputElement.id + '-error';
                inputElement.setAttribute('aria-describedby', errorElement.id);
            }
            
            // Real-time validation feedback
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    // Trigger validation when input loses focus
                    if (this.value.trim()) {
                        this.classList.add('touched');
                    }
                });
                
                input.addEventListener('input', function() {
                    if (this.classList.contains('touched')) {
                        // Remove error state when user starts typing again
                        const formGroup = this.closest('.form-group');
                        const errorElement = formGroup.querySelector('.error-message');
                        
                        if (errorElement) {
                            errorElement.remove();
                            formGroup.classList.remove('has-error');
                            this.removeAttribute('aria-invalid');
                            this.removeAttribute('aria-describedby');
                        }
                    }
                });
            });
        }
    },
    
    // Initialize cookie consent banner
    initCookieConsent: function() {
        const cookieBanner = document.querySelector('.cookie-banner');
        const acceptBtn = document.querySelector('.cookie-accept');
        const declineBtn = document.querySelector('.cookie-decline');
        
        if (cookieBanner && acceptBtn && declineBtn) {
            // Check if user has already made a choice
            const consentChoice = localStorage.getItem('cookieConsent');
            
            if (!consentChoice) {
                // Show banner if no choice has been made
                cookieBanner.classList.add('active');
                
                // Handle accept button
                acceptBtn.addEventListener('click', function() {
                    localStorage.setItem('cookieConsent', 'accepted');
                    cookieBanner.classList.remove('active');
                    
                    // Enable analytics (if installed)
                    if (window.enableAnalytics) {
                        window.enableAnalytics();
                    }
                });
                
                // Handle decline button
                declineBtn.addEventListener('click', function() {
                    localStorage.setItem('cookieConsent', 'declined');
                    cookieBanner.classList.remove('active');
                });
            } else if (consentChoice === 'accepted' && window.enableAnalytics) {
                // If consent was previously given, enable analytics
                window.enableAnalytics();
            }
        }
    },
    
    // Initialize lazy loading for images
    initLazyLoading: function() {
        // Use native lazy loading if supported
        if ('loading' in HTMLImageElement.prototype) {
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.loading = 'lazy';
            });
        } else {
            // Fallback to Intersection Observer for older browsers
            const lazyImages = document.querySelectorAll('img[data-src]');
            
            if (lazyImages.length) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                lazyImages.forEach(img => imageObserver.observe(img));
            }
        }
    },
    
    // Initialize additional accessibility features
    initAccessibility: function() {
        // Skip link focus fix
        const skipLink = document.querySelector('.skip-link');
        
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            });
        }
        
        // Add keyboard navigation for interactive elements
        const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        
        focusableElements.forEach(element => {
            // Add visible focus styles for keyboard users
            element.addEventListener('keyup', function(e) {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-nav');
                }
            });
            
            // Remove focus styles when using mouse
            element.addEventListener('mousedown', function() {
                document.body.classList.remove('keyboard-nav');
            });
        });
    }
};

// Enable analytics when consent is given
window.enableAnalytics = function() {
    // Check if Google Analytics is loaded
    if (window.ga) {
        // Enable tracking
        window.ga('set', 'anonymizeIp', true);
        window.ga('send', 'pageview');
        console.log('Analytics enabled');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    App.init();
});

// Trade data visualization charts
function initializeCharts() {
    // Sample data - in a real app, this would come from an API or database
    
    // Global Trade Volume Chart
    if (document.getElementById('tradeVolumeChart')) {
        const tradeVolumeCtx = document.getElementById('tradeVolumeChart').getContext('2d');
        
        new Chart(tradeVolumeCtx, {
            type: 'line',
            data: {
                labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
                datasets: [
                    {
                        label: 'North America',
                        data: [5.2, 5.4, 4.1, 5.8, 6.2, 6.5],
                        borderColor: '#2c5282',
                        backgroundColor: 'rgba(44, 82, 130, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Europe',
                        data: [6.7, 6.4, 5.2, 6.9, 7.1, 7.3],
                        borderColor: '#4299e1',
                        backgroundColor: 'rgba(66, 153, 225, 0.1)',
                        tension: 0.3
                    },
                    {
                        label: 'Asia-Pacific',
                        data: [8.3, 8.1, 7.3, 9.2, 9.8, 10.2],
                        borderColor: '#ed8936',
                        backgroundColor: 'rgba(237, 137, 54, 0.1)',
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12
                        }
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Trade Volume (Trillion USD)'
                        },
                        beginAtZero: false
                    }
                }
            }
        });
    }
    
    // Trade Balance Chart
    if (document.getElementById('tradeBalanceChart')) {
        const tradeBalanceCtx = document.getElementById('tradeBalanceChart').getContext('2d');
        
        new Chart(tradeBalanceCtx, {
            type: 'bar',
            data: {
                labels: ['USA', 'China', 'Germany', 'Japan', 'UK', 'India'],
                datasets: [
                    {
                        label: 'Trade Balance (Billion USD)',
                        data: [-750, 420, 270, 150, -180, -190],
                        backgroundColor: function(context) {
                            const value = context.dataset.data[context.dataIndex];
                            return value < 0 ? '#f56565' : '#48bb78';
                        }
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { 
                                        style: 'currency', 
                                        currency: 'USD',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                        notation: 'compact',
                                        compactDisplay: 'short'
                                    }).format(context.parsed.y) + ' Billion';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Billions USD'
                        }
                    }
                }
            }
        });
    }
    
    // Tariff Impact Chart
    if (document.getElementById('tariffImpactChart')) {
        const tariffImpactCtx = document.getElementById('tariffImpactChart').getContext('2d');
        
        new Chart(tariffImpactCtx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Consumer Goods',
                        data: [
                            { x: 5, y: -3.2 },
                            { x: 10, y: -7.5 },
                            { x: 15, y: -12.8 },
                            { x: 20, y: -18.4 },
                            { x: 25, y: -24.2 }
                        ],
                        backgroundColor: '#4299e1'
                    },
                    {
                        label: 'Industrial Products',
                        data: [
                            { x: 5, y: -2.1 },
                            { x: 10, y: -4.5 },
                            { x: 15, y: -8.3 },
                            { x: 20, y: -13.7 },
                            { x: 25, y: -19.8 }
                        ],
                        backgroundColor: '#ed8936'
                    },
                    {
                        label: 'Agricultural Products',
                        data: [
                            { x: 5, y: -4.7 },
                            { x: 10, y: -9.3 },
                            { x: 15, y: -14.8 },
                            { x: 20, y: -21.2 },
                            { x: 25, y: -28.5 }
                        ],
                        backgroundColor: '#48bb78'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tariff Rate (%)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Trade Volume Change (%)'
                        }
                    }
                }
            }
        });
    }
    
    // Supply Chain Resilience Chart
    if (document.getElementById('supplyChainChart')) {
        const supplyChainCtx = document.getElementById('supplyChainChart').getContext('2d');
        
        new Chart(supplyChainCtx, {
            type: 'radar',
            data: {
                labels: [
                    'Diversity of Suppliers',
                    'Geographic Distribution',
                    'Inventory Levels',
                    'Transportation Network',
                    'Policy Environment',
                    'Digital Integration'
                ],
                datasets: [
                    {
                        label: 'Current Status',
                        data: [65, 59, 90, 81, 56, 55],
                        fill: true,
                        backgroundColor: 'rgba(66, 153, 225, 0.2)',
                        borderColor: '#4299e1',
                        pointBackgroundColor: '#4299e1',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#4299e1'
                    },
                    {
                        label: 'Target Resilience',
                        data: [85, 80, 95, 90, 75, 85],
                        fill: true,
                        backgroundColor: 'rgba(72, 187, 120, 0.2)',
                        borderColor: '#48bb78',
                        pointBackgroundColor: '#48bb78',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#48bb78'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12
                        }
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }
}

// Track scroll position to add effects
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    // Add scroll-triggered animations or effects here
    const cards = document.querySelectorAll('.metric-card, .analysis-card, .resource-card');
    
    cards.forEach(card => {
        const cardPosition = card.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;
        
        if (cardPosition < screenHeight * 0.85) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
}); 