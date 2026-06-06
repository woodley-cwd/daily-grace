# ✦ Daily Grace

A daily quote Progressive Web App for faith, family, and encouragement. Designed for warmth and ease of use with large text, gentle colors, and a devotional feel.

## Features

- AI-generated Quote of the Day (powered by Claude)
- Browse by category: Bible, Inspirational, Motivational, Family, Faith, Encouragement
- Save favorites with date stamps
- 14-day quote history
- Dark mode & adjustable font size
- Works offline (after first load)
- Installable as an app on iPhone or Android

## Getting Your Claude API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account (or sign in)
3. Go to **API Keys** and click **Create Key**
4. Copy the key — it starts with `sk-ant-...`
5. Open Daily Grace → tap **Settings** → paste your key under **API Key**

Your key is stored only on your device and never sent anywhere except directly to Anthropic's API.

## Installing as an App

### iPhone (iOS)
1. Open the app URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share** button at the bottom of the screen
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add** — the app icon will appear on your home screen
5. From then on, open it like any other app

### Android
1. Open the app URL in **Chrome**
2. Tap the **three dots menu** in the top right
3. Tap **"Add to Home Screen"**
4. Tap **Add**

## Troubleshooting

**Quotes stopped loading?**
- Check your API key is entered in Settings
- Check your internet connection
- Today's quote is cached — you'll still see it offline

**Service worker serving stale content?**
- In `sw.js`, change `daily-grace-v1` to `daily-grace-v2`

## Deployment to GitHub Pages

```bash
# 1. Initialise git (inside the daily-grace folder)
git init
git add index.html manifest.json sw.js css/ js/ icons/ README.md
git commit -m "Initial release"

# 2. Create a repo on github.com named e.g. "daily-grace"
#    Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/daily-grace.git
git branch -M main
git push -u origin main

# 3. Enable GitHub Pages
#    Go to: repo Settings → Pages → Source → Deploy from branch → main → / (root) → Save

# 4. Your app will be live at:
#    https://YOUR_USERNAME.github.io/daily-grace/
```

---
Built with love · Powered by Claude
