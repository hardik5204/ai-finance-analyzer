import unittest
import json
from app import app, db, Transaction

class FinanceAnalyzerTestCase(unittest.TestCase):
    
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        
        with app.app_context():
            db.create_all()
    
    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()
    
    def test_home_page(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'AI Finance Analyzer', response.data)
    
    def test_dashboard_page(self):
        response = self.app.get('/dashboard')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Dashboard', response.data)
    
    def test_analytics_page(self):
        response = self.app.get('/analytics')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Analytics', response.data)
    
    def test_api_transactions(self):
        response = self.app.get('/api/transactions')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
    
    def test_api_analytics(self):
        response = self.app.get('/api/analytics')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, dict)
    
    def test_add_transaction(self):
        transaction_data = {
            'amount': 50.0,
            'merchant': 'Test Store',
            'date': '2024-01-01',
            'description': 'Test transaction'
        }
        
        response = self.app.post('/api/transactions',
                               data=json.dumps(transaction_data),
                               content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('message', data)
        self.assertIn('predicted_category', data)
    
    def test_api_predict(self):
        response = self.app.get('/api/predict')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, dict)
    
    def test_api_anomalies(self):
        response = self.app.get('/api/anomalies')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, dict)
        self.assertIn('anomalies', data)
    
    def test_api_budget_recommendations(self):
        response = self.app.get('/api/budget-recommendations')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, dict)
        self.assertIn('recommendations', data)
    
    def test_api_health_score(self):
        response = self.app.get('/api/health-score')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, dict)
        self.assertIn('score', data)
        self.assertIn('factors', data)

if __name__ == '__main__':
    unittest.main() 