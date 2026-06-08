/* ===== NEXUS MUAY THAI — script.js ===== */

/* ── ENV CONFIG ──────────────────────────────────────────── */
// Simula leitura do .env no frontend.
// Em produção real (Node.js/servidor), use process.env.WHATSAPP_NUMBER
const ENV = { WHATSAPP_NUMBER: "556193662784" };

/* ── LOADING SCREEN ──────────────────────────────────────── */
window.addEventListener("load", () => {
  setTimeout(() => {
    const screen = document.getElementById("loading-screen");
    if (screen) screen.classList.add("hidden");
  }, 2400);
});

/* ── NAVBAR SCROLL ───────────────────────────────────────── */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
});

/* ── HAMBURGER ───────────────────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const navMobile = document.getElementById("nav-mobile");
hamburger?.addEventListener("click", () => {
  navMobile.classList.toggle("open");
});
navMobile?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => navMobile.classList.remove("open"));
});

/* ── WHATSAPP FLOAT ──────────────────────────────────────── */
const waFloat = document.getElementById("whatsapp-float");
if (waFloat) {
  waFloat.href = `https://wa.me/${ENV.WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Vim pelo site da NEXUS Muay Thai e gostaria de mais informações.")}`;
}

/* ── PARTICLES ───────────────────────────────────────────── */
if (typeof tsParticles !== "undefined") {
  tsParticles.load("tsparticles", {
    fullScreen: { enable: false },
    particles: {
      number: { value: 38, density: { enable: true, value_area: 800 } },
      color: { value: "#7c3aed" },
      shape: { type: "circle" },
      opacity: { value: 0.18, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.05, sync: false } },
      size: { value: 2.5, random: true },
      line_linked: { enable: true, distance: 160, color: "#7c3aed", opacity: 0.08, width: 1 },
      move: { enable: true, speed: 0.5, direction: "none", random: true, straight: false, out_mode: "out" }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: false } },
      modes: { repulse: { distance: 100, duration: 0.4 } }
    },
    retina_detect: true
  });
}

/* ── SCROLL REVEAL (Intersection Observer) ───────────────── */
const revealEls = document.querySelectorAll(".benefit-card, .schedule-card, .section-header");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(28px)";
  el.style.transition = "opacity 0.65s ease, transform 0.65s ease";
  observer.observe(el);
});
