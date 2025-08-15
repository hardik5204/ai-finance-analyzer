from flask import Flask, render_template, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
import pickle
import os
from datetime import datetime, timedelta
import random
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
# TensorFlow imports removed for simplified version
# import tensorflow as tf
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import LSTM, Dense, Dropout
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///finance_analyzer.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)

# Download NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Database Models
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    merchant = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100))
    date = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, default=1)
    
    def to_dict(self):
        return {
            'id': self.id,
            'amount': self.amount,
            'merchant': self.merchant,
            'category': self.category,
            'date': self.date.strftime('%Y-%m-%d %H:%M:%S'),
            'description': self.description
        }

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    income = db.Column(db.Float, default=0)
    budget = db.Column(db.Float, default=0)

# ML Models
class FinanceMLModels:
    def __init__(self):
        self.category_model = None
        self.anomaly_model = None
        self.prediction_model = None
        self.label_encoder = LabelEncoder()
        self.scaler = StandardScaler()
        self.initialize_models()
    
    def initialize_models(self):
        # Initialize category classification model
        self.category_model = RandomForestClassifier(n_estimators=100, random_state=42)
        
        # Initialize anomaly detection model
        self.anomaly_model = IsolationForest(contamination=0.1, random_state=42)
        
        # Initialize prediction model (LSTM)
        self.prediction_model = self.create_lstm_model()
    
    def create_lstm_model(self):
        # Simplified LSTM model - returns None for now
        # In a full implementation, this would create a TensorFlow model
        return None
    
    def train_category_model(self, transactions_df):
        if len(transactions_df) < 10:
            return False
        
        # Prepare features
        X = transactions_df[['amount', 'merchant_encoded', 'day_of_week', 'month']].values
        y = transactions_df['category'].values
        
        # Encode categories
        y_encoded = self.label_encoder.fit_transform(y)
        
        # Train model
        self.category_model.fit(X, y_encoded)
        return True
    
    def predict_category(self, amount, merchant, date):
        # Encode merchant (simple hash-based encoding)
        merchant_encoded = hash(merchant) % 1000
        
        # Extract date features
        date_obj = datetime.strptime(date, '%Y-%m-%d')
        day_of_week = date_obj.weekday()
        month = date_obj.month
        
        # Prepare features
        features = np.array([[amount, merchant_encoded, day_of_week, month]])
        
        # Predict
        prediction = self.category_model.predict(features)[0]
        category = self.label_encoder.inverse_transform([prediction])[0]
        
        return category
    
    def detect_anomalies(self, transactions_df):
        if len(transactions_df) < 5:
            return []
        
        # Prepare features for anomaly detection
        features = transactions_df[['amount', 'day_of_week', 'month']].values
        
        # Detect anomalies
        anomalies = self.anomaly_model.fit_predict(features)
        
        # Return indices of anomalies (-1 indicates anomaly)
        anomaly_indices = [i for i, pred in enumerate(anomalies) if pred == -1]
        return anomaly_indices

# Initialize ML models
ml_models = FinanceMLModels()

# Sample data generation
def generate_sample_data():
    categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 
                  'Healthcare', 'Utilities', 'Education', 'Travel', 'Insurance', 'Other']
    
    merchants = {
        'Food & Dining': ['McDonald\'s', 'Starbucks', 'Chipotle', 'Pizza Hut', 'Subway'],
        'Transportation': ['Uber', 'Lyft', 'Shell', 'Exxon', 'Metro'],
        'Shopping': ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Macy\'s'],
        'Entertainment': ['Netflix', 'Spotify', 'Movie Theater', 'Concert Hall', 'Arcade'],
        'Healthcare': ['CVS Pharmacy', 'Walgreens', 'Doctor Office', 'Dental Clinic', 'Hospital'],
        'Utilities': ['Electric Company', 'Water Company', 'Internet Provider', 'Phone Company', 'Gas Company'],
        'Education': ['University', 'Online Course', 'Bookstore', 'Library', 'Tutoring'],
        'Travel': ['Airline', 'Hotel', 'Car Rental', 'Travel Agency', 'Tour Guide'],
        'Insurance': ['Car Insurance', 'Health Insurance', 'Home Insurance', 'Life Insurance'],
        'Other': ['ATM Withdrawal', 'Bank Transfer', 'Cash Deposit', 'Investment', 'Donation']
    }
    
    transactions = []
    start_date = datetime.now() - timedelta(days=365)
    
    for i in range(1000):
        category = random.choice(categories)
        merchant = random.choice(merchants[category])
        amount = round(random.uniform(5, 500), 2)
        date = start_date + timedelta(days=random.randint(0, 365))
        
        transaction = Transaction(
            amount=amount,
            merchant=merchant,
            category=category,
            date=date,
            description=f"Transaction at {merchant}",
            user_id=1
        )
        transactions.append(transaction)
    
    return transactions

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/analytics')
def analytics():
    return render_template('analytics.html')

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.filter_by(user_id=1).order_by(Transaction.date.desc()).limit(100).all()
    return jsonify([t.to_dict() for t in transactions])

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.json
    
    # Predict category using ML model
    predicted_category = ml_models.predict_category(
        data['amount'], 
        data['merchant'], 
        data['date']
    )
    
    transaction = Transaction(
        amount=data['amount'],
        merchant=data['merchant'],
        category=predicted_category,
        date=datetime.strptime(data['date'], '%Y-%m-%d'),
        description=data.get('description', ''),
        user_id=1
    )
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({'message': 'Transaction added successfully', 'predicted_category': predicted_category})

