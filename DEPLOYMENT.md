# 🚀 AI Finance Analyzer - Deployment Guide

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [GitHub Deployment](#github-deployment)
- [Local Development](#local-development)
- [Cloud Deployment Options](#cloud-deployment-options)
- [Environment Configuration](#environment-configuration)
- [Production Considerations](#production-considerations)

## ⚡ Quick Start

### Prerequisites
- Python 3.8+ 
- Git
- pip (Python package manager)

### 1. Clone the Repository
```bash
git clone https://github.com/hardik5204/ai-finance-analyzer.git
cd ai-finance-analyzer
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Application
```bash
python app.py
```

The application will be available at `http://localhost:8000`

## 🐙 GitHub Deployment

### Repository Setup
The project is hosted at: **https://github.com/hardik5204/ai-finance-analyzer**

### Clone and Setup
```bash
# Clone the repository
git clone https://github.com/hardik5204/ai-finance-analyzer.git
cd ai-finance-analyzer

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

### Development Workflow
```bash
# Make changes to your code
git add .
git commit -m "Your commit message"
git push origin main
```

## 💻 Local Development

### Virtual Environment Setup
```bash
# Create virtual environment
python -m venv ai-finance-env
source ai-finance-env/bin/activate  # On Windows: ai-finance-env\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running in Development Mode
```bash
# Set Flask environment variables
export FLASK_ENV=development
export FLASK_DEBUG=1

# Run the application
python app.py
```

### Database Setup
The application uses SQLite by default. The database will be created automatically when you first run the app.

## ☁️ Cloud Deployment Options

### 1. Heroku Deployment

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Steps
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set Python buildpack
heroku buildpacks:set heroku/python

# Deploy
git push heroku main

# Open your app
heroku open
```

#### Heroku Configuration
The project includes:
- `Procfile` - Defines how to run the app
- `requirements.txt` - Python dependencies
- `runtime.txt` (optional) - Python version specification

### 2. Vercel Deployment

#### Using Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts to configure your deployment
```

#### Using Vercel Dashboard
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Framework Preset: Other
   - Build Command: `pip install -r requirements.txt`
   - Output Directory: `.`
3. Deploy

### 3. Railway Deployment

#### Steps
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 4. Docker Deployment

#### Using Docker
```bash
# Build the Docker image
docker build -t ai-finance-analyzer .

# Run the container
docker run -p 8000:8000 ai-finance-analyzer
```

#### Using Docker Compose
```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down
```

### 5. DigitalOcean App Platform

#### Steps
1. Fork the repository to your GitHub account
2. Connect your GitHub account to DigitalOcean
3. Create a new app from your repository
4. Configure the app settings:
   - Source: GitHub repository
   - Branch: main
   - Autodeploy: Enabled
5. Deploy

## 🔧 Environment Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-secret-key-here

# Database Configuration
DATABASE_URL=sqlite:///finance_analyzer.db

# ML Model Configuration
MODEL_CACHE_SIZE=100
PREDICTION_CONFIDENCE_THRESHOLD=0.8

# API Configuration
API_RATE_LIMIT=100
API_TIMEOUT=30

# Security Configuration
CORS_ORIGINS=*
SESSION_TIMEOUT=3600
```

### Production Environment Variables
For production deployments, set these environment variables:

```bash
# Security
export SECRET_KEY="your-super-secret-key-here"
export FLASK_ENV="production"
export FLASK_DEBUG="False"

# Database (if using PostgreSQL)
export DATABASE_URL="postgresql://username:password@host:port/database"

# Optional: External services
export REDIS_URL="redis://localhost:6379"
export CELERY_BROKER_URL="redis://localhost:6379"
```

## 🏭 Production Considerations

### Security
- [ ] Set a strong `SECRET_KEY`
- [ ] Use HTTPS in production
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Use environment variables for sensitive data
- [ ] Enable security headers

### Performance
- [ ] Use a production WSGI server (Gunicorn, uWSGI)
- [ ] Configure caching (Redis, Memcached)
- [ ] Optimize database queries
- [ ] Implement CDN for static files
- [ ] Monitor application performance

### Monitoring
- [ ] Set up logging
- [ ] Configure error tracking (Sentry)
- [ ] Monitor application metrics
- [ ] Set up health checks
- [ ] Configure alerts

### Database
- [ ] Use PostgreSQL for production
- [ ] Set up database backups
- [ ] Configure connection pooling
- [ ] Optimize database indexes

### Scaling
- [ ] Use load balancers
- [ ] Implement horizontal scaling
- [ ] Configure auto-scaling
- [ ] Optimize resource usage

## 🔍 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process using port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
python app.py --port 8080
```

#### Import Errors
```bash
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt

# Check Python version
python --version
```

#### Database Issues
```bash
# Delete and recreate database
rm instance/finance_analyzer.db
python app.py
```

### Getting Help
- 📧 Email: hardikbhardwaj@example.com
- 🐛 Issues: https://github.com/hardik5204/ai-finance-analyzer/issues
- 📖 Documentation: Check README.md for detailed features

## 📱 Live Demo
- **GitHub Repository**: https://github.com/hardik5204/ai-finance-analyzer
- **Live Demo**: [Will be updated after deployment]

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Hardik Bhardwaj** 