# Deployment Instructions

## Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory.
3. Follow the prompts (default settings are usually fine).

## Option 2: Netlify
1. Drag and drop the `dist` folder (created after `npm run build`) to Netlify Drop.
2. Or connect your Git repository to Netlify.

## Option 3: Static Hosting
1. Run `npm run build`.
2. Upload the contents of the `dist` directory to any static host (GitHub Pages, S3, etc.).
