// Delkapittel-aktiviteter 10. trinn
const {C,nf,fr,gcd}=require('./common');
const T=require('./types'), H=require('./helpers');
const {ri,pick,P,poly,lin,red,F,tbl,plot,kr}=H; const {assert}=T;
const G=10, A=[];
const add=(type,o)=>A.push(T.make(T[type],Object.assign({G},o)));
const r1=x=>Math.round(x*10)/10, r2=x=>Math.round(x*100)/100;
const d1=x=>{ const v=r1(x); return (Math.abs(v-x)>1e-9?'≈ ':'')+nf(v); };
const sq='<sup>2</sup>';
const quad=(a,b,c,v='x')=>poly([[a,v+sq],[b,v],[c,'']]);
const fxs=(a,b)=>{ const as=a===.5?'0,5x':a===-.5?'−0,5x':lin(a,0); return `y = ${b===0?as:as+(b>0?' + '+nf(b):' − '+nf(-b))}`; };

/* ===== Algebra ===== */
add('memory',{id:'forkortingsmemory',ch:'10k1',topic:'forkort-alg',where:'Kapittel 1 · Forkorting',seed:1001,title:'Forkortingsmemory',cfs:15,
  short:'Memory: finn brøkuttrykket og det forkortede uttrykket som hører sammen.',intro:'Forkorting av brøkuttrykk ved å faktorisere teller og nevner.',tips:'Faktoriser først. Bare felles faktorer kan strykes, ikke ledd: (x + 6) : 6 blir ikke x.',
  gen:(R,i)=>{ const t=i%4; if(t===0){ const k=ri(R,2,6),a=ri(R,1,5),b=ri(R,1,7); return {q:fr(lin(k*a,k*b),k),a:lin(a,b),v:`a${a},${b}`}; }
    if(t===1){ const a=ri(R,2,9),k=ri(R,2,5); return {q:fr(`${a*k}x${sq}`,`${k}x`),a:`${a}x`,v:`b${a}`}; }
    if(t===2){ const k=ri(R,2,6),b=ri(R,1,8); return {q:fr(`${k}x + ${k*b}`,`x + ${b}`),a:nf(k),v:`c${k}`}; }
    const a=ri(R,1,9); return {q:fr(`x${sq} − ${a*a}`,`x + ${a}`),a:`x − ${a}`,v:`d${a}`}; }});

add('domino',{id:'parentes-domino-10',ch:'10k1',topic:'parentes-alg',where:'Kapittel 1 · Sammentrekking av uttrykk med parenteser',seed:1002,title:'Sammentrekkingsdomino',verb:'Trekk sammen',dfs:11,
  short:'Domino der elevene løser opp parenteser og trekker sammen.',intro:'Løse opp parenteser og trekke sammen like ledd.',tips:'Gang inn i parentesene først. Husk at minus foran en parentes endrer fortegnet på hvert ledd.',
  gen:(R)=>{ const a=ri(R,2,5),b=ri(R,1,4),c=ri(R,-5,5)||1,d=ri(R,1,4),e=ri(R,1,3),f=ri(R,-5,5)||2; const sgn=R()<.5?1:-1; const x=a*b+sgn*d*e, k=a*c+sgn*d*f; if(x===0) return null;
    return {q:`${a}(${lin(b,c)}) ${sgn>0?'+':'−'} ${d}(${lin(e,f)})`,a:lin(x,k),v:`${x},${k}`}; }});

add('stafett',{id:'brokuttrykk-stafett',ch:'10k1',topic:'brokuttrykk',where:'Kapittel 1 · Sammentrekking av brøkuttrykk',seed:1003,title:'Brøkuttrykkstafett',n:12,sfs:16,
  short:'Lagstafett med addisjon og subtraksjon av brøkuttrykk.',intro:'Finne fellesnevner og trekke sammen brøkuttrykk.',tips:'Finn fellesnevneren, utvid brøkene og trekk sammen tellerne. Forkort til slutt.',
  gen:(R)=>{ const b=ri(R,2,6), d=ri(R,2,6); if(b===d) return null; const a=ri(R,1,5), c=ri(R,1,5), s=R()<.6?1:-1; const n=a*d+s*c*b, m=b*d; const g=gcd(Math.abs(n),m); if(n===0) return null;
    return {q:`${fr(a===1?'x':a+'x',b)} ${s>0?'+':'−'} ${fr(c===1?'x':c+'x',d)}`,a:(m/g===1?`${lin(n/g,0)}`:`${fr(lin(Math.abs(n/g),0),m/g)}`).replace(/^/,n<0&&m/g!==1?'−':''),v:n/m}; }});

add('fireRad',{id:'fire-pa-rad-polynom',ch:'10k1',topic:'polynom',where:'Kapittel 1 · Multiplikasjon av polynom',seed:1004,title:'Fire på rad: gange parenteser',ffs:12,lfs:13,
  short:'Gang ut to parenteser og legg brikker på svaret.',intro:'Multiplikasjon av to parenteser: hvert ledd ganges med hvert ledd.',tips:'(x + a)(x + b) = x² + bx + ax + ab. Tegn gjerne en arealmodell.',
  gen:(R)=>{ const a=ri(R,-6,7)||1,b=ri(R,-6,7)||2; if(a+b===0) return null; return {q:`(${lin(1,a)})(${lin(1,b)})`,a:quad(1,a+b,a*b),v:`${a+b},${a*b}`}; }});

add('memory',{id:'kvadratsetning2-memory',ch:'10k1',topic:'kvsetn2',where:'Kapittel 1 · Andre kvadratsetning',seed:1005,title:'Memory: andre kvadratsetning',cfs:15,
  short:'Memory med (a − b)² og det utgangne uttrykket.',intro:'(a − b)² = a² − 2ab + b².',tips:'Det midterste leddet er dobbelt produkt: (x − 3)² = x² − 6x + 9, ikke x² − 9.',
  gen:(R,i)=>{ if(i%3===2){ const n=pick(R,[19,29,39,49,59,69,79,99,98,48]); const m=Math.ceil(n/10)*10; return {q:`${n}${sq}`,a:`(${m} − ${m-n})${sq} = ${nf(n*n)}`,v:n*n}; } const k=ri(R,1,3),b=ri(R,1,9); const v=k===1?'x':`${k}x`; return {q:`(${v} − ${b})${sq}`,a:quad(k*k,-2*k*b,b*b),v:`${k},${b}`}; }});

