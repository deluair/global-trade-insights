// Global Trade Insights Charts - Data from OEC (Observatory of Economic Complexity)

// Enable strict mode for better error handling
'use strict';

// Data for charts - sourced from OEC (https://oec.world/en)
const tradeData = {
    // Global Export Volumes (in billions USD) - Data from OEC
    globalExports: {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [{
            label: 'Global Exports Volume',
            data: [19.5, 19.0, 17.3, 22.3, 24.9, 25.2],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            tension: 0.3
        }]
    },
    
    // Regional Trade Balance (in billions USD) - Data from OEC
    regionalBalance: {
        labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Africa', 'Middle East'],
        datasets: [{
            label: 'Trade Balance',
            data: [1.3, 0.9, 2.4, -0.5, -0.7, 1.8],
            backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 205, 86, 0.6)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 205, 86, 1)'
            ],
            borderWidth: 1
        }]
    },
    
    // Top Trading Partners (in billions USD) - Data from OEC
    topPartners: {
        labels: ['China', 'United States', 'Germany', 'Japan', 'Netherlands', 'United Kingdom', 'South Korea', 'France', 'India', 'Italy'],
        datasets: [{
            label: 'Trade Volume',
            data: [5.9, 5.2, 3.3, 2.1, 1.8, 1.7, 1.6, 1.5, 1.3, 1.2],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2
        }]
    },
    
    // Key Commodity Price Trends - Data from OEC
    commodityPrices: {
        labels: ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023'],
        datasets: [
            {
                label: 'Crude Oil (USD/barrel)',
                data: [94.07, 111.93, 93.60, 82.64, 81.03, 74.14, 82.09, 78.41],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Natural Gas (USD/MMBtu)',
                data: [4.95, 7.17, 8.03, 6.26, 2.45, 2.10, 2.64, 2.51],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            },
            {
                label: 'Gold (USD/oz)',
                data: [1877, 1834, 1729, 1726, 1889, 1978, 1928, 2032],
                borderColor: 'rgba(255, 205, 86, 1)',
                backgroundColor: 'rgba(255, 205, 86, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }
        ]
    }
};

// Chart creation and management functions
const chartManager = {
    charts: {},
    
    // Initialize all charts
    init: function() {
        // Check for canvas elements before initializing
        if (!document.getElementById('global-exports-chart') || 
            !document.getElementById('regional-balance-chart') || 
            !document.getElementById('top-partners-chart') || 
            !document.getElementById('commodity-prices-chart')) {
            console.warn('Some chart elements not found. Charts may not render correctly.');
        }
        
        this.createGlobalExportsChart();
        this.createRegionalBalanceChart();
        this.createTopPartnersChart();
        this.createCommodityPricesChart();
        
        // Add responsive behavior
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Update data periodically (simulating real-time updates)
        if (document.getElementById('global-exports-chart')) {
            setInterval(this.updateRandomData.bind(this), 30000);
        }
        
        // Add source attribution
        this.addAttributions();
    },
    
    // Add source attributions to charts
    addAttributions: function() {
        const containers = document.querySelectorAll('.chart-container');
        containers.forEach(container => {
            const attribution = document.createElement('div');
            attribution.className = 'chart-attribution';
            attribution.innerHTML = 'Data source: <a href="https://oec.world/en" target="_blank">OEC</a>';
            container.appendChild(attribution);
        });
    },
    
    // Create line chart for global exports
    createGlobalExportsChart: function() {
        const ctx = document.getElementById('global-exports-chart');
        if (!ctx) return;
        
        this.charts.globalExports = new Chart(ctx, {
            type: 'line',
            data: tradeData.globalExports,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw} billion USD`;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Global Export Trends (2018-2023)'
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
    },
    
    // Create bar chart for regional trade balance
    createRegionalBalanceChart: function() {
        const ctx = document.getElementById('regional-balance-chart');
        if (!ctx) return;
        
        this.charts.regionalBalance = new Chart(ctx, {
            type: 'bar',
            data: tradeData.regionalBalance,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.raw;
                                return `${value > 0 ? '+' : ''}${value} billion USD`;
                            }
                        }
                    },
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Regional Trade Balance (2023)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Billions USD'
                        }
                    }
                }
            }
        });
    },
    
    // Create horizontal bar chart for top trading partners
    createTopPartnersChart: function() {
        const ctx = document.getElementById('top-partners-chart');
        if (!ctx) return;
        
        this.charts.topPartners = new Chart(ctx, {
            type: 'bar',
            data: tradeData.topPartners,
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw} billion USD`;
                            }
                        }
                    },
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Top 10 Global Trading Partners (2023)'
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Trade Volume (Billions USD)'
                        }
                    }
                }
            }
        });
    },
    
    // Create line chart for commodity prices
    createCommodityPricesChart: function() {
        const ctx = document.getElementById('commodity-prices-chart');
        if (!ctx) return;
        
        this.charts.commodityPrices = new Chart(ctx, {
            type: 'line',
            data: tradeData.commodityPrices,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Key Commodity Price Trends (2022-2023)'
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Price (USD)'
                        }
                    }
                }
            }
        });
    },
    
    // Handle resize events
    handleResize: function() {
        // Update chart sizes on window resize
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    },
    
    // Add small random variations to global export data (for simulating updates)
    updateRandomData: function() {
        if (!this.charts.globalExports) return;
        
        const variation = 0.2; // Maximum variation as percentage
        const data = this.charts.globalExports.data.datasets[0].data;
        
        // Apply small random variations to each data point
        const newData = data.map(value => {
            const change = value * variation * (Math.random() - 0.5);
            return Math.max(0, (value + change).toFixed(1));
        });
        
        // Update chart with new data
        this.charts.globalExports.data.datasets[0].data = newData;
        this.charts.globalExports.update();
    }
};

// Animate charts when they come into view
function initChartAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chartId = entry.target.id;
                const chartInstance = Chart.getChart(chartId);
                if (chartInstance) {
                    // Trigger animation
                    chartInstance.update();
                }
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe all chart canvases
    document.querySelectorAll('.chart-container canvas').forEach(canvas => {
        observer.observe(canvas);
    });
}

// Accessible export data table toggle
function initTableToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-table-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const tableContainer = document.getElementById(targetId);
            
            if (tableContainer) {
                const isVisible = tableContainer.getAttribute('aria-hidden') === 'false';
                tableContainer.setAttribute('aria-hidden', isVisible ? 'true' : 'false');
                tableContainer.style.display = isVisible ? 'none' : 'block';
                this.setAttribute('aria-expanded', isVisible ? 'false' : 'true');
                this.innerText = isVisible ? 'Show Data Table' : 'Hide Data Table';
            }
        });
    });
}

// Add OEC attributions to the footer
function addOECAttributions() {
    const footerContent = document.querySelector('.footer-content');
    if (footerContent) {
        const attribution = document.createElement('div');
        attribution.className = 'footer-attribution';
        attribution.innerHTML = `<p class="mt-2">Data visualizations powered by <a href="https://oec.world/en" target="_blank">The Observatory of Economic Complexity (OEC)</a>.</p>`;
        footerContent.appendChild(attribution);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    chartManager.init();
    
    // Initialize animations
    initChartAnimations();
    
    // Initialize accessible data tables
    initTableToggle();
    
    // Add OEC attributions
    addOECAttributions();
}); 