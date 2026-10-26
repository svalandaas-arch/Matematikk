// Delkapittel-aktiviteter 8. trinn
const {C,nf,fr}=require('./common');
const T=require('./types'), H=require('./helpers');
const {ri,pick,P,poly,lin,red,F,tbl,plot}=H; const {assert}=T;
const G=8, A=[];
const add=(type,o)=>A.push(T.make(T[type],Object.assign({G},o)));

add('fireRad',{id:'fire-pa-rad-multiplikasjon',ch:'kap1',topic:'multiplikasjon',where:'Kapittel 1 · Multiplikasjon',seed:801,title:'Fire på rad: gangestykker',
  short:'Regn ut gangestykker og legg brikker på svaret. Først til fire på rad.',intro:'Gangestykker med tosifrede tall og overslag.',tips:'Del opp: 23 · 7 = 20 · 7 + 3 · 7 = 140 + 21 = 161.',
  gen:(R,i)=>{ const a=ri(R,12,39), b=i<12?ri(R,3,9):ri(R,11,15); return {q:`${a} · ${b}`,a:nf(a*b),v:a*b}; }});

add('domino',{id:'divisjonsdomino',ch:'kap1',topic:'divisjon',where:'Kapittel 1 · Divisjon',seed:802,title:'Divisjonsdomino',
  short:'Legg dominobrikkene i ring ved å løse divisjonsstykker.',intro:'Divisjon med tosifrede og tresifrede tall.',tips:'Sjekk svaret med ganging: 168 : 7 = 24 fordi 24 · 7 = 168.',
  gen:(R)=>{ const b=ri(R,3,12), q=ri(R,11,48); return {q:`${nf(q*b)} : ${b}`,a:nf(q),v:q}; }});

add('bingo',{id:'potensbingo',ch:'kap1',topic:'potensregler',where:'Kapittel 1 · Regning med potenser',seed:803,title:'Potensbingo',short:'Bingo med ganging og deling av potenser med samme grunntall.',
  intro:'Ganging og deling av potenser med samme grunntall.',tips:'Ganging: legg sammen eksponentene. Deling: trekk fra. 2³ · 2⁴ = 2⁷ og 5⁶ : 5² = 5⁴.',
  gen:(R)=>{ const b=pick(R,[2,3,5,10,'a','x']), m=ri(R,2,7), n=ri(R,1,5); const mul=R()<.55; const e=mul?m+n:m; const q=mul?`${P(b,m)} · ${P(b,n)}`:`${P(b,m+n)} : ${P(b,n)}`; return {q,a:P(b,e),v:b+'^'+e}; }});

add('memory',{id:'brok-desimal-memory',ch:'kap2',topic:'brok-desimal',where:'Kapittel 2 · Brøk, desimaltall og prosent',seed:804,title:'Brøk, desimal og prosent',
  short:'Memory: finn brøken og desimaltallet eller prosenten som er like store.',intro:'Par der en brøk og et desimaltall eller en prosent er like store.',tips:'Utvid brøken til tideler eller hundredeler: 3/4 = 75/100 = 0,75 = 75 %.',
  gen:(R,i)=>{ const d=pick(R,[2,4,5,8,10,20,25,50]); const n=ri(R,1,d-1); const [a,b]=red(n,d); const v=a/b; const s=i%2?nf(v*100)+' %':nf(v); return {q:fr(a,b),a:s,v:Math.round(v*1e6)}; }});

add('bingo',{id:'brokbingo-ganging',ch:'kap2',topic:'brok-mul',where:'Kapittel 2 · Brøk og multiplikasjon',seed:805,title:'Brøkbingo: ganging',bt:'Brøkbingo',short:'Bingo med brøk ganget med hele tall og med brøk, og brøkdel av et tall.',
  intro:'Brøk ganget med hele tall og med brøk, og brøkdel av et tall.',tips:'Teller ganger teller og nevner ganger nevner. Forkort svaret så langt det går.',afs:17,
  gen:(R)=>{ const t=ri(R,0,2); let q,n,d; if(t===0){ const k=ri(R,2,6), a=ri(R,1,7), b=ri(R,a+1,9); q=`${k} · ${fr(a,b)}`; n=k*a; d=b; } else if(t===1){ const a=ri(R,1,5),b=ri(R,a+1,8),c=ri(R,1,5),e=ri(R,c+1,8); q=`${fr(a,b)} · ${fr(c,e)}`; n=a*c; d=b*e; } else { const b=pick(R,[3,4,5,6,8]), a=ri(R,1,b-1), N=b*ri(R,2,9); q=`${fr(a,b)} av ${N}`; n=a*N; d=b; }
    const [x,y]=red(n,d); if(y>24) return null; return {q,a:F(x,y),v:x/y}; }});

