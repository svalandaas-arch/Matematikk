/* ===================== Lag oppgavesett (bare ekte eksamensoppgaver) ===================== */
let LAG_OPT=null, LAG_L=[]; const LAG_FILER={};
const lagNavn=f=>f.split('/').pop().split('#')[0].toLowerCase().replace(/\s*\(\d+\)/,'').replace(/\s+/g,'');
function lagUtvalg(o){
  const L=EKTE.oppg.filter(x=>x.tema.some(t=>o.tema.includes(t))&&o.eks.includes(x.eks)&&(!o.del_||x.del_===o.del_));
  const ord=EKTE.dok.map(d=>d.id), hov=x=>o.tema.indexOf(x.tema.find(t=>o.tema.includes(t)));
  L.sort((a,b)=>(o.sort==='tema'?hov(a)-hov(b):0)||ord.indexOf(a.eks)-ord.indexOf(b.eks)||a.del_-b.del_||a.nr-b.nr);
  return L;
}
function lagHTML(L,o){
  const tit=o.tema.map(t=>EKS.tema[t]).join(', ');
  const forst={}, samme={}; if(o.medSider) L.forEach((x,i)=>{ const k=x.url; if(k in forst) samme[i]=forst[k]; else forst[k]=i; });
  const row=(x,i)=>`<section class="lag-o"><div class="lag-n">${i+1}</div><div class="lag-b"><h3>${EKTE_NAVN(x.eks)} · Del ${x.del_} · Oppgave ${x.nr} <small>side ${x.side} · ${x.del_===1?'uten hjelpemidler':'med hjelpemidler'}</small></h3>
    <p>${x.besk}${i in samme?` <i>(står på samme side som oppgave ${samme[i]+1})</i>`:''}</p><p class="lag-tema">${x.tema.map(t=>EKS.tema[t]).join(' · ')}</p><p class="lag-url"><a href="${x.url}">${x.url.replace('https://','')}</a></p></div><div class="lag-box" aria-hidden="true">Gjort</div></section>`;
  let body='', i=0;
  if(o.sort==='tema') o.tema.forEach(t=>{ const G=L.filter(x=>x.tema.find(z=>o.tema.includes(z))===t); if(G.length) body+=`<h2 class="lag-del">${EKS.tema[t]} <small>${G.length} oppgaver</small></h2>`+G.map(x=>row(x,i++)).join(''); });
  else EKTE.dok.forEach(d=>{ const G=L.filter(x=>x.eks===d.id); if(G.length) body+=`<h2 class="lag-del">Eksamen ${d.navn.toLowerCase()} <small>${d.dato}</small></h2>`+G.map(x=>row(x,i++)).join(''); });
  return `<div class="lag-doc"><header class="lag-head"><div><p class="lag-ey">Matematikk 10. trinn · Ekte eksamensoppgaver</p><h1>${tit}</h1></div><p class="lag-name">Navn: ______________________ &nbsp; Dato: __________</p></header>
    <p class="lag-intro">${L.length} oppgaver fra tidligere eksamener (MAT0015). ${o.medSider?'Oppgavene følger etter denne oversikten, slik de står i eksamen.':'Åpne lenken til hver oppgave, eller finn eksamenen på nettsiden under Eksamen › Ekte eksamener.'} Del 1 skal løses uten hjelpemidler. Kryss av når du er ferdig.</p>
    ${body}<p class="lag-src">Oppgavene er laget av Utdanningsdirektoratet. Eksamens-PDF-ene ligger hos matematikk.net.</p></div>`;
}
function renderLag(){
  let st={tema:[],eks:EKTE.dok.map(d=>d.id),del_:0,sort:'tema'}; try{ Object.assign(st,JSON.parse(localStorage.getItem('eks-lag2')||'{}')); }catch(e){}
  const cnt=t=>EKTE.oppg.filter(o=>o.tema.includes(t)).length;
  main.innerHTML=`<div class="col">${eksCrumb('Lag oppgavesett')}<header class="topic-head"><p class="eyebrow">10. trinn · Eksamen</p><h1>Lag <span class="hl">oppgavesett</span></h1>
    <p class="lede">Velg temaene du vil øve på. Du får en PDF med alle oppgavene fra ekte eksamener som handler om dem, slik de står i eksamen.</p></header>${eksSub('eksamen-lag')}
    <form class="lag-form" onsubmit="return false">
      <fieldset><legend>1. Velg temaer</legend><div class="lag-pills">${Object.entries(EKS.tema).map(([k,n])=>`<label><input type="checkbox" name="tema" value="${k}" ${st.tema.includes(k)?'checked':''}><span>${n} (${cnt(k)})</span></label>`).join('')}</div>
        <p class="lag-q"><button type="button" class="linklike" data-alle>Velg alle</button> · <button type="button" class="linklike" data-ingen>Fjern alle</button></p></fieldset>
      <fieldset><legend>2. Hvilke eksamener?</legend><div class="lag-pills">${EKTE.dok.map(d=>`<label><input type="checkbox" name="eks" value="${d.id}" ${st.eks.includes(d.id)?'checked':''}><span>${d.navn}</span></label>`).join('')}</div></fieldset>
      <fieldset><legend>3. Del</legend><div class="lag-pills">${[[0,'Begge'],[1,'Del 1 (uten hjelpemidler)'],[2,'Del 2 (med hjelpemidler)']].map(([v,n])=>`<label><input type="radio" name="del" value="${v}" ${st.del_===v?'checked':''}><span>${n}</span></label>`).join('')}</div></fieldset>
      <fieldset><legend>4. Rekkefølge</legend><div class="lag-pills">${[['tema','Etter tema'],['eks','Etter eksamen']].map(([v,n])=>`<label><input type="radio" name="sort" value="${v}" ${st.sort===v?'checked':''}><span>${n}</span></label>`).join('')}</div></fieldset>
      <div class="lag-btns"><button type="button" class="btn" data-lag>Lag oppgavesett</button><span class="lag-msg" role="status"></span></div>
    </form>
    <div class="lag-out" hidden><div class="lag-btns"><button type="button" class="btn" data-full>Last ned PDF med oppgavene</button><span class="lag-hint">PDF-en får en oversikt først, og deretter eksamenssidene med oppgavene.</span></div>
      <div class="lag-files" hidden></div><div class="lag-prev"></div></div></div>`;
  const F=main.querySelector('.lag-form'), out=main.querySelector('.lag-out'), msg=main.querySelector('.lag-msg');
  const read=()=>({tema:[...F.querySelectorAll('[name=tema]:checked')].map(x=>x.value),eks:[...F.querySelectorAll('[name=eks]:checked')].map(x=>x.value),del_:+F.querySelector('[name=del]:checked').value,sort:F.querySelector('[name=sort]:checked').value});
  const lag=()=>{ const o=read(); if(!o.tema.length||!o.eks.length){ msg.textContent=!o.tema.length?'Velg minst ett tema.':'Velg minst én eksamen.'; out.hidden=true; return; }
    try{ localStorage.setItem('eks-lag2',JSON.stringify(o)); }catch(e){}
    const L=lagUtvalg(o); if(!L.length){ msg.textContent='Ingen oppgaver passer med valgene. Prøv flere temaer eller begge delene.'; out.hidden=true; return; }
    msg.textContent=''; LAG_OPT=o; LAG_L=L; out.querySelector('.lag-files').hidden=true; out.querySelector('.lag-prev').innerHTML=lagHTML(L,o); out.hidden=false; out.scrollIntoView({behavior:'smooth',block:'start'}); };
  const full=async b=>{ b=b||main.querySelector('[data-full]'); b.disabled=true; const old=b.textContent; b.textContent='Henter oppgavene …'; const box=main.querySelector('.lag-files');
    try{ const r=await lagOppgavePDF(LAG_L,LAG_OPT);
      if(r.miss){ box.hidden=false; box.innerHTML=`<p><b>Nettleseren fikk ikke hente eksamens-PDF-ene direkte.</b> Last ned ${r.miss.length===1?'denne filen':'disse filene'} først, og velg ${r.miss.length===1?'den':'dem'} under. Filene blir bare brukt på din maskin.</p>
          <ul>${r.miss.map(f=>`<li><a href="${f}" target="_blank" rel="noopener" download>${f.split('/').pop()}</a> (${EKTE.dok.find(d=>d.deler.some(x=>x.url===f)).navn})</li>`).join('')}</ul>
          <label class="btn small">Velg PDF-filene <input type="file" accept="application/pdf" multiple hidden></label>`;
        box.querySelector('input').onchange=async ev=>{ await lagLesFiler(ev.target.files); full(); }; }
      else { box.hidden=true; msg.textContent=''; } }
    catch(err){ console.error(err); msg.textContent='Klarte ikke å lage PDF-en. Prøv igjen, eller bruk «Bare oversikten».'; }
    b.disabled=false; b.textContent=old; };
  main.querySelector('[data-full]').onclick=e=>full(e.currentTarget);
  main.querySelector('[data-alle]').onclick=()=>F.querySelectorAll('[name=tema]').forEach(x=>x.checked=true);
  main.querySelector('[data-ingen]').onclick=()=>F.querySelectorAll('[name=tema]').forEach(x=>x.checked=false);
  main.querySelector('[data-lag]').onclick=lag;
  if(false) main.querySelector('[data-print]').onclick=()=>{ document.body.classList.add('lag-printing'); const done=()=>{ document.body.classList.remove('lag-printing'); removeEventListener('afterprint',done); }; addEventListener('afterprint',done); window.print(); };
  if(false) main.querySelector('[data-pdf]').onclick=async e=>{ const b=e.currentTarget; b.disabled=true; const old=b.textContent; b.textContent='Lager PDF …';
    try{ await lagPDF(main.querySelector('.lag-doc'),'eksamensoppgaver-'+LAG_OPT.tema.join('-')+'.pdf'); }catch(err){ msg.textContent='Klarte ikke å lage PDF. Bruk «Skriv ut» og velg «Lagre som PDF».'; }
    b.disabled=false; b.textContent=old; };
}
function lagLastLib(){ return window.html2pdf?Promise.resolve():new Promise((ok,no)=>{ const s=document.createElement('script'); s.src='vendor/html2pdf.bundle.min.js'; s.onload=ok; s.onerror=no; document.head.appendChild(s); }); }
async function lagPDF(el,name){
  await lagLastLib();
  const box=document.createElement('div'); box.className='lag-pdfbox'; box.innerHTML=el.outerHTML; document.body.appendChild(box);
  try{ await html2pdf().set({margin:[12,13,14,13],filename:name,enableLinks:true,image:{type:'jpeg',quality:.95},html2canvas:{scale:2,backgroundColor:'#ffffff'},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy'],avoid:['.lag-o','.lag-del']}}).from(box.firstElementChild).save(); }
  finally{ box.remove(); }
}

function lagLastPdfLib(){ return window.PDFLib?Promise.resolve():new Promise((ok,no)=>{ const s=document.createElement('script'); s.src='vendor/pdf-lib.min.js'; s.onload=ok; s.onerror=no; document.head.appendChild(s); }); }
async function lagLesFiler(files){ for(const f of files){ LAG_FILER[lagNavn(f.name)]=await f.arrayBuffer(); } }
function lagSider(x){ // sidene oppgaven står på i eksamens-PDF-en
  const f=x.url.split('#')[0], p=+x.url.split('#page=')[1];
  const starts=[...new Set(EKTE.oppg.filter(o=>o.url.split('#')[0]===f&&o.del_===x.del_).map(o=>+o.url.split('#page=')[1]))].sort((a,b)=>a-b);
  const nxt=starts.find(s=>s>p); const end=nxt?Math.min(nxt-1,p+2):p; const L=[]; for(let i=p;i<=end;i++) L.push(i); return {f,L};
}
async function lagOppgavePDF(L,o){
  await Promise.all([lagLastLib(),lagLastPdfLib()]);
  const files=[...new Set(L.map(x=>x.url.split('#')[0]))], buf={};
  for(const f of files){ if(LAG_FILER[lagNavn(f)]){ buf[f]=LAG_FILER[lagNavn(f)]; continue; }
    try{ const r=await fetch(f,{mode:'cors'}); if(r.ok){ const a=await r.arrayBuffer(); if(new Uint8Array(a.slice(0,4)).join()==='37,80,68,70'){ buf[f]=a; LAG_FILER[lagNavn(f)]=a; } } }catch(e){} }
  const miss=files.filter(f=>!buf[f]); if(miss.length) return {miss};
  const {PDFDocument,StandardFonts,rgb}=PDFLib, out=await PDFDocument.create();
  const o2={...o,medSider:true}, box=document.createElement('div'); box.className='lag-pdfbox'; box.innerHTML=lagHTML(L,o2); document.body.appendChild(box);
  let cov; try{ cov=await html2pdf().set({margin:[12,13,14,13],enableLinks:true,image:{type:'jpeg',quality:.95},html2canvas:{scale:2,backgroundColor:'#ffffff'},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy'],avoid:['.lag-o','.lag-del']}}).from(box.firstElementChild).outputPdf('arraybuffer'); } finally{ box.remove(); }
  const cd=await PDFDocument.load(cov); (await out.copyPages(cd,cd.getPageIndices())).forEach(p=>out.addPage(p));
  const font=await out.embedFont(StandardFonts.HelveticaBold), docs={}, brukt={};
  for(const f of files){ docs[f]=await PDFDocument.load(buf[f],{ignoreEncryption:true}); brukt[f]=new Set(); }
  for(let i=0;i<L.length;i++){ const x=L[i], {f,L:sider}=lagSider(x), d=docs[f];
    const nye=sider.filter(p=>p<=d.getPageCount()&&!brukt[f].has(p)); nye.forEach(p=>brukt[f].add(p)); if(!nye.length) continue;
    const kop=await out.copyPages(d,nye.map(p=>p-1));
    kop.forEach((pg,k)=>{ out.addPage(pg); const {width,height}=pg.getSize();
      const tekst=`${i+1}. ${EKTE_NAVN(x.eks)} · Del ${x.del_} · Oppgave ${x.nr}${k?' (fortsetter)':''}`;
      pg.drawRectangle({x:20,y:height-24,width:font.widthOfTextAtSize(tekst,9)+12,height:16,color:rgb(1,1,1),opacity:.85});
      pg.drawText(tekst,{x:26,y:height-19,size:9,font,color:rgb(.08,.12,.21)}); }); }
  const bytes=await out.save(), a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})); a.download='eksamensoppgaver-'+o.tema.join('-')+'.pdf'; document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },4000);
  return {ok:true};
}
