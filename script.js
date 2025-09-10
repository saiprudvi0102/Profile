// Navigation toggle
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => { nav.classList.toggle('open'); navToggle.classList.toggle('open'); });
  document.addEventListener('click', e => { if (!nav.contains(e.target) && e.target !== navToggle) nav.classList.remove('open'); });
}
// Year
const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
// Typing effect
document.querySelectorAll('.typing').forEach(el => { const full = el.dataset.text || el.textContent.trim(); el.textContent=''; let i=0; const speed=70; const type=()=>{ if(i<full.length){ el.innerHTML=full.slice(0,i+1); i++; requestAnimationFrame(()=>setTimeout(type,speed)); } else { el.classList.remove('typing'); } }; setTimeout(type,400); });
// Reveal on scroll
const observer = new IntersectionObserver(entries => { entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target);} }); }, { threshold:0.15 });
document.querySelectorAll('.project-card, .reveal, .tl-item').forEach(el=>observer.observe(el));
// Contact form
window.contactSubmit = function(e){ e.preventDefault(); const data = Object.fromEntries(new FormData(e.target).entries()); const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} <${data.email}>`); window.location.href=`mailto:saiprudvi0102@gmail.com?subject=Portfolio Contact&body=${body}`; const status=document.getElementById('formStatus'); if(status) status.textContent='Opening mail client...'; };
// Smooth anchor fallback
document.querySelectorAll('a[href^="#"]').forEach(a=>{ a.addEventListener('click',e=>{ const id=a.getAttribute('href').slice(1); const t=document.getElementById(id); if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'});} }); });
