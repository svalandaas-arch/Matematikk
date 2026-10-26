// Delkapittel-aktiviteter 9. trinn
const {C,nf,fr,gcd}=require('./common');
const T=require('./types'), H=require('./helpers');
const {ri,pick,P,poly,lin,red,F,tbl,plot}=H; const {assert}=T;
const G=9, A=[];
const add=(type,o)=>A.push(T.make(T[type],Object.assign({G},o)));
const r1=x=>Math.round(x*10)/10, PI=3.14;
const d1=x=>{ const v=r1(x); return (Math.abs(v-x)>1e-9?'≈ ':'')+nf(v); };
const svgT=(x,y,t,fs=3.2,a='middle')=>`<text x="${x}" y="${y}" font-size="${fs}" text-anchor="${a}" font-family="Atkinson Hyperlegible" font-weight="700">${t}</text>`;

/* ===== Statistikk ===== */
add('sorter',{id:'sorter-data',ch:'9k1',topic:'datasett',where:'Kapittel 1 · Data og datasett',seed:901,title:'Hva slags data?',
  short:'Sorter variabler: kategoriske, diskrete eller kontinuerlige data.',intro:'Elevene sorterer ting vi kan samle data om.',
  tips:'Kategoriske data er navn eller kategorier. Diskrete data kan telles. Kontinuerlige data måles og kan ha desimaler.',
  cats:[['Kategoriske data','farger, navn, typer'],['Numeriske, diskrete data','noe vi teller'],['Numeriske, kontinuerlige data','noe vi måler']],
  items:[[0,'Favorittfarge'],[1,'Antall søsken'],[2,'Høyde i cm'],[0,'Bilmerke familien har'],[2,'Tid på 60 meter'],[1,'Antall mål i en fotballkamp'],[2,'Temperatur ute'],[0,'Postnummer'],[0,'Måneden du har bursdag'],[2,'Vekten til en sekk'],[1,'Antall sider i en bok'],[0,'Fritidsaktivitet'],[1,'Antall elever i klassen'],[2,'Tid brukt på lekser'],[1,'Skostørrelse'],[0,'Hvordan du kommer deg til skolen']],
  keyNote:'Postnummer er tall, men det gir ingen mening å regne gjennomsnitt av dem. Derfor er de kategoriske. Skostørrelse er diskret fordi bare bestemte verdier finnes.'});

{ const bars=(lab,val)=>{ const W=70,Hh=42,mx=Math.max(...val), top=Math.ceil(mx/5)*5, Y=v=>Hh-7-v*(Hh-12)/top; let s=`<svg viewBox="0 0 ${W} ${Hh}" width="52mm" height="31mm">`;
    for(let v=0;v<=top;v+=5) s+=`<line x1="8" x2="${W-2}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v?'#DCE2EC':C.ink}" stroke-width="${v?.25:.5}"/>`+svgT(6.5,Y(v)+1,v,2.6,'end');
    lab.forEach((l,i)=>{ const bw=(W-14)/lab.length; s+=`<rect x="${10+i*bw+bw*.15}" y="${Y(val[i])}" width="${bw*.7}" height="${Y(0)-Y(val[i])}" fill="${C.pen}"/>`+svgT(10+i*bw+bw/2,Hh-2.5,l,2.4); }); return s+'</svg>'; };
  const SETS=[['Fotball','Ski','Dans','Sjakk'],['Hund','Katt','Fisk','Hest'],['Pizza','Taco','Sushi','Suppe'],['Buss','Sykkel','Gå','Bil'],['Rød','Blå','Grønn','Gul']];
  add('stafett',{id:'stolpestafett',ch:'9k1',topic:'stolpediagram',where:'Kapittel 1 · Stolpediagram',seed:902,title:'Stolpediagram-stafett',n:12,sfs:12,
    short:'Lagstafett der hvert kort er et stolpediagram med et spørsmål.',intro:'Lese av og regne med stolpediagram.',tips:'Les av verdien på toppen av hver stolpe. Sjekk hva hver strek på aksen står for.',
    gen:(R,i)=>{ const L=pick(R,SETS), v=L.map(()=>ri(R,2,14)); const t=i%4; let q,a,val; const k=ri(R,0,3); let m=ri(R,0,3); if(m===k) m=(k+1)%4; const sum=v.reduce((x,y)=>x+y,0);
      if(t===0){ q=`Hvor mange flere valgte ${L[k].toLowerCase()} enn ${L[m].toLowerCase()}?`; val=v[k]-v[m]; if(val<=0) return null; a=nf(val); }
      else if(t===1){ q='Hvor mange svarte til sammen?'; val=sum; a=nf(val); }
      else if(t===2){ q=`Hvor mange prosent valgte ${L[k].toLowerCase()}? Svar med én desimal.`; val=r1(v[k]*100/sum); a=d1(v[k]*100/sum)+' %'; }
      else { q=`Hva er gjennomsnittet av stolpene? Svar med én desimal.`; val=r1(sum/4); a=d1(sum/4); }
      return {q:bars(L,v)+`<p style="margin:1mm 0 0;font-size:10.5pt;line-height:1.25">${q}</p>`,a,v:t+':'+val}; }}); }

