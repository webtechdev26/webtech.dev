// Initialize Lucide Icons
lucide.createIcons();

// --- ROUTER LOGIC ---
function router() {
  const hash = window.location.hash || '#/';
  const cleanHash = hash.replace('#', '');

  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.add('hidden');
  });

  let sectionId = 'page-home';

  if (cleanHash === '/' || cleanHash === '') sectionId = 'page-home';
  else if (cleanHash === '/servicios') sectionId = 'page-servicios';
  else if (cleanHash === '/portfolio') sectionId = 'page-portfolio';
  else if (cleanHash === '/nosotros') sectionId = 'page-nosotros';
  else if (cleanHash === '/contacto') sectionId = 'page-contacto';
  else {
    const subPageId = 'page-' + cleanHash.substring(1).replace(/\//g, '-');
    if (document.getElementById(subPageId)) {
      sectionId = subPageId;
    }
  }

  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    window.scrollTo(0, 0);
  }

  lucide.createIcons();

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('text-cyber-blue');
    link.classList.add('text-gray-400');
    if (link.getAttribute('href') === hash || (hash === '' && link.getAttribute('href') === '#/')) {
      link.classList.add('text-cyber-blue');
      link.classList.remove('text-gray-400');
    }
  });

  initScrollObserver();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// --- MOBILE MENU ---
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
});

// --- SCROLL ANIMATIONS ---
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

// --- SELECTOR DE SERVICIOS DINÁMICO ---
document.addEventListener('change', function (e) {
  if (e.target && e.target.id === 'select-categoria') {
    const subservicios = {
      'desarrollo-web': [
        { value: 'Web Esencial', label: 'Desarrollo Web Esencial' },
        { value: 'Web Pro', label: 'Desarrollo Web Pro' },
        { value: 'Web Premium', label: 'Desarrollo Web Premium' },
      ],
      'inteligencia-artificial': [
        { value: 'Chatbot IA', label: 'Chatbot IA' },
      ],
      'web-ia': [
        { value: 'Web Esencial + Chatbot', label: 'Web Esencial + Chatbot' },
        { value: 'Web Pro + Chatbot', label: 'Web Pro + Chatbot' },
        { value: 'Web Premium + Chatbot', label: 'Web Premium + Chatbot' },
      ],
      'mantenimiento': [
        { value: 'Mantenimiento Web', label: 'Mantenimiento Web' },
      ],
    };

    const opciones = subservicios[e.target.value] || [];
    const selectSubservicio = document.getElementById('select-subservicio');
    const subservicioWrapper = document.getElementById('subservicio-wrapper');

    selectSubservicio.innerHTML = '<option value="" disabled selected>Selecciona un plan...</option>';
    opciones.forEach(op => {
      const option = document.createElement('option');
      option.value = op.value;
      option.textContent = op.label;
      selectSubservicio.appendChild(option);
    });

    subservicioWrapper.classList.remove('hidden');

    if (opciones.length === 1) {
      selectSubservicio.value = opciones[0].value;
    }
  }
});

// --- CONTACT FORM ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const btnSpinner = document.getElementById('btn-spinner');

    btn.disabled = true;
    btnText.textContent = 'Enviando...';
    btnIcon.classList.add('hidden');
    btnSpinner.classList.remove('hidden');

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        contactForm.classList.add('hidden');
        const successMsg = document.getElementById('success-msg');
        successMsg.classList.remove('hidden');
        lucide.createIcons();
      } else {
        throw new Error('Error al enviar');
      }
    } catch (err) {
      btnText.textContent = 'Error, inténtalo de nuevo';
      btnIcon.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
      btn.disabled = false;
    }
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