add('chain',{id:'hvem-har-brokdivisjon',ch:'kap2',topic:'brok-div',where:'Kapittel 2 · Divisjon av brøker',seed:806,title:'Jeg har – hvem har? Brøkdivisjon',
  short:'Regnekjede med deling av brøker for hele klassen.',intro:'Deling av brøk med helt tall og med brøk.',tips:'Å dele på en brøk er det samme som å gange med den omvendte brøken.',big:22,qfs:16,
  gen:(R)=>{ const t=ri(R,0,2); let q,n,d; if(t===0){ const a=ri(R,1,9),b=ri(R,2,9),k=ri(R,2,5); q=`${fr(a,b)} : ${k} ?`; n=a; d=b*k; } else if(t===1){ const k=ri(R,2,8),a=ri(R,1,4),b=ri(R,a+1,6); q=`${k} : ${fr(a,b)} ?`; n=k*b; d=a; } else { const a=ri(R,1,6),b=ri(R,2,8),c=ri(R,1,6),e=ri(R,2,8); q=`${fr(a,b)} : ${fr(c,e)} ?`; n=a*e; d=b*c; }
    const [x,y]=red(n,d); if(y>30||x>60) return null; return {q,a:F(x,y),v:x/y}; }});

add('fireRad',{id:'fire-pa-rad-forenkling',ch:'kap3',topic:'forenkling',where:'Kapittel 3 · Addisjon og subtraksjon av uttrykk',seed:807,title:'Fire på rad: forenkle uttrykk',
  short:'Trekk sammen like ledd og legg brikker på svaret.',intro:'Trekke sammen like ledd med x, a og b.',tips:'Bare like ledd kan slås sammen: 3x + 2 blir ikke 5x.',ffs:15,lfs:12.5,
  gen:(R,i)=>{ if(i<12){ const a=ri(R,1,7),c=ri(R,-4,6)||2,b=ri(R,-6,8),d=ri(R,-6,6); if(a+c===0) return null; return {q:poly([[a,'x'],[b,''],[c,'x'],[d,'']]),a:lin(a+c,b+d),v:`${a+c}x${b+d}`}; }
    const p=ri(R,1,6),q=ri(R,1,5),r=ri(R,-3,4)||1,s=ri(R,-3,4)||-1; if(p+r===0||q+s===0) return null; return {q:poly([[p,'a'],[q,'b'],[r,'a'],[s,'b']]),a:poly([[p+r,'a'],[q+s,'b']]),v:`${p+r}a${q+s}b`}; }});

add('memory',{id:'algebramemory-ganging',ch:'kap3',topic:'gange-alg',where:'Kapittel 3 · Multiplikasjon, divisjon og potenser',seed:808,title:'Algebramemory: ganging og deling',
  short:'Memory med ganging og deling av algebraiske uttrykk.',intro:'Ganging, deling og potenser av variabler.',tips:'3x · 2x = 6x², men 3x + 2x = 5x.',cfs:16,
  gen:(R)=>{ const t=ri(R,0,3), v=pick(R,['x','a']); if(t===0){ const a=ri(R,2,6),b=ri(R,2,6); return {q:`${a} · ${b}${v}`,a:`${a*b}${v}`,v:`${a*b}${v}`}; } if(t===1){ const a=ri(R,2,5),b=ri(R,2,5); return {q:`${a}${v} · ${b}${v}`,a:`${a*b}${v}<sup>2</sup>`,v:`${a*b}${v}2`}; }
    if(t===2){ const k=ri(R,2,6),q=ri(R,2,6); return {q:`${k*q}${v} : ${k}`,a:`${q}${v}`,v:`${q}${v}`}; } const m=ri(R,2,4),n=ri(R,1,3); return {q:`${P(v,m)} · ${n===1?v:P(v,n)}`,a:P(v,m+n),v:`${v}^${m+n}`}; }});

add('domino',{id:'parentesdomino',ch:'kap3',topic:'parenteser',where:'Kapittel 3 · Parenteser i uttrykk',seed:809,title:'Parentesdomino',verb:'Løs opp',
  short:'Løs opp parenteser og legg dominobrikkene i ring.',intro:'Gange inn i parenteser og minus foran parentes.',tips:'Minus foran parentes snur fortegnet på alle leddene inni: −(x − 3) = −x + 3.',dfs:12,
  gen:(R)=>{ const t=ri(R,0,2); if(t===0){ const k=ri(R,2,6),a=ri(R,1,4),b=ri(R,-7,7)||3; return {q:`${k}(${lin(a,b)})`,a:lin(k*a,k*b),v:`${k*a},${k*b}`}; }
    if(t===1){ const c=ri(R,2,9),a=ri(R,2,6),b=ri(R,1,6); return {q:`${c}x − (${lin(1,b)})`.replace('(x','(x'),a:lin(c-1,-b),v:`${c-1},${-b}`}; }
    const k=ri(R,2,4),b=ri(R,1,5),m=ri(R,1,6); return {q:`${k}(x + ${b}) + ${m===1?'':m}x`,a:lin(k+m,k*b),v:`${k+m},${k*b}`}; }});

