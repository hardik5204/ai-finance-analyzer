// Dashboard JavaScript for AI Finance Analyzer

let monthlyChart, categoryChart;
let transactions = [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Load initial data
    loadDashboardData();
    
    // Set up auto-refresh
    setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    
    // Initialize mobile menu
    initializeMobileMenu();
});

// Initialize dashboard components
function initializeDashboard() {
    // Initialize charts
    initializeCharts();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set default date for new transactions
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
}

// Initialize Chart.js charts
function initializeCharts() {
    // Monthly spending trend chart
    const monthlyCtx = document.getElementById('monthlyChart');
    if (monthlyCtx) {
        monthlyChart = new Chart(monthlyCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Monthly Spending',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Category distribution pie chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#00f2fe',
                        '#43e97b',
                        '#38f9d7',
                        '#fa709a',
                        '#fee140'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

// Set up event listeners
function setupEventListeners() {
    // Add transaction form submission
    const addTransactionBtn = document.querySelector('[onclick="addTransaction()"]');
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', addTransaction);
    }
    
    // Form submission
    const form = document.getElementById('addTransactionForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addTransaction();
        });
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load analytics data
        const analyticsResponse = await fetch('/api/analytics');
        const analyticsData = await analyticsResponse.json();
        
        if (analyticsData.error) {
            console.error('Error loading analytics:', analyticsData.error);
            return;
        }
        
        // Update overview cards
        updateOverviewCards(analyticsData);
        
        // Update charts
        updateCharts(analyticsData);
        
        // Load transactions
        await loadTransactions();
        
        // Load AI insights
        await loadAIInsights();
        
        // Load category performance
        await loadCategoryPerformance();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading data. Please try again.', 'error');
    }
}

// Update overview cards
function updateOverviewCards(data) {
    // Total spent
    const totalSpentElement = document.getElementById('totalSpent');
    if (totalSpentElement) {
        totalSpentElement.textContent = '$' + data.total_spent.toLocaleString();
    }
    
    // Average transaction
    const avgTransactionElement = document.getElementById('avgTransaction');
    if (avgTransactionElement) {
        avgTransactionElement.textContent = '$' + data.avg_transaction.toFixed(2);
    }
    
    // Load health score
    loadHealthScore();
    
    // Load anomaly count
    loadAnomalyCount();
}

// Update charts with new data
function updateCharts(data) {
    // Update monthly chart
    if (monthlyChart && data.monthly_spending) {
        const months = Object.keys(data.monthly_spending);
        const spending = Object.values(data.monthly_spending);
        
        monthlyChart.data.labels = months.map(month => {
            const date = new Date(month);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });
        monthlyChart.data.datasets[0].data = spending;
        monthlyChart.update();
    }
    
    // Update category chart
    if (categoryChart && data.category_breakdown) {
        const categories = Object.keys(data.category_breakdown);
        const amounts = Object.values(data.category_breakdown);
        
        categoryChart.data.labels = categories;
        categoryChart.data.datasets[0].data = amounts;
        categoryChart.update();
    }
}

