// Felles verktøy for klasseaktiviteter (PDF-sider i A4)
const fs=require('fs'), path=require('path');
const FS=path.join(__dirname,'..','node_modules','@fontsource');
const font=(fam,file,w)=>`@font-face{font-family:"${fam}";font-weight:${w};src:url(data:font/woff2;base64,${fs.readFileSync(path.join(FS,file)).toString('base64')}) format("woff2")}`;
const FONTS=[font('Atkinson Hyperlegible','atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2',400),font('Atkinson Hyperlegible','atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff2',700),
 font('Bricolage Grotesque','bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2',800),font('JetBrains Mono','jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2',400),font('JetBrains Mono','jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2',700),
 font('Caveat','caveat/files/caveat-latin-700-normal.woff2',700)].join('\n');

const C={ink:'#141E36',muted:'#56617A',line:'#D2DAE8',pen:'#2343B0',red:'#C2362B',ok:'#1B7646',orange:'#C77700',soft:'#EEF1F9',redsoft:'#FBECEA'};
const CSS=`${FONTS}
@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:"Atkinson Hyperlegible",sans-serif;color:${C.ink};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:210mm;height:297mm;padding:13mm 15mm 14mm;position:relative;page-break-after:always;overflow:hidden;display:flex;flex-direction:column}
.pg .body{flex:1;min-height:0;display:flex;flex-direction:column}
.eye{font:400 8.5pt "JetBrains Mono",monospace;letter-spacing:.06em;text-transform:uppercase;color:${C.muted};margin:0 0 1.5mm}
h1{font:800 24pt/1.05 "Bricolage Grotesque",sans-serif;margin:0 0 1.5mm}h1 small{font-size:13pt;color:${C.red};margin-left:3mm}
.lede{font-size:10.5pt;color:${C.muted};margin:0 0 2.5mm;line-height:1.38}
h2{font-size:12.5pt;color:${C.pen};margin:3.2mm 0 1.2mm}
p{margin:0 0 1.6mm;font-size:10.3pt;line-height:1.38}
ol.st,ul.st{margin:0 0 2mm;padding-left:6mm;font-size:10.3pt;line-height:1.38}ol.st li::marker{color:${C.pen};font-weight:700}ul.st li::marker{color:${C.pen}}
ol.st li,ul.st li{margin-bottom:.6mm}
.box{border:1.3px solid ${C.pen};background:${C.soft};padding:2.4mm 3.5mm;margin:2.5mm 0;font-size:10pt}
.box.red{border-color:${C.red};background:${C.redsoft}}.box b.t{display:block;font-size:11.5pt;color:${C.pen};margin-bottom:1mm}.box.red b.t{color:${C.red}}
.box p:last-child,.box ul:last-child,.box ol:last-child{margin-bottom:0}
.mono{font:400 9.3pt "JetBrains Mono",monospace}
.a{color:${C.red};font-weight:700}
.ln{display:block;border-bottom:1px solid #B9C2D3;height:6.6mm}
table.t{border-collapse:collapse;font-size:10pt}table.t td,table.t th{border:1px solid #9AA6BD;padding:1.2mm 2.2mm;text-align:center}table.t th{background:${C.soft};color:${C.pen}}
.cols{display:grid;gap:4mm}
.frac{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1;margin:0 .5mm;font-size:.92em}.frac>span:first-child{border-bottom:1.2px solid currentColor;padding:0 .6mm .4mm}.frac>span:last-child{padding:.4mm .6mm 0}
sup{font-size:.62em;vertical-align:.62em;line-height:0}
footer{position:absolute;left:15mm;right:15mm;bottom:7mm;display:flex;justify-content:space-between;font-size:7.5pt;color:${C.muted}}
.cardgrid{display:grid;flex:1;min-height:0;border-top:1.2px dashed #8792A8;border-left:1.2px dashed #8792A8}
.card{border-right:1.2px dashed #8792A8;border-bottom:1.2px dashed #8792A8;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:3mm;overflow:hidden}
.card .tag{position:absolute;top:2mm;left:2.5mm;font:400 7.5pt "JetBrains Mono",monospace;color:${C.muted};letter-spacing:.04em;text-transform:uppercase}
.card .nr{position:absolute;top:2mm;right:2.5mm;font:700 8pt "JetBrains Mono",monospace;color:${C.muted}}
.cut{font:400 7.5pt "JetBrains Mono",monospace;color:${C.muted};margin:0 0 1.5mm;letter-spacing:.04em}
.hand{font-family:Caveat,cursive;font-weight:700}
`;
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
// norsk tallformat: mellomrom i tusen, komma, ekte minus
const nf=(x,dec)=>{ if(dec!=null) x=Math.round(x*10**dec)/10**dec; const neg=x<0; let s=String(Math.round(Math.abs(x)*1e6)/1e6); let [i,d]=s.split('.'); if(i.length>=5) i=i.replace(/\B(?=(\d{3})+(?!\d))/g,' '); if(dec!=null&&dec>0){ d=(d||'').padEnd(dec,'0'); } return (neg?'−':'')+i+(d?','+d:''); };
const sg=x=>x<0?`(${nf(x)})`:nf(x);
const fr=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
function rng(seed){ let a=seed>>>0; return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const shuffle=(arr,R)=>{ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(R()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const gcd=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a; };

function page(o){ // o: eye,title,key(bool),lede,body,foot:[l,r]
  return `<article class="pg"><p class="eye">${o.eye}</p><h1>${o.title}${o.key?' <small>fasit</small>':''}${o.small?` <small style="color:${C.pen}">${o.small}</small>`:''}</h1>${o.lede?`<p class="lede">${o.lede}</p>`:''}<div class="body">${o.body}</div><footer><span>${o.foot[0]}</span><span>${o.foot[1]}</span></footer></article>`; }
// kortsider: cards = [html], cols x rows per side
function cardPages(o){ const per=o.cols*o.rows, out=[]; const n=Math.ceil(o.cards.length/per);
  for(let p=0;p<n;p++){ const slice=o.cards.slice(p*per,(p+1)*per); while(slice.length<per) slice.push('');
    out.push(page({eye:o.eye, title:o.title, small:o.small, body:`<p class="cut">✂ Klipp langs de stiplede linjene${o.cutNote?' · '+o.cutNote:''}</p><div class="cardgrid" style="grid-template-columns:repeat(${o.cols},minmax(0,1fr));grid-template-rows:repeat(${o.rows},minmax(0,1fr))">${slice.map(c=>`<div class="card"${o.cardStyle?` style="${o.cardStyle}"`:''}>${c}</div>`).join('')}</div>`, foot:[o.foot, `Side ${o.start+p} · ${o.label||'utskrift'}`]})); }
  return out; }
module.exports={C,CSS,esc,nf,sg,fr,rng,shuffle,gcd,page,cardPages};
