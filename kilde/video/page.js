// Åpner nettsiden (index.html i roten av repoet) i en 1280x720-nettleser for filming.
const path=require('path'); const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..','..');
async function openPage(){ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1});
  const p=await ctx.newPage();
  // Fast «tilfeldighet»: modellene trekker de samme tallene hver gang for samme frø, slik at manus og bilder stemmer overens.
  await p.addInitScript(()=>{ let a=1; const rnd=()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };
    Math.random=rnd; window.__seed=str=>{ let h=2166136261; for(const c of String(str)){ h^=c.charCodeAt(0); h=Math.imul(h,16777619); } a=h>>>0; }; });
  await p.goto('file://'+path.join(ROOT,'index.html')); await p.waitForTimeout(500);
  await p.evaluate(()=>document.fonts.ready); if(!(await p.evaluate(()=>!!window.__mat8))) throw new Error('window.__mat8 mangler i index.html');
  return {b,p}; }
module.exports={openPage,ROOT};
