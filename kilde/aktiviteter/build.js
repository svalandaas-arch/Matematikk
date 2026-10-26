// node jt/acts/build.js <trinn> [id ...]  — lager PDF-er, forhåndsvisningssprite og acts<trinn>.json
const fs=require('fs'), path=require('path'), {execFileSync}=require('child_process'), {chromium}=require('playwright');
const {CSS}=require('./common');
const G=process.argv[2], only=process.argv.slice(3);
const SCR=path.resolve(__dirname,'..','..'), OUT=path.join(SCR,'aktiviteter'), TMP=path.join(SCR,'jt','acts','tmp'+G);
const ACTS=[...require('./g'+G+'.js'),...(fs.existsSync(path.join(__dirname,'g'+G+'b.js'))?require('./g'+G+'b.js'):[])];
(async()=>{
  fs.mkdirSync(TMP,{recursive:true});
  const b=await chromium.launch(); let bad=0;
  for(const a of ACTS){
    if(a.check){ try{ a.check(); }catch(e){ console.log('CHECK FAIL',a.id,e.message); bad++; } }
    if(a.pdf || (only.length&&!only.includes(a.id))) continue;
    const html=`<!doctype html><html lang="nb"><meta charset="utf-8"><style>${CSS}${a.css||''}</style>${a.pages.join('\n')}</html>`;
    fs.writeFileSync(path.join(TMP,a.id+'.html'),html);
    const pg=await b.newPage(); await pg.setContent(html); await pg.evaluate(()=>document.fonts.ready);
    const ov=await pg.evaluate(()=>[...document.querySelectorAll('.pg')].map((p,i)=>{ const bd=p.querySelector('.body'), br=bd.getBoundingClientRect(); let mx=br.top;
      [...bd.children].forEach(c=>{ const r=c.getBoundingClientRect(); if(r.bottom>mx) mx=r.bottom; });
      const over=[...p.querySelectorAll('.card,.cell,td,.fit')].filter(e=>e.scrollHeight>e.clientHeight+2||e.scrollWidth>e.clientWidth+2).length;
      const grid=!!bd.querySelector('.cardgrid'); const pr=p.getBoundingClientRect(); const wide=[...bd.querySelectorAll('*')].filter(e=>{ const r=e.getBoundingClientRect(); return r.width>0&&(r.right>pr.right-40||r.left<pr.left+40); }).length;
      return {i:i+1,gap:Math.round(br.bottom-mx), ovf:bd.scrollHeight>bd.clientHeight+1, who:wide?'BREDT '+wide:'', over:over+wide, grid}; }));
    ov.forEach(o=>{ if(o.ovf||o.gap<0||o.over) { console.log('OVERFLOW',a.id,'side',o.i,'gap',o.gap,o.who,'over',o.over); bad++; } });
    await pg.emulateMedia({media:'print'}); await pg.pdf({path:path.join(OUT,a.id+'.pdf'),preferCSSPageSize:true,printBackground:true}); await pg.close();
    const np=+execFileSync('pdfinfo',[path.join(OUT,a.id+'.pdf')]).toString().match(/Pages:\s+(\d+)/)[1];
    if(np!==a.pages.length){ console.log('PAGECOUNT',a.id,np,a.pages.length); bad++; }
    console.log('ok',a.id,np,'sider, luft (px):',ov.map(o=>o.grid?'k':o.gap).join(' '));
  }
  await b.close();
  // forhåndsvisning: rasteriser alle PDF-er og stable i sprite(r) på maks 70 sider
  const meta=[], imgs=[];
  for(const a of ACTS){ const pdf=a.pdf?path.join(SCR,a.pdf):path.join(OUT,a.id+'.pdf'); const pre=path.join(TMP,'r-'+a.id);
    for(const f of fs.readdirSync(TMP)) if(f.startsWith('r-'+a.id+'-')) fs.unlinkSync(path.join(TMP,f));
    execFileSync('pdftoppm',['-jpeg','-jpegopt','quality=85','-scale-to-x','600','-scale-to-y','849',pdf,pre]);
    const files=fs.readdirSync(TMP).filter(f=>f.startsWith('r-'+a.id+'-')&&f.endsWith('.jpg')).sort();
    meta.push({a,files:files.map(f=>path.join(TMP,f))}); }
  let chunk=0, cur=[], groups=[];
  for(const m of meta){ if(cur.reduce((s,x)=>s+x.files.length,0)+m.files.length>70){ groups.push(cur); cur=[]; } cur.push(m); }
  if(cur.length) groups.push(cur);
  const out=[];
  groups.forEach((gr,gi)=>{ const name=`aktiviteter/forh${G}${groups.length>1?String.fromCharCode(97+gi):''}.jpg`; const list=gr.flatMap(m=>m.files);
    execFileSync('python3',['-c',`import sys\nfrom PIL import Image\nfs=sys.argv[2:]\nim=Image.new('RGB',(600,849*len(fs)),'white')\nfor i,f in enumerate(fs): im.paste(Image.open(f).convert('RGB').resize((600,849)),(0,849*i))\nim.save(sys.argv[1],quality=70,optimize=True,progressive=True)`,path.join(SCR,name),...list]);
    let o=0; gr.forEach(m=>{ const a=m.a; const e={id:a.id,grade:+G,ch:a.ch,title:a.title,fit:a.fit,link:a.link,topics:a.topics,pages:m.files.length,short:a.short,desc:a.desc,inside:a.inside,sp:{f:name,o,n:list.length}};
      if(a.thumbs) e.thumbs=a.thumbs; if(a.board) e.board=a.board; if(a.own) e.own=true; if(a.kind) e.kind=a.kind; out.push(e); o+=m.files.length; });
    console.log('sprite',name,list.length,'sider',Math.round(fs.statSync(path.join(SCR,name)).size/1024)+' kB'); });
  fs.writeFileSync(path.join(SCR,'jt','acts','acts'+G+'.json'),JSON.stringify(out));
  console.log(bad?`FEIL: ${bad}`:'alt ok');
})();
