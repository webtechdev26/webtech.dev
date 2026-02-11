// Initialize Lucide Icons
lucide.createIcons();

// --- ROUTER LOGIC ---
function router() {
  const hash = window.location.hash || '#/';
  const cleanHash = hash.replace('#', '');
  
  // Hide all sections
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.add('hidden');
  });

  // Determine which section to show
  let sectionId = 'page-home';
  
  if (cleanHash === '/' || cleanHash === '') sectionId = 'page-home';
  else if (cleanHash === '/servicios') sectionId = 'page-servicios';
  else if (cleanHash === '/portfolio') sectionId = 'page-portfolio';
  else if (cleanHash === '/nosotros') sectionId = 'page-nosotros';
  else if (cleanHash === '/contacto') sectionId = 'page-contacto';
  else {
    // Handle sub-pages like /servicios/desarrollo-web -> page-servicios-desarrollo-web
    const subPageId = 'page-' + cleanHash.substring(1).replace(/\//g, '-');
    if (document.getElementById(subPageId)) {
      sectionId = subPageId;
    }
  }

  // Show the target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  // Update Active Link in Navbar
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('text-cyber-blue');
    link.classList.add('text-gray-400');
    if (link.getAttribute('href') === hash || (hash === '' && link.getAttribute('href') === '#/')) {
      link.classList.add('text-cyber-blue');
      link.classList.remove('text-gray-400');
    }
  });

  // Re-trigger scroll animations
  initScrollObserver();
}

// Listen for hash changes
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// --- MOBILE MENU ---
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
});

// --- SCROLL ANIMATIONS (Intersection Observer) ---
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
}

// --- PARTICLE BACKGROUND ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}

function initParticles() {
  particles = [];
  const particleCount = Math.min(window.innerWidth / 10, 100);
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      color: Math.random() > 0.5 ? '#00f0ff' : '#7000ff',
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw connections
  ctx.lineWidth = 0.5;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 - distance / 1500})`;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw particles
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });

  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
draw();