add('loype',{id:'sektorloypa',ch:'9k1',topic:'sektordiagram',where:'Kapittel 1 · Sektordiagram',seed:903,title:'Sektorløypa',
  short:'Åtte poster med grader, prosent og antall i sektordiagram.',intro:'Regne mellom antall, prosent og grader i sektordiagram.',tips:'Hele sirkelen er 360°. 10 % av sirkelen er 36°.',
  gen:(R,i)=>{ const t=i%4, N=pick(R,[20,24,30,36,40,60,72,90]); if(t===0){ const k=ri(R,1,N-1); const g=k*360/N; if(!Number.isInteger(g)) return null; return {q:`${N} elever ble spurt. ${k} av dem svarte ja. Hvor mange grader blir sektoren for «ja»?`,a:`${g}°`,v:g}; }
    if(t===1){ const p=pick(R,[5,10,15,20,25,30,35,40,45,60,75]); return {q:`En sektor viser ${p} % av svarene. Hvor mange grader er sektoren?`,a:`${p*3.6}°`,v:p*3.6+.5}; }
    if(t===2){ const g=pick(R,[30,45,60,72,90,120,144,180]); const k=g*N/360; if(!Number.isInteger(k)) return null; return {q:`I et sektordiagram over ${N} svar er en sektor ${g}°. Hvor mange svar viser sektoren?`,a:nf(k),v:k+.25}; }
    const g=pick(R,[18,36,54,72,90,108,126,162]); return {q:`En sektor er ${g}°. Hvor mange prosent av sirkelen er det?`,a:`${nf(g/3.6)} %`,v:g/3.6+.75}; }});

/* ===== Plangeometri ===== */
{ const S=[[2,1],[3,2],[4,-1],[5,0],[2,5],[3,-2],[6,1],[4,3]];
  add('sett',{id:'monstertrioer',ch:'9k2',topic:'monster-alg',where:'Kapittel 2 · Beskrive mønstre algebraisk',seed:904,title:'Mønstertrioer',kinds:['Formel','Tabell','Figur 10'],
    short:'Finn formel, tabell og figur 10 som hører til samme mønster.',intro:'Lineære mønstre beskrevet med formel, tabell og verdien for figur 10.',tips:'Hvor mye øker tallene for hver figur? Det er tallet foran n.',
    sets:S.map(([a,b])=>[`<b style="font-size:18pt">${lin(a,b,'n')}</b>`,`<table class="t ct"><tr><th>n</th><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>antall</th>${[1,2,3,4].map(n=>`<td>${a*n+b}</td>`).join('')}</tr></table>`,`<p style="font-size:13pt">Figur 10 har <b>${a*10+b}</b> ruter.</p>`]),
    check:()=>{ assert(new Set(S.map(([a,b])=>a*10+b)).size===8,'f10'); assert(new Set(S.map(([a,b])=>[1,2,3,4].map(n=>a*n+b).join())).size===8,'tab'); }}); }

add('bingo',{id:'vinkelbingo',ch:'9k2',topic:'vinkler',where:'Kapittel 2 · Om vinkler',seed:905,title:'Vinkelbingo',
  short:'Nabovinkler, komplementvinkler, toppvinkler og vinkler på klokka.',intro:'Vinkelbegreper og vinkelregning.',tips:'Nabovinkler er til sammen 180°. Komplementvinkler er til sammen 90°. Toppvinkler er like store.',
  gen:(R,i)=>{ const t=i%5; if(t===0){ const a=ri(R,20,170); return {q:`Hvor stor er nabovinkelen til ${a}°?`,a:`${180-a}°`,v:180-a}; }
    if(t===1){ const a=ri(R,5,85); return {q:`Hvor stor er komplementvinkelen til ${a}°?`,a:`${90-a}°`,v:90-a}; }
    if(t===2){ const a=ri(R,20,160); return {q:`To linjer krysser hverandre. Den ene vinkelen er ${a}°. Hvor stor er toppvinkelen?`,a:`${a}°`,v:a}; }
    if(t===3){ const h=ri(R,1,5); return {q:`Hvor stor er den minste vinkelen mellom viserne klokka ${h}:00?`,a:`${h*30}°`,v:h*30}; }
    const a=ri(R,30,80),b=ri(R,30,80); if(a+b>=170) return null; return {q:`To vinkler i en trekant er ${a}° og ${b}°. Hvor stor er den tredje?`,a:`${180-a-b}°`,v:180-a-b}; }});

{ const cat=v=>{ if(v.s){ const [a,b,c]=v.s.slice().sort((x,y)=>x-y); if(a+b<=c) return 3; const d=a*a+b*b-c*c; return d>0?0:d===0?1:2; } const ang=v.a.length===2?[...v.a,180-v.a[0]-v.a[1]]:v.a; if(ang.some(x=>x<=0)||Math.abs(ang.reduce((p,q)=>p+q,0)-180)>1e-9) return 3; const m=Math.max(...ang); return m<90?0:m===90?1:2; };
  const I=[{a:[60,60,60]},{a:[50,60]},{a:[90,35]},{a:[100,40]},{a:[95,90]},{a:[120,70]},{s:[3,4,5]},{s:[5,12,13]},{s:[2,3,7]},{s:[6,6,6]},{s:[4,5,6]},{s:[3,4,6]},{a:[45,45,90]},{a:[30,30]},{s:[1,2,3]},{a:[89,1]}];
  const txt=v=>v.s?`Sidene er ${v.s.join(' cm, ')} cm.`:v.a.length===2?`To av vinklene er ${v.a[0]}° og ${v.a[1]}°.`:`Vinklene er ${v.a.join('°, ')}°.`;
  add('sorter',{id:'trekantsortering',ch:'9k2',topic:'trekanter',where:'Kapittel 2 · Spesielle trekanter',seed:906,title:'Hvilken trekant?',
    short:'Sorter trekanter etter vinkler, og finn de som ikke kan finnes.',intro:'Spissvinklede, rettvinklede og stumpvinklede trekanter.',tips:'Vinkelsummen er 180°. Den lengste siden må være kortere enn de to andre til sammen.',
    cats:[['Spissvinklet','alle vinkler under 90°'],['Rettvinklet','én vinkel er 90°'],['Stumpvinklet','én vinkel over 90°'],['Umulig trekant','kan ikke tegnes']],
    items:I.map(v=>[cat(v),txt(v)]), keyNote:'For sidene kan elevene sjekke med Pytagoras: a² + b² = c² gir rett vinkel, større enn c² gir spissvinklet, mindre gir stumpvinklet. Sidene 1, 2, 3 gir ingen trekant fordi 1 + 2 = 3.'}); }

