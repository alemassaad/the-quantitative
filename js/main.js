// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Hexagonal dot grid animation
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
let width, height, scrollY = 0;
const size = 30;
let time = 0;
const twinkles = {};

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    time += 0.016;
    const offset = scrollY * 0.025;

    const hexHeight = size * 2;
    const hexWidth = Math.sqrt(3) * size;
    const vertDist = hexHeight * 0.75;

    const cols = Math.ceil(width / hexWidth) + 2;
    const rows = Math.ceil(height / vertDist) + 10;

    for (let row = -5; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
            const x = col * hexWidth + (row % 2) * (hexWidth / 2);
            const y = row * vertDist - offset;

            const key = `${col},${row}`;

            // Slow, subtle twinkle
            if (!twinkles[key] || twinkles[key].end < time) {
                if (Math.random() < 0.0001) {
                    twinkles[key] = { start: time, end: time + 3 + Math.random() * 3 };
                }
            }

            let twinkle = 0;
            if (twinkles[key] && time < twinkles[key].end) {
                const progress = (time - twinkles[key].start) / (twinkles[key].end - twinkles[key].start);
                twinkle = Math.sin(progress * Math.PI) * 0.12;
            }

            // Pulsing based on distance and scroll
            const dist = Math.sqrt(Math.pow(x - width/2, 2) + Math.pow(y - height/2, 2));
            const pulse = Math.sin(dist * 0.008 - scrollY * 0.012) * 0.5 + 0.5;

            // Radial vignette - center is brighter, edges fade
            const maxDist = Math.sqrt(Math.pow(width/2, 2) + Math.pow(height/2, 2));
            const vignette = 1 - (dist / maxDist) * 0.6;

            const radius = 2 + pulse * 0.4;
            const opacity = (0.08 + pulse * 0.06 + twinkle) * vignette;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            ctx.fill();
        }
    }

    requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

resize();
draw();
