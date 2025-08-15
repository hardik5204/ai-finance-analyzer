// Analytics JavaScript for AI Finance Analyzer

let trendChart, pieChart;
let analyticsData = {};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize analytics
    initializeAnalytics();
    
    // Load analytics data
    loadAnalyticsData();
    
    // Set up auto-refresh
    setInterval(loadAnalyticsData, 60000); // Refresh every minute
});

// Initialize analytics components
function initializeAnalytics() {
    // Initialize charts
    initializeAnalyticsCharts();
    
    // Set up event listeners
    setupAnalyticsEventListeners();
}

// Initialize analytics charts
function initializeAnalyticsCharts() {
    // Trend chart
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Daily Spending',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Moving Average',
                    data: [],
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(118, 75, 162, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Amount ($)'
                        },
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
    
    // Pie chart
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx) {
        pieChart = new Chart(pieCtx, {
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
                    borderWidth: 3,
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
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return context.label + ': $' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Set up analytics event listeners
function setupAnalyticsEventListeners() {
    // Export button
    const exportBtn = document.querySelector('[onclick="exportData()"]');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    
    // Refresh button
    const refreshBtn = document.querySelector('[onclick="refreshAnalytics()"]');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshAnalytics);
    }
}

// Load analytics data
async function loadAnalyticsData() {
    try {
        // Load analytics
        const analyticsResponse = await fetch('/api/analytics');
        analyticsData = await analyticsResponse.json();
        
        if (analyticsData.error) {
            console.error('Error loading analytics:', analyticsData.error);
            return;
        }
        
        // Update charts
        updateAnalyticsCharts();
        
        // Load detailed analytics
        await loadDetailedAnalytics();
        
        // Load AI insights
        await loadAnalyticsInsights();
        
        // Load anomalies
        await loadAnomalies();
        
        // Load predictions
        await loadPredictions();
        
        // Load budget optimization
        await loadBudgetOptimization();
        
        // Update key metrics
        updateKeyMetrics();
        
    } catch (error) {
        console.error('Error loading analytics data:', error);
        showNotification('Error loading analytics data. Please try again.', 'error');
    }
}

// Update analytics charts
function updateAnalyticsCharts() {
    // Update trend chart
    if (trendChart && analyticsData.monthly_spending) {
        const months = Object.keys(analyticsData.monthly_spending);
        const spending = Object.values(analyticsData.monthly_spending);
        
        // Calculate moving average
        const movingAverage = calculateMovingAverage(spending, 3);
        
        trendChart.data.labels = months.map(month => {
            const date = new Date(month);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });
        trendChart.data.datasets[0].data = spending;
        trendChart.data.datasets[1].data = movingAverage;
        trendChart.update();
    }
    
    // Update pie chart
    if (pieChart && analyticsData.category_breakdown) {
        const categories = Object.keys(analyticsData.category_breakdown);
        const amounts = Object.values(analyticsData.category_breakdown);
        
        pieChart.data.labels = categories;
        pieChart.data.datasets[0].data = amounts;
        pieChart.update();
    }
}

// Calculate moving average
function calculateMovingAverage(data, window) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - window + 1);
        const end = i + 1;
        const subset = data.slice(start, end);
        const average = subset.reduce((a, b) => a + b, 0) / subset.length;
        result.push(average);
    }
    return result;
}

// Load detailed analytics
async function loadDetailedAnalytics() {
    try {
        const response = await fetch('/api/transactions');
        const transactions = await response.json();
        
        if (transactions.length === 0) {
            updateAnalyticsTable([]);
            return;
        }
        
        // Process transactions for detailed analytics
        const analytics = processTransactionsForAnalytics(transactions);
        updateAnalyticsTable(analytics);
        
    } catch (error) {
        console.error('Error loading detailed analytics:', error);
    }
}

// Process transactions for analytics
function processTransactionsForAnalytics(transactions) {
    const categoryStats = {};
    
    transactions.forEach(transaction => {
        const category = transaction.category;
        const amount = parseFloat(transaction.amount);
        
        if (!categoryStats[category]) {
            categoryStats[category] = {
                total: 0,
                count: 0,
                average: 0,
                trend: 'stable'
            };
        }
        
        categoryStats[category].total += amount;
        categoryStats[category].count += 1;
    });
    
    // Calculate averages and trends
    Object.keys(categoryStats).forEach(category => {
        categoryStats[category].average = categoryStats[category].total / categoryStats[category].count;
        
        // Simple trend calculation (could be enhanced with time-based analysis)
        if (categoryStats[category].average > 100) {
            categoryStats[category].trend = 'up';
        } else if (categoryStats[category].average < 50) {
            categoryStats[category].trend = 'down';
        } else {
            categoryStats[category].trend = 'stable';
        }
    });
    
    return categoryStats;
}

