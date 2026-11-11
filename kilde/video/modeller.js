// node kilde/video/modeller.js <trinn>
// Lister delkapitlene på et trinn med modell, antall steg og teksten på hvert steg (til manusskriving).
const {openPage}=require('./page.js'); const G=+process.argv[2]||9;
(async()=>{ const {b,p}=await openPage();
  const out=await p.evaluate((G)=>{ const H=window.__mat8, R=[];
    H.BOOK.chapters.filter(c=>(c.grade||8)===G).forEach(c=>c.groups.forEach(g=>g.topics.forEach(tid=>{ const t=H.TOPICS[tid]; const tmp=document.createElement('div'); tmp.innerHTML=t.learn||'';
      const ms=[...tmp.querySelectorAll('[data-model]')].map(e=>e.dataset.model); const rec={tid,title:t.title,kap:c.num,kapittel:c.title,modeller:[]};
      ms.forEach(m=>{ if(!H.MODELS[m]){ rec.modeller.push({m,feil:'mangler'}); return; } const el=document.createElement('div'); el.className='model'; document.body.appendChild(el);
        try{ window.__seed(tid+'/'+m); const api=H.MODELS[m](el)||{}; const nx=el.querySelector('[data-s=next]'), rs=el.querySelector('[data-s=reset]'); const steg=[];
          if(nx){ rs&&rs.click(); const cap=()=>((el.querySelector('.caption')||{}).innerText||'').replace(/\s+/g,' ').trim(); steg.push(cap()); let n=0; while(!nx.disabled&&n<40){ nx.click(); n++; steg.push(cap()); } }
          rec.modeller.push({m,load:!!api.load,steg}); }catch(e){ rec.modeller.push({m,feil:String(e)}); } el.remove(); });
      R.push(rec); }))); return R; },G);
  console.log(JSON.stringify(out,null,1)); await b.close(); })();