add('stafett',{id:'mangekantstafett',ch:'9k2',topic:'regulare',where:'Kapittel 2 · Regulære mangekanter',seed:907,title:'Mangekantstafett',n:12,
  short:'Lagstafett med vinkler, sider og omkrets i regulære mangekanter.',intro:'Vinkelsum, enkeltvinkler og omkrets i regulære mangekanter.',tips:'Vinkelsummen i en n-kant er (n − 2) · 180°. Del på n for å finne hver vinkel.',
  gen:(R,i)=>{ const n=pick(R,[3,4,5,6,8,9,10,12]), t=i%4; const ang=(n-2)*180/n; if(t===0) return {q:`Hvor stor er hver vinkel i en regulær ${n}-kant?`,a:`${nf(ang)}°`,v:'a'+n};
    if(t===1) return {q:`Hver vinkel i en regulær mangekant er ${nf(ang)}°. Hvor mange sider har den?`,a:nf(n),v:'n'+n};
    if(t===2){ const s=ri(R,3,12); return {q:`En regulær ${n}-kant har sider på ${s} cm. Hva er omkretsen?`,a:`${n*s} cm`,v:'o'+n*s}; }
    return {q:`Hva er vinkelsummen i en ${n}-kant?`,a:`${(n-2)*180}°`,v:'s'+n}; }});

add('fireRad',{id:'fire-pa-rad-kvadrat',ch:'9k2',topic:'kvadrat',where:'Kapittel 2 · Kvadrat',seed:908,title:'Fire på rad: kvadrater',
  short:'Areal, omkrets og side i kvadrater.',intro:'Sammenhengen mellom side, omkrets og areal i kvadrater.',tips:'A = s · s og O = 4 · s. Kjenner du arealet, finner du siden med kvadratrot.',ffs:14,lfs:12,
  gen:(R,i)=>{ const s=ri(R,2,15), t=i%3; if(t===0) return {q:`Et kvadrat har side ${s} cm. Hva er arealet?`,a:`${s*s} cm²`,v:'A'+s*s}; if(t===1) return {q:`Et kvadrat har omkrets ${4*s} cm. Hvor lang er siden?`,a:`${s} cm`,v:'s'+s}; return {q:`Et kvadrat har areal ${s*s} cm². Hva er omkretsen?`,a:`${4*s} cm`,v:'O'+4*s}; }});

add('memory',{id:'parallellogram-memory',ch:'9k2',topic:'parallellogram',where:'Kapittel 2 · Parallellogram',seed:909,title:'Parallellogram-memory',cfs:13,
  short:'Memory: finn parallellogrammet og arealet som hører sammen.',intro:'Areal av parallellogram med grunnlinje og høyde.',tips:'A = g · h. Høyden står vinkelrett på grunnlinjen, og er ikke den skrå siden.',
  gen:(R)=>{ const g=ri(R,3,15), h=ri(R,2,12), s=h+ri(R,1,4); return {q:`<span style="font-size:11pt;font-weight:400">Parallellogram</span><br>g = ${g} cm<br>h = ${h} cm<br><span style="font-size:10pt;font-weight:400">skrå side ${s} cm</span>`,a:`${g*h} cm²`,v:g*h}; }});

add('domino',{id:'trapesdomino',ch:'9k2',topic:'trapes',where:'Kapittel 2 · Trapes',seed:910,title:'Trapesdomino',dfs:11,
  short:'Regn ut arealet av trapeser og legg brikkene i ring.',intro:'Arealet av trapes med de parallelle sidene a og b og høyden h.',tips:'A = (a + b) · h : 2.',
  gen:(R)=>{ const a=ri(R,4,14), b=ri(R,2,a-1), h=ri(R,2,10); const A_=(a+b)*h/2; return {q:`Trapes: a = ${a} cm, b = ${b} cm, h = ${h} cm. Areal?`,a:`${nf(A_)} cm²`,v:A_}; }});

add('bingo',{id:'trekantbingo-areal',ch:'9k2',topic:'trekant-areal',where:'Kapittel 2 · Trekant',seed:911,title:'Trekantbingo',short:'Bingo med arealet av trekanter, og høyden når arealet er kjent.',intro:'Areal av trekanter, og å finne grunnlinje eller høyde når arealet er kjent.',tips:'A = g · h : 2. Kjenner du A og g, er h = 2 · A : g.',
  gen:(R,i)=>{ const g=ri(R,3,16), h=ri(R,2,14); const A_=g*h/2; if(i%3===2){ if(!Number.isInteger(A_)) return null; return {q:`En trekant har areal ${A_} cm² og grunnlinje ${g} cm. Hvor stor er høyden?`,a:`${h} cm`,v:'h'+h}; } return {q:`En trekant har grunnlinje ${g} cm og høyde ${h} cm. Hva er arealet?`,a:`${nf(A_)} cm²`,v:A_}; }});