add('chain',{id:'hvem-har-konjugat',ch:'10k1',topic:'kvsetn3',where:'Kapittel 1 · Tredje kvadratsetning',seed:1006,title:'Jeg har – hvem har? Konjugatsetningen',big:20,qfs:15,
  short:'Regnekjede med konjugatsetningen, både med tall og bokstaver.',intro:'(a + b)(a − b) = a² − b².',tips:'Se etter to tall like over og under et rundt tall: 41 · 39 = 40² − 1² = 1599.',
  gen:(R,i)=>{ if(i%2===0){ const m=pick(R,[20,30,40,50,60,70,80,100]), d=ri(R,1,4); return {q:`${m+d} · ${m-d} ?`,a:nf(m*m-d*d),v:m*m-d*d}; } const a=ri(R,1,12); const k=ri(R,1,3); const v=k===1?'x':`${k}x`; return {q:`(${v} + ${a})(${v} − ${a}) ?`,a:`${k===1?'':k*k}x${sq} − ${a*a}`,v:`${k},${a}`}; }});

add('bingo',{id:'kvadratisk-bingo',ch:'10k1',topic:'kvadratisk-likn',where:'Kapittel 1 · Kvadratiske likninger',seed:1007,title:'Bingo: kvadratiske likninger',bt:'Likningsbingo',afs:13,
  short:'Bingo med løsningene til kvadratiske likninger.',intro:'Kvadratiske likninger av typene x² = k, x² + bx = 0 og (x − a)(x − b) = 0.',tips:'Husk to løsninger! x² = 25 gir x = 5 og x = −5. Faktoriser x² − 4x = 0 til x(x − 4) = 0.',
  gen:(R,i)=>{ const t=i%3; if(t===0){ const a=ri(R,2,12),k=pick(R,[1,2,3]); return {q:`${k===1?'':k}x${sq} = ${k*a*a}`,a:`x = ±${a}`,v:`a${a}`}; }
    if(t===1){ const b=ri(R,-9,9)||5; return {q:`x${sq} ${b<0?'+':'−'} ${Math.abs(b)}x = 0`,a:`x = 0 eller x = ${nf(b)}`,v:`b${b}`}; }
    const a=ri(R,-6,6),b=ri(R,-6,6); if(a===b||a===0||b===0) return null; const [p,q]=[Math.min(a,b),Math.max(a,b)]; return {q:`(${lin(1,-a)})(${lin(1,-b)}) = 0`,a:`x = ${nf(p)} eller x = ${nf(q)}`,v:`c${p},${q}`}; }});

{ const W=[ R=>{ const k=ri(R,3,8),p=ri(R,12,30); const n=ri(R,5,15); return {q:`${k} kg epler koster ${k*p} kr. Hva koster ${n} kg?`,a:`${n*p} kr`,v:n*p}; },
  R=>{ const m=pick(R,[2,3,4]), f=ri(R,2,6); return {q:`En oppskrift for 4 personer trenger ${m*2} dl melk. Hvor mye trengs for ${4*f/2} personer?`,a:`${nf(m*f)} dl`,v:m*f+.1}; },
  R=>{ const v=pick(R,[60,80,90]), t=ri(R,2,5); const s=v*t; return {q:`En bil kjører ${s} km på ${t} timer. Hvor langt kjører den på ${t+2} timer i samme fart?`,a:`${v*(t+2)} km`,v:v*(t+2)}; },
  R=>{ const a=ri(R,2,6),b=ri(R,3,9); const x=a*b*2; return {q:`Løs proporsjonen ${fr('x',a*2)} = ${fr(b,1)}`,a:`x = ${x}`,v:x+.3}; },
  R=>{ const k=ri(R,2,6), b=ri(R,3,8); return {q:`Løs proporsjonen ${fr(k,'x')} = ${fr(k*b,b*b)}`,a:`x = ${b}`,v:b+.4}; },
  R=>{ const r=pick(R,[[2,3],[3,5],[1,4],[3,4]]), t=(r[0]+r[1])*ri(R,20,60); return {q:`${nf(t)} kr skal deles i forholdet ${r[0]} : ${r[1]}. Hvor mye får den som får minst?`,a:kr(t*r[0]/(r[0]+r[1])),v:t*r[0]/(r[0]+r[1])+.5}; },
  R=>{ const s=ri(R,2,9); return {q:`På et kart i målestokk 1 : 50 000 er en vei ${s} cm. Hvor lang er veien i km?`,a:`${nf(s*.5)} km`,v:s*.5+.6}; },
  R=>{ const n=ri(R,3,6),d=ri(R,6,12); return {q:`${n} malere bruker ${d} dager på en jobb. Hvor lang tid bruker ${n*2} malere?`,a:`${nf(d/2)} dager`,v:d/2+.7}; } ];
  add('loype',{id:'proporsjonsloypa',ch:'10k1',topic:'proporsjon',where:'Kapittel 1 · Proporsjoner',seed:1008,title:'Proporsjonsløypa',pfs:15,
    short:'Åtte poster med proporsjoner, forhold, målestokk og omvendt proporsjonalitet.',intro:'Proporsjoner og forhold i hverdagen.',tips:'Sett opp en proporsjon: like forhold på begge sider. Er sammenhengen omvendt proporsjonal (flere arbeidere, kortere tid)?',
    gen:(R,i)=>W[i%8](R)}); }

add('stafett',{id:'broklikning-stafett',ch:'10k1',topic:'brokliknx',where:'Kapittel 1 · Likninger med flere brøker',seed:1009,title:'Brøklikningsstafett',n:12,sfs:16,
  short:'Lagstafett med likninger der det er brøker.',intro:'Likninger med brøker: gang med fellesnevneren.',tips:'Gang alle ledd på begge sider med fellesnevneren. Da forsvinner brøkene.',
  gen:(R)=>{ const b=ri(R,2,6),d=ri(R,2,6); if(b===d) return null; const x=b*d*ri(R,1,4); const rhs=x/b+x/d; if(!Number.isInteger(rhs)) return null; return {q:`${fr('x',b)} + ${fr('x',d)} = ${rhs}`,a:`x = ${x}`,v:x}; }});

