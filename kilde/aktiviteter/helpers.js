// Hjelpefunksjoner for oppgavegeneratorer
const {C,nf,fr,gcd}=require('./common');
const ri=(R,a,b)=>a+Math.floor(R()*(b-a+1));
const pick=(R,arr)=>arr[Math.floor(R()*arr.length)];
const SUP={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','-':'⁻'};
const sup=n=>String(n).split('').map(c=>SUP[c]||c).join('');
const P=(b,e)=>`${b}<sup>${e}</sup>`;
// ledd: koeffisient + variabel (variabel kan være 'x', 'x²', 'ab' osv.)
const term=(c,v,first)=>{ if(c===0) return ''; const a=Math.abs(c); const body=v?(a===1?v:nf(a)+v):nf(a); if(first) return (c<0?'−':'')+body; return (c<0?' − ':' + ')+body; };
const poly=(terms)=>{ let s='', f=true; terms.forEach(([c,v])=>{ if(c===0) return; s+=term(c,v,f); f=false; }); return s||'0'; };
const lin=(a,b,v='x')=>poly([[a,v],[b,'']]);
const red=(n,d)=>{ if(d<0){n=-n;d=-d;} const g=gcd(n,d)||1; return [n/g,d/g]; };
const F=(n,d)=>{ const [a,b]=red(n,d); if(b===1) return nf(a); return (a<0?'−':'')+fr(Math.abs(a),b); };
const Fmix=(n,d)=>{ const [a,b]=red(n,d); if(b===1) return nf(a); if(Math.abs(a)>b){ const w=Math.trunc(a/b), r=Math.abs(a)%b; return `${F(a,b)} = ${nf(w)} ${fr(r,b)}`; } return F(a,b); };
const tbl=(xs,ys)=>`<table class="t ct"><tr><th>x</th>${xs.map(x=>`<td>${nf(x)}</td>`).join('')}</tr><tr><th>y</th>${ys.map(y=>`<td>${nf(y)}</td>`).join('')}</tr></table>`;
// liten graf av en funksjon i et rutenett
function plot(f,o={}){ const x0=o.x0??-5,x1=o.x1??5,y0=o.y0??-5,y1=o.y1??5, W=o.w||40, H=o.h||40, sx=W/(x1-x0), sy=H/(y1-y0); const X=x=>(x-x0)*sx, Y=y=>(y1-y)*sy;
  let g=`<svg viewBox="-1 -1 ${W+2} ${H+2}" width="${o.mm||36}mm" height="${(o.mm||36)*H/W}mm">`;
  const sx_=o.xs||1, sy_=o.ys||1;
  for(let x=Math.ceil(x0/sx_)*sx_;x<=x1;x+=sx_) g+=`<line x1="${X(x)}" x2="${X(x)}" y1="0" y2="${H}" stroke="${x===0?C.ink:'#DCE2EC'}" stroke-width="${x===0?.5:.2}"/>`;
  for(let y=Math.ceil(y0/sy_)*sy_;y<=y1;y+=sy_) g+=`<line y1="${Y(y)}" y2="${Y(y)}" x1="0" x2="${W}" stroke="${y===0?C.ink:'#DCE2EC'}" stroke-width="${y===0?.5:.2}"/>`;
  if(o.lab!==false){ const fs=o.fs||2.4; g+=`<text x="${X(sx_)}" y="${Y(0)+fs+.6}" font-size="${fs}" text-anchor="middle" font-family="Atkinson Hyperlegible">${nf(sx_)}</text><text x="${X(0)-.8}" y="${Y(sy_)+fs*.35}" font-size="${fs}" text-anchor="end" font-family="Atkinson Hyperlegible">${nf(sy_)}</text>`; }
  const pts=[]; const n=o.n||120; for(let i=0;i<=n;i++){ const x=x0+(x1-x0)*i/n, y=f(x); if(y==null||!isFinite(y)||y<y0-.5||y>y1+.5){ pts.push(null); continue; } pts.push([X(x),Y(y)]); }
  let d='', pen=false; pts.forEach(p=>{ if(!p){ pen=false; return; } d+=(pen?'L':'M')+p[0].toFixed(2)+' '+p[1].toFixed(2)+' '; pen=true; });
  g+=`<path d="${d}" fill="none" stroke="${o.col||C.pen}" stroke-width="${o.sw||.8}" stroke-linejoin="round"/>`;
  return g+'</svg>'; }
const kr=v=>nf(v,Math.abs(v-Math.round(v))<1e-9?0:2)+' kr';
module.exports={ri,pick,sup,P,term,poly,lin,red,F,Fmix,tbl,plot,kr};
