# Deployment Guide - AI Finance Analyzer

This guide covers various deployment options for the AI Finance Analyzer project.

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-finance-analyzer.git
   cd ai-finance-analyzer
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Access the application**
   - Main app: http://localhost:5000
   - Dashboard: http://localhost:5000/dashboard
   - Analytics: http://localhost:5000/analytics

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access services**
   - Web app: http://localhost:5000
   - Flower (Celery monitoring): http://localhost:5555
   - Redis: localhost:6379

### Using Docker directly

1. **Build the image**
   ```bash
   docker build -t ai-finance-analyzer .
   ```

2. **Run the container**
   ```bash
   docker run -p 5000:5000 ai-finance-analyzer
   ```

## ☁️ Cloud Deployment

### Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables**
   ```bash
   heroku config:set FLASK_ENV=production
   heroku config:set SECRET_KEY=your-secret-key-here
   ```

5. **Deploy to Heroku**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

6. **Open the app**
   ```bash
   heroku open
   ```

### AWS Deployment

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB application**
   ```bash
   eb init -p python-3.9 ai-finance-analyzer
   ```

3. **Create environment**
   ```bash
   eb create production
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

#### Using AWS ECS

1. **Create ECR repository**
   ```bash
   aws ecr create-repository --repository-name ai-finance-analyzer
   ```

2. **Build and push image**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
   docker build -t ai-finance-analyzer .
   docker tag ai-finance-analyzer:latest your-account.dkr.ecr.us-east-1.amazonaws.com/ai-finance-analyzer:latest
   docker push your-account.dkr.ecr.us-east-1.amazonaws.com/ai-finance-analyzer:latest
   ```

3. **Create ECS cluster and service**
   ```bash
   # Create cluster
   aws ecs create-cluster --cluster-name ai-finance-analyzer
   
   # Create task definition and service (use AWS Console or CloudFormation)
   ```

### Google Cloud Platform

#### Using Google App Engine

1. **Install Google Cloud SDK**
   ```bash
   # Download from https://cloud.google.com/sdk/docs/install
   ```

2. **Create app.yaml**
   ```yaml
   runtime: python39
   entrypoint: gunicorn -b :$PORT app:app
   
   env_variables:
     FLASK_ENV: production
   ```

3. **Deploy**
   ```bash
   gcloud app deploy
   ```

#### Using Google Cloud Run

1. **Build and push to Container Registry**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/ai-finance-analyzer
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy ai-finance-analyzer \
     --image gcr.io/PROJECT-ID/ai-finance-analyzer \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Azure Deployment

#### Using Azure App Service

1. **Install Azure CLI**
   ```bash
   # Download from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
   ```

2. **Login to Azure**
   ```bash
   az login
   ```

3. **Create resource group and app service**
   ```bash
   az group create --name ai-finance-analyzer --location eastus
   az appservice plan create --name ai-finance-analyzer-plan --resource-group ai-finance-analyzer --sku B1
   az webapp create --name ai-finance-analyzer --resource-group ai-finance-analyzer --plan ai-finance-analyzer-plan --runtime "PYTHON|3.9"
   ```

4. **Deploy**
   ```bash
   az webapp deployment source config-local-git --name ai-finance-analyzer --resource-group ai-finance-analyzer
   git remote add azure <git-url-from-previous-command>
   git push azure main
   ```

## 🔧 Environment Configuration

### Environment Variables

Create a `.env` file for local development:

```env
FLASK_ENV=development
FLASK_APP=app.py
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///finance_analyzer.db
REDIS_URL=redis://localhost:6379
```

### Production Configuration

For production, set these environment variables:

```env
FLASK_ENV=production
SECRET_KEY=your-very-secure-secret-key
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://your-redis-host:6379
```

## 📊 Monitoring and Logging

### Application Monitoring

1. **Health Checks**
   - Endpoint: `/health`
   - Returns 200 if application is healthy

2. **Metrics**
   - Application metrics available at `/metrics`
   - Performance monitoring with built-in logging

### Logging

The application uses structured logging with the following levels:
- INFO: General application information
- WARNING: Potential issues
- ERROR: Application errors
- DEBUG: Detailed debugging information

### Performance Monitoring

1. **Gunicorn Configuration**
   ```bash
   gunicorn --bind 0.0.0.0:5000 --workers 4 --timeout 120 --access-logfile - --error-logfile - app:app
   ```

2. **Celery Monitoring**
   - Flower dashboard: http://localhost:5555
   - Monitor background tasks and queue status

## 🔒 Security Considerations

### Production Security

1. **HTTPS/SSL**
   - Always use HTTPS in production
   - Configure SSL certificates

2. **Environment Variables**
   - Never commit secrets to version control
   - Use environment variables for sensitive data

3. **Database Security**
   - Use strong passwords
   - Enable database encryption
   - Regular backups

4. **API Security**
   - Implement rate limiting
   - Add authentication for sensitive endpoints
   - Validate all input data

### Security Headers

The application includes security headers:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy: default-src 'self'

## 🧪 Testing

### Run Tests

```bash
# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=app

# Run specific test file
python test_app.py
```

### Load Testing

```bash
# Install locust
pip install locust

# Run load test
locust -f locustfile.py
```

## 📈 Scaling

### Horizontal Scaling

1. **Load Balancer**
   - Use nginx or cloud load balancer
   - Distribute traffic across multiple instances

2. **Database Scaling**
   - Use read replicas for read-heavy workloads
   - Consider database sharding for large datasets

3. **Caching**
   - Redis for session storage
   - CDN for static assets

### Vertical Scaling

1. **Resource Allocation**
   - Increase CPU and memory allocation
   - Optimize database queries

2. **Performance Tuning**
   - Use connection pooling
   - Implement caching strategies

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        python -m pytest
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check database URL configuration
   - Verify database is running
   - Check firewall settings

2. **Memory Issues**
   - Increase worker memory allocation
   - Optimize ML model loading
   - Use caching for expensive operations

3. **Performance Issues**
   - Monitor database query performance
   - Check for memory leaks
   - Optimize ML model inference

### Debug Mode

Enable debug mode for development:

```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
python app.py
```

### Logs

Check application logs:

```bash
# Docker logs
docker-compose logs web

# Heroku logs
heroku logs --tail

# System logs
journalctl -u your-service-name
```

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

---

**Happy Deploying! 🚀** 