{ const S=[[2,-1,-1,5],[1,1,-1,3],[3,-4,-1,4],[1,-2,2,-5],[-1,1,1,-3],[2,0,-1,6],[0.5,1,-1,-2],[1,3,-3,-1]];
  const sol=s=>{ const x=(s[3]-s[1])/(s[0]-s[2]); return [x,s[0]*x+s[1]]; };
  add('sett',{id:'grafisk-trioer',ch:'10k1',topic:'grafisk-sett',where:'Kapittel 1 · Grafisk løsning av likningssett',seed:1010,title:'Likningssett-trioer',kinds:['Likningssett','Graf','Løsning'],cfs:12,
    short:'Finn likningssettet, grafen og løsningen som hører sammen.',intro:'Grafisk løsning: skjæringspunktet mellom to linjer.',tips:'Løsningen er punktet der linjene krysser hverandre. Sett inn x og y i begge likningene for å kontrollere.',
    sets:S.map(s=>{ const [x,y]=sol(s); return [`${fxs(s[0],s[1])}<br>${fxs(s[2],s[3])}`,plot(t=>s[0]*t+s[1],{mm:34}).replace('</svg>','')+plot(t=>s[2]*t+s[3],{mm:34,col:C.red}).replace(/^<svg[^>]*>/,'').replace(/<line[^>]*\/>/g,''),`<b style="font-size:16pt">x = ${nf(x)}, y = ${nf(y)}</b>`]; }),
    check:()=>{ const L=S.map(sol); L.forEach(([x,y])=>{ assert(Number.isInteger(x)&&Number.isInteger(y)&&Math.abs(x)<=4&&Math.abs(y)<=4,'sol '+x+','+y); }); assert(new Set(L.map(l=>l.join())).size===8,'unike'); }}); }

add('ark',{id:'algebragater',ch:'10k1',topic:'problem-alg',where:'Kapittel 1 · Utforskning og problemløsning',title:'Algebragåter',
  short:'Gåter som løses med likninger og likningssett, og egne gåter.',lede:'Løs gåtene med likninger eller likningssett. Skriv hva x (og y) står for før du setter opp likningen.',
  Q:[['I en sparebøsse er det bare 5-kroner og 10-kroner, til sammen 20 mynter og 145 kr. Hvor mange av hver?','x + y = 20 og 5x + 10y = 145 gir y = 9 tikroner og x = 11 femkroner.',2],
    ['Om 6 år er Ida dobbelt så gammel som hun var for 4 år siden. Hvor gammel er hun nå?','x + 6 = 2(x − 4) gir x = 14 år.',2],
    ['Et rektangel har omkrets 46 cm. Lengden er 5 cm mer enn bredden. Finn arealet.','2b + 2(b + 5) = 46 gir b = 9 og l = 14. A = 126 cm².',2],
    ['Summen av tre partall som følger etter hverandre, er 78. Hvilke tall?','x + (x + 2) + (x + 4) = 78 gir 24, 26 og 28.',2],
    ['En kinobillett for voksne koster 40 kr mer enn for barn. 3 voksne og 2 barn betaler 620 kr. Hva koster billettene?','3(b + 40) + 2b = 620 gir b = 100 kr og voksen 140 kr.',2],
    ['Lag din egen gåte som gir likningssettet x + y = 12 og x − y = 4.','Svarene varierer. Løsningen er x = 8 og y = 4.',2]],
  check:()=>{ assert(11+9===20&&55+90===145,'1'); assert(14+6===2*(14-4),'2'); assert(2*9+2*14===46&&9*14===126,'3'); assert(24+26+28===78,'4'); assert(3*140+2*100===620,'5'); }});

/* ===== Funksjoner ===== */
add('fireRad',{id:'fire-pa-rad-koordinater',ch:'10k2',topic:'koord-10',where:'Kapittel 2 · Koordinatsystemet',seed:1011,title:'Fire på rad: punkter og avstander',ffs:13,lfs:12.5,
  short:'Midtpunkt, avstand og speiling i koordinatsystemet.',intro:'Regne med punkter i koordinatsystemet.',tips:'Midtpunkt: gjennomsnittet av x-ene og av y-ene. Avstand: bruk Pytagoras på forskjellene.',
  gen:(R,i)=>{ const t=i%3, a=ri(R,-5,5), b=ri(R,-5,5); if(t===0){ const c=a+2*ri(R,-3,3), d=b+2*ri(R,-3,3); if(c===a&&d===b) return null; const mx=(a+c)/2, my=(b+d)/2; return {q:`Midtpunktet mellom (${nf(a)}, ${nf(b)}) og (${nf(c)}, ${nf(d)})`,a:`(${nf(mx)}, ${nf(my)})`,v:`m${mx},${my}`}; }
    if(t===1){ const [p,q]=pick(R,[[3,4],[6,8],[5,12],[0,5],[4,3],[8,6],[0,7]]); const L=Math.hypot(p,q); return {q:`Avstanden mellom (${nf(a)}, ${nf(b)}) og (${nf(a+p)}, ${nf(b-q)})`,a:nf(L),v:'d'+L+':'+a}; }
    return R()<.5?{q:`(${nf(a)}, ${nf(b)}) speilet om x-aksen`,a:`(${nf(a)}, ${nf(-b)})`,v:`s${a},${-b}`}:{q:`(${nf(a)}, ${nf(b)}) speilet om y-aksen`,a:`(${nf(-a)}, ${nf(b)})`,v:`s${-a},${b}`}; }});

{ const S=[['En taxi koster 50 kr i startpris og 10 kr per km.',10,50],['Du har 200 kr og bruker 20 kr hver uke.',-20,200],['Epler koster 25 kr per kg.',25,0],['Et lys er 30 cm og brenner ned 3 cm i timen.',-3,30],['Et abonnement koster 100 kr pluss 5 kr per film.',5,100],['En plante er 4 cm og vokser 2 cm per uke.',2,4]];
  add('sett',{id:'situasjon-uttrykk-graf',ch:'10k2',topic:'funksjon-graf',where:'Kapittel 2 · Sammenhengen mellom funksjon og graf',seed:1012,title:'Situasjon, uttrykk og graf',kinds:['Situasjon','Uttrykk','Graf'],cfs:11.5,
    short:'Finn situasjonen, funksjonsuttrykket og grafen som hører sammen.',intro:'Lineære funksjoner i hverdagen.',tips:'Konstantleddet er startverdien. Stigningstallet er hvor mye y endrer seg per enhet.',
    sets:S.map(([t,a,b])=>[t,`<b style="font-size:15pt">${fxs(a,b)}</b>`,plot(x=>a*x+b,{x0:0,x1:10,y0:Math.min(0,b+a*10),y1:Math.max(b,b+a*10)*1.1||10,xs:2,ys:Math.max(b,b+a*10)>100?50:10,mm:40,h:28,w:40})]),
    check:()=>{ assert(new Set(S.map(s=>s[1]+','+s[2])).size===6,'u'); }}); }

