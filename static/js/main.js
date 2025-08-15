// Main JavaScript for AI Finance Analyzer Landing Page

document.addEventListener('DOMContentLoaded', function() {
    // Initialize demo form
    initializeDemoForm();
    
    // Add smooth scrolling for navigation links
    addSmoothScrolling();
    
    // Add animations on scroll
    addScrollAnimations();
    
    // Initialize floating cards animation
    initializeFloatingCards();
});

// Demo form functionality
function initializeDemoForm() {
    const demoForm = document.getElementById('demoForm');
    const demoResult = document.getElementById('demoResult');
    const demoResultText = document.getElementById('demoResultText');
    
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const amount = document.getElementById('demoAmount').value;
            const merchant = document.getElementById('demoMerchant').value;
            const date = document.getElementById('demoDate').value;
            
            if (!amount || !merchant || !date) {
                showDemoResult('Please fill in all fields.', 'danger');
                return;
            }
            
            // Simulate AI analysis
            simulateAIAnalysis(amount, merchant, date);
        });
    }
}

// Simulate AI analysis for demo
function simulateAIAnalysis(amount, merchant, date) {
    const demoResult = document.getElementById('demoResult');
    const demoResultText = document.getElementById('demoResultText');
    
    // Show loading state
    demoResult.style.display = 'block';
    demoResult.innerHTML = `
        <div class="alert alert-info">
            <div class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                <span>AI is analyzing your transaction...</span>
            </div>
        </div>
    `;
    
    // Simulate processing time
    setTimeout(() => {
        const category = predictCategory(merchant, amount);
        const insights = generateInsights(amount, merchant, category);
        
        demoResult.innerHTML = `
            <div class="alert alert-success">
                <h5><i class="fas fa-check-circle me-2"></i>AI Analysis Complete</h5>
                <div class="row mt-3">
                    <div class="col-md-6">
                        <strong>Predicted Category:</strong> ${category}
                    </div>
                    <div class="col-md-6">
                        <strong>Confidence:</strong> 95%
                    </div>
                </div>
                <div class="mt-2">
                    <strong>AI Insights:</strong> ${insights}
                </div>
            </div>
        `;
        
        demoResult.classList.add('fade-in');
    }, 2000);
}

// Simple category prediction logic
function predictCategory(merchant, amount) {
    const merchantLower = merchant.toLowerCase();
    const amountNum = parseFloat(amount);
    
    if (merchantLower.includes('mcdonald') || merchantLower.includes('starbucks') || 
        merchantLower.includes('chipotle') || merchantLower.includes('pizza')) {
        return 'Food & Dining';
    } else if (merchantLower.includes('uber') || merchantLower.includes('lyft') || 
               merchantLower.includes('shell') || merchantLower.includes('exxon')) {
        return 'Transportation';
    } else if (merchantLower.includes('amazon') || merchantLower.includes('walmart') || 
               merchantLower.includes('target') || merchantLower.includes('best buy')) {
        return 'Shopping';
    } else if (merchantLower.includes('netflix') || merchantLower.includes('spotify') || 
               merchantLower.includes('movie') || merchantLower.includes('concert')) {
        return 'Entertainment';
    } else if (merchantLower.includes('cvs') || merchantLower.includes('walgreens') || 
               merchantLower.includes('doctor') || merchantLower.includes('hospital')) {
        return 'Healthcare';
    } else if (merchantLower.includes('electric') || merchantLower.includes('water') || 
               merchantLower.includes('internet') || merchantLower.includes('phone')) {
        return 'Utilities';
    } else if (merchantLower.includes('university') || merchantLower.includes('course') || 
               merchantLower.includes('bookstore') || merchantLower.includes('library')) {
        return 'Education';
    } else if (merchantLower.includes('airline') || merchantLower.includes('hotel') || 
               merchantLower.includes('travel') || merchantLower.includes('car rental')) {
        return 'Travel';
    } else if (merchantLower.includes('insurance')) {
        return 'Insurance';
    } else {
        return 'Other';
    }
}

