# Leixlip Weather & Electric Picnic 2026 Outlook

Hyperlocal Irish weather forecasts and analysis from Leixlip, Co. Kildare, featuring the official Electric Picnic 2026 outlook — with the irrevocable conclusion: **It'll be grand.**

## Deployment to GitHub Pages

This project is configured for static hosting on **GitHub Pages**.

### Method 1: Automatic Deployment via GitHub Actions (Recommended)

1. Push your repository to GitHub (`main` or `master` branch).
2. On GitHub, navigate to your repository **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Every push to `main` will automatically trigger the included workflow (`.github/workflows/deploy.yml`) to build and deploy the applet.

### Method 2: Manual Local Build & Push

```bash
# Install dependencies
npm install

# Build static bundle to dist/
npm run build

# Preview locally
npm run preview
```
