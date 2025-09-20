/*
 * DEPRECATED: This file is no longer loaded. All active logic moved to main.js.
 * Retain temporarily for reference; safe to delete after verifying main.js.
 */
console.warn('[DEPRECATED] script.js present but not used.');
/* Rebuilt clean script.js replacing corrupted mixed versions */

/**************** Toast Utility *****************/
function showToast(message,{duration=2200}={}){
  let host=document.querySelector('.toast-host');
  if(!host){
    host=document.createElement('div');
    host.className='toast-host';
    host.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;gap:8px;z-index:2000000;pointer-events:none;';
    document.body.appendChild(host);
  }
  const el=document.createElement('div');
  el.className='toast';
  el.style.cssText='background:rgba(0,0,0,.8);color:#fff;padding:10px 16px;font-size:.8rem;border-radius:8px;box-shadow:0 4px 16px -4px rgba(0,0,0,.6);letter-spacing:.03em;opacity:0;transform:translateY(6px);transition:opacity .35s,transform .35s cubic-bezier(.22,.61,.36,1);backdrop-filter:blur(6px);';
  el.textContent=message;
  host.appendChild(el);
  requestAnimationFrame(()=>{ el.style.opacity='1'; el.style.transform='translateY(0)'; });
  setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateY(6px)'; setTimeout(()=>el.remove(),400); },duration);
}

/**************** Header Scroll Effect *****************/
function initializeHeaderEffects(){
  const header=document.querySelector('header');
  if(!header) return;
  window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>20));
}

/**************** Carousel (desktop) + native scroll (mobile) *****************/
function initializeCarousels(){
  const tracks=document.querySelectorAll('[data-track]');
  const isTouch='ontouchstart' in window||navigator.maxTouchPoints>0;
  tracks.forEach(track=>{
    const name=track.dataset.track;
    const container=track.parentElement;
    const cards=track.querySelectorAll('.netflix-card');
    const prev=document.querySelector(`[data-carousel="${name}"][data-direction="prev"]`);
    const next=document.querySelector(`[data-carousel="${name}"][data-direction="next"]`);
    const useNative=isTouch||window.innerWidth<=820;
    if(useNative){
      track.style.transform='none';
      prev&&(prev.style.display='none');
      next&&(next.style.display='none');
      return;
    }
    let current=0;const cardWidth=336; // 320 + 16 gap
    const maxIndex=()=>Math.max(0,cards.length-Math.floor(container.offsetWidth/cardWidth));
    let max=maxIndex();
    function update(){ track.style.transform=`translateX(${-current*cardWidth}px)`; prev&&(prev.disabled=current===0); next&&(next.disabled=current>=max); }
    update();
    prev&&prev.addEventListener('click',()=>{ current=Math.max(0,current-1); update(); });
    next&&next.addEventListener('click',()=>{ current=Math.min(max,current+1); update(); });
    window.addEventListener('resize',()=>{ if(isTouch||window.innerWidth<=820){ track.style.transform='none'; prev&&(prev.style.display='none'); next&&(next.style.display='none'); return;} else { prev&&(prev.style.display=''); next&&(next.style.display=''); } max=maxIndex(); if(current>max) current=max; update(); });
  });
}

/**************** Hover Preview (desktop only) *****************/
class NetflixHoverManager{
  constructor(){ this.isTouch='ontouchstart' in window||navigator.maxTouchPoints>0; if(!this.isTouch){ this.build(); this.bind(); } }
  build(){ const c=document.createElement('div'); c.className='netflix-preview-container'; c.innerHTML=`<div class="netflix-preview-card"><div class="preview-image-container"><img class="preview-image" alt=""><div class="preview-overlay"><button class="preview-play-btn" aria-label="Open"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button></div></div><div class="preview-content"><h3 class="preview-title"></h3><p class="preview-description"></p></div></div>`; document.body.appendChild(c); this.container=c; }
  bind(){ document.addEventListener('mouseenter',e=>{ const card=e.target.closest('.netflix-card[data-project]'); card&&this.queueShow(card); },true); document.addEventListener('mouseleave',e=>{ const card=e.target.closest('.netflix-card[data-project]'); card&&this.hide(); },true); this.container.addEventListener('click',()=>{ if(this.active && window.__projectDetailManager){ window.__projectDetailManager.showProjectDetail(this.active.dataset.project,this.active); this.hide(); } }); document.addEventListener('click',()=>this.hide()); }
  queueShow(card){ clearTimeout(this.to); this.to=setTimeout(()=>this.show(card),400); }
  show(card){ const data=window.__projectDetailManager?.getProjectData(card.dataset.project,card); if(!data) return; this.container.querySelector('.preview-image').src=data.image||''; this.container.querySelector('.preview-title').textContent=data.title||''; this.container.querySelector('.preview-description').textContent=data.description||''; const r=card.getBoundingClientRect(); const el=this.container.querySelector('.netflix-preview-card'); let left=r.left+r.width/2-200; left=Math.max(20,Math.min(left,window.innerWidth-420)); let top=r.bottom+10; if(top+260>window.innerHeight-20) top=r.top-270; el.style.left=left+'px'; el.style.top=top+'px'; this.container.classList.add('active'); this.active=card; }
  hide(){ clearTimeout(this.to); this.container.classList.remove('active'); this.active=null; }
}