{ const W=[
  R=>{ const x=ri(R,7,15),y=x+ri(R,20,30); return {q:`Mor er ${y-x} år eldre enn Sara. Til sammen er de ${x+y} år. Hvor gammel er Sara?`,a:`${x} år`,v:x}; },
  R=>{ const p=ri(R,15,35),k=ri(R,3,6),r=ri(R,10,40); return {q:`${k} like bøker og en penn til ${r} kr koster ${k*p+r} kr. Hva koster én bok?`,a:`${p} kr`,v:p}; },
  R=>{ const b=ri(R,4,9),l=b+ri(R,2,6); return {q:`Et rektangel er ${l-b} cm lengre enn det er bredt. Omkretsen er ${2*(l+b)} cm. Hvor bredt er det?`,a:`${b} cm`,v:b}; },
  R=>{ const n=ri(R,12,30); return {q:`Summen av tre tall som følger etter hverandre, er ${3*n+3}. Hva er det minste tallet?`,a:nf(n),v:n}; },
  R=>{ const x=ri(R,40,90); return {q:`Jonas og Ali deler ${3*x} kr slik at Jonas får dobbelt så mye som Ali. Hvor mye får Ali?`,a:`${x} kr`,v:x}; },
  R=>{ const x=ri(R,5,14),k=ri(R,3,5),m=ri(R,4,20); return {q:`Jeg tenker på et tall, ganger det med ${k} og trekker fra ${m}. Da får jeg ${k*x-m}. Hvilket tall tenker jeg på?`,a:nf(x),v:x}; },
  R=>{ const t=ri(R,3,9),s=ri(R,40,80); return {q:`En taxi koster ${s} kr i startpris og 15 kr per km. Turen kostet ${s+15*t} kr. Hvor mange km var turen?`,a:`${t} km`,v:t}; },
  R=>{ const x=ri(R,30,60); return {q:`Et hus og en garasje koster til sammen ${x*5} 000 kr. Huset koster fire ganger så mye som garasjen. Hva koster garasjen?`,a:`${x} 000 kr`,v:x*1000} } ];
  add('loype',{id:'likningsloypa',ch:'kap3',topic:'problemlosning',where:'Kapittel 3 · Problemløsning med likninger',seed:810,title:'Likningsløypa',pfs:15,
    short:'Åtte poster med tekstoppgaver som løses med likninger.',intro:'Tekstoppgaver som blir til likninger.',tips:'Kall det ukjente for x, skriv en likning og løs den. Kontroller svaret i teksten.',
    gen:(R,i)=>{ const r=W[i%8](R); return r; }}); }

{ const L=[[2,1],[1,-2],[-1,3],[3,-1],[.5,2],[-2,4],[1,1],[2,-3]];
  const fs=(a,b)=>`y = ${lin(a,b).replace('1x','x')}`.replace(/^y = 0,5x/,'y = 0,5x');
  const fmt=(a,b)=>{ const as=a===.5?'0,5x':a===-.5?'−0,5x':lin(a,0); return `y = ${b===0?as:as+(b>0?' + '+b:' − '+(-b))}`; };
  add('sett',{id:'graftrioer',ch:'kap4',topic:'grafer',where:'Kapittel 4 · Tegne grafer',seed:811,title:'Graftrioer',kinds:['Uttrykk','Tabell','Graf'],cfs:14,
    short:'Finn tre kort som hører sammen: funksjonsuttrykk, tabell og graf.',intro:'Rette linjer vist som uttrykk, tabell og graf.',tips:'Sett inn x = 0 og x = 1 i uttrykket og se om punktene stemmer med tabellen og grafen.',
    sets:L.map(([a,b])=>[`<b style="font-size:17pt">${fmt(a,b)}</b>`,tbl([0,1,2,3],[0,1,2,3].map(x=>a*x+b)),plot(x=>a*x+b,{mm:36})]),
    check:()=>{ assert(new Set(L.map(l=>l.join())).size===8,'unike'); }}); }

module.exports=A;