// Update analytics table
function updateAnalyticsTable(analytics) {
    const tbody = document.getElementById('analyticsTableBody');
    if (!tbody) return;
    
    if (Object.keys(analytics).length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No data available</td></tr>';
        return;
    }
    
    const totalSpent = Object.values(analytics).reduce((sum, stat) => sum + stat.total, 0);
    
    tbody.innerHTML = Object.entries(analytics).map(([category, stats]) => {
        const percentage = ((stats.total / totalSpent) * 100).toFixed(1);
        const trendIcon = getTrendIcon(stats.trend);
        const trendClass = getTrendClass(stats.trend);
        
        return `
            <tr>
                <td><strong>${category}</strong></td>
                <td>$${stats.total.toLocaleString()}</td>
                <td>${percentage}%</td>
                <td>$${stats.average.toFixed(2)}</td>
                <td><span class="${trendClass}">${trendIcon} ${stats.trend}</span></td>
            </tr>
        `;
    }).join('');
}

// Get trend icon
function getTrendIcon(trend) {
    switch (trend) {
        case 'up': return '<i class="fas fa-arrow-up"></i>';
        case 'down': return '<i class="fas fa-arrow-down"></i>';
        default: return '<i class="fas fa-minus"></i>';
    }
}

// Get trend class
function getTrendClass(trend) {
    switch (trend) {
        case 'up': return 'trend-up';
        case 'down': return 'trend-down';
        default: return 'trend-stable';
    }
}

// Load analytics insights
async function loadAnalyticsInsights() {
    // Load spending patterns
    await loadSpendingPatterns();
    
    // Load seasonal trends
    await loadSeasonalTrends();
}

// Load spending patterns
async function loadSpendingPatterns() {
    try {
        const response = await fetch('/api/transactions');
        const transactions = await response.json();
        
        const patternsContent = document.getElementById('spendingPatterns');
        if (!patternsContent) return;
        
        if (transactions.length === 0) {
            patternsContent.innerHTML = '<p class="text-muted">No data available for pattern analysis.</p>';
            return;
        }
        
        const patterns = analyzeSpendingPatterns(transactions);
        
        patternsContent.innerHTML = `
            <div class="pattern-item">
                <h6>Peak Spending Day</h6>
                <p>${patterns.peakDay}</p>
            </div>
            <div class="pattern-item">
                <h6>Average Transaction Size</h6>
                <p>$${patterns.avgTransaction.toFixed(2)}</p>
            </div>
            <div class="pattern-item">
                <h6>Most Active Category</h6>
                <p>${patterns.mostActiveCategory}</p>
            </div>
            <div class="pattern-item">
                <h6>Spending Frequency</h6>
                <p>${patterns.frequency} transactions per week</p>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading spending patterns:', error);
    }
}

// Analyze spending patterns
function analyzeSpendingPatterns(transactions) {
    const dayCounts = {};
    const categoryCounts = {};
    let totalAmount = 0;
    
    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const category = transaction.category;
        const amount = parseFloat(transaction.amount);
        
        dayCounts[day] = (dayCounts[day] || 0) + 1;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        totalAmount += amount;
    });
    
    const peakDay = Object.entries(dayCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const mostActiveCategory = Object.entries(categoryCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const avgTransaction = totalAmount / transactions.length;
    const frequency = (transactions.length / 4).toFixed(1); // Assuming 4 weeks of data
    
    return {
        peakDay,
        mostActiveCategory,
        avgTransaction,
        frequency
    };
}

// Load seasonal trends
async function loadSeasonalTrends() {
    try {
        const response = await fetch('/api/transactions');
        const transactions = await response.json();
        
        const trendsContent = document.getElementById('seasonalTrends');
        if (!trendsContent) return;
        
        if (transactions.length === 0) {
            trendsContent.innerHTML = '<p class="text-muted">No data available for trend analysis.</p>';
            return;
        }
        
        const trends = analyzeSeasonalTrends(transactions);
        
        trendsContent.innerHTML = `
            <div class="trend-item">
                <h6>Monthly Trend</h6>
                <p>${trends.monthlyTrend}</p>
            </div>
            <div class="trend-item">
                <h6>Seasonal Pattern</h6>
                <p>${trends.seasonalPattern}</p>
            </div>
            <div class="trend-item">
                <h6>Growth Rate</h6>
                <p>${trends.growthRate}%</p>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading seasonal trends:', error);
    }
}

// Analyze seasonal trends
function analyzeSeasonalTrends(transactions) {
    const monthlyTotals = {};
    
    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const month = date.toLocaleDateString('en-US', { month: 'long' });
        const amount = parseFloat(transaction.amount);
        
        monthlyTotals[month] = (monthlyTotals[month] || 0) + amount;
    });
    
    const months = Object.keys(monthlyTotals);
    const totals = Object.values(monthlyTotals);
    
    // Simple trend analysis
    let trend = 'stable';
    if (totals.length >= 2) {
        const firstHalf = totals.slice(0, Math.floor(totals.length / 2)).reduce((a, b) => a + b, 0);
        const secondHalf = totals.slice(Math.floor(totals.length / 2)).reduce((a, b) => a + b, 0);
        
        if (secondHalf > firstHalf * 1.1) {
            trend = 'increasing';
        } else if (secondHalf < firstHalf * 0.9) {
            trend = 'decreasing';
        }
    }
    
    const growthRate = totals.length >= 2 ? 
        (((totals[totals.length - 1] - totals[0]) / totals[0]) * 100).toFixed(1) : 0;
    
    return {
        monthlyTrend: trend,
        seasonalPattern: 'Consistent spending throughout the year',
        growthRate: growthRate
    };
}

