// Klasseaktiviteter 10. trinn
const {C,nf,sg,fr,rng,shuffle,gcd,page,cardPages}=require('./common');
const A=[];
const ft=t=>`Matematikk 10. trinn · ${t}`;
const assert=(c,m)=>{ if(!c) throw new Error(m); };
const PI=Math.PI, r1=x=>Math.round(x*10)/10, r2=x=>Math.round(x*100)/100;
const qList=(Q,key,cls)=>`<ol class="q ${cls||''}">${Q.map(([q,a,lines])=>`<li><span>${q}</span>${key?`<span class="a">${a}</span>`:'<span class="ln"></span>'.repeat(lines==null?1:lines)}</li>`).join('')}</ol>`;
const QCSS=`ol.q{margin:0;padding-left:6mm;font-size:10.3pt;line-height:1.35}ol.q li{margin-bottom:1.3mm}ol.q li::marker{color:${C.pen};font-weight:700}ol.q .a{display:block}ol.q .ln{height:6.8mm}`;
const sheetPair=(o)=>[false,true].map(key=>page({eye:(key?'Fasit · ':'')+o.eye,title:o.title,key,lede:key?o.keyLede:o.lede,body:o.body(key),foot:[ft(o.title),key?`Side ${o.n+1} · fasit til læreren`:(o.n>1?`Side 1–${o.n} · elevark`:'Side 1 · elevark')]}));
const svgT=(x,y,t,o={})=>`<text x="${x}" y="${y}" font-size="${o.fs||3.4}" text-anchor="${o.a||'middle'}" font-weight="${o.w||700}" fill="${o.c||C.ink}" font-family="Atkinson Hyperlegible"${o.rot!=null?` transform="rotate(${o.rot} ${x} ${y})"`:''}>${t}</text>`;
const kr=v=>nf(v,Number.isInteger(Math.round(v*100)/100)?0:2)+' kr';
const pts=[[-2.3,-1.1,.7,1.9,3.4],[1.6,-.4,2.8,-3.1,.3]];
const eq=(f,g)=>{ for(let i=0;i<5;i++){ const v={x:pts[0][i],a:pts[1][i],b:pts[0][4-i],y:pts[1][4-i]}; if(Math.abs(f(v)-g(v))>1e-9) return false; } return true; };

/* ===== Kap 1 Algebra ===== */
/* 1 Algebra-tarsia */
{ const T='Algebra-tarsia';
  const sup='²';
  const PAIRS=[ ['6x + 9',v=>6*v.x+9,'3(2x + 3)',v=>3*(2*v.x+3)], ['x'+sup+' + 5x',v=>v.x*v.x+5*v.x,'x(x + 5)',v=>v.x*(v.x+5)], ['4a − 8b',v=>4*v.a-8*v.b,'4(a − 2b)',v=>4*(v.a-2*v.b)],
    ['8x : 4',v=>8*v.x/4,'2x',v=>2*v.x], ['2(x + 3) − (x − 1)',v=>2*(v.x+3)-(v.x-1),'x + 7',v=>v.x+7], ['3(a − 2) + 2(a + 4)',v=>3*(v.a-2)+2*(v.a+4),'5a + 2',v=>5*v.a+2],
    ['x'+sup+' − 9',v=>v.x*v.x-9,'(x + 3)(x − 3)',v=>(v.x+3)*(v.x-3)], ['10xy − 15y',v=>10*v.x*v.y-15*v.y,'5y(2x − 3)',v=>5*v.y*(2*v.x-3)], ['(6x + 3) : 3',v=>(6*v.x+3)/3,'2x + 1',v=>2*v.x+1] ];
  const DIS=[['3(2x + 9)',v=>6*v.x+27],['x'+sup+' + 5',v=>v.x*v.x+5],['4(a − 8b)',v=>4*v.a-32*v.b],['4x',v=>4*v.x],['x + 5',v=>v.x+5],['5a + 14',v=>5*v.a+14],['(x − 3)'+sup,v=>(v.x-3)**2],['5y(2x − 15)',v=>5*v.y*(2*v.x-15)],['2x + 3',v=>2*v.x+3]];
  const check=()=>{ PAIRS.forEach(p=>assert(eq(p[1],p[3]),'par '+p[0])); const all=[...PAIRS.flatMap((p,i)=>[[p[0],p[1],i],[p[2],p[3],i]]),...DIS.map((d,i)=>[d[0],d[1],'d'+i])];
    all.forEach((a,i)=>all.forEach((b,j)=>{ if(i<j&&a[2]!==b[2]) assert(!eq(a[1],b[1]),'tvetydig '+a[0]+' = '+b[0]); })); };
  // geometri: stor trekant med 3 rader, s = sidelengde
  const s=58, h=s*Math.sqrt(3)/2, X0=0, Y0=0;
  const slots=[]; for(let r=0;r<3;r++) for(let k=0;k<2*r+1;k++){ const up=k%2===0, c=(k-(up?0:1))/2; const xL=X0+(3-r-1)*s/2+c*s; let P;
      if(up) P=[[xL+s/2,Y0+r*h],[xL,Y0+(r+1)*h],[xL+s,Y0+(r+1)*h]]; else P=[[xL+s/2,Y0+r*h],[xL+s/2,Y0+r*h],[xL,Y0+r*h]];
      if(!up){ const x=xL+s/2; P=[[x,Y0+r*h],[x+s/2,Y0+(r+1)*h],[x+s,Y0+r*h]]; P=[[x,Y0+r*h],[x+s/2,Y0+(r+1)*h],[x+s,Y0+r*h]]; }
      slots.push({r,k,up,P}); }
  // fiks ned-trekanter: plassering mellom to opp-trekanter
  slots.forEach(sl=>{ if(!sl.up){ const xL=X0+(3-sl.r-1)*s/2+((sl.k-1)/2)*s; const x=xL+s/2; sl.P=[[x,Y0+sl.r*h],[x+s/2,Y0+(sl.r+1)*h],[x+s,Y0+sl.r*h]]; } });
  const key=(p,q)=>[p,q].map(z=>z.map(v=>v.toFixed(2)).join(',')).sort().join('|');
  const edges={}; slots.forEach((sl,si)=>{ for(let e=0;e<3;e++){ const p=sl.P[e], q=sl.P[(e+1)%3], kk=key(p,q); (edges[kk]=edges[kk]||[]).push([si,e]); } });
  const lab=slots.map(()=>[null,null,null]); let pi=0, di=0;
  Object.values(edges).forEach(list=>{ if(list.length===2){ const P=PAIRS[pi++]; lab[list[0][0]][list[0][1]]=P[0]; lab[list[1][0]][list[1][1]]=P[2]; } else { lab[list[0][0]][list[0][1]]=DIS[di++][0]; } });
  const check2=()=>{ check(); assert(pi===9&&di===9,'kanter '+pi+' '+di); };
  const tri=(P,L,o={})=>{ const cx=(P[0][0]+P[1][0]+P[2][0])/3, cy=(P[0][1]+P[1][1]+P[2][1])/3; let t=`<polygon points="${P.map(p=>p.join(',')).join(' ')}" fill="${o.fill||'#fff'}" stroke="${C.ink}" stroke-width="${o.sw||.5}"/>`;
    for(let e=0;e<3;e++){ const p=P[e], q=P[(e+1)%3], mx=(p[0]+q[0])/2, my=(p[1]+q[1])/2, nx=cx-mx, ny=cy-my, nl=Math.hypot(nx,ny), ux=nx/nl, uy=ny/nl; const rot=Math.atan2(ux,-uy)*180/PI; const tx=mx+ux*4.2, ty=my+uy*4.2;
      t+=`<text x="${tx.toFixed(2)}" y="${ty.toFixed(2)}" font-size="3.6" text-anchor="middle" dominant-baseline="middle" font-weight="700" font-family="Atkinson Hyperlegible" fill="${C.ink}" transform="rotate(${rot.toFixed(1)} ${tx.toFixed(2)} ${ty.toFixed(2)})">${L[e]}</text>`; }
    if(o.n) t+=svgT(cx,cy+1.5,o.n,{fs:4,c:'#B9C2D3'}); return t; };
  const board=(L,showN)=>`<svg viewBox="-2 -2 ${3*s+4} ${3*h+4}" width="${3*s+4}mm" height="${3*h+4}mm">${slots.map((sl,i)=>tri(sl.P,L[i],{n:showN?String(i+1):''})).join('')}</svg>`;
  const R=rng(101); const perm=shuffle(slots.map((_,i)=>i),R); const printed=slots.map((sl,i)=>{ const L=lab[perm[i]], sh=Math.floor(R()*3); return [L[sh%3],L[(sh+1)%3],L[(sh+2)%3]]; });
  const p1=page({eye:'Klasseaktivitet · 10. trinn · Kapittel 1 · Algebraiske uttrykk',title:T,lede:'Et puslespill i par eller grupper på tre. Ni trekantbrikker skal legges sammen til én stor trekant. Der to brikker møtes, må uttrykkene være like, for eksempel 6x + 9 og 3(2x + 3). Varighet: 20–30 minutter.',
    body:`<h2>Slik gjør dere</h2><ol class="st"><li>Skriv ut side 2 til hver gruppe og klipp ut de ni trekantene.</li><li>Finn to brikker med kanter som hører sammen: det ene uttrykket er faktorisert, forkortet eller trukket sammen, og det andre er det samme uttrykket skrevet på en annen måte.</li><li>Legg brikkene inntil hverandre. Til slutt skal de danne én stor trekant.</li><li>Uttrykkene på ytterkanten har ingen partner. De er laget for å lure, så kontroller hvert par nøye.</li></ol>
    <div class="box red"><b class="t">Tips</b><ul class="st"><li>Begynn med uttrykkene der du er helt sikker, for eksempel 8x : 4.</li><li>Kontroller et par ved å sette inn et tall for x, for eksempel x = 2.</li></ul></div>
    <h2>Til læreren: fasit</h2><div class="center">${board(lab,false)}</div>`,foot:[ft(T),'Side 1 · instruksjoner og fasit']});
  const p2=page({eye:'Klasseaktivitet · Algebra-tarsia',title:T,small:'brikker',body:`<p class="cut">✂ Klipp langs de heltrukne linjene. Brikkene er stokket og rotert.</p><div class="center">${board(printed,false)}</div>`,foot:[ft(T),'Side 2 · brikker']});
  A.push({id:'algebra-tarsia', ch:'10k1', title:T, fit:'10. trinn · Kapittel 1 · Algebraiske uttrykk', link:'#10k1-faktor-alg', topics:['faktor-alg','forkort-alg','parentes-alg','brokuttrykk'], thumbs:['Side 1 · instruksjoner og fasit','Side 2 · brikker'],
    short:'Trekantpuslespill der like uttrykk skal møtes: faktorisering, forkorting og parenteser.',
    desc:'Ni trekantbrikker skal settes sammen til én stor trekant. Der to brikker møtes, må uttrykkene være like: et faktorisert og et utganget uttrykk, eller et uttrykk før og etter sammentrekking. Ytterkantene har uttrykk som skal lure.',
    inside:['Side 1: instruksjoner, tips og fasit','Side 2: ni trekantbrikker å klippe ut'], check:check2,
    css:`.center{display:flex;justify-content:center}`, pages:[p1,p2]});
}

