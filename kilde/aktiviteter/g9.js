// Klasseaktiviteter 9. trinn
const {C,nf,sg,fr,rng,shuffle,gcd,page,cardPages}=require('./common');
const A=[];
const ft=t=>`Matematikk 9. trinn · ${t}`;
const assert=(c,m)=>{ if(!c) throw new Error(m); };
const PI=Math.PI, r1=x=>Math.round(x*10)/10, r2=x=>Math.round(x*100)/100;
const qList=(Q,key,cls)=>`<ol class="q ${cls||''}">${Q.map(([q,a,lines])=>`<li><span>${q}</span>${key?`<span class="a">${a}</span>`:'<span class="ln"></span>'.repeat(lines||1)}</li>`).join('')}</ol>`;
const QCSS=`ol.q{margin:0;padding-left:6mm;font-size:10.3pt;line-height:1.35}ol.q li{margin-bottom:1.3mm}ol.q li::marker{color:${C.pen};font-weight:700}ol.q .a{display:block}ol.q .ln{height:6.8mm}`;
const sheetPair=(o)=>[false,true].map(key=>page({eye:(key?'Fasit · ':'')+o.eye,title:o.title,key,lede:key?o.keyLede:o.lede,body:o.body(key),foot:[ft(o.title),key?`Side ${o.n+1} · fasit til læreren`:(o.n>1?`Side 1–${o.n} · elevark`:'Side 1 · elevark')]}));
const svgT=(x,y,t,o={})=>`<text x="${x}" y="${y}" font-size="${o.fs||3.4}" text-anchor="${o.a||'middle'}" font-weight="${o.w||700}" fill="${o.c||C.ink}" font-family="Atkinson Hyperlegible">${t}</text>`;