add('bingo',{id:'funksjonsbingo',ch:'10k2',topic:'tegne-lineaer',where:'Kapittel 2 · Tegne lineære grafer',seed:1013,title:'Funksjonsbingo',
  short:'Bingo med funksjonsverdier og nullpunkter for lineære funksjoner.',intro:'Regne ut f(x) og finne der grafen skjærer aksene.',tips:'Sett inn tallet for x. Grafen skjærer x-aksen der y = 0.',
  gen:(R,i)=>{ const a=ri(R,-4,5)||2,b=ri(R,-8,8); if(i%3===2){ const x0=ri(R,-5,6); const bb=-a*x0; return {q:`Hvor skjærer grafen til f(x) = ${lin(a,bb)} x-aksen? Oppgi x.`,a:nf(x0),v:x0}; } const x=ri(R,-4,6); return {q:`f(x) = ${lin(a,b)}. Hva er f(${nf(x)})?`,a:nf(a*x+b),v:a*x+b}; }});

add('memory',{id:'konstantledd-memory',ch:'10k2',topic:'konstantledd',where:'Kapittel 2 · Konstantledd',seed:1014,title:'Linjememory',cfs:12,
  short:'Memory: finn beskrivelsen og funksjonsuttrykket for samme linje.',intro:'Stigningstall og konstantledd i funksjonsuttrykket y = ax + b.',tips:'Konstantleddet b er der linjen skjærer y-aksen. Stigningstallet a sier hvor mye y øker når x øker med 1.',
  gen:(R)=>{ const a=pick(R,[-3,-2,-1,1,2,3,4,.5]), b=ri(R,-6,6); return {q:`Skjærer y-aksen i (0, ${nf(b)}) og har stigningstall ${nf(a)}`,a:fxs(a,b),v:`${a},${b}`}; }});

add('domino',{id:'tre-punkter-domino',ch:'10k2',topic:'lin-graf',where:'Kapittel 2 · Grafen til lineære funksjoner',seed:1015,title:'Fra to punkter til linje',verb:'Finn linjen gjennom',dfs:12,
  short:'Domino: finn funksjonsuttrykket til linjen gjennom to punkter.',intro:'Finne stigningstall og konstantledd fra to punkter.',tips:'a = (y₂ − y₁) : (x₂ − x₁). Sett inn ett av punktene for å finne b.',
  gen:(R)=>{ const a=pick(R,[-3,-2,-1,1,2,3,4]), b=ri(R,-5,5); const x1=ri(R,-2,1), x2=x1+ri(R,1,3); return {q:`(${nf(x1)}, ${nf(a*x1+b)}) og (${nf(x2)}, ${nf(a*x2+b)})`,a:fxs(a,b),v:`${a},${b}`}; }});

add('stafett',{id:'brokfunksjon-stafett',ch:'10k2',topic:'brokfunk',where:'Kapittel 2 · Brøkfunksjoner',seed:1016,title:'Omvendt proporsjonal-stafett',n:12,sfs:14,
  short:'Lagstafett med omvendt proporsjonale størrelser og brøkfunksjoner.',intro:'Omvendt proporsjonalitet: x · y er konstant, y = k : x.',tips:'Finn konstanten k = x · y først. Da er y = k : x.',
  gen:(R,i)=>{ const t=i%3; if(t===0){ const k=pick(R,[12,24,36,48,60,72]), x=pick(R,[2,3,4,6,8,12].filter(v=>k%v===0)); return {q:`f(x) = ${fr(k,'x')}. Hva er f(${x})?`,a:nf(k/x),v:'f'+k/x+':'+k}; }
    if(t===1){ const v=pick(R,[40,60,80,100,120]), t1=pick(R,[2,3,4,6]); const d=v*t1, v2=pick(R,[40,60,80,100,120].filter(z=>z!==v&&d%z===0)); if(!v2) return null; return {q:`En tur tar ${t1} timer i ${v} km/h. Hvor lang tid tar den i ${v2} km/h?`,a:`${nf(d/v2)} timer`,v:'t'+d/v2+':'+v2}; }
    const x=ri(R,2,8), y=ri(R,2,9); return {q:`x og y er omvendt proporsjonale. Når x = ${x}, er y = ${y}. Finn konstanten k.`,a:nf(x*y),v:'k'+x*y}; }});

{ const K=[1,2,4,-2,6,-4];
  add('sett',{id:'brokgraf-trioer',ch:'10k2',topic:'brok-graf',where:'Kapittel 2 · Grafen til brøkfunksjoner',seed:1017,title:'Brøkfunksjon-trioer',kinds:['Uttrykk','Tabell','Graf'],cfs:13,
    short:'Finn uttrykk, tabell og graf for samme brøkfunksjon.',intro:'Grafen til y = k : x er en hyperbel.',tips:'Når k er negativ, ligger grafen i andre og fjerde kvadrant.',
    sets:K.map(k=>[`<b style="font-size:18pt">y = ${k<0?'−':''}${fr(Math.abs(k),'x')}</b>`,tbl([1,2,4],[1,2,4].map(x=>k/x)),plot(x=>Math.abs(x)<.05?null:k/x,{mm:36,n:400})]),
    check:()=>{ assert(new Set(K).size===6,'k'); }}); }

add('fireRad',{id:'fire-pa-rad-andregrad',ch:'10k2',topic:'andregrad',where:'Kapittel 2 · Andregradsfunksjoner',seed:1018,title:'Fire på rad: andregradsfunksjoner',ffs:15,lfs:12.5,
  short:'Regn ut funksjonsverdier for andregradsfunksjoner.',intro:'Regne ut f(x) for andregradsfunksjoner.',tips:'Regn ut potensen først. Pass på fortegn: (−3)² = 9.',
  gen:(R)=>{ const a=pick(R,[1,2,-1,3]), b=ri(R,-4,4), c=ri(R,-5,5), x=ri(R,-3,4); const y=a*x*x+b*x+c; return {q:`f(x) = ${quad(a,b,c)}. Finn f(${nf(x)}).`,a:nf(y),v:y}; }});

{ const S=[[1,0,0],[1,-2,-3],[-1,2,0],[1,4,3],[-1,0,4],[1,-4,4],[-1,-2,3],[0.5,0,-2]];
  const top=([a,b,c])=>{ const x=-b/(2*a); return [x,a*x*x+b*x+c]; };
  add('sett',{id:'parabel-trioer',ch:'10k2',topic:'andregrad-graf',where:'Kapittel 2 · Grafen til andregradsfunksjoner',seed:1019,title:'Parabeltrioer',kinds:['Uttrykk','Graf','Ekstremalpunkt'],cfs:12,
    short:'Finn uttrykket, grafen og topp- eller bunnpunktet som hører sammen.',intro:'Andregradsfunksjoner, parabler og ekstremalpunkter.',tips:'Positiv x²-koeffisient gir bunnpunkt (smil). Negativ gir toppunkt. Symmetrilinjen er x = −b : (2a).',
    sets:S.map(s=>{ const [x,y]=top(s); return [`<b style="font-size:15pt">f(x) = ${quad(s[0]===.5?.5:s[0],s[1],s[2]).replace(/^0\.5|^0,5/,'0,5')}</b>`,plot(t=>s[0]*t*t+s[1]*t+s[2],{mm:34}),`<b style="font-size:14pt">${s[0]>0?'Bunnpunkt':'Toppunkt'}<br>(${nf(x)}, ${nf(y)})</b>`]; }),
    check:()=>{ assert(new Set(S.map(s=>top(s).join())).size===8,'top'); }}); }

