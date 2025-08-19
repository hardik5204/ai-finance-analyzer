#!/bin/bash

# 🚀 GitHub Pages Setup Script for AI Finance Analyzer
# This script helps you set up GitHub Pages deployment

echo "🌐 GitHub Pages Setup for AI Finance Analyzer"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Git repository not found. Please initialize git first:${NC}"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${RED}❌ No GitHub remote found. Please add your GitHub repository:${NC}"
    echo "   git remote add origin https://github.com/yourusername/your-repo-name.git"
    exit 1
fi

echo -e "${GREEN}✅ Git repository found${NC}"
echo ""

# Get repository information
REPO_URL=$(git remote get-url origin)
REPO_NAME=$(basename -s .git "$REPO_URL")
USERNAME=$(echo "$REPO_URL" | sed -n 's/.*github.com[:/]\([^/]*\)\/.*/\1/p')

echo -e "${BLUE}📋 Repository Information:${NC}"
echo "   Repository: $REPO_NAME"
echo "   Username: $USERNAME"
echo "   GitHub Pages URL: https://$USERNAME.github.io/$REPO_NAME/"
echo ""

# Check if static-site directory exists
if [ ! -d "static-site" ]; then
    echo -e "${RED}❌ Static site directory not found. Creating it...${NC}"
    mkdir -p static-site
fi

echo -e "${GREEN}✅ Static site directory ready${NC}"
echo ""

# Check if GitHub Actions workflow exists
if [ ! -f ".github/workflows/github-pages.yml" ]; then
    echo -e "${YELLOW}⚠️  GitHub Pages workflow not found. Creating it...${NC}"
    mkdir -p .github/workflows
    cat > .github/workflows/github-pages.yml << 'EOF'
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./static-site
        publish_branch: gh-pages
        force_orphan: true
        user_name: 'github-actions[bot]'
        user_email: 'github-actions[bot]@users.noreply.github.com'
        commit_message: 'Deploy AI Finance Analyzer to GitHub Pages'
EOF
    echo -e "${GREEN}✅ GitHub Pages workflow created${NC}"
fi

echo -e "${GREEN}✅ GitHub Pages workflow ready${NC}"
echo ""

# Instructions for manual setup
echo -e "${BLUE}📋 Next Steps (Manual):${NC}"
echo ""
echo "1. ${YELLOW}Push your code to GitHub:${NC}"
echo "   git add ."
echo "   git commit -m 'Add GitHub Pages static site'"
echo "   git push origin main"
echo ""
echo "2. ${YELLOW}Enable GitHub Pages:${NC}"
echo "   • Go to: https://github.com/$USERNAME/$REPO_NAME/settings/pages"
echo "   • Under 'Source', select 'Deploy from a branch'"
echo "   • Choose 'gh-pages' branch"
echo "   • Click 'Save'"
echo ""
echo "3. ${YELLOW}Wait for deployment (2-5 minutes)${NC}"
echo ""
echo "4. ${YELLOW}Your public URL will be:${NC}"
echo "   https://$USERNAME.github.io/$REPO_NAME/"
echo ""

# Check if files exist
echo -e "${BLUE}📁 Checking required files:${NC}"
if [ -f "static-site/index.html" ]; then
    echo -e "   ${GREEN}✅ index.html${NC}"
else
    echo -e "   ${RED}❌ index.html (missing)${NC}"
fi

if [ -f "static-site/style.css" ]; then
    echo -e "   ${GREEN}✅ style.css${NC}"
else
    echo -e "   ${RED}❌ style.css (missing)${NC}"
fi

if [ -f "static-site/script.js" ]; then
    echo -e "   ${GREEN}✅ script.js${NC}"
else
    echo -e "   ${RED}❌ script.js (missing)${NC}"
fi

echo ""

# Offer to push code
read -p "Do you want to push your code to GitHub now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🚀 Pushing code to GitHub...${NC}"
    git add .
    git commit -m "Add GitHub Pages static site and deployment configuration"
    git push origin main
    echo -e "${GREEN}✅ Code pushed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}📋 Now follow the manual steps above to enable GitHub Pages.${NC}"
else
    echo -e "${YELLOW}📋 Remember to push your code and enable GitHub Pages manually.${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}📚 Additional Resources:${NC}"
echo "   • GitHub Pages Guide: GITHUB_PAGES_DEPLOYMENT.md"
echo "   • General Deployment: DEPLOYMENT.md"
echo "   • Repository: https://github.com/$USERNAME/$REPO_NAME"
echo ""
echo -e "${GREEN}🌟 Your AI Finance Analyzer will soon be accessible to the world!${NC}"