// Generate insights based on transaction
function generateInsights(amount, merchant, category) {
    const amountNum = parseFloat(amount);
    let insights = [];
    
    if (amountNum > 100) {
        insights.push('This is a high-value transaction. Consider if this expense aligns with your budget goals.');
    }
    
    if (category === 'Food & Dining' && amountNum > 50) {
        insights.push('This is above average for dining expenses. Consider cooking at home to save money.');
    }
    
    if (category === 'Shopping' && amountNum > 200) {
        insights.push('Large shopping transaction detected. Review if this purchase was planned.');
    }
    
    if (category === 'Entertainment' && amountNum > 100) {
        insights.push('Significant entertainment expense. Balance with other financial priorities.');
    }
    
    if (insights.length === 0) {
        insights.push('This transaction appears to be within normal spending patterns.');
    }
    
    return insights.join(' ');
}

// Show demo result with different alert types
function showDemoResult(message, type = 'success') {
    const demoResult = document.getElementById('demoResult');
    const alertClass = type === 'danger' ? 'alert-danger' : 'alert-success';
    
    demoResult.innerHTML = `
        <div class="alert ${alertClass}">
            <h5><i class="fas fa-${type === 'danger' ? 'exclamation-triangle' : 'check-circle'} me-2"></i>${type === 'danger' ? 'Error' : 'Success'}</h5>
            <p>${message}</p>
        </div>
    `;
    demoResult.style.display = 'block';
    demoResult.classList.add('fade-in');
}

// Add smooth scrolling for navigation links
function addSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all feature cards and AI cards
    const animatedElements = document.querySelectorAll('.feature-card, .ai-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialize floating cards animation
function initializeFloatingCards() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add staggered animation delay
        card.style.animationDelay = `${index * 2}s`;
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add parallax effect to hero section
function addParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Add counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Add form validation
function addFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTooltips();
    addFormValidation();
    initializeNewsletterForm();
    initializeDemoTabs();
    initializeDemoForm();
    initializeHeroStats();
    
    // Add parallax effect on larger screens
    if (window.innerWidth > 768) {
        addParallaxEffect();
    }
    
    // Animate counters when they come into view
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    const counterSection = document.querySelector('.counter-section');
    if (counterSection) {
        counterObserver.observe(counterSection);
    }
    
    // Animate hero stats
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateHeroStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        });
        statsObserver.observe(heroStats);
    }
});

// Initialize hero stats animation
function initializeHeroStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        stat.textContent = '0';
    });
}

// Animate hero stats
function animateHeroStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current);
        }, 16);
    });
}

// Initialize newsletter form
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                // Simulate newsletter subscription
                showNewsletterSuccess(email);
                emailInput.value = '';
            }
        });
    }
}

// Initialize demo tabs
function initializeDemoTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });
}

// Initialize demo form
function initializeDemoForm() {
    const demoForm = document.getElementById('demoForm');
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const analyzeBtn = this.querySelector('.analyze-btn');
            const loader = analyzeBtn.querySelector('.btn-loader');
            const btnText = analyzeBtn.querySelector('i').parentElement;
            
            // Show loading state
            btnText.style.display = 'none';
            loader.style.display = 'block';
            
            // Simulate AI analysis
            setTimeout(() => {
                showDemoResults();
                btnText.style.display = 'inline';
                loader.style.display = 'none';
            }, 2000);
        });
    }
}

// Show demo results
function showDemoResults() {
    const results = document.getElementById('demoResults');
    const amount = document.getElementById('demoAmount').value;
    const category = document.getElementById('demoCategory').value;
    const description = document.getElementById('demoDescription').value;
    
    // Populate results
    document.getElementById('resultCategory').textContent = category.charAt(0).toUpperCase() + category.slice(1);
    document.getElementById('resultTrend').textContent = amount > 100 ? 'High Spending' : 'Normal Spending';
    document.getElementById('resultRecommendation').textContent = getRecommendation(amount, category);
    document.getElementById('resultRisk').textContent = amount > 200 ? 'Medium Risk' : 'Low Risk';
    
    // Show results with animation
    results.style.display = 'block';
    results.style.opacity = '0';
    results.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        results.style.transition = 'all 0.5s ease';
        results.style.opacity = '1';
        results.style.transform = 'translateY(0)';
    }, 100);
}