add('loype',{id:'vekstloypa',ch:'10k2',topic:'eksp-vekst',where:'Kapittel 2 · Eksponentiell vekst',seed:1020,title:'Vekstløypa',pfs:14,
  short:'Åtte poster med eksponentiell vekst og nedgang.',intro:'Eksponentiell vekst: startverdi · vekstfaktor^n.',tips:'Vekstfaktor ved p % økning er 1 + p/100. Etter n år: start · vekstfaktorⁿ.',
  gen:(R,i)=>{ const t=i%4; if(t===0){ const s=pick(R,[1000,2000,5000,10000]), p=pick(R,[2,3,4,5,10]), n=ri(R,2,6); const v=s*(1+p/100)**n; return {q:`${nf(s)} kr settes i banken med ${p} % rente per år. Hvor mye er det etter ${n} år?`,a:`≈ ${nf(Math.round(v))} kr`,v:Math.round(v)}; }
    if(t===1){ const s=pick(R,[200,500,1000]), n=ri(R,3,8); return {q:`En bakteriekultur dobles hver time. Ved start er det ${s}. Hvor mange er det etter ${n} timer?`,a:nf(s*2**n),v:s*2**n}; }
    if(t===2){ const s=pick(R,[100000,250000,400000]), p=pick(R,[10,15,20]), n=ri(R,2,4); const v=s*(1-p/100)**n; return {q:`En bil koster ${nf(s)} kr og taper ${p} % av verdien hvert år. Hva er den verdt etter ${n} år?`,a:`≈ ${nf(Math.round(v))} kr`,v:Math.round(v)}; }
    const s=pick(R,[80,120,160]), n=ri(R,1,3); return {q:`Et radioaktivt stoff halveres hver uke. Det er ${s} g ved start. Hvor mye er igjen etter ${n} uker?`,a:`${nf(s/2**n)} g`,v:s/2**n+.01}; }});

{ const I=[[0,'Taxi: 50 kr i startpris og 12 kr per km.'],[1,'Et beløp i banken vokser med 4 % per år.'],[2,'Arealet av et kvadrat med side x.'],[3,'Tiden det tar å kjøre 300 km med farten x.'],[0,'Høyden til et lys som brenner like mye hver time.'],[1,'Antall bakterier som dobles hver time.'],[2,'Høyden til en ball som kastes rett opp, etter x sekunder.'],[3,'Antall pizzabiter hver får når 24 biter deles på x personer.'],[1,'Verdien av en bil som taper 15 % per år.'],[0,'Lønna for x timer med timelønn 180 kr.'],[2,'Arealet av en rektangulær innhegning når gjerdet er 20 m.'],[3,'Antall dager x arbeidere bruker på en jobb på 60 dagsverk.']];
  add('sorter',{id:'modellsortering',ch:'10k2',topic:'mat-modell',where:'Kapittel 2 · Matematiske modeller',seed:1021,title:'Hvilken modell passer?',
    short:'Sorter situasjoner etter hvilken funksjonstype som passer som modell.',intro:'Velge riktig type modell for en situasjon.',tips:'Lik endring hver gang: lineær. Lik prosentvis endring: eksponentiell. Produktet er konstant: omvendt proporsjonal.',
    cats:[['Lineær','y = ax + b'],['Eksponentiell','y = a · bˣ'],['Andregrads','y = ax² + bx + c'],['Omvendt proporsjonal','y = k : x']],items:I}); }

{ const X=[1,2,3,4,5,6,7,8], Y=[12,15,19,22,26,28,32,35];
  const n=X.length, mx=X.reduce((a,b)=>a+b)/n, my=Y.reduce((a,b)=>a+b)/n; const a=X.reduce((s,x,i)=>s+(x-mx)*(Y[i]-my),0)/X.reduce((s,x)=>s+(x-mx)**2,0), b=my-a*mx;
  add('ark',{id:'regresjon-plante',ch:'10k2',topic:'regresjon',where:'Kapittel 2 · Regresjonsanalyse',title:'Hvor fort vokser solsikken?',
    short:'Lag en lineær modell for data med regresjon i GeoGebra eller regneark.',lede:`En solsikke ble målt hver uke. Bruk regresjon i GeoGebra eller et regneark for å finne en lineær modell.`,
    pre:key=>`<table class="t mt"><tr><th>Uke</th>${X.map(x=>`<td>${x}</td>`).join('')}</tr><tr><th>Høyde (cm)</th>${Y.map(y=>`<td>${y}</td>`).join('')}</tr></table><div class="box"><b class="t">Slik gjør du i GeoGebra</b><p>Skriv tallene i regnearket, merk dem, og velg «Regresjonsanalyse». Velg «Lineær» som modell.</p></div><h2>Spørsmål</h2>`,
    Q:[['Hvilken modell gir GeoGebra? Skriv den som h(x) = ax + b.',`h(x) ≈ ${nf(r2(a))}x + ${nf(r2(b))}`],['Hva betyr tallet foran x i denne situasjonen?',`Solsikken vokser omtrent ${nf(r2(a))} cm per uke.`],['Hva betyr konstantleddet?',`Høyden ved uke 0 var omtrent ${nf(r2(b))} cm.`],['Bruk modellen til å anslå høyden etter 12 uker.',`h(12) ≈ ${nf(r1(a*12+b))} cm`],['Kan modellen brukes for å anslå høyden etter 52 uker? Begrunn.','Nei. Planten slutter å vokse, og en lineær modell gjelder bare et begrenset tidsrom.',2]],
    check:()=>{ assert(Math.abs(a-3.2)<.1,'a='+a); }}); }

/* ===== Økonomi ===== */
add('chain',{id:'hvem-har-vekstfaktor',ch:'10k3',topic:'vekstfaktor10',where:'Kapittel 3 · Vekstfaktor',seed:1022,title:'Jeg har – hvem har? Vekstfaktor',big:22,qfs:15,
  short:'Regnekjede mellom prosentvis endring og vekstfaktor.',intro:'Vekstfaktoren ved prosentvis økning og nedgang.',tips:'Økning med p %: 1 + p/100. Nedgang med p %: 1 − p/100.',
  gen:(R,i)=>{ const p=ri(R,1,95); const up=i%2===0; if(!up&&p>90) return null; const vf=up?1+p/100:1-p/100; return {q:`${up?'en økning':'en nedgang'} på ${p} % ?`,a:nf(r2(vf)),v:r2(vf)}; }});

