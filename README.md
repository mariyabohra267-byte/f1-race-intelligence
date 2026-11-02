# 🏁 Formula 1 Race Intelligence Platform
### Interactive Tableau Dashboard & Story Web Integration with Flask

A high-performance Formula 1 telemetry and race analytics platform built with **Flask** and **Tableau Public Embedding API v3**. Designed with a dark high-tech F1 aesthetic, neon telemetry circuits, and responsive glassmorphic cards matching the official F1 visual identity.

---

## 🚀 Quick Start Guide

### 1. Requirements
- Python 3.8+ (from [python.org](https://www.python.org/downloads/) - ensure "Add Python to PATH" is checked)
- Web Browser (Chrome, Edge, Firefox)
- Internet connection (to fetch Tableau Public visualizations and fonts)

### 2. Installation
Open PowerShell or Command Prompt in the project directory:
```bash
cd "C:\Users\admin\.gemini\antigravity\scratch\f1-race-intelligence"
pip install -r requirements.txt
```

### 3. Launching the App
Double-click `run.bat` or run:
```bash
python app.py
```
Open your browser and navigate to:
👉 **`http://127.0.0.1:5000`**

---

## 📘 Step-by-Step: Connecting Your Tableau Dashboard & Story

### Step 1: Create Your Workbook in Tableau
1. Open your Formula 1 data in **Tableau Desktop** or **Tableau Public Desktop**.
2. Build your sheets (e.g. Driver Leaderboard, Team Rankings, Reliability Analysis, Geographic Circuit Distribution).
3. Combine them into a **Dashboard** (e.g. named `RaceIntelligenceDashboard`).
4. (Optional) Create a **Story** by clicking `New Story` at the bottom and dragging dashboards or sheets into sequential story points to explain the race narrative (e.g. named `RaceIntelligenceStory`).

### Step 2: Publish to Tableau Public
1. In the Tableau menu bar, click:
   `Server` ➔ `Tableau Public` ➔ `Save to Tableau Public As...`
2. Sign in to your free Tableau Public account.
3. Choose a title (e.g. `Formula 1 Race Intelligence`) and click **Save**.
4. Tableau will upload the workbook and open it in your browser at `https://public.tableau.com/views/...`.

### Step 3: Get Your Embed URLs
On your Tableau Public page:
1. Click the **Share** button (the three connected dots icon at the bottom right).
2. Copy the **Link** field:
   - Dashboard Link: `https://public.tableau.com/views/[WorkbookName]/[DashboardName]`
   - Story Link: `https://public.tableau.com/views/[WorkbookName]/[StoryName]`

### Step 4: Connect to the Flask Application
You can connect your URLs using either of the following methods:

#### Method A: Live in the Browser (No Code Required)
1. Launch the web application and open `http://127.0.0.1:5000`.
2. Click the floating **⚙ Connect Tableau** button at the bottom-right corner.
3. Paste your **Dashboard URL** and **Story URL**.
4. Click **Apply & Connect**. The application will instantly update and load your live Tableau visuals!

#### Method B: Permanent Configuration in `config.py`
Open `config.py` in the project root and update the default URLs:
```python
class Config:
    # Tableau Public Embed URLs
    TABLEAU_DASHBOARD_URL = 'https://public.tableau.com/views/YOUR_WORKBOOK/YOUR_DASHBOARD'
    TABLEAU_STORY_URL     = 'https://public.tableau.com/views/YOUR_WORKBOOK/YOUR_STORY'
```

---

## 🏗️ Project Architecture

```
f1-race-intelligence/
├── app.py                      # Flask backend application with routes & session sync
├── config.py                   # Centralized configuration (Tableau URLs, site metadata)
├── requirements.txt            # Python dependencies (Flask, etc.)
├── run.bat                     # Windows Command Prompt 1-click launcher
├── run.ps1                     # Windows PowerShell launcher
├── README.md                   # Complete documentation & instructions
├── static/
│   ├── css/
│   │   ├── style.css           # F1 dark-theme styles, glassmorphism, glowing badges
│   │   └── tableau-embed.css   # Responsive Tableau Embedding API v3 styles
│   └── js/
│       ├── main.js             # Navbar, counters, and smooth scrolling
│       ├── circuit.js          # Animated SVG race circuit telemetry track
│       └── tableau-config.js   # Tableau API controller, URL modal, mock filters
└── templates/
    ├── base.html               # Base layout with F1 header, nav, live ticker & footer
    ├── index.html              # Main homepage (Hero, KPIs, Overview, Dimensions, Embed)
    ├── dashboard.html          # Dedicated full-page interactive Tableau Dashboard
    ├── story.html              # Dedicated full-page interactive Tableau Story
    ├── drivers.html            # F1 Grid driver profiles & telemetry cards
    ├── insights.html           # Pit stop strategies & tire degradation models
    └── instructions.html       # Visual in-app guide on connecting Tableau
```

---

## 🌐 Routes Overview

| Route | Template | Description |
|---|---|---|
| `/` | `index.html` | Hero, KPIs, Track map, Dimensions, and Embedded Viz |
| `/dashboard` | `dashboard.html` | Dedicated fullscreen-capable Tableau Dashboard page |
| `/story` | `story.html` | Dedicated Tableau Story walkthrough with story steps |
| `/drivers` | `drivers.html` | F1 Grid profiles and head-to-head telemetry stats |
| `/insights` | `insights.html` | Strategic pit stop, tire degradation, and SC insights |
| `/instructions` | `instructions.html` | In-app step-by-step visual Tableau connection guide |
| `/api/config` | JSON API | Dynamic GET / POST endpoint to update Tableau URLs |

---

## 💡 Passing Custom Parameters & Filters to Tableau

With Tableau Embedding API v3, you can easily pass filter parameters directly in your HTML or via URL parameters:

```html
<tableau-viz 
    id="tableauViz"
    src="{{ tableau_dashboard_url }}?Driver=Max%20Verstappen&Year=2024"
    toolbar="bottom"
    hide-tabs="true">
</tableau-viz>
```

Or dynamically via JavaScript:
```javascript
const viz = document.getElementById('tableau-dashboard-viz');
viz.sheet.applyFilterAsync("Driver", ["Lewis Hamilton"], "replace");
```

---

## 🛠️ Troubleshooting

- **Tableau says "Refused to connect" or white box**: Ensure your workbook is saved to **Tableau Public** (publicly viewable), or that your Tableau Server / Tableau Cloud allows embedding (Clickjack protection disabled for your domain).
- **Embedded view is cut off**: The CSS includes `tableau-embed.css` which automatically handles 100% width and dynamic height. Use the **Fullscreen** button on the toolbar for an expansive presentation.
