const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
(async()=>{const b=await chromium.launch();const out=path.join(__dirname,'out');
for(const f of fs.readdirSync(out).filter(f=>f.endsWith('.html'))){const p=await b.newPage();await p.goto('file://'+path.join(out,f));await p.evaluate(()=>document.fonts.ready);
 const bad=await p.evaluate(()=>[...document.querySelectorAll('.cell,.side,.sq,.ms,.pgfull')].filter(e=>e.scrollHeight>e.clientHeight+1||e.scrollWidth>e.clientWidth+1).map(e=>e.className+': '+e.textContent.slice(0,40)));
 if(bad.length)console.log('OVERFLOW',f,bad.slice(0,6));
 await p.pdf({path:path.join(out,f.replace('.html','.pdf')),preferCSSPageSize:true,printBackground:true});await p.close();}
await b.close();})();