// --- LANGUAGE SWITCHER ---
const translations = {
  es: {
    nav_servicios: 'Servicios',
    nav_portfolio: 'Portfolio',
    nav_nosotros: 'Nosotros',
    nav_start: 'Start Project',
    hero_badge: 'Innovación Digital 2026',
    hero_title1: 'CONSTRUIMOS TU',
    hero_title2: 'FUTURO DIGITAL',
    hero_sub: 'Fusionamos desarrollo web de vanguardia con inteligencia artificial para crear experiencias digitales que transforman negocios.',
    hero_btn1: 'Solicitar Presupuesto',
    hero_btn2: 'Explorar Servicios',
    contact_badge: 'Hablemos',
    contact_title1: 'Creemos el',
    contact_title2: 'Futuro Juntos',
    contact_sub: '¿Tienes un proyecto en mente? Cuéntanos y te respondemos en menos de 24h.',
    contact_btn: 'Enviar Mensaje',
    contact_success_title: '¡Mensaje enviado!',
    contact_success_sub: 'Gracias por contactarnos. Te responderemos en menos de 24 horas.',
    contact_success_btn: 'Enviar otro mensaje',
    form_nombre: 'Nombre *',
    form_telefono: 'Teléfono',
    form_email: 'Email *',
    form_servicio: 'Servicio *',
    form_plan: 'Plan *',
    form_mensaje: 'Mensaje *',
    form_placeholder_nombre: 'Tu nombre',
    form_placeholder_telefono: '+34 600 000 000',
    form_placeholder_email: 'tu@email.com',
    form_placeholder_servicio: 'Selecciona un servicio...',
    form_placeholder_plan: 'Selecciona un plan...',
    form_placeholder_mensaje: 'Cuéntanos sobre tu proyecto...',
  },
  en: {
    nav_servicios: 'Services',
    nav_portfolio: 'Portfolio',
    nav_nosotros: 'About',
    nav_start: 'Start Project',
    hero_badge: 'Digital Innovation 2026',
    hero_title1: 'WE BUILD YOUR',
    hero_title2: 'DIGITAL FUTURE',
    hero_sub: 'We merge cutting-edge web development with artificial intelligence to create digital experiences that transform businesses.',
    hero_btn1: 'Request a Quote',
    hero_btn2: 'Explore Services',
    contact_badge: "Let's Talk",
    contact_title1: "Let's Build the",
    contact_title2: 'Future Together',
    contact_sub: 'Have a project in mind? Tell us and we will get back to you within 24h.',
    contact_btn: 'Send Message',
    contact_success_title: 'Message sent!',
    contact_success_sub: 'Thank you for reaching out. We will reply within 24 hours.',
    contact_success_btn: 'Send another message',
    form_nombre: 'Name *',
    form_telefono: 'Phone',
    form_email: 'Email *',
    form_servicio: 'Service *',
    form_plan: 'Plan *',
    form_mensaje: 'Message *',
    form_placeholder_nombre: 'Your name',
    form_placeholder_telefono: '+34 600 000 000',
    form_placeholder_email: 'you@email.com',
    form_placeholder_servicio: 'Select a service...',
    form_placeholder_plan: 'Select a plan...',
    form_placeholder_mensaje: 'Tell us about your project...',
  },
  ca: {
    nav_servicios: 'Serveis',
    nav_portfolio: 'Portfolio',
    nav_nosotros: 'Nosaltres',
    nav_start: 'Start Project',
    hero_badge: 'Innovació Digital 2026',
    hero_title1: 'CONSTRUÏM EL TEU',
    hero_title2: 'FUTUR DIGITAL',
    hero_sub: 'Fusionem desenvolupament web d\'avantguarda amb intel·ligència artificial per crear experiències digitals que transformen negocis.',
    hero_btn1: 'Sol·licitar Pressupost',
    hero_btn2: 'Explorar Serveis',
    contact_badge: 'Parlem',
    contact_title1: 'Creem el',
    contact_title2: 'Futur Junts',
    contact_sub: 'Tens un projecte en ment? Explica\'ns-ho i et responem en menys de 24h.',
    contact_btn: 'Enviar Missatge',
    contact_success_title: 'Missatge enviat!',
    contact_success_sub: 'Gràcies per contactar-nos. Et respondrem en menys de 24 hores.',
    contact_success_btn: 'Enviar un altre missatge',
    form_nombre: 'Nom *',
    form_telefono: 'Telèfon',
    form_email: 'Email *',
    form_servicio: 'Servei *',
    form_plan: 'Pla *',
    form_mensaje: 'Missatge *',
    form_placeholder_nombre: 'El teu nom',
    form_placeholder_telefono: '+34 600 000 000',
    form_placeholder_email: 'tu@email.com',
    form_placeholder_servicio: 'Selecciona un servei...',
    form_placeholder_plan: 'Selecciona un pla...',
    form_placeholder_mensaje: 'Explica\'ns el teu projecte...',
  }
};

