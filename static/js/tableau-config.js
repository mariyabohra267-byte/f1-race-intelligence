/**
 * Tableau Embedding API v3 Controller & Configuration Manager
 * Formula 1 Race Intelligence Platform
 */

const TableauManager = {
    // Current active URLs
    dashboardUrl: '',
    storyUrl: '',

    init() {
        // Retrieve custom URLs from localStorage if present
        const savedDash = localStorage.getItem('f1_tableau_dashboard_url');
        const savedStory = localStorage.getItem('f1_tableau_story_url');

        const dashInput = document.getElementById('input-dashboard-url');
        const storyInput = document.getElementById('input-story-url');

        if (savedDash && dashInput) {
            dashInput.value = savedDash;
            this.dashboardUrl = savedDash;
        } else if (dashInput) {
            this.dashboardUrl = dashInput.value;
        }

        if (savedStory && storyInput) {
            storyInput.value = savedStory;
            this.storyUrl = savedStory;
        } else if (storyInput) {
            this.storyUrl = storyInput.value;
        }

        this.bindEvents();
        this.setupTabs();
        this.setupMockFilters();
    },

    bindEvents() {
        // Modal Open / Close
        const launcherBtn = document.getElementById('btn-open-config-modal');
        const modal = document.getElementById('config-modal');
        const closeBtn = document.getElementById('btn-close-modal');
        const cancelBtn = document.getElementById('btn-cancel-modal');
        const saveBtn = document.getElementById('btn-save-tableau-urls');
        const resetBtn = document.getElementById('btn-reset-defaults');

        if (launcherBtn && modal) {
            launcherBtn.addEventListener('click', () => {
                modal.classList.add('active');
            });
        }

        const closeModal = () => {
            if (modal) modal.classList.remove('active');
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }

        // Save & Connect URLs
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const dashVal = document.getElementById('input-dashboard-url').value.trim();
                const storyVal = document.getElementById('input-story-url').value.trim();

                if (dashVal) {
                    localStorage.setItem('f1_tableau_dashboard_url', dashVal);
                    this.dashboardUrl = dashVal;
                }
                if (storyVal) {
                    localStorage.setItem('f1_tableau_story_url', storyVal);
                    this.storyUrl = storyVal;
                }

                // Send to Flask backend session API
                fetch('/api/config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dashboard_url: dashVal,
                        story_url: storyVal
                    })
                }).catch(err => console.log('Session config sync:', err));

                // Update any active <tableau-viz> tags
                this.updateTableauVizSources();
                closeModal();

                // Show notification toast
                this.showToast('✅ Tableau URLs updated and connected successfully!');
            });
        }

        // Reset to Defaults
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                localStorage.removeItem('f1_tableau_dashboard_url');
                localStorage.removeItem('f1_tableau_story_url');

                fetch('/api/reset-config', { method: 'POST' })
                    .then(res => res.json())
                    .then(data => {
                        if (document.getElementById('input-dashboard-url')) {
                            document.getElementById('input-dashboard-url').value = data.dashboard_url;
                        }
                        if (document.getElementById('input-story-url')) {
                            document.getElementById('input-story-url').value = data.story_url;
                        }
                        this.dashboardUrl = data.dashboard_url;
                        this.storyUrl = data.story_url;
                        this.updateTableauVizSources();
                        closeModal();
                        this.showToast('🔄 Reset Tableau URLs to defaults.');
                    });
            });
        }

        // Fullscreen Toggle
        const btnFullscreen = document.getElementById('btn-toggle-fullscreen');
        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', () => {
                const embedWrap = document.getElementById('tableau-embed-frame') || document.querySelector('.window-mockup-body');
                if (embedWrap) {
                    embedWrap.classList.toggle('is-fullscreen');
                    if (embedWrap.classList.contains('is-fullscreen')) {
                        btnFullscreen.innerHTML = '<i class="fa-solid fa-compress"></i> Exit Fullscreen';
                    } else {
                        btnFullscreen.innerHTML = '<i class="fa-solid fa-expand"></i> Fullscreen';
                    }
                }
            });
        }

        // Open in Tableau Public Direct
        const btnOpenTableau = document.getElementById('btn-open-tableau-public');
        if (btnOpenTableau) {
            btnOpenTableau.addEventListener('click', () => {
                const url = this.dashboardUrl || 'https://public.tableau.com';
                window.open(url, '_blank');
            });
        }
    },

    updateTableauVizSources() {
        const dashViz = document.getElementById('tableau-dashboard-viz');
        if (dashViz && this.dashboardUrl) {
            dashViz.setAttribute('src', this.dashboardUrl);
        }

        const storyViz = document.getElementById('tableau-story-viz');
        if (storyViz && this.storyUrl) {
            storyViz.setAttribute('src', this.storyUrl);
        }
    },

    setupTabs() {
        const tabLive = document.getElementById('tab-btn-live');
        const tabMock = document.getElementById('tab-btn-mock');
        const liveContainer = document.getElementById('view-container-live');
        const mockContainer = document.getElementById('view-container-mock');

        if (tabLive && tabMock && liveContainer && mockContainer) {
            tabLive.addEventListener('click', () => {
                tabLive.classList.add('active');
                tabMock.classList.remove('active');
                liveContainer.style.display = 'block';
                mockContainer.style.display = 'none';
            });

            tabMock.addEventListener('click', () => {
                tabMock.classList.add('active');
                tabLive.classList.remove('active');
                liveContainer.style.display = 'none';
                mockContainer.style.display = 'block';
            });
        }
    },

    setupMockFilters() {
        // Interactive filter behavior on the mock dashboard (Screenshot 5)
        const filterYear = document.getElementById('mock-filter-year');
        const filterDnf = document.getElementById('mock-filter-dnf');
        const paramTopN = document.getElementById('mock-param-topn');

        const applyFilters = () => {
            const yr = filterYear ? filterYear.value : 'All';
            const dnf = filterDnf ? filterDnf.value : 'All';
            const topN = paramTopN ? parseInt(paramTopN.value) || 10 : 10;

            // Highlight changes subtly
            const statTeams = document.getElementById('mock-stat-teams');
            const statRaces = document.getElementById('mock-stat-races');
            if (yr !== 'All' && statRaces) {
                statRaces.textContent = '24';
            } else if (statRaces) {
                statRaces.textContent = '6,464';
            }
        };

        if (filterYear) filterYear.addEventListener('change', applyFilters);
        if (filterDnf) filterDnf.addEventListener('change', applyFilters);
        if (paramTopN) paramTopN.addEventListener('input', applyFilters);
    },

    showToast(message) {
        let toast = document.getElementById('f1-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'f1-toast';
            toast.style.cssText = `
                position: fixed;
                top: 85px;
                right: 24px;
                background: #171b26;
                border: 1px solid #e10600;
                color: #ffffff;
                padding: 12px 20px;
                border-radius: 6px;
                font-family: 'Rajdhani', sans-serif;
                font-weight: 700;
                font-size: 14px;
                letter-spacing: 1px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.6), 0 0 15px rgba(225,6,0,0.4);
                z-index: 99999;
                transition: opacity 0.3s ease, transform 0.3s ease;
                transform: translateY(-10px);
                opacity: 0;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
        }, 3500);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    TableauManager.init();
});