add('stafett',{id:'sirkelstafett',ch:'9k2',topic:'sirkel-areal',where:'Kapittel 2 · Arealet av en sirkel',seed:912,title:'Sirkelstafett',n:12,
  short:'Lagstafett med areal og omkrets av sirkler.',intro:'Areal og omkrets av sirkler. Bruk π ≈ 3,14.',tips:'A = π · r · r og O = 2 · π · r. Pass på om oppgaven gir radius eller diameter.',
  gen:(R,i)=>{ const r=ri(R,2,15), t=i%3; if(t===0) return {q:`En sirkel har radius ${r} cm. Hva er arealet? Bruk π ≈ 3,14 og svar med én desimal.`,a:`${d1(PI*r*r)} cm²`,v:'A'+r};
    if(t===1) return {q:`En sirkel har diameter ${2*r} cm. Hva er arealet? Bruk π ≈ 3,14.`,a:`${d1(PI*r*r)} cm²`,v:'B'+r};
    return {q:`Et rundt bord har radius ${r*10} cm. Hva er omkretsen? Bruk π ≈ 3,14.`,a:`${d1(2*PI*r*10)} cm`,v:'O'+r}; }});

{ const trip=[[3,4],[6,8],[5,12],[8,15],[9,12],[12,16],[7,24],[20,21],[9,40],[10,24],[16,30],[12,35]];
  add('chain',{id:'hvem-har-hypotenus',ch:'9k2',topic:'hypotenus',where:'Kapittel 2 · Regne ut hypotenusen',seed:913,title:'Jeg har – hvem har? Hypotenus',big:22,qfs:13,
    short:'Regnekjede der hvert svar er en hypotenus.',intro:'Regne ut hypotenusen med Pytagoras-setningen.',tips:'c² = a² + b². Ta kvadratroten til slutt. Svar med én desimal når svaret ikke er helt.',
    gen:(R,i)=>{ if(i<12){ const [a,b]=trip[i]; const c=Math.hypot(a,b); return {q:`kateter ${a} og ${b}?`,a:nf(c),v:c}; } const a=ri(R,2,12),b=ri(R,2,12); const c=Math.hypot(a,b); if(Number.isInteger(c)) return null; return {q:`kateter ${a} og ${b}?`,a:d1(c),v:r1(c)}; }}); }

add('fireRad',{id:'fire-pa-rad-katet',ch:'9k2',topic:'katet',where:'Kapittel 2 · Regne ut en ukjent katet',seed:914,title:'Fire på rad: katet',ffs:15,lfs:12,
  short:'Finn den ukjente kateten og legg brikker på svaret.',intro:'Regne ut en ukjent katet med Pytagoras-setningen.',tips:'b² = c² − a². Hypotenusen er alltid den lengste siden.',
  gen:(R)=>{ const c=ri(R,5,20), a=ri(R,2,c-1); const b=Math.sqrt(c*c-a*a); return {q:`Hypotenusen er ${c} cm og den ene kateten ${a} cm. Hvor lang er den andre kateten?`,a:Number.isInteger(b)?`${b} cm`:`${d1(b)} cm`,v:r1(b)}; }});

add('memory',{id:'likebeint-memory',ch:'9k2',topic:'likebeint-rett',where:'Kapittel 2 · Rettvinklet, likebeint trekant',seed:915,title:'Likebeint og rettvinklet',cfs:13,
  short:'Memory med kateter og hypotenuser i likebeinte, rettvinklede trekanter.',intro:'I en likebeint, rettvinklet trekant er hypotenusen katet · √2 ≈ katet · 1,41.',tips:'Hypotenus = katet · √2. Katet = hypotenus : √2.',
  gen:(R,i)=>{ if(i%2===0){ const k=ri(R,2,20); return {q:`Kateter ${k} cm.<br><span style="font-weight:400;font-size:11pt">Hypotenus?</span>`,a:`${d1(k*Math.SQRT2)} cm`,v:'h'+r1(k*Math.SQRT2)}; } const h=ri(R,4,30); return {q:`Hypotenus ${h} cm.<br><span style="font-weight:400;font-size:11pt">Katet?</span>`,a:`${d1(h/Math.SQRT2)} cm`,v:'k'+r1(h/Math.SQRT2)}; }});

add('domino',{id:'trekant-30-60-domino',ch:'9k2',topic:'trekant-30-60',where:'Kapittel 2 · Trekant med vinkler 30°, 60° og 90°',seed:916,title:'30-60-90-domino',dfs:11,
  short:'Domino med sidene i trekanter med vinklene 30°, 60° og 90°.',intro:'Den korteste kateten er halvparten av hypotenusen.',tips:'Kort katet = hypotenus : 2. Lang katet = kort katet · √3 ≈ kort katet · 1,73.',
  gen:(R,i)=>{ const t=i%3; if(t===0){ const h=2*ri(R,2,20); return {q:`Hypotenus ${h} cm. Korteste katet?`,a:`${h/2} cm`,v:'k'+h/2}; } if(t===1){ const k=ri(R,2,20); return {q:`Korteste katet ${k} cm. Hypotenus?`,a:`${2*k} cm`,v:'h'+2*k}; } const k=ri(R,2,15); return {q:`Korteste katet ${k} cm. Lengste katet?`,a:`${d1(k*Math.sqrt(3))} cm`,v:'l'+r1(k*Math.sqrt(3))}; }});