/**************** Project Detail Modal *****************/
class ProjectDetailManager{
  constructor(){ this.current=null; this.lastFocus=null; this.projectOrder=this.computeOrder(); this.buildModal(); window.addEventListener('hashchange',()=>this.onHashChange()); this.live=document.createElement('div'); this.live.className='sr-only'; this.live.setAttribute('aria-live','polite'); document.body.appendChild(this.live); }
  computeOrder(){ return Array.from(document.querySelectorAll('.netflix-card[data-project]')).map(c=>c.dataset.project); }
  buildModal(){ const modal=document.createElement('div'); modal.className='project-modal'; modal.setAttribute('aria-hidden','true'); modal.innerHTML=`<div class="project-modal-overlay"><div class="project-modal-content"><div class="project-nav-bar" style="position:absolute;top:12px;left:12px;display:flex;gap:.5rem;z-index:5;"><button class="project-nav-btn prev" aria-label="Previous project">◀</button><button class="project-nav-btn next" aria-label="Next project">▶</button><span class="project-progress" style="padding:.35rem .6rem;font-size:.7rem;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:999px;">1 / 1</span><button class="project-copy" aria-label="Copy link" style="font-size:.75rem;padding:.35rem .6rem;border-radius:6px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);">🔗</button></div><button class="project-close" aria-label="Close" style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,.1);border:none;border-radius:50%;width:40px;height:40px;cursor:pointer;">✕</button><div class="project-modal-body" tabindex="0" style="overflow:auto;height:100%;padding:4.5rem 1.5rem 2rem;"></div></div></div>`; document.body.appendChild(modal); this.modal=modal; this.bind(); }
  bind(){ this.modal.addEventListener('click',e=>{ if(e.target.classList.contains('project-modal-overlay')|| e.target.closest('.project-close')) this.close(); }); document.addEventListener('keydown',e=>{ if(!this.isOpen()) return; if(e.key==='Escape'){ e.preventDefault(); this.close(); } if(e.key==='ArrowLeft'){ e.preventDefault(); this.navigate(-1); } if(e.key==='ArrowRight'){ e.preventDefault(); this.navigate(1); } }); this.modal.querySelector('.project-nav-btn.prev').addEventListener('click',()=>this.navigate(-1)); this.modal.querySelector('.project-nav-btn.next').addEventListener('click',()=>this.navigate(1)); this.modal.querySelector('.project-copy').addEventListener('click',()=>this.copyLink()); }
  isOpen(){ return this.modal.classList.contains('active'); }
  onHashChange(){ const id=location.hash.startsWith('#project-')?location.hash.slice(9):''; if(!id){ if(this.isOpen()) this.close(); return;} if(id===this.current) return; const card=document.querySelector(`.netflix-card[data-project="${id}"]`); this.open(id,card); }
  showProjectDetail(id,card){ const hash=`project-${id}`; if(location.hash!==`#${hash}`){ location.hash=hash; } else { this.open(id,card); } }
  open(id,card){ const data=this.getProjectData(id,card); if(!data) return; this.current=id; const body=this.modal.querySelector('.project-modal-body'); body.innerHTML=this.renderProject(data); this.modal.classList.add('active'); this.modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; this.updateProgress(); this.updateNavButtons(); this.ensureQrButton(); this.lastFocus=document.activeElement instanceof HTMLElement?document.activeElement:null; const first=body.querySelector('a,button,[tabindex="0"]'); first&&first.focus({preventScroll:true}); this.announce(`Opened project ${data.title}`); }
  close(){ this.modal.classList.remove('active'); this.modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; if(this.lastFocus) this.lastFocus.focus({preventScroll:true}); if(location.hash.startsWith('#project-')) history.replaceState(null,'',location.pathname+location.search); this.current=null; }
  navigate(dir){ if(!this.current) return; const idx=this.projectOrder.indexOf(this.current); const nextIdx=idx+dir; if(nextIdx<0||nextIdx>=this.projectOrder.length) return; const nextId=this.projectOrder[nextIdx]; const card=document.querySelector(`.netflix-card[data-project="${nextId}"]`); this.showProjectDetail(nextId,card); }
  updateProgress(){ const prog=this.modal.querySelector('.project-progress'); if(!prog||!this.current) return; const idx=this.projectOrder.indexOf(this.current); prog.textContent=`${idx+1} / ${this.projectOrder.length}`; }
  updateNavButtons(){ const prev=this.modal.querySelector('.project-nav-btn.prev'); const next=this.modal.querySelector('.project-nav-btn.next'); const idx=this.projectOrder.indexOf(this.current); prev.disabled=idx<=0; next.disabled=idx>=this.projectOrder.length-1; [prev,next].forEach(b=>b.style.opacity=b.disabled?'.35':'1'); }
  copyLink(){ if(!this.current) return; const url=location.origin+location.pathname+`#project-${this.current}`; navigator.clipboard.writeText(url).then(()=>{ showToast('Link copied'); this.announce('Link copied'); }).catch(()=>showToast('Copy failed')); }
  ensureQrButton(){ if(this.modal.querySelector('.project-qr')) return; const bar=this.modal.querySelector('.project-nav-bar'); const btn=document.createElement('button'); btn.type='button'; btn.className='project-qr'; btn.textContent='QR'; btn.setAttribute('aria-label','Show QR code'); btn.style.cssText='font-size:.7rem;padding:.35rem .55rem;border-radius:6px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);'; btn.addEventListener('click',()=>this.showQr()); bar.appendChild(btn); }
  showQr(){ if(!this.current) return; const share=encodeURIComponent(location.origin+location.pathname+`#project-${this.current}`); const qr=`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${share}`; let overlay=document.querySelector('.qr-overlay'); if(!overlay){ overlay=document.createElement('div'); overlay.className='qr-overlay'; overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.65);display:flex;align-items:center;justify-content:center;z-index:2000001;'; overlay.innerHTML=`<div class="qr-box" style="background:#111;padding:1.2rem 1.4rem 1.4rem;border-radius:14px;position:relative;box-shadow:0 8px 32px -8px rgba(0,0,0,.7);text-align:center;max-width:280px;"><button class="qr-close" aria-label="Close" style="position:absolute;top:6px;right:6px;background:rgba(255,255,255,.12);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;">✕</button><h3 style="margin:0 0 .75rem;font-size:.9rem;letter-spacing:.05em;font-weight:600;">Share Project</h3><img class="qr-img" src="${qr}" alt="QR code" style="width:220px;height:220px;border-radius:8px;background:#000;object-fit:contain;"/><p style="margin:.7rem 0 0;font-size:.65rem;line-height:1.2;color:#aaa;">Scan on your phone<br><span style="color:#fff;">${this.current}</span></p></div>`; document.body.appendChild(overlay); overlay.addEventListener('click',e=>{ if(e.target===overlay) overlay.remove(); }); overlay.querySelector('.qr-close').addEventListener('click',()=>overlay.remove()); } else { overlay.querySelector('.qr-img').src=qr; const span=overlay.querySelector('span'); span&&(span.textContent=this.current); } showToast('QR code ready'); }
  announce(msg){ if(this.live){ this.live.textContent=''; requestAnimationFrame(()=>{ this.live.textContent=msg; }); } }
  getProjectData(id,card){ if(!this._data) this._data=this.staticData(); if(this._data[id]) return this._data[id]; if(card){ const title=card.querySelector('.netflix-card-title')?.textContent?.trim()||id; const desc=card.querySelector('.netflix-card-description')?.textContent?.trim()||''; return {title,subtitle:'Project',image:card.querySelector('img')?.src||'',description:desc,longDescription:desc,metrics:[],technologies:[],features:[],architecture:{title:'Architecture',description:'',components:[]},github:null,demo:null}; } return null; }
  staticData(){ return { 'financial-risk': { title:'📈 GPU-Accelerated Financial Risk Analysis', subtitle:'CUDA Monte Carlo / VaR', image:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80', description:'GPU-accelerated risk simulation.', longDescription:'Advanced risk assessment with CUDA-parallel Monte Carlo simulations.', metrics:[{label:'Speedup',value:'1.57×',icon:'🚀'}], technologies:[{name:'CUDA'},{name:'PyCUDA'},{name:'NumPy'}], features:['Monte Carlo engine','VaR computation','Benchmarking'], architecture:{title:'System Architecture',description:'GPU kernel + analysis pipeline',components:['CUDA Kernels','Simulation Runner','Result Analyzer']}, github:'https://github.com/saiprudvi0102/Finance-Risk-Analysis-GPU', demo:null } }; }
  renderProject(p){ return `<article class="project-detail" style="max-width:1100px;margin:0 auto;">${p.image?`<div style=\"position:relative;aspect-ratio:16/9;overflow:hidden;border-radius:16px;margin:-1rem -1rem 1.25rem;background:#111;\"><img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;"/></div>`:''}<h1 style="margin:.25rem 0 .35rem;font-size:clamp(1.6rem,3.2vw,2.4rem);line-height:1.1;">${p.title}</h1><p style="margin:0 0 1rem;color:var(--text-secondary);font-size:1rem;">${p.subtitle||''}</p><p style="margin:0 0 1.25rem;font-size:.95rem;line-height:1.5;">${p.longDescription||p.description||''}</p>${p.metrics?.length?`<section style=\"margin:0 0 1.75rem;\"><h2 style=\"font-size:1rem;letter-spacing:.06em;text-transform:uppercase;font-weight:600;margin:0 0 .75rem;opacity:.9;\">Key Metrics</h2><div style=\"display:grid;gap:.75rem;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));\">${p.metrics.map(m=>`<div style=\"padding:.85rem .9rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:12px;font-size:.75rem;letter-spacing:.05em;display:flex;flex-direction:column;gap:.35rem;\"><span style=\"font-size:1.1rem;\">${m.icon||''}</span><strong style=\"font-size:.9rem;\">${m.value}</strong><span style=\"opacity:.75;\">${m.label}</span></div>`).join('')}</div></section>`:''}${p.technologies?.length?`<section style=\"margin:0 0 1.75rem;\"><h2 style=\"font-size:1rem;letter-spacing:.06em;text-transform:uppercase;font-weight:600;margin:0 0 .75rem;opacity:.9;\">Technologies</h2><div style=\"display:flex;flex-wrap:wrap;gap:.5rem;\">${p.technologies.map(t=>`<span style=\"padding:.45rem .7rem;background:rgba(229,9,20,.15);color:var(--netflix-red,#e50914);font-size:.65rem;font-weight:500;letter-spacing:.05em;border:1px solid rgba(229,9,20,.35);border-radius:24px;\">${t.name}</span>`).join('')}</div></section>`:''}${p.features?.length?`<section style=\"margin:0 0 2rem;\"><h2 style=\"font-size:1rem;letter-spacing:.06em;text-transform:uppercase;font-weight:600;margin:0 0 .75rem;opacity:.9;\">Features</h2><ul style=\"padding:0;margin:0;list-style:none;display:grid;gap:.6rem;\">${p.features.map(f=>`<li style=\"display:flex;align-items:flex-start;gap:.55rem;font-size:.85rem;line-height:1.4;\"><span style=\"color:#4ade80;font-size:.9rem;position:relative;top:.15rem;\">✔</span><span>${f}</span></li>`).join('')}</ul></section>`:''}${(p.architecture?.components||[]).length?`<section style=\"margin:0 0 1rem;\"><h2 style=\"font-size:1rem;letter-spacing:.06em;text-transform:uppercase;font-weight:600;margin:0 0 .75rem;opacity:.9;\">${p.architecture.title}</h2><p style=\"margin:0 0 .85rem;font-size:.85rem;line-height:1.5;opacity:.9;\">${p.architecture.description||''}</p><ol style=\"margin:0;padding-left:1rem;font-size:.8rem;line-height:1.45;display:grid;gap:.4rem;\">${p.architecture.components.map(c=>`<li>${c}</li>`).join('')}</ol></section>`:''}${(p.github||p.demo)?`<footer style=\"margin:2rem 0 0;display:flex;gap:.9rem;flex-wrap:wrap;\">${p.github?`<a href=\"${p.github}\" target=\"_blank\" rel=\"noopener\" style=\"text-decoration:none;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.15);padding:.65rem .95rem;font-size:.7rem;letter-spacing:.06em;border-radius:8px;display:inline-flex;gap:.4rem;align-items:center;\">GitHub ↗</a>`:''}${p.demo?`<a href=\"${p.demo}\" target=\"_blank\" rel=\"noopener\" style=\"text-decoration:none;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.15);padding:.65rem .95rem;font-size:.7rem;letter-spacing:.06em;border-radius:8px;display:inline-flex;gap:.4rem;align-items:center;\">Live Demo ↗</a>`:''}</footer>`:''}</article>`; }
}

/**************** Accessibility *****************/
function initializeAccessibility(){
  document.querySelectorAll('.netflix-card').forEach(card=>{ card.setAttribute('tabindex','0'); card.setAttribute('role','button'); const t=card.querySelector('.netflix-card-title')?.textContent?.trim()||'details'; card.setAttribute('aria-label','Open project '+t); });
  document.querySelectorAll('.cert-item').forEach(card=>{ card.setAttribute('tabindex','0'); card.setAttribute('role','button'); const h=card.querySelector('h3')?.textContent?.trim()||'details'; card.setAttribute('aria-label','Open certification '+h); });
}

/**************** Initialization *****************/
window.addEventListener('DOMContentLoaded',()=>{
  document.body.classList.add('loaded');
  initializeHeaderEffects();
  initializeCarousels();
  window.__projectDetailManager=new ProjectDetailManager();
  new NetflixHoverManager();
  initializeAccessibility();
  console.log('[Init] Clean rebuilt script loaded.');
  if(location.hash.startsWith('#project-')){
    window.__projectDetailManager.onHashChange();
  }
});

            // Handle poster/card clicks (anywhere on card except buttons)
            const netflixCard = e.target.closest('.netflix-card');
            if (netflixCard && !e.target.closest('.play-btn') && !e.target.closest('.project-modal')) {
                e.preventDefault();
                const projectId = netflixCard.dataset.project;
                if (projectId) {
                    console.log('[Click] Netflix card clicked, project ID:', projectId);
                    location.hash = `project-${projectId}`;
                    return;
                }
            }

            // Handle certification card clicks
            const certCard = e.target.closest('.cert-item');
            if (certCard && !e.target.closest('.project-modal')) {
                e.preventDefault();
                this.showCertificationDetail(certCard);
            }

            // Handle modal close
            if (e.target.classList.contains('project-modal-overlay') || 
                e.target.classList.contains('close-project-modal') ||
                e.target.closest('.close-project-modal')) {
                this.closeModal();
            }
        });

        // Mobile: tap anywhere on a card opens details (robust on touch devices)
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) {
            document.addEventListener('touchend', (e) => {
                const card = e.target.closest('.netflix-card[data-project]');
                if (card) {
                    const projectId = card.dataset.project;
                    if (projectId) {
                        // Prevent accidental double-activation with click
                        e.preventDefault();
                        this._lastTouchOpenAt = Date.now();
                        // Use hash to open via hashchange path (robust)
                        location.hash = `project-${projectId}`;
                        return;
                    }
                }
            }, { passive: false });
        }

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Close modal with Escape key
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
                e.preventDefault();
                this.closeModal();
            }
            