// Load transactions
async function loadTransactions() {
    try {
        const response = await fetch('/api/transactions');
        transactions = await response.json();
        
        updateTransactionsTable(transactions);
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Update transactions table
function updateTransactionsTable(transactions) {
    const tbody = document.getElementById('transactionsTableBody');
    if (!tbody) return;
    
    if (transactions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No transactions found</td></tr>';
        return;
    }
    
    tbody.innerHTML = transactions.slice(0, 10).map(transaction => `
        <tr>
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.merchant}</td>
            <td>
                <span class="badge bg-primary">${transaction.category}</span>
            </td>
            <td class="fw-bold">$${parseFloat(transaction.amount).toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary action-btn" onclick="editTransaction(${transaction.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger action-btn" onclick="deleteTransaction(${transaction.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load AI insights
async function loadAIInsights() {
    // Load predictions
    await loadPredictions();
    
    // Load recommendations
    await loadRecommendations();
}

// Load predictions
async function loadPredictions() {
    try {
        const response = await fetch('/api/predict');
        const data = await response.json();
        
        const predictionsContent = document.getElementById('predictionsContent');
        if (!predictionsContent) return;
        
        if (data.error) {
            predictionsContent.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-info-circle fa-2x mb-2"></i>
                    <p>${data.error}</p>
                </div>
            `;
            return;
        }
        
        predictionsContent.innerHTML = `
            <div class="prediction-item">
                <h6><i class="fas fa-chart-line me-2"></i>Next Month Prediction</h6>
                <p>Based on your spending patterns, you're expected to spend:</p>
                <div class="prediction-amount">$${data.predicted_next_month.toLocaleString()}</div>
                <span class="badge bg-success">${(data.confidence * 100).toFixed(0)}% Confidence</span>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading predictions:', error);
    }
}

// Load recommendations
async function loadRecommendations() {
    try {
        const response = await fetch('/api/budget-recommendations');
        const data = await response.json();
        
        const recommendationsContent = document.getElementById('recommendationsContent');
        if (!recommendationsContent) return;
        
        if (data.recommendations.length === 0) {
            recommendationsContent.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-thumbs-up fa-2x mb-2"></i>
                    <p>Great job! Your spending looks well-balanced.</p>
                </div>
            `;
            return;
        }
        
        recommendationsContent.innerHTML = data.recommendations.map(rec => `
            <div class="recommendation-item">
                <h6><i class="fas fa-lightbulb me-2"></i>${rec.category}</h6>
                <p>${rec.recommendation}</p>
                <div class="savings-amount">Potential savings: $${rec.potential_savings}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading recommendations:', error);
    }
}

// Load health score
async function loadHealthScore() {
    try {
        const response = await fetch('/api/health-score');
        const data = await response.json();
        
        const healthScoreElement = document.getElementById('healthScore');
        if (healthScoreElement) {
            healthScoreElement.textContent = data.score;
            
            // Add color coding
            if (data.score >= 80) {
                healthScoreElement.className = 'h5 mb-0 font-weight-bold text-success';
            } else if (data.score >= 60) {
                healthScoreElement.className = 'h5 mb-0 font-weight-bold text-warning';
            } else {
                healthScoreElement.className = 'h5 mb-0 font-weight-bold text-danger';
            }
        }
    } catch (error) {
        console.error('Error loading health score:', error);
    }
}

// Load anomaly count
async function loadAnomalyCount() {
    try {
        const response = await fetch('/api/anomalies');
        const data = await response.json();
        
        const anomalyCountElement = document.getElementById('anomalyCount');
        if (anomalyCountElement) {
            anomalyCountElement.textContent = data.anomalies.length;
        }
    } catch (error) {
        console.error('Error loading anomalies:', error);
    }
}

// Add new transaction
async function addTransaction() {
    const amount = document.getElementById('amount').value;
    const merchant = document.getElementById('merchant').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    
    if (!amount || !merchant || !date) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: parseFloat(amount),
                merchant: merchant,
                date: date,
                description: description
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification(`Transaction added successfully! AI categorized it as: ${result.predicted_category}`, 'success');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addTransactionModal'));
            if (modal) {
                modal.hide();
            }
            
            // Reset form
            document.getElementById('addTransactionForm').reset();
            document.getElementById('date').value = new Date().toISOString().split('T')[0];
            
            // Reload data
            loadDashboardData();
            
        } else {
            showNotification('Error adding transaction. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Error adding transaction:', error);
        showNotification('Error adding transaction. Please try again.', 'error');
    }
}

// Edit transaction
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    // Populate modal with transaction data
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('merchant').value = transaction.merchant;
    document.getElementById('date').value = transaction.date.split(' ')[0];
    document.getElementById('description').value = transaction.description || '';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('addTransactionModal'));
    modal.show();
}

// Delete transaction
async function deleteTransaction(id) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/transactions/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Transaction deleted successfully!', 'success');
            loadDashboardData();
        } else {
            showNotification('Error deleting transaction.', 'error');
        }
    } catch (error) {
        console.error('Error deleting transaction:', error);
        showNotification('Error deleting transaction.', 'error');
    }
}

// Refresh transactions
function refreshTransactions() {
    loadTransactions();
    showNotification('Transactions refreshed!', 'success');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
    `;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Load category performance
async function loadCategoryPerformance() {
    try {
        const response = await fetch('/api/category-performance');
        const data = await response.json();
        
        const categoryPerformanceContent = document.getElementById('categoryPerformanceContent');
        if (!categoryPerformanceContent) return;
        
        if (data.categories.length === 0) {
            categoryPerformanceContent.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-info-circle fa-2x mb-2"></i>
                    <p>No category data available for performance analysis.</p>
                </div>
            `;
            return;
        }
        
        categoryPerformanceContent.innerHTML = `
            <div class="row">
                ${data.categories.map(category => `
                    <div class="col-lg-4 col-md-6 mb-3">
                        <div class="performance-card ${getPerformanceCardClass(category.rating)}">
                            <div class="performance-header">
                                <h6>${category.category}</h6>
                                <span class="performance-badge badge-${getPerformanceBadgeClass(category.rating)}">
                                    ${category.rating}
                                </span>
                            </div>
                            <div class="performance-metrics">
                                <div class="metric">
                                    <span class="metric-label">Total Spent:</span>
                                    <span class="metric-value">$${category.total_spent.toLocaleString()}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Avg Amount:</span>
                                    <span class="metric-value">$${category.avg_amount.toFixed(2)}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Frequency:</span>
                                    <span class="metric-value">${category.frequency.toFixed(1)}/week</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Trend:</span>
                                    <span class="metric-value trend-${category.trend}">
                                        <i class="fas fa-arrow-${category.trend === 'up' ? 'up' : category.trend === 'down' ? 'down' : 'right'}"></i>
                                        ${category.trend}
                                    </span>
                                </div>
                            </div>
                            <div class="performance-score">
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${category.performance_score}%"></div>
                                </div>
                                <span class="score-text">${category.performance_score}/100</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading category performance:', error);
        const categoryPerformanceContent = document.getElementById('categoryPerformanceContent');
        if (categoryPerformanceContent) {
            categoryPerformanceContent.innerHTML = `
                <div class="text-center text-danger">
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <p>Error loading category performance data.</p>
                </div>
            `;
        }
    }
}

// Get performance card CSS class
function getPerformanceCardClass(rating) {
    const classes = {
        'Excellent': 'performance-excellent',
        'Good': 'performance-good',
        'Average': 'performance-average',
        'Poor': 'performance-poor',
        'Inactive': 'performance-inactive'
    };
    return classes[rating] || 'performance-average';
}

// Get performance badge CSS class
function getPerformanceBadgeClass(rating) {
    const classes = {
        'Excellent': 'success',
        'Good': 'primary',
        'Average': 'warning',
        'Poor': 'danger',
        'Inactive': 'secondary'
    };
    return classes[rating] || 'warning';
}

// Export data function
function exportData() {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'finance_data.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully!', 'success');
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                navbarCollapse.classList.remove('show');
            }
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbarCollapse.classList.remove('show');
            });
        });
    }
} 