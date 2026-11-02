/**
 * Animated SVG Telemetry Race Track (Monza / Circuit Layout)
 * Matches the track visual from Screenshot 3
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvasContainer = document.getElementById('circuit-container');
    if (!canvasContainer) return;

    // SVG circuit template with animated telemetry blips
    const circuitSVG = `
    <svg viewBox="0 0 500 320" class="track-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <!-- Glowing filters -->
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <filter id="glow-yellow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#2a2e3a" />
                <stop offset="50%" stop-color="#3d4354" />
                <stop offset="100%" stop-color="#2a2e3a" />
            </linearGradient>
            <linearGradient id="drsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#10b981" />
                <stop offset="100%" stop-color="#059669" />
            </linearGradient>
        </defs>

        <!-- Background grid dots -->
        <g opacity="0.15">
            ${Array.from({length: 12}).map((_, i) => 
                Array.from({length: 8}).map((_, j) => 
                    `<circle cx="${40 + i * 38}" cy="${30 + j * 36}" r="1" fill="#fff" />`
                ).join('')
            ).join('')}
        </g>

        <!-- Track Outer Boundary -->
        <path id="f1-circuit-path" 
            d="M 120 250 
               L 410 250 
               A 35 35 0 0 0 445 215 
               L 445 140 
               A 35 35 0 0 0 410 105 
               L 330 105 
               A 30 30 0 0 1 305 85 
               L 280 65 
               A 25 25 0 0 0 255 55 
               L 180 55 
               A 45 45 0 0 0 135 100 
               L 135 130 
               A 35 35 0 0 1 100 165 
               L 85 165 
               A 45 45 0 0 0 40 210 
               L 40 215 
               A 35 35 0 0 0 75 250 
               Z" 
            fill="none" 
            stroke="#1d222e" 
            stroke-width="26" 
            stroke-linejoin="round"
            stroke-linecap="round"
        />

        <!-- Track Inner Asphalt Line -->
        <path 
            d="M 120 250 
               L 410 250 
               A 35 35 0 0 0 445 215 
               L 445 140 
               A 35 35 0 0 0 410 105 
               L 330 105 
               A 30 30 0 0 1 305 85 
               L 280 65 
               A 25 25 0 0 0 255 55 
               L 180 55 
               A 45 45 0 0 0 135 100 
               L 135 130 
               A 35 35 0 0 1 100 165 
               L 85 165 
               A 45 45 0 0 0 40 210 
               L 40 215 
               A 35 35 0 0 0 75 250 
               Z" 
            fill="none" 
            stroke="#2d3342" 
            stroke-width="14" 
            stroke-linejoin="round"
        />

        <!-- Track Racing Centerline (Dashed) -->
        <path id="racing-line"
            d="M 120 250 
               L 410 250 
               A 35 35 0 0 0 445 215 
               L 445 140 
               A 35 35 0 0 0 410 105 
               L 330 105 
               A 30 30 0 0 1 305 85 
               L 280 65 
               A 25 25 0 0 0 255 55 
               L 180 55 
               A 45 45 0 0 0 135 100 
               L 135 130 
               A 35 35 0 0 1 100 165 
               L 85 165 
               A 45 45 0 0 0 40 210 
               L 40 215 
               A 35 35 0 0 0 75 250 
               Z" 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.25)" 
            stroke-dasharray="4,6" 
            stroke-width="1.5" 
            stroke-linejoin="round"
        />

        <!-- DRS Zone Detection Line (Green) -->
        <path 
            d="M 150 250 L 260 250" 
            fill="none" 
            stroke="url(#drsGrad)" 
            stroke-width="4" 
            stroke-linecap="round"
        />
        <text x="180" y="242" fill="#10b981" font-family="'Rajdhani', sans-serif" font-size="9" font-weight="700" letter-spacing="1">DRS ZONE 1</text>

        <!-- Speed Trap & Start/Finish -->
        <line x1="120" y1="238" x2="120" y2="262" stroke="#e10600" stroke-width="3" />
        <text x="105" y="270" fill="#e10600" font-family="'Rajdhani', sans-serif" font-size="9" font-weight="700">START / FINISH</text>

        <!-- Turn Annotations -->
        <text x="452" y="180" fill="#71717a" font-family="'Rajdhani', sans-serif" font-size="9">T4</text>
        <text x="260" y="45" fill="#71717a" font-family="'Rajdhani', sans-serif" font-size="9">T8 (ASCARI)</text>
        <text x="30" y="160" fill="#71717a" font-family="'Rajdhani', sans-serif" font-size="9">T1 (PARABOLICA)</text>

        <!-- Telemetry Car Markers (Racing Animated Dots) -->
        <!-- Car 1: P1 Red Bull / Red Glow Leader -->
        <circle id="car-leader" r="7" fill="#e10600" filter="url(#glow-red)" />
        
        <!-- Car 2: McLaren / Papaya Orange -->
        <circle id="car-p2" r="5" fill="#f59e0b" filter="url(#glow-yellow)" />
        
        <!-- Car 3: Ferrari / Yellow Telemetry Blip -->
        <circle id="car-p3" r="5" fill="#fbbf24" />

        <!-- Car 4: Mercedes / Cyan Telemetry Blip -->
        <circle id="car-p4" r="5" fill="#06b6d4" />
    </svg>
    `;

    canvasContainer.innerHTML = circuitSVG;

    // Animate cars around the SVG path
    const path = document.getElementById('racing-line');
    const carLeader = document.getElementById('car-leader');
    const carP2 = document.getElementById('car-p2');
    const carP3 = document.getElementById('car-p3');
    const carP4 = document.getElementById('car-p4');

    if (!path) return;

    const pathLength = path.getTotalLength();
    let startTimestamp = null;
    const lapTimeSeconds = 14; // Time for leader to complete 1 circuit lap

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = ((timestamp - startTimestamp) / 1000) / lapTimeSeconds;

        // Offsets for different cars in race order
        const posLeader = (progress % 1) * pathLength;
        const posP2 = ((progress - 0.08 + 1) % 1) * pathLength;
        const posP3 = ((progress - 0.22 + 1) % 1) * pathLength;
        const posP4 = ((progress - 0.38 + 1) % 1) * pathLength;

        const ptLeader = path.getPointAtLength(posLeader);
        const ptP2 = path.getPointAtLength(posP2);
        const ptP3 = path.getPointAtLength(posP3);
        const ptP4 = path.getPointAtLength(posP4);

        if (carLeader) {
            carLeader.setAttribute('cx', ptLeader.x);
            carLeader.setAttribute('cy', ptLeader.y);
        }
        if (carP2) {
            carP2.setAttribute('cx', ptP2.x);
            carP2.setAttribute('cy', ptP2.y);
        }
        if (carP3) {
            carP3.setAttribute('cx', ptP3.x);
            carP3.setAttribute('cy', ptP3.y);
        }
        if (carP4) {
            carP4.setAttribute('cx', ptP4.x);
            carP4.setAttribute('cy', ptP4.y);
        }

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
});