// Load anomalies
async function loadAnomalies() {
    try {
        const response = await fetch('/api/anomalies');
        const data = await response.json();
        
        const anomaliesContent = document.getElementById('anomaliesContent');
        if (!anomaliesContent) return;
        
        if (data.anomalies.length === 0) {
            anomaliesContent.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-shield-alt fa-2x mb-2"></i>
                    <p>No anomalies detected. Your spending patterns look normal.</p>
                </div>
            `;
            return;
        }
        
        anomaliesContent.innerHTML = data.anomalies.slice(0, 5).map(anomaly => `
            <div class="anomaly-item">
                <h6><i class="fas fa-exclamation-triangle me-2"></i>Unusual Transaction</h6>
                <p><strong>Merchant:</strong> ${anomaly.merchant}</p>
                <p><strong>Amount:</strong> <span class="anomaly-amount">$${parseFloat(anomaly.amount).toFixed(2)}</span></p>
                <p><strong>Date:</strong> ${formatDate(anomaly.date)}</p>
                <small class="text-muted">AI detected this as unusual based on your spending patterns.</small>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading anomalies:', error);
    }
}

// Load predictions
async function loadPredictions() {
    try {
        const response = await fetch('/api/predict');
        const data = await response.json();
        
        const predictionContent = document.getElementById('predictionContent');
        if (!predictionContent) return;
        
        if (data.error) {
            predictionContent.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-info-circle fa-2x mb-2"></i>
                    <p>${data.error}</p>
                </div>
            `;
            return;
        }
        
        predictionContent.innerHTML = `
            <div class="prediction-card">
                <h6><i class="fas fa-crystal-ball me-2"></i>Next Month Forecast</h6>
                <p>Based on LSTM neural network analysis:</p>
                <div class="prediction-amount">$${data.predicted_next_month.toLocaleString()}</div>
                <span class="badge bg-info">${(data.confidence * 100).toFixed(0)}% Confidence</span>
            </div>
            <div class="mt-3">
                <small class="text-muted">
                    <i class="fas fa-info-circle me-1"></i>
                    Predictions are based on historical spending patterns and seasonal trends.
                </small>
            </div>
        `;
        
    } catch (error) {
        console.error('Error loading predictions:', error);
    }
}

// Load budget optimization
async function loadBudgetOptimization() {
    try {
        const response = await fetch('/api/budget-recommendations');
        const data = await response.json();
        
        const budgetOptimization = document.getElementById('budgetOptimization');
        if (!budgetOptimization) return;
        
        if (data.recommendations.length === 0) {
            budgetOptimization.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-thumbs-up fa-2x mb-2"></i>
                    <p>Your budget allocation looks optimal!</p>
                </div>
            `;
            return;
        }
        
        budgetOptimization.innerHTML = data.recommendations.map(rec => `
            <div class="budget-item">
                <h6><i class="fas fa-target me-2"></i>${rec.category}</h6>
                <p>${rec.recommendation}</p>
                <div class="optimization-savings">Potential savings: $${rec.potential_savings}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading budget optimization:', error);
    }
}

// Update key metrics
function updateKeyMetrics() {
    if (!analyticsData) return;
    
    // Total transactions
    const totalTransactionsElement = document.getElementById('totalTransactions');
    if (totalTransactionsElement) {
        totalTransactionsElement.textContent = analyticsData.total_transactions || 0;
    }
    
    // Average daily spending
    const avgDailySpendingElement = document.getElementById('avgDailySpending');
    if (avgDailySpendingElement) {
        const avgDaily = analyticsData.total_spent ? (analyticsData.total_spent / 30).toFixed(2) : 0;
        avgDailySpendingElement.textContent = '$' + avgDaily;
    }
    
    // Most expensive category
    const mostExpensiveCategoryElement = document.getElementById('mostExpensiveCategory');
    if (mostExpensiveCategoryElement && analyticsData.category_breakdown) {
        const categories = Object.entries(analyticsData.category_breakdown);
        if (categories.length > 0) {
            const mostExpensive = categories.reduce((a, b) => a[1] > b[1] ? a : b);
            mostExpensiveCategoryElement.textContent = mostExpensive[0];
        }
    }
    
    // Spending velocity
    const spendingVelocityElement = document.getElementById('spendingVelocity');
    if (spendingVelocityElement) {
        const velocity = analyticsData.recent_spending ? (analyticsData.recent_spending / 30).toFixed(2) : 0;
        spendingVelocityElement.textContent = '$' + velocity + '/day';
    }
}

// Export data
function exportData() {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'analytics_data.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Analytics data exported successfully!', 'success');
}

// Refresh analytics
function refreshAnalytics() {
    loadAnalyticsData();
    showNotification('Analytics refreshed!', 'success');
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
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
} 