/* ===== Kap 1 Statistikk ===== */
/* 1 Sentralmålgåter */
{ const T='Sentralmålgåter';
  const stats=a=>{ const s=[...a].sort((x,y)=>x-y), n=s.length, mean=s.reduce((p,q)=>p+q,0)/n, med=n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;
    const cnt={}; s.forEach(v=>cnt[v]=(cnt[v]||0)+1); const mx=Math.max(...Object.values(cnt)); const modes=Object.keys(cnt).filter(k=>cnt[k]===mx).map(Number);
    return {mean,med,mode:mx>1&&modes.length===1?modes[0]:null,range:s[n-1]-s[0],distinct:new Set(s).size===n}; };
  const P=[ {n:3,t:'Tre tall. Medianen er 5, gjennomsnittet er 6 og variasjonsbredden er 7.',f:s=>s.med===5&&s.mean===6&&s.range===7},
    {n:4,t:'Fire tall. Typetallet er 3, medianen er 4 og gjennomsnittet er 5.',f:s=>s.mode===3&&s.med===4&&s.mean===5},
    {n:5,t:'Fem tall. Gjennomsnittet er 7, medianen er 5, typetallet er 4 og variasjonsbredden er 8.',f:s=>s.mean===7&&s.med===5&&s.mode===4&&s.range===8},
    {n:5,t:'Fem forskjellige tall. Medianen er 10, gjennomsnittet er 10 og variasjonsbredden er 10.',f:s=>s.distinct&&s.med===10&&s.mean===10&&s.range===10},
    {n:6,t:'Seks tall. Medianen er 7,5, typetallet er 9 og gjennomsnittet er 7.',f:s=>s.med===7.5&&s.mode===9&&s.mean===7},
    {n:5,t:'Fem tall. Gjennomsnittet er 8, men medianen er bare 3.',f:s=>s.mean===8&&s.med===3} ];
  const combos=(n,lo,hi)=>{ const out=[]; const rec=(st,a)=>{ if(a.length===n){ out.push(a.slice()); return; } for(let v=st;v<=hi;v++){ a.push(v); rec(v,a); a.pop(); } }; rec(lo,[]); return out; };
  P.forEach(p=>{ const sols=combos(p.n,1,20).filter(a=>p.f(stats(a))); p.sols=sols; p.ex=sols.length?sols[Math.floor(sols.length/2)]:null; });
  const check=()=>{ P.forEach((p,i)=>assert(p.sols.length>0,'gåte '+(i+1)+' har ingen løsning')); };
  const body=key=>`<div class="box"><b class="t">Husk</b><p><b>Gjennomsnitt:</b> summen delt på antallet. <b>Median:</b> tallet i midten når tallene er sortert. <b>Typetall:</b> tallet som forekommer flest ganger. <b>Variasjonsbredde:</b> største minus minste tall.</p></div>
    <h2>A · Finn tallene</h2><p>Bruk bare hele tall fra 1 til 20. Det kan finnes flere riktige svar.</p>
    <div class="gt">${P.map((p,i)=>`<div class="gi"><b class="n">${i+1}</b><span>${p.t}</span><div class="bx">${key?`<span class="a">${p.ex.map(v=>nf(v)).join(', ')}</span><small>${p.sols.length===1?'Dette er den eneste løsningen':p.sols.length+' løsninger med hele tall fra 1 til 20'}</small>`:Array.from({length:p.n},()=>'<i></i>').join('')}</div></div>`).join('')}</div>
    <h2>B · Lag dine egne</h2>${qList([['Lag fem tall der gjennomsnittet er større enn fire av tallene.','For eksempel 1, 2, 3, 4, 20: gjennomsnittet er 6.'],['Kan gjennomsnittet være større enn det største tallet? Forklar.','Nei. Gjennomsnittet ligger alltid mellom det minste og det største tallet.'],['Lag en sentralmålgåte selv, og la sidemannen løse den.','Kontroller at gåten har minst én løsning.']],key)}`;
  A.push({id:'sentralmalgater', ch:'9k1', title:T, fit:'9. trinn · Kapittel 1 · Data og datasett', link:'#9k1-sentralmal', topics:['datasett','sentralmal'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Finn tallene når du bare vet gjennomsnitt, median, typetall og variasjonsbredde.',
    desc:'Seks gåter der elevene finner et datasett ut fra sentralmål og variasjonsbredde. Gåtene har flere løsninger, så elevene må prøve, justere og forklare. Til slutt lager de egne gåter.',
    inside:['Side 1: elevark med seks gåter og tre åpne oppgaver','Side 2: fasit med én løsning per gåte og antallet mulige løsninger'], check,
    css:QCSS+`.gt{display:grid;grid-template-columns:1fr 1fr;gap:3mm 6mm}.gi{border:1.2px solid ${C.line};border-radius:2mm;padding:2.5mm 3mm;display:flex;flex-direction:column;gap:2mm;font-size:10.3pt}.gi .n{color:${C.pen};font-size:13pt}.bx{display:flex;gap:2mm;flex-wrap:wrap;min-height:11mm;align-items:center}.bx i{width:11mm;height:10mm;border:1.4px solid ${C.ink};border-radius:1.5mm}.bx small{display:block;width:100%;color:${C.muted};font-size:8.5pt}.bx .a{font-size:13pt}`,
    pages:sheetPair({eye:'Utforsk · 9. trinn · Kapittel 1 · Data og datasett',title:T,n:1,lede:'Hvert tallsett er hemmelig, men du får vite noen sentralmål. Klarer du å finne tallene?',keyLede:'Ett mulig svar til hver gåte. Godta alle svar som oppfyller kravene.',body})});
}

/* 2 Diagramverkstedet */
{ const T='Diagramverkstedet';
  const TEMP=[-2,-1,2,6,11,14,16,16,12,7,3,0], MND=['jan','feb','mar','apr','mai','jun','jul','aug','sep','okt','nov','des'];
  const SP=[['Fotball',9],['Håndball',6],['Svømming',3],['Ski',5],['Annet',2]];
  const RE=[['Går',12],['Sykler',9],['Buss',6],['Bil',3]], NR=RE.reduce((s,x)=>s+x[1],0);
  const check=()=>{ assert(NR===30,'30'); assert(RE.reduce((s,x)=>s+x[1]*360/NR,0)===360,'360'); };
  const lineGrid=(fill)=>{ const W=170,H=62,X=i=>14+i*(W-20)/11,Y=v=>H-8-(v+4)*(H-14)/24; let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm">`;
    for(let v=-4;v<=20;v+=2) s+=`<line x1="12" x2="${W-4}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v===0?C.ink:'#C3CBDB'}" stroke-width="${v===0?.5:.25}"/>`+svgT(10,Y(v)+1,nf(v),{fs:2.6,a:'end',w:400});
    MND.forEach((m,i)=>s+=`<line x1="${X(i)}" x2="${X(i)}" y1="${Y(-4)}" y2="${Y(20)}" stroke="#E1E6F0" stroke-width=".25"/>`+svgT(X(i),H-2,m,{fs:2.6,w:400}));
    s+=svgT(3,4,'°C',{fs:3,a:'start'});
    if(fill) s+=`<polyline points="${TEMP.map((v,i)=>X(i)+','+Y(v)).join(' ')}" fill="none" stroke="${C.red}" stroke-width=".8"/>`+TEMP.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r=".9" fill="${C.red}"/>`).join('');
    return s+'</svg>'; };
  const barGrid=(fill)=>{ const W=110,H=60,Y=v=>H-9-v*(H-14)/10; let s=`<svg viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm">`;
    for(let v=0;v<=10;v++) s+=`<line x1="10" x2="${W-2}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v===0?C.ink:'#C3CBDB'}" stroke-width="${v===0?.5:.25}"/>`+svgT(8,Y(v)+1,v,{fs:2.6,a:'end',w:400});
    SP.forEach(([n,v],i)=>{ const x=14+i*19; if(fill) s+=`<rect x="${x}" y="${Y(v)}" width="13" height="${Y(0)-Y(v)}" fill="${C.pen}"/>`; s+=svgT(x+6.5,H-4,n,{fs:2.5,w:400}); });
    return s+'</svg>'; };
  const pie=(fill)=>{ const R=30, cx=36, cy=34; let s=`<svg viewBox="0 0 ${fill?120:72} 70" width="${fill?103:72}mm" height="${fill?60:70}mm"><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.ink}" stroke-width=".5"/>`;
    for(let d=0;d<360;d+=10){ const a=(d-90)*PI/180; s+=`<line x1="${cx+Math.cos(a)*(R-(d%30?1.5:3))}" y1="${cy+Math.sin(a)*(R-(d%30?1.5:3))}" x2="${cx+Math.cos(a)*R}" y2="${cy+Math.sin(a)*R}" stroke="${C.ink}" stroke-width=".3"/>`; }
    s+=`<circle cx="${cx}" cy="${cy}" r=".8" fill="${C.ink}"/>`;
    if(fill){ let a0=-90; const cols=[C.pen,C.red,C.ok,C.orange]; RE.forEach(([n,v],i)=>{ const d=v*360/NR, a1=a0+d, p=a=>[cx+Math.cos(a*PI/180)*R,cy+Math.sin(a*PI/180)*R]; const [x0,y0]=p(a0),[x1,y1]=p(a1);
      s+=`<path d="M${cx} ${cy} L${x0} ${y0} A${R} ${R} 0 ${d>180?1:0} 1 ${x1} ${y1} Z" fill="${cols[i]}" fill-opacity=".75" stroke="#fff" stroke-width=".4"/>`; s+=`<rect x="78" y="${14+i*9}" width="5" height="5" fill="${cols[i]}"/>`+svgT(85,18+i*9,`${n}: ${d}°`,{fs:3.4,a:'start',w:400}); a0=a1; }); }
    return s+'</svg>'; };
  const tbl=(rows,h)=>`<table class="t"><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</table>`;
  const p1=page({eye:'Klasseaktivitet · 9. trinn · Kapittel 1 · Lage ulike diagram',title:T,lede:'Tre datasett, tre diagramtyper. Lag hvert diagram, og forklar hvorfor akkurat den diagramtypen passer. Passer godt som stasjonsarbeid i par.',
    body:`<h2>A · Linjediagram: Temperatur gjennom året</h2><p>Gjennomsnittstemperaturen hver måned i en norsk by. Tegn et linjediagram.</p>${tbl([TEMP.map(v=>nf(v))],MND)}<div style="margin-top:2mm">${lineGrid(false)}</div>
    <h2>B · Stolpediagram: Favorittidrett i 9A</h2><div class="row2">${tbl(SP.map(x=>[x[0],x[1]]),['Idrett','Antall'])}${barGrid(false)}</div>`,foot:[ft(T),'Side 1 · elevark']});
  const p2=page({eye:'Klasseaktivitet · 9. trinn · Kapittel 1 · Lage ulike diagram',title:T,small:'fortsettelse',
    body:`<h2>C · Sektordiagram: Slik kommer elevene til skolen</h2><p>${NR} elever svarte. Regn ut hvor mange grader hver sektor skal ha, og tegn sektordiagrammet. Sirkelen har en strek for hver 10. grad.</p>
    <div class="row2">${tbl(RE.map(x=>[x[0],x[1],'',''] ),['Svar','Antall','Andel','Grader'])}${pie(false)}</div>
    <h2>D · Tenk etter</h2>${qList([['Hvorfor passer et linjediagram til temperaturene, men ikke til favorittidrett?','',1],['Kunne du brukt et sektordiagram for favorittidrett? Hva ville det vist?','',1],['Hvilken måned øker temperaturen mest fra måneden før?','',1],['Hvor mange prosent av elevene går eller sykler til skolen?','',1]],false)}`,foot:[ft(T),'Side 2 · elevark']});
  const p3=page({eye:'Fasit · Klasseaktivitet · 9. trinn · Kapittel 1',title:T,key:true,
    body:`<h2>A · Linjediagram</h2>${lineGrid(true)}<div class="row2"><div><h2>B · Stolpediagram</h2>${barGrid(true)}</div><div><h2>C · Grader</h2>${tbl(RE.map(x=>[x[0],x[1],`${fr(x[1],NR)} = ${nf(r1(x[1]*100/NR))} %`,`${x[1]*360/NR}°`]),['Svar','Antall','Andel','Grader'])}</div></div>${pie(true)}
    ${qList([['Linjediagram','Temperaturen endrer seg over tid, og linjen viser utviklingen. Idrettene har ingen rekkefølge, så en linje mellom dem gir ingen mening.'],['Sektordiagram','Ja. Det ville vist hvor stor del av klassen som liker hver idrett, for eksempel fotball 36 %.'],['Størst økning','Fra april til mai: 6 °C til 11 °C, en økning på 5 grader.'],['Går eller sykler','21 av 30 elever, altså 70 %.']],true)}`,foot:[ft(T),'Side 3 · fasit til læreren']});
  A.push({id:'diagramverkstedet', ch:'9k1', title:T, fit:'9. trinn · Kapittel 1 · Lage ulike diagram', link:'#9k1-linjediagram', topics:['linjediagram','stolpediagram','sektordiagram'], thumbs:['Side 1 · elevark','Side 2 · elevark'],
    short:'Lag linjediagram, stolpediagram og sektordiagram av tre datasett.',
    desc:'Elevene lager et linjediagram, et stolpediagram og et sektordiagram fra tre datasett, med ferdige rutenett og en gradert sirkel. Til slutt diskuterer de hvilken diagramtype som passer best og hvorfor.',
    inside:['Side 1–2: elevark med data, rutenett, gradert sirkel og spørsmål','Side 3: fasit med ferdige diagram, grader og svar'], check,
    css:QCSS+`.row2{display:flex;gap:6mm;align-items:flex-start;justify-content:space-between}table.t{font-size:9.5pt}table.t td{white-space:nowrap}`,
    pages:[p1,p2,p3]});
}

/* 3 Misvisende diagrammer */
{ const T='Misvisende diagrammer';
  const W=78,H=58;
  const frame=(inner,title)=>`<div class="dg"><b>${title}</b><svg viewBox="0 0 ${W} ${H}" width="${W}mm" height="${H}mm">${inner}</svg></div>`;
  const ax=(x0,y0,x1,y1)=>`<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y0}" stroke="${C.ink}" stroke-width=".5"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="${C.ink}" stroke-width=".5"/>`;
  const D=[];
  { // 1: y-akse starter på 40
    const v=[42,45,48], Y=x=>50-(x-40)*40/10; let s=ax(12,50,74,8); [40,42,44,46,48,50].forEach(t=>s+=svgT(10,Y(t)+1,t,{fs:2.8,a:'end',w:400})+`<line x1="12" x2="74" y1="${Y(t)}" y2="${Y(t)}" stroke="#E1E6F0" stroke-width=".25"/>`);
    ['Parti A','Parti B','Parti C'].forEach((n,i)=>{ s+=`<rect x="${18+i*19}" y="${Y(v[i])}" width="12" height="${50-Y(v[i])}" fill="${C.pen}"/>`+svgT(24+i*19,55,n,{fs:2.8,w:400}); });
    D.push([frame(s,'Oppslutning (%)'),'y-aksen starter på 40 i stedet for 0. Da ser forskjellen mellom 42 % og 48 % mye større ut enn den er. Parti C ser fire ganger så stort ut som parti A.']); }
  { // 2: sektordiagram over 100 %
    const parts=[['Sosiale medier',45],['Spill',35],['Lekser',25],['Trening',15]], cols=[C.pen,C.red,C.ok,C.orange]; let s='', a0=-90; const cx=24,cy=30,R=20;
    parts.forEach(([n,p],i)=>{ const d=p*3.6/1.2, a1=a0+d, P=a=>[cx+Math.cos(a*PI/180)*R,cy+Math.sin(a*PI/180)*R]; const [x0,y0]=P(a0),[x1,y1]=P(a1); s+=`<path d="M${cx} ${cy} L${x0} ${y0} A${R} ${R} 0 ${d>180?1:0} 1 ${x1} ${y1} Z" fill="${cols[i]}" fill-opacity=".8" stroke="#fff" stroke-width=".4"/>`; s+=`<rect x="48" y="${14+i*8}" width="4" height="4" fill="${cols[i]}"/>`+svgT(54,17.4+i*8,`${n} ${p} %`,{fs:2.8,a:'start',w:400}); a0=a1; });
    D.push([frame(s,'Hva bruker elevene tid på?'),'Prosentene blir til sammen 120 %. Et sektordiagram må alltid vise 100 %. Her kunne elevene velge flere svar, og da passer ikke sektordiagram.']); }
  { // 3: ujevne år
    const yrs=['2000','2010','2020','2022','2024'], v=[10,14,18,26,34], X=i=>14+i*14, Y=x=>50-x*1.15; let s=ax(12,50,74,6); [0,10,20,30,40].forEach(t=>s+=svgT(10,Y(t)+1,t,{fs:2.8,a:'end',w:400}));
    s+=`<polyline points="${v.map((x,i)=>X(i)+','+Y(x)).join(' ')}" fill="none" stroke="${C.red}" stroke-width=".9"/>`+v.map((x,i)=>`<circle cx="${X(i)}" cy="${Y(x)}" r="1" fill="${C.red}"/>`+svgT(X(i),55,yrs[i],{fs:2.6,w:400})).join('');
    D.push([frame(s,'Antall elbiler (tusen)'),'Avstanden mellom årene er ulik: først 10 år, så 2 år. Når punktene står like langt fra hverandre, ser det ut som veksten har skutt fart mye mer enn den har.']); }
  { // 4: bilde skalert i to retninger
    let s=`<rect x="12" y="34" width="12" height="12" fill="${C.ok}" rx="1"/><rect x="36" y="22" width="24" height="24" fill="${C.ok}" rx="1.5"/>`+svgT(18,52,'2015: 1 mill.',{fs:2.7,w:400})+svgT(48,52,'2025: 2 mill.',{fs:2.7,w:400})+`<line x1="6" x2="72" y1="46" y2="46" stroke="${C.ink}" stroke-width=".5"/>`;
    D.push([frame(s,'Solgte sekker med jord'),'Antallet er doblet, men figuren er gjort dobbelt så bred og dobbelt så høy. Da blir arealet fire ganger så stort, og økningen ser mye større ut enn den er.']); }
  { // 5: ingen tall på aksen
    let s=ax(12,50,74,6); const v=[30,22,36,28]; ['Mandag','Tirsdag','Onsdag','Torsdag'].forEach((n,i)=>{ s+=`<rect x="${16+i*14}" y="${50-v[i]}" width="9" height="${v[i]}" fill="${C.orange}"/>`+svgT(20.5+i*14,55,n,{fs:2.6,w:400}); });
    D.push([frame(s,'Salg i kantina'),'y-aksen har verken tall eller enhet. Vi vet ikke om det er kroner, antall varer eller antall elever, og vi kan ikke lese av hvor store forskjellene er.']); }
  { // 6: to diagram med ulik skala
    let s=''; const g=(ox,max,val,lab,col)=>{ let t=`<line x1="${ox}" y1="50" x2="${ox+28}" y2="50" stroke="${C.ink}" stroke-width=".5"/><line x1="${ox}" y1="50" x2="${ox}" y2="10" stroke="${C.ink}" stroke-width=".5"/>`; [0,max/2,max].forEach(k=>t+=svgT(ox-1.5,50-k*38/max+1,k,{fs:2.6,a:'end',w:400})); t+=`<rect x="${ox+8}" y="${50-val*38/max}" width="12" height="${val*38/max}" fill="${col}"/>`+svgT(ox+14,55,lab,{fs:2.8,w:400}); return t; };
    s+=g(12,20,16,'9A',C.pen)+g(50,100,40,'9B',C.red);
    D.push([frame(s,'Antall bøker lest i år'),'De to diagrammene har ulik skala (0–20 og 0–100). 9B har lest 40 bøker og 9A bare 16, men stolpen til 9A ser høyest ut.']); }
  const cards=D.map((d,i)=>`<span class="tag">Diagram</span><span class="nr gl">${i+1}</span>${d[0]}`);
  const p1=page({eye:'Klasseaktivitet · 9. trinn · Kapittel 1 · Lese og tolke diagram',title:T,lede:'Diagrammer kan lure oss, med vilje eller ved et uhell. I grupper på 3–4 skal elevene finne ut hva som er misvisende ved seks diagram, og hvordan de burde vært tegnet. Varighet: 25 minutter.',
    body:`<h2>Slik gjør dere</h2><ol class="st"><li>Skriv ut side 2–3 (diagramkortene) til hver gruppe, og side 4 (svarark) til hver elev.</li><li>Gruppen ser på ett kort om gangen og diskuterer: Hva ser diagrammet ut til å vise? Hva er misvisende? Hva er det riktige?</li><li>Elevene skriver svarene på svararket og tegner en bedre versjon av minst to av diagrammene.</li><li>Avslutt med en felles samtale: Hvem kan ha nytte av å lage diagram som lurer?</li></ol>
    <div class="box red"><b class="t">Sjekkliste for gode diagram</b><ul class="st"><li>Starter y-aksen på 0 (for stolpediagram)?</li><li>Har aksene tall, enhet og tittel?</li><li>Er avstanden mellom verdiene på x-aksen jevn?</li><li>Blir sektordiagrammet til sammen 100 %?</li><li>Brukes samme skala når vi sammenligner?</li></ul></div>
    <div class="box"><b class="t">Til læreren: fasit</b><ol class="kj">${D.map(d=>`<li>${d[1]}</li>`).join('')}</ol></div>`,foot:[ft(T),'Side 1 · instruksjoner og fasit']});
  const p4=page({eye:'Klasseaktivitet · Misvisende diagrammer',title:T,small:'svarark',body:`${[1,2,3,4,5,6].map(i=>`<div class="sv"><b>Diagram ${i}</b><span>Hva er misvisende?</span><span class="ln"></span><span class="ln"></span></div>`).join('')}<h2>Tegn et bedre diagram</h2><div class="dr"><div></div><div></div></div>`,foot:[ft(T),'Side 4 · svarark']});
  A.push({id:'misvisende-diagrammer', ch:'9k1', title:T, fit:'9. trinn · Kapittel 1 · Lese og tolke diagram', link:'#9k1-tolke-diagram', topics:['tolke-diagram'],
    short:'Finn ut hvordan seks diagram lurer leseren, og tegn dem riktig.',
    desc:'Gruppene undersøker seks diagram som er misvisende på ulike måter: y-aksen starter ikke på 0, sektordiagrammet blir 120 %, ujevne år på x-aksen, figurer som vokser i to retninger, aksen mangler tall, og to diagram med ulik skala.',
    inside:['Side 1: instruksjoner, sjekkliste og fasit','Side 2–3: seks diagramkort','Side 4: svarark med plass til å tegne'],
    css:`.dg b{display:block;font-size:11pt;margin-bottom:1mm}.gl{font:800 14pt "Bricolage Grotesque"!important;color:${C.pen}!important}ol.kj{margin:0;padding-left:6mm;font-size:9.6pt;line-height:1.4}ol.kj li{margin-bottom:1mm}
      .sv{display:grid;grid-template-columns:24mm 1fr;column-gap:3mm;align-items:end;margin-bottom:1.5mm;font-size:10pt}.sv b{color:${C.pen};grid-row:span 3;align-self:start;padding-top:1mm}.sv span:first-of-type{color:${C.muted};font-size:9pt}.sv .ln{height:6.5mm}
      .dr{display:grid;grid-template-columns:1fr 1fr;gap:5mm}.dr div{height:52mm;border:1.2px solid ${C.line};background:repeating-linear-gradient(0deg,transparent 0 4.9mm,#E5EAF2 4.9mm 5mm),repeating-linear-gradient(90deg,transparent 0 4.9mm,#E5EAF2 4.9mm 5mm)}`,
    pages:[p1,...cardPages({cards,cols:2,rows:2,eye:'Klasseaktivitet · Misvisende diagrammer',title:T,foot:ft(T),start:2,label:'diagramkort'}),p4]});
}

/* ===== Kap 2 Plangeometri ===== */
/* 4 Figurtall */
{ const T='Figurtall';
  const tri=n=>n*(n+1)/2, sq=n=>n*n, rect=n=>n*(n+1);
  const dots=(kind,n)=>{ const g=3.4; let s='', w=0, h=0; for(let r=0;r<n;r++){ const m=kind==='t'?r+1:kind==='k'?n:n+1; for(let c=0;c<m;c++){ s+=`<circle cx="${2+c*g}" cy="${2+r*g}" r="1.15" fill="${kind==='t'?C.pen:kind==='k'?C.red:C.ok}"/>`; w=Math.max(w,4+c*g); } h=4+r*g; } return {s,w,h}; };
  const row=(kind)=>{ let x=0,parts='',H=0; for(let n=1;n<=4;n++){ const d=dots(kind,n); H=Math.max(H,d.h); parts+=`<g transform="translate(${x},0)">${d.s}</g>`; x+=d.w+9; } return `<svg viewBox="0 -1 ${x} ${H+2}" height="${(H+2)*1.6}mm">${parts}</svg>`; };
  const NS=[1,2,3,4,5,6,10,20];
  const F=[['t','Trekanttall',tri,'n(n + 1) : 2'],['k','Kvadrattall',sq,'n · n = n²'],['r','Rektangeltall',rect,'n(n + 1)']];
  const check=()=>{ for(let n=1;n<=50;n++){ assert(rect(n)===2*tri(n),'2T'); let s=0; for(let k=1;k<=n;k++) s+=2*k-1; assert(s===sq(n),'odd'); } assert(tri(100)===5050,'5050'); assert(!Array.from({length:30},(_,i)=>tri(i+1)).includes(100)&&tri(13)===91&&tri(14)===105,'100'); };
  const body=key=>`${F.map(([k,nm,f,form])=>`<div class="ft"><b>${nm}</b>${row(k)}<table class="t"><tr><th>Figur</th>${NS.map(n=>`<td>${n}</td>`).join('')}<th>n</th></tr><tr><th>Prikker</th>${NS.map(n=>`<td>${key||n<=3?(n<=3&&!key?f(n):`<span class="a">${f(n)}</span>`):''}</td>`).join('')}<td>${key?`<span class="a">${form}</span>`:''}</td></tr></table></div>`).join('')}
    <h2>Utforsk</h2>${qList([['Sammenlign rektangeltallene med trekanttallene. Hva ser du? Forklar med figurene.','Rektangeltallet er det dobbelte av trekanttallet. To like trekanter kan settes sammen til et rektangel med n rader og n + 1 kolonner.'],
      ['Regn ut 1 + 3, 1 + 3 + 5 og 1 + 3 + 5 + 7. Hva blir summen av de 10 første oddetallene?','4, 9, 16. Summen av de n første oddetallene er n². De 10 første gir 100.'],
      ['Er 100 et trekanttall? Hvilke trekanttall ligger nærmest?','Nei. Trekanttall 13 er 91, og trekanttall 14 er 105.'],
      ['Regn ut 1 + 2 + 3 + … + 100 uten å legge sammen alle tallene.','Det er trekanttall 100: 100 · 101 : 2 = 5050.']],key)}`;
  A.push({id:'figurtall', ch:'9k2', title:T, fit:'9. trinn · Kapittel 2 · Geometriske mønstre', link:'#9k2-geo-monster', topics:['geo-monster','monster-alg'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Trekanttall, kvadrattall og rektangeltall: finn mønstrene og formlene.',
    desc:'Elevene utforsker prikkmønstre for trekanttall, kvadrattall og rektangeltall, fyller ut tabeller og finner formler. Så oppdager de sammenhenger, som at summen av de første oddetallene alltid er et kvadrattall.',
    inside:['Side 1: elevark med tre prikkmønstre, tabeller og fire utforskende spørsmål','Side 2: fasit'], check,
    css:QCSS+`.ft{margin-bottom:2mm}.ft b{display:block;font-size:11.5pt;color:${C.pen};margin-bottom:1mm}.ft table{width:100%;margin-top:1.5mm}.ft td{height:7.5mm;width:8%}.ft td:last-child{width:18%;white-space:nowrap}`,
    pages:sheetPair({eye:'Utforsk · 9. trinn · Kapittel 2 · Geometriske mønstre',title:T,n:1,lede:'Tall som kan legges som prikker i en figur, kalles figurtall. Tegn neste figur, fyll ut tabellene og finn en formel for figur n.',keyLede:'Tabellene utfylt, formlene og svarene.',body})});
}

/* 5 Mangekant-kvartett */
{ const T='Mangekant-kvartett';
  const NM={3:'Trekant',4:'Firkant',5:'Femkant',6:'Sekskant',7:'Sjukant',8:'Åttekant',9:'Nikant',10:'Tikant'};
  const COL={3:C.pen,4:C.red,5:C.ok,6:C.orange,7:'#7A3FB0',8:'#0E7C86',9:'#B0306A',10:'#5A6B12'};
  const poly=(n,col,diag)=>{ const R=17,cx=20,cy=20; const P=Array.from({length:n},(_,i)=>{ const a=-PI/2+i*2*PI/n+(n%2?0:PI/n); return [cx+R*Math.cos(a),cy+R*Math.sin(a)]; });
    let s=`<svg viewBox="0 0 40 40" width="30mm" height="30mm"><polygon points="${P.map(p=>p.map(v=>v.toFixed(2)).join(',')).join(' ')}" fill="${col}" fill-opacity=".14" stroke="${col}" stroke-width=".9"/>`;
    if(diag) for(let i=2;i<n-1;i++) s+=`<line x1="${P[0][0]}" y1="${P[0][1]}" x2="${P[i][0]}" y2="${P[i][1]}" stroke="${col}" stroke-width=".5" stroke-dasharray="1.2 .8"/>`;
    return s+'</svg>'; };
  const ang=n=>(n-2)*180/n, angS=n=>{ const v=ang(n); return Number.isInteger(v)?`${v}°`:`≈ ${nf(r1(v))}°`; };
  const cards=[]; for(let n=3;n<=10;n++){ const col=COL[n];
    const head=k=>`<span class="tag" style="color:${col}">${NM[n]}</span><span class="nr" style="color:${col}">${k}/4</span>`;
    cards.push(`${head(1)}${poly(n,col,false)}<b class="kv">${NM[n]}</b><small>regulær ${n}-kant</small>`);
    cards.push(`${head(2)}${poly(n,col,true)}<b class="kv">${n-2} ${n===3?'trekant':'trekanter'}</b><small>fra ett hjørne</small>`);
    cards.push(`${head(3)}<b class="kv big">${(n-2)*180}°</b><small>vinkelsum<br>(${n} − 2) · 180°</small>`);
    cards.push(`${head(4)}<b class="kv big">${angS(n)}</b><small>hver vinkel i en<br>regulær ${n}-kant</small>`); }
  const check=()=>{ for(let n=3;n<=10;n++) assert(Math.abs(ang(n)*n-(n-2)*180)<1e-9,'v'+n); assert(ang(6)===120&&ang(5)===108&&ang(8)===135,'kjente'); };
  const R=rng(95); const printed=shuffle(cards,R);
  const p1=page({eye:'Klasseaktivitet · 9. trinn · Kapittel 2 · Ulike polygoner',title:T,lede:'Kortspill for 3–5 elever. Hver familie er én mangekant med fire kort: navnet, oppdelingen i trekanter, vinkelsummen og størrelsen på hver vinkel. Målet er å samle flest hele familier (kvartetter). Varighet: 20 minutter.',
    body:`<h2>Slik spiller dere</h2><ol class="st"><li>Skriv ut side 2–4 og klipp ut de 32 kortene. Del ut alle kortene.</li><li>Den som starter, spør en medspiller om et bestemt kort, for eksempel: «Har du vinkelsummen til sekskanten?» Du må selv ha minst ett kort fra den familien.</li><li>Får du kortet, spør du igjen. Får du nei, går turen videre til den du spurte.</li><li>Har du alle fire kortene i en familie, legger du kvartetten på bordet og forklarer hvorfor kortene hører sammen.</li><li>Den som har flest kvartetter når kortene er brukt opp, vinner.</li></ol>
    <div class="box red"><b class="t">Vanskeligere variant</b><p>Ikke si navnet på familien når du spør. Spør i stedet etter tallet: «Har du noen med 1080°?» Medspilleren må regne ut hvilken mangekant det er.</p></div>
    <div class="box"><b class="t">Til læreren: alle familiene</b><table class="t" style="width:100%"><tr><th>Mangekant</th><th>Trekanter</th><th>Vinkelsum</th><th>Hver vinkel (regulær)</th></tr>${Array.from({length:8},(_,i)=>i+3).map(n=>`<tr><td>${NM[n]}</td><td>${n-2}</td><td>${(n-2)*180}°</td><td>${angS(n)}</td></tr>`).join('')}</table></div>`,foot:[ft(T),'Side 1 · instruksjoner']});
  A.push({id:'mangekant-kvartett', ch:'9k2', title:T, fit:'9. trinn · Kapittel 2 · Ulike polygoner', link:'#9k2-vinkelsum', topics:['vinkler','vinkelsum','trekanter','regulare'],
    short:'Kvartett med mangekanter: navn, trekanter, vinkelsum og vinkler.',
    desc:'Et kortspill der elevene samler familier av mangekanter fra trekant til tikant. Hver familie har fire kort som henger sammen: figuren, oppdelingen i trekanter, vinkelsummen og vinkelen i den regulære mangekanten.',
    inside:['Side 1: regler, en vanskeligere variant og oversikt over alle familiene','Side 2–4: 32 spillkort, 12 per ark'], check,
    css:`.card{gap:1mm}.kv{font-size:13pt}.kv.big{font:800 22pt "Bricolage Grotesque"}.card small{font-size:8.5pt;color:${C.muted};line-height:1.3}.card .nr{font-size:9pt}table.t td,table.t th{padding:1mm 2mm}`,
    pages:[p1,...cardPages({cards:printed,cols:3,rows:4,eye:'Klasseaktivitet · Mangekant-kvartett',title:T,foot:ft(T),start:2,label:'spillkort'})]});
}

/* 6 Jakten på π */
{ const T='Jakten på π'; const DS=[3,5,7];
  const circ=(d)=>`<div class="cc"><svg viewBox="0 0 ${d*10+2} ${d*10+2}" width="${d*10+2}mm" height="${d*10+2}mm"><circle cx="${d*5+1}" cy="${d*5+1}" r="${d*5}" fill="none" stroke="${C.ink}" stroke-width=".5"/><line x1="1" x2="${d*10+1}" y1="${d*5+1}" y2="${d*5+1}" stroke="${C.red}" stroke-width=".4" stroke-dasharray="1.5 1"/><circle cx="${d*5+1}" cy="${d*5+1}" r=".7" fill="${C.ink}"/></svg><small>Sirkel ${DS.indexOf(d)+1}</small></div>`;
  const check=()=>{ assert(r1(PI*3)===9.4&&r1(PI*5)===15.7&&r1(PI*7)===22,'O'); };
  const body=key=>`<div class="cr">${DS.map(circ).join('')}</div>
    <h2>A · Mål sirklene over</h2><p>Mål diameteren med linjal. Legg en hyssing rundt sirkelen for å måle omkretsen. Regn ut omkretsen delt på diameteren.</p>
    <table class="t mt"><tr><th></th><th>Diameter d (cm)</th><th>Omkrets O (cm)</th><th>O : d</th></tr>${DS.map((d,i)=>`<tr><th>Sirkel ${i+1}</th><td>${key?`<span class="a">${d}</span>`:''}</td><td>${key?`<span class="a">≈ ${nf(r1(PI*d))}</span>`:''}</td><td>${key?'<span class="a">≈ 3,14</span>':''}</td></tr>`).join('')}</table>
    <h2>B · Mål runde ting i klasserommet</h2><p>Finn minst fire runde ting, for eksempel en kopp, en klokke, en søppelbøtte eller en rull med tape.</p>
    <table class="t mt"><tr><th>Ting</th><th>Diameter d (cm)</th><th>Omkrets O (cm)</th><th>O : d</th></tr>${[1,2,3,4].map(()=>`<tr><td>${key?'<span class="a">Svarene varierer</span>':''}</td><td></td><td></td><td>${key?'<span class="a">nær 3,14</span>':''}</td></tr>`).join('')}</table>
    <h2>C · Tenk etter</h2>${qList([['Hva får du når du regner ut gjennomsnittet av alle O : d-verdiene i tabellene?','Et tall nær 3,14. Det er π (pi). Små målefeil gjør at svarene varierer litt.'],['Hva skjer med omkretsen når diameteren blir dobbelt så stor?','Omkretsen blir også dobbelt så stor, fordi O = π · d.'],['Et sykkelhjul har diameter 70 cm. Hvor langt kommer sykkelen når hjulet går rundt én gang?','O = π · 70 ≈ 220 cm, altså omtrent 2,2 m.']],key)}`;
  A.push({id:'jakten-pa-pi', ch:'9k2', title:T, fit:'9. trinn · Kapittel 2 · Sirkelen', link:'#9k2-sirkelen', topics:['sirkelen'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Mål omkrets og diameter på sirkler og runde ting, og oppdag π.',
    desc:'Elevene måler diameter og omkrets på tre sirkler i riktig størrelse og på runde ting i klasserommet. Når de deler omkretsen på diameteren, får de nesten det samme tallet hver gang: π. Trenger linjal og hyssing.',
    inside:['Side 1: elevark med tre sirkler i målestokk 1 : 1, måletabeller og spørsmål','Side 2: fasit'], check,
    css:QCSS+`.cr{display:flex;align-items:flex-end;justify-content:space-around}.cc{display:flex;flex-direction:column;align-items:center;gap:1mm}.cc small{font:400 8pt "JetBrains Mono";color:${C.muted}}table.mt{width:100%}table.mt td{height:7.4mm}`,
    pages:sheetPair({eye:'Utforsk · 9. trinn · Kapittel 2 · Sirkelen',title:T,n:1,lede:'Skriv ut arket uten å skalere (100 %). Da er sirklene i riktig størrelse.',keyLede:'Sirklene har diameter 3 cm, 5 cm og 7 cm. Målingene til elevene vil avvike litt.',body})});
}

/* 7 Areal-trumf */
{ const T='Areal-trumf';
  // figurer: [type, mål..., navn]
  const F=[['R',8,5],['R',13,3],['R',9,6],['K',7],['K',6],['K',9],['P',11,4],['P',7,6],['P',12,5],['Tz',8,4,5],['Tz',10,6,4],['Tz',6,2,7],['T',10,7],['T',12,11],['T',8,5],['S',3],['S',4],['S',5],['R',15,3],['K',5],['T',13,4],['P',9,3],['Tz',11,5,6],['S',2.5]];
  const area=f=>({R:f[1]*f[2],K:f[1]*f[1],P:f[1]*f[2],Tz:(f[1]+f[2])*f[3]/2,T:f[1]*f[2]/2,S:r1(3.14*f[1]*f[1])})[f[0]];
  const NM={R:'Rektangel',K:'Kvadrat',P:'Parallellogram',Tz:'Trapes',T:'Trekant',S:'Sirkel'};
  const draw=f=>{ const W=64,H=36; const bw=f[0]==='S'?f[1]*2:f[0]==='P'?f[1]+f[2]*.5:f[1], bh=f[0]==='S'?f[1]*2:f[0]==='K'?f[1]:f[0]==='Tz'?f[3]:f[2]; const k=Math.min(4,44/bw,24/bh); let s=`<svg viewBox="0 0 ${W} ${H}" width="62mm" height="35mm">`;
    const t=(x,y,v,a)=>svgT(x,y,`${nf(v)} cm`,{fs:3,a:a||'middle'});
    if(f[0]==='R'||f[0]==='K'){ const a=f[1]*k, b=(f[0]==='K'?f[1]:f[2])*k, x=(W-a)/2, y=(H-b)/2+1; s+=`<rect x="${x}" y="${y}" width="${a}" height="${b}" class="sh"/>`+t(x+a/2,y-1.5,f[1])+(f[0]==='R'?t(x+a+1.5,y+b/2+1,f[2],'start'):''); }
    else if(f[0]==='P'){ const g=f[1]*k, h=f[2]*k, o=h*.5, x=(W-g-o)/2, y=(H-h)/2+1; s+=`<polygon points="${x},${y+h} ${x+g},${y+h} ${x+g+o},${y} ${x+o},${y}" class="sh"/><line x1="${x+o}" y1="${y}" x2="${x+o}" y2="${y+h}" class="hh"/>`+t(x+g/2,y+h+4,f[1])+t(x+o+1.5,y+h/2+1,f[2],'start'); }
    else if(f[0]==='Tz'){ const a=f[1]*k, b=f[2]*k, h=f[3]*k, x=(W-a)/2, y=(H-h)/2+1, xb=x+(a-b)/2; s+=`<polygon points="${x},${y+h} ${x+a},${y+h} ${xb+b},${y} ${xb},${y}" class="sh"/><line x1="${xb}" y1="${y}" x2="${xb}" y2="${y+h}" class="hh"/>`+t(x+a/2,y+h+4,f[1])+t(xb+b/2,y-1.5,f[2])+t(xb+1.5,y+h/2+1,f[3],'start'); }
    else if(f[0]==='T'){ const g=f[1]*k, h=f[2]*k, x=(W-g)/2, y=(H-h)/2+1, tx=x+g*.35; s+=`<polygon points="${x},${y+h} ${x+g},${y+h} ${tx},${y}" class="sh"/><line x1="${tx}" y1="${y}" x2="${tx}" y2="${y+h}" class="hh"/>`+t(x+g/2,y+h+4,f[1])+t(tx+1.5,y+h/2+1,f[2],'start'); }
    else { const r=f[1]*k*.9, cx=W/2, cy=H/2+1; s+=`<circle cx="${cx}" cy="${cy}" r="${r}" class="sh"/><line x1="${cx}" y1="${cy}" x2="${cx+r}" y2="${cy}" class="hh" style="stroke-dasharray:none"/><circle cx="${cx}" cy="${cy}" r=".7" fill="${C.ink}"/>`+svgT(cx+r+2,cy+1,`r = ${nf(f[1])} cm`,{fs:3,a:'start'}); }
    return s+'</svg>'; };
  const areas=F.map(area);
  const check=()=>{ assert(new Set(areas).size===areas.length,'like arealer: '+areas.join(',')); };
  const cards=F.map((f,i)=>`<span class="tag">${NM[f[0]]}</span><span class="nr gl">${i+1}</span>${draw(f)}`);
  const p1=page({eye:'Klasseaktivitet · 9. trinn · Kapittel 2 · Omkrets og areal',title:T,lede:'Kortspill for 2–4 elever, som Topp Trumf. Den som har figuren med størst areal, vinner stikket. Elevene må regne ut arealet av rektangler, kvadrater, parallellogrammer, trapeser, trekanter og sirkler. Varighet: 20 minutter.',
    body:`<h2>Slik spiller dere</h2><ol class="st"><li>Skriv ut side 2–4 til hver gruppe og klipp ut de 24 kortene. Bland og del ut alle kortene.</li><li>Alle snur det øverste kortet samtidig og regner ut arealet av figuren sin på et kladdeark.</li><li>Den som har størst areal, vinner alle kortene i stikket, men bare hvis utregningen er riktig. De andre kontrollerer.</li><li>Den som har flest kort når tiden er ute, vinner.</li></ol>
    <div class="box red"><b class="t">Formler</b><p>Rektangel og parallellogram: g · h &nbsp;·&nbsp; Kvadrat: s · s &nbsp;·&nbsp; Trekant: g · h : 2 &nbsp;·&nbsp; Trapes: (a + b) · h : 2 &nbsp;·&nbsp; Sirkel: π · r · r, bruk π ≈ 3,14</p></div>
    <div class="box"><b class="t">Til læreren: arealene</b><div class="kj">${F.map((f,i)=>`<span><b>${i+1}</b> ${NM[f[0]].toLowerCase()} <span class="a">${nf(areas[i])} cm²</span></span>`).join('')}</div></div>
    <p><b>Variant:</b> Spill om <i>minst</i> areal, eller la elevene velge om stikket gjelder areal eller omkrets (bare for rektangler, kvadrater og sirkler).</p>`,foot:[ft(T),'Side 1 · instruksjoner og fasit']});
  A.push({id:'areal-trumf', ch:'9k2', title:T, fit:'9. trinn · Kapittel 2 · Omkrets og areal', link:'#9k2-rektangel', topics:['rektangel','kvadrat','parallellogram','trapes','trekant-areal','sirkel-areal'],
    short:'Topp Trumf med figurer: størst areal vinner stikket.',
    desc:'Et kortspill med 24 figurer: rektangler, kvadrater, parallellogrammer, trapeser, trekanter og sirkler. Elevene regner ut arealet, og den som har størst areal vinner stikket hvis utregningen er riktig.',
    inside:['Side 1: regler, formler og fasit med alle arealene','Side 2–4: 24 figurkort, 8 per ark'], check,
    css:`.sh{fill:${C.soft};stroke:${C.pen};stroke-width:.6}.hh{stroke:${C.red};stroke-width:.4;stroke-dasharray:1.2 .8}.gl{font:800 13pt "Bricolage Grotesque"!important;color:${C.pen}!important}.kj{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2mm 4mm;font-size:9.6pt}`,
    pages:[p1,...cardPages({cards,cols:2,rows:4,eye:'Klasseaktivitet · Areal-trumf',title:T,foot:ft(T),start:2,label:'figurkort'})]});
}

/* 8 Pytagoras-løypa */
{ const T='Pytagoras-løypa';
  const tasks=[ ['En rettvinklet trekant har kateter på 6 cm og 8 cm. Hvor lang er hypotenusen?',10,'cm'],
    ['I et rektangel er sidene 9 cm og 12 cm. Hvor lang er diagonalen?',15,'cm'],
    ['Hypotenusen er 13 cm, og den ene kateten er 5 cm. Hvor lang er den andre kateten?',12,'cm'],
    ['En stige er 5 m lang. Foten står 1,4 m fra veggen. Hvor høyt opp på veggen når stigen?',4.8,'m'],
    ['Hvor langt er det mellom punktene (1, 2) og (4, 6) i et koordinatsystem?',5,''],
    ['En likebeint, rettvinklet trekant har kateter på 5 cm. Hvor lang er hypotenusen? Svar med én desimal.',7.1,'cm'],
    ['I en trekant med vinklene 30°, 60° og 90° er hypotenusen 18 cm. Hvor lang er den korteste kateten?',9,'cm'],
    ['Et kvadrat har sider på 10 cm. Hvor lang er diagonalen? Svar med én desimal.',14.1,'cm'] ];
  const calc=[Math.hypot(6,8),Math.hypot(9,12),Math.sqrt(13*13-25),Math.sqrt(25-1.96),Math.hypot(3,4),r1(Math.hypot(5,5)),9,r1(Math.hypot(10,10))];
  const check=()=>{ tasks.forEach((t,i)=>assert(Math.abs(t[1]-calc[i])<1e-9,'pyt '+(i+1))); assert(new Set(tasks.map(t=>t[1])).size===8,'unike'); };
  const R=rng(98); const order=shuffle([0,1,2,3,4,5,6,7],R); // post k viser svaret på forrige oppgave og en ny oppgave
  const posts=order.map((ti,k)=>{ const prev=order[(k+7)%8]; return {nr:k+1, ans:tasks[prev], task:tasks[ti], ti}; });
  const postCard=p=>`<div class="post"><div class="ph"><span>Post</span><b>${String.fromCharCode(65+p.nr-1)}</b></div><div class="pa"><span>Svaret på forrige oppgave:</span><b>${nf(p.ans[1])} ${p.ans[2]}</b></div><div class="pt"><span>Ny oppgave</span><p>${p.task[0]}</p></div></div>`;
  const cards=posts.map(postCard);
  const p1=page({eye:'Klasseaktivitet · 9. trinn · Kapittel 2 · Pytagoras-setningen',title:T,lede:'En løype rundt i klasserommet eller i gangen. Elevene løser en oppgave på hver post og leter etter posten som viser svaret. Da får de en ny oppgave. Løypa går i ring gjennom alle åtte postene. Varighet: 25–30 minutter.',
    body:`<h2>Forberedelser</h2><ol class="st"><li>Skriv ut side 2–5, gjerne i A3, og heng opp de åtte postene rundt i rommet.</li><li>Skriv ut svararket på side 6 til hvert par.</li></ol>
    <h2>Slik gjør dere</h2><ol class="st"><li>Hvert par starter på en ulik post og løser oppgaven der. Skriv postbokstaven og utregningen på svararket.</li><li>Finn posten som viser svaret dere fikk øverst, «Svaret på forrige oppgave». Løs den nye oppgaven der.</li><li>Finner dere ikke svaret på noen post, har dere regnet feil. Gå tilbake og regn på nytt.</li><li>Paret er ferdig når de er tilbake på posten der de startet.</li></ol>
    <div class="box"><b class="t">Til læreren: riktig rekkefølge</b><p>${posts.map(p=>`Post ${String.fromCharCode(64+p.nr)} <span class="a">→ ${nf(p.task[1])} ${p.task[2]}</span>`).join(' · ')}</p><p>Etter post ${String.fromCharCode(64+posts.length)} kommer post A igjen.</p></div>`,foot:[ft(T),'Side 1 · instruksjoner og fasit']});
  const sv=page({eye:'Klasseaktivitet · Pytagoras-løypa',title:T,small:'svarark',body:`<p>Navn: ______________________________ Startpost: ______</p><div class="svg">${[1,2,3,4,5,6,7,8].map(i=>`<div><span>${i}</span><b>Post</b><i class="s"></i><b>Utregning</b><i></i><b>Svar</b><i class="m"></i></div>`).join('')}</div>`,foot:[ft(T),'Side 6 · svarark']});
  A.push({id:'pytagoras-loypa', ch:'9k2', title:T, fit:'9. trinn · Kapittel 2 · Pytagoras-setningen', link:'#9k2-pytagoras', topics:['pytagoras','hypotenus','katet','likebeint-rett','trekant-30-60'],
    short:'Løype med åtte poster: hvert svar viser vei til neste oppgave.',
    desc:'Åtte poster henges opp rundt i rommet. På hver post løser elevene en oppgave med Pytagoras-setningen, og svaret viser hvilken post de skal til. Oppgavene dekker hypotenus, katet, diagonaler, koordinater og spesielle trekanter.',
    inside:['Side 1: instruksjoner og fasit','Side 2–5: åtte poster, to per ark','Side 6: svarark'], check,
    css:`.card{padding:0}.post{display:flex;flex-direction:column;width:100%;height:100%}.ph{display:flex;align-items:center;justify-content:space-between;background:${C.pen};color:#fff;padding:3mm 6mm}.ph span{font:400 11pt "JetBrains Mono";text-transform:uppercase;letter-spacing:.08em}.ph b{font:800 30pt "Bricolage Grotesque"}
      .pa{padding:5mm 6mm;border-bottom:2px dashed ${C.line};display:flex;flex-direction:column;align-items:center}.pa span,.pt span{font:400 9pt "JetBrains Mono";text-transform:uppercase;color:${C.muted};letter-spacing:.05em}.pa b{font:800 34pt "Bricolage Grotesque";color:${C.red}}
      .pt{flex:1;padding:5mm 8mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.pt p{font-size:17pt;line-height:1.35;margin-top:2mm}
      .svg{display:grid;gap:2.5mm}.svg div{display:grid;grid-template-columns:6mm auto 14mm auto 1fr auto 26mm;gap:2mm;align-items:end;font-size:10pt;height:22mm;border-bottom:1px solid ${C.line};padding-bottom:1.5mm}.svg span{font-weight:700;color:${C.pen};align-self:start}.svg b{font-size:8.5pt;color:${C.muted}}.svg i{border-bottom:1px solid ${C.ink};height:6mm}`,
    pages:[p1,...cardPages({cards,cols:1,rows:2,eye:'Klasseaktivitet · Pytagoras-løypa',title:T,foot:ft(T),start:2,label:'poster'}),sv]});
}

/* 9 Mål høyden */
{ const T='Mål høyden med skygger';
  const shadowSvg=`<svg viewBox="0 0 150 52" width="150mm" height="52mm"><line x1="5" y1="45" x2="145" y2="45" stroke="${C.ink}" stroke-width=".6"/>
    <rect x="18" y="8" width="16" height="37" fill="${C.soft}" stroke="${C.pen}" stroke-width=".6"/><line x1="34" y1="8" x2="95" y2="45" stroke="${C.orange}" stroke-width=".5" stroke-dasharray="1.5 1"/><line x1="34" y1="45" x2="95" y2="45" stroke="${C.ink}" stroke-width="2"/>
    ${svgT(26,30,'h = ?',{fs:3.6})}${svgT(64,50,'skyggen til bygningen',{fs:3,w:400})}
    <line x1="115" y1="33" x2="115" y2="45" stroke="${C.red}" stroke-width="1.2"/><line x1="115" y1="33" x2="135" y2="45" stroke="${C.orange}" stroke-width=".5" stroke-dasharray="1.5 1"/><line x1="115" y1="45" x2="135" y2="45" stroke="${C.ink}" stroke-width="2"/>
    ${svgT(111,40,'pinne',{fs:3,a:'end',w:400})}${svgT(125,50,'skygge',{fs:3,w:400})}</svg>`;
  const P=[['En pinne på 1,2 m kaster en skygge på 0,8 m. Samtidig kaster et tre en skygge på 6 m. Hvor høyt er treet?',r2(1.2*6/0.8),'m','1,2 : 0,8 = 1,5. Treet: 6 · 1,5 = 9 m.'],
    ['Linn er 1,6 m høy, og skyggen hennes er 2 m. Flaggstanga har en skygge på 12,5 m. Hvor høy er flaggstanga?',r2(1.6*12.5/2),'m','1,6 : 2 = 0,8. Flaggstanga: 12,5 · 0,8 = 10 m.'],
    ['En lyktestolpe er 4,5 m høy og kaster en skygge på 3 m. Hvor lang skygge har en pinne på 1 m?',r2(1*3/4.5),'m','Skyggen er 3 : 4,5 = 2/3 av høyden. Pinnen: 1 · 2/3 ≈ 0,67 m.']];
  const check=()=>{ assert(P[0][1]===9&&P[1][1]===10&&Math.abs(P[2][1]-0.67)<1e-9,'skygge'); };
  const body=key=>`${shadowSvg}<p>Når sola skinner, danner høyden og skyggen til en gjenstand en rettvinklet trekant. Alle gjenstander på samme sted får <b>formlike</b> trekanter, fordi sollyset kommer inn med samme vinkel. Da er forholdet mellom høyde og skygge det samme.</p>
    <div class="box"><b class="t">h : skygge = pinne : pinneskygge</b><p>Mål pinnen og skyggen til pinnen. Mål skyggen til bygningen. Da kan du regne ut høyden: h = skyggen til bygningen · (pinne : pinneskygge).</p></div>
    <h2>A · Øv først</h2>${qList(P.map(p=>[p[0],`${p[3]}`]),key)}
    <h2>B · Ut og mål</h2><p>Velg tre høye ting ute: skolen, et tre, en lyktestolpe eller et mål. Mål på en solrik dag.</p>
    <table class="t mt"><tr><th>Gjenstand</th><th>Pinne (m)</th><th>Pinneskygge (m)</th><th>Skygge (m)</th><th>Høyde (m)</th></tr>${[1,2,3].map(()=>`<tr><td>${key?'<span class="a">Svarene varierer</span>':''}</td><td></td><td></td><td></td><td></td></tr>`).join('')}</table>
    ${key?'<p class="a" style="margin-top:2mm">Diskuter målefeil: skyggen må måles rett ut fra midten av gjenstanden, og alle målinger må gjøres omtrent samtidig.</p>':'<p style="margin-top:2mm">Hvor sikre er svarene deres? Hva kan gi feil?</p><span class="ln"></span>'}`;
  A.push({id:'mal-hoyden', ch:'9k2', title:T, fit:'9. trinn · Kapittel 2 · Formlikhet og kongruens', link:'#9k2-formlikhet', topics:['kongruens','formlikhet','formlik-sider'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Bruk formlike trekanter og skygger til å måle høyden på skolen.',
    desc:'Elevene bruker formlike trekanter til å finne høyden på ting de ikke kan måle direkte. De øver først på tre oppgaver, og går så ut en solrik dag og måler skolen, et tre eller en lyktestolpe med en pinne og et målebånd.',
    inside:['Side 1: elevark med forklaring, øveoppgaver og måletabell til uteaktiviteten','Side 2: fasit'], check,
    css:QCSS+`table.mt{width:100%}table.mt td{height:8.5mm}`,
    pages:sheetPair({eye:'Utforsk · 9. trinn · Kapittel 2 · Formlikhet',title:T,n:1,lede:'Hvor høy er skolen? Det kan du finne ut med en pinne, et målebånd og litt sol.',keyLede:'Svar på øveoppgavene og tips til samtalen om målefeil.',body})});
}

/* 10 Tangram-areal */
{ const T='Tangram-areal';
  const pcs=[['Stor trekant A',[[0,0],[100,0],[50,50]],C.pen],['Stor trekant B',[[0,0],[50,50],[0,100]],C.red],['Middels trekant',[[100,50],[100,100],[50,100]],C.ok],['Liten trekant A',[[100,0],[100,50],[75,25]],C.orange],['Kvadrat',[[50,50],[75,25],[100,50],[75,75]],'#7A3FB0'],['Liten trekant B',[[50,50],[75,75],[25,75]],'#0E7C86'],['Parallellogram',[[0,100],[25,75],[75,75],[50,100]],'#B0306A']];
  const ar=p=>{ let s=0; for(let i=0;i<p.length;i++){ const [x1,y1]=p[i],[x2,y2]=p[(i+1)%p.length]; s+=x1*y2-x2*y1; } return Math.abs(s)/2/100; };
  const per=p=>{ let s=0; for(let i=0;i<p.length;i++){ const [x1,y1]=p[i],[x2,y2]=p[(i+1)%p.length]; s+=Math.hypot(x2-x1,y2-y1); } return s/10; };
  const check=()=>{ const tot=pcs.reduce((s,p)=>s+ar(p[1]),0); assert(Math.abs(tot-100)<1e-9,'100'); assert(ar(pcs[0][1])===25&&ar(pcs[2][1])===12.5&&ar(pcs[3][1])===6.25,'a'); };
  const tg=(key)=>`<svg viewBox="-1 -1 102 102" width="100mm" height="100mm">${pcs.map(p=>`<polygon points="${p[1].map(q=>q.join(',')).join(' ')}" fill="${key?p[2]:'#fff'}" fill-opacity="${key?.25:1}" stroke="${C.ink}" stroke-width=".5"/>`).join('')}${key?pcs.map(p=>{ const cx=p[1].reduce((s,q)=>s+q[0],0)/p[1].length, cy=p[1].reduce((s,q)=>s+q[1],0)/p[1].length; return svgT(cx,cy+1.2,nf(ar(p[1]))+' cm²',{fs:3.6}); }).join(''):''}</svg>`;
  const body=key=>`<div class="tr">${tg(key)}<div class="tx"><p>Kvadratet er 10 cm × 10 cm og består av sju brikker. ${key?'':'Klipp ut brikkene.'}</p>
    <table class="t"><tr><th>Brikke</th><th>Areal (cm²)</th></tr>${pcs.map(p=>`<tr><td>${p[0]}</td><td>${key?`<span class="a">${nf(ar(p[1]))}</span>`:''}</td></tr>`).join('')}<tr><th>Til sammen</th><td>${key?'<span class="a">100</span>':''}</td></tr></table></div></div>
    <h2>Utforsk</h2>${qList([['Finn arealet av hver brikke uten å måle. Tips: Hvor mange små trekanter får plass i de andre brikkene?','De to store trekantene er en fjerdedel hver (25 cm²). Middels trekant, kvadrat og parallellogram er 12,5 cm². De små trekantene er 6,25 cm².'],
      ['Legg kvadratet, parallellogrammet og den middels store trekanten oppå hverandre. Hvorfor kan de ha like stort areal når formene er ulike?','Alle tre kan deles i to små trekanter. Arealet er det samme selv om formen er forskjellig.'],
      ['Bruk alle sju brikkene og lag et rektangel og en stor trekant. Hva er arealet av figurene? Er omkretsen lik?','Arealet er alltid 100 cm². Omkretsen endrer seg: kvadratet har 40 cm, rektangelet (≈ 7,1 cm × 14,1 cm) har ≈ 42,4 cm, og den store trekanten har ≈ 48,3 cm.'],
      ['Lag en figur med så stor omkrets som mulig. Hva blir arealet?','Arealet er fortsatt 100 cm². Samme areal kan ha svært ulik omkrets.']],key)}`;
  const chk2=()=>{ check(); assert(r1(2*(10/Math.SQRT2+20/Math.SQRT2))===42.4,'rekt'); assert(r1(20+2*10*Math.SQRT2)===48.3,'tri'); };
  A.push({id:'tangram-areal', ch:'9k2', title:T, fit:'9. trinn · Kapittel 2 · Sammensatte figurer', link:'#9k2-sammensatte', topics:['sammensatte','utforsking-plan'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Klipp ut et tangram, finn arealet av brikkene og lag figurer med samme areal.',
    desc:'Elevene klipper ut et tangram på 10 × 10 cm og finner arealet av hver brikke ved å sammenligne brikkene, uten å måle. Så legger de nye figurer og oppdager at arealet er det samme, men omkretsen endrer seg.',
    inside:['Side 1: elevark med tangram i målestokk 1 : 1, tabell og fire utforskende spørsmål','Side 2: fasit med arealet av hver brikke'], check:chk2,
    css:QCSS+`.tr{display:flex;gap:6mm;align-items:flex-start}.tx{flex:1}.tx table{width:100%}.tx td{height:7mm}`,
    pages:sheetPair({eye:'Utforsk · 9. trinn · Kapittel 2 · Sammensatte figurer',title:T,n:1,lede:'Tangram er et gammelt kinesisk puslespill. Alle figurene du lager med de sju brikkene, har samme areal. Men har de samme omkrets?',keyLede:'Arealene står i brikkene. Omkretsene er avrundet til én desimal.',body})});
}

/* ===== Kap 3 Romgeometri ===== */
/* 11 Eskefabrikken */
{ const T='Eskefabrikken';
  const BX=[['A',4,3,2],['B',3,3,3],['C',5,2,2]];
  const vol=b=>b[1]*b[2]*b[3], ov=b=>2*(b[1]*b[2]+b[1]*b[3]+b[2]*b[3]);
  let best=null; for(let a=1;a<=24;a++) for(let b=a;b<=24;b++) for(let c=b;c<=24;c++) if(a*b*c===24){ const o=2*(a*b+a*c+b*c); if(!best||o<best[3]) best=[a,b,c,o]; }
  const check=()=>{ assert(vol(BX[0])===24&&ov(BX[0])===52&&vol(BX[1])===27&&ov(BX[1])===54&&vol(BX[2])===20&&ov(BX[2])===48,'esker'); assert(best.join()==='2,3,4,52','best '+best); };
  const net=(b)=>{ const [n,l,w,h]=b, S=10; // mm per cm
    const W=2*(l+w)*S, Hh=(h+2*w)*S; let s=`<svg viewBox="-2 -2 ${W+4} ${Hh+4}" width="${(W+4)}mm" height="${(Hh+4)}mm" style="overflow:visible">`;
    const rect=(x,y,a,c,lab)=>`<rect x="${x}" y="${y}" width="${a}" height="${c}" fill="#fff" stroke="${C.ink}" stroke-width=".35"/>${lab?svgT(x+a/2,y+c/2+1.2,lab,{fs:3.4,w:400,c:C.muted}):''}`;
    // stripe: l, w, l, w (høyde h) i midten; topp og bunn (l×w) over/under første l
    s+=rect(0,w*S,l*S,h*S,`${l} × ${h}`)+rect(l*S,w*S,w*S,h*S,`${w} × ${h}`)+rect((l+w)*S,w*S,l*S,h*S,`${l} × ${h}`)+rect((2*l+w)*S,w*S,w*S,h*S,`${w} × ${h}`);
    s+=rect(0,0,l*S,w*S,`${l} × ${w}`)+rect(0,(w+h)*S,l*S,w*S,`${l} × ${w}`);
    s+=svgT(-1,-3,`Eske ${n}`,{fs:4.2,a:'start',c:C.pen});
    return s+'</svg>'; };
  const sheet=page({eye:'Utforsk · 9. trinn · Kapittel 3 · Rette prismer',title:T,lede:'Dere jobber i en eskefabrikk. Klipp ut, brett og tape sammen eskene på side 2. Mål, regn ut og finn ut hvilken eske som er mest lønnsom å lage.',
    body:`<h2>A · Mål og regn</h2><table class="t mt"><tr><th>Eske</th><th>Lengde</th><th>Bredde</th><th>Høyde</th><th>Volum (cm³)</th><th>Overflate (cm²)</th><th>Volum : overflate</th></tr>${BX.map(b=>`<tr><th>${b[0]}</th><td></td><td></td><td></td><td></td><td></td><td></td></tr>`).join('')}</table>
    <h2>B · Tenk etter</h2>${qList([['Hvilken eske rommer mest?','',1],['Hvilken eske bruker minst papp?','',1],['Fabrikken vil ha mest volum per cm² papp. Hvilken eske er best? Bruk den siste kolonnen.','',1],['Lag en eske som rommer 24 cm³ med minst mulig papp. Bruk bare hele centimeter. Hvilke mål får den?','',2],['Hvorfor er en kube «billigst» av alle esker med samme volum? Prøv å forklare.','',2]],false)}`,foot:[ft(T),'Side 1 · elevark']});
  const nets=page({eye:'Utforsk · Eskefabrikken',title:T,small:'utbrettinger',body:`<p class="cut">✂ Skriv ut i 100 % · klipp langs ytterkanten · brett langs linjene · tape kantene</p><div class="nets">${BX.slice(0,2).map(net).join('')}</div>`,foot:[ft(T),'Side 2 · utbrettinger']});
  const nets2=page({eye:'Utforsk · Eskefabrikken',title:T,small:'utbrettinger',body:`<p class="cut">✂ Skriv ut i 100 % · klipp langs ytterkanten · brett langs linjene · tape kantene</p><div class="nets">${BX.slice(2).map(net).join('')}</div><h2>Design din egen eske</h2><p>Tegn utbrettingen av esken du fant i oppgave 4 (24 cm³ med minst papp) i rutenettet. Hver rute er 1 cm.</p><svg viewBox="0 0 180 140" width="180mm" height="140mm">${Array.from({length:19},(_,i)=>`<line x1="${i*10}" x2="${i*10}" y1="0" y2="140" stroke="#C9D1DF" stroke-width=".25"/>`).join('')}${Array.from({length:15},(_,i)=>`<line y1="${i*10}" y2="${i*10}" x1="0" x2="180" stroke="#C9D1DF" stroke-width=".25"/>`).join('')}</svg>`,foot:[ft(T),'Side 3 · utbrettinger']});
  const key=page({eye:'Fasit · Utforsk · 9. trinn · Kapittel 3',title:T,key:true,body:`<table class="t mt"><tr><th>Eske</th><th>Mål (cm)</th><th>Volum (cm³)</th><th>Overflate (cm²)</th><th>Volum : overflate</th></tr>${BX.map(b=>`<tr><th>${b[0]}</th><td>${b[1]} × ${b[2]} × ${b[3]}</td><td><span class="a">${vol(b)}</span></td><td><span class="a">${ov(b)}</span></td><td><span class="a">≈ ${nf(r2(vol(b)/ov(b)))}</span></td></tr>`).join('')}</table>
    ${qList([['Rommer mest','Eske B, 27 cm³.'],['Minst papp','Eske C, 48 cm².'],['Mest volum per papp','Eske B: 27 : 54 = 0,5. Eske A: ≈ 0,46. Eske C: ≈ 0,42.'],['24 cm³ med minst papp',`${best[0]} × ${best[1]} × ${best[2]} cm gir ${best[3]} cm². Til sammenligning gir 2 × 2 × 6 cm 56 cm², og 1 × 4 × 6 cm 68 cm².`],['Kuben','Jo likere sidene er, jo mindre overflate trengs for å omslutte det samme volumet. Kuben er den mest «samlede» esken.']],true)}`,foot:[ft(T),'Side 4 · fasit til læreren']});
  A.push({id:'eskefabrikken', ch:'9k3', title:T, fit:'9. trinn · Kapittel 3 · Rette prismer', link:'#9k3-prisme-volum', topics:['prisme-volum','prisme-overflate','kvadratisk-prisme'], thumbs:['Side 1 · elevark','Side 2 · utbrettinger'],
    short:'Klipp, brett og sammenlign esker: volum, overflate og papp-forbruk.',
    desc:'Elevene klipper ut og bretter tre esker, måler dem og regner ut volum og overflate. Så finner de ut hvilken eske som gir mest volum for minst papp, og designer den beste esken for 24 cm³.',
    inside:['Side 1: elevark med tabell og fem spørsmål','Side 2–3: utbrettinger av tre esker i målestokk 1 : 1 og rutenett til egen eske','Side 4: fasit'], check,
    css:QCSS+`table.mt{width:100%}table.mt td{height:9mm}.nets{display:flex;flex-direction:column;align-items:center;gap:10mm;margin-top:5mm}.grid1{flex:1;min-height:60mm;border:1px solid ${C.line};background:repeating-linear-gradient(0deg,transparent 0 9.8mm,#D5DCE8 9.8mm 10mm),repeating-linear-gradient(90deg,transparent 0 9.8mm,#D5DCE8 9.8mm 10mm)}`,
    pages:[sheet,nets,nets2,key]});
}

/* 12 Fyll pyramiden */
{ const T='Fyll pyramiden'; const a=5, h=6; const sl=Math.hypot(h,a/2), edge=Math.hypot(sl,a/2);
  const check=()=>{ assert(Math.abs(sl-6.5)<1e-9,'sl'); assert(a*a*h===150&&a*a*h/3===50,'v'); };
  const prismNet=()=>{ const S=10, A=a*S, H=h*S; const W=A+2*H; let s=`<svg viewBox="-2 -2 ${W+4} ${W+4}" width="${W+4}mm" height="${W+4}mm">`;
    const r=(x,y,w,hh,l)=>`<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="#fff" stroke="${C.ink}" stroke-width=".35"/>${l?svgT(x+w/2,y+hh/2+1.2,l,{fs:3.4,w:400,c:C.muted}):''}`;
    s+=r(H,H,A,A,'bunn 5 × 5')+r(H,0,A,H,'5 × 6')+r(H,H+A,A,H,'5 × 6')+r(0,H,H,A,'6 × 5')+r(H+A,H,H,A,'6 × 5'); return s+'</svg>'; };
  const pyrNet=()=>{ const S=10, L=edge*S, half=Math.asin((a/2)/edge); const ox=95, oy=8; let s=`<svg viewBox="0 0 190 ${L+20}" width="190mm" height="${L+20}mm">`; const pts=[];
    for(let i=0;i<=4;i++){ const ang=PI/2+(i-2)*2*half; pts.push([ox+L*Math.cos(ang), oy+L*Math.sin(ang)]); }
    for(let i=0;i<4;i++) s+=`<polygon points="${ox},${oy} ${pts[i][0]},${pts[i][1]} ${pts[i+1][0]},${pts[i+1][1]}" fill="#fff" stroke="${C.ink}" stroke-width=".35"/>`;
    const p0=pts[0], dx=p0[0]-ox, dy=p0[1]-oy, Ln=Math.hypot(dx,dy), nx=dy/Ln*5, ny=-dx/Ln*5; // utover fra kanten apex–p0
    const sgn=((ox+nx)-pts[1][0])*0+1; s+=`<polygon points="${ox},${oy} ${p0[0]},${p0[1]} ${p0[0]+nx*sgn-dx*.08},${p0[1]+ny*sgn-dy*.08} ${ox+nx*sgn+dx*.12},${oy+ny*sgn+dy*.12}" fill="${C.soft}" stroke="${C.ink}" stroke-width=".3" stroke-dasharray="1 .8"/>`;
    return s+'</svg>'; };
  const sheet=page({eye:'Utforsk · 9. trinn · Kapittel 3 · Andre prismer og pyramider',title:T,lede:'En pyramide og et prisme har samme grunnflate (5 cm × 5 cm) og samme høyde (6 cm). Hvor mange ganger må du fylle pyramiden for å fylle prismet? Gjett først, så tester dere.',
    body:`<h2>Slik gjør dere</h2><ol class="st"><li>Klipp ut og tape sammen prismet (side 2) og pyramiden (side 3). Begge skal være åpne: prismet uten lokk, pyramiden uten bunn.</li><li>Gjett: Hvor mange pyramider med ris, sand eller erter trengs for å fylle prismet? Gjetning: ________</li><li>Fyll pyramiden helt opp, og hell over i prismet. Tell hvor mange ganger.</li></ol>
    <h2>Regn ut</h2>${qList([['Volumet av prismet (grunnflate · høyde):','',1],['Hva tror du formelen for volumet av en pyramide er? Bruk forsøket.','',1],['Regn ut volumet av pyramiden med formelen din.','',1],['Hvor høy er hver trekant i utbrettingen av pyramiden? Bruk Pytagoras: halve grunnlinjen er 2,5 cm og høyden i pyramiden er 6 cm.','',2],['Gjelder det samme for en kjegle og en sylinder med samme grunnflate og høyde? Hva tror du?','',1]],false)}`,foot:[ft(T),'Side 1 · elevark']});
  const n1=page({eye:'Utforsk · Fyll pyramiden',title:T,small:'prisme',body:`<p class="cut">✂ Skriv ut i 100 % · klipp ut · brett sidene opp · tape hjørnene</p><div style="display:flex;justify-content:center;margin-top:4mm">${prismNet()}</div>`,foot:[ft(T),'Side 2 · utbretting av prismet']});
  const n2=page({eye:'Utforsk · Fyll pyramiden',title:T,small:'pyramide',body:`<p class="cut">✂ Skriv ut i 100 % · klipp ut · brett langs linjene · tape den siste kanten til bretteflika</p><div style="display:flex;justify-content:center;margin-top:4mm">${pyrNet()}</div>`,foot:[ft(T),'Side 3 · utbretting av pyramiden']});
  const key=page({eye:'Fasit · Utforsk · 9. trinn · Kapittel 3',title:T,key:true,body:qList([['Forsøket','Det trengs omtrent 3 pyramider. Små avvik kommer av at pappen er tykk og at risen ikke blir helt jevn.'],['Volum av prismet','5 · 5 · 6 = 150 cm³'],['Formel for pyramiden','V = G · h : 3, altså en tredjedel av prismet.'],['Volum av pyramiden','150 : 3 = 50 cm³'],['Høyden i trekantene','√(6² + 2,5²) = √42,25 = 6,5 cm'],['Kjegle og sylinder','Ja. En kjegle har en tredjedel av volumet til en sylinder med samme grunnflate og høyde.']],true),foot:[ft(T),'Side 4 · fasit til læreren']});
  A.push({id:'fyll-pyramiden', ch:'9k3', title:T, fit:'9. trinn · Kapittel 3 · Andre prismer og pyramider', link:'#9k3-pyramider', topics:['andre-prismer','pyramider'], thumbs:['Side 1 · elevark','Side 2 · prisme'],
    short:'Lag en pyramide og et prisme med samme grunnflate og høyde, og fyll dem med ris.',
    desc:'Elevene bretter et åpent prisme og en åpen pyramide med samme grunnflate og høyde. De gjetter, fyller pyramiden med ris og heller over i prismet, og oppdager at pyramiden har en tredjedel av volumet.',
    inside:['Side 1: elevark med forsøket og fem spørsmål','Side 2–3: utbrettinger i målestokk 1 : 1','Side 4: fasit'], check,
    css:QCSS, pages:[sheet,n1,n2,key]});
}

/* 13 Hvem rommer mest? */
{ const T='Hvem rommer mest?';
  const O=[['Brusboks','syl',3.3,11.5],['Tennisball','kule',3.3],['Iskremkjeks','kjegle',2.5,11],['Melkekartong','boks',7,7,20],['Vannglass','syl',4,10],['Fotball','kule',11],['Trafikkjegle','kjegle',15,45],['Oppbevaringsboks','syl',10,15],['Basketball','kule',12],['Skoeske','boks',33,20,12],['Sjokoladeeske','trekant',4,3.5,20],['Kakeboks','syl',12,8]];
  const V=o=>o[1]==='syl'?PI*o[2]**2*o[3]:o[1]==='kule'?4/3*PI*o[2]**3:o[1]==='kjegle'?PI*o[2]**2*o[3]/3:o[1]==='boks'?o[2]*o[3]*o[4]:o[2]*o[3]/2*o[4];
  const vols=O.map(V), rank=[...O.keys()].sort((a,b)=>vols[b]-vols[a]);
  const check=()=>{ assert(new Set(vols.map(v=>Math.round(v))).size===O.length,'like volum'); };
  const ic=o=>{ const k=o[1]; let s=`<svg viewBox="0 0 40 30" width="34mm" height="26mm">`;
    if(k==='syl') s+=`<ellipse cx="20" cy="6" rx="10" ry="3" class="sh"/><path d="M10 6 V24 A10 3 0 0 0 30 24 V6" class="sh"/><line x1="20" y1="6" x2="30" y2="6" class="hh"/>`;
    else if(k==='kule') s+=`<circle cx="20" cy="15" r="12" class="sh"/><ellipse cx="20" cy="15" rx="12" ry="3.5" fill="none" stroke="${C.pen}" stroke-width=".3" stroke-dasharray="1 .8"/><line x1="20" y1="15" x2="32" y2="15" class="hh"/>`;
    else if(k==='kjegle') s+=`<path d="M20 2 L30 24 A10 3 0 0 1 10 24 Z" class="sh"/><line x1="20" y1="24" x2="30" y2="24" class="hh"/><line x1="20" y1="2" x2="20" y2="24" class="hh"/>`;
    else if(k==='boks') s+=`<path d="M8 10 L26 10 L26 27 L8 27 Z M8 10 L14 4 L32 4 L26 10 M26 27 L32 21 L32 4" class="sh"/>`;
    else s+=`<path d="M3 26 L11 10 L19 26 Z M11 10 L31 6 L37 22 L19 26" class="sh"/>`;
    return s+'</svg>'; };
  const ms=o=>o[1]==='syl'?`r = ${nf(o[2])} cm, h = ${nf(o[3])} cm`:o[1]==='kule'?`r = ${nf(o[2])} cm`:o[1]==='kjegle'?`r = ${nf(o[2])} cm, h = ${nf(o[3])} cm`:o[1]==='boks'?`${nf(o[2])} × ${nf(o[3])} × ${nf(o[4])} cm`:`trekant: g = ${nf(o[2])} cm, h = ${nf(o[3])} cm, lengde ${nf(o[4])} cm`;
  const KN={syl:'sylinder',kule:'kule',kjegle:'kjegle',boks:'rett prisme',trekant:'trekantprisme'};
  const cards=O.map((o,i)=>`<span class="tag">${KN[o[1]]}</span><span class="nr gl">${String.fromCharCode(65+i)}</span>${ic(o)}<b class="on">${o[0]}</b><small>${ms(o)}</small>`);
  const p1=page({eye:'Klasseaktivitet · 9. trinn · Kapittel 3 · Sylindrer, kjegler og kuler',title:T,lede:'Tolv kjente gjenstander. Grupper på 3–4 elever gjetter først rekkefølgen fra størst til minst volum. Så regner de ut og ser hvor godt de gjettet. Varighet: 30 minutter.',
    body:`<h2>Slik gjør dere</h2><ol class="st"><li>Skriv ut side 2–3 til hver gruppe og klipp ut kortene.</li><li><b>Gjett:</b> Legg kortene i rekkefølge fra størst til minst volum uten å regne. Skriv ned rekkefølgen.</li><li><b>Regn:</b> Fordel kortene i gruppen og regn ut volumet av hver gjenstand. Skriv svaret på baksiden.</li><li><b>Sammenlign:</b> Legg kortene i riktig rekkefølge. Hvor mange plasser bommet dere med til sammen?</li></ol>
    <div class="box red"><b class="t">Formler</b><p>Sylinder: π · r² · h &nbsp;·&nbsp; Kjegle: π · r² · h : 3 &nbsp;·&nbsp; Kule: 4 · π · r³ : 3 &nbsp;·&nbsp; Prisme: G · h</p></div>
    <div class="box"><b class="t">Til læreren: volumene, fra størst til minst</b><ol class="kj">${rank.map(i=>`<li>${String.fromCharCode(65+i)} ${O[i][0]} <span class="a">≈ ${nf(Math.round(vols[i]))} cm³</span>${vols[i]>=1000?` (${nf(r1(vols[i]/1000))} L)`:''}</li>`).join('')}</ol></div>
    <p><b>Snakk om:</b> Hvorfor er det så lett å undervurdere volumet av en ball? (Radius opphøyd i tredje gjør at volumet vokser raskt.)</p>`,foot:[ft(T),'Side 1 · instruksjoner og fasit']});
  A.push({id:'hvem-rommer-mest', ch:'9k3', title:T, fit:'9. trinn · Kapittel 3 · Sylindrer, kjegler og kuler', link:'#9k3-sylinder-volum', topics:['sylinder-volum','sylinder-overflate','kjegle-volum','kule'],
    short:'Gjett og regn ut volumet av tolv kjente gjenstander, fra brusboks til basketball.',
    desc:'Gruppene gjetter rekkefølgen på tolv gjenstander etter volum: brusbokser, baller, kjegler, esker og en kakeboks. Så regner de ut volumene med formlene for sylinder, kjegle, kule og prisme og sammenligner med gjetningen.',
    inside:['Side 1: instruksjoner, formler og fasit med alle volumene','Side 2–3: 12 gjenstandskort'], check,
    css:`.sh{fill:${C.soft};stroke:${C.pen};stroke-width:.6}.hh{stroke:${C.red};stroke-width:.45;stroke-dasharray:1.2 .8}.gl{font:800 14pt "Bricolage Grotesque"!important;color:${C.pen}!important}.on{font-size:14pt;margin-top:1mm}.card small{font-size:9.5pt;color:${C.muted};margin-top:1mm}ol.kj{columns:2;column-gap:6mm;margin:0;padding-left:6mm;font-size:9.5pt;line-height:1.45}`,
    pages:[p1,...cardPages({cards,cols:2,rows:3,eye:'Klasseaktivitet · Hvem rommer mest?',title:T,foot:ft(T),start:2,label:'kort'})]});
}

/* 14 Synker eller flyter? */
{ const T='Synker eller flyter?';
  const M=[['Kork',12,50],['Eik',37.5,50],['Is',46,50],['Stearin',45,50],['Plast (PVC)',69.5,50],['Aluminium',135,50],['Jern',393,50],['Gull',965,50]];
  const rho=m=>m[1]/m[2];
  const check=()=>{ assert(rho(M[0])===0.24&&rho(M[6])===7.86&&rho(M[7])===19.3,'rho'); assert(Math.abs(8*7*3*1.2-201.6)<1e-9,'luft'); };
  const body=key=>`<div class="box"><b class="t">Massetetthet = masse : volum</b><p>Vann har massetetthet 1 g/cm³. Ting med større massetetthet enn vann synker. Ting med mindre massetetthet flyter.</p></div>
    <h2>A · Terninger på 50 cm³</h2><p>Alle terningene har samme volum, 50 cm³. Regn ut massetettheten og avgjør om de synker eller flyter i vann.</p>
    <table class="t mt"><tr><th>Materiale</th><th>Masse (g)</th><th>Volum (cm³)</th><th>Massetetthet (g/cm³)</th><th>Synker eller flyter?</th></tr>${M.map(m=>`<tr><td>${m[0]}</td><td>${nf(m[1])}</td><td>${m[2]}</td><td>${key?`<span class="a">${nf(rho(m))}</span>`:''}</td><td>${key?`<span class="a">${rho(m)<1?'flyter':'synker'}</span>`:''}</td></tr>`).join('')}</table>
    <h2>B · Problemløsning</h2>${qList([['En stein har masse 540 g og volum 200 cm³. Synker eller flyter den?','540 : 200 = 2,7 g/cm³. Den synker.'],
      ['Klasserommet er 8 m langt, 7 m bredt og 3 m høyt. Luft har massetetthet 1,2 kg/m³. Hvor mye veier lufta i rommet?','Volum: 8 · 7 · 3 = 168 m³. Masse: 168 · 1,2 = 201,6 kg.'],
      ['Et isfjell flyter. Hvor stor del av isfjellet er under vann? Bruk massetettheten til is og sjøvann (1,03 g/cm³).','0,92 : 1,03 ≈ 0,89. Omtrent 89 % er under vann.'],
      ['Jern synker, men store skip av jern flyter. Forklar hvorfor.','Skipet er fylt med luft. Massetettheten til hele skipet (jern + luft) er mindre enn vannets.']],key)}`;
  A.push({id:'synker-eller-flyter', ch:'9k3', title:T, fit:'9. trinn · Kapittel 3 · Massetetthet og problemløsning', link:'#9k3-massetetthet', topics:['massetetthet','utforsking-rom'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Regn ut massetetthet og finn ut hva som synker og hva som flyter.',
    desc:'Elevene regner ut massetettheten til åtte materialer og avgjør om de synker eller flyter. Så løser de problemer om en stein, lufta i klasserommet, isfjell og hvorfor skip av jern kan flyte. Kan kombineres med forsøk i en bøtte med vann.',
    inside:['Side 1: elevark med tabell og fire problemløsningsoppgaver','Side 2: fasit'], check,
    css:QCSS+`table.mt{width:100%}table.mt td{height:7.4mm}`,
    pages:sheetPair({eye:'Utforsk · 9. trinn · Kapittel 3 · Massetetthet',title:T,n:1,lede:'Hvorfor flyter en kork, mens en spiker synker? Svaret er massetetthet: hvor mye masse det er i hver kubikkcentimeter.',keyLede:'Massetetthetene og løsningene. Isfjell-svaret er avrundet.',body})});
}

/* ===== Kap 4 Sannsynlighet ===== */
/* 15 Kombinasjonsjakt */
{ const T='Kombinasjonsjakt';
  const C2=(n,k)=>{ let r=1; for(let i=0;i<k;i++) r=r*(n-i)/(i+1); return r; };
  let coins=0; for(let a=0;a<=10;a++) for(let b=0;b<=2;b++) for(let c=0;c<=1;c++) if(a+5*b+10*c===10) coins++;
  const Q=[['Sara har 3 gensere, 4 bukser og 2 par sko. Hvor mange ulike antrekk kan hun lage?',`3 · 4 · 2 = ${3*4*2}`],
    ['En sykkellås har 3 hjul med sifrene 0–9. Hvor mange koder finnes?',`10 · 10 · 10 = ${10**3}`],
    ['En PIN-kode har 4 sifre. Hvor mange koder finnes? Hvor mange hvis alle sifrene må være forskjellige?',`10⁴ = 10 000. Med forskjellige sifre: 10 · 9 · 8 · 7 = ${10*9*8*7}`],
    ['5 løpere er med i en finale. Hvor mange måter kan gull, sølv og bronse fordeles på?',`5 · 4 · 3 = ${5*4*3}`],
    ['6 personer håndhilser på hverandre. Alle hilser på alle én gang. Hvor mange håndtrykk blir det?',`6 · 5 : 2 = ${C2(6,2)}`],
    ['8 lag spiller en serie der alle møter alle én gang. Hvor mange kamper blir det?',`8 · 7 : 2 = ${C2(8,2)}`],
    ['På hvor mange måter kan du lage 10 kr med 1-kroner, 5-kroner og 10-kroner?',`${coins} måter: 10, 5 + 5, 5 + 1 · 5 og 1 · 10`],
    ['Lag et valgtre: Du kaster en mynt to ganger og en terning én gang. Hvor mange utfall finnes?',`2 · 2 · 6 = ${2*2*6}`]];
  const check=()=>{ assert(coins===4,'mynter '+coins); assert(C2(6,2)===15&&C2(8,2)===28,'C'); };
  const body=key=>`<div class="box"><b class="t">Multiplikasjonsprinsippet</b><p>Har du a valg i første steg og b valg i andre steg, finnes det a · b kombinasjoner. Tegn et valgtre eller en tabell når du er usikker.</p></div>
    ${qList(Q.map(q=>[q[0],q[1],2]),key)}
    <h2>Konkurranse</h2><p>Jobb i par. Lag selv en kombinasjonsoppgave som er så vanskelig som mulig, men som dere kan løse. Bytt med et annet par. Hvem løser flest?</p>${key?'<p class="a">Svarene varierer.</p>':'<span class="ln"></span><span class="ln"></span>'}`;
  A.push({id:'kombinasjonsjakt', ch:'9k4', title:T, fit:'9. trinn · Kapittel 4 · Hvor mange blir det?', link:'#9k4-kombinatorikk', topics:['kombinatorikk','utfall'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Antrekk, koder, pallplasser og håndtrykk: tell kombinasjoner.',
    desc:'Åtte oppgaver om å telle kombinasjoner: antrekk, sykkellåser, PIN-koder, pallplasser, håndtrykk, seriekamper, mynter og valgtrær. Avsluttes med en konkurranse der parene lager oppgaver til hverandre.',
    inside:['Side 1: elevark med åtte oppgaver og en konkurranse','Side 2: fasit'], check,
    css:QCSS, pages:sheetPair({eye:'Utforsk · 9. trinn · Kapittel 4 · Hvor mange blir det?',title:T,n:1,lede:'Hvor mange muligheter finnes det? Tell lurt i stedet for å skrive opp alt.',keyLede:'Svarene med utregning.',body})});
}

/* 16 Hesteveddeløpet */
{ const T='Hesteveddeløpet'; const STEPS=8;
  const ways=s=>{ let n=0; for(let a=1;a<=6;a++) for(let b=1;b<=6;b++) if(a+b===s) n++; return n; };
  const check=()=>{ let t=0; for(let s=2;s<=12;s++) t+=ways(s); assert(t===36&&ways(7)===6&&ways(2)===1,'ways'); };
  const board=`<table class="hb"><tr><th>Hest</th>${Array.from({length:STEPS},(_,i)=>`<th>${i+1}</th>`).join('')}<th>Mål</th></tr>${Array.from({length:11},(_,i)=>i+2).map(s=>`<tr><th>${s}</th>${Array.from({length:STEPS},()=>'<td></td>').join('')}<td class="goal">MÅL</td></tr>`).join('')}</table>`;
  const p1=page({eye:'Klasseaktivitet · 9. trinn · Kapittel 4 · Sannsynlighetsregning',title:T,lede:'Elleve hester, nummerert 2–12, løper om kapp. To terninger kastes, og hesten med samme nummer som summen flytter ett felt fram. Hvilken hest vinner oftest, og hvorfor? Varighet: 30 minutter.',
    body:`<h2>Slik spiller dere</h2><ol class="st"><li>Spill i grupper på 3–5 med spillebrettet på side 2 (eller hele klassen med tavleversjonen). Hver elev velger en hest. Flere kan velge samme hest.</li><li>Kast to terninger og legg sammen. Hesten med det nummeret flytter ett felt. Sett et kryss i feltet.</li><li>Hesten som først kommer i mål (${STEPS} felt), vinner. Spill tre løp og noter vinneren hver gang.</li><li>Svar på spørsmålene på side 2 etterpå.</li></ol>
    <div class="box red"><b class="t">Før dere starter</b><p>La alle skrive ned hvilken hest de tror vinner, og hvorfor. Hvorfor vil ingen velge hest nummer 1?</p></div>
    <div class="box"><b class="t">Til læreren: fasit</b><table class="t" style="width:100%"><tr><th>Sum</th>${Array.from({length:11},(_,i)=>`<td>${i+2}</td>`).join('')}</tr><tr><th>Måter</th>${Array.from({length:11},(_,i)=>`<td>${ways(i+2)}</td>`).join('')}</tr><tr><th>P</th>${Array.from({length:11},(_,i)=>{ const w=ways(i+2), g=gcd(w,36); return `<td>${fr(w/g,36/g)}</td>`; }).join('')}</tr></table>
      <p style="margin-top:2mm">Hest 7 har størst sannsynlighet (${fr(1,6)}) for å flytte i hvert kast. Hest 2 og 12 har bare ${fr(1,36)}. Hest 1 kan aldri flytte. Sannsynligheten for å få 6, 7 eller 8 er ${fr(16,36)} = ${fr(4,9)}.</p></div>`,foot:[ft(T),'Side 1 · instruksjoner og fasit']});
  const p2=page({eye:'Klasseaktivitet · Hesteveddeløpet',title:T,small:'spillebrett',body:`${board}<h2>Etter løpet</h2>${qList([['Fyll ut tabellen: hvor mange måter kan du få hver sum med to terninger?','',0],['Hva er sannsynligheten for at hest 7 flytter i ett kast? Og hest 2?','',1],['Hvor stor er sannsynligheten for at hest 6, 7 eller 8 flytter?','',1],['Er spillet rettferdig? Hvordan kan du endre reglene så alle hestene får like stor sjanse?','',2]],false)}
    <table class="t sm"><tr><th>Sum</th>${Array.from({length:11},(_,i)=>`<td>${i+2}</td>`).join('')}</tr><tr><th>Antall måter</th>${Array.from({length:11},()=>'<td></td>').join('')}</tr></table>`,foot:[ft(T),'Side 2 · spillebrett og spørsmål']});
  A.push({id:'hesteveddelopet', ch:'9k4', title:T, fit:'9. trinn · Kapittel 4 · Sannsynlighetsregning', link:'#9k4-flere-hendelser', topics:['en-hendelse','flere-hendelser','multiplikasjonsprinsippet'], thumbs:['Side 1 · instruksjoner','Side 2 · spillebrett'], board:'#hesteveddelop',
    short:'Hester 2–12 løper etter terningsummen. Hvorfor vinner 7 oftest?',
    desc:'Et klassisk spill der elleve hester flytter etter summen av to terninger. Elevene velger hest, spiller flere løp og forklarer etterpå med en utfallstabell hvorfor hest 7 vinner oftest og hest 2 og 12 sjelden. Tavleversjonen lar hele klassen spille sammen.',
    inside:['Side 1: instruksjoner og fasit med sannsynlighetene','Side 2: spillebrett, spørsmål og tabell','Tavleversjon: veddeløp med terninger og teller på smartboard'], check,
    css:QCSS+`.hb{width:100%;border-collapse:collapse;font-size:11pt;margin-bottom:2mm}.hb th,.hb td{border:1px solid #9AA6BD;height:8.6mm;text-align:center}.hb th{background:${C.soft};color:${C.pen};width:12mm}.hb td.goal{width:12mm;background:${C.redsoft}}table.sm{width:100%;margin-top:2mm}table.sm td{height:8mm}`,
    pages:[p1,p2]});
}

/* 17 Den store terningtesten */
{ const T='Den store terningtesten';
  const body=key=>`<p>Er en terning rettferdig? Hvis den er det, skal hvert tall komme omtrent like ofte, altså i ${fr(1,6)} ≈ 16,7 % av kastene. Men hvor mange kast trengs før vi ser det?</p>
    <h2>A · Kast 60 ganger i par</h2><p>Én kaster, én fører. Sett en strek for hvert kast.</p>
    <table class="t mt"><tr><th>Tall</th><th>Strekliste</th><th>Frekvens</th><th>Relativ frekvens</th><th>Prosent</th></tr>${[1,2,3,4,5,6].map(n=>`<tr><th>${n}</th><td style="width:62mm"></td><td></td><td></td><td></td></tr>`).join('')}<tr><th>Sum</th><td></td><td>60</td><td>1</td><td>100 %</td></tr></table>
    <h2>B · Hele klassen</h2><p>Legg sammen resultatene til alle parene (bruk gjerne tavleversjonen). Skriv inn klassens tall.</p>
    <table class="t mt"><tr><th>Tall</th>${[1,2,3,4,5,6].map(n=>`<td>${n}</td>`).join('')}<th>Sum</th></tr><tr><th>Frekvens</th>${[1,2,3,4,5,6].map(()=>'<td></td>').join('')}<td></td></tr><tr><th>Prosent</th>${[1,2,3,4,5,6].map(()=>'<td></td>').join('')}<td>100 %</td></tr></table>
    <h2>C · Tenk etter</h2>${qList([['Fikk dere 10 av hvert tall? Hvorfor ikke?','Nesten aldri. Tilfeldigheter gjør at frekvensene varierer, særlig når det er få kast.'],['Ligger klassens prosenter nærmere 16,7 % enn deres egne? Hvorfor?','Som regel ja. Jo flere kast, jo nærmere kommer den relative frekvensen den teoretiske sannsynligheten (store talls lov).'],['Hvor mange kast tror du trengs for å avsløre en terning som er jukset med?','Det avhenger av hvor mye den er jukset med. Med flere hundre kast blir et lite avvik tydelig.']],key)}`;
  A.push({id:'terningtesten', ch:'9k4', title:T, fit:'9. trinn · Kapittel 4 · Sannsynlighet i praksis', link:'#9k4-stat-sanns', topics:['like-sannsynlig','stat-sanns','simulering'], thumbs:['Side 1 · elevark','Side 2 · fasit'], board:'#frekvenstavle',
    short:'Kast terning, samle klassens resultater og se den relative frekvensen nærme seg 1/6.',
    desc:'Parene kaster en terning 60 ganger og regner ut relativ frekvens. Så samler klassen alle resultatene på tavla og ser at prosentene kommer nærmere 16,7 % jo flere kast det er. Tavleversjonen er en tellertavle med søylediagram som oppdateres mens dere legger inn tall.',
    inside:['Side 1: elevark med strekliste, klassetabell og spørsmål','Side 2: fasit med forklaringer','Tavleversjon: tellertavle med søylediagram og prosent'],
    css:QCSS+`table.mt{width:100%}table.mt td{height:7.6mm}`,
    pages:sheetPair({eye:'Utforsk · 9. trinn · Kapittel 4 · Sannsynlighet i praksis',title:T,n:1,lede:'Et eksperiment for hele klassen. Trenger én terning per par.',keyLede:'Tallene i tabellene varierer. Her er forklaringer til spørsmålene.',body})});
}

module.exports=A;