add('bingo',{id:'finn-prosent-bingo',ch:'10k3',topic:'finne-prosent',where:'Kapittel 3 · Å finne prosenten',seed:1023,title:'Prosentbingo',afs:15,
  short:'Bingo med å finne prosenten, den opprinnelige prisen og prosentvis endring.',intro:'Finne prosent, opprinnelig verdi og endring i prosent.',tips:'Prosent = del : hel · 100. Opprinnelig pris = ny pris : vekstfaktor.',
  gen:(R,i)=>{ const t=i%3; if(t===0){ const h=pick(R,[20,25,40,50,80,200,400]), p=pick(R,[5,10,15,20,25,30,40,60,75]); const d=h*p/100; if(!Number.isInteger(d)) return null; return {q:`Hvor mange prosent er ${d} av ${h}?`,a:`${p} %`,v:'p'+p}; }
    if(t===1){ const o=pick(R,[200,400,500,800,1200,1600]), p=pick(R,[10,20,25,40]); return {q:`Etter ${p} % rabatt koster en vare ${nf(o*(1-p/100))} kr. Hva kostet den før?`,a:kr(o),v:'o'+o}; }
    const o=pick(R,[200,250,400,500,800]), n=o*pick(R,[1.1,1.2,1.25,0.8,0.9,0.75,1.5]); return {q:`Prisen endret seg fra ${o} kr til ${nf(n)} kr. Hva er endringen i prosent?`,a:`${n>o?'+':'−'}${nf(Math.round(Math.abs(n-o)/o*100))} %`,v:'e'+Math.round((n-o)/o*100)}; }});

add('domino',{id:'mva-domino',ch:'10k3',topic:'mva',where:'Kapittel 3 · Merverdiavgift',seed:1024,title:'Mva-domino',dfs:12,
  short:'Domino med priser med og uten merverdiavgift.',intro:'Regne med 25 % mva (15 % på mat).',tips:'Pris med mva = pris uten mva · 1,25. Pris uten mva = pris med mva : 1,25.',
  gen:(R,i)=>{ const t=i%3; if(t===0){ const p=ri(R,4,60)*20; return {q:`${nf(p)} kr uten mva. Pris med 25 % mva?`,a:kr(p*1.25),v:p*1.25}; } if(t===1){ const p=ri(R,4,60)*20; return {q:`${nf(p*1.25)} kr med 25 % mva. Pris uten mva?`,a:kr(p),v:p}; } const p=ri(R,2,40)*20; return {q:`Mat: ${nf(p)} kr uten mva. Pris med 15 % mva?`,a:kr(r2(p*1.15)),v:r2(p*1.15)}; }});

add('memory',{id:'finn-mva-memory',ch:'10k3',topic:'finne-mva',where:'Kapittel 3 · Å finne merverdiavgiften',seed:1025,title:'Mva-memory',cfs:14,
  short:'Memory: finn prisen og mva-beløpet som hører sammen.',intro:'Finne hvor mye av en pris som er merverdiavgift.',tips:'Med 25 % mva er mva-beløpet pris : 5. Med 15 % mva er det pris · 0,15 : 1,15.',
  gen:(R,i)=>{ if(i%3===2){ const m=ri(R,2,40)*3; const p=m/0.15*1.15; return {q:`Mat til ${nf(r2(p))} kr<br><span style="font-weight:400;font-size:11pt">(15 % mva)</span>`,a:`mva ${kr(m)}`,v:'m'+m}; } const m=ri(R,10,300); return {q:`${nf(m*5)} kr<br><span style="font-weight:400;font-size:11pt">(25 % mva)</span>`,a:`mva ${kr(m)}`,v:'n'+m}; }});

add('stafett',{id:'sparestafett',ch:'10k3',topic:'sparing',where:'Kapittel 3 · Sparing',seed:1026,title:'Sparestafett',n:12,sfs:14,
  short:'Lagstafett med renter, renters rente og sparemål.',intro:'Renter og renters rente på sparekonto.',tips:'Rente for ett år = beløp · p/100. Etter n år med renters rente: beløp · (1 + p/100)ⁿ.',
  gen:(R,i)=>{ const t=i%3, K=pick(R,[2000,5000,8000,10000,20000]), p=pick(R,[2,2.5,3,4,5]); if(t===0) return {q:`Du har ${nf(K)} kr på en konto med ${nf(p)} % rente. Hvor mye får du i renter etter ett år?`,a:kr(K*p/100),v:'r'+K*p/100};
    if(t===1){ const n=ri(R,2,5); return {q:`${nf(K)} kr står i ${n} år med ${nf(p)} % rente per år. Hvor mye er det på kontoen? Rund av til hele kroner.`,a:`${nf(Math.round(K*(1+p/100)**n))} kr`,v:'k'+Math.round(K*(1+p/100)**n)}; }
    const m=pick(R,[250,400,500,750]), M=m*ri(R,6,30); return {q:`Du sparer ${m} kr i måneden. Hvor mange måneder tar det å spare ${nf(M)} kr (uten renter)?`,a:`${M/m} måneder`,v:'m'+M/m}; }});

{ const L=60000, N=5, r=6; const rows=[...Array(N)].map((_,i)=>{ const rest=L-i*L/N, rente=rest*r/100; return [i+1,rest,rente,L/N,rente+L/N]; }); const tot=rows.reduce((s,x)=>s+x[2],0);
  add('ark',{id:'serielan-plan',ch:'10k3',topic:'serielan',where:'Kapittel 3 · Serielån',title:'Nedbetalingsplan for serielån',
    short:'Fyll ut en hel nedbetalingsplan for et serielån, og sammenlign med et kortere lån.',lede:`Ali låner ${nf(L)} kr til en brukt bil. Lånet er et serielån over ${N} år med ${r} % rente. Han betaler én gang i året.`,
    pre:key=>`<table class="t mt"><tr><th>År</th><th>Restgjeld (kr)</th><th>Renter (kr)</th><th>Avdrag (kr)</th><th>Terminbeløp (kr)</th></tr>${rows.map(x=>`<tr><td>${x[0]}</td>${x.slice(1).map(v=>`<td>${key?`<span class="a">${nf(v)}</span>`:''}</td>`).join('')}</tr>`).join('')}<tr><th>Sum</th><td></td><td>${key?`<span class="a">${nf(tot)}</span>`:''}</td><td>${key?`<span class="a">${nf(L)}</span>`:''}</td><td>${key?`<span class="a">${nf(L+tot)}</span>`:''}</td></tr></table><h2>Spørsmål</h2>`,
    Q:[['Hvorfor er avdraget likt hvert år i et serielån?',`Lånet deles likt på antall år: ${nf(L)} : ${N} = ${nf(L/N)} kr.`],['Hvorfor blir terminbeløpet mindre for hvert år?','Restgjelden blir mindre, og da blir rentene mindre.'],['Hvor mye betaler Ali i renter til sammen?',`${nf(tot)} kr.`],['Hva hadde rentene blitt hvis lånet var over 3 år i stedet? Lag en ny tabell på baksiden.',`Avdrag 20 000 kr. Renter: 3600 + 2400 + 1200 = 7200 kr.`]],
    check:()=>{ assert(tot===10800,'tot '+tot); assert(3600+2400+1200===7200,'3 år'); }}); }