add('sorter',{id:'kongruens-sortering',ch:'9k2',topic:'kongruens',where:'Kapittel 2 · Kongruens',seed:917,title:'Kongruente eller ikke?',
  short:'Avgjør om to trekanter må være kongruente ut fra opplysningene.',intro:'Kongruenssetningene SSS, SVS og VSV.',tips:'SSS: tre like sider. SVS: to like sider og vinkelen mellom dem. VSV: to like vinkler og siden mellom dem. Tre like vinkler er ikke nok.',
  cats:[['Kongruente (SSS)',''],['Kongruente (SVS)',''],['Kongruente (VSV)',''],['Ikke sikkert kongruente','']],
  items:[[0,'Begge trekantene har sidene 4 cm, 6 cm og 7 cm.'],[1,'Begge har to sider på 5 cm og 8 cm, og vinkelen mellom dem er 40°.'],[2,'Begge har vinklene 50° og 70°, og siden mellom dem er 6 cm.'],[3,'Begge har vinklene 30°, 60° og 90°.'],[3,'Begge har sidene 5 cm og 7 cm og en vinkel på 30° som ikke ligger mellom dem.'],[0,'Begge er likesidede med sider på 3 cm.'],[2,'Begge har en side på 10 cm med vinklene 45° og 60° i hver ende.'],[1,'Begge er rettvinklede med kateter 3 cm og 4 cm.'],[3,'Begge er likebeinte med en toppvinkel på 40°.'],[3,'Begge har omkrets 12 cm.'],[0,'Begge har sidene 3 cm, 4 cm og 5 cm.'],[1,'Begge har sidene 6 cm og 6 cm med en vinkel på 60° mellom.']],
  keyNote:'Et kort kan oppfylle flere setninger. Godta alle riktige begrunnelser, for eksempel at to like sider og 60° mellom dem også gir SSS.'});

add('loype',{id:'formlikhetsloypa',ch:'9k2',topic:'formlik-sider',where:'Kapittel 2 · Utregning av sider',seed:918,title:'Formlikhetsløypa',pfs:14,
  short:'Åtte poster der elevene regner ut sider i formlike figurer.',intro:'Regne ut ukjente sider med forstørrelsesfaktor.',tips:'Finn forholdet mellom to samsvarende sider. Gang eller del den kjente siden med forholdet.',
  gen:(R,i)=>{ const t=i%4, k=pick(R,[1.5,2,2.5,3,4,0.5]); if(t===0){ const a=ri(R,2,9), b=ri(R,3,12); const x=b*k; if(x!==Math.round(x*10)/10) return null; return {q:`To trekanter er formlike. En side på ${a} cm svarer til ${nf(a*k)} cm. Hvor lang blir siden som svarer til ${b} cm?`,a:`${nf(x)} cm`,v:x}; }
    if(t===1){ const s=ri(R,2,6), m=pick(R,[100,200,500]); return {q:`På et kart i målestokk 1 : ${m*100} er avstanden ${s} cm. Hvor langt er det i virkeligheten i meter?`,a:`${nf(s*m)} m`,v:s*m}; }
    if(t===2){ const a=ri(R,4,10), A_=a*a*k*k; return {q:`Et kvadrat med side ${a} cm forstørres med faktor ${nf(k)}. Hva blir arealet av det nye kvadratet?`,a:`${nf(A_)} cm²`,v:A_+.001}; }
    const p=ri(R,1,2)*0.5+1, h=ri(R,1,3)*.8, s=ri(R,3,9)*0.5; const H=r1(h*s/0.5)/1; const x=r1(1.6*s/0.8); return {q:`En pinne på 1,6 m kaster en skygge på 0,8 m. Et tre kaster en skygge på ${nf(s)} m samtidig. Hvor høyt er treet?`,a:`${nf(x)} m`,v:x+.002}; }});

add('ark',{id:'storst-areal-omkrets',ch:'9k2',topic:'utforsking-plan',where:'Kapittel 2 · Utforsking og problemløsning',title:'Samme omkrets, ulikt areal',
  short:'Utforsk rektangler med samme omkrets og finn det med størst areal.',lede:'Et gjerde på 24 m skal lage en rektangulær hage. Hvilke mål gir størst areal? Utforsk med tabell og tegning på rutepapir.',
  pre:key=>`<table class="t mt"><tr><th>Lengde (m)</th>${[1,2,3,4,5,6,7,8,9,10,11].map(l=>`<td>${l}</td>`).join('')}</tr><tr><th>Bredde (m)</th>${[1,2,3,4,5,6,7,8,9,10,11].map(l=>`<td>${key?`<span class="a">${12-l}</span>`:''}</td>`).join('')}</tr><tr><th>Areal (m²)</th>${[1,2,3,4,5,6,7,8,9,10,11].map(l=>`<td>${key?`<span class="a">${l*(12-l)}</span>`:''}</td>`).join('')}</tr></table><h2>Utforsk</h2>`,
  Q:[['Hvilke mål gir størst areal? Hva slags figur er det?','6 m × 6 m gir 36 m². Det er et kvadrat.'],['Hvorfor er bredden alltid 12 − lengden?','Halve omkretsen er 12 m, og lengde + bredde = 12.'],['En sirkel med omkrets 24 m. Hva er arealet? (π ≈ 3,14)','r = 24 : (2 · 3,14) ≈ 3,82 m. A ≈ 3,14 · 3,82² ≈ 45,9 m². Sirkelen gir enda mer areal.'],['Samme spørsmål motsatt: Et rektangel har areal 36 m². Hvilke hele mål gir minst omkrets?','6 m × 6 m gir 24 m. 4 × 9 gir 26 m, 3 × 12 gir 30 m, 1 × 36 gir 74 m.'],['Hvor mange kvadrater av alle størrelser finnes det på et sjakkbrett med 8 × 8 ruter?','1² + 2² + … + 8² = 204 kvadrater.',2]],
  check:()=>{ let s=0; for(let k=1;k<=8;k++) s+=k*k; assert(s===204,'204'); assert(Math.abs(3.14*(24/6.28)**2-45.86)<.05,'sirkel'); }});

