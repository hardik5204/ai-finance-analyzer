# 🚀 Deployment Guide - AI Finance Analyzer

This guide will help you deploy your AI Finance Analyzer to get a public URL using GitHub integration.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **GitHub Account**: You'll need a GitHub account
3. **Free Platform Accounts**: Choose one of the deployment platforms below

## 🎯 Recommended Deployment Options

### Option 1: Render.com (Recommended - Free Tier)

**Pros:**
- ✅ Free tier available
- ✅ Easy GitHub integration
- ✅ Automatic deployments
- ✅ PostgreSQL database included
- ✅ Custom domains

**Steps:**

1. **Sign up at [Render.com](https://render.com)**
2. **Connect your GitHub repository**
3. **Create a new Web Service**
4. **Configure settings:**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 4 --timeout 120`
   - **Environment**: Python 3
5. **Add environment variables:**
   ```
   FLASK_ENV=production
   FLASK_DEBUG=False
   ```
6. **Deploy!** Your app will be available at `https://your-app-name.onrender.com`

### Option 2: Railway.app (Alternative - Free Tier)

**Pros:**
- ✅ Free tier available
- ✅ GitHub Actions integration
- ✅ Easy database setup
- ✅ Fast deployments

**Steps:**

1. **Sign up at [Railway.app](https://railway.app)**
2. **Connect your GitHub repository**
3. **Create new project from GitHub repo**
4. **Railway will auto-detect Python and deploy**
5. **Your app will be available at `https://your-app-name.railway.app`**

### Option 3: Heroku (Classic Choice)

**Pros:**
- ✅ Well-established platform
- ✅ Good documentation
- ✅ GitHub integration

**Steps:**

1. **Sign up at [Heroku.com](https://heroku.com)**
2. **Install Heroku CLI**
3. **Connect your GitHub repository**
4. **Enable automatic deploys**
5. **Your app will be available at `https://your-app-name.herokuapp.com`**

## 🔧 GitHub Actions Setup (Optional)

If you want automated deployments, set up GitHub Actions:

1. **Go to your GitHub repository**
2. **Navigate to Settings → Secrets and variables → Actions**
3. **Add the following secrets:**

### For Render.com:
```
RENDER_TOKEN=your_render_api_token
RENDER_SERVICE_ID=your_service_id
```

### For Railway:
```
RAILWAY_TOKEN=your_railway_token
```

## 🌐 Getting Your Public URL

After deployment, you'll get a public URL like:
- **Render**: `https://ai-finance-analyzer.onrender.com`
- **Railway**: `https://ai-finance-analyzer.railway.app`
- **Heroku**: `https://ai-finance-analyzer.herokuapp.com`

## 🔄 Continuous Deployment

Once set up, every push to your `main` branch will automatically:
1. Run tests
2. Deploy to your chosen platform
3. Update your public URL

## 📊 Monitoring Your Deployment

- **Render**: Dashboard shows logs, metrics, and deployment status
- **Railway**: Real-time logs and performance monitoring
- **Heroku**: Application logs and dyno metrics

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check `requirements.txt` for all dependencies
   - Ensure Python version compatibility

2. **Runtime Errors**
   - Check application logs
   - Verify environment variables

3. **Database Issues**
   - Ensure database URL is set correctly
   - Check database connection settings

## 🎉 Success!

Once deployed, you'll have:
- ✅ Public URL accessible worldwide
- ✅ Automatic deployments from GitHub
- ✅ Professional hosting
- ✅ SSL certificate included
- ✅ Scalable infrastructure

## 📱 Next Steps

1. **Test your deployed application**
2. **Share your public URL**
3. **Monitor performance**
4. **Set up custom domain (optional)**
5. **Configure monitoring and alerts**

---

**Your AI Finance Analyzer is now live and accessible to the world! 🌍** 