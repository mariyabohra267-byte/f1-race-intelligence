import os

class Config:
    """Application configuration for Formula 1 Race Intelligence."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'f1-race-intelligence-secret-key-2026')
    
    # Tableau Public Embed URLs
    # Replace these with your own published Tableau Public Dashboard and Story links
    TABLEAU_DASHBOARD_URL = os.environ.get(
        'TABLEAU_DASHBOARD_URL', 
        'https://public.tableau.com/views/Formula1RaceIntelligenceDashboard/RaceIntelligenceDashboard'
    )
    
    TABLEAU_STORY_URL = os.environ.get(
        'TABLEAU_STORY_URL', 
        'https://public.tableau.com/views/Formula1ChampionshipStory/RaceIntelligenceStory'
    )
    
    # Alternative popular public F1 dashboard as active demo if custom not yet set
    TABLEAU_DEMO_DASHBOARD_URL = 'https://public.tableau.com/views/Formula1DataVisualisation/F1Dashboard'
    TABLEAU_DEMO_STORY_URL = 'https://public.tableau.com/views/Formula1HistoryStory/F1Story'

    # Site Metadata
    SITE_NAME = 'Formula 1 Race Intelligence'
    SITE_DESCRIPTION = 'Interactive Tableau dashboards and race analytics embedded in a Flask web application.'
    CURRENT_SEASON = '2024-2026'
