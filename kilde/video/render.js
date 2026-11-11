// node kilde/video/render.js <specs.json> [tid ...]
// Tegner bildene til hver video: tittelkort, ett bilde per steg i modellen, og sluttkort.
// Resultat: kilde/video/ut/<tid>/f00-title.png, fNN-s<segment>-<nr>.png, f99-end.png, beats.json
const fs=require('fs'),path=require('path');const {openPage}=require('./page.js');
const specs=JSON.parse(fs.readFileSync(path.resolve(process.argv[2]),'utf8')); const only=process.argv.slice(3);
const OUT=path.join(__dirname,'ut');
const CSS=`
#vf{position:fixed;inset:0;z-index:999;background-color:var(--paper);background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:32px 32px;font-family:var(--f-body);color:var(--ink)}
#vf .vtop{position:absolute;left:56px;right:56px;top:28px;display:flex;justify-content:space-between;align-items:baseline}
#vf .vtop b{font-family:var(--f-display);font-weight:800;font-size:28px}
#vf .vtop span{font-family:var(--f-mono);font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
#vf .vbody{position:absolute;left:0;right:0;top:84px;bottom:22px;display:flex;align-items:center;justify-content:center}
#vf .model{width:820px;background:var(--surface)}
#vf .model .model-head,#vf .model .model-ctl,#vf .model .model-err,#vf .model .stepbar,#vf .model .legend{display:none!important}
#vf.row .model{width:1100px}
#vf.row .model .stage{flex-direction:row;flex-wrap:wrap;justify-content:center;align-items:center;gap:28px}
#vf.row .model .stage>.eq{flex-basis:100%}
#vf .model .caption{margin:0 18px 18px;font-size:1.05rem}
#vf .card{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 110px;gap:22px;background-color:var(--paper);background-image:inherit;background-size:32px 32px}
#vf .card h1{font-family:var(--f-display);font-weight:800;font-size:96px;line-height:1;letter-spacing:-.02em}
#vf .card h1.long{font-size:68px}
#vf .card p{font-family:var(--f-mono);font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
#vf .card .hand{font-family:var(--f-hand);font-weight:700;font-size:46px;color:var(--red)}
`;
(async()=>{ const {b,p}=await openPage(); await p.addStyleTag({content:CSS}); let bad=0;
  for(const s of specs){ if(only.length&&!only.includes(s.tid)) continue;
    const dir=path.join(OUT,s.tid); fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true});
    const mount=()=>p.evaluate((s)=>{ const H=window.__mat8; let ch,num,grade;
      H.BOOK.chapters.forEach(c=>c.groups.forEach(g=>{ if(g.topics.includes(s.tid)){ ch=c.title; num=c.num; grade=c.grade||8; } }));
      if(!ch) return {err:'fant ikke delkapitlet '+s.tid}; if(!H.MODELS[s.m]) return {err:'fant ikke modellen '+s.m};
      const vf=document.createElement('div'); vf.id='vf'; vf.innerHTML=`<div class="vtop"><b>${s.title}</b><span>Matematikk ${grade}. trinn · Kapittel ${num}</span></div><div class="vbody"><div class="model"></div></div><div class="card" id="vcard"></div>`;
      document.getElementById('vf')?.remove(); if(s.row) vf.classList.add('row'); document.body.appendChild(vf);
      const el=vf.querySelector('.model'); window.__seed(s.tid+'/'+s.m); window.__api=H.MODELS[s.m](el)||{}; if(s.v&&window.__api.load) window.__api.load(s.v);
      return {ch,num,grade,steps:!!el.querySelector('[data-s=next]')}; }, s);
    const info=await mount(); if(info.err){ console.log('FEIL',s.tid,info.err); bad++; continue; }
    if(!info.steps){ console.log('FEIL',s.tid,'modellen',s.m,'har ingen steg-knapper (data-s=next)'); bad++; continue; }
    const card=async(html)=>{ await p.evaluate(h=>{ const c=document.getElementById('vcard'); c.innerHTML=h; c.style.display='flex'; },html); };
    const h1=`<h1${s.title.length>22?' class="long"':''}>`;
    await card(`<p>Matematikk ${info.grade}. trinn · Kapittel ${info.num} · ${info.ch}</p>${h1}${s.title}</h1><span class="hand">Forklaring steg for steg</span>`);
    await p.screenshot({path:path.join(dir,'f00-title.png')});
    await card(`<p>Matematikk ${info.grade}. trinn</p><h1>Prøv <span class="hl">selv!</span></h1><span class="hand">Finn modellen under «${s.title}» på nettstedet.</span>`);
    await p.screenshot({path:path.join(dir,'f99-end.png')});
    await p.evaluate(()=>{ document.getElementById('vcard').style.display='none'; });
    // ett «beat» per steg som skal vises: gi = segment, k = antall trykk på Neste
    const beats=[]; s.segs.forEach((g,gi)=>{ g.st.forEach((k,j)=>beats.push({gi,j,k,load:j===0?g.load:null,click:j===0?g.click:null})); });
    const go=async(bt)=>p.evaluate(({k,load,click})=>{ const el=document.querySelector('#vf .model'); if(load&&window.__api.load) window.__api.load(load); if(click) click.forEach(q=>el.querySelector(q).click());
        el.querySelector('[data-s=reset]').click(); const nx=el.querySelector('[data-s=next]'); let n=0; for(let i=0;i<k;i++){ if(nx.disabled) break; nx.click(); n++; } return n; },bt);
    let maxH=0, maxW=0;
    for(const bt of beats){ const n=await go(bt); if(n<bt.k){ console.log('ADVARSEL',s.tid,'steg',bt.k,'finnes ikke (modellen har',n,'steg)'); bad++; }
      const r=await p.evaluate(()=>{ const el=document.querySelector('#vf .model'); el.style.zoom=1; return [el.scrollHeight, Math.max(el.scrollWidth, el.querySelector('.stage')?el.querySelector('.stage').scrollWidth:0)]; }); maxH=Math.max(maxH,r[0]); maxW=Math.max(maxW,r[1]); }
    const z=Math.min(1.45, 600/maxH, 1180/Math.max(s.row?1100:820,maxW));
    await mount(); await p.evaluate(()=>{ document.getElementById('vcard').style.display='none'; });
    let idx=0;
    for(const bt of beats){ await go(bt); await p.evaluate(z=>{ document.querySelector('#vf .model').style.zoom=z; },z); await p.waitForTimeout(450);
      await p.screenshot({path:path.join(dir,`f${String(++idx).padStart(2,'0')}-s${bt.gi}-${bt.j}.png`)}); }
    fs.writeFileSync(path.join(dir,'beats.json'),JSON.stringify(beats.map(x=>({gi:x.gi,j:x.j}))));
    console.log('ok',s.tid,'bilder',beats.length,'zoom',z.toFixed(2));
  }
  await b.close(); console.log(bad?`FEIL/ADVARSLER: ${bad}`:'alt ok'); process.exit(bad?1:0); })();
