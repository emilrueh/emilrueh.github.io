const isMobile = window.innerWidth <= 768;
const container = document.querySelector(isMobile ? '#binary-hero' : '#binary-about');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
container.appendChild(canvas);

const binary = "01";
const letters = "ABCDEFGHIKLMN PQRSTUVWXYZ";
const numbers = "23456789";

const fontSize = 16;
const fontWeight = 100;
const lineHeight = 14;
const charWidth = 9;
const font = `${fontWeight} ${fontSize}px "Chivo Mono"`;

const colorNormal = 'rgba(255, 255, 255, 0.6)';
const colorHighlight = 'rgba(255, 255, 255, 0.7)';

let lastUpdate = 0;
const updateInterval = 42;
let dpr = window.devicePixelRatio || 1;

function resize() {
    const rect = container.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;

    // Set actual canvas size in memory (scaled for high-DPI)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Set display size via CSS
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    // Reset and scale context to match DPI
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = font;
}

function draw(allowHighlights = false) {
    // Use CSS dimensions, not canvas buffer dimensions
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const cols = Math.floor(width / charWidth);
    const rows = Math.floor(height / lineHeight);

    ctx.clearRect(0, 0, width, height);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const isHighlight = allowHighlights && Math.random() < 0.001;
            let char;

            if (isHighlight) {
                const alphanumeric = Math.random() < 0.5 ? letters : numbers;
                char = alphanumeric[Math.floor(Math.random() * alphanumeric.length)];
                ctx.fillStyle = colorHighlight;
            } else {
                char = binary[Math.floor(Math.random() * 2)];
                ctx.fillStyle = colorNormal;
            }

            ctx.fillText(char, col * charWidth, row * lineHeight + fontSize);
        }
    }
}

// Initial render (wait for font to load)
document.fonts.load(font).then(() => {
    resize();
    draw();
});

// Throttled mouse move updates (desktop only)
if (window.innerWidth > 768) {
    const logoImg = document.querySelector('.about-wrapper__image img');

    function isOverLogo(e) {
        if (!logoImg) return false;
        const rect = logoImg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const radius = Math.min(rect.width, rect.height) * 0.47;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        return (dx * dx + dy * dy) <= (radius * radius);
    }

    document.addEventListener('mousemove', (e) => {
        if (isOverLogo(e)) return;
        const now = Date.now();
        if (now - lastUpdate >= updateInterval) {
            lastUpdate = now;
            draw(true);
        }
    });
}

// Handle resize (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        resize();
        draw();
    }, 150);
});
