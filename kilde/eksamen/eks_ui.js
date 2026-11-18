/* ===================== Eksamen 10. trinn ===================== */
const EKS_SETT={1:'Øvingseksamen 1',2:'Øvingseksamen 2',3:'Øvingseksamen 3'};
const EKS_NIV={1:'Lett',2:'Middels',3:'Krevende'};
const EKS_ST={ get(){ try{ return JSON.parse(localStorage.getItem('eks-status')||'{}'); }catch(e){ return {}; } },
  set(id,v){ const o=this.get(); if(v) o[id]=v; else delete o[id]; try{ localStorage.setItem('eks-status',JSON.stringify(o)); }catch(e){} } };
let EKS_SKJUL=false; try{ EKS_SKJUL=localStorage.getItem('eks-skjul')==='1'; }catch(e){}
let EKS_TIMER=null;
const eksCrumb=t=>`<nav class="crumb" aria-label="Brødsmuler"><a href="#matte">Forside</a><span>›</span>${t?`<a href="#eksamen">Eksamen</a><span>›</span><span>${t}</span>`:'<span>Eksamen</span>'}</nav>`;
const eksSub=cur=>`<nav class="eks-sub" aria-label="Eksamen">${[['eksamen','Oversikt'],['eksamen-1','Øving 1'],['eksamen-2','Øving 2'],['eksamen-3','Øving 3'],['eksamen-alle','Alle oppgaver'],['eksamen-mine','Mine oppgaver'],['eksamen-formelark','Formelark'],['eksamen-guide','Eksamensguide']].map(([h,t])=>`<a href="#${h}" ${cur===h?'aria-current="page"':''}>${t}</a>`).join('')}</nav>`;
function eksCard(o,showSett){
  const st=EKS_ST.get()[o.id]||0;
  return `<article class="eks-o" id="o-${o.id}" data-id="${o.id}" data-st="${st}">
    <header class="eks-h"><h3>Oppgave ${o.nr}</h3>
      <span class="eks-chip ${o.del_===1?'d1':'d2'}">Del ${o.del_} · ${o.del_===1?'uten hjelpemidler':'med hjelpemidler'}</span>
      <span class="eks-chip">${EKS.tema[o.tema]}</span><span class="eks-niv n${o.niv}">${EKS_NIV[o.niv]}</span>
      ${showSett?`<a class="eks-sett" href="#eksamen-${o.sett}">${EKS_SETT[o.sett]}</a>`:''}</header>
    <div class="eks-t">${o.fig?`<div class="eks-figw">${o.fig}</div>`:''}${o.tekst}</div>
    <div class="eks-act">
      <button type="button" class="btn ghost small" data-vis="fasit" aria-expanded="false">Fasit</button>
      ${EKS_SKJUL?'':`<button type="button" class="btn ghost small" data-vis="los" aria-expanded="false">Løsningsforslag</button>`}
      <div class="eks-st" role="group" aria-label="Status for oppgave ${o.nr}">${[[0,'Ikke prøvd'],[1,'Prøvd'],[2,'Kan det']].map(([v,t])=>`<button type="button" data-stv="${v}" aria-pressed="${st===v}">${t}</button>`).join('')}</div></div>
    <div class="eks-fasit" hidden><b>Fasit:</b> ${o.fasit}</div>
    <div class="eks-los" hidden><h4>Løsningsforslag</h4>${o.los}</div></article>`;
}
function eksWire(){
  main.querySelectorAll('.eks-o').forEach(a=>{
    a.querySelectorAll('[data-vis]').forEach(b=>b.addEventListener('click',()=>{ const p=a.querySelector('.eks-'+b.dataset.vis); p.hidden=!p.hidden; b.setAttribute('aria-expanded',!p.hidden); }));
    a.querySelectorAll('[data-stv]').forEach(b=>b.addEventListener('click',()=>{ const v=+b.dataset.stv; EKS_ST.set(a.dataset.id,v); a.dataset.st=v;
      a.querySelectorAll('[data-stv]').forEach(x=>x.setAttribute('aria-pressed',x===b)); const c=main.querySelector('[data-eks-count]'); if(c) c.textContent=eksCount(c.dataset.eksCount); }));
  });
  const pr=main.querySelector('[data-eks-print]'); if(pr) pr.addEventListener('click',()=>{ document.body.classList.add('eks-printing'); const done=()=>{ document.body.classList.remove('eks-printing'); removeEventListener('afterprint',done); }; addEventListener('afterprint',done); window.print(); });
  main.querySelectorAll('[data-eks-timer]').forEach(b=>b.addEventListener('click',()=>eksStartTimer(+b.dataset.eksTimer,b.dataset.label)));
  const sk=main.querySelector('[data-eks-skjul]'); if(sk) sk.addEventListener('change',()=>{ EKS_SKJUL=sk.checked; try{ localStorage.setItem('eks-skjul',sk.checked?'1':'0'); }catch(e){} route(); });
}
function eksCount(sett){ const st=EKS_ST.get(), L=EKS.oppgaver.filter(o=>!sett||o.sett===+sett); return `${L.filter(o=>st[o.id]===2).length} av ${L.length} kan du`; }
function eksStartTimer(min,label){
  if(EKS_TIMER) clearInterval(EKS_TIMER.iv);
  let bar=document.getElementById('eks-timer'); if(!bar){ bar=document.createElement('div'); bar.id='eks-timer'; bar.setAttribute('role','timer'); document.body.appendChild(bar); }
  const end=Date.now()+min*60000;
  const tick=()=>{ const left=Math.max(0,end-Date.now()), h=Math.floor(left/3600000), m=Math.floor(left/60000)%60, s=Math.floor(left/1000)%60;
    bar.innerHTML=`<span>${label}</span><b>${h?h+':':''}${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}</b><button type="button" aria-label="Stopp nedtellingen">Stopp</button>`;
    bar.querySelector('button').onclick=()=>{ clearInterval(EKS_TIMER.iv); EKS_TIMER=null; bar.remove(); };
    if(!left){ clearInterval(EKS_TIMER.iv); bar.classList.add('done'); bar.querySelector('b').textContent='Tiden er ute'; } };
  EKS_TIMER={iv:setInterval(tick,1000)}; tick();
}
function renderEksamen(r){
  const sub=r.replace(/^eksamen-?/,''), O=EKS.oppgaver;
  let h='';
  if(!sub){
    const st=EKS_ST.get();
    h=`${eksCrumb()}<header class="topic-head"><p class="eyebrow">10. trinn · Eksamen</p><h1>Eksamens<span class="hl">trening</span></h1>
      <p class="lede">Tre øvingseksamener bygd opp som den skriftlige eksamenen i matematikk på 10. trinn, med fasit og løsningsforslag. Øv på hele eksamener, eller velg oppgaver etter tema og vanskelighetsgrad.</p></header>${eksSub('eksamen')}
      <div class="eks-sets">${[1,2,3].map(n=>{ const L=O.filter(o=>o.sett===n), k=L.filter(o=>st[o.id]===2).length;
        return `<a class="chap-card eks-setc" href="#eksamen-${n}"><span class="num">${n}</span><h3>${EKS_SETT[n]}</h3><p class="meta">Del 1: ${L.filter(o=>o.del_===1).length} oppgaver uten hjelpemidler · Del 2: ${L.filter(o=>o.del_===2).length} oppgaver med hjelpemidler</p><span class="eks-prog"><i style="width:${k/L.length*100}%"></i></span><span class="eks-progt">${k} av ${L.length} kan du</span></a>`; }).join('')}</div>
      <h2 class="eks-h2">Oppgaver etter tema</h2><div class="eks-temas">${Object.entries(EKS.tema).map(([t,n])=>`<a href="#eksamen-tema-${t}"><span>${n}</span><b>${O.filter(o=>o.tema===t).length}</b></a>`).join('')}</div>
      <h2 class="eks-h2">Etter vanskelighetsgrad</h2><div class="eks-temas">${[1,2,3].map(v=>`<a href="#eksamen-niv-${v}"><span><span class="eks-niv n${v}">${EKS_NIV[v]}</span></span><b>${O.filter(o=>o.niv===v).length}</b></a>`).join('')}</div>
      <div class="eks-more"><a class="btn" href="#eksamen-tilfeldig">Gi meg en tilfeldig oppgave</a><a class="btn ghost" href="#eksamen-formelark">Formelark</a><a class="btn ghost" href="#eksamen-guide">Eksamensguide</a></div>
      <footer class="foot">Oppgavene er laget for denne nettsiden i samme form som eksamen. Tidligere eksamener ligger hos Utdanningsdirektoratet.</footer>`;
  } else if(/^[123]$/.test(sub)){
    const n=+sub, L=O.filter(o=>o.sett===n);
    h=`${eksCrumb(EKS_SETT[n])}<header class="topic-head"><p class="eyebrow">10. trinn · Eksamen</p><h1>${EKS_SETT[n]}</h1>
      <p class="lede">Del 1 skal leveres etter 1 time og løses uten hjelpemidler. Del 2 løses med hjelpemidler, og hele eksamenen varer i 5 timer.</p></header>${eksSub('eksamen-'+n)}
      <div class="eks-tools"><button type="button" class="btn small" data-eks-timer="60" data-label="Del 1">Start Del 1 (1 time)</button><button type="button" class="btn small ghost" data-eks-timer="300" data-label="Hele eksamenen">Start hele eksamenen (5 timer)</button><button type="button" class="btn small ghost" data-eks-print>Skriv ut oppgavene</button>
        <label class="eks-sk"><input type="checkbox" data-eks-skjul ${EKS_SKJUL?'checked':''}> Skjul løsningsforslag</label><span class="eks-cnt" data-eks-count="${n}">${eksCount(n)}</span></div>
      <section class="eks-del"><h2>Del 1 <small>Uten hjelpemidler · 1 time</small></h2><p class="eks-rule">Du kan bare bruke vanlige skrivesaker og linjal.</p>${L.filter(o=>o.del_===1).map(o=>eksCard(o)).join('')}</section>
      <section class="eks-del"><h2>Del 2 <small>Med hjelpemidler</small></h2><p class="eks-rule">Alle hjelpemidler er tillatt, unntatt åpent internett, kommunikasjon med andre og KI-verktøy som chatboter.</p>${L.filter(o=>o.del_===2).map(o=>eksCard(o)).join('')}</section>`;
  } else if(sub==='alle'||sub.startsWith('tema-')||sub.startsWith('niv-')||sub==='mine'){
    const t=sub.startsWith('tema-')?sub.slice(5):'', v=sub.startsWith('niv-')?+sub.slice(4):0, mine=sub==='mine', st=EKS_ST.get();
    let L=O.filter(o=>(!t||o.tema===t)&&(!v||o.niv===v));
    const title=mine?'Mine oppgaver':t?EKS.tema[t]:v?`${EKS_NIV[v]} oppgaver`:'Alle oppgaver';
    let body='';
    if(mine){
      const grp=[[1,'Prøvd, men ikke helt i mål'],[2,'Kan det'],[0,'Ikke prøvd ennå']];
      body=grp.map(([s,n])=>{ const G=O.filter(o=>(st[o.id]||0)===s); return `<section class="eks-del"><h2>${n} <small>${G.length} oppgaver</small></h2>${s===0?`<p class="eks-rule">${G.length?`Tips: Begynn med en <a href="#eksamen-tilfeldig">tilfeldig oppgave</a>.`:'Du har prøvd alle oppgavene!'}</p>`:G.map(o=>eksCard(o,true)).join('')||'<p class="eks-rule">Ingen ennå.</p>'}</section>`; }).join('');
    } else body=`<p class="eks-cnt">${L.length} oppgaver</p>`+L.map(o=>eksCard(o,true)).join('');
    h=`${eksCrumb(title)}<header class="topic-head"><p class="eyebrow">10. trinn · Eksamen</p><h1>${title}</h1>${mine?'<p class="lede">Status lagres bare i denne nettleseren på denne enheten.</p>':''}</header>${eksSub(mine?'eksamen-mine':'eksamen-alle')}
      ${mine?'':`<div class="eks-flt"><span>Tema:</span>${['',...Object.keys(EKS.tema)].map(k=>`<a href="#${k?'eksamen-tema-'+k:'eksamen-alle'}" ${(k===t&&!v)?'aria-current="true"':''}>${k?EKS.tema[k]:'Alle'}</a>`).join('')}</div>
      <div class="eks-flt"><span>Nivå:</span>${[1,2,3].map(k=>`<a href="#eksamen-niv-${k}" ${k===v?'aria-current="true"':''}>${EKS_NIV[k]}</a>`).join('')}</div>`}${body}`;
  } else if(sub==='tilfeldig'){
    const st=EKS_ST.get(), pool=O.filter(o=>st[o.id]!==2), o=(pool.length?pool:O)[Math.floor(Math.random()*(pool.length||O.length))];
    h=`${eksCrumb('Tilfeldig oppgave')}<header class="topic-head"><p class="eyebrow">10. trinn · Eksamen</p><h1>Tilfeldig oppgave</h1><p class="lede">Hentet blant oppgavene du ikke har merket med «Kan det».</p></header>${eksSub('')}
      ${eksCard(o,true)}<div class="eks-more"><button type="button" class="btn" id="eks-ny">Ny tilfeldig oppgave</button></div>`;
  } else if(sub==='formelark'){
    const F=[['Prosent og økonomi',['Prosentdel = del : hel','Ny verdi = gammel verdi · vekstfaktor','Vekstfaktor ved økning på p %: 1 + p/100','Vekstfaktor ved nedgang på p %: 1 − p/100','Verdi etter x år: K · vekstfaktorˣ','Pris med 25 % mva = pris uten mva · 1,25']],
      ['Funksjoner',['Lineær funksjon: y = ax + b','a er stigningstallet: endring i y når x øker med 1','b er konstantleddet: der grafen skjærer y-aksen','Stigningstall mellom to punkter: (y₂ − y₁) : (x₂ − x₁)','Proporsjonale størrelser: y = ax','Omvendt proporsjonale størrelser: x · y = k']],
      ['Algebra',['(a + b)² = a² + 2ab + b²','(a − b)² = a² − 2ab + b²','(a + b)(a − b) = a² − b²','aᵐ · aⁿ = aᵐ⁺ⁿ','aᵐ : aⁿ = aᵐ⁻ⁿ','a⁰ = 1']],
      ['Areal og omkrets',['Rektangel: A = g · h','Trekant: A = g · h : 2','Parallellogram: A = g · h','Trapes: A = (a + b) · h : 2','Sirkel: A = πr², O = 2πr = πd','Pytagoras: a² + b² = c² (c er hypotenusen)']],
      ['Volum og overflate',['Prisme: V = G · h','Sylinder: V = πr² · h','Pyramide: V = G · h : 3','Kjegle: V = πr² · h : 3','Kule: V = 4πr³ : 3','1 dm³ = 1 L, 1 cm³ = 1 mL, 1 m³ = 1 000 L']],
      ['Statistikk og sannsynlighet',['Gjennomsnitt = summen av verdiene : antall verdier','Median: den midterste verdien når verdiene er sortert','Typetall: verdien som forekommer flest ganger','Variasjonsbredde = største verdi − minste verdi','P(A) = gunstige utfall : mulige utfall','P(ikke A) = 1 − P(A)']]];
    h=`${eksCrumb('Formelark')}<header class="topic-head"><p class="eyebrow">10. trinn · Eksamen</p><h1>Formelark</h1><p class="lede">De viktigste formlene og sammenhengene. Til Del 1 må du kunne dem utenat. Til Del 2 kan du ha med egne notater.</p></header>${eksSub('eksamen-formelark')}
      <div class="eks-tools"><button type="button" class="btn small ghost" data-eks-print>Skriv ut formelarket</button></div>
      <div class="eks-form">${F.map(([t,L])=>`<section><h2>${t}</h2><ul>${L.map(x=>`<li>${x}</li>`).join('')}</ul></section>`).join('')}</div>`;
  } else if(sub==='guide'){
    h=`${eksCrumb('Eksamensguide')}<header class="topic-head"><p class="eyebrow">10. trinn · Eksamen</p><h1>Eksamens<span class="hl">guide</span></h1><p class="lede">Slik er den skriftlige eksamenen i matematikk på 10. trinn bygd opp, og slik kan du forberede deg.</p></header>${eksSub('eksamen-guide')}
      <div class="eks-guide">
      <section><h2>Slik er eksamen bygd opp</h2><ul><li>Eksamen varer i <b>5 timer</b>. Del 1 og Del 2 deles ut samtidig.</li><li><b>Del 1</b> skal leveres etter <b>1 time</b>. Her kan du bare bruke vanlige skrivesaker og linjal.</li><li><b>Del 2</b> skal leveres innen 5 timer. Alle hjelpemidler er tillatt, unntatt åpent internett og verktøy for kommunikasjon. Du kan ikke bruke KI-verktøy som chatboter.</li><li>Sjekk alltid de nyeste reglene fra skolen og Utdanningsdirektoratet før eksamen.</li></ul></section>
      <section><h2>Del 1: uten hjelpemidler</h2><ul><li>Øv på hoderegning, brøk, prosent, potenser og likninger uten kalkulator.</li><li>Lær formlene på formelarket.</li><li>Vis utregningen, også når svaret er enkelt. Du kan få poeng for riktig framgangsmåte selv om svaret blir feil.</li></ul></section>
      <section><h2>Del 2: med hjelpemidler</h2><ul><li>Bli trygg på <b>regneark</b> (formler, kopiering og diagrammer) og <b>graftegner</b> (tegne grafer, finne skjæringspunkter og toppunkter).</li><li>Les programkode og forklar hva den gjør. Øv på løkker og if-setninger.</li><li>Ta med skjermbilder eller utskrifter av regneark og grafer, og forklar hva du har gjort.</li><li>Mange oppgaver ber deg <b>argumentere</b>, <b>vurdere</b> eller <b>gi råd</b>. Skriv hele setninger og bruk tall fra utregningene dine.</li></ul></section>
      <section><h2>Dette må du kunne</h2><ul>${Object.values(EKS.tema).map(t=>`<li>${t}</li>`).join('')}</ul><p>Øv på oppgaver innen hvert tema under <a href="#eksamen-alle">Alle oppgaver</a>.</p></section>
      <section><h2>På eksamensdagen</h2><ul><li>Les gjennom hele Del 1 først, og begynn med oppgavene du er tryggest på.</li><li>Bruk ikke for lang tid på én oppgave. Kom heller tilbake til den.</li><li>Kontroller svarene: Er svaret rimelig? Har du riktig enhet?</li><li>Lagre ofte når du jobber digitalt.</li></ul></section></div>`;
  } else { location.replace('#eksamen'); return; }
  main.innerHTML=`<div class="col">${h}</div>`;
  eksWire();
  const ny=main.querySelector('#eks-ny'); if(ny) ny.addEventListener('click',()=>route());
}
