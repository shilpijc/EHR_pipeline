# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts and login if needed
4. Get instant URL: `your-project.vercel.app`
5. For updates: `vercel --prod`

**Pros:** Free, instant, automatic HTTPS, easy updates

---

### Option 2: Netlify (Drag & Drop)

1. Build the project:
```bash
npm run build
```

2. Go to: https://app.netlify.com/drop
3. Drag the `dist` folder to the page
4. Get instant URL

**Pros:** No CLI needed, very simple

---

### Option 3: GitHub Pages

1. Push to GitHub
2. Go to repository Settings → Pages
3. Select source: `gh-pages` branch or `main` branch `/docs` folder
4. Access at: `https://username.github.io/repo-name`

**Note:** Requires updating `vite.config.js` base path if using subdirectory

---

### Option 4: Local Sharing (Quick Demo)

1. Build the project:
```bash
npm run build
```

2. Serve locally:
```bash
npm run preview
```

3. Share your local IP (people on same network can access)

---

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