/* ===== Romgeometri ===== */
add('stafett',{id:'overflatestafett',ch:'9k3',topic:'prisme-overflate',where:'Kapittel 3 · Overflaten av rektangulære prismer',seed:920,title:'Overflatestafett',n:12,
  short:'Lagstafett med overflaten til esker og rektangulære prismer.',intro:'Overflaten av rektangulære prismer.',tips:'O = 2 · (l · b + l · h + b · h). Tegn gjerne utbrettingen.',
  gen:(R,i)=>{ const l=ri(R,2,12),b=ri(R,2,9),h=ri(R,2,10); const O=2*(l*b+l*h+b*h); if(i%3===2){ const O2=l*b+2*l*h+2*b*h; return {q:`En eske uten lokk er ${l} cm lang, ${b} cm bred og ${h} cm høy. Hvor mye papp trengs?`,a:`${O2} cm²`,v:'u'+O2}; } return {q:`Et prisme er ${l} cm langt, ${b} cm bredt og ${h} cm høyt. Hva er overflaten?`,a:`${O} cm²`,v:O}; }});

add('bingo',{id:'kvadratisk-prisme-bingo',ch:'9k3',topic:'kvadratisk-prisme',where:'Kapittel 3 · Kvadratiske prismer',seed:921,title:'Bingo: kvadratiske prismer',bt:'Prismebingo',short:'Bingo med volum og overflate av prismer med kvadratisk grunnflate.',afs:15,
  intro:'Volum og overflate av prismer med kvadratisk grunnflate.',tips:'Grunnflaten er s · s. Volum = s · s · h. Overflate = 2 · s · s + 4 · s · h.',
  gen:(R,i)=>{ const s=ri(R,2,8),h=ri(R,2,12); if(i%2) return {q:`Kvadratisk prisme: side ${s} cm, høyde ${h} cm. Volum?`,a:`${s*s*h} cm³`,v:'V'+s*s*h}; return {q:`Kvadratisk prisme: side ${s} cm, høyde ${h} cm. Overflate?`,a:`${2*s*s+4*s*h} cm²`,v:'O'+(2*s*s+4*s*h)}; }});

add('memory',{id:'trekantprisme-memory',ch:'9k3',topic:'andre-prismer',where:'Kapittel 3 · Andre prismer',seed:922,title:'Prismememory',cfs:12,
  short:'Memory med volumet av trekantprismer og andre prismer.',intro:'Volum av prismer: grunnflate ganger høyde.',tips:'V = G · h. For et trekantprisme er G = g · h<sub>trekant</sub> : 2.',
  gen:(R,i)=>{ if(i%2===0){ const g=ri(R,2,10),ht=ri(R,2,8),L=ri(R,3,15); const V=g*ht/2*L; return {q:`<span style="font-weight:400;font-size:10pt">Trekantprisme</span><br>trekant: g = ${g}, h = ${ht}<br>lengde ${L} cm`,a:`${nf(V)} cm³`,v:V}; } const G_=ri(R,5,40),h=ri(R,2,12); return {q:`<span style="font-weight:400;font-size:10pt">Prisme</span><br>grunnflate ${G_} cm²<br>høyde ${h} cm`,a:`${G_*h} cm³`,v:G_*h}; }});

add('loype',{id:'sylinderloypa',ch:'9k3',topic:'sylinder-overflate',where:'Kapittel 3 · Areal av overflaten til en sylinder',seed:923,title:'Sylinderløypa',pfs:14,
  short:'Åtte poster med overflaten av sylindre. Bruk π ≈ 3,14.',intro:'Overflaten av sylindre: to sirkler og et rektangel.',tips:'O = 2 · π · r² + 2 · π · r · h. Bruk π ≈ 3,14 og svar med én desimal.',
  gen:(R,i)=>{ const r=ri(R,2,10),h=ri(R,3,20); const t=i%3; if(t===0){ const O=2*PI*r*r+2*PI*r*h; return {q:`En sylinder har radius ${r} cm og høyde ${h} cm. Hva er overflaten?`,a:`${d1(O)} cm²`,v:r1(O)}; } if(t===1){ const O=2*PI*r*h; return {q:`En boks har radius ${r} cm og høyde ${h} cm. Hvor stor er etiketten rundt (bare sideflaten)?`,a:`${d1(O)} cm²`,v:r1(O)+.01}; } const O=PI*r*r+2*PI*r*h; return {q:`Et glass uten lokk har radius ${r} cm og høyde ${h} cm. Hva er arealet av glasset utvendig?`,a:`${d1(O)} cm²`,v:r1(O)+.02}; }});

add('fireRad',{id:'fire-pa-rad-kjegle',ch:'9k3',topic:'kjegle-volum',where:'Kapittel 3 · Volum av en kjegle',seed:924,title:'Fire på rad: kjegler',ffs:13,lfs:11.5,
  short:'Regn ut volumet av kjegler og legg brikker på svaret.',intro:'Volum av kjegle: π · r² · h : 3. Svar i hele cm³.',tips:'Bruk π ≈ 3,14 og rund av til hele cm³. En kjegle er en tredjedel av en sylinder med samme mål.',
  gen:(R)=>{ const r=ri(R,1,9),h=ri(R,3,18); const V=Math.round(PI*r*r*h/3); return {q:`Kjegle: r = ${r} cm, h = ${h} cm`,a:`${V} cm³`,v:V}; }});