            // Open modal with Enter key when focused on a card
            if (e.key === 'Enter' && document.activeElement) {
                const focusedCard = document.activeElement.closest('.netflix-card');
                const focusedCert = document.activeElement.closest('.cert-item');
                
                if (focusedCard) {
                    e.preventDefault();
                    const projectId = focusedCard.dataset.project;
                    if (projectId) {
                        this.showProjectDetail(projectId, focusedCard);
                    }
                } else if (focusedCert) {
                    e.preventDefault();
                    this.showCertificationDetail(focusedCert);
                }
            }
        });
    }

    createDetailModal() {
        // Local overlay positioned near clicked card
        const modal = document.createElement('div');
        modal.className = 'project-modal local';
        modal.setAttribute('aria-hidden','true');
        modal.setAttribute('role','dialog');
        modal.setAttribute('aria-modal','true');
        modal.setAttribute('aria-label','Project details');
        modal.innerHTML = `
            <div class="project-modal-overlay local-overlay">
                <div class="project-modal-shell">
                    <div class="project-modal-content">
                        <div class="project-nav-bar" style="position:absolute; top:12px; left:12px; display:flex; gap:.5rem; z-index:5;">
                            <button class="project-nav-btn prev" aria-label="Previous project" title="Previous (←)">◀</button>
                            <button class="project-nav-btn next" aria-label="Next project" title="Next (→)">▶</button>
                            <span class="project-progress" aria-live="off" style="padding:.35rem .6rem; font-size:.7rem; letter-spacing:.06em; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); border-radius:999px;">1 / 1</span>
                            <button class="project-copy-link" aria-label="Copy shareable link" title="Copy link" style="font-size:.75rem; padding:.35rem .6rem; border-radius:6px; border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.08);">🔗</button>
                        </div>
                        <button class="close-project-modal" aria-label="Close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        /*
                            DEPRECATED FILE (script.js)
                            --------------------------------------------------
                            This file is no longer referenced by any page.
                            All working logic lives in main.js.
                            Safe to delete after you confirm everything works.
                            Kept as a tiny stub to avoid 404s or accidental inclusion.
                        */
                        console.warn('[DEPRECATED] script.js is unused. Logic moved to main.js.');
                        (function(){ /* no-op stub */ })();

                        // End of deprecated stub.
                <div class="project-modal-shell">
                    <div class="project-modal-content">
                        <button class="close-project-modal" aria-label="Close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                        <div class="project-modal-body"></div>
                    </div>
                </div>
            </div>`;
        
        // Append to certifications section
        const certificationsSection = document.getElementById('certifications');
        if (certificationsSection) {
            certificationsSection.appendChild(modal);
        } else {
            document.body.appendChild(modal); // fallback
        }
        
        this.modal = modal;
        this.bindNavigation();
        this.bindCopyAndHelp();
    }

    showProjectDetail(projectId, cardElement) {
        // Always route via hash for consistent, reliable opening.
        // This avoids direct-call complexities and leverages the robust hashchange handler.
        const expectedHash = `project-${projectId}`;
        if (location.hash !== `#${expectedHash}`) {
            location.hash = expectedHash;
        } else {
            // If the hash is already correct but the modal isn't open, force a re-evaluation.
            /* DEPRECATED: This file is no longer loaded. All active logic moved to main.js. Retain temporarily for reference; safe to delete after verifying main.js. */
            console.warn('[DEPRECATED] script.js present but not used.');
            // Rebuilt clean script.js replacing corrupted mixed versions
            // Intentionally left minimal; previous large legacy implementation removed to prevent lint/build errors.
            // If needed for reference, check git history before this deprecation commit.
            // No functional code below.
            (()=>{})();

            // End of file.
            this.announce(`Opened project ${title}`);
            return;
        }

        // Prevent body scrolling for true popup behavior
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        this.currentCardElement = cardElement; // Store reference for close animation

        const modalBody = this.modal.querySelector('.project-modal-body');
        // Crossfade if already open
        if(this.modal.classList.contains('active')){
            const oldContent = modalBody.firstElementChild;
            const fadeOut = oldContent;
            if(fadeOut){
                fadeOut.style.transition='opacity 180ms ease';
                fadeOut.style.opacity='0';
                setTimeout(()=>{ if(fadeOut && fadeOut.parentNode) fadeOut.remove(); },190);
            }
            const tempWrapper = document.createElement('div');
            tempWrapper.innerHTML = this.generateProjectDetailHTML(project);
            const newNode = tempWrapper.firstElementChild;
            newNode.style.opacity='0';
            modalBody.appendChild(newNode);
            requestAnimationFrame(()=>{ newNode.style.transition='opacity 260ms ease'; newNode.style.opacity='1'; });
        } else {
            modalBody.innerHTML = this.generateProjectDetailHTML(project);
        }
        
        // Position modal as popup overlay (handle case where cardElement is null)
        if (cardElement) {
            this.positionModalNearCard(cardElement);
        } else {
            // Direct URL access - show modal without card animation
            this.showModalDirectly();
        }
        this.currentProjectId = projectId;
        
        // Only update hash if it's different to avoid triggering hashchange
        const expectedHash = `project-${projectId}`;
        if (location.hash !== `#${expectedHash}`) {
            // update hash
            location.hash = expectedHash; // guarded only for known projects
        } else {
            // hash already correct
        }
    this.preloadAdjacent(projectId);
    this.updateNavButtonStates();
    this.attachScrollParallax();
    this.announce(`Opened project ${project.title}`);
    analyticsTrack('project_modal_open', { projectId, title: project.title });
    this.updateProgress();
    this.bindCopyAndHelp();
    this.initLazySections();
        
    this.modal.classList.add('active');
    // modal activated
    
    // Force display if CSS didn't apply
    if (window.getComputedStyle(this.modal).display === 'none') {
        console.log('[Modal] WARNING: Modal still hidden, forcing display block');
        this.modal.style.display = 'block !important';
        this.modal.style.position = 'fixed';
        this.modal.style.top = '0';
        this.modal.style.left = '0';
        this.modal.style.width = '100vw';
        this.modal.style.height = '100vh';
        this.modal.style.zIndex = '999999';
        this.modal.style.pointerEvents = 'all';
    }
    
        this.modal.setAttribute('aria-hidden','false');

        // Focus first interactive element inside modal for accessibility
        const focusable = this.getFocusableElements();
        if(focusable.length){ focusable[0].focus({preventScroll:true}); }
        this.enableFocusTrap();

        // Post-activation fallback checks (in case animation path suppressed display)
        const ensureVisible = (attempt) => {
            if(!this.modal) return;
            const cs = window.getComputedStyle(this.modal);
            if(cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0){
                console.warn(`[Modal] Visibility check attempt ${attempt} failed -> forcing direct show`);
                this.showModalDirectly();
                this.modal.classList.add('active');
                this.modal.style.display = 'block';
            }
        };
        setTimeout(()=>ensureVisible(1), 50);
        setTimeout(()=>ensureVisible(2), 200);
        setTimeout(()=>ensureVisible(3), 600);
    }
    

    showCertificationDetail(cardElement) {
        if (!cardElement) return;
        
        // Extract certification data from the card
        const certName = cardElement.querySelector('.cert-name')?.textContent || 'Certification';
        const certOrg = cardElement.querySelector('.cert-org')?.textContent || '';
        const certBadge = cardElement.querySelector('.cert-badge img')?.src || '';
        const certTags = Array.from(cardElement.querySelectorAll('.cert-tags span')).map(span => span.textContent);
        
        // If modal doesn't exist, create it in the certifications section
        if (!this.modal) {
            this.createCertificationModal();
        }
        
        this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        this.currentCardElement = cardElement;
        
        const modalBody = this.modal.querySelector('.project-modal-body');
        modalBody.innerHTML = this.generateCertificationDetailHTML({
            name: certName,
            organization: certOrg,
            badge: certBadge,
            tags: certTags
        });
        
        // Position modal in certifications section
        this.positionModalInCertifications(cardElement);
        
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden','false');
        
        // Prevent body scrolling for true popup behavior
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        // Focus management
        const focusable = this.getFocusableElements();
        if(focusable.length){ focusable[0].focus({preventScroll:true}); }
        this.enableFocusTrap();
        
        this.announce(`Opened certification ${certName}`);
    }

    positionModalNearCard(cardElement) {
        // Always open modal in fullscreen mode, covering the entire viewport
        const modalContent = this.modal.querySelector('.project-modal-content');
        const overlay = this.modal.querySelector('.project-modal-overlay');
        if (!modalContent || !overlay) return;
        this.originatingCard = cardElement;
        // Set modal content to fullscreen and visible
        modalContent.style.position = 'fixed';
        modalContent.style.left = '0px';
        modalContent.style.top = '0px';
        modalContent.style.width = '100vw';
        modalContent.style.height = '100vh';
        modalContent.style.maxWidth = '100vw';
        modalContent.style.maxHeight = '100vh';
        modalContent.style.borderRadius = '0px';
        modalContent.style.opacity = '1';
        modalContent.style.zIndex = '999999';
        modalContent.style.display = 'block';
        overlay.style.background = 'rgba(0,0,0,0.95)';
        this.modal.classList.add('active');
        this.modal.style.display = 'block';
        this.modal.style.position = 'fixed';
        this.modal.style.zIndex = '1000000';
        this.modal.setAttribute('aria-hidden', 'false');
        // Fallback: forcibly show modal if hidden
        setTimeout(() => {
            if (window.getComputedStyle(this.modal).display === 'none' || window.getComputedStyle(modalContent).display === 'none') {
                this.modal.style.display = 'block';
                modalContent.style.display = 'block';
                this.modal.classList.add('active');
            }
        }, 100);
    }

    showModalDirectly() {
        // Show modal directly without card animation (for direct URL access)
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        
        const modalContent = this.modal.querySelector('.project-modal-content');
        const overlay = this.modal.querySelector('.project-modal-overlay');
        
        if (modalContent && overlay) {
            // Start with modal already at full size
            modalContent.style.width = '100vw';
            modalContent.style.height = '100vh';
            modalContent.style.left = '0px';
            modalContent.style.top = '0px';
            modalContent.style.borderRadius = '0px';
            modalContent.style.opacity = '0';
            
            overlay.style.background = 'rgba(0,0,0,0)';
            
            // Fade in
            requestAnimationFrame(() => {
                modalContent.style.transition = 'opacity 0.3s ease';
                overlay.style.transition = 'background 0.3s ease';
                modalContent.style.opacity = '1';
                overlay.style.background = 'rgba(0,0,0,0.95)';
            });
        }
    }

    positionModalInCertifications(cardElement) {
        if (!cardElement) return;
        
        const cardRect = cardElement.getBoundingClientRect();
        const modalContent = this.modal.querySelector('.project-modal-content');
        const overlay = this.modal.querySelector('.project-modal-overlay');
        const certificationsSection = document.getElementById('certifications');
        
        if (!certificationsSection || !modalContent) return;
        
        // Get certifications section position for relative positioning
        const sectionRect = certificationsSection.getBoundingClientRect();
        
        // Calculate card position relative to certifications section
        const relativeCardLeft = cardRect.left - sectionRect.left;
        const relativeCardTop = cardRect.top - sectionRect.top;
        
        // Check if mobile device
        const isMobile = window.innerWidth <= 768;
        
        // Full-screen modal covering entire viewport width but positioned within certifications section
        const modalWidth = window.innerWidth;
        let modalHeight, finalTop;
        
        if (isMobile) {
            modalHeight = Math.max(sectionRect.height - 5, window.innerHeight * 0.8);
            finalTop = 2;
        } else {
            modalHeight = sectionRect.height - 10;
            finalTop = 5;
        }
        
        const finalLeft = -sectionRect.left; // Offset to reach left edge of viewport
        
        // Start modal at card position
        modalContent.style.position = 'absolute';
        modalContent.style.left = `${relativeCardLeft}px`;
        modalContent.style.top = `${relativeCardTop}px`;
        modalContent.style.width = `${cardRect.width}px`;
        modalContent.style.height = `${cardRect.height}px`;
        modalContent.style.transform = 'scale(1)';
        modalContent.style.opacity = '0';
        modalContent.style.zIndex = '1201';
        overlay.style.background = 'rgba(0,0,0,0)';
        
        // Force reflow
        void modalContent.offsetWidth;
        
        // Animate to full-screen position
        const animationDuration = isMobile ? 500 : 600;
        modalContent.style.transition = `all ${animationDuration}ms cubic-bezier(.22,.61,.36,1)`;
        overlay.style.transition = `background ${animationDuration}ms ease`;
        
        requestAnimationFrame(() => {
            modalContent.style.left = `${finalLeft}px`;
            modalContent.style.top = `${finalTop}px`;
            modalContent.style.width = `${modalWidth}px`;
            modalContent.style.height = `${modalHeight}px`;
            modalContent.style.maxHeight = `${modalHeight}px`;
            modalContent.style.opacity = '1';
            overlay.style.background = 'rgba(0,0,0,.85)';
        });
        
        // Clean up transitions
        setTimeout(() => {
            modalContent.style.transition = '';
            overlay.style.transition = '';
        }, animationDuration + 50);
    }

    generateCertificationDetailHTML(cert) {
        return `
        <div class="project-detail-page cert-detail-page">
            <div class="detail-header" style="text-align: center; padding: 2rem 1rem;">
                <div class="cert-badge-large" style="width: 120px; height: 120px; margin: 0 auto 1.5rem; background: rgba(255,255,255,.1); border-radius: 24px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
                    ${cert.badge ? `<img src="${cert.badge}" alt="${cert.name}" style="width: 80px; height: 80px; object-fit: contain;">` : '🏆'}
                </div>
                <h1 style="margin: 0 0 0.5rem; font-size: 2rem; font-weight: 700; color: var(--text-primary);">${cert.name}</h1>
                <p style="margin: 0 0 1rem; font-size: 1.1rem; color: var(--text-secondary); font-weight: 500;">${cert.organization}</p>
                <div class="cert-tags-large" style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center;">
                    ${cert.tags.map(tag => `<span style="padding: 0.5rem 1rem; background: rgba(255,255,255,.15); border-radius: 999px; font-size: 0.9rem; font-weight: 500; color: var(--text-primary);">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="detail-content" style="padding: 0 2rem 2rem;">
                <div class="detail-section">
                    <h2 style="margin: 0 0 1rem; font-size: 1.5rem; color: var(--text-primary);">About This Certification</h2>
                    <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
                        This professional certification demonstrates expertise and proficiency in ${cert.name.toLowerCase()}. 
                        The certification covers essential skills and knowledge areas including ${cert.tags.slice(0, 3).join(', ')}.
                    </p>
                    
                    <div class="skills-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem;">
                        ${cert.tags.map(skill => `
                            <div style="padding: 1rem; background: rgba(255,255,255,.05); border-radius: 12px; border: 1px solid rgba(255,255,255,.1);">
                                <h3 style="margin: 0 0 0.5rem; font-size: 1rem; color: var(--text-primary);">${skill}</h3>
                                <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary);">Proficient in ${skill.toLowerCase()} concepts and applications</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>`;
    }

    closeModal() {
        if (this.modal) {
            // Restore body scrolling
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            
            const hasGeometry = this.modal.style.getPropertyValue('--start-width');
            if(!this.prefersReducedMotion && hasGeometry){
                this.modal.classList.add('animating-out');
                setTimeout(() => {
                    this.modal.classList.remove('active');
                    this.modal.classList.remove('animating-out');
                    this.modal.setAttribute('aria-hidden','true');
                }, 400);
            } else {
                // Simple fade
                const content = this.modal.querySelector('.project-modal-content');
                const overlay = this.modal.querySelector('.project-modal-overlay');
                if(content && overlay){
                    content.style.transition='opacity .25s ease';
                    overlay.style.transition='background .25s ease';
                    content.style.opacity='0';
                    overlay.style.background='rgba(0,0,0,0)';
                    setTimeout(()=>{
                        this.modal.classList.remove('active');
                        this.modal.setAttribute('aria-hidden','true');
                        content.style.opacity='';
                        overlay.style.background='';
                    },250);
                } else {
                    this.modal.classList.remove('active');
                    this.modal.setAttribute('aria-hidden','true');
                }
            }

            // Return focus to originating card
            if(this.originatingCard && typeof this.originatingCard.focus === 'function') {
                this.originatingCard.focus({preventScroll:true});
            } else if(this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
                this.lastFocusedElement.focus({preventScroll:true});
            }
            
            this.disableFocusTrap();
            if(location.hash === `#project-${this.currentProjectId}`){
                history.replaceState('', document.title, location.pathname + location.search);
            }
            analyticsTrack('project_modal_close', { projectId: this.currentProjectId });
            this.currentProjectId = null;
            this.originatingCard = null; // Clear reference
        }
    }

    computeProjectOrder(){
        return Array.from(document.querySelectorAll('.netflix-card[data-project]')).map(c=>c.dataset.project);
    }
    bindNavigation(){
        const prev = this.modal.querySelector('.project-nav-btn.prev');
        const next = this.modal.querySelector('.project-nav-btn.next');
        if(prev) prev.addEventListener('click', ()=> this.navigate(-1));
        if(next) next.addEventListener('click', ()=> this.navigate(1));
        document.addEventListener('keydown', (e)=>{
            if(!this.modal.classList.contains('active')) return;
            if(e.key==='ArrowLeft'){ e.preventDefault(); this.navigate(-1); }
            if(e.key==='ArrowRight'){ e.preventDefault(); this.navigate(1); }
        });
        const overlay = this.modal.querySelector('.project-modal-overlay');
        if(overlay){
            overlay.addEventListener('touchstart', (e)=>{ if(e.touches.length===1){ this.swipeData = {x:e.touches[0].clientX, t:Date.now()}; } }, {passive:true});
            overlay.addEventListener('touchend', (e)=>{ if(!this.swipeData) return; const dx = e.changedTouches[0].clientX - this.swipeData.x; const dt = Date.now()-this.swipeData.t; if(Math.abs(dx)>60 && dt<500){ this.navigate(dx<0?1:-1); } this.swipeData=null; });
        }
        // Add a subtle keyboard hint bar once per modal creation
        if(!this.modal.querySelector('.project-keyboard-hints')){
            const bar = document.createElement('div');
            bar.className = 'project-keyboard-hints';
            bar.style.cssText = 'position:absolute; right:12px; top:12px; display:flex; gap:.4rem; font-size:.6rem; font-weight:500; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); padding:.35rem .55rem; border-radius:6px; letter-spacing:.05em;';
            bar.innerHTML = '<span>← / →</span><span style="opacity:.7">navigate</span><span>Esc</span><span style="opacity:.7">close</span>';
            this.modal.querySelector('.project-modal-content').appendChild(bar);
        }
    }
    navigate(direction){
        if(!this.currentProjectId) return; 
        const order = this.projectOrder; 
        const idx = order.indexOf(this.currentProjectId); 
        if(idx===-1) return; 
        const nextIdx = idx + direction; 
        if(nextIdx<0 || nextIdx>=order.length) return; 
        const nextId = order[nextIdx]; 
        const card = document.querySelector(`.netflix-card[data-project="${nextId}"]`); 
        const prevTitle = this.getProjectData(this.currentProjectId)?.title || '';
        this.showProjectDetail(nextId, card); 
        const newTitle = this.getProjectData(nextId)?.title || '';
        this.announce(`Moved from ${prevTitle} to ${newTitle}`);
    }
    updateNavButtonStates(){ 
        const prev = this.modal.querySelector('.project-nav-btn.prev'); 
        const next = this.modal.querySelector('.project-nav-btn.next'); 
        if(!prev||!next) return; 
        const idx = this.projectOrder.indexOf(this.currentProjectId); 
        prev.disabled = idx<=0; 
        next.disabled = idx>=this.projectOrder.length-1; 
        [prev,next].forEach(btn=>{ if(!btn) return; btn.style.opacity = btn.disabled ? '.35' : '1'; btn.style.pointerEvents = btn.disabled ? 'none':'auto'; });
    }
    updateProgress(){ const prog = this.modal.querySelector('.project-progress'); if(!prog || !this.currentProjectId) return; const idx = this.projectOrder.indexOf(this.currentProjectId); prog.textContent = `${idx+1} / ${this.projectOrder.length}`; }
    preloadAdjacent(id){ const idx = this.projectOrder.indexOf(id); [-1,1].forEach(d=>{ const t = this.projectOrder[idx+d]; if(t){ const data=this.getProjectData(t); if(data && data.image){ const img=new Image(); img.src=data.image; } } }); }
    handleHashChange() { 
        console.log('[Hash] handleHashChange called, current hash:', location.hash);
        const wanted = location.hash.replace('#project-', ''); 
        console.log('[Hash] Extracted project ID:', wanted);
        
        // If no hash or not a project hash, close modal if open
        if (!wanted) { 
            console.log('[Hash] No project ID, closing modal if open');
            if (this.modal && this.modal.classList.contains('active')) {
                this.closeModal(); 
            }
            return; 
        } 
        
        // If already showing this project, do nothing
        if (wanted === this.currentProjectId) {
            console.log('[Hash] Already showing this project:', wanted);
            return; 
        }
        
        // Check if project data exists
        const projectData = this.getProjectData(wanted);
        console.log('[Hash] Project data found:', !!projectData);
        if (!projectData) {
            console.log('[Hash] No project data for:', wanted);
            return; 
        }
        
        // Find the card element
        const card = document.querySelector(`.netflix-card[data-project="${wanted}"]`); 
        console.log('[Hash] Card element found:', !!card);
        
        // Show the project detail
        console.log('[Hash] Calling showProjectDetail for hash change');
        this.showProjectDetail(wanted, card); 
    }
    attachScrollParallax(){ const body = this.modal.querySelector('.project-modal-body'); const content = this.modal.querySelector('.project-modal-content'); if(!body||!content) return; const handler=()=>{ const y=body.scrollTop; content.classList.toggle('scrolling', y>0); content.style.setProperty('--scroll', y); }; body.removeEventListener('scroll', this._parallaxHandler||(()=>{})); this._parallaxHandler=handler; body.addEventListener('scroll', handler, {passive:true}); }
    bindCopyAndHelp(){
        const copyBtn = this.modal.querySelector('.project-copy-link');
        if(copyBtn && !copyBtn._bound){
            copyBtn._bound = true;
            copyBtn.addEventListener('click', ()=>{
                const url = location.origin + location.pathname + `#project-${this.currentProjectId}`;
                navigator.clipboard.writeText(url).then(()=>{ 
                    copyBtn.textContent='✅'; 
                    showToast('Link copied to clipboard');
                    setTimeout(()=>{ copyBtn.textContent='🔗'; },1200); 
                    this.announce('Link copied'); 
                }).catch(()=>{ showToast('Copy failed'); });
            });
        }
        // QR button integration
        const navBar = this.modal.querySelector('.project-nav-bar');
        if(navBar && !navBar.querySelector('.project-qr-btn')){
            const qrBtn = document.createElement('button');
            qrBtn.type='button';
            qrBtn.className='project-qr-btn';
            qrBtn.setAttribute('aria-label','Show QR code for this project');
            qrBtn.textContent='QR';
            qrBtn.style.cssText='font-size:.7rem; padding:.35rem .55rem; border-radius:6px; border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.08);';
            navBar.appendChild(qrBtn);
            qrBtn.addEventListener('click', ()=> this.showQrForCurrent());
        }
    }
    showQrForCurrent(){
        if(!this.currentProjectId) return;
        const shareUrl = encodeURIComponent(location.origin + location.pathname + `#project-${this.currentProjectId}`);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${shareUrl}`;
        let overlay = document.querySelector('.qr-overlay');
        if(!overlay){
            overlay = document.createElement('div');
            overlay.className='qr-overlay';
            overlay.style.cssText='position:fixed; inset:0; background:rgba(0,0,0,.65); display:flex; align-items:center; justify-content:center; z-index:2000001;';
            overlay.innerHTML=`<div class="qr-box" style="background:#111; padding:1.2rem 1.4rem 1.4rem; border-radius:14px; position:relative; box-shadow:0 8px 32px -8px rgba(0,0,0,.7); text-align:center; max-width:280px;">
                <button class="qr-close" aria-label="Close" style="position:absolute; top:6px; right:6px; background:rgba(255,255,255,.12); border:none; color:#fff; width:30px; height:30px; border-radius:50%; cursor:pointer;">✕</button>
                <h3 style="margin:0 0 .75rem; font-size:.9rem; letter-spacing:.05em; font-weight:600;">Share Project</h3>
                <img class="qr-img" src="${qrUrl}" alt="QR code" style="width:220px; height:220px; border-radius:8px; background:#000; object-fit:contain;" />
                <p style="margin:.7rem 0 0; font-size:.65rem; line-height:1.2; color:#aaa;">Scan on your phone to open<br><span style="color:#fff;">${this.currentProjectId}</span></p>
            </div>`;
            document.body.appendChild(overlay);
            overlay.addEventListener('click', (e)=>{ if(e.target===overlay) overlay.remove(); });
            overlay.querySelector('.qr-close').addEventListener('click', ()=> overlay.remove());
        } else {
            overlay.querySelector('.qr-img').src = qrUrl;
            const span = overlay.querySelector('span'); if(span) span.textContent = this.currentProjectId;
        }
        showToast('QR code ready');
    }
                <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.54-7-7.93 0-.34.02-.68.05-1h2.54c-.03.32-.05.66-.05 1 0 3.31 2.69 6 6 6 .34 0 .68-.02 1-.05v2.54c-.32.03-.66.05-1 .05zm4.88-2.12l-1.42 1.42-3.54-3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.95.42-1.34.71l-3.54-3.54-1.42 1.42 3.54 3.54c-.39.29-.84.54-1.34.71v-2.54c.5-.17.95-.42 1.34-.71l3.54 3.54 1.42-1.42-3.54-3.54c.39-.29.84-.54 1.34-.71v2.54c-.5.17-.
                if(document.activeElement === first){
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if(document.activeElement === last){
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }

    enableFocusTrap(){
        document.addEventListener('keydown', this.handleKeyDown, true);
    }
    disableFocusTrap(){
        document.removeEventListener('keydown', this.handleKeyDown, true);
    }


    getAllProjects() {
        const projects = this.getProjectsData();
        return projects;
    }

    getProjectData(projectId) {
        const projects = this.getProjectsData();
        return projects[projectId];
    }

    getProjectsData() {
        return {
            'mobilellm': {
                title: '🤖 MobileLLM-125M Fine-Tuning & Deployment',
                subtitle: 'Advanced Language Model Production System',
                image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
                description: 'Production-ready deployment of Facebook\'s MobileLLM-125M with comprehensive fine-tuning pipeline, quantized inference, and scalable API architecture.',
                longDescription: 'This project implements a complete MLOps pipeline for Facebook\'s MobileLLM-125M, featuring zero-shot reasoning capabilities on the HellaSwag dataset. The system combines parameter-efficient fine-tuning with production-grade deployment using FastAPI streaming, Docker orchestration, and automatic model scaling.',
                metrics: [
                    { label: 'Validation Accuracy', value: '62.8%', icon: '🎯' },
                    { label: 'Perplexity Score', value: '7.91', icon: '📊' },
                    { label: 'Inference Speed', value: '<100ms', icon: '⚡' },
                    { label: 'Model Size', value: '125M params', icon: '🧠' }
                ],
                technologies: [
                    { name: 'MobileLLM', category: 'Model' },
                    { name: 'PyTorch', category: 'Framework' },
                    { name: 'FastAPI', category: 'API' },
                    { name: 'Docker', category: 'Deployment' },
                    { name: 'CUDA', category: 'Acceleration' },
                    { name: 'HellaSwag', category: 'Dataset' }
                ],
                features: [
                    'Multi-GPU fine-tuning pipeline',
                    'Quantized inference optimization',
                    'Streaming SSE responses',
                    'Docker containerization',
                    'Automatic model scaling',
                    'Zero-shot reasoning capabilities'
                ],
                architecture: {
                    title: 'System Architecture',
                    description: 'Microservices architecture with FastAPI backend, Redis caching, and horizontal scaling.',
                    components: [
                        'FastAPI streaming endpoints',
                        'Multi-GPU training orchestration',
                        'Model quantization pipeline',
                        'Docker container orchestration',
                        'Automatic scaling logic'
                    ]
                },
                github: 'https://github.com/saiprudvi0102/MobileLLM125M',
                demo: null
            },
            'financial-risk': {
                title: '📈 GPU-Accelerated Financial Risk Analysis',
                subtitle: 'CUDA-Powered Monte Carlo Simulation & Portfolio Risk Assessment',
                image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
                description: 'Advanced financial risk assessment system leveraging NVIDIA CUDA for parallel Monte Carlo simulations, demonstrating significant performance improvements in covariance matrix calculations and Value at Risk (VaR) computation.',
                longDescription: 'This project explores GPU computing applications in financial analytics, focusing on accelerating covariance matrix computations for large financial datasets. The implementation compares traditional CPU-based methods with CUDA-powered GPU implementations, demonstrating how GPU acceleration becomes increasingly beneficial as dataset size grows. The system calculates Value at Risk (VaR) and provides comprehensive benchmarking across multiple dataset sizes.',
                metrics: [
                    { label: 'GPU Performance Gain', value: '1.57× @ 1M days', icon: '🚀' },
                    { label: 'Covariance Matrix Speed', value: '0.43s vs 0.75s CPU', icon: '⚡' },
                    { label: 'Dataset Scale', value: '1M+ trading days', icon: '📊' },
                    { label: 'Memory Optimization', value: 'CUDA Toolkit 11.0+', icon: '💾' }
                ],
                technologies: [
                    { name: 'NVIDIA CUDA', category: 'GPU Computing' },
                    { name: 'PyCUDA', category: 'Python CUDA Bindings' },
                    { name: 'NumPy', category: 'Numerical Computing' },
                    { name: 'Matplotlib', category: 'Data Visualization' },
                    { name: 'Python', category: 'Core Language' },
                    { name: 'Jupyter Notebooks', category: 'Development Environment' }
                ],
                features: [
                    'Monte Carlo simulation engine with GPU acceleration',
                    'Comparative CPU vs GPU performance benchmarking',
                    'Value at Risk (VaR) calculation for portfolio assessment',
                    'Covariance matrix computation optimization',
                    'Scalability testing across multiple dataset sizes',
                    'Financial risk metrics visualization and analysis',
                    'Synthetic financial data generation for testing',
                    'Memory-efficient CUDA kernel implementations'
                ],
                architecture: {
                    title: 'GPU-Accelerated Financial Computing Architecture',
                    description: 'CUDA-optimized parallel processing pipeline with comparative analysis framework for financial risk calculations.',
                    components: [
                        'CUDA kernel implementations for parallel matrix operations',
                        'PyCUDA Python bindings for GPU memory management',
                        'Monte Carlo simulation framework with GPU acceleration',
                        'Comparative benchmarking system (CPU vs GPU)',
                        'Financial dataset generation and preprocessing pipeline',
                        'Performance visualization and analysis tools'
                    ]
                },
                github: 'https://github.com/saiprudvi0102/Finance-Risk-Analysis-GPU',
                demo: null
            },
            'pcnn-shadow': {
                title: '🖼️ PCNN Shadow Removal Research',
                subtitle: 'Biologically-Inspired Neural Network for Advanced Image Processing',
                image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=1200&q=80',
                description: 'Advanced computer vision research utilizing Pulse Coupled Neural Networks (PCNNs) for intelligent shadow detection and removal, achieving state-of-the-art performance with biologically-inspired algorithms.',
                longDescription: 'This research project implements a novel approach to image shadow removal using Pulse Coupled Neural Networks (PCNNs), inspired by the visual cortex of small mammals. The system leverages dynamic connection strengths and adaptive thresholding to effectively detect and remove shadows while preserving image details and integrity. The modified PCNN algorithm demonstrates significant improvements over traditional shadow removal techniques through advanced segmentation and processing capabilities.',
                metrics: [
                    { label: 'Shadow Detection Accuracy', value: '94.2%', icon: '🎯' },
                    { label: 'Image Quality Index', value: '0.89', icon: '🖼️' },
                    { label: 'Processing Speed', value: '1.2 seconds', icon: '⚡' },
                    { label: 'Performance vs GMM', value: '+11.6% accuracy', icon: '�' }
                ],
                technologies: [
                    { name: 'TensorFlow', category: 'Neural Network Framework' },
                    { name: 'OpenCV', category: 'Computer Vision' },
                    { name: 'NumPy', category: 'Numerical Computing' },
                    { name: 'PCNN', category: 'Neural Network Architecture' },
                    { name: 'Python', category: 'Core Language' },
                    { name: 'Matplotlib', category: 'Visualization' }
                ],
                features: [
                    'Biologically-inspired Pulse Coupled Neural Network implementation',
                    'Dynamic connection strength adaptation for improved accuracy',
                    'Adaptive thresholding for varying shadow intensities',
                    'Preservation of original image details in non-shadow regions',
                    'Comparative analysis with traditional shadow removal techniques',
                    'GPU acceleration for efficient processing',
                    'Advanced segmentation algorithms for shadow detection',
                    'Research-grade evaluation metrics and benchmarking'
                ],
                architecture: {
                    title: 'PCNN Research Architecture',
                    description: 'Biologically-inspired neural network with feeding and linking inputs, dynamic thresholding, and adaptive connection strengths for image segmentation.',
                    components: [
                        'PCNN neuron implementation with feeding and linking fields',
                        'Dynamic connection strength adaptation mechanism',
                        'Adaptive threshold decay for varying shadow intensities',
                        'Shadow segmentation and detection algorithms',
                        'Image reconstruction and enhancement pipeline',
                        'Comparative evaluation framework with traditional methods'
                    ]
                },
                github: 'https://github.com/saiprudvi0102/PCNN-Shadow-Removal',
                demo: null
            },
            'iot-fpga': {
                title: '⚡ Enhanced IoT Anomaly Detection Using FPGA',
                subtitle: 'Hardware-Accelerated Real-Time Security System',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
                description: 'Real-time anomaly detection system for IoT networks using FPGA hardware acceleration on PYNQ Z2 board, achieving microsecond detection speeds for network security applications.',
                longDescription: 'This project implements a cutting-edge real-time anomaly detection system for IoT networks using FPGA hardware acceleration. The system utilizes a PYNQ Z2 FPGA board to detect potentially malicious network traffic patterns within microseconds, demonstrating the significant benefits of hardware acceleration for time-critical security applications. The implementation processes the IoT-23 dataset with over 325 million records, featuring a two-stage process of GPU-based neural network training and FPGA-accelerated inference.',
                metrics: [
                    { label: 'Detection Speed', value: 'Microseconds', icon: '⚡' },
                    { label: 'Dataset Scale', value: '325M+ records', icon: '📊' },
                    { label: 'Feature Classes', value: '18 features', icon: '🔧' },
                    { label: 'Hardware Platform', value: 'PYNQ Z2 FPGA', icon: '💾' }
                ],
                technologies: [
                    { name: 'PYNQ Z2', category: 'FPGA Hardware' },
                    { name: 'Vivado Design Suite', category: 'FPGA Development' },
                    { name: 'VHDL', category: 'Hardware Description' },
                    { name: 'Python/PYNQ', category: 'Control Interface' },
                    { name: 'IoT-23 Dataset', category: 'Security Dataset' },
                    { name: 'AXI Interface', category: 'Data Pipeline' }
                ],
                features: [
                    'Real-time IoT network traffic anomaly detection',
                    'Hardware-accelerated neural network inference on FPGA',
                    'GPU-based neural network training pipeline',
                    'Python/PYNQ interface for data processing and FPGA control',
                    'Visual indicator system (LED) for immediate anomaly alerts',
                    'Microsecond detection speeds with hardware acceleration',
                    'IoT-23 dataset processing with 18 feature classification',
                    'AXI-based interface for high-speed data transfer'
                ],
                architecture: {
                    title: 'FPGA Hardware-Software Co-Design Architecture',
                    description: 'Two-stage system with GPU training and FPGA inference, featuring AXI interfaces and optimized data flow for real-time processing.',
                    components: [
                        'GPU-based neural network model development using IoT-23 dataset',
                        'FPGA-accelerated inference engine with hardware-optimized implementation',
                        'Input/output ports for clock, reset, data, and anomaly detection flags',
                        'AXI-based interface for high-speed data transfer',
                        'Python script integration for SD card data reading',
                        'Visual indicator system with LED alerts for anomaly detection'
                    ]
                },
                github: 'https://github.com/saiprudvi0102/AnomalyDetection',
                demo: null
            },
            'genai-clinical': {
                title: '🏥 GenAI Clinical Assistant',
                subtitle: 'LangChain-Powered Medical AI',
                image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80',
                description: 'Advanced clinical decision support system using LangChain orchestration with GPT-4 for medical documentation and patient care.',
                longDescription: 'Comprehensive medical AI assistant leveraging LangChain for complex reasoning workflows, medical documentation automation, and clinical decision support. The system processes thousands of medical records with high accuracy.',
                metrics: [
                    { label: 'Processing Volume', value: '10K+ records', icon: '📋' },
                    { label: 'Accuracy Rate', value: '94.5%', icon: '🎯' },
                    { label: 'Response Time', value: '<3 sec', icon: '⚡' },
                    { label: 'Medical Compliance', value: '99.8%', icon: '✅' }
                ],
                technologies: [
                    { name: 'LangChain', category: 'AI Orchestration' },
                    { name: 'OpenAI GPT-4', category: 'Language Model' },
                    { name: 'FastAPI', category: 'API Framework' },
                    { name: 'PostgreSQL', category: 'Database' },
                    { name: 'Docker', category: 'Deployment' },
                    { name: 'HIPAA', category: 'Compliance' }
                ],
                features: [
                    'Medical documentation automation',
                    'Clinical decision support',
                    'HIPAA-compliant processing',
                    'Multi-modal medical data',
                    'Real-time patient insights',
                    'Medical coding assistance'
                ],
                architecture: {
                    title: 'AI Pipeline Architecture',
                    description: 'LangChain orchestration with secure medical data processing and compliance.',
                    components: [
                        'LangChain workflow engine',
                        'GPT-4 integration layer',
                        'Medical data processing',
                        'HIPAA compliance layer',
                        'Clinical validation system'
                    ]
                },
                github: null,
                demo: null
            },
            'telecom-microservices': {
                title: '📡 Telecom Microservices Platform',
                subtitle: 'Enterprise-Scale Java Architecture',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
                description: 'Large-scale microservices architecture for telecom operations handling millions of daily transactions with high availability.',
                longDescription: 'Enterprise telecom platform built with Spring Boot microservices, handling massive transaction volumes with Oracle/PostgreSQL integration, async processing, and comprehensive monitoring.',
                metrics: [
                    { label: 'Daily Transactions', value: '120K+', icon: '📊' },
                    { label: 'Microservices', value: '40+', icon: '🔧' },
                    { label: 'Incident Response', value: '38% faster', icon: '🚨' },
                    { label: 'Uptime', value: '99.9%', icon: '✅' }
                ],
                technologies: [
                    { name: 'Spring Boot', category: 'Framework' },
                    { name: 'Java', category: 'Core Language' },
                    { name: 'Oracle DB', category: 'Database' },
                    { name: 'PostgreSQL', category: 'Database' },
                    { name: 'JMS', category: 'Messaging' },
                    { name: 'AWS', category: 'Cloud Platform' }
                ],
                features: [
                    'Spring Boot microservices',
                    'Async message processing',
                    'Database optimization',
                    'AWS S3 lifecycle management',
                    'System health monitoring',
                    'Automated alert workflows'
                ],
                architecture: {
                    title: 'Microservices Architecture',
                    description: 'Distributed system with service mesh, API gateway, and comprehensive monitoring.',
                    components: [
                        'Spring Boot microservices',
                        'API Gateway routing',
                        'Database connection pooling',
                        'JMS message queues',
                        'AWS cloud integration'
                    ]
                },
                github: null,
                demo: null
            },
            'dormunity': {
                title: '🏫 DormUnity Super App',
                subtitle: 'Flutter Campus Life Platform',
                image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
                description: 'Comprehensive Flutter-based campus super app integrating ridesharing, accommodation, and social networking for student life.',
                longDescription: 'Revolutionary campus life platform built with Flutter, featuring three core modules: ridesharing, accommodation management, and social networking. Uses Provider/BLoC for state management and Firebase for real-time synchronization.',
                metrics: [
                    { label: 'Active Users', value: '2.5K+', icon: '👥' },
                    { label: 'Ride Requests', value: '15K+', icon: '🚗' },
                    { label: 'App Rating', value: '4.7/5', icon: '⭐' },
                    { label: 'Performance Score', value: '95', icon: '📱' }
                ],
                technologies: [
                    { name: 'Flutter', category: 'Mobile Framework' },
                    { name: 'Firebase', category: 'Backend' },
                    { name: 'Provider/BLoC', category: 'State Management' },
                    { name: 'Google Maps', category: 'Location Services' },
                    { name: 'Push Notifications', category: 'Communication' },
                    { name: 'Real-time Chat', category: 'Messaging' }
                ],
                features: [
                    'Ridesharing coordination',
                    'Accommodation finder',
                    'Social networking',
                    'Real-time chat system',
                    'Push notifications',
                    'Location-based services'
                ],
                architecture: {
                    title: 'Mobile App Architecture',
                    description: 'Modular Flutter architecture with Firebase backend and real-time synchronization.',
                    components: [
                        'Flutter modular architecture',
                        'Provider/BLoC state management',
                        'Firebase real-time database',
                        'Google Maps integration',
                        'Push notification system'
                    ]
                },
                github: 'https://github.com/saiprudvi0102/Profile',
                demo: 'https://play.google.com/store/apps/details?id=com.anonymous.studentnetworkapp'
            },
            'stylestitch': {
                title: '👗 StyleStitch Fashion Platform',
                subtitle: 'AI-Powered Fashion Recommendation',
                image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
                description: 'Flutter-based fashion e-commerce platform with AI-powered style recommendations and social shopping features.',
                longDescription: 'Modern fashion platform combining e-commerce with social networking, featuring AI-powered style recommendations, virtual try-on capabilities, and community-driven fashion discovery.',
                metrics: [
                    { label: 'Recommendation Accuracy', value: '87%', icon: '🎯' },
                    { label: 'User Engagement', value: '45 min avg', icon: '📱' },
                    { label: 'Conversion Rate', value: '12.3%', icon: '💰' },
                    { label: 'Fashion Items', value: '50K+', icon: '👗' }
                ],
                technologies: [
                    { name: 'Flutter', category: 'Mobile Framework' },
                    { name: 'Machine Learning', category: 'AI Recommendations' },
                    { name: 'Firebase', category: 'Backend' },
                    { name: 'Computer Vision', category: 'Image Processing' },
                    { name: 'Payment Integration', category: 'Commerce' },
                    { name: 'Social Features', category: 'Community' }
                ],
                features: [
                    'AI style recommendations',
                    'Virtual try-on technology',
                    'Social fashion feed',
                    'Secure payment processing',
                    'Inventory management',
                    'User-generated content'
                ],
                architecture: {
                    title: 'Fashion Platform Architecture',
                    description: 'AI-driven recommendation engine with social features and e-commerce integration.',
                    components: [
                        'Flutter mobile application',
                        'AI recommendation engine',
                        'Firebase cloud functions',
                        'Payment gateway integration',
                        'Social media features'
                    ]
                },
                github: 'https://github.com/saiprudvi0102/Profile',
                demo: null
            }
            ,
            'mobile-architecture': {
                title: '📲 Mobile Architecture Patterns',
                subtitle: 'Clean Architecture & State Management',
                image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80',
                description: 'Advanced mobile development patterns including Provider/BLoC state management, clean modular architecture, and performance optimization.',
                longDescription: 'This collection demonstrates advanced mobile architectural strategies: layered clean architecture (domain, data, presentation), Provider & BLoC state management comparisons, repository abstraction, dependency injection, and performance instrumentation. Includes lazy feature loading, strategic widget rebuild minimization, and offline-first data sync patterns.',
                metrics: [
                    { label: 'Cold Start Reduction', value: '−28%', icon: '⚡' },
                    { label: 'Rebuild Savings', value: '−42% widgets', icon: '🧩' },
                    { label: 'Test Coverage', value: '82%', icon: '🧪' },
                    { label: 'Architecture Layers', value: '3-tier', icon: '🏗️' }
                ],
                technologies: [
                    { name: 'Flutter', category: 'Framework' },
                    { name: 'Provider', category: 'State' },
                    { name: 'BLoC', category: 'State' },
                    { name: 'Isolates', category: 'Concurrency' },
                    { name: 'SQLite', category: 'Storage' },
                    { name: 'DIO', category: 'Networking' }
                ],
                features: [
                    'Clean architecture layering',
                    'Repository & use-case pattern',
                    'Provider vs BLoC implementations',
                    'Offline-first sync & caching',
                    'Structured error handling',
                    'Performance profiling instrumentation'
                ],
                architecture: {
                    title: 'Clean Architecture Overview',
                    description: 'Separation of concerns via domain/use-case, data repositories, and presentation state layers with dependency inversion.',
                    components: [
                        'Domain layer use-cases',
                        'Repository abstractions',
                        'Data providers (REST / cache)',
                        'BLoC state transformers',
                        'Provider context trees',
                        'Isolate-based heavy task offloading'
                    ]
                },
                github: null,
                demo: null
            },
            'performance-analytics': {
                title: '📈 Performance Analytics Suite',
                subtitle: 'GPU vs CPU Benchmarking Harness',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                description: 'Comprehensive benchmarking suite for GPU vs CPU analysis with adaptive grid sizing, instrumentation, and visualization.',
                longDescription: 'Framework for comparative performance analysis across heterogeneous compute backends. Provides adaptive workload generation, statistical stabilization (warm-up + multiple sample runs), memory bandwidth sampling, and exportable metric dashboards. Focus areas: matrix ops, transform kernels, reduction strategies, and cache behavior exploration.',
                metrics: [
                    { label: 'Benchmarks Implemented', value: '25+', icon: '🧪' },
                    { label: 'Max Observed Speedup', value: '37×', icon: '🚀' },
                    { label: 'Sampling Variance', value: '<5%', icon: '📊' },
                    { label: 'Report Formats', value: 'CSV/HTML', icon: '📄' }
                ],
                technologies: [
                    { name: 'CUDA', category: 'GPU' },
                    { name: 'NumPy', category: 'CPU Compute' },
                    { name: 'Pandas', category: 'Data' },
                    { name: 'Matplotlib', category: 'Visualization' },
                    { name: 'Python', category: 'Language' },
                    { name: 'Jupyter', category: 'Environment' }
                ],
                features: [
                    'Adaptive workload scaling',
                    'GPU vs CPU comparative timing',
                    'Warm & steady-state sampling',
                    'Outlier rejection & smoothing',
                    'Memory & cache probe hooks',
                    'Automated report generation'
                ],
                architecture: {
                    title: 'Benchmark Harness Architecture',
                    description: 'Modular runners with pluggable kernels and instrumentation pipeline.',
                    components: [
                        'Kernel abstraction layer',
                        'Timing & stats aggregator',
                        'Adaptive parameter tuner',
                        'Result persistence layer',
                        'Visualization/report generator'
                    ]
                },
                github: null,
                demo: null
            },
            'cloud-infrastructure': {
                title: '☁️ Cloud Infrastructure Blueprint',
                subtitle: 'Scalable Multi-Cloud Deployment Stack',
                image: 'https://images.unsplash.com/photo-1509966756634-9c23dd6e6815?auto=format&fit=crop&w=1200&q=80',
                description: 'Scalable cloud infrastructure design using AWS/GCP, Kubernetes orchestration, CI/CD automation, and observability.',
                longDescription: 'Blueprint architecture implementing multi-cloud ready infrastructure: production-grade Kubernetes clusters, GitOps-driven deployments, secure secret management, autoscaling policies, multi-stage CI/CD, blue/green rollout strategy, and full-spectrum observability (metrics, logs, traces). Emphasis on reliability, portability, and operational ergonomics.',
                metrics: [
                    { label: 'Deployment Frequency', value: '20+/day', icon: '🔄' },
                    { label: 'MTTR Reduction', value: '−55%', icon: '⏱️' },
                    { label: 'Uptime Target', value: '99.95%', icon: '✅' },
                    { label: 'Cost Optimization', value: '−23%', icon: '💰' }
                ],
                technologies: [
                    { name: 'Kubernetes', category: 'Orchestration' },
                    { name: 'AWS/GCP', category: 'Cloud Platforms' },
                    { name: 'Terraform', category: 'IaC' },
                    { name: 'GitHub Actions', category: 'CI/CD' },
                    { name: 'Prometheus/Grafana', category: 'Observability' },
                    { name: 'Helm', category: 'Packaging' }
                ],
                features: [
                    'GitOps deployment flow',
                    'Blue/green & canary rollout',
                    'Autoscaling policies',
                    'Centralized logging & tracing',
                    'Multi-stage environments',
                    'Security & secret management'
                ],
                architecture: {
                    title: 'Infrastructure Architecture',
                    description: 'Declarative provisioning, container orchestration, and observability stack.',
                    components: [
                        'Terraform infrastructure modules',
                        'K8s cluster & workloads',
                        'Ingress & service mesh',
                        'CI/CD pipeline stages',
                        'Monitoring & alerting stack'
                    ]
                },
                github: null,
                demo: null
            }
        };
    }

    generateProjectDetailHTML(project){
        const parts = [
            '<div class="project-detail">',
                <div class="project-hero">
                    <img src="${project.image}" alt="${project.title}" class="project-hero-image">
                    <div class="project-hero-overlay">
                        <div class="project-hero-content">
                            <h1 class="project-title">${project.title}</h1>
                            <p class="project-subtitle">${project.subtitle}</p>
                            <div class="project-actions">
                                ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-primary">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                    </svg>
                                    View Code
                                </a>` : ''}
                                ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn btn-secondary">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                    Live Demo
                                </a>` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="project-content">
                    <div class="project-section">
                        <h3>Project Overview</h3>
                        <p class="project-description">${project.longDescription}</p>
                    </div>

                    <div class="project-metrics">
                        <h3>Key Metrics & Performance</h3>
                        <div class="metrics-grid">
                            ${project.metrics.map(metric => `
                                <div class="metric-card">
                                    <div class="metric-icon">${metric.icon}</div>
                                    <div class="metric-content">
                                        <div class="metric-value">${metric.value}</div>
                                        <div class="metric-label">${metric.label}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="project-tech">
                        <h3>Technologies & Tools</h3>
                        <div class="tech-grid">
                            ${project.technologies.map(tech => `
                                <div class="tech-item">
                                    <span class="tech-name">${tech.name}</span>
                                    <span class="tech-category">${tech.category}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="project-features">
                        <h3>Key Features</h3>
                        <div class="features-list">
                            ${project.features.map(feature => `
                                <div class="feature-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="feature-icon">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                    </svg>
                                    ${feature}
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="project-architecture">
                        <h3>${project.architecture.title}</h3>
                        <p class="architecture-description">${project.architecture.description}</p>
                        <div class="architecture-components">
                            ${project.architecture.components.map(component => `
                                <div class="component-item">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    ${component}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                     '</div>',
                 '</div>'
          ];
          return parts.join('');
        }
}

// Toast utility (moved outside class to avoid method parsing issues)
function showToast(message, {duration=2200} = {}) {
    try {
        let host = document.querySelector('.toast-host');
        if(!host){
            host = document.createElement('div');
            host.className = 'toast-host';
            host.style.cssText = 'position:fixed; bottom:24px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; gap:8px; z-index:2000000; pointer-events:none;';
            document.body.appendChild(host);
        }
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = 'background:rgba(0,0,0,.8); color:#fff; padding:10px 16px; font-size:.8rem; border-radius:8px; box-shadow:0 4px 16px -4px rgba(0,0,0,.6); letter-spacing:.03em; opacity:0; transform:translateY(6px); transition:opacity .35s ease, transform .35s cubic-bezier(.22,.61,.36,1); backdrop-filter:blur(6px);';
        toast.textContent = message;
        host.appendChild(toast);
        requestAnimationFrame(()=>{ toast.style.opacity='1'; toast.style.transform='translateY(0)'; });
        setTimeout(()=>{ toast.style.opacity='0'; toast.style.transform='translateY(6px)'; setTimeout(()=>toast.remove(), 400); }, duration);
    } catch(e){ console.warn('Toast error', e); }
}

// Initialize accessibility features for cards
function initializeAccessibility() {
    // Make all Netflix cards focusable
    const netflixCards = document.querySelectorAll('.netflix-card');
    netflixCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        const titleEl = card.querySelector('.netflix-card-title');
        const titleText = titleEl ? titleEl.textContent.trim() : 'details';
        card.setAttribute('aria-label', 'Open project ' + titleText);
    });
    
    // Make certification cards focusable
    const certCards = document.querySelectorAll('.cert-item');
    certCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        const h3 = card.querySelector('h3');
        const text = h3 ? h3.textContent.trim() : 'details';
        card.setAttribute('aria-label', 'Open certification ' + text);
    });
}

