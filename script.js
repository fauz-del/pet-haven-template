const ACTIVE_BIZ = "bark_and_bite";

function el(id)          { return document.getElementById(id); }
function set(id, text)   { const e = el(id); if (e) e.innerText  = text; }
function setHTML(id, html){ const e = el(id); if (e) e.innerHTML = html; }
function setSrc(id, src) { const e = el(id); if (e) e.src        = src;  }

function injectBusinessData(biz) {
  document.title = `${biz.name1}${biz.name2} — Premium Pet Care`;
  
  if (biz.theme === "pet") {
    const r = document.documentElement;
    r.style.setProperty("--primary-warm",  biz.color);
    r.style.setProperty("--bg-warm",       biz.bgColor      || "#FFF7F0");
    r.style.setProperty("--text-dark",     biz.textColor    || "#4A3728");
    r.style.setProperty("--accent-light",  biz.accentColor  || "#FFE3D0");
  }

  document.querySelectorAll(".logo").forEach(logo => {
    logo.innerHTML = `${biz.name1}<span>${biz.name2}</span>`;
  });

  setHTML("hero-title",       biz.heroTitle);
  set   ("hero-description",  biz.heroDesc);
  set   ("hero-cta",          biz.ctaText);
  setSrc("hero-main-image",   biz.heroImg);
  setSrc("thought-image",     biz.thoughtImg);

  if (biz.badges) {
    biz.badges.forEach((badge, i) => {
      const n = i + 1;

      const iconEl = el(`badge-${n}-icon`);
      if (iconEl && badge.icon) {
        iconEl.innerHTML = `<i class="fas ${badge.icon}"></i>`;
      }

      set(`badge-${n}-title`, badge.title);
      set(`badge-${n}-desc`,  badge.desc);
    });
  }

  set   ("about-title", biz.aboutTitle);
  set   ("about-desc",  biz.aboutDesc);
  if (biz.aboutImgs) {
    biz.aboutImgs.forEach((src, i) => setSrc(`about-img-${i + 1}`, src));
  }

  set("info-title", biz.infoTitle);

  if (biz.infoPoints) {
    biz.infoPoints.forEach((point, i) => set(`info-point-${i + 1}`, point));
  }

  const infoSection = el("info-parallax");
  if (infoSection && biz.infoBg) {
    infoSection.style.backgroundImage = `url('${biz.infoBg}')`;
  }
 
 const phoneLink = document.querySelector('a[href^="tel:"]');
if (phoneLink) {
    phoneLink.href = `tel:${biz.phone.replace(/\s+/g, '')}`;
}


  const reviewContainer = el("reviews-container");
  if (reviewContainer && biz.reviews) {
    reviewContainer.innerHTML = biz.reviews.map(r => `
      <div class="pet-review-card">
        <div class="stars" style="color: var(--primary-warm); font-size: 1.1rem;">★★★★★</div>
        <p style="margin: 15px 0; color: var(--bg-text);">"${r.text}"</p>
        <strong style="color: var(--text-dark);">— ${r.name}</strong>
      </div>
    `).join("");
  }
  
  const phoneEl = document.querySelector(".phone-text");
  if (phoneEl) phoneEl.innerText = biz.phone;

  set("footer-email",  biz.email);
  set("biz-location",  biz.locationName);

  set("footer-biz-name-1", biz.footerBizName1 || biz.name1);
  set("footer-biz-name-2", biz.footerBizName2 || biz.name2);
  set("footer-desc",       biz.footerDesc);

  const footerLinksList = document.querySelector(".footer-links ul");
  if (footerLinksList && biz.footerLinks) {
    footerLinksList.innerHTML = biz.footerLinks
      .map(l => `<li><a href="${l.href}">${l.label}</a></li>`)
      .join("");
  }

  const newsletterP = document.querySelector(".footer-newsletter p");
  if (newsletterP && biz.footerNewsletterDesc) {
    newsletterP.innerText = biz.footerNewsletterDesc;
  }

  set("current-year", new Date().getFullYear());
}

function handleSubmit(e) {
  e.preventDefault();
  const feedback = el("fs");
  if (feedback) {
    feedback.style.display = "block";
    setTimeout(() => { feedback.style.display = "none"; }, 4000);
  }
  e.target.reset();
}

function initMobileMenu() {
  const toggle   = el("mobile-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!toggle || !navLinks) return;

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    navLinks.classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      navLinks.classList.remove("open");
    });
  });
}

// ─── SCROLL REVEAL ───────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    observer.observe(el);
  });
}

// ─── NAVBAR SCROLL ───────────────────────────
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ─── SMOOTH SCROLL ───────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

// ─── PAGE FADE IN ────────────────────────────
function initPageFade() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
}

// ─── SINGLE INIT ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Read ?biz= from URL — falls back to ACTIVE_BIZ
  const params = new URLSearchParams(window.location.search);
  const bizKey = params.get('biz') || ACTIVE_BIZ;
  const biz    = businesses[bizKey];

  if (!biz) {
    console.warn(`No config found for "${bizKey}"`);
    return;
  }

  initPageFade();
  injectBusinessData(biz);
  initMobileMenu();
  initScrollReveal();
  initNavbarScroll();
  initSmoothScroll();
});
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const bizId = params.get('biz') || Object.keys(businesses)[0];
  const biz = businesses[bizId];
  if (biz && biz.about2Stats) {
    document.getElementById('stats-bar').innerHTML = biz.about2Stats.map(s => `
      <div class="stat-block">
        <span class="stat-val">${s.value}</span>
        <span class="stat-label">${s.label}</span>
      </div>
    `).join('');
  }
});