let currentLang = 'es';

function setLang(lang) {
  currentLang = lang;
  const t = translations[lang];

  // Actualizar badge del idioma actual
  document.getElementById('lang-current').textContent = lang.toUpperCase();

  // Resaltar opción activa
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.remove('text-cyber-blue');
    btn.classList.add('text-gray-400');
  });
  const activeBtn = document.getElementById('lang-' + lang);
  if (activeBtn) {
    activeBtn.classList.add('text-cyber-blue');
    activeBtn.classList.remove('text-gray-400');
  }

  // Navbar
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#/servicios') link.textContent = t.nav_servicios;
    if (href === '#/portfolio') link.textContent = t.nav_portfolio;
    if (href === '#/nosotros') link.textContent = t.nav_nosotros;
  });

  // Hero
  const heroBadge = document.querySelector('#page-home .scroll-reveal span');
  if (heroBadge) heroBadge.textContent = t.hero_badge;

  const heroLines = document.querySelectorAll('#page-home h1');
  if (heroLines[0]) {
    heroLines[0].innerHTML = `${t.hero_title1} <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-purple text-glow">${t.hero_title2}</span>`;
  }

  const heroSub = document.querySelector('#page-home .scroll-reveal p');
  if (heroSub) heroSub.textContent = t.hero_sub;

  // Contacto
  const contactBadge = document.querySelector('#page-contacto span.text-cyber-blue');
  if (contactBadge) contactBadge.textContent = t.contact_badge;

  const contactTitle = document.querySelector('#page-contacto h1');
  if (contactTitle) {
    contactTitle.innerHTML = `${t.contact_title1} <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-purple text-glow">${t.contact_title2}</span>`;
  }

  const contactSub = document.querySelector('#page-contacto .scroll-reveal p');
  if (contactSub) contactSub.textContent = t.contact_sub;

  // Formulario labels
  const labels = document.querySelectorAll('#contact-form label');
  const labelKeys = ['form_nombre', 'form_telefono', 'form_email', 'form_servicio', 'form_mensaje'];
  labels.forEach((label, i) => {
    if (labelKeys[i]) label.textContent = t[labelKeys[i]];
  });

  // Placeholders
  const inputNombre = document.querySelector('#contact-form input[name="nombre"]');
  const inputTel = document.querySelector('#contact-form input[name="telefono"]');
  const inputEmail = document.querySelector('#contact-form input[name="email"]');
  const inputMsg = document.querySelector('#contact-form textarea');
  if (inputNombre) inputNombre.placeholder = t.form_placeholder_nombre;
  if (inputTel) inputTel.placeholder = t.form_placeholder_telefono;
  if (inputEmail) inputEmail.placeholder = t.form_placeholder_email;
  if (inputMsg) inputMsg.placeholder = t.form_placeholder_mensaje;

  // Botón enviar
  const btnText = document.getElementById('btn-text');
  if (btnText) btnText.textContent = t.contact_btn;

  // Mensaje éxito
  const successTitle = document.querySelector('#success-msg h3');
  const successSub = document.querySelector('#success-msg p');
  const successBtn = document.querySelector('#success-msg button');
  if (successTitle) successTitle.textContent = t.contact_success_title;
  if (successSub) successSub.textContent = t.contact_success_sub;
  if (successBtn) successBtn.textContent = t.contact_success_btn;

  // Cerrar dropdown
  document.getElementById('lang-menu').classList.add('hidden');
  document.getElementById('lang-chevron').style.transform = '';
}

// Abrir/cerrar dropdown
const langBtn = document.getElementById('lang-btn');
const langMenu = document.getElementById('lang-menu');
const langChevron = document.getElementById('lang-chevron');

if (langBtn) {
  langBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    langMenu.classList.toggle('hidden');
    langChevron.style.transform = langMenu.classList.contains('hidden') ? '' : 'rotate(180deg)';
  });
}

// Cerrar al hacer click fuera
document.addEventListener('click', function (e) {
  if (langMenu && !langMenu.classList.contains('hidden')) {
    if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
      langMenu.classList.add('hidden');
      langChevron.style.transform = '';
    }
  }
});