// Get AI recommendation
function getRecommendation(amount, category) {
    const recommendations = {
        food: amount > 50 ? 'Consider meal prep to reduce dining costs' : 'Good spending control',
        transport: amount > 100 ? 'Look into carpooling or public transport' : 'Efficient transportation',
        entertainment: amount > 80 ? 'Set entertainment budget limits' : 'Balanced entertainment spending',
        shopping: amount > 150 ? 'Review if purchase is necessary' : 'Reasonable shopping',
        utilities: amount > 200 ? 'Check for energy-saving opportunities' : 'Normal utility costs',
        health: amount > 100 ? 'Consider health insurance options' : 'Good health investment',
        education: amount > 300 ? 'Look for educational discounts' : 'Worthwhile investment'
    };
    
    return recommendations[category] || 'Monitor your spending patterns';
}

// Run prediction demo
function runPrediction() {
    const income = document.getElementById('predIncome').value;
    const savings = document.getElementById('predSavings').value;
    const age = document.getElementById('predAge').value;
    
    if (!income || !savings || !age) {
        alert('Please fill in all fields');
        return;
    }
    
    const results = document.getElementById('predictionResults');
    const monthlySpending = income * 0.6;
    const futureSavings = savings * 1.05;
    
    results.innerHTML = `
        <div class="prediction-results-content">
            <h3>AI Spending Predictions</h3>
            <div class="row">
                <div class="col-md-4">
                    <div class="prediction-card">
                        <h4>Monthly Spending</h4>
                        <p class="prediction-value">$${monthlySpending.toFixed(0)}</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="prediction-card">
                        <h4>Future Savings</h4>
                        <p class="prediction-value">$${futureSavings.toFixed(0)}</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="prediction-card">
                        <h4>Financial Health</h4>
                        <p class="prediction-value">${getFinancialHealth(income, savings, age)}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    results.style.display = 'block';
}

// Get financial health score
function getFinancialHealth(income, savings, age) {
    const ratio = savings / income;
    if (ratio > 2) return 'Excellent';
    if (ratio > 1) return 'Good';
    if (ratio > 0.5) return 'Fair';
    return 'Needs Improvement';
}

// Simulate anomaly detection
function simulateAnomaly() {
    const anomalyExamples = document.querySelector('.anomaly-examples');
    
    const newAnomaly = document.createElement('div');
    newAnomaly.className = 'anomaly-item';
    newAnomaly.innerHTML = `
        <div class="anomaly-icon">
            <i class="fas fa-exclamation-triangle text-danger"></i>
        </div>
        <div class="anomaly-content">
            <h4>New Anomaly Detected</h4>
            <p>Unusual spending pattern detected in your recent transactions</p>
            <span class="anomaly-score">Risk Score: ${Math.floor(Math.random() * 30) + 70}%</span>
        </div>
    `;
    
    anomalyExamples.appendChild(newAnomaly);
    
    // Animate the new anomaly
    newAnomaly.style.opacity = '0';
    newAnomaly.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        newAnomaly.style.transition = 'all 0.5s ease';
        newAnomaly.style.opacity = '1';
        newAnomaly.style.transform = 'translateX(0)';
    }, 100);
}

// Show newsletter success message
function showNewsletterSuccess(email) {
    const newsletterSection = document.querySelector('.newsletter-section');
    if (newsletterSection) {
        const originalContent = newsletterSection.innerHTML;
        
        newsletterSection.innerHTML = `
            <div class="text-center">
                <i class="fas fa-check-circle text-success" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h6 class="text-success">Successfully Subscribed!</h6>
                <p>Thank you for subscribing to our newsletter. We'll keep you updated with the latest AI finance features and tips.</p>
            </div>
        `;
        
        setTimeout(() => {
            newsletterSection.innerHTML = originalContent;
            initializeNewsletterForm(); // Re-initialize the form
        }, 3000);
    }
}

// Add responsive navigation toggle
function toggleMobileMenu() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    navbarCollapse.classList.toggle('show');
}

// Add scroll to top functionality
function addScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
        } else {
            scrollToTopBtn.style.opacity = '0';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', addScrollToTop); 