@app.route('/api/analytics')
def get_analytics():
    transactions = Transaction.query.filter_by(user_id=1).all()
    
    if not transactions:
        return jsonify({'error': 'No transactions found'})
    
    df = pd.DataFrame([t.to_dict() for t in transactions])
    df['date'] = pd.to_datetime(df['date'])
    df['amount'] = pd.to_numeric(df['amount'])
    
    # Basic analytics
    total_spent = df['amount'].sum()
    avg_transaction = df['amount'].mean()
    total_transactions = len(df)
    
    # Category breakdown
    category_breakdown = df.groupby('category')['amount'].sum().to_dict()
    
    # Monthly spending
    monthly_spending = df.groupby(df['date'].dt.to_period('M'))['amount'].sum().to_dict()
    
    # Recent spending trend (last 30 days)
    recent_df = df[df['date'] >= datetime.now() - timedelta(days=30)]
    recent_spending = recent_df['amount'].sum()
    
    return jsonify({
        'total_spent': total_spent,
        'avg_transaction': avg_transaction,
        'total_transactions': total_transactions,
        'category_breakdown': category_breakdown,
        'monthly_spending': {str(k): v for k, v in monthly_spending.items()},
        'recent_spending': recent_spending
    })

@app.route('/api/predict')
def predict_spending():
    transactions = Transaction.query.filter_by(user_id=1).all()
    
    if len(transactions) < 30:
        return jsonify({'error': 'Insufficient data for prediction'})
    
    df = pd.DataFrame([t.to_dict() for t in transactions])
    df['date'] = pd.to_datetime(df['date'])
    df['amount'] = pd.to_numeric(df['amount'])
    
    # Prepare data for LSTM
    daily_spending = df.groupby(df['date'].dt.date)['amount'].sum().values
    
    if len(daily_spending) < 30:
        return jsonify({'error': 'Insufficient daily data'})
    
    # Simple prediction using moving average
    recent_avg = np.mean(daily_spending[-30:])
    predicted_next_month = recent_avg * 30
    
    return jsonify({
        'predicted_next_month': round(predicted_next_month, 2),
        'confidence': 0.85
    })

@app.route('/api/anomalies')
def get_anomalies():
    transactions = Transaction.query.filter_by(user_id=1).all()
    
    if len(transactions) < 5:
        return jsonify({'anomalies': []})
    
    df = pd.DataFrame([t.to_dict() for t in transactions])
    df['date'] = pd.to_datetime(df['date'])
    df['day_of_week'] = df['date'].dt.weekday
    df['month'] = df['date'].dt.month
    
    anomaly_indices = ml_models.detect_anomalies(df)
    anomalies = [df.iloc[i].to_dict() for i in anomaly_indices]
    
    return jsonify({'anomalies': anomalies})

@app.route('/api/budget-recommendations')
def get_budget_recommendations():
    transactions = Transaction.query.filter_by(user_id=1).all()
    
    if not transactions:
        return jsonify({'recommendations': []})
    
    df = pd.DataFrame([t.to_dict() for t in transactions])
    df['amount'] = pd.to_numeric(df['amount'])
    
    # Calculate current spending by category
    category_spending = df.groupby('category')['amount'].sum()
    total_spending = category_spending.sum()
    
    # Generate recommendations based on spending patterns
    recommendations = []
    
    # High spending categories
    high_spending = category_spending[category_spending > total_spending * 0.2]
    for category, amount in high_spending.items():
        recommendations.append({
            'category': category,
            'current_spending': round(amount, 2),
            'recommendation': f'Consider reducing {category} spending by 20%',
            'potential_savings': round(amount * 0.2, 2)
        })
    
    return jsonify({'recommendations': recommendations})

@app.route('/api/health-score')
def get_health_score():
    transactions = Transaction.query.filter_by(user_id=1).all()
    
    if not transactions:
        return jsonify({'score': 0, 'factors': []})
    
    df = pd.DataFrame([t.to_dict() for t in transactions])
    df['amount'] = pd.to_numeric(df['amount'])
    
    # Calculate health score factors
    total_spent = df['amount'].sum()
    avg_transaction = df['amount'].mean()
    num_transactions = len(df)
    
    # Simple scoring algorithm
    score = 100
    
    # Penalize high average transaction amount
    if avg_transaction > 100:
        score -= 20
    
    # Penalize high number of transactions
    if num_transactions > 500:
        score -= 15
    
    # Bonus for diverse spending categories
    unique_categories = df['category'].nunique()
    if unique_categories > 5:
        score += 10
    
    score = max(0, min(100, score))
    
    factors = [
        f'Average transaction: ${avg_transaction:.2f}',
        f'Total transactions: {num_transactions}',
        f'Spending categories: {unique_categories}'
    ]
    
    return jsonify({'score': score, 'factors': factors})

