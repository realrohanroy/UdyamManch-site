# Udyam Manch (उद्यम मंच) 🚀

[![Website](https://img.shields.io/badge/Website-Udyam%20Manch-5252a6?style=for-the-badge)](https://realrohanroy.github.io/UdyamManch-site/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success.svg?style=for-the-badge)](#)

> **Udyam Manch** is a modern, independent digital publication and startup discovery platform spotlighting Indian entrepreneurs, grassroots innovators, and emerging enterprises.

---

## 📖 Overview

**Udyam Manch** brings to light the untold stories behind India’s fastest-growing startups and generational businesses. Designed with an editorial magazine aesthetic, the platform combines in-depth founder journeys, case studies, industry trends, and an interactive curated directory of companies shaping the Indian economic landscape.

---

## ✨ Features

- 📰 **Editorial Magazine Layout**: Elegant typography featuring *Bricolage Grotesque* and *Newsreader* fonts, balanced white space, and newspaper-grade editorial reading experience.
- 🎙️ **Founder Stories & Interviews**: Deep-dive profiles, case studies, and candid interviews exploring the grit, pivots, and scaling strategies of founders.
- 🗂️ **Interactive Startup Directory**:
  - Filter companies by industry (Agritech, FinTech, Logistics, D2C, Mobility, CleanTech, Healthcare, etc.).
  - Filter by city/hub (Bengaluru, Mumbai, Delhi NCR, Pune, Ahmedabad, Hyderabad, etc.).
  - Real-time search by company name or founder.
- 📌 **Interactive Pinboard ("My Board")**:
  - Drag-and-drop interactive pinboard.
  - Pin stories, topics, and startup profiles.
  - Real-time pinned counter badge in the navigation header.
  - Save board state locally in the browser via `localStorage`.
  - Shareable board links.
- 🎯 **Interactive Guided Walkthrough**:
  - Multi-step interactive spotlight tour guiding new visitors through features.
  - Highlights pinning, navigation, and board management.
  - Accessible keyboard navigation (Arrow keys, Esc) and "Quick tour" replay button.
- 📸 **Instagram Updates Widget**:
  - Floating slide-in social story updates carousel linked to [@udyammanch](https://www.instagram.com/udyammanch/).
  - Interactive story navigation, touch swiping, direct profile link, and quick bubble minimize.
- 🌗 **Dark Mode & Light Mode**: Fluid theme toggle with persistent user preference storage and system preference auto-detection.
- ⚡ **Zero-Dependency Architecture**: Built entirely with clean, vanilla HTML5, CSS3, and JavaScript — lightning fast with zero build steps required.
- 📱 **Fully Responsive**: Optimized for desktops, tablets, and smartphones with fluid responsive grids and accessible focus states.
- 📨 **Newsletter & Feature Submissions**: Built-in subscription sections and editorial submission flow for startups wanting to get featured.

---

## 📂 Project Structure

```text
UdyamManch/
├── index.html                              # Primary entry point for static hosting (GitHub Pages)
├── udyam-manch-magazine-walk(1) copy.html  # Full standalone magazine & web application source
├── .gitignore                              # Git ignore rules
├── LICENSE                                 # MIT License
└── README.md                               # Project documentation
```

---

## 🚀 Getting Started

No build tools, bundlers, or package managers are required!

### Option 1: Open Directly in Browser
Simply double-click [`index.html`](index.html) or right-click and open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Run with a Local Web Server
For testing clipboard/sharing features and smooth routing:

**Using Python:**
```bash
# Python 3
python -m http.server 8000
```
Then visit [http://localhost:8000](http://localhost:8000).

**Using Node.js (npx):**
```bash
npx serve .
```

**Using VS Code Live Server:**
Right-click `index.html` and click **"Open with Live Server"**.

---

## 🌐 Deploying to GitHub Pages

1. In your GitHub repository, go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Branch**, select `main` (or `master`) and `/ (root)`.
3. Click **Save**.
4. Your website will be live at `https://<username>.github.io/<repo-name>/`.

---

## 🛠️ Technology Stack

- **Markup & Structure**: HTML5 (Semantic elements)
- **Styling**: Vanilla CSS3 (Custom properties, CSS Grid, Flexbox, responsive typography clamp)
- **Scripting**: Modern Vanilla JavaScript (ES6+, Hash-based SPA routing, Web Animations API, IntersectionObserver, Drag & Drop Pointer Events)
- **Fonts**: Google Fonts ([Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque), [Newsreader](https://fonts.google.com/specimen/Newsreader))

---

## 📝 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

---

*Crafted with pride for Indian entrepreneurship.* 🇮🇳