{ let b=15000, m=0, paid=0; const rows=[]; while(b>0.005&&m<300){ const r=b*.02, pay=Math.min(b+r,Math.max(500,b*.03)); if(m<6) rows.push([m+1,r2(b),r2(r),r2(pay),r2(b+r-pay)]); b=b+r-pay; paid+=pay; m++; }
  add('ark',{id:'kredittkortfella',ch:'10k3',topic:'kredittkort',where:'Kapittel 3 · Kredittkort',title:'Kredittkortfella',
    short:'Se hva som skjer når du bare betaler minstebeløpet på kredittkortet.',lede:'Sara handler for 15 000 kr på kredittkort. Renta er 2 % per måned. Hun betaler bare minstebeløpet: 3 % av gjelden, men minst 500 kr.',
    pre:key=>`<table class="t mt"><tr><th>Måned</th><th>Gjeld ved start</th><th>Renter (2 %)</th><th>Innbetalt</th><th>Gjeld etterpå</th></tr>${rows.map(x=>`<tr><td>${x[0]}</td>${x.slice(1).map(v=>`<td>${key?`<span class="a">${nf(v)}</span>`:''}</td>`).join('')}</tr>`).join('')}</table><h2>Spørsmål</h2>`,
    Q:[['Hvor mye av den første innbetalingen går til renter?','300 kr av 500 kr. Bare 200 kr betaler ned gjelden.'],['Hvor mye er gjelden redusert etter seks måneder?',`Fra 15 000 kr til ${nf(rows[5][4])} kr.`],[`Datamaskinen har regnet ut at det tar ${m} måneder (${nf(r1(m/12))} år) å betale ned gjelden. Hvor mye betaler hun til sammen?`,`Omtrent ${nf(Math.round(paid))} kr, altså ${nf(Math.round(paid-15000))} kr i renter.`],['Hva er den årlige renta, regnet med renters rente?',`1,02¹² ≈ 1,268. Det er omtrent 26,8 % per år.`],['Gi tre råd til en venn som har fått kredittkort.','For eksempel: betal hele beløpet hver måned, bruk kortet bare til det du har råd til, spar heller først.',2]],
    check:()=>{ assert(Math.abs(1.02**12-1.268)<.001,'eff'); assert(m>40,'m '+m); }}); }

add('fireRad',{id:'fire-pa-rad-lonn',ch:'10k3',topic:'lonn-skatt',where:'Kapittel 3 · Lønn og skatt',seed:1027,title:'Fire på rad: lønn og skatt',ffs:13,lfs:12,
  short:'Timelønn, overtid, skatt og feriepenger.',intro:'Regne ut bruttolønn, skatt og nettolønn.',tips:'Nettolønn = bruttolønn − skatt. Skattetrekk: bruttolønn · prosent : 100.',
  gen:(R,i)=>{ const t=i%3; if(t===0){ const h=pick(R,[160,170,180,190,200,220]), n=ri(R,5,20); return {q:`Timelønn ${h} kr. Du jobber ${n} timer. Bruttolønn?`,a:kr(h*n),v:h*n}; }
    if(t===1){ const b=ri(R,20,50)*1000, p=pick(R,[25,28,30,32,35]); return {q:`Bruttolønn ${nf(b)} kr, skattetrekk ${p} %. Nettolønn?`,a:kr(b*(1-p/100)),v:b*(1-p/100)}; }
    const h=pick(R,[180,200,240]), n=ri(R,2,6); return {q:`Timelønn ${h} kr og 50 % overtidstillegg. Hva tjener du på ${n} timer overtid?`,a:kr(h*1.5*n),v:h*1.5*n+.5}; }});

add('sorter',{id:'utgiftssortering',ch:'10k3',topic:'utgifter',where:'Kapittel 3 · Utgifter',seed:1028,title:'Faste og variable utgifter',
  short:'Sorter utgifter som faste, variable eller uforutsette.',intro:'Ulike typer utgifter i et budsjett.',tips:'Faste utgifter er like hver måned. Variable endrer seg. Uforutsette kan du ikke planlegge, men du kan spare til dem.',
  cats:[['Faste utgifter','like hver måned'],['Variable utgifter','endrer seg fra måned til måned'],['Uforutsette utgifter','kommer uten forvarsel']],
  items:[[0,'Husleie'],[0,'Mobilabonnement'],[1,'Mat og drikke'],[2,'Mobilen knuser'],[0,'Strømmetjeneste'],[1,'Klær'],[1,'Strøm (pris varierer)'],[2,'Tannlegen'],[0,'Forsikring'],[1,'Kino og kafé'],[2,'Sykkelen blir stjålet'],[0,'Treningssenter'],[1,'Bensin'],[2,'Bot for å glemme billett'],[0,'Månedskort på bussen'],[1,'Gaver']],
  keyNote:'Strøm kan diskuteres: noen har fastpris. Poenget er at elevene begrunner valget.'});

add('chain',{id:'hvem-har-valuta',ch:'10k3',topic:'valuta',where:'Kapittel 3 · Valuta',seed:1029,title:'Jeg har – hvem har? Valuta',big:20,qfs:13,
  short:'Regnekjede med valutaomregning mellom kroner, euro, dollar og pund.',intro:'Omregning med valutakurser. Kursene er bare eksempler.',tips:'Fra utenlandsk valuta til kroner: gang med kursen. Fra kroner: del på kursen.',
  gen:(R,i)=>{ const K=[['euro',11.5],['dollar',10.5],['pund',13.5],['svenske kroner',1]]; const [n,k]=pick(R,K.slice(0,3)); if(i%2===0){ const a=ri(R,2,40)*10; return {q:`${a} ${n} i kroner (kurs ${nf(k)})?`,a:kr(r2(a*k)),v:r2(a*k)}; } const a=ri(R,2,40)*10; const kronor=r2(a*k); return {q:`${nf(kronor)} kr i ${n} (kurs ${nf(k)})?`,a:`${a} ${n}`,v:'x'+a+n}; }});

