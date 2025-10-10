# 🚀 Deployment Guide

This guide helps you deploy your portfolio website to various hosting platforms.

## 📋 Pre-Deployment Checklist

- [ ] Add your resume PDF to `assets/Sai_Prudvi_Resume.pdf`
- [ ] Update personal information in all HTML files
- [ ] Test the website locally using `python3 dev-server.py`
- [ ] Verify all links work correctly
- [ ] Check responsive design on different screen sizes
- [ ] Validate HTML and CSS
- [ ] Optimize images and assets

## 🌐 Hosting Options

### 1. Netlify (Recommended)
**Pros**: Free, automatic deployments, custom domains, forms, CDN
**Best for**: Quick deployment with GitHub integration

**Steps**:
1. Create account at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Set build settings:
   - Build command: (leave empty)
   - Publish directory: `/` or `./`
4. Deploy automatically on git push

**Custom Domain**:
- Buy domain from any registrar
- In Netlify dashboard → Domain settings → Add custom domain
- Update DNS records as instructed

### 2. Vercel
**Pros**: Excellent performance, GitHub integration, free SSL
**Best for**: Modern web apps and static sites

**Steps**:
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with zero configuration
4. Automatic deployments on git push

### 3. GitHub Pages
**Pros**: Free, integrated with GitHub, simple setup
**Best for**: Open source portfolios

**Steps**:
1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select source branch (usually `main`)
4. Your site will be at `username.github.io/repository-name`

### 4. AWS S3 + CloudFront
**Pros**: Scalable, fast CDN, professional setup
**Best for**: High-traffic sites, learning cloud deployment

**Steps**:
1. Create S3 bucket with static website hosting
2. Upload website files
3. Set up CloudFront distribution
4. Configure Route 53 for custom domain

## 🔧 Build Optimization

### Image Optimization
```bash
# Install ImageOptim (macOS) or similar tool
# Compress all images in assets folder
# Target: < 500KB per image
```

### CSS/JS Minification (Optional)
```bash
# For production, you can minify CSS and JS
# Use online tools or build processes
```

### Performance Checklist
- [ ] Images optimized and compressed
- [ ] CSS and JS files minified (optional)
- [ ] Fonts loaded efficiently
- [ ] No console errors
- [ ] Lighthouse score > 90

## 🔒 Security & SEO

### Security Headers (Netlify)
Create `_headers` file:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### SEO Optimization
- [ ] Meta descriptions on all pages
- [ ] Open Graph tags
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Schema markup for better search results

### Analytics (Optional)
Add Google Analytics 4:
```html
<!-- Add to <head> of all pages -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🌍 Custom Domain Setup

### 1. Buy Domain
- **Recommended registrars**: Namecheap, Google Domains, GoDaddy
- **Choose**: .com, .dev, or .me extensions
- **Cost**: $10-15/year

### 2. DNS Configuration
For most hosting providers, update these DNS records:

**A Records**:
```
@ → [Hosting provider IP]
www → [Hosting provider IP]
```

**CNAME Records**:
```
www → yourdomain.com
```

### 3. SSL Certificate
- Most modern hosts provide free SSL automatically
- Verify HTTPS works after domain setup
- Redirect HTTP to HTTPS

## 📊 Monitoring & Maintenance

### Performance Monitoring
- **Google PageSpeed Insights**: Check loading speed
- **GTmetrix**: Detailed performance analysis
- **Lighthouse**: Built into Chrome DevTools

### Regular Updates
- [ ] Keep resume PDF current
- [ ] Update project information
- [ ] Add new skills and experiences
- [ ] Monitor and fix broken links
- [ ] Review and update content quarterly

### Backup Strategy
- [ ] Keep source code in GitHub
- [ ] Backup hosting account settings
- [ ] Document custom configurations
- [ ] Save domain registrar details

## 🚨 Troubleshooting

### Common Issues

**"Site not found"**
- Check DNS propagation (24-48 hours)
- Verify hosting provider settings
- Ensure files uploaded correctly

**"Mixed content errors"**
- Update all HTTP links to HTTPS
- Check external resources (fonts, images)

**"Slow loading"**
- Optimize images
- Enable hosting provider CDN
- Check third-party scripts

**"Mobile layout broken"**
- Test with Chrome DevTools mobile simulation
- Verify CSS media queries
- Check viewport meta tag

### Getting Help
- Check hosting provider documentation
- Use browser developer tools for debugging
- Test on multiple devices and browsers
- Ask for help on developer communities

## ✅ Post-Deployment

After successful deployment:

1. **Test thoroughly**:
   - All navigation links
   - Contact form functionality
   - Resume download
   - Mobile responsiveness

2. **Share your site**:
   - Update LinkedIn profile
   - Add to email signature
   - Share on social media
   - Update business cards

3. **Monitor performance**:
   - Set up Google Analytics (optional)
   - Check loading speeds regularly
   - Monitor for broken links

**Congratulations! 🎉 Your portfolio is now live and professional!**

# Deployment Instructions

## Deploying to GitHub Pages

1. **Initialize a new Git repository** in the `myprofile` folder:
   ```sh
   cd myprofile
   git init
   git add .
   git commit -m "Initial commit: Resume website"
   ```
2. **Create a new repository on GitHub** (e.g., `myprofile`).
3. **Add the remote and push**:
   ```sh
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
4. **Enable GitHub Pages** in repository settings:
   - Go to Settings → Pages
   - Source: `main` branch, `/ (root)` folder
   - Save
5. **Access your site** at `https://<your-username>.github.io/<repo-name>/`

## Tips
- The `.nojekyll` file is included for static hosting.
- Update your README.md with the live site link.
- For custom domain, configure in GitHub Pages settings.

---

For troubleshooting, see GITHUB_PAGES.md.