/* 2 Hoderegning med kvadratsetningene */
{ const T='Mennesket mot kalkulatoren';
  const Q=[['21²','(20 + 1)² = 400 + 40 + 1',441],['39²','(40 − 1)² = 1600 − 80 + 1',1521],['102²','(100 + 2)² = 10 000 + 400 + 4',10404],['98²','(100 − 2)² = 10 000 − 400 + 4',9604],
    ['49 · 51','(50 − 1)(50 + 1) = 2500 − 1',2499],['38 · 42','(40 − 2)(40 + 2) = 1600 − 4',1596],['103 · 97','(100 + 3)(100 − 3) = 10 000 − 9',9991],['31² − 29²','(31 + 29)(31 − 29) = 60 · 2',120],
    ['75² − 25²','(75 + 25)(75 − 25) = 100 · 50',5000],['1001²','(1000 + 1)² = 1 000 000 + 2000 + 1',1002001],['999 · 1001','(1000 − 1)(1000 + 1) = 1 000 000 − 1',999999],['4,9 · 5,1','(5 − 0,1)(5 + 0,1) = 25 − 0,01',24.99]];
  const ev=s=>Function('return '+s.replace(/(\d),(\d)/g,'$1.$2').replace(/ /g,'').replace(/(\d+(?:\.\d+)?)²/g,'($1**2)').replace(/·/g,'*').replace(/−/g,'-'))();
  const check=()=>{ Q.forEach(q=>assert(Math.abs(ev(q[0])-q[2])<1e-9,'kv '+q[0])); };
  const box=(t,f,ex)=>`<div class="ks"><b>${t}</b><span>${f}</span><small>${ex}</small></div>`;
  const body=key=>`<div class="kv3">${box('1. kvadratsetning','(a + b)² = a² + 2ab + b²','21² = (20 + 1)² = 441')}${box('2. kvadratsetning','(a − b)² = a² − 2ab + b²','19² = (20 − 1)² = 361')}${box('3. kvadratsetning','(a + b)(a − b) = a² − b²','19 · 21 = 400 − 1 = 399')}</div>
    <h2>Konkurransen</h2><p>Halve klassen får kalkulator, den andre halvdelen bare hodet og kvadratsetningene. Læreren leser opp ett stykke om gangen. Hvem er raskest? Etterpå bytter dere.</p>
    <table class="t kt"><tr><th>Nr.</th><th>Regn ut</th><th>Skriv om med en kvadratsetning</th><th>Svar</th></tr>${Q.map((q,i)=>`<tr><td>${i+1}</td><td><b>${q[0]}</b></td><td>${key?`<span class="a">${q[1]}</span>`:''}</td><td>${key?`<span class="a">${nf(q[2])}</span>`:''}</td></tr>`).join('')}</table>
    <h2>Tenk etter</h2>${qList([['Hvilke stykker gikk raskest i hodet? Hvorfor?','Stykker der tallene ligger like over og under et rundt tall, som 49 · 51.'],['Lag tre egne stykker som er enkle med kvadratsetningene, men vanskelige uten.','Svarene varierer.']],key)}`;
  A.push({id:'mennesket-mot-kalkulatoren', ch:'10k1', title:T, fit:'10. trinn · Kapittel 1 · Multiplikasjon og kvadratsetningene', link:'#10k1-kvsetn1', topics:['polynom','kvsetn1','kvsetn2','kvsetn3'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Kan hoderegning med kvadratsetningene slå kalkulatoren? 49 · 51, 98², 31² − 29² …',
    desc:'Halve klassen regner med kalkulator, den andre halvdelen med kvadratsetningene i hodet. Tolv stykker som 49 · 51, 98² og 31² − 29² viser hvor kraftige kvadratsetningene er.',
    inside:['Side 1: elevark med de tre kvadratsetningene, tolv stykker og spørsmål','Side 2: fasit med omskriving og svar'], check,
    css:QCSS+`.kv3{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}.ks{border:1.2px solid ${C.pen};background:${C.soft};padding:2.5mm;display:flex;flex-direction:column;gap:1mm}.ks b{color:${C.pen};font-size:10pt}.ks span{font-size:11.5pt;font-weight:700}.ks small{font-size:9pt;color:${C.muted}}
      table.kt{width:100%}table.kt td{height:8.4mm;font-size:11pt}table.kt td:nth-child(3){width:48%}`,
    pages:sheetPair({eye:'Klasseaktivitet · 10. trinn · Kapittel 1 · Kvadratsetningene',title:T,n:1,lede:'Kvadratsetningene er ikke bare for algebra. De gjør vanskelige gangestykker enkle å regne i hodet.',keyLede:'Omskriving og svar på alle stykkene.',body})});
}

/* 3 Finn feilen */
{ const T='Finn feilen';
  const S=[ {e:'3x + 5 = 20',st:['3x = 25','x = 25 : 3'],bad:1,fix:'Vi må trekke fra 5 på begge sider: 3x = 15, så x = 5.',ok:x=>3*x+5===20,ans:[5]},
    {e:'2(x − 4) = 10',st:['2x − 4 = 10','2x = 14','x = 7'],bad:1,fix:'Begge leddene i parentesen må ganges med 2: 2x − 8 = 10, så 2x = 18 og x = 9.',ok:x=>2*(x-4)===10,ans:[9]},
    {e:'5x − 3 = 2x + 9',st:['5x + 2x = 9 + 3','7x = 12','x = 12 : 7'],bad:1,fix:'Når 2x flyttes over, skifter det fortegn: 5x − 2x = 12, så 3x = 12 og x = 4.',ok:x=>5*x-3===2*x+9,ans:[4]},
    {e:'x² = 49',st:['x = 7'],bad:1,fix:'Det finnes to løsninger: x = 7 og x = −7.',ok:x=>x*x===49,ans:[7,-7]},
    {e:`${fr('x',3)} + 2 = 6`,st:['x + 2 = 18','x = 16'],bad:1,fix:'Alle ledd må ganges med 3: x + 6 = 18, så x = 12.',ok:x=>x/3+2===6,ans:[12]},
    {e:`${fr('x',4)} = ${fr(6,8)}`,st:[`x = ${fr('6 · 8',4)}`,'x = 12'],bad:1,fix:'Vi ganger med 4 på begge sider: x = 6 · 4 : 8 = 3.',ok:x=>x/4===6/8,ans:[3]},
    {e:'x² − 5x = 0',st:['x(x − 5) = 0','x = 5'],bad:2,fix:'Et produkt er null når en av faktorene er null. Både x = 0 og x = 5 er løsninger.',ok:x=>x*x-5*x===0,ans:[0,5]},
    {e:`${fr('x',2)} + ${fr('x',3)} = 10`,st:['3x + 2x = 10','5x = 10','x = 2'],bad:1,fix:'Høyre side må også ganges med 6: 3x + 2x = 60, så 5x = 60 og x = 12.',ok:x=>Math.abs(x/2+x/3-10)<1e-9,ans:[12]} ];
  const check=()=>{ S.forEach((s,i)=>{ s.ans.forEach(a=>assert(s.ok(a),'løsning '+(i+1))); let n=0; for(let x=-60;x<=60;x+=0.5) if(s.ok(x)) n++; assert(n===s.ans.length,'antall løsninger '+(i+1)); }); };
  const body=key=>`<p>Hver løsning under har nøyaktig én feil. Finn linjen med feilen, forklar hva som er galt, og løs likningen riktig.</p>
    <div class="ff">${S.map((s,i)=>`<div class="fi"><b class="n">${i+1}</b><div class="sol"><div class="l">${s.e}</div>${s.st.map((x,j)=>`<div class="l${key&&j+1===s.bad?' bad':''}">${x}</div>`).join('')}</div><div class="w">${key?`<span class="a">Feil i linje ${s.bad+1}. ${s.fix}</span>`:'<span>Feilen:</span><i></i><span>Riktig svar:</span><i></i>'}</div></div>`).join('')}</div>`;
  A.push({id:'finn-feilen', ch:'10k1', title:T, fit:'10. trinn · Kapittel 1 · Å løse likninger', link:'#10k1-likn10', topics:['likn10','kvadratisk-likn','proporsjon','brokliknx'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Åtte løste likninger med én feil hver. Finn feilen og rett den.',
    desc:'Elevene blir lærere: åtte likninger er løst, men hver løsning har én typisk feil, som å glemme å gange alle ledd, feil fortegn eller en glemt negativ løsning. Elevene finner feilen, forklarer den og løser riktig.',
    inside:['Side 1: elevark med åtte løsninger å rette','Side 2: fasit med feilen markert og forklart'], check,
    css:`.ff{display:grid;grid-template-columns:1fr 1fr;gap:3mm 5mm}.fi{border:1.2px solid ${C.line};border-radius:2mm;padding:2.5mm 3mm;display:grid;grid-template-columns:6mm 1fr;gap:1mm 2mm;font-size:10.5pt}.fi .n{color:${C.pen};font-size:13pt}.sol .l{padding:.6mm 1.5mm;border-left:2px solid ${C.line};margin-bottom:.4mm}.sol .l:first-child{font-weight:700}.sol .l.bad{border-left-color:${C.red};background:${C.redsoft}}
      .w{grid-column:1/-1;display:grid;grid-template-columns:auto 1fr;gap:1.5mm 2mm;align-items:end;font-size:9pt;color:${C.muted};margin-top:1mm}.w i{border-bottom:1px solid #B9C2D3;height:6mm}.w .a{grid-column:1/-1;font-size:9.6pt}`,
    pages:sheetPair({eye:'Utforsk · 10. trinn · Kapittel 1 · Å løse likninger',title:T,n:1,lede:'Er du en god matematikklærer? Rett løsningene til en elev som har gjort én feil i hver oppgave.',keyLede:'Linjen med feilen er markert med rødt.',body})});
}

/* 4 Gåtebutikken */
{ const T='Gåtebutikken';
  const ic={c:`<svg viewBox="0 0 10 10" class="ic"><circle cx="5" cy="5" r="4.2" fill="${C.red}"/></svg>`,s:`<svg viewBox="0 0 10 10" class="ic"><rect x="1" y="1" width="8" height="8" rx="1" fill="${C.pen}"/></svg>`,t:`<svg viewBox="0 0 10 10" class="ic"><polygon points="5,.8 9.4,9 .6,9" fill="${C.ok}"/></svg>`};
  const row=(items,sum)=>`<div class="gr">${items.map(k=>ic[k]).join('<span>+</span>')}<span>=</span><b>${sum}</b></div>`;
  const check=()=>{ const c=6,s=5; assert(2*c+s===17&&c+s===11,'g1'); const s2=8,t2=4; assert(2*s2+t2===20&&s2+2*t2===16,'g2'); const v=160,b=90; assert(2*v+3*b===590&&v+2*b===340,'g3'); assert(12+8===20&&2*12+4*8===56,'g4'); assert(31+19===50&&31-19===12,'g5'); assert(2*2-1===3&&-2+5===3,'g6'); };
  const grid=(key)=>{ const S=5.2,M=6,W=2*M*S; let g=`<svg viewBox="-6 -6 ${W+12} ${W+12}" width="62mm" height="62mm">`; for(let i=-M;i<=M;i++){ const p=(i+M)*S; g+=`<line x1="${p}" x2="${p}" y1="0" y2="${W}" stroke="${i?'#D5DCE8':C.ink}" stroke-width="${i?.25:.6}"/><line y1="${p}" y2="${p}" x1="0" x2="${W}" stroke="${i?'#D5DCE8':C.ink}" stroke-width="${i?.25:.6}"/>`; if(i&&i%2===0){ g+=svgT(p,M*S+3.6,nf(i),{fs:2.6,w:400})+svgT(M*S-1.2,(M-i)*S+1,nf(i),{fs:2.6,a:'end',w:400}); } }
    if(key){ const X=x=>(x+M)*S, Y=y=>(M-y)*S; g+=`<line x1="${X(-2.5)}" y1="${Y(-6)}" x2="${X(3.5)}" y2="${Y(6)}" stroke="${C.pen}" stroke-width=".7"/><line x1="${X(-1)}" y1="${Y(6)}" x2="${X(6)}" y2="${Y(-1)}" stroke="${C.red}" stroke-width=".7"/><circle cx="${X(2)}" cy="${Y(3)}" r="1.2" fill="${C.ink}"/>`+svgT(X(2)+2,Y(3)-2,'(2, 3)',{fs:3,a:'start'}); }
    return g+'</svg>'; };
  const body=key=>`<h2>A · Bildegåter</h2><p>Hver figur har en fast pris i kroner. Finn prisen på hver figur, og skriv gåten som et likningssett.</p>
    <div class="gg"><div class="gb"><b class="n">1</b>${row(['c','c','s'],17)}${row(['c','s'],11)}${key?'<p class="a">● = 6 kr, ■ = 5 kr. Likningssett: 2x + y = 17 og x + y = 11.</p>':'<p>● = ____ kr &nbsp; ■ = ____ kr</p>'}</div>
      <div class="gb"><b class="n">2</b>${row(['s','s','t'],20)}${row(['s','t','t'],16)}${key?'<p class="a">■ = 8 kr, ▲ = 4 kr. Likningssett: 2x + y = 20 og x + 2y = 16.</p>':'<p>■ = ____ kr &nbsp; ▲ = ____ kr</p>'}</div></div>
    <h2>B · Tekstgåter</h2>${qList([['Kinobilletter: 2 voksne og 3 barn koster 590 kr. 1 voksen og 2 barn koster 340 kr. Hva koster én voksenbillett og én barnebillett?','v + 2b = 340 gir v = 340 − 2b. Innsatt: 2(340 − 2b) + 3b = 590, så b = 90 og v = 160. Voksen 160 kr, barn 90 kr.',2],
      ['På en parkeringsplass står det 20 sykler og biler. Til sammen har de 56 hjul. Hvor mange biler er det?','s + b = 20 og 2s + 4b = 56. Det gir b = 8 biler og s = 12 sykler.',2],
      ['Summen av to tall er 50, og differansen er 12. Hvilke tall er det?','x + y = 50 og x − y = 12. Addisjon gir 2x = 62, så x = 31 og y = 19.',2]],key)}
    <h2>C · Grafisk løsning</h2><div class="gc">${grid(key)}<div>${qList([['Tegn linjene y = 2x − 1 og y = −x + 5 i koordinatsystemet.','Se grafen.',1],['Les av skjæringspunktet. Hva er løsningen på likningssettet?','Skjæringspunktet er (2, 3), så x = 2 og y = 3.',1],['Kontroller svaret ved å sette inn i begge likningene.','2 · 2 − 1 = 3 og −2 + 5 = 3. Det stemmer.',1]],key)}</div></div>`;
  A.push({id:'gatebutikken', ch:'10k1', title:T, fit:'10. trinn · Kapittel 1 · Likningssett og problemløsning', link:'#10k1-likningssett', topics:['likningssett','grafisk-sett','problem-alg'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Bildegåter og tekstgåter som blir til likningssett, og grafisk løsning.',
    desc:'Elevene løser bildegåter der figurer har en hemmelig pris, og oversetter dem til likningssett. Så løser de tekstgåter om kinobilletter, hjul og tall, og finner en løsning grafisk ved å tegne to linjer.',
    inside:['Side 1: elevark med bildegåter, tekstgåter og grafisk løsning','Side 2: fasit med likningssett og graf'], check,
    css:QCSS+`.gg{display:grid;grid-template-columns:1fr 1fr;gap:4mm}.gb{border:1.2px solid ${C.line};border-radius:2mm;padding:2.5mm 3.5mm}.gb .n{color:${C.pen};font-size:13pt}.gr{display:flex;align-items:center;gap:2mm;font-size:15pt;font-weight:700;margin:1.5mm 0}.ic{width:8mm;height:8mm}.gb p{margin-top:2mm}.gc{display:flex;gap:5mm;align-items:flex-start}.gc>div{flex:1}`,
    pages:sheetPair({eye:'Utforsk · 10. trinn · Kapittel 1 · Likningssett',title:T,n:1,lede:'To ukjente krever to opplysninger. Finn prisene i gåtebutikken.',keyLede:'Løsninger med likningssett.',body})});
}

/* ===== Kap 2 Funksjoner ===== */
/* 5 Hvem er grafen? */
{ const T='Hvem er grafen?';
  const F=[[2,1],[2,-2],[1,3],[1,0],[1,-2],[-1,3],[-1,0],[-1,-2],[.5,1],[.5,-2],[-.5,3],[-.5,0],[0,2],[0,-1],[3,0],[-2,1]];
  const L='ABCDEFGHIJKLMNOP';
  const fs=(a,b)=>{ const as=a===1?'x':a===-1?'−x':a===0?'':a===.5?'0,5x':a===-.5?'−0,5x':`${nf(a)}x`; if(a===0) return `y = ${nf(b)}`; return `y = ${as}${b>0?` + ${b}`:b<0?` − ${-b}`:''}`; };
  const check=()=>{ assert(new Set(F.map(f=>f.join())).size===16,'unike'); };
  const gr=(a,b,big)=>{ const M=5, S=big?5:3.6, W=2*M*S; const X=x=>(x+M)*S, Y=y=>(M-y)*S; let g=`<svg viewBox="-1 -1 ${W+2} ${W+2}" width="${big?44:38}mm" height="${big?44:38}mm">`;
    for(let i=-M;i<=M;i++){ const p=(i+M)*S; g+=`<line x1="${p}" x2="${p}" y1="0" y2="${W}" stroke="${i?'#DCE2EC':C.ink}" stroke-width="${i?.2:.5}"/><line y1="${p}" y2="${p}" x1="0" x2="${W}" stroke="${i?'#DCE2EC':C.ink}" stroke-width="${i?.2:.5}"/>`; }
    [1,-1].forEach(t=>{ g+=svgT(X(t*1),Y(0)+(big?3.4:2.8),nf(t),{fs:big?2.6:2.2,w:400})+svgT(X(0)-1,Y(t)+.8,nf(t),{fs:big?2.6:2.2,a:'end',w:400}); });
    // klipp linjen til ruten
    const x1=-M, x2=M; let P=[[x1,a*x1+b],[x2,a*x2+b]]; if(a!==0){ P=P.map(([x,y])=>{ if(y>M) return [(M-b)/a,M]; if(y<-M) return [(-M-b)/a,-M]; return [x,y]; }); }
    g+=`<line x1="${X(P[0][0])}" y1="${Y(P[0][1])}" x2="${X(P[1][0])}" y2="${Y(P[1][1])}" stroke="${C.pen}" stroke-width="${big?.9:.8}"/>`; return g+'</svg>'; };
  const boardSheet=page({eye:'Klasseaktivitet · Hvem er grafen?',title:T,small:'spillebrett',body:`<p>Kryss ut grafene som ikke kan være motstanderens graf.</p><div class="hb">${F.map((f,i)=>`<div><b>${L[i]}</b>${gr(f[0],f[1],false)}</div>`).join('')}</div>`,foot:[ft(T),'Side 2 · spillebrett (ett per elev)']});
  const cards=F.map((f,i)=>`<span class="tag">Hemmelig graf</span><span class="nr gl">${L[i]}</span>${gr(f[0],f[1],true)}<b class="fx">${fs(f[0],f[1])}</b>`);
  const p1=page({eye:'Klasseaktivitet · 10. trinn · Kapittel 2 · Funksjon og graf',title:T,lede:'Et spill for to, som «Gjett hvem». Begge har et hemmelig kort med en rett linje. Ved å stille ja/nei-spørsmål om stigningstall, konstantledd og skjæringspunkter prøver de å finne motstanderens graf. Varighet: 15–20 minutter.',
    body:`<h2>Forberedelser</h2><ol class="st"><li>Skriv ut side 2 til hver elev, og side 3–4 (hemmelige kort) til hvert par. Klipp ut kortene.</li></ol>
    <h2>Slik spiller dere</h2><ol class="st"><li>Begge trekker et hemmelig kort uten å vise det.</li><li>Bytt på å stille ett ja/nei-spørsmål om gangen, for eksempel: «Er stigningstallet negativt?», «Skjærer grafen y-aksen over 0?», «Går grafen gjennom (0, 0)?»</li><li>Kryss ut grafene på brettet som ikke passer med svaret.</li><li>Den som først gjetter riktig graf, og kan si funksjonsuttrykket, vinner.</li></ol>
    <div class="box red"><b class="t">Ikke lov</b><p>Det er ikke lov å spørre om bokstaven eller hele funksjonsuttrykket direkte. Spørsmålene skal handle om egenskaper ved grafen.</p></div>
    <div class="box"><b class="t">Til læreren: alle grafene</b><div class="kj">${F.map((f,i)=>`<span><b>${L[i]}</b> ${fs(f[0],f[1])}</span>`).join('')}</div></div>
    <p><b>Snakk om etterpå:</b> Hvilke spørsmål delte grafene i to like store grupper? Hvorfor er det lurt?</p>`,foot:[ft(T),'Side 1 · instruksjoner og fasit']});
  A.push({id:'hvem-er-grafen', ch:'10k2', title:T, fit:'10. trinn · Kapittel 2 · Funksjon og graf', link:'#10k2-stigningstall', topics:['koord-10','funksjon-graf','tegne-lineaer','stigningstall','konstantledd'], thumbs:['Side 1 · instruksjoner','Side 2 · spillebrett'],
    short:'«Gjett hvem» med rette linjer: spør om stigningstall og konstantledd.',
    desc:'Et spill for to der hver elev har en hemmelig graf. De stiller ja/nei-spørsmål om stigningstall, konstantledd og skjæringspunkter, krysser ut grafer på brettet og prøver å finne motstanderens funksjon først.',
    inside:['Side 1: instruksjoner og fasit med alle funksjonene','Side 2: spillebrett med 16 grafer','Side 3–4: 16 hemmelige kort med graf og funksjonsuttrykk'], check,
    css:`.hb{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm}.hb div{border:1.2px solid ${C.line};border-radius:2mm;padding:1.5mm;display:flex;flex-direction:column;align-items:center}.hb b{color:${C.pen};font-size:12pt}.gl{font:800 14pt "Bricolage Grotesque"!important;color:${C.pen}!important}.fx{font-size:14pt;margin-top:1.5mm}.kj{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2mm 3mm;font-size:10pt}`,
    pages:[p1,boardSheet,...cardPages({cards,cols:2,rows:4,eye:'Klasseaktivitet · Hvem er grafen?',title:T,foot:ft(T),start:3,label:'hemmelige kort'})]});
}

/* 6 Sorter sammenhengene */
{ const T='Sorter sammenhengene';
  const CAT={P:'Proporsjonal',L:'Lineær, men ikke proporsjonal',O:'Omvendt proporsjonal',I:'Ingen av disse'};
  const tb=(xs,ys)=>`<table class="t ct"><tr><th>x</th>${xs.map(x=>`<td>${x}</td>`).join('')}</tr><tr><th>y</th>${ys.map(y=>`<td>${y}</td>`).join('')}</tr></table>`;
  const K=[['P','Epler koster 25 kr per kg. Prisen y for x kg.'],['L','Taxi: 50 kr i startpris og 15 kr per km. Prisen y for x km.'],['O','8 pizzaer deles likt mellom x personer. Antall pizza per person.'],['O','Tiden det tar å kjøre 120 km med farten x km/h.'],
    ['I','Arealet y av et kvadrat med side x.'],['P',tb([1,2,3,4],[3,6,9,12]),[1,2,3,4],[3,6,9,12]],['O',tb([1,2,4,8],[24,12,6,3]),[1,2,4,8],[24,12,6,3]],['L',tb([0,1,2,3],[5,7,9,11]),[0,1,2,3],[5,7,9,11]],['I',tb([1,2,3,4],[1,4,9,16]),[1,2,3,4],[1,4,9,16]],
    ['P','<b class="fx">y = 4x</b>'],['O',`<b class="fx">y = ${fr(12,'x')}</b>`],['L','<b class="fx">y = 2x − 3</b>'],['I','<b class="fx">y = 2<sup>x</sup></b>'],['L','Et lys er 20 cm og brenner ned 2 cm per time. Lengden y etter x timer.'],['O','Et hus tar 60 timeverk å male. Tiden y når x personer maler.'],['P','Lønn: 180 kr per time. Lønna y for x timer.']];
  const kind=k=>{ if(!k[2]) return null; const xs=k[2], ys=k[3]; const prop=xs.every((x,i)=>Math.abs(ys[i]-ys[0]/xs[0]*x)<1e-9), inv=xs.every((x,i)=>Math.abs(ys[i]*x-ys[0]*xs[0])<1e-9), lin=xs.every((x,i)=>i<2||Math.abs((ys[i]-ys[i-1])/(x-xs[i-1])-(ys[1]-ys[0])/(xs[1]-xs[0]))<1e-9); return prop?'P':inv?'O':lin?'L':'I'; };
  const check=()=>{ K.forEach((k,i)=>{ const t=kind(k); if(t) assert(t===k[0],'tabell '+(i+1)+' '+t); }); };
  const R=rng(106); const order=shuffle(K.map((_,i)=>i),R);
  const cards=[...Object.entries(CAT).map(([k,v])=>`<span class="tag">Overskrift</span><b class="hd">${v}</b><small>${{P:'y = a · x',L:'y = a · x + b',O:'y = k : x',I:'en annen sammenheng'}[k]}</small>`),...order.map((i,n)=>`<span class="tag">Kort</span><span class="nr gl">${n+1}</span><div class="ctx">${K[i][1]}</div>`)];
  const p1=page({eye:'Klasseaktivitet · 10. trinn · Kapittel 2 · Lineære funksjoner og brøkfunksjoner',title:T,lede:'Gruppene sorterer 16 kort med situasjoner, tabeller og funksjonsuttrykk i fire kategorier. De må kunne forklare hvorfor hvert kort hører hjemme der det ligger. Varighet: 20–25 minutter.',
    body:`<h2>Slik gjør dere</h2><ol class="st"><li>Skriv ut side 2–3 til hver gruppe og klipp ut kortene. Legg de fire overskriftene på bordet.</li><li>Les ett kort om gangen og bli enige om hvilken kategori det hører til. Skriv gjerne et funksjonsuttrykk på kortet.</li><li>Når alle kortene er sortert: Finn kort som hører sammen på tvers av typene, for eksempel en situasjon og en tabell som passer til samme type.</li></ol>
    <div class="box red"><b class="t">Kjennetegn</b><ul class="st"><li><b>Proporsjonal:</b> y : x er alltid det samme. Grafen er en rett linje gjennom (0, 0).</li><li><b>Lineær:</b> y øker like mye hver gang x øker med 1. Rett linje, men ikke gjennom (0, 0).</li><li><b>Omvendt proporsjonal:</b> x · y er alltid det samme.</li></ul></div>
    <div class="box"><b class="t">Til læreren: fasit</b><div class="kj">${Object.entries(CAT).map(([k,v])=>`<div><b>${v}:</b> ${order.map((i,n)=>K[i][0]===k?n+1:null).filter(x=>x).join(', ')}</div>`).join('')}</div></div>`,foot:[ft(T),'Side 1 · instruksjoner og fasit']});
  A.push({id:'sorter-sammenhengene', ch:'10k2', title:T, fit:'10. trinn · Kapittel 2 · Lineære funksjoner og brøkfunksjoner', link:'#10k2-lin-funk', topics:['lin-funk','lin-graf','brokfunk','brok-graf'],
    short:'Sorter 16 kort: proporsjonal, lineær, omvendt proporsjonal eller ingen av delene.',
    desc:'Gruppene sorterer situasjoner, tabeller og funksjonsuttrykk i fire kategorier: proporsjonal, lineær, omvendt proporsjonal og ingen av disse. Elevene må begrunne hvert valg og finne kort som hører sammen.',
    inside:['Side 1: instruksjoner, kjennetegn og fasit','Side 2–3: 4 overskrifter og 16 sorteringskort'], check,
    css:`.hd{font:800 15pt "Bricolage Grotesque";color:${C.pen}}.card small{color:${C.muted};font-size:10pt;margin-top:1mm}.ctx{font-size:12.5pt;line-height:1.4;max-width:76mm}.fx{font-size:20pt}.gl{font:800 13pt "Bricolage Grotesque"!important;color:${C.pen}!important}table.ct td,table.ct th{padding:1.4mm 3mm;font-size:12pt}.kj{display:grid;gap:1.2mm;font-size:10pt}`,
    pages:[p1,...cardPages({cards,cols:2,rows:5,eye:'Klasseaktivitet · Sorter sammenhengene',title:T,foot:ft(T),start:2,label:'kort'})]});
}

/* 7 Største innhegning */
{ const T='Den største innhegningen';
  const A1=x=>x*(20-2*x), A2=x=>x*(12-x);
  const check=()=>{ let b=0,bx=0; for(let x=0;x<=10;x+=.01){ if(A1(x)>b){ b=A1(x); bx=x; } } assert(Math.abs(bx-5)<.02&&Math.abs(b-50)<1e-3,'A1'); assert(A2(6)===36,'A2'); };
  const fig=`<svg viewBox="0 0 80 40" width="70mm" height="35mm"><rect x="4" y="2" width="72" height="5" fill="#C9D1DF"/>${svgT(40,5.8,'vegg',{fs:3,w:400})}<rect x="20" y="7" width="40" height="22" fill="${C.soft}" stroke="${C.ok}" stroke-width="1" stroke-dasharray="2 1"/>${svgT(17,19,'x',{fs:3.6,a:'end'})}${svgT(63,19,'x',{fs:3.6,a:'start'})}${svgT(40,34,'20 − 2x',{fs:3.6})}</svg>`;
  const plot=(key)=>{ const W=120,H=70,X=x=>12+x*(W-18)/10,Y=y=>H-8-y*(H-14)/60; let g=`<svg viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm">`;
    for(let x=0;x<=10;x++) g+=`<line x1="${X(x)}" x2="${X(x)}" y1="${Y(0)}" y2="${Y(60)}" stroke="#DCE2EC" stroke-width=".25"/>`+svgT(X(x),H-3,x,{fs:2.8,w:400});
    for(let y=0;y<=60;y+=10) g+=`<line y1="${Y(y)}" y2="${Y(y)}" x1="${X(0)}" x2="${X(10)}" stroke="${y?'#DCE2EC':C.ink}" stroke-width="${y?.25:.5}"/>`+svgT(X(0)-1.5,Y(y)+1,y,{fs:2.8,a:'end',w:400});
    g+=`<line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(60)}" stroke="${C.ink}" stroke-width=".5"/>`+svgT(X(10),H-8.5+0,'x (m)',{fs:2.8,a:'end'})+svgT(X(0)+1,Y(60)-1.5,'A (m²)',{fs:2.8,a:'start'});
    if(key){ const p=[]; for(let x=0;x<=10;x+=.25) p.push(X(x)+','+Y(A1(x))); g+=`<polyline points="${p.join(' ')}" fill="none" stroke="${C.red}" stroke-width=".8"/><circle cx="${X(5)}" cy="${Y(50)}" r="1.2" fill="${C.ink}"/>`+svgT(X(5)+2,Y(50)-2,'(5, 50)',{fs:3,a:'start'}); }
    return g+'</svg>'; };
  const XS=[1,2,3,4,5,6,7,8,9];
  const body=key=>`<div class="ih">${fig}<p>Du har 20 meter gjerde og skal lage en rektangulær innhegning til en kanin. Den ene siden er en vegg, så der trengs det ikke gjerde. Hvor bred bør innhegningen være for at kaninen skal få mest mulig plass?</p></div>
    <h2>A · Tabell</h2><table class="t mt"><tr><th>x (m)</th>${XS.map(x=>`<td>${x}</td>`).join('')}</tr><tr><th>Lengde 20 − 2x (m)</th>${XS.map(x=>`<td>${key?`<span class="a">${20-2*x}</span>`:''}</td>`).join('')}</tr><tr><th>Areal A (m²)</th>${XS.map(x=>`<td>${key?`<span class="a">${A1(x)}</span>`:''}</td>`).join('')}</tr></table>
    <h2>B · Graf</h2><div class="gc">${plot(key)}<div>${qList([['Skriv en formel for arealet A(x).','A(x) = x(20 − 2x) = 20x − 2x²'],['Hvilken x gir størst areal? Hvor stort er det?','x = 5 m gir A = 50 m². Innhegningen blir 5 m × 10 m.'],['Hvorfor blir arealet 0 når x = 10?','Da er hele gjerdet brukt på de to sidene, og lengden 20 − 2x blir 0.']],key)}</div></div>
    <h2>C · Uten vegg</h2>${qList([['Nå har du 24 m gjerde og ingen vegg, så gjerdet går rundt på alle fire sider. Hvilke mål gir størst areal? Lag en tabell eller en graf.','Sidene er x og 12 − x. A(x) = x(12 − x) er størst for x = 6: et kvadrat på 6 m × 6 m med 36 m².',2]],key)}`;
  A.push({id:'storste-innhegning', ch:'10k2', title:T, fit:'10. trinn · Kapittel 2 · Andregradsfunksjoner', link:'#10k2-ekstremal', topics:['andregrad','andregrad-graf','ekstremal'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Hvilke mål gir kaninen mest plass? Et praktisk ekstremalproblem.',
    desc:'Med 20 meter gjerde og en vegg skal elevene lage størst mulig innhegning. De fyller ut en tabell, tegner grafen til arealfunksjonen og finner toppunktet. Til slutt løser de samme problem uten vegg og oppdager at kvadratet er best.',
    inside:['Side 1: elevark med tabell, koordinatsystem og spørsmål','Side 2: fasit med graf og toppunkt'], check,
    css:QCSS+`.ih{display:flex;gap:5mm;align-items:center}.ih p{flex:1}table.mt{width:100%}table.mt td{height:8mm}.gc{display:flex;gap:5mm;align-items:flex-start}.gc>div{flex:1}`,
    pages:sheetPair({eye:'Utforsk · 10. trinn · Kapittel 2 · Andregradsfunksjoner',title:T,n:1,lede:'Et klassisk optimeringsproblem: samme gjerde, ulike former, og bare én er best.',keyLede:'Tabell, graf og toppunkt.',body})});
}

/* 8 Terningforfall */
{ const T='Terningforfall';
  const f=n=>50*(5/6)**n;
  const check=()=>{ assert(r1(f(1))===41.7&&r1(f(5))===20.1&&r1(f(10))===8.1,'f'); const hl=Math.log(.5)/Math.log(5/6); assert(Math.abs(hl-3.80)<.01,'hl'); };
  const N=[0,1,2,3,4,5,6,7,8,9,10];
  const plot=(key)=>{ const W=110,H=62,X=x=>12+x*(W-18)/10,Y=y=>H-8-y*(H-14)/50; let g=`<svg viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm">`;
    for(let x=0;x<=10;x++) g+=`<line x1="${X(x)}" x2="${X(x)}" y1="${Y(0)}" y2="${Y(50)}" stroke="#DCE2EC" stroke-width=".25"/>`+svgT(X(x),H-3,x,{fs:2.8,w:400});
    for(let y=0;y<=50;y+=5) g+=`<line y1="${Y(y)}" y2="${Y(y)}" x1="${X(0)}" x2="${X(10)}" stroke="${y?'#DCE2EC':C.ink}" stroke-width="${y?.25:.5}"/>`+(y%10===0?svgT(X(0)-1.5,Y(y)+1,y,{fs:2.8,a:'end',w:400}):'');
    g+=`<line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(50)}" stroke="${C.ink}" stroke-width=".5"/>`+svgT(X(10),H-8.5,'kast nr.',{fs:2.8,a:'end'})+svgT(X(0)+1,Y(50)-1.5,'terninger igjen',{fs:2.8,a:'start'});
    if(key){ const p=[]; for(let x=0;x<=10;x+=.2) p.push(X(x)+','+Y(f(x))); g+=`<polyline points="${p.join(' ')}" fill="none" stroke="${C.red}" stroke-width=".8"/>`; }
    return g+'</svg>'; };
  const body=key=>`<p>Dere trenger 50 terninger per gruppe (eller sukkerbiter med én merket side). Kast alle terningene. Ta bort alle som viser 6. Tell hvor mange som er igjen, og kast dem på nytt. Fortsett i 10 kast.</p>
    <table class="t mt"><tr><th>Kast nr.</th>${N.map(n=>`<td>${n}</td>`).join('')}</tr><tr><th>Terninger igjen</th><td>50</td>${N.slice(1).map(()=>`<td>${key?'<span class="a">*</span>':''}</td>`).join('')}</tr><tr><th>Modell f(n)</th>${N.map(n=>`<td>${key?`<span class="a">${nf(r1(f(n)))}</span>`:''}</td>`).join('')}</tr></table>
    <div class="gc">${plot(key)}<div>${qList([['Hvor stor andel av terningene blir igjen etter hvert kast, i teorien? Hva er vekstfaktoren?',`${fr(5,6)} blir igjen. Vekstfaktoren er ${fr(5,6)} ≈ 0,83.`],['Skriv en modell f(n) for antall terninger etter n kast, og fyll ut den nederste raden.','f(n) = 50 · (5/6)ⁿ'],['Tegn både målingene og modellen i koordinatsystemet. Passer modellen?','Målingene ligger rundt modellen, men varierer tilfeldig.'],['Etter hvor mange kast er halvparten borte? (halveringstid)','Omtrent 3,8 kast: (5/6)ⁿ = 0,5 gir n ≈ 3,8.']],key)}</div></div>
    <h2>Riskornet på sjakkbrettet</h2>${qList([['En konge legger 1 riskorn på første rute på et sjakkbrett, 2 på den andre, 4 på den tredje, og dobler hele veien. Hvor mange riskorn ligger på rute 64? Skriv som potens.','2⁶³ ≈ 9,2 · 10¹⁸ riskorn. Til sammen på brettet: 2⁶⁴ − 1 ≈ 1,8 · 10¹⁹.']],key)}`;
  A.push({id:'terningforfall', ch:'10k2', title:T, fit:'10. trinn · Kapittel 2 · Eksponentialfunksjoner og modeller', link:'#10k2-eksp-funk', topics:['eksp-funk','eksp-vekst','mat-modell','regresjon'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Kast terninger, fjern seksere og se eksponentiell nedgang med egne øyne.',
    desc:'Et forsøk som modellerer eksponentiell nedgang: gruppene kaster 50 terninger, fjerner alle seksere og gjentar. De sammenligner målingene med modellen f(n) = 50 · (5/6)ⁿ, finner halveringstiden og avslutter med riskornet på sjakkbrettet.',
    inside:['Side 1: elevark med tabell, koordinatsystem og spørsmål','Side 2: fasit med modellverdier og graf'], check,
    css:QCSS+`table.mt{width:100%}table.mt td{height:8mm;font-size:9.5pt}.gc{display:flex;gap:5mm;align-items:flex-start;margin-top:3mm}.gc>div{flex:1}`,
    pages:sheetPair({eye:'Utforsk · 10. trinn · Kapittel 2 · Eksponentialfunksjoner',title:T,n:1,lede:'Hvordan avtar noe som hele tiden mister en fast andel? Finn ut med terninger.',keyLede:'Modellverdier avrundet til én desimal. * Målingene varierer fra gruppe til gruppe.',body})});
}

/* ===== Kap 3 Økonomi ===== */
/* 9 Tilbudsjakten */
{ const T='Tilbudsjakten';
  const check=()=>{ assert(1200*.75===900,'1'); assert(Math.abs(500*1.2*.8-480)<1e-9,'3'); assert(640/800===.8,'4'); assert(Math.abs(510/.85-600)<1e-9,'5'); assert(Math.round(6000*.7**3)===2058,'6'); assert(r2(999*.9)===899.1&&r2(1050*.85)===892.5,'7'); assert(r1((1.03**5-1)*100)===15.9,'8'); };
  const Q=[['En jakke koster 1200 kr. Den er satt ned 25 %. Hva er den nye prisen? Bruk vekstfaktor.','1200 · 0,75 = 900 kr'],
    ['Brus koster 20 kr flaska. Butikk A har «3 for 2». Butikk B gir 30 % rabatt. Hvor er det billigst å kjøpe 3 flasker?','A: 40 kr (33,3 % rabatt). B: 60 · 0,7 = 42 kr. Butikk A er billigst.'],
    ['En butikk setter opp prisen på en vare fra 500 kr med 20 %, og setter den så ned med 20 % på salg. Hva koster varen nå?','500 · 1,2 · 0,8 = 480 kr. Den er 4 % billigere enn før, ikke like dyr.'],
    ['Et par sko kostet 800 kr og koster nå 640 kr. Hvor mange prosent er de satt ned?','Vekstfaktor 640 : 800 = 0,8. Prisen er satt ned 20 %.'],
    ['Etter 15 % rabatt koster en genser 510 kr. Hva kostet den før?','510 : 0,85 = 600 kr'],
    ['En mobil koster 6000 kr og taper 30 % av verdien hvert år. Hva er den verdt etter 3 år?','6000 · 0,7³ ≈ 2058 kr'],
    ['Butikk A selger en sykkelhjelm til 999 kr med 10 % rabatt. Butikk B selger den til 1050 kr med 15 % rabatt. Hvor er den billigst?','A: 899,10 kr. B: 892,50 kr. Butikk B er billigst.'],
    ['Lønna di øker med 3 % hvert år i 5 år. Hvor mange prosent har den økt til sammen?','1,03⁵ ≈ 1,159. Den har økt med omtrent 15,9 %, ikke 15 %.']];
  const body=key=>`<div class="box"><b class="t">Vekstfaktor</b><p>Ny pris = gammel pris · vekstfaktor. Opp p %: vekstfaktor 1 + p/100. Ned p %: vekstfaktor 1 − p/100. Flere endringer etter hverandre: gang vekstfaktorene.</p></div>${qList(Q.map(q=>[q[0],q[1],2]),key)}
    <h2>Lag din egen</h2><p>Finn en reklame for et tilbud på nett eller i en avis. Er det virkelig et godt tilbud? Regn ut og forklar.</p>${key?'<p class="a">Svarene varierer.</p>':'<span class="ln"></span>'}`;
  A.push({id:'tilbudsjakten', ch:'10k3', title:T, fit:'10. trinn · Kapittel 3 · Kjøp og salg', link:'#10k3-prosentendring', topics:['prosentendring','vekstfaktor10','finne-prosent'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Er tilbudet egentlig så bra? Prosent, vekstfaktor og lure salgstriks.',
    desc:'Åtte oppgaver der elevene avslører salgstriks og sammenligner tilbud: «3 for 2» mot prosentrabatt, opp 20 % og ned 20 %, opprinnelig pris, verditap og renters rente på lønn. Til slutt vurderer de et ekte tilbud fra en reklame.',
    inside:['Side 1: elevark med åtte oppgaver og en åpen oppgave','Side 2: fasit'], check,
    css:QCSS, pages:sheetPair({eye:'Utforsk · 10. trinn · Kapittel 3 · Kjøp og salg',title:T,n:1,lede:'Butikkene vil at du skal tro du sparer penger. Regn ut og avslør triksene.',keyLede:'Svar med utregning.',body})});
}

/* 10 Netthandel */
{ const T='Netthandel fra utlandet';
  const J={v:3600,f:300,t:10,g:150}; const toll=(J.v+J.f)*J.t/100, mva=(J.v+J.f+toll)*.25, tot=J.v+J.f+toll+mva+J.g;
  const check=()=>{ assert(toll===390&&mva===1072.5&&tot===5512.5,'jakke'); assert(1250*.25/1.25===250,'1'); assert(Math.abs(230*.15/1.15-30)<1e-9,'2'); assert(840*1.25===1050,'3'); assert(3200*1.25+150===4150,'6'); assert(r1((tot-3600)/3600*100)===53.1,'7'); };
  const Q=[['I en norsk butikk koster en jakke 1250 kr med 25 % mva. Hvor mye av prisen er mva?','1250 · 0,25 : 1,25 = 250 kr. (Prisen uten mva er 1000 kr.)'],
    ['Matvarer har 15 % mva. En handlekurv koster 230 kr. Hvor mye er mva?','230 · 0,15 : 1,15 = 30 kr'],
    ['En vare koster 840 kr uten mva. Hva koster den med 25 % mva?','840 · 1,25 = 1050 kr'],
    [`Du kjøper en jakke fra en utenlandsk nettbutikk for ${kr(J.v)} + ${kr(J.f)} i frakt. I denne oppgaven er det ${J.t} % toll, 25 % mva og ${kr(J.g)} i fortollingsgebyr. Hva må du betale til sammen?`,`Toll: ${nf(J.t)} % av ${nf(J.v+J.f)} = ${kr(toll)}. Mva: 25 % av ${nf(J.v+J.f+toll)} = ${kr(mva)}. Totalt: ${kr(tot)}.`],
    ['Den samme jakken koster 4999 kr i en norsk butikk. Hvor bør du kjøpe den?',`I Norge: 4999 kr er ${kr(tot-4999)} billigere enn ${kr(tot)}.`],
    ['En mobil koster 3200 kr fra utlandet med gratis frakt. Det er ingen toll, men 25 % mva og 150 kr i gebyr. Hva blir prisen?','3200 · 1,25 + 150 = 4150 kr'],
    ['Hvor mange prosent dyrere ble jakken i oppgave 4 enn prisen på nettsiden?',`(${nf(tot)} − 3600) : 3600 ≈ 0,531. Den ble omtrent 53,1 % dyrere.`]];
  const body=key=>`<div class="box"><b class="t">Slik regner du</b><p>1. Toll av varepris + frakt. &nbsp; 2. Mva av varepris + frakt + toll. &nbsp; 3. Legg til gebyr. &nbsp; <b>Mva i en pris:</b> pris · 0,25 : 1,25 (for 25 %).</p></div>${qList(Q.map(q=>[q[0],q[1],2]),key)}`;
  A.push({id:'netthandel', ch:'10k3', title:T, fit:'10. trinn · Kapittel 3 · Avgift på varer', link:'#10k3-toll-mva', topics:['mva','toll-mva','finne-mva'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Mva i norske priser og toll, mva og gebyr ved netthandel fra utlandet.',
    desc:'Elevene finner mva i norske priser og regner ut hva en vare fra en utenlandsk nettbutikk egentlig koster når toll, mva og gebyr kommer i tillegg. Så sammenligner de med prisen i en norsk butikk.',
    inside:['Side 1: elevark med sju oppgaver','Side 2: fasit med utregning'], check,
    css:QCSS, pages:sheetPair({eye:'Utforsk · 10. trinn · Kapittel 3 · Avgift på varer',title:T,n:1,lede:'Er det alltid billigere å handle på nett fra utlandet? Tollsatser og gebyrer er oppgitt i hver oppgave.',keyLede:'Svar med utregning.',body})});
}

/* 11 Moped nå eller senere? */
{ const T='Moped nå eller senere?';
  const P=30000; const serie=[0,1,2].map(i=>{ const rest=P-i*10000, r=rest*.1; return [i+1,rest,r,10000,r+10000]; }); const sR=serie.reduce((s,x)=>s+x[2],0);
  let b=P, m=0, paid=0; const card=[]; while(b>0&&m<200){ const r=b*.015; const pay=Math.min(1000,b+r); if(m<3) card.push([m+1,r2(b),r2(r),pay,r2(b+r-pay)]); b=b+r-pay; paid+=pay; m++; }
  const check=()=>{ assert(sR===6000,'serie'); assert(m>30&&m<60,'kort '+m); };
  const body=key=>`<p>Ida vil kjøpe en moped til ${kr(P)}. Hun har en jobb og kan sette av 2500 kr i måneden. Hun har tre muligheter:</p>
    <div class="op"><div><b>A · Spare først</b><p>Hun sparer 2500 kr i måneden og kjøper mopeden når hun har nok. Hun ser bort fra renter.</p></div><div><b>B · Serielån</b><p>Lån på ${kr(P)} over 3 år med 10 % rente per år. Hun betaler én gang i året.</p></div><div><b>C · Kredittkort</b><p>Hun betaler med kredittkort. Renta er 1,5 % per måned, og hun betaler 1000 kr hver måned.</p></div></div>
    <h2>B · Serielån</h2><table class="t mt"><tr><th>År</th><th>Restgjeld (kr)</th><th>Renter (kr)</th><th>Avdrag (kr)</th><th>Terminbeløp (kr)</th></tr>${serie.map(x=>`<tr><td>${x[0]}</td>${x.slice(1).map(v=>`<td>${key?`<span class="a">${nf(v)}</span>`:''}</td>`).join('')}</tr>`).join('')}</table>
    <h2>C · Kredittkort, de tre første månedene</h2><table class="t mt"><tr><th>Måned</th><th>Gjeld ved start (kr)</th><th>Renter 1,5 % (kr)</th><th>Innbetalt (kr)</th><th>Gjeld etterpå (kr)</th></tr>${card.map(x=>`<tr><td>${x[0]}</td>${x.slice(1).map(v=>`<td>${key?`<span class="a">${nf(v)}</span>`:''}</td>`).join('')}</tr>`).join('')}</table>
    ${qList([['A: Hvor mange måneder må Ida spare? Hva koster mopeden henne?','30 000 : 2500 = 12 måneder. Den koster 30 000 kr.'],['B: Hvor mye betaler Ida i renter til sammen med serielånet?',`${nf(sR)} kr i renter. Totalt ${nf(P+sR)} kr.`],['C: Hvor mye av de første 1000 kronene går til renter? Hvor mye blir gjelden mindre?','450 kr går til renter, så gjelden blir bare 550 kr mindre.'],['C: Datamaskinen har regnet ut at det tar '+m+' måneder å betale ned kredittkortet. Hva betaler hun til sammen?',`Hun betaler omtrent ${kr(Math.round(paid))}, altså ${kr(Math.round(paid-P))} mer enn mopeden koster.`],['Hva ville du valgt? Begrunn svaret med tall og andre argumenter.','Svarene varierer. A er billigst, men hun må vente et år. C er dyrest.',2]],key)}`;
  A.push({id:'moped-na-eller-senere', ch:'10k3', title:T, fit:'10. trinn · Kapittel 3 · Sparing og lån', link:'#10k3-lan', topics:['sparing','lan','serielan','kredittkort'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Spare, serielån eller kredittkort? Regn ut hva mopeden egentlig koster.',
    desc:'Ida vil ha en moped til 30 000 kr. Elevene sammenligner tre muligheter: spare først, ta et serielån eller betale med kredittkort. De fyller ut en nedbetalingsplan, ser hvor mye som går til renter, og diskuterer hva som er lurest.',
    inside:['Side 1: elevark med tre alternativer, to tabeller og spørsmål','Side 2: fasit'], check,
    css:QCSS+`.op{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}.op div{border:1.2px solid ${C.line};border-radius:2mm;padding:2.5mm}.op b{color:${C.pen}}.op p{font-size:9.6pt;margin:1mm 0 0}table.mt{width:100%}table.mt td{height:7.6mm}`,
    pages:sheetPair({eye:'Utforsk · 10. trinn · Kapittel 3 · Sparing og lån',title:T,n:1,lede:'Det er dyrt å låne penger. Men hvor dyrt?',keyLede:`Utregningene. Kredittkortet er regnet måned for måned med 1,5 % rente og 1000 kr i innbetaling.`,body})});
}

/* 12 Mitt første budsjett */
{ const T='Mitt første budsjett';
  const JOB=[['Butikkmedarbeider',32000,28],['Elektriker',45000,32],['Sykepleier',48000,33],['Kokk',36000,29],['Frisør',34000,28],['Ingeniør',58000,36]];
  const BO=[['Hybel',6500,500],['Leilighet i sentrum',12500,900],['Kollektiv med venner',7000,0],['Toroms i forstaden',10500,800],['Bo hjemme',3000,0],['Studioleilighet',9000,600]];
  const HE=[['Bursdag! Du får 1000 kr av besteforeldrene dine.',1000],['Mobilen knuser. Ny skjerm koster 2200 kr.',-2200],['Du jobber overtid og tjener 2400 kr ekstra (etter skatt).',2400],['Tannlegen: 1800 kr.',-1800],['Venner inviterer på hyttetur. Andelen din er 1500 kr.',-1500],['Strømprisen stiger. Ekstra 600 kr denne måneden.',-600],['Du selger en gammel sykkel for 1200 kr.',1200],['Du får parkeringsbot: 900 kr.',-900],['Du vinner 500 kr i en konkurranse.',500],['Bursdagsgave til en venn: 400 kr.',-400],['Treningssenteret øker prisen med 150 kr per måned.',-150],['Skatteoppgjøret: du får 3000 kr tilbake.',3000]];
  const net=j=>j[1]*(1-j[2]/100);
  const check=()=>{ assert(net(JOB[0])===23040&&net(JOB[5])===37120,'netto'); };
  const p1=page({eye:'Klasseaktivitet · 10. trinn · Kapittel 3 · Inntekter, utgifter og valuta',title:T,lede:'Et rollespill der elevene trekker en jobb og et sted å bo, og lager et månedsbudsjett. Så trekker de hendelseskort og fører regnskap. Holder pengene måneden ut? Varighet: 45 minutter.',
    body:`<h2>Slik gjør dere</h2><ol class="st"><li>Skriv ut og klipp ut kortene på side 3–4. Skriv ut budsjettarket (side 2) til hver elev.</li><li>Hver elev trekker ett jobbkort og ett boligkort. Regn ut nettolønn: bruttolønn minus skatt.</li><li>Lag et budsjett på side 2. Bruk tallene på boligkortet og forslagene i budsjettarket for de andre utgiftene.</li><li>Trekk tre hendelseskort og før dem inn i regnskapet. Går du i pluss eller minus?</li><li>Valuta: Du vil spare til en ferie i Spania. Hvor mange måneder må du spare for å få 800 euro? Bruk kursen 1 euro = 11,50 kr.</li></ol>
    <div class="box red"><b class="t">Snakk om</b><ul class="st"><li>Hvilke utgifter er faste, og hvilke kan du endre?</li><li>Hvor mye bør du spare til uforutsette utgifter hver måned?</li><li>Hvorfor er det lurt å bo billig når du er ung?</li></ul></div>
    <div class="box"><b class="t">Til læreren: nettolønn på jobbkortene</b><table class="t" style="width:100%"><tr><th>Jobb</th><th>Brutto (kr)</th><th>Skatt</th><th>Netto (kr)</th></tr>${JOB.map(j=>`<tr><td>${j[0]}</td><td>${nf(j[1])}</td><td>${j[2]} %</td><td><span class="a">${nf(net(j))}</span></td></tr>`).join('')}</table><p style="margin-top:2mm">800 euro = 800 · 11,50 = 9200 kr.</p></div>`,foot:[ft(T),'Side 1 · instruksjoner']});
  const L=(t,v)=>`<tr><td>${t}</td><td class="pf">${v||''}</td><td></td></tr>`;
  const p2=page({eye:'Klasseaktivitet · Mitt første budsjett',title:T,small:'budsjettark',body:`<p>Jobb: ______________________ &nbsp; Bolig: ______________________</p>
    <div class="bud"><table class="t"><tr><th>Inntekter</th><th>Forslag</th><th>Kr per måned</th></tr>${L('Nettolønn','')}${L('Annet','')}<tr><th>Sum inntekter</th><td></td><td></td></tr></table>
    <table class="t"><tr><th>Utgifter</th><th>Forslag</th><th>Kr per måned</th></tr>${L('Husleie','se boligkortet')}${L('Strøm','se boligkortet')}${L('Mat og drikke','4000')}${L('Mobil og internett','550')}${L('Transport','800')}${L('Klær og sko','800')}${L('Forsikring','300')}${L('Trening og fritid','700')}${L('Strømmetjenester','250')}${L('Sparing','')}${L('Annet','')}<tr><th>Sum utgifter</th><td></td><td></td></tr></table></div>
    <p><b>Overskudd (inntekter − utgifter):</b> ______________ kr</p>
    <h2>Regnskap: hendelser denne måneden</h2><table class="t" style="width:100%"><tr><th>Hendelse</th><th>Pluss (kr)</th><th>Minus (kr)</th></tr>${[1,2,3].map(()=>'<tr><td style="height:8mm"></td><td></td><td></td></tr>').join('')}<tr><th>Resultat etter hendelsene</th><td colspan="2"></td></tr></table>
    <h2>Valuta</h2><p>800 euro med kursen 11,50 kr per euro = ____________ kr. Antall måneder med sparing: ______</p>`,foot:[ft(T),'Side 2 · budsjettark']});
  const jc=[...JOB.map(j=>`<span class="tag">Jobb</span><b class="jt">${j[0]}</b><div class="jv">Bruttolønn: <b>${nf(j[1])} kr</b> per måned</div><div class="jv">Skatt: <b>${j[2]} %</b></div>`),...BO.map(b=>`<span class="tag">Bolig</span><b class="jt">${b[0]}</b><div class="jv">Husleie: <b>${nf(b[1])} kr</b></div><div class="jv">Strøm: <b>${b[2]?nf(b[2])+' kr':'inkludert'}</b></div>`)];
  const hc=HE.map(h=>`<span class="tag">Hendelse</span><p class="he">${h[0]}</p><b class="hv ${h[1]>0?'p':'m'}">${h[1]>0?'+':'−'} ${nf(Math.abs(h[1]))} kr</b>`);
  A.push({id:'mitt-forste-budsjett', ch:'10k3', title:T, fit:'10. trinn · Kapittel 3 · Inntekter, utgifter og valuta', link:'#10k3-budsjett', topics:['lonn-skatt','utgifter','budsjett','valuta'], thumbs:['Side 1 · instruksjoner','Side 2 · budsjettark'],
    short:'Trekk jobb og bolig, lag månedsbudsjett og takle uventede hendelser.',
    desc:'Et rollespill der elevene trekker en jobb og en bolig, regner ut nettolønn og lager et månedsbudsjett. Så trekker de hendelseskort, fører regnskap og regner med valuta for å spare til en ferie.',
    inside:['Side 1: instruksjoner, samtalespørsmål og nettolønn til læreren','Side 2: budsjettark','Side 3: 6 jobbkort og 6 boligkort','Side 4: 12 hendelseskort'], check,
    css:`.bud{display:grid;grid-template-columns:1fr 1.15fr;gap:4mm;align-items:start}.bud table{width:100%}.bud td{height:7mm;text-align:left}.bud td.pf{color:${C.muted};font-size:9pt}.jt{font:800 15pt "Bricolage Grotesque";margin-bottom:2mm}.jv{font-size:11pt}.he{font-size:12pt;line-height:1.35;margin:0 0 2mm}.hv{font:800 17pt "Bricolage Grotesque"}.hv.p{color:${C.ok}}.hv.m{color:${C.red}}`,
    pages:[p1,p2,...cardPages({cards:jc,cols:3,rows:4,eye:'Klasseaktivitet · Mitt første budsjett',title:T,foot:ft(T),start:3,label:'jobb- og boligkort'}),...cardPages({cards:hc,cols:3,rows:4,eye:'Klasseaktivitet · Mitt første budsjett',title:T,foot:ft(T),start:4,label:'hendelseskort'})]});
}

/* ===== Kap 4 Utforskende ===== */
/* 13 Knekk Cæsar-koden */
{ const T='Knekk Cæsar-koden'; const AB='ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ';
  const enc=(s,k)=>[...s].map(c=>{ const i=AB.indexOf(c); return i<0?c:AB[(i+k+29)%29]; }).join('');
  const M=[['MATEMATIKK ER GØY',3,true],['MØT MEG VED KANTINA ETTER SKOLEN',5,true],['PASSORDET ER PRIMTALL',11,true],['DET VANLIGSTE BOKSTAVET I NORSK TEKST ER E SÅ LET ETTER DEN BOKSTAVEN SOM DUKKER OPP OFTEST',8,false],['HVIS DU KAN LESE DETTE HAR DU KNEKT DEN SISTE KODEN',17,false]];
  const check=()=>{ M.forEach(m=>assert(enc(enc(m[0],m[1]),-m[1])===m[0],'enc')); };
  const wheel=()=>{ const cx=95,cy=95; let s=`<svg viewBox="0 0 190 190" width="170mm" height="170mm"><circle cx="${cx}" cy="${cy}" r="88" fill="#fff" stroke="${C.ink}" stroke-width=".6"/><circle cx="${cx}" cy="${cy}" r="70" fill="${C.soft}" stroke="${C.ink}" stroke-width=".6" stroke-dasharray="2 1.2"/><circle cx="${cx}" cy="${cy}" r="52" fill="#fff" stroke="${C.ink}" stroke-width=".4"/><circle cx="${cx}" cy="${cy}" r="1.5" fill="${C.ink}"/>`;
    [...AB].forEach((c,i)=>{ const a=(i*360/29-90)*PI/180, a2=((i+.5)*360/29-90)*PI/180; s+=svgT(cx+79*Math.cos(a),cy+79*Math.sin(a)+2.3,c,{fs:6.5,rot:i*360/29})+svgT(cx+61*Math.cos(a),cy+61*Math.sin(a)+2,c,{fs:5.6,c:C.red,rot:i*360/29});
      s+=`<line x1="${cx+70*Math.cos(a2)}" y1="${cy+70*Math.sin(a2)}" x2="${cx+88*Math.cos(a2)}" y2="${cy+88*Math.sin(a2)}" stroke="${C.ink}" stroke-width=".3"/><line x1="${cx+52*Math.cos(a2)}" y1="${cy+52*Math.sin(a2)}" x2="${cx+70*Math.cos(a2)}" y2="${cy+70*Math.sin(a2)}" stroke="${C.ink}" stroke-width=".25"/>`; });
    s+=svgT(cx,cy-18,'Svart: vanlig tekst',{fs:4,w:400,c:C.muted})+svgT(cx,cy-11,'Rød: kryptert tekst',{fs:4,w:400,c:C.red})+svgT(cx,cy+14,'Fest skivene sammen',{fs:3.6,w:400,c:C.muted})+svgT(cx,cy+20,'med en splittbinders i midten.',{fs:3.6,w:400,c:C.muted});
    return s+'</svg>'; };
  const p1=page({eye:'Klasseaktivitet · 10. trinn · Kapittel 4 · Kryptering',title:T,lede:'Julius Cæsar flyttet hver bokstav et fast antall plasser i alfabetet. Lagene lager en kodeskive og knekker fem hemmelige meldinger. De to siste har ukjent nøkkel. Varighet: 30–40 minutter.',
    body:`<h2>Slik gjør dere</h2><ol class="st"><li>Skriv ut side 2 (kodeskiven) til hvert lag, klipp ut skivene og fest dem sammen med en splittbinders.</li><li>Skriv ut side 3 (meldingene) til hvert lag.</li><li>Melding 1–3: Nøkkelen er oppgitt. Med nøkkel 3 flyttes A tre plasser til D. Vri den røde skiven slik at rød D står under svart A. Finn hver bokstav i meldingen på den røde skiven, og les av den svarte bokstaven over.</li><li>Melding 4–5: Nøkkelen er ukjent. Tell hvilken bokstav som er vanligst. I norsk er det oftest E.</li><li>Laget som først knekker alle fem, vinner. Til slutt lager hvert lag en melding til et annet lag.</li></ol>
    <div class="box red"><b class="t">Matematikken bak</b><p>Bokstav nummer n blir bokstav nummer (n + k) mod 29. Det finnes bare 28 mulige nøkler, så en datamaskin knekker koden på et øyeblikk. Hvor mange nøkler må du i verste fall prøve for hånd?</p></div>
    <div class="box"><b class="t">Til læreren: fasit</b><ol class="kj">${M.map(m=>`<li><b>Nøkkel ${m[1]}:</b> ${m[0]}</li>`).join('')}</ol></div>`,foot:[ft(T),'Side 1 · instruksjoner og fasit']});
  const p2=page({eye:'Klasseaktivitet · Knekk Cæsar-koden',title:T,small:'kodeskive',body:`<p class="cut">✂ Klipp ut den store skiven langs den ytre sirkelen, og den røde skiven langs den stiplede sirkelen</p><div style="display:flex;justify-content:center;margin-top:4mm">${wheel()}</div>`,foot:[ft(T),'Side 2 · kodeskive']});
  const p3=page({eye:'Klasseaktivitet · Knekk Cæsar-koden',title:T,small:'meldinger',body:`${M.map((m,i)=>`<div class="msg"><div class="mh"><b>Melding ${i+1}</b><span>${m[2]?`Nøkkel: ${m[1]}`:'Nøkkel: ukjent'}</span></div><p class="ct">${enc(m[0],m[1])}</p><span class="ln"></span>${m[0].length>40?'<span class="ln"></span>':''}</div>`).join('')}
    <h2>Lag din egen melding</h2><p>Nøkkel: ______ &nbsp; Kryptert melding:</p><span class="ln"></span><span class="ln"></span>`,foot:[ft(T),'Side 3 · meldinger']});
  A.push({id:'caesar-koden', ch:'10k4', title:T, fit:'10. trinn · Kapittel 4 · Arbeid med matematikk', link:'#10k4-kryptering', topics:['moped','bolig','jorda','kryptering','tallsystem'], thumbs:['Side 1 · instruksjoner og fasit','Side 2 · kodeskive'], board:'#caesarhjul',
    short:'Lag en kodeskive og knekk fem hemmelige meldinger, to av dem uten nøkkel.',
    desc:'Lagene lager en Cæsar-kodeskive med det norske alfabetet og knekker fem meldinger. De tre første har oppgitt nøkkel, de to siste må knekkes med frekvensanalyse. Tavleversjonen er en kodeskive som kan vris på smartboard.',
    inside:['Side 1: instruksjoner, matematikken bak og fasit','Side 2: kodeskive å klippe ut','Side 3: fem krypterte meldinger','Tavleversjon: interaktiv kodeskive'], check,
    css:`ol.kj{margin:0;padding-left:6mm;font-size:9.8pt;line-height:1.45}.msg{margin-bottom:3mm}.mh{display:flex;justify-content:space-between;align-items:baseline}.mh b{color:${C.pen};font-size:11.5pt}.mh span{font:400 9pt "JetBrains Mono";color:${C.muted}}.ct{font:700 13pt "JetBrains Mono";letter-spacing:.12em;line-height:1.5;margin:1mm 0}.ln{height:7.5mm}`,
    pages:[p1,p2,p3]});
}

module.exports=A;