add('stafett',{id:'kulestafett',ch:'9k3',topic:'kule',where:'Kapittel 3 · Volum og overflate av en kule',seed:925,title:'Kulestafett',n:12,
  short:'Lagstafett med volum og overflate av kuler.',intro:'Volum og overflate av kuler. Bruk π ≈ 3,14.',tips:'V = 4 · π · r³ : 3 og O = 4 · π · r². Svar i hele tall.',
  gen:(R,i)=>{ const r=ri(R,1,12); if(i%2===0){ const V=Math.round(4*PI*r**3/3); return {q:`En kule har radius ${r} cm. Hva er volumet? Rund av til hele cm³.`,a:`${V} cm³`,v:'V'+V}; } const O=Math.round(4*PI*r*r); return {q:`En ball har diameter ${2*r} cm. Hvor stor er overflaten? Rund av til hele cm².`,a:`${O} cm²`,v:'O'+O}; }});

add('ark',{id:'fermi-rom',ch:'9k3',topic:'utforsking-rom',where:'Kapittel 3 · Utforsking og problemløsning',title:'Hvor mange får plass?',
  short:'Overslagsoppgaver (Fermi-oppgaver) om volum: baller, vann og luft.',lede:'Store spørsmål uten nøyaktige tall. Gjør fornuftige antakelser, skriv dem ned og regn ut et overslag. Sammenlign med andre grupper.',
  Q:[['Hvor mange fotballer får plass i klasserommet? (Rommet 8 × 7 × 3 m, fotball diameter 22 cm.)','Hver ball tar omtrent en kube på 22 cm: 0,22³ ≈ 0,0106 m³. Rommet er 168 m³. 168 : 0,0106 ≈ 16 000 baller.',2],
    ['Hvor mange liter vann bruker du i dusjen i løpet av et år? (Antakelse: 8 minutter, 10 liter per minutt, hver dag.)','8 · 10 · 365 = 29 200 liter, altså omtrent 29 m³.',2],
    ['Hvor mange sukkerbiter (1 cm³) trengs for å fylle en skoeske på 33 × 20 × 12 cm?','7920 sukkerbiter.',1],
    ['Hvor mange liter luft puster du inn på et døgn? (Antakelse: 0,5 liter per pust, 15 pust per minutt.)','0,5 · 15 · 60 · 24 = 10 800 liter.',2],
    ['Lag ditt eget Fermi-spørsmål om volum, og løs det.','Svarene varierer.',2]],
  check:()=>{ assert(Math.round(168/(.22**3))===15778,'baller'); assert(8*10*365===29200&&33*20*12===7920&&.5*15*60*24===10800,'tall'); }});

/* ===== Sannsynlighet ===== */
{ const ev=[['Få 7 med én vanlig terning',0],['Få et partall med én terning',1/2],['Få 6 med én terning',1/6],['Trekke en rød kule fra en pose med 3 røde og 1 blå',3/4],['Få kron eller mynt når du kaster en mynt',1],['Få sum 12 med to terninger',1/36],['Trekke et hjerter fra en vanlig kortstokk',1/4],['Få et tall mindre enn 7 med én terning',1],['Få minst én sekser når du kaster to terninger',11/36],['Trekke en vokal fra bokstavene i ordet MATTE',2/5],['Få sum 7 med to terninger',1/6],['Trekke et rødt kort fra en vanlig kortstokk',1/2],['At sola står opp i vest i morgen',0],['Få mer enn 2 med én terning',2/3],['Trekke en gul kule fra en pose med bare grønne kuler',0],['Få et oddetall eller et partall med én terning',1]];
  const cat=p=>p===0?0:p<.5?1:p===.5?2:p<1?3:4;
  add('sorter',{id:'sannsynlighetsskala',ch:'9k4',topic:'utfall',where:'Kapittel 4 · Utfall og hendelser',seed:927,title:'Sannsynlighetslinja',
    short:'Plasser hendelser på sannsynlighetslinja fra umulig til sikker.',intro:'Utfall, hendelser og sannsynlighet fra 0 til 1.',tips:'Tell gunstige og mulige utfall. Sannsynligheten er gunstige : mulige.',
    cats:[['Umulig','P = 0'],['Lite sannsynlig','0 < P < 0,5'],['Like sannsynlig som ikke','P = 0,5'],['Sannsynlig','0,5 < P < 1'],['Sikker','P = 1']], items:ev.map(e=>[cat(e[1]),e[0]]),
    keyNote:'Be elevene skrive sannsynligheten som brøk på kortene i midten, for eksempel 1/6 for sum 7 med to terninger.'}); }

add('bingo',{id:'sannsynlighetsbingo',ch:'9k4',topic:'en-hendelse',where:'Kapittel 4 · Sannsynlighet for én hendelse',seed:928,title:'Sannsynlighetsbingo',short:'Bingo med sannsynligheter for kuler, terninger og summen av to terninger.',afs:17,
  intro:'Sannsynlighet for én hendelse med terninger, kuler og kort.',tips:'P = antall gunstige utfall : antall mulige utfall. Forkort brøken.',
  gen:(R,i)=>{ const t=[0,0,0,1,2][ri(R,0,4)]; if(t===0){ const r=ri(R,1,9),b=ri(R,1,9),g=ri(R,0,5); const n=r+b+g; return {q:`En pose har ${r} røde, ${b} blå${g?` og ${g} grønne`:''} kuler. Hva er sannsynligheten for å trekke en blå?`,a:F(b,n),v:b/n}; }
    if(t===1){ const k=ri(R,1,5); return {q:`Hva er sannsynligheten for å få mer enn ${k} med én terning?`,a:F(6-k,6),v:(6-k)/6}; }
    const s=ri(R,2,12); let w=0; for(let a=1;a<=6;a++) for(let b=1;b<=6;b++) if(a+b===s) w++; return {q:`Hva er sannsynligheten for å få sum ${s} med to terninger?`,a:F(w,36),v:w/36}; }});

