// AI Finance Analyzer - Static Site JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Configuration
    let apiEndpoint = localStorage.getItem('apiEndpoint') || 'https://ai-finance-analyzer.onrender.com';
    
    // Initialize the application
    initializeApp();
    
    function initializeApp() {
        // Set up event listeners
        setupEventListeners();
        
        // Update API endpoint display
        updateApiEndpointDisplay();
        
        // Add smooth scrolling for navigation links
        setupSmoothScrolling();
        
        // Add scroll effects
        setupScrollEffects();
    }
    
    function setupEventListeners() {
        // Launch app buttons
        document.getElementById('launchApp').addEventListener('click', showConfigModal);
        document.getElementById('launchFullDemo').addEventListener('click', showConfigModal);
        document.getElementById('tryDemo').addEventListener('click', showDemo);
        document.getElementById('learnMore').addEventListener('click', scrollToFeatures);
        
        // Modal events
        document.getElementById('saveConfig').addEventListener('click', saveConfigAndLaunch);
        
        // Form submission
        const configForm = document.getElementById('apiEndpoint');
        configForm.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveConfigAndLaunch();
            }
        });
    }
    
    function showConfigModal() {
        const modal = new bootstrap.Modal(document.getElementById('configModal'));
        document.getElementById('apiEndpoint').value = apiEndpoint;
        modal.show();
    }
    
    function saveConfigAndLaunch() {
        const newEndpoint = document.getElementById('apiEndpoint').value.trim();
        
        if (!newEndpoint) {
            showAlert('Please enter a valid API endpoint', 'danger');
            return;
        }
        
        if (!newEndpoint.startsWith('http')) {
            showAlert('Please enter a valid URL starting with http:// or https://', 'danger');
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('apiEndpoint', newEndpoint);
        apiEndpoint = newEndpoint;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('configModal'));
        modal.hide();
        
        // Launch the full application
        launchFullApp();
    }
    
    function launchFullApp() {
        // Show loading state
        const button = document.getElementById('saveConfig');
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="loading"></span> Connecting...';
        button.disabled = true;
        
        // Test the API endpoint
        testApiEndpoint(apiEndpoint)
            .then(() => {
                // API is working, launch the app
                window.open(apiEndpoint, '_blank');
                showAlert('Application launched successfully!', 'success');
            })
            .catch((error) => {
                console.error('API test failed:', error);
                showAlert('Unable to connect to the API. Please check your endpoint and try again.', 'danger');
            })
            .finally(() => {
                // Restore button
                button.innerHTML = originalText;
                button.disabled = false;
            });
    }
    
    function testApiEndpoint(endpoint) {
        return fetch(`${endpoint}/api/transactions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        });
    }
    
    function showDemo() {
        // Scroll to demo section
        document.getElementById('demo').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Add some interactive demo effects
        setTimeout(() => {
            animateDemoTransactions();
        }, 500);
    }
    
    function animateDemoTransactions() {
        const transactions = document.querySelectorAll('.transaction-item');
        
        transactions.forEach((transaction, index) => {
            setTimeout(() => {
                transaction.style.opacity = '0';
                transaction.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    transaction.style.transition = 'all 0.5s ease';
                    transaction.style.opacity = '1';
                    transaction.style.transform = 'translateX(0)';
                }, 100);
            }, index * 200);
        });
    }
    
    function scrollToFeatures() {
        document.getElementById('features').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    function setupSmoothScrolling() {
        // Add smooth scrolling to all navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    function setupScrollEffects() {
        // Navbar background on scroll
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(0, 123, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = '';
                navbar.style.backdropFilter = '';
            }
        });
        
        // Animate elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.feature-card, .stat-item, .demo-container').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
    
    function updateApiEndpointDisplay() {
        // Update any display of the current API endpoint
        const endpointDisplays = document.querySelectorAll('.api-endpoint-display');
        endpointDisplays.forEach(display => {
            display.textContent = apiEndpoint;
        });
    }
    
    function showAlert(message, type) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create new alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
    
    // Add some interactive features
    addInteractiveFeatures();
    
    function addInteractiveFeatures() {
        // Add hover effects to floating cards
        const floatingCards = document.querySelectorAll('.floating-cards .card');
        floatingCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) scale(1.05)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Add click effects to buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                // Add ripple effect
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add CSS for ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to launch app
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            showConfigModal();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            const modal = bootstrap.Modal.getInstance(document.getElementById('configModal'));
            if (modal) {
                modal.hide();
            }
        }
    });
    
    // Add some fun Easter eggs
    addEasterEggs();
    
    function addEasterEggs() {
        // Konami code for fun
        let konamiCode = [];
        const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
        
        document.addEventListener('keydown', function(e) {
            konamiCode.push(e.keyCode);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.join(',') === konamiSequence.join(',')) {
                // Konami code activated!
                showAlert('🎉 Konami Code Activated! You found the secret! 🎉', 'success');
                document.body.style.animation = 'rainbow 2s infinite';
                
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 5000);
                
                // Add rainbow animation CSS
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes rainbow {
                        0% { filter: hue-rotate(0deg); }
                        100% { filter: hue-rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }
    
    // Performance optimization
    window.addEventListener('load', function() {
        // Preload the API endpoint
        if (apiEndpoint) {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = apiEndpoint;
            document.head.appendChild(link);
        }
    });
    
    console.log('🚀 AI Finance Analyzer Static Site Loaded Successfully!');
    console.log('💡 Tip: Press Ctrl/Cmd + Enter to quickly launch the app');
    console.log('🎮 Easter Egg: Try the Konami code!');
});
