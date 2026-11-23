/* Elev / Lærer – felles rollebryter for hele nettstedet.
   Lærerdelen låses opp med et passord og huskes til fanen lukkes.
   NB: Dette er en enkel sperre i nettleseren, ikke ekte tilgangskontroll. */
(function(){
  const KEY='rolle', OK='laerer-ok';
  const PW_HASH='69660b1a'; // FNV-1a av 'laerer|' + passord
  const fnv=s=>{ let h=0x811c9dc5; for(const b of new TextEncoder().encode(s)){ h^=b; h=Math.imul(h,0x01000193)>>>0; } return h.toString(16).padStart(8,'0'); };
  const get=k=>{ try{ return sessionStorage.getItem(k); }catch(e){ return null; } };
  const set=(k,v)=>{ try{ v==null?sessionStorage.removeItem(k):sessionStorage.setItem(k,v); }catch(e){} };
  let mem={rolle:get(KEY), ok:get(OK)==='1'};
  const isTeacher=()=>mem.rolle==='laerer'&&mem.ok;
  function emit(){ document.documentElement.dataset.rolle=isTeacher()?'laerer':'elev'; document.dispatchEvent(new CustomEvent('rolle',{detail:isTeacher()?'laerer':'elev'})); syncSw(); }
  function setRole(r){ if(r==='laerer'&&!mem.ok) return ask(); mem.rolle=r; set(KEY,r); emit(); }
  function unlock(pw){ if(fnv('laerer|'+String(pw).trim())!==PW_HASH) return false; mem.ok=true; set(OK,'1'); mem.rolle='laerer'; set(KEY,'laerer'); emit(); return true; }
  function lock(){ mem.ok=false; mem.rolle='elev'; set(OK,null); set(KEY,'elev'); emit(); }

  const css=`
.role-sw{display:grid;grid-template-columns:1fr 1fr;gap:4px;padding:3px;border-radius:10px;background:var(--ink,#141E36);margin-bottom:10px}
.role-sw button{font:inherit;font-size:.88rem;font-weight:700;border:0;border-radius:8px;padding:7px 6px;background:transparent;color:rgba(255,255,255,.72);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px}
.role-sw button[aria-pressed="true"]{background:var(--surface,#fff);color:var(--ink,#141E36)}
.role-sw button:focus-visible{outline:3px solid var(--pen,#2343B0);outline-offset:1px}
.role-sw svg{width:14px;height:14px;flex:none}
.topbar .role-sw{margin:0 0 0 auto;min-width:0;flex:none;grid-template-columns:auto auto}.topbar .role-sw button{padding:6px 10px;font-size:.82rem}
.topbar .brand{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@media (max-width:440px){.topbar .role-sw .rl{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}.topbar .role-sw button{padding:7px 11px}}
@media (max-width:979px){.start-role{display:none}}
.start-role{max-width:240px}
.role-gate{max-width:520px;background:var(--surface,#fff);border:1.5px solid var(--ink,#141E36);border-radius:12px;padding:22px 24px;display:flex;flex-direction:column;gap:14px}
.role-gate h1{font-size:clamp(1.8rem,5vw,2.4rem)}
.role-form{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.role-form input{font:700 1.4rem/1 var(--f-mono,monospace);letter-spacing:.3em;width:8.5em;text-align:center;padding:10px 8px;border:2px solid var(--ink,#141E36);border-radius:10px;background:var(--paper,#F5F7FB);color:var(--ink,#141E36)}
.role-form input:focus{outline:none;border-color:var(--pen,#2343B0)}
.role-err{color:var(--bad,#B5382C);font-weight:700;min-height:1.4em;margin:0}
.role-lockbtn{font:inherit;font-size:.86rem;background:none;border:0;color:var(--muted,#56617A);text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:10px 10px 0;display:inline-flex;gap:6px;align-items:center}
#role-dlg{border:0;padding:0;background:transparent;max-width:min(460px,calc(100vw - 24px));width:100%;color:var(--ink,#141E36)}
#role-dlg::backdrop{background:rgba(14,20,36,.62)}
#role-dlg .role-gate{max-width:none}
.role-full{position:fixed;inset:0;z-index:9999;background:var(--paper,#F5F7FB);display:grid;place-items:center;padding:16px}
.role-full .role-gate{font-family:"Atkinson Hyperlegible","Segoe UI",system-ui,sans-serif;color:#141E36;gap:10px}
.role-full .role-gate p{margin:0}.role-full .eyebrow{font:500 .75rem/1.2 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.12em;text-transform:uppercase;color:#56617A}
.role-full h1{font-family:"Bricolage Grotesque","Segoe UI",system-ui,sans-serif;font-weight:800;font-size:1.9rem;line-height:1.1;margin:0}
.role-full .btn{font:inherit;font-weight:700;background:#141E36;color:#fff;border:0;border-radius:8px;padding:12px 20px;cursor:pointer}.role-full .btn:hover{background:#2343B0}`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  const ICO={elev:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="currentColor"/></svg>',
    laerer:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11V8a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" stroke-width="2.6"/><rect x="4" y="11" width="16" height="11" rx="2.5" fill="currentColor"/></svg>'};
  const sw=(cls='')=>`<div class="role-sw ${cls}" role="group" aria-label="Velg visning"><button type="button" data-role="elev" aria-pressed="${!isTeacher()}">${ICO.elev}<span class="rl">Elev</span></button><button type="button" data-role="laerer" aria-pressed="${isTeacher()}">${ICO.laerer}<span class="rl">Lærer</span></button></div>`;
  function syncSw(){ document.querySelectorAll('.role-sw [data-role]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.role==='laerer')===isTeacher()))); }
  document.addEventListener('click',e=>{ const b=e.target.closest('.role-sw [data-role]'); if(b){ setRole(b.dataset.role); return; }
    if(e.target.closest('[data-role-lock]')) lock(); });

  function gateHtml(title,text){ return `<div class="role-gate"><p class="eyebrow">For lærere</p><h1>${title||'Lærerdelen er låst'}</h1><p>${text||'Denne delen av nettstedet er for lærere. Skriv inn lærerpassordet for å åpne den.'}</p>
    <form class="role-form"><label style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)" for="role-pw-${++gid}">Lærerpassord</label><input id="role-pw-${gid}" type="password" inputmode="numeric" autocomplete="off" placeholder="••••"><button class="btn" type="submit">Lås opp</button></form><p class="role-err" aria-live="polite"></p></div>`; }
  let gid=0;
  function wire(root,onOk){ const f=root.querySelector('.role-form'), i=f.querySelector('input'), er=root.querySelector('.role-err');
    f.addEventListener('submit',e=>{ e.preventDefault(); if(unlock(i.value)){ onOk&&onOk(); } else { er.textContent='Feil passord. Prøv igjen.'; i.value=''; i.focus(); } });
    setTimeout(()=>i.focus({preventScroll:true}),30); }
  function ask(){ let d=document.getElementById('role-dlg'); if(!d){ d=document.createElement('dialog'); d.id='role-dlg'; document.body.appendChild(d); d.addEventListener('click',e=>{ if(e.target===d) d.close(); }); }
    d.innerHTML=gateHtml('Bytt til lærer'); d.querySelector('.role-gate').insertAdjacentHTML('beforeend','<button type="button" class="role-lockbtn" data-close style="align-self:flex-start;padding:0">Avbryt</button>');
    d.querySelector('[data-close]').addEventListener('click',()=>d.close()); wire(d,()=>d.close());
    if(d.showModal) d.showModal(); else d.setAttribute('open',''); syncSw(); }
  /* Sperre for en hel side (brukes av Grupper og klassekart) */
  function guardPage(){ if(isTeacher()) return; const o=document.createElement('div'); o.className='role-full';
    o.innerHTML=gateHtml('Grupper og klassekart er for lærere')+''; document.body.appendChild(o);
    o.querySelector('.role-gate').insertAdjacentHTML('beforeend',`<a href="${o.dataset.back||'../'}" class="role-lockbtn" style="padding:0">← Til elevsiden</a>`);
    wire(o,()=>o.remove()); }
  /* Mobilmeny: legg bryteren i toppstripa */
  function mountTopbar(){ const t=document.querySelector('.topbar'); if(t&&!t.querySelector('.role-sw')) t.insertAdjacentHTML('beforeend',sw()); }
  document.documentElement.dataset.rolle=isTeacher()?'laerer':'elev';
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mountTopbar); else mountTopbar();
  window.ROLLE={isTeacher,setRole,unlock,lock,ask,sw,gateHtml,wire,guardPage};
})();
