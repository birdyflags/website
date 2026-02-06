var pos = { x: -100, y: -100 };
var outerPos = { x: -100, y: -100 };
var hovering = false;
var cursorInner = document.getElementById('cursorInner');
var cursorOuter = document.getElementById('cursorOuter');
var trails = [
    document.getElementById('trail1'),
    document.getElementById('trail2'),
    document.getElementById('trail3')
];

document.addEventListener('mousemove', function(e) {
    pos.x = e.clientX;
    pos.y = e.clientY;
});

document.addEventListener('mouseover', function(e) {
    var el = e.target;
    hovering = !!(el.closest('a') || el.closest('button') || el.closest('.feature-card') || el.closest('.stat-card'));
});

function animateCursor() {
    var lerp = 0.12;
    outerPos.x += (pos.x - outerPos.x) * lerp;
    outerPos.y += (pos.y - outerPos.y) * lerp;

    if (cursorInner) {
        cursorInner.style.transform = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
    }
    if (cursorOuter) {
        var scale = hovering ? 1.8 : 1;
        cursorOuter.style.transform = 'translate(' + outerPos.x + 'px, ' + outerPos.y + 'px) scale(' + scale + ')';
        cursorOuter.style.opacity = hovering ? '0.6' : '0.35';
    }
    trails.forEach(function(el, i) {
        if (!el) return;
        var delay = (i + 1) * 0.06;
        var tx = outerPos.x + (pos.x - outerPos.x) * (1 - delay * 2);
        var ty = outerPos.y + (pos.y - outerPos.y) * (1 - delay * 2);
        el.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
        el.style.opacity = (0.15 - i * 0.04).toString();
    });
    requestAnimationFrame(animateCursor);
}
requestAnimationFrame(animateCursor);

var canvas = document.getElementById('particleCanvas');
var ctx = canvas.getContext('2d');
var w, h;
var particles = [];
var particleCount = 60;

function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

function initParticles() {
    particles = [];
    for (var i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 1.5 + 0.5
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(249, 115, 22, 0.3)';
        ctx.fill();
        for (var j = i + 1; j < particles.length; j++) {
            var p2 = particles[j];
            var dx = p.x - p2.x;
            var dy = p.y - p2.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = 'rgba(249, 115, 22, ' + (0.08 * (1 - dist / 150)) + ')';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', function() {
    resizeCanvas();
    initParticles();
});
resizeCanvas();
initParticles();
requestAnimationFrame(drawParticles);

window.addEventListener('scroll', function() {
    var nav = document.getElementById('siteNav');
    if (window.scrollY > 40) {
        nav.classList.add('nav-scrolled');
    } else {
        nav.classList.remove('nav-scrolled');
    }
});

var revealEls = document.querySelectorAll('.reveal');
var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(function(el) { revealObserver.observe(el); });

var tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width / 2;
        var cy = rect.height / 2;
        var rotateX = ((y - cy) / cy) * -8;
        var rotateY = ((x - cx) / cx) * 8;
        card.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(10px)';
        card.style.setProperty('--glow-x', (x / rect.width * 100) + '%');
        card.style.setProperty('--glow-y', (y / rect.height * 100) + '%');
    });
    card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

function openModal() {
    document.getElementById('discordModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('discordModal').style.display = 'none';
}

function joinDiscord() {
    window.open('https://discord.gg/jams5wjBGb', '_blank', 'noopener');
    closeModal();
}

document.getElementById('discordModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});
