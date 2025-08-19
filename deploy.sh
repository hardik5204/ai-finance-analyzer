#!/bin/bash

# 🚀 AI Finance Analyzer - Quick Deployment Script
# This script helps you deploy your Flask app to various platforms

echo "🚀 AI Finance Analyzer - Deployment Script"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No GitHub remote found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/your-repo-name.git"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Function to deploy to Render
deploy_render() {
    echo "🎯 Deploying to Render.com..."
    echo "1. Go to https://render.com"
    echo "2. Sign up/Login with GitHub"
    echo "3. Click 'New +' → 'Web Service'"
    echo "4. Connect your GitHub repository"
    echo "5. Configure settings:"
    echo "   - Name: ai-finance-analyzer"
    echo "   - Environment: Python 3"
    echo "   - Build Command: pip install -r requirements.txt"
    echo "   - Start Command: gunicorn app:app --bind 0.0.0.0:\$PORT --workers 4 --timeout 120"
    echo "6. Add Environment Variables:"
    echo "   - FLASK_ENV=production"
    echo "   - FLASK_DEBUG=False"
    echo "7. Click 'Create Web Service'"
    echo ""
    echo "🌐 Your app will be available at: https://ai-finance-analyzer.onrender.com"
}

# Function to deploy to Railway
deploy_railway() {
    echo "🚂 Deploying to Railway.app..."
    echo "1. Go to https://railway.app"
    echo "2. Sign up/Login with GitHub"
    echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
    echo "4. Select your repository"
    echo "5. Railway will auto-detect Python and deploy"
    echo ""
    echo "🌐 Your app will be available at: https://ai-finance-analyzer.railway.app"
}

# Function to deploy to Heroku
deploy_heroku() {
    echo "🦸 Deploying to Heroku..."
    echo "1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli"
    echo "2. Login to Heroku: heroku login"
    echo "3. Create app: heroku create ai-finance-analyzer"
    echo "4. Deploy: git push heroku main"
    echo "5. Open app: heroku open"
    echo ""
    echo "🌐 Your app will be available at: https://ai-finance-analyzer.herokuapp.com"
}

# Function to setup GitHub Actions
setup_github_actions() {
    echo "🔧 Setting up GitHub Actions for automated deployment..."
    echo "1. Go to your GitHub repository"
    echo "2. Navigate to Settings → Secrets and variables → Actions"
    echo "3. Add the following secrets:"
    echo ""
    echo "For Render.com:"
    echo "   RENDER_TOKEN=your_render_api_token"
    echo "   RENDER_SERVICE_ID=your_service_id"
    echo ""
    echo "For Railway:"
    echo "   RAILWAY_TOKEN=your_railway_token"
    echo ""
    echo "✅ GitHub Actions workflow is already configured in .github/workflows/deploy.yml"
}

# Main menu
echo "Choose your deployment platform:"
echo "1) Render.com (Recommended - Free)"
echo "2) Railway.app (Alternative - Free)"
echo "3) Heroku (Classic - Free tier available)"
echo "4) Setup GitHub Actions (Automated deployment)"
echo "5) All platforms info"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        deploy_render
        ;;
    2)
        deploy_railway
        ;;
    3)
        deploy_heroku
        ;;
    4)
        setup_github_actions
        ;;
    5)
        echo "📋 All Deployment Options:"
        echo "=========================="
        deploy_render
        echo ""
        deploy_railway
        echo ""
        deploy_heroku
        echo ""
        setup_github_actions
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment instructions completed!"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "🔗 Your GitHub repository: $(git remote get-url origin)"
echo ""
echo "💡 Pro tip: After deployment, update your README.md with your live URL!"