/* ===== Utforskende ===== */
add('ark',{id:'mopedokonomi',ch:'10k4',topic:'moped',where:'Kapittel 4 · Moped og sertifikat',title:'Hva koster mopeden egentlig?',
  short:'Regn ut hva det koster å ha moped i ett år, og per kilometer.',lede:'Jonas vil kjøpe en brukt moped. Hjelp ham å regne ut hva den egentlig koster i løpet av det første året.',
  pre:key=>`<table class="t mt"><tr><th>Post</th><th>Kostnad</th></tr><tr><td>Moped (brukt)</td><td>18 000 kr</td></tr><tr><td>Førerkort klasse AM146 (kurs og prøver)</td><td>9 500 kr</td></tr><tr><td>Hjelm og klær</td><td>4 000 kr</td></tr><tr><td>Forsikring</td><td>450 kr per måned</td></tr><tr><td>Bensin</td><td>0,25 liter per mil, 22 kr per liter</td></tr><tr><td>Service</td><td>1 500 kr per år</td></tr></table><h2>Regn ut</h2>`,
  Q:[['Hva koster forsikringen for ett år?','450 · 12 = 5400 kr'],['Jonas kjører 3000 km i året. Hvor mange liter bensin bruker han, og hva koster det?','300 mil · 0,25 = 75 liter. 75 · 22 = 1650 kr.'],['Hva er den totale kostnaden det første året?','18 000 + 9500 + 4000 + 5400 + 1650 + 1500 = 40 050 kr'],['Hva koster mopeden per kilometer det første året?','40 050 : 3000 ≈ 13,35 kr per km'],['Etter ett år selger han mopeden for 14 000 kr. Hva har det kostet ham?','40 050 − 14 000 = 26 050 kr'],['Busskortet koster 450 kr i måneden. Hva er billigst? Hvilke andre argumenter finnes?','Busskort: 5400 kr per år. Mopeden er dyrere, men gir frihet. Svarene varierer.',2]],
  check:()=>{ assert(18000+9500+4000+5400+1650+1500===40050,'sum'); }});

add('ark',{id:'leie-eller-eie',ch:'10k4',topic:'bolig',where:'Kapittel 4 · Bolig og økonomi',title:'Leie eller eie?',
  short:'Sammenlign kostnadene ved å leie og å kjøpe en leilighet.',lede:'Maja kan leie en leilighet for 11 000 kr i måneden, eller kjøpe en lik leilighet for 3 000 000 kr. Hun har 450 000 kr i egenkapital og låner resten.',
  Q:[['Hvor mye må Maja låne?','3 000 000 − 450 000 = 2 550 000 kr'],['Hvor mange prosent av kjøpesummen er egenkapitalen?','450 000 : 3 000 000 = 0,15 = 15 %'],['Første år er renta 5 %. Hvor mye betaler hun i renter det første året (omtrent)?','2 550 000 · 0,05 = 127 500 kr'],['Hva koster det å leie i ett år?','11 000 · 12 = 132 000 kr'],['Leiligheten stiger 3 % i verdi per år. Hva er den verdt etter 5 år?','3 000 000 · 1,03⁵ ≈ 3 477 822 kr'],['Hva er fordeler og ulemper med å leie og å eie? Nevn minst to av hver.','Eksempler: Eie gir verdistigning og trygghet, men risiko for renteøkning. Leie er fleksibelt, men du bygger ikke formue.',2]],
  check:()=>{ assert(Math.round(3000000*1.03**5)===3477822,'v'); }});

add('ark',{id:'jorda-i-tall',ch:'10k4',topic:'jorda',where:'Kapittel 4 · Jorda og beregninger',title:'Jorda i tall',
  short:'Regn med jordas omkrets, overflate, volum og fart.',lede:'Jorda er nesten en kule med radius 6371 km. Bruk π ≈ 3,14 og standardform når tallene blir store.',
  Q:[['Hva er omkretsen rundt ekvator?','2 · 3,14 · 6371 ≈ 40 010 km'],['Hvor fort går et punkt på ekvator rundt jordaksen, i km/h?','40 010 km : 24 h ≈ 1667 km/h'],['Hva er overflaten til jorda? Skriv på standardform.','4 · 3,14 · 6371² ≈ 5,1 · 10⁸ km²'],['Omtrent 71 % av overflaten er hav. Hvor stort areal er land?','0,29 · 5,1 · 10⁸ ≈ 1,5 · 10⁸ km²'],['Hva er volumet av jorda?','4 · 3,14 · 6371³ : 3 ≈ 1,08 · 10¹² km³'],['Jorda går rundt sola på et år. Avstanden til sola er 1,5 · 10⁸ km. Hvor langt reiser jorda på ett år, og hvor fort er det i km/h?','2 · 3,14 · 1,5 · 10⁸ ≈ 9,4 · 10⁸ km. Delt på 8760 timer ≈ 107 500 km/h.',2]],
  check:()=>{ assert(Math.round(2*3.14*6371)===40010,'o'); assert(Math.abs(4*3.14*6371**2/1e8-5.098)<.01,'A'); assert(Math.abs(4*3.14*6371**3/3/1e12-1.083)<.01,'V'); assert(Math.abs(2*3.14*1.5e8/8760-107534)<10,'v'); }});

add('memory',{id:'tallsystem-memory',ch:'10k4',topic:'tallsystem',where:'Kapittel 4 · Ulike tallsystemer',seed:1030,title:'Totall og romertall',cfs:15,
  short:'Memory med totallsystemet, romertall og vanlige tall.',intro:'Totallsystemet og romertall.',tips:'Totall: plassene er verdt 1, 2, 4, 8, 16, … Romertall: I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000.',
  gen:(R,i)=>{ const rom=n=>{ const M=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]; let s=''; M.forEach(([v,c])=>{ while(n>=v){ s+=c; n-=v; } }); return s; };
    if(i%2===0){ const n=ri(R,3,63); return {q:`<span style="font-family:'JetBrains Mono'">${n.toString(2)}</span><sub style="font-size:.6em">2</sub>`,a:nf(n),v:n}; } const n=ri(R,64,2026); return {q:`<span style="font-family:'JetBrains Mono'">${rom(n)}</span>`,a:nf(n),v:n}; }});

module.exports=A;
