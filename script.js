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
// Keyboard toggle for project-card expansion
document.querySelectorAll('.project-card').forEach(card=>{
  card.setAttribute('tabindex', card.getAttribute('tabindex') || '0');
  card.addEventListener('keydown', e=>{
    if(e.key==='Enter' || e.key===' '){
      e.preventDefault();
      openProjectModal(card);
    }
    if(e.key==='Escape' && card.classList.contains('expanded')){ card.classList.remove('expanded'); }
  });
  card.addEventListener('click', e=>{
    // Avoid triggering when clicking links inside
    if(!card.closest('.project-modal')) openProjectModal(card);
  });
});
// Modal logic
const modalOverlay=document.getElementById('modalOverlay');
const modal=document.getElementById('projectModal');
const closeBtn=document.getElementById('modalClose');
function openProjectModal(card){
  if(!modal) return;
  const img=card.querySelector('img');
  const title=card.querySelector('h3');
  const desc=card.querySelector('p');
  const tags=[...card.querySelectorAll('.tags span')].map(s=>s.textContent.trim());
  const extra=card.querySelector('.card-extra');
  document.getElementById('modalImage').src=img ? img.src : '';
  document.getElementById('modalTitle').textContent=title?title.textContent:'';
  document.getElementById('modalDesc').textContent=desc?desc.textContent:'';
  const tagRoot=document.getElementById('modalTags'); tagRoot.innerHTML='';
  tags.forEach(t=>{ const span=document.createElement('span'); span.textContent=t; tagRoot.appendChild(span); });
  const extraRoot=document.getElementById('modalExtra'); extraRoot.innerHTML='';
  if(extra){
    const clone=extra.cloneNode(true); clone.classList.remove('card-extra'); extraRoot.appendChild(clone); }
  modalOverlay.classList.add('active');
  modal.classList.add('active');
  document.body.classList.add('no-scroll');
  modal.setAttribute('aria-hidden','false');
  modalOverlay.setAttribute('aria-hidden','false');
  closeBtn.focus();
}
function closeProjectModal(){
  modalOverlay.classList.remove('active');
  modal.classList.remove('active');
  document.body.classList.remove('no-scroll');
  modal.setAttribute('aria-hidden','true');
  modalOverlay.setAttribute('aria-hidden','true');
}
if(closeBtn){ closeBtn.addEventListener('click',closeProjectModal); }
if(modalOverlay){ modalOverlay.addEventListener('click',closeProjectModal); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape' && modal.classList.contains('active')) closeProjectModal(); });
// Contact form
window.contactSubmit = function(e){ e.preventDefault(); const data = Object.fromEntries(new FormData(e.target).entries()); const body = encodeURIComponent(`${data.message}\n\nFrom: ${data.name} <${data.email}>`); window.location.href=`mailto:saiprudvi0102@gmail.com?subject=Portfolio Contact&body=${body}`; const status=document.getElementById('formStatus'); if(status) status.textContent='Opening mail client...'; };
// Resume PDF existence check (simple HEAD via fetch)
const resumeLink=document.querySelector('a[href="Saiprudvi_Resume.pdf"]');
if(resumeLink){
  fetch('Saiprudvi_Resume.pdf',{method:'HEAD'}).then(r=>{ if(!r.ok){ resumeLink.textContent='PDF Not Found'; resumeLink.classList.add('subtle'); resumeLink.removeAttribute('download'); } }).catch(()=>{ resumeLink.textContent='PDF Not Found'; });
}
// Smooth anchor fallback
document.querySelectorAll('a[href^="#"]').forEach(a=>{ a.addEventListener('click',e=>{ const id=a.getAttribute('href').slice(1); const t=document.getElementById(id); if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'});} }); });

// Screenshot Modal functionality
document.addEventListener('DOMContentLoaded', function() {
  const screenshotItems = document.querySelectorAll('.screenshot-item');
  const screenshotOverlay = document.getElementById('screenshotOverlay');
  const screenshotModal = document.getElementById('screenshotModal');
  const screenshotImage = document.getElementById('screenshotImage');
  const screenshotCaption = document.getElementById('screenshotCaption');
  const screenshotClose = document.getElementById('screenshotClose');

  function openScreenshotModal(item) {
    if (!screenshotOverlay) return;
    
    const img = item.querySelector('img');
    const label = item.querySelector('.screenshot-label');
    
    if (img) {
      screenshotImage.src = img.src;
      screenshotImage.alt = img.alt;
      screenshotCaption.textContent = label ? label.textContent : img.alt;
      
      screenshotOverlay.classList.add('active');
      screenshotModal.classList.add('active');
      document.body.classList.add('no-scroll');
    }
  }

  function closeScreenshotModal() {
    if (screenshotOverlay) {
      screenshotOverlay.classList.remove('active');
      screenshotModal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }
  }

  // Add click listeners to screenshot items
  screenshotItems.forEach(item => {
    item.addEventListener('click', () => openScreenshotModal(item));
    
    // Add keyboard support
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openScreenshotModal(item);
      }
    });
  });

  // Close modal listeners
  if (screenshotClose) {
    screenshotClose.addEventListener('click', closeScreenshotModal);
  }
  
  if (screenshotOverlay) {
    screenshotOverlay.addEventListener('click', (e) => {
      if (e.target === screenshotOverlay) {
        closeScreenshotModal();
      }
    });
  }

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && screenshotOverlay && screenshotOverlay.classList.contains('active')) {
      closeScreenshotModal();
    }
  });
});
