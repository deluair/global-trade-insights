// Global Trade Insights - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a, .hero-buttons a, .footer-column a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply to links that start with #
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                    }
                    
                    // Scroll to target element
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    document.querySelectorAll('nav a').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('nav a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    });
    
    // Form submission handler
    const contactForm = document.getElementById('inquiry-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real application, you would send the form data to a server
            // For this demo, we'll just show a success message
            alert('Thank you for your inquiry! We will get back to you soon.');
            contactForm.reset();
        });
    }
    
    // Initialize Charts
    initializeCharts();
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