add('domino',{id:'og-domino',ch:'9k4',topic:'multiplikasjonsprinsippet',where:'Kapittel 4 · Multiplikasjonsprinsippet for sannsynlighet',seed:929,title:'Sannsynlighetsdomino',dfs:11,
  short:'Domino med sannsynligheter for to hendelser som skjer etter hverandre.',intro:'Multiplikasjonsprinsippet: P(A og B) = P(A) · P(B).',tips:'Gang sannsynlighetene for hvert steg. Ved trekk uten tilbakelegging endres antallet i andre trekk.',
  gen:(R,i)=>{ const t=i%3; if(t===0){ const k=ri(R,1,6),m=ri(R,1,6); return {q:`To terningkast: ${k} på første og ${m} på andre?`,a:F(1,36),v:1/36}; }
    if(t===1){ const r=ri(R,2,6),b=ri(R,1,5); const n=r+b; return {q:`${r} røde og ${b} blå kuler. To trekk uten tilbakelegging. Begge røde?`,a:F(r*(r-1),n*(n-1)),v:r*(r-1)/(n*(n-1))}; }
    const p=pick(R,[2,3,4,5,6,10]); const c=ri(R,1,p-1); return {q:`Et lykkehjul har ${p} like felt, ${c} av dem er gevinst. Snurr to ganger. Gevinst begge gangene?`,a:F(c*c,p*p),v:c*c/(p*p)}; }});

add('sorter',{id:'like-sannsynlige',ch:'9k4',topic:'like-sannsynlig',where:'Kapittel 4 · Like sannsynlige utfall',seed:930,title:'Like sannsynlige utfall?',
  short:'Sorter forsøk: er alle utfallene like sannsynlige eller ikke?',intro:'Når kan vi regne sannsynlighet ved å telle utfall?',tips:'Utfallene må være like sannsynlige for at vi kan bruke gunstige : mulige.',
  cats:[['Like sannsynlige utfall',''],['Ikke like sannsynlige','']],
  items:[[0,'Kaste en mynt: kron eller mynt'],[0,'Kaste en vanlig terning: 1, 2, 3, 4, 5 eller 6'],[1,'Summen av to terninger: 2, 3, …, 12'],[1,'Været i morgen: sol, regn eller snø'],[0,'Trekke et kort fra en stokk: spar, hjerter, ruter eller kløver'],[1,'Antall kron når du kaster to mynter: 0, 1 eller 2'],[1,'En tegnestift lander med spissen opp eller ned'],[0,'Et lykkehjul med fire like store felt'],[1,'Et lykkehjul der det ene feltet er halve hjulet'],[1,'Fotballkamp: hjemmeseier, uavgjort eller borteseier'],[0,'Trekke et nummer fra 1 til 30 i en hatt med 30 like lapper'],[1,'Hvilken ukedag det er når du er syk (hverdag eller helg)']],
  keyNote:'To mynter: 0 kron har sannsynlighet 1/4, 1 kron 1/2 og 2 kron 1/4. Hverdag eller helg: 5/7 mot 2/7.'});

add('ark',{id:'klistremerkesimulering',ch:'9k4',topic:'simulering',where:'Kapittel 4 · Utforsking: simulering',title:'Klistremerkejakten',
  short:'Simuler med terning: hvor mange kjøp trengs for å få alle seks klistremerkene?',lede:'En frokostblanding har ett av seks ulike klistremerker i hver pakke. Hvor mange pakker må du kjøpe for å få alle seks? Simuler med en terning: hvert kast er en pakke.',
  pre:key=>`<table class="t mt"><tr><th>Forsøk</th><th>Strekliste (kast til du har fått alle tallene 1–6)</th><th>Antall pakker</th></tr>${[1,2,3,4,5,6].map(i=>`<tr><td>${i}</td><td style="width:110mm"></td><td>${key?'<span class="a">varierer</span>':''}</td></tr>`).join('')}</table><h2>Spørsmål</h2>`,
  Q:[['Hva er gjennomsnittet av forsøkene dine? Hva er gjennomsnittet i hele klassen?','Klassens gjennomsnitt blir som regel nær 14,7.'],['Hvorfor tar det lengst tid å få det siste klistremerket?','Når du mangler bare ett, er sannsynligheten bare 1/6 i hvert kast.'],['Teoretisk forventet antall er 6 · (1 + 1/2 + 1/3 + 1/4 + 1/5 + 1/6). Regn det ut.','6 · 2,45 = 14,7 pakker.'],['Hva skjer hvis det finnes 10 ulike klistremerker? Gjett først, og regn ut med samme formel.','10 · (1 + 1/2 + … + 1/10) ≈ 29,3 pakker.']],
  check:()=>{ let h=0; for(let k=1;k<=6;k++) h+=1/k; assert(Math.abs(6*h-14.7)<.01,'14,7'); let h2=0; for(let k=1;k<=10;k++) h2+=1/k; assert(Math.abs(10*h2-29.29)<.01,'29,3'); }});

module.exports=A;