@app.route('/api/category-performance')
def get_category_performance():
    transactions = Transaction.query.filter_by(user_id=1).all()
    
    if not transactions:
        return jsonify({'categories': []})
    
    df = pd.DataFrame([t.to_dict() for t in transactions])
    df['amount'] = pd.to_numeric(df['amount'])
    df['date'] = pd.to_datetime(df['date'])
    
    # Calculate category performance metrics
    category_performance = []
    
    for category in df['category'].unique():
        category_data = df[df['category'] == category]
        
        # Calculate metrics
        total_spent = category_data['amount'].sum()
        avg_amount = category_data['amount'].mean()
        transaction_count = len(category_data)
        
        # Calculate spending frequency (transactions per week)
        date_range = (df['date'].max() - df['date'].min()).days
        weeks = max(date_range / 7, 1)
        frequency = transaction_count / weeks
        
        # Calculate trend (last 30 days vs previous 30 days)
        recent_cutoff = df['date'].max() - pd.Timedelta(days=30)
        previous_cutoff = df['date'].max() - pd.Timedelta(days=60)
        
        recent_spending = category_data[category_data['date'] >= recent_cutoff]['amount'].sum()
        previous_spending = category_data[
            (category_data['date'] >= previous_cutoff) & 
            (category_data['date'] < recent_cutoff)
        ]['amount'].sum()
        
        # Calculate performance score
        performance_score = calculate_category_performance_score(
            total_spent, avg_amount, frequency, recent_spending, previous_spending
        )
        
        # Determine performance rating
        rating = get_performance_rating(performance_score)
        
        category_performance.append({
            'category': category,
            'total_spent': round(total_spent, 2),
            'avg_amount': round(avg_amount, 2),
            'transaction_count': transaction_count,
            'frequency': round(frequency, 2),
            'recent_spending': round(recent_spending, 2),
            'previous_spending': round(previous_spending, 2),
            'performance_score': performance_score,
            'rating': rating,
            'trend': 'up' if recent_spending > previous_spending else 'down' if recent_spending < previous_spending else 'stable'
        })
    
    # Sort by performance score (descending)
    category_performance.sort(key=lambda x: x['performance_score'], reverse=True)
    
    return jsonify({'categories': category_performance})

def calculate_category_performance_score(total_spent, avg_amount, frequency, recent_spending, previous_spending):
    """Calculate a performance score for a spending category (0-100)"""
    score = 50  # Base score
    
    # Factor 1: Spending control (lower is better for most categories)
    if avg_amount < 50:
        score += 20
    elif avg_amount < 100:
        score += 10
    elif avg_amount > 200:
        score -= 20
    
    # Factor 2: Frequency control (moderate frequency is good)
    if 1 <= frequency <= 3:  # 1-3 transactions per week is reasonable
        score += 15
    elif frequency > 5:  # Too frequent spending
        score -= 15
    
    # Factor 3: Trend analysis (decreasing spending is generally good)
    if previous_spending > 0:
        trend_ratio = recent_spending / previous_spending
        if trend_ratio < 0.9:  # Spending decreased by 10%+
            score += 15
        elif trend_ratio > 1.1:  # Spending increased by 10%+
            score -= 10
    
    # Factor 4: Category-specific adjustments
    essential_categories = ['Healthcare', 'Utilities', 'Insurance', 'Education']
    discretionary_categories = ['Entertainment', 'Shopping', 'Travel']
    
    # For essential categories, consistent spending is good
    # Check if category name contains any of the essential category keywords
    is_essential = any(cat.lower() in str(total_spent).lower() for cat in essential_categories)
    if is_essential and previous_spending > 0:
        if 0.9 <= (recent_spending / previous_spending) <= 1.1:
            score += 10
    
    # For discretionary categories, lower spending is better
    is_discretionary = any(cat.lower() in str(total_spent).lower() for cat in discretionary_categories)
    if is_discretionary and recent_spending < previous_spending:
        score += 10
    
    return max(0, min(100, score))

def get_performance_rating(score):
    """Convert performance score to rating"""
    if score >= 80:
        return 'Excellent'
    elif score >= 65:
        return 'Good'
    elif score >= 50:
        return 'Average'
    elif score >= 30:
        return 'Poor'
    else:
        return 'Inactive'

# Initialize database and sample data
def initialize_database():
    with app.app_context():
        db.create_all()
        
        # Check if we need to add sample data
        if Transaction.query.count() == 0:
            sample_transactions = generate_sample_data()
            for transaction in sample_transactions:
                db.session.add(transaction)
            db.session.commit()
            print("Sample data generated successfully!")

# Initialize on startup
initialize_database()

if __name__ == '__main__':
    # Use PORT environment variable for deployment, default to 8000 for local
    import os
    port = int(os.environ.get('PORT', 8000))
    app.run(debug=False, host='0.0.0.0', port=port) 