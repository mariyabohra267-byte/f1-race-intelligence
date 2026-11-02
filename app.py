from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from config import Config
import json
import os

app = Flask(__name__)
app.config.from_object(Config)

# In-memory / session-backed custom URL storage for instant user preview
DEFAULT_CONFIG = {
    'dashboard_url': Config.TABLEAU_DASHBOARD_URL,
    'story_url': Config.TABLEAU_STORY_URL,
    'demo_dashboard_url': Config.TABLEAU_DEMO_DASHBOARD_URL,
    'demo_story_url': Config.TABLEAU_DEMO_STORY_URL,
}

@app.context_processor
def inject_global_data():
    """Make global configuration and ticker stats available to all Jinja templates."""
    custom_dash = session.get('custom_dashboard_url', app.config['TABLEAU_DASHBOARD_URL'])
    custom_story = session.get('custom_story_url', app.config['TABLEAU_STORY_URL'])
    return {
        'site_name': app.config['SITE_NAME'],
        'tableau_dashboard_url': custom_dash,
        'tableau_story_url': custom_story,
        'current_season': app.config['CURRENT_SEASON'],
        'ticker_items': [
            "Verstappen leads Championship by 47 points",
            "Monaco GP: Fastest Lap 1:12.492",
            "Ferrari leads avg pit stop speed in 2024 (2.14s)",
            "Red Bull Racing leads Constructor Championship",
            "Norris records career-best qualifying delta (-0.284s)",
            "Silverstone GP: 52 Laps completed with 0.8s gap to P2",
            "Mercedes upgrades deliver +0.3s race pace gain"
        ]
    }

@app.route('/')
def index():
    """Main landing page showcasing Hero, Metrics, Project Overview, Dimensions, and Embedded Dashboard."""
    kpis = [
        {"icon": "fa-trophy", "value": "897+", "label": "TOTAL RACE ENTRIES", "color": "#e10600"},
        {"icon": "fa-flag-checkered", "value": "33", "label": "CHAMPIONSHIP TITLES", "color": "#e10600"},
        {"icon": "fa-gauge-high", "value": "372", "label": "KM/H TOP SPEED", "color": "#e10600"},
        {"icon": "fa-chart-line", "value": "15+", "label": "KPIS VISUALIZED", "color": "#e10600"},
    ]
    
    hero_stats = [
        {"number": "75+", "label": "SEASONS ANALYZED"},
        {"number": "1K+", "label": "RACES COVERED"},
        {"number": "20", "label": "ACTIVE DRIVERS"},
        {"number": "10", "label": "CONSTRUCTORS"}
    ]

    dimensions = [
        {
            "id": "circuits",
            "icon": "fa-map",
            "title": "Circuit Analysis",
            "desc": "Track-by-track performance data from Monaco's tight streets to Monza's high-speed temple — every circuit has its own data fingerprint.",
            "badge": "24 CIRCUITS MAPPED"
        },
        {
            "id": "lap-time",
            "icon": "fa-stopwatch",
            "title": "Lap Time Breakdown",
            "desc": "Sector-by-sector time analysis for every driver across every session — qualifying, practice and race — at millisecond precision.",
            "badge": "MILLISECOND PRECISION"
        },
        {
            "id": "tire-strategy",
            "icon": "fa-circle-notch",
            "title": "Tire Strategy",
            "desc": "Soft, Medium, Hard, Inter, Wet — each compound tells a story. Analyze stint lengths, degradation rates, and optimal tire strategies.",
            "badge": "5 COMPOUND TYPES"
        },
        {
            "id": "head-to-head",
            "icon": "fa-users",
            "title": "Driver Head-to-Head",
            "desc": "Compare teammates and rivals across qualifying deltas, race pace, podiums, DNFs, and championship points throughout a season.",
            "badge": "20 DRIVERS COMPARED"
        },
        {
            "id": "points",
            "icon": "fa-chart-line",
            "title": "Points Progression",
            "desc": "Watch the championship unfold race-by-race with animated trajectories. Identify turning points that decided seasons in the final laps.",
            "badge": "SEASON-LONG VIEW"
        },
        {
            "id": "weather",
            "icon": "fa-cloud-showers-heavy",
            "title": "Weather & Safety Cars",
            "desc": "How weather conditions, Virtual Safety Cars, and full SC deployments affected race outcomes and championship battles across seasons.",
            "badge": "ALL SC INCIDENTS"
        }
    ]

    overview_features = [
        {
            "icon": "fa-globe",
            "title": "Global Race Overview",
            "desc": "Circuit-by-circuit analysis across all 24 Grand Prix locations with performance comparisons."
        },
        {
            "icon": "fa-user-astronaut",
            "title": "Driver Performance Metrics",
            "desc": "Lap times, qualifying pace, race pace, overtaking data and consistency analysis."
        },
        {
            "icon": "fa-car",
            "title": "Constructor Championship Battle",
            "desc": "Team-by-team points progression, reliability data, and strategic decisions."
        },
        {
            "icon": "fa-stopwatch-20",
            "title": "Pit Stop Strategy Analysis",
            "desc": "Tire degradation models, undercut/overcut opportunities, and optimal strategy windows."
        },
        {
            "icon": "fa-trophy",
            "title": "Championship Success Prediction",
            "desc": "Historical patterns and statistical models to forecast championship outcomes."
        }
    ]

    return render_template(
        'index.html',
        hero_stats=hero_stats,
        kpis=kpis,
        dimensions=dimensions,
        overview_features=overview_features
    )

@app.route('/dashboard')
def dashboard():
    """Dedicated Interactive Tableau Dashboard view with controls and filters."""
    return render_template('dashboard.html')

@app.route('/story')
def story():
    """Dedicated Interactive Tableau Story view with storyline points and analytical narrative."""
    story_points = [
        {
            "step": "1",
            "title": "Season Launch & Qualifying Dominance",
            "desc": "Analyzing aerodynamic upgrades and pole-position conversion rates across the opening rounds."
        },
        {
            "step": "2",
            "title": "Driver Head-to-Head & Reliability",
            "desc": "Investigating teammate qualifying margins, telemetry deltas, and mechanical DNF patterns."
        },
        {
            "step": "3",
            "title": "Pit Strategy & Degradation Cliffs",
            "desc": "How tire compound crossover windows and 2.1-second pit stops won and lost Grand Prix victories."
        },
        {
            "step": "4",
            "title": "Championship Decider & Point Trajectories",
            "desc": "Tracking the final 5 rounds where the Constructors and Drivers crowns were clinched."
        }
    ]
    return render_template('story.html', story_points=story_points)

@app.route('/drivers')
def drivers():
    """F1 Drivers telemetry, grid profiles, and head-to-head comparison."""
    drivers_data = [
        {"name": "Max Verstappen", "team": "Red Bull Racing", "number": 1, "points": 393, "wins": 8, "podiums": 12, "color": "#1e41ff", "img": "verstappen"},
        {"name": "Lando Norris", "team": "McLaren", "number": 4, "points": 331, "wins": 3, "podiums": 12, "color": "#ff8000", "img": "norris"},
        {"name": "Charles Leclerc", "team": "Ferrari", "number": 16, "points": 307, "wins": 3, "podiums": 11, "color": "#e8002d", "img": "leclerc"},
        {"name": "Oscar Piastri", "team": "McLaren", "number": 81, "points": 262, "wins": 2, "podiums": 7, "color": "#ff8000", "img": "piastri"},
        {"name": "Carlos Sainz", "team": "Ferrari", "number": 55, "points": 244, "wins": 2, "podiums": 7, "color": "#e8002d", "img": "sainz"},
        {"name": "George Russell", "team": "Mercedes", "number": 63, "points": 192, "wins": 2, "podiums": 3, "color": "#27f4d2", "img": "russell"},
        {"name": "Lewis Hamilton", "team": "Mercedes", "number": 44, "points": 190, "wins": 2, "podiums": 4, "color": "#27f4d2", "img": "hamilton"},
        {"name": "Sergio Perez", "team": "Red Bull Racing", "number": 11, "points": 151, "wins": 0, "podiums": 4, "color": "#1e41ff", "img": "perez"}
    ]
    return render_template('drivers.html', drivers=drivers_data)

@app.route('/insights')
def insights():
    """Race Intelligence Insights & Strategy Analysis."""
    return render_template('insights.html')

@app.route('/instructions')
def instructions():
    """Comprehensive visual guide explaining how to connect Tableau Dashboard & Story."""
    return render_template('instructions.html')

@app.route('/api/config', methods=['GET', 'POST'])
def api_config():
    """API endpoint to get or dynamically update Tableau Dashboard and Story URLs."""
    if request.method == 'POST':
        data = request.get_json() or {}
        new_dash = data.get('dashboard_url')
        new_story = data.get('story_url')
        if new_dash:
            session['custom_dashboard_url'] = new_dash.strip()
        if new_story:
            session['custom_story_url'] = new_story.strip()
        return jsonify({
            'status': 'success',
            'message': 'Tableau URLs updated successfully',
            'dashboard_url': session.get('custom_dashboard_url', app.config['TABLEAU_DASHBOARD_URL']),
            'story_url': session.get('custom_story_url', app.config['TABLEAU_STORY_URL'])
        })
    return jsonify({
        'dashboard_url': session.get('custom_dashboard_url', app.config['TABLEAU_DASHBOARD_URL']),
        'story_url': session.get('custom_story_url', app.config['TABLEAU_STORY_URL'])
    })

@app.route('/api/reset-config', methods=['POST'])
def api_reset_config():
    """Reset URLs to defaults."""
    session.pop('custom_dashboard_url', None)
    session.pop('custom_story_url', None)
    return jsonify({
        'status': 'success',
        'dashboard_url': app.config['TABLEAU_DASHBOARD_URL'],
        'story_url': app.config['TABLEAU_STORY_URL']
    })

@app.errorhandler(404)
def page_not_found(e):
    return render_template('index.html'), 404

if __name__ == '__main__':
    # Local development server
    port = int(os.environ.get('PORT', 5000))
    print(f"\n===========================================================")
    print(f"🏁 FORMULA 1 RACE INTELLIGENCE WEB APPLICATION")
    print(f"📍 Local Server running at: http://127.0.0.1:{port}")
    print(f"📊 Dashboard Route: http://127.0.0.1:{port}/dashboard")
    print(f"📖 Story Route:     http://127.0.0.1:{port}/story")
    print(f"📘 Guide & Help:    http://127.0.0.1:{port}/instructions")
    print(f"===========================================================\n")
    app.run(host='0.0.0.0', port=port, debug=True)
