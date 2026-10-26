// Klasseaktiviteter 8. trinn
const {C,nf,sg,fr,rng,shuffle,gcd,page,cardPages}=require('./common');
const A=[];
const ft=t=>`Matematikk 8. trinn · ${t}`;
const assert=(c,m)=>{ if(!c) throw new Error(m); };
const ev=s=>Function('"use strict";return ('+s.replace(/·/g,'*').replace(/:/g,'/').replace(/−/g,'-')+')')();

/* ---------- eksisterende ---------- */
A.push({id:'faktoriseringskonkurranse', pdf:'aktiviteter/faktoriseringskonkurranse.pdf', ch:'kap2', title:'Faktoriseringskonkurranse', fit:'8. trinn · Kapittel 2 · Delelighet', link:'#kap2-faktorisering', topics:['faktorisering'],
  short:'To lag konkurrerer om å primtallsfaktorisere flest mulig av tallene fra 1 til 99.',
  desc:'To lag konkurrerer om å primtallsfaktorisere flest mulig av tallene fra 1 til 99. Lagene henter én lapp om gangen, faktoriserer tallet og får svaret godkjent før de henter en ny.',
  inside:['Side 1: instruksjoner, regler, hva som godkjennes, en variant og primtallene under 100','Side 2–14: 99 lapper med tallene 1–99, 8 per ark, klare til å klippe ut']});
A.push({id:'primtallsjakten', pdf:'aktiviteter/primtallsjakten.pdf', ch:'kap2', title:'Primtallsjakten', fit:'8. trinn · Kapittel 2 · Delelighet', link:'#kap2-delelighet', topics:['delelighet'], thumbs:['Side 1 · elevark','Side 2 · fasit'], board:'#primtavle',
  short:'Finn alle primtallene fra 0 til 100 med Eratosthenes’ såld, og utforsk mønstrene.',
  desc:'Elevene finner alle primtallene fra 0 til 100 med Eratosthenes’ såld: de fargelegger 2-, 3-, 5- og 7-gangen, og tallene som blir igjen, er primtallene. Etterpå utforsker de mønstre, tvillingprimtall og summer av primtall.',
  inside:['Side 1: elevark med alle tallene 0–100, fremgangsmåte og seks utforskende spørsmål','Side 2: fasit med ferdig silt tabell, svar og primtallene under 100']});

/* ---------- 1 Jeg har – hvem har? ---------- */
{ const T='Jeg har – hvem har?', R=rng(811), N=32, used=new Set(), seq=[];
  const types=[]; for(let i=0;i<N;i++) types.push(['+','−','·',':'][i%4]); const ty=shuffle(types,R);
  const ri=(a,b)=>a+Math.floor(R()*(b-a+1));
  for(let i=0;i<N;i++){ let v,q,t=ty[i];
    for(let k=0;k<500;k++){
      if(t==='·'){ const a=ri(3,9), b=ri(4,12); v=a*b; q=`${a} · ${b}`; }
      else if(t===':'){ const d=ri(3,9); v=ri(4,15); q=`${v*d} : ${d}`; }
      else if(t==='+'){ v=ri(41,190); const a=ri(12,v-12); q=`${a} + ${v-a}`; }
      else { v=ri(6,95); const b=ri(15,90); q=`${v+b} − ${b}`; }
      if(!used.has(v)) break; }
    used.add(v); seq.push({v,q}); }
  const check=()=>{ assert(new Set(seq.map(s=>s.v)).size===N,'unike verdier'); seq.forEach(s=>assert(ev(s.q)===s.v,'feil '+s.q)); };
  const cards=seq.map((s,i)=>{ const nx=seq[(i+1)%N]; return `<span class="nr">${i+1}</span><div class="jh"><span>Jeg har</span><b>${s.v}</b></div><div class="hh"><span>Hvem har</span><b>${nx.q} ?</b></div>`; });
  const list=seq.map((s,i)=>`<li><b>${i+1}.</b> Jeg har ${s.v}. Hvem har ${seq[(i+1)%N].q}? <span class="a">→ ${seq[(i+1)%N].v}</span></li>`).join('');
  const p1=page({eye:'Klasseaktivitet · 8. trinn · Kapittel 1 · De fire regneartene',title:T,lede:'Hele klassen lager én lang regnekjede. Alle har et kort, alle må regne med på hvert spørsmål, og den som har svaret, svarer. Varighet: 10–15 minutter.',
    body:`<h2>Forberedelser</h2><ol class="st"><li>Skriv ut side 2–5. Det er ${N} kort, 8 på hvert ark.</li><li>Klipp kortene langs de stiplede linjene og bland dem.</li><li>Del ut alle kortene. Er dere færre enn ${N}, får noen elever to kort.</li></ol>
    <h2>Slik spiller dere</h2><ol class="st"><li>Eleven med kort 1 begynner og leser høyt: «Hvem har …?»</li><li>Alle regner i hodet. Den som har svaret på kortet sitt, sier «Jeg har …» og leser så sitt eget spørsmål.</li><li>Slik fortsetter kjeden til den er tilbake ved kort 1.</li><li>Ta tiden. Neste gang prøver klassen å slå rekorden.</li></ol>
    <div class="box red"><b class="t">Tips</b><ul class="st"><li>Be alle skrive svaret på et kladdeark før den riktige eleven svarer. Da regner alle hver gang.</li><li>Stopp opp ved et vanskelig stykke og spør: «Hvordan regnet du det?»</li></ul></div>
    <div class="box"><b class="t">Til læreren: hele kjeden</b><ol class="kj">${list}</ol></div>`,foot:[ft(T),'Side 1 · instruksjoner']});
  A.push({id:'hvem-har-regning', ch:'kap1', title:T, fit:'8. trinn · Kapittel 1 · De fire regneartene', link:'#kap1-addisjon', topics:['addisjon','multiplikasjon','divisjon'],
    short:'Hele klassen lager en regnekjede med kort: «Jeg har 56. Hvem har 72 : 8?»',
    desc:`Hele klassen lager én lang regnekjede med ${N} kort i addisjon, subtraksjon, multiplikasjon og divisjon. Alle regner med på hvert spørsmål, og klassen kan ta tiden og prøve å slå rekorden.`,
    inside:['Side 1: instruksjoner, tips og hele kjeden med svar til læreren',`Side 2–5: ${N} kort, 8 per ark, klare til å klippe ut`], check,
    css:`.jh,.hh{display:flex;flex-direction:column;align-items:center;width:100%}.jh{flex:1;justify-content:center;border-bottom:1.5px solid ${C.line}}.jh span,.hh span{font:400 9pt "JetBrains Mono",monospace;text-transform:uppercase;letter-spacing:.06em;color:${C.muted}}.jh b{font:800 34pt "Bricolage Grotesque";color:${C.pen}}.hh{flex:1;justify-content:center}.hh b{font-size:20pt}
      ol.kj{columns:2;column-gap:6mm;margin:0;padding:0;list-style:none;font-size:8.6pt;line-height:1.42}ol.kj li{break-inside:avoid}`,
    pages:[p1,...cardPages({cards,cols:2,rows:4,eye:'Klasseaktivitet · Jeg har – hvem har?',title:T,foot:ft(T),start:2,label:'kort'})]});
}

/* ---------- 2 Fire firere ---------- */
{ const T='Fire firere';
  // brute force: alle uttrykk med fire 4-tall (også 44), + − · : og parenteser
  const Fr=(n,d=1)=>{ if(d<0){n=-n;d=-d;} const g=gcd(n,d)||1; return [n/g,d/g]; };
  const op={ '+':(a,b)=>Fr(a[0]*b[1]+b[0]*a[1],a[1]*b[1]), '−':(a,b)=>Fr(a[0]*b[1]-b[0]*a[1],a[1]*b[1]), '·':(a,b)=>Fr(a[0]*b[0],a[1]*b[1]), ':':(a,b)=>b[0]===0?null:Fr(a[0]*b[1],a[1]*b[0]) };
  const prec={'+':1,'−':1,'·':2,':':2};
  const combine=(L,R)=>{ const out=[]; for(const l of L) for(const r of R) for(const o of Object.keys(op)){ const v=op[o](l.v,r.v); if(!v) continue;
      const ls=l.p<prec[o]?`(${l.s})`:l.s, rs=(r.p<prec[o]||(r.p===prec[o]&&(o==='−'||o===':')))?`(${r.s})`:r.s; out.push({v,s:`${ls} ${o} ${rs}`,p:prec[o],c:l.c+r.c}); } return out; };
  const memo={}; const all=ops=>{ const k=ops.join(','); if(memo[k]) return memo[k]; let res=[];
    if(ops.length===1) res=[{v:[ops[0],1],s:String(ops[0]),p:3,c:ops[0]===44?1:0}];
    else for(let i=1;i<ops.length;i++) res=res.concat(combine(all(ops.slice(0,i)),all(ops.slice(i))));
    // behold beste per verdi
    const best={}; for(const e of res){ const kk=e.v.join('/'); const b=best[kk]; const sc=e.c*100+e.s.length; if(!b||sc<b.c*100+b.s.length) best[kk]=e; } return memo[k]=Object.values(best); };
  const sols={}; for(const ops of [[4,4,4,4],[44,4,4],[4,44,4],[4,4,44],[44,44]]) for(const e of all(ops)){ if(e.v[1]!==1) continue; const n=e.v[0]; if(n<0||n>20) continue; const b=sols[n]; if(!b||e.c*100+e.s.length<b.c*100+b.s.length) sols[n]=e; }
  const missing=[]; for(let n=0;n<=20;n++) if(!sols[n]) missing.push(n);
  const PAR=[['3 + 4 · 5 − 2','33','(3 + 4) · 5 − 2'],['20 − 8 − 2','14','20 − (8 − 2)'],['6 · 5 − 3 + 1','13','6 · (5 − 3) + 1'],['48 : 4 + 2 · 3','24','48 : (4 + 2) · 3'],['2 + 3 · 4 + 5','45','(2 + 3) · (4 + 5)'],['100 − 10 · 4 + 5','10','100 − 10 · (4 + 5)']];
  const check=()=>{ for(let n=0;n<=20;n++) if(sols[n]) assert(Math.abs(ev(sols[n].s)-n)<1e-9,'4444 '+n); PAR.forEach(([a,t,s])=>{ assert(ev(s)===+t,'par '+s); assert(ev(a)!==+t,'uten par '+a); assert(s.replace(/[()]/g,'')===a,'samme tall '+s); }); };
  const rows=(a,b,key)=>{ let h=''; for(let n=a;n<=b;n++) h+=`<div class="ff"><b>${n}</b><span>=</span>${key?`<span class="a">${sols[n]?sols[n].s:'—'}</span>`:'<span class="w"></span>'}</div>`; return h; };
  const sheet=key=>page({eye:(key?'Fasit · ':'')+'Utforsk · 8. trinn · Kapittel 1 · Regning med flere ledd',title:T,key,
    lede:key?`Det finnes ofte mange riktige svar. Her er ett forslag til hvert tall. ${missing.length?`Tallene ${missing.join(', ')} går ikke med disse reglene.`:''}`:'Kan du lage alle tallene fra 0 til 20 med nøyaktig fire 4-tall? Du kan bruke +, −, · og :, og så mange parenteser du vil. Du kan også sette to firere sammen til 44.',
    body:`${key?'':`<div class="box"><b class="t">Eksempel</b><p>4 + 4 − 4 − 4 = 0 &nbsp; og &nbsp; (4 + 4) : (4 + 4) = 1. Husk regnerekkefølgen: parenteser først, så ganging og deling, så pluss og minus.</p></div>`}
    <h2>A · Lag tallene 0–20</h2><div class="ffg"><div>${rows(0,10,key)}</div><div>${rows(11,20,key)}</div></div>
    <h2>B · Sett inn parenteser så svaret blir riktig</h2><div class="pq">${PAR.map(([a,t,s],i)=>`<div><b>${i+1}</b>${key?`<span class="a">${s} = ${t}</span>`:`<span>${a} = ${t}</span>`}</div>`).join('')}</div>
    <h2>C · Tenk etter</h2><p>Hvilke tall klarte du ikke å lage? Tror du det er umulig? Forklar.</p>${key?`<p class="a">${missing.length?`${missing.join(', ')} kan ikke lages med fire 4-tall, +, −, · og : (heller ikke med 44). Det kan vises ved å prøve alle muligheter, for eksempel med et dataprogram.`:'Alle tallene fra 0 til 20 kan lages.'}</p>`:'<span class="ln"></span><span class="ln"></span>'}`,
    foot:[ft(T),key?'Side 2 · fasit til læreren':'Side 1 · elevark']});
  A.push({id:'fire-firere', ch:'kap1', title:T, fit:'8. trinn · Kapittel 1 · Regning med flere ledd', link:'#kap1-flere-ledd', topics:['flere-ledd'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Lag tallene 0–20 med fire 4-tall og regnerekkefølgen.',
    desc:'Et klassisk mattepuslespill: elevene prøver å lage alle tallene fra 0 til 20 med nøyaktig fire 4-tall, de fire regneartene og parenteser. Etterpå setter de inn parenteser for å få riktige svar.',
    inside:['Side 1: elevark med tallene 0–20, parentesoppgaver og et spørsmål til diskusjon','Side 2: fasit med ett forslag til hvert tall, regnet ut med datamaskin'], check, meta:{missing},
    css:`.ffg{display:grid;grid-template-columns:1fr 1fr;gap:0 8mm}.ff{display:flex;gap:2.5mm;align-items:flex-end;height:7.4mm;font-size:11pt}.ff b{width:7mm;text-align:right}.ff .w{flex:1;border-bottom:1px solid #B9C2D3;height:5mm}.ff .a{font-size:10.3pt}
      .pq{display:grid;grid-template-columns:1fr 1fr;gap:2.5mm 8mm;font-size:11.5pt}.pq div{display:flex;gap:3mm}.pq b{color:${C.pen}}`,
    pages:[sheet(false),sheet(true)]});
}

/* ---------- 3 Temperaturbingo ---------- */
{ const T='Temperaturbingo', R=rng(83), ri=(a,b)=>a+Math.floor(R()*(b-a+1));
  const vals=[]; for(let v=-10;v<=10;v++) vals.push(v);
  const kinds=shuffle(['add','add','sub','sub','sub2','temp','temp','temp','mul','mul','div','div','mid','add','sub','temp','mul','div','sub2','add','sub'],R);
  const tasks=vals.map((v,i)=>{ const k=kinds[i]; let q,e;
    for(let t=0;t<200;t++){
      if(k==='add'){ const a=ri(-12,12); const b=v-a; if(a>=0&&b>=0) continue; q=`${nf(a)} + ${sg(b)}`; e=`${a}+(${b})`; }
      else if(k==='sub'){ const b=ri(2,12); const a=v+b; q=`${nf(a)} − ${b}`; e=`${a}-${b}`; if(a>=0&&v>=0) continue; }
      else if(k==='sub2'){ const b=-ri(2,9); const a=v+b; q=`${nf(a)} − ${sg(b)}`; e=`${a}-(${b})`; }
      else if(k==='temp'){ const d=ri(2,9); if(R()<.5){ const a=v-d; q=`Temperaturen er ${nf(a)} °C og stiger ${d} grader. Hva blir temperaturen?`; e=`${a}+${d}`; } else { const a=v+d; q=`Temperaturen er ${nf(a)} °C og synker ${d} grader. Hva blir temperaturen?`; e=`${a}-${d}`; } }
      else if(k==='mul'){ const ds=[2,3,4,5].filter(d=>v%d===0&&v!==0); if(!ds.length){ const a=ri(2,9); q=`${sg(-a)} · 0`; e=`${-a}*0`; if(v!==0) { q=null; break; } } else { const d=ds[ri(0,ds.length-1)]; const a=v/d; const neg=R()<.5; q=neg?`${sg(-a)} · ${sg(-d)}`:`${nf(a)} · ${d}`; e=neg?`(${-a})*(${-d})`:`${a}*${d}`; } }
      else if(k==='div'){ const d=ri(2,5); const neg=R()<.5; q=neg?`${sg(-v*d)} : ${sg(-d)}`:`${sg(v*d)} : ${d}`; e=neg?`(${-v*d})/(${-d})`:`(${v*d})/${d}`; }
      else if(k==='mid'){ const d=ri(2,8); q=`Hvilket tall ligger midt mellom ${nf(v-d)} og ${nf(v+d)}?`; e=`((${v-d})+(${v+d}))/2`; }
      if(q) break; }
    if(!q){ const b=ri(2,9); q=`${nf(v-b)} + ${b}`; e=`${v-b}+${b}`; }
    return {v,q,e}; });
  const order=shuffle(tasks,R);
  const boards=[]; for(let i=0;i<16;i++) boards.push(shuffle(vals,R).slice(0,9).sort((a,b)=>a-b));
  const check=()=>{ tasks.forEach(t=>assert(Math.abs(Function('return '+t.e)()-t.v)<1e-9,'bingo '+t.q)); assert(new Set(boards.map(b=>b.join())).size===16,'like brett'); };
  const p1=page({eye:'Klasseaktivitet · 8. trinn · Kapittel 1 · Negative tall',title:T,lede:'Bingo med negative tall. Læreren leser opp oppgaver, elevene regner og krysser av svaret hvis det står på brettet. Varighet: 15–20 minutter.',
    body:`<h2>Slik spiller dere</h2><ol class="st"><li>Skriv ut side 2–5 og klipp ut brettene. Hver elev (eller hvert par) får ett brett. Alle 16 brettene er forskjellige.</li><li>Læreren leser opp én oppgave om gangen fra listen under og skriver den gjerne på tavla.</li><li>Elevene regner. Står svaret på brettet, setter de kryss.</li><li>Den som først har tre kryss på rad (vannrett, loddrett eller på skrå), roper «Bingo!» og forklarer hvordan hen regnet.</li><li>Spill videre til noen har fullt brett.</li></ol>
    <div class="box red"><b class="t">Tips</b><p>Bruk tallinja på tavla (tavleversjonen) når elevene er uenige. Tegn hoppene og se hvor dere lander.</p></div>
    <div class="box"><b class="t">Til læreren: oppleserliste (les i denne rekkefølgen)</b><ol class="kj">${order.map((t,i)=>`<li><b>${i+1}.</b> ${t.q} <span class="a">→ ${nf(t.v)}</span></li>`).join('')}</ol></div>`,foot:[ft(T),'Side 1 · instruksjoner og oppleserliste']});
  const cards=boards.map((b,i)=>`<div class="bb"><div class="bh"><b>Temperaturbingo</b><span>Brett ${i+1}</span></div><div class="bg">${b.map(v=>`<div>${nf(v)}</div>`).join('')}</div></div>`);
  A.push({id:'temperaturbingo', ch:'kap1', title:T, fit:'8. trinn · Kapittel 1 · Negative tall', link:'#kap1-negative-tall', topics:['negative-tall'], board:'#tallinje',
    short:'Bingo der svarene er negative og positive tall. Med tallinje på tavla.',
    desc:'Læreren leser opp 21 oppgaver med negative tall: pluss og minus, ganging og deling, temperaturer og tallet midt mellom to tall. Elevene krysser av svarene på bingobrettet sitt. Tavleversjonen er en tallinje der dere tegner hoppene sammen.',
    inside:['Side 1: instruksjoner og oppleserliste med svar','Side 2–5: 16 ulike bingobrett, 4 per ark','Tavleversjon: interaktiv tallinje med punkter og hopp'], check,
    css:`ol.kj{columns:2;column-gap:6mm;margin:0;padding:0;list-style:none;font-size:8.8pt;line-height:1.4}ol.kj li{break-inside:avoid;margin-bottom:.6mm}
      .bb{width:100%;height:100%;display:flex;flex-direction:column;gap:3mm;padding:2mm}.bh{display:flex;justify-content:space-between;align-items:baseline}.bh b{font:800 15pt "Bricolage Grotesque";color:${C.pen}}.bh span{font:400 9pt "JetBrains Mono",monospace;color:${C.muted}}
      .bg{flex:1;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);border:2px solid ${C.ink}}.bg div{border:1px solid #9AA6BD;display:grid;place-items:center;font:700 26pt "Atkinson Hyperlegible"}`,
    pages:[p1,...cardPages({cards,cols:2,rows:2,eye:'Klasseaktivitet · Temperaturbingo',title:T,foot:ft(T),start:2,label:'bingobrett'})]});
}

/* ---------- 4 Potensmemory ---------- */
{ const T='Potensmemory', R=rng(84);
  const P=(g,e)=>`${g}<sup>${e}</sup>`;
  const pairs=[ [P(2,3),'8',8,8],[P(3,2),'9',9,9],[P(2,5),'32',32,32],[P(3,4),'81',81,81],[P(4,3),'64',64,64],[P(5,3),'125',125,125],[P(6,2),'36',36,36],[P(7,2),'49',49,49],
    [P(10,4),'10 000',1e4,1e4],[P(10,6),'1 000 000',1e6,1e6],[P(11,2),'121',121,121],[P(2,8),'256',256,256],
    [`${P(2,3)} · ${P(2,4)}`,P(2,7),2**3*2**4,2**7],[`${P(5,6)} : ${P(5,2)}`,P(5,4),5**6/5**2,5**4],[`${P(10,7)} : ${P(10,4)}`,P(10,3),1e7/1e4,1e3],[`${P(10,3)} · ${P(10,2)}`,P(10,5),1e3*1e2,1e5],[P(7,0),'1',7**0,1],['4 · 4 · 4 · 4 · 4',P(4,5),4**5,4**5] ];
  const check=()=>{ pairs.forEach(p=>assert(p[2]===p[3],'par '+p[0])); assert(new Set(pairs.map(p=>p[2])).size===pairs.length,'like verdier'); };
  const cards=shuffle(pairs.flatMap((p,i)=>[{h:p[0],i},{h:p[1],i}]),R).map(c=>`<b class="pm">${c.h}</b>`);
  const p1=page({eye:'Klasseaktivitet · 8. trinn · Kapittel 1 · Potenser',title:T,lede:'Memory i grupper på 3–4 elever. Elevene finner par som har samme verdi: en potens og svaret, eller et regnestykke med potenser og én potens. Varighet: 15–20 minutter.',
    body:`<h2>Forberedelser</h2><ol class="st"><li>Skriv ut side 2–4 til hver gruppe, gjerne på tykt papir så tallene ikke synes gjennom. Det er ${pairs.length} par, altså ${pairs.length*2} kort.</li><li>Klipp ut kortene, bland dem og legg dem med baksiden opp i et rutenett.</li></ol>
    <h2>Slik spiller dere</h2><ol class="st"><li>Den første snur to kort. Har de samme verdi, er det et par. Eleven må si høyt hvorfor, for eksempel «2³ er 2 · 2 · 2, og det er 8».</li><li>Er gruppen enig, beholder eleven paret og snur to nye. Ellers snus kortene tilbake, og neste elev prøver.</li><li>Den som har flest par til slutt, vinner.</li></ol>
    <div class="box red"><b class="t">Vanlige feil å se etter</b><ul class="st"><li>2³ er ikke 2 · 3 = 6. Riktig er 2 · 2 · 2 = 8.</li><li>Ved ganging med samme grunntall legger vi sammen eksponentene. Ved deling trekker vi fra.</li><li>7⁰ = 1. Alle tall unntatt 0 opphøyd i 0 er 1.</li></ul></div>
    <div class="box"><b class="t">Til læreren: alle parene</b><div class="kj">${pairs.map(p=>`<span>${p[0]} = ${p[1]}</span>`).join('')}</div></div>
    <p><b>Variant:</b> Legg alle kortene med forsiden opp. Hvem finner flest par på to minutter?</p>`,foot:[ft(T),'Side 1 · instruksjoner']});
  A.push({id:'potensmemory', ch:'kap1', title:T, fit:'8. trinn · Kapittel 1 · Potenser', link:'#kap1-potenser', topics:['potenser','potensregler'],
    short:'Memory med potenser: finn par med samme verdi.',
    desc:`Memory i grupper med ${pairs.length} par: potenser og svarene deres, og regnestykker med samme grunntall og potensen de blir. Elevene må forklare hvert par høyt før de får beholde det.`,
    inside:['Side 1: instruksjoner, vanlige feil og alle parene',`Side 2–4: ${pairs.length*2} memorykort, 12 per ark`], check,
    css:`.pm{font:700 22pt "Atkinson Hyperlegible";white-space:nowrap}.kj{display:grid;grid-template-columns:repeat(3,1fr);gap:1.4mm 4mm;font-size:10pt}`,
    pages:[p1,...cardPages({cards,cols:3,rows:4,eye:'Klasseaktivitet · Potensmemory',title:T,foot:ft(T),start:2,label:'memorykort'})]});
}

/* ---------- 5 Brøkveggen ---------- */
{ const T='Brøkveggen', ROWS=[1,2,3,4,5,6,8,10,12];
  const wall=(lbl)=>{ const W=176, h=8.6; let s=`<svg viewBox="0 0 ${W} ${ROWS.length*h}" width="${W}mm" height="${ROWS.length*h}mm" class="wall">`;
    ROWS.forEach((n,r)=>{ for(let k=0;k<n;k++){ const x=k*W/n; s+=`<rect x="${x}" y="${r*h}" width="${W/n}" height="${h}" fill="${['#fff',C.soft][r%2]}" stroke="${C.ink}" stroke-width=".35"/>`;
      s+=n===1?`<text x="${W/2}" y="${r*h+h*.68}" text-anchor="middle" font-size="4.6" font-weight="700">1</text>`:`<text x="${x+W/n/2}" y="${r*h+h*.42}" text-anchor="middle" font-size="${n>=10?2.7:3.3}" font-weight="700">1</text><line x1="${x+W/n/2-(n>=10?1.6:2)}" x2="${x+W/n/2+(n>=10?1.6:2)}" y1="${r*h+h*.5}" y2="${r*h+h*.5}" stroke="${C.ink}" stroke-width=".3"/><text x="${x+W/n/2}" y="${r*h+h*.84}" text-anchor="middle" font-size="${n>=10?2.7:3.3}" font-weight="700">${n}</text>`; } });
    return s+'</svg>'; };
  const Q=[['Finn minst tre brøker på veggen som er like store som '+fr(1,2)+'.',`${fr(2,4)}, ${fr(3,6)}, ${fr(4,8)}, ${fr(5,10)}, ${fr(6,12)}`],
    ['Finn to brøker som er like store som '+fr(2,3)+'.',`${fr(4,6)} og ${fr(8,12)}`],
    ['Hvilken brøk er størst: '+fr(2,3)+' eller '+fr(3,4)+'? Hvor stor er forskjellen?',`${fr(3,4)} er størst. Forskjellen er ${fr(1,12)}.`],
    ['Ordne brøkene fra minst til størst: '+fr(3,5)+', '+fr(1,2)+', '+fr(2,3)+', '+fr(5,8)+'.',`${fr(1,2)}, ${fr(3,5)}, ${fr(5,8)}, ${fr(2,3)}`],
    ['Hvilke brøker på veggen er like store som 0,25? Og som 0,2?',`0,25 = ${fr(1,4)} = ${fr(2,8)} = ${fr(3,12)}. 0,2 = ${fr(1,5)} = ${fr(2,10)}`],
    ['Skriv '+fr(3,10)+' og '+fr(3,4)+' som desimaltall og prosent.',`${fr(3,10)} = 0,3 = 30 % og ${fr(3,4)} = 0,75 = 75 %`],
    ['Finn to brøker med ulik nevner som til sammen blir 1.',`For eksempel ${fr(1,2)} + ${fr(2,4)}, ${fr(1,3)} + ${fr(4,6)} eller ${fr(3,4)} + ${fr(2,8)}`],
    ['Hvorfor blir brikkene mindre jo større nevneren er?','Når nevneren er større, deles den samme helheten i flere like store deler. Da blir hver del mindre.']];
  const check=()=>{ const o=[[3,5],[1,2],[2,3],[5,8]].sort((a,b)=>a[0]/a[1]-b[0]/b[1]).map(x=>x.join('/')).join(); assert(o==='1/2,3/5,5/8,2/3','ordning'); assert(Math.abs(3/4-2/3-1/12)<1e-12,'diff'); };
  const sheet=key=>page({eye:(key?'Fasit · ':'')+'Utforsk · 8. trinn · Kapittel 2 · Brøk',title:T,key,lede:key?'Svar på spørsmålene. Elevene kan finne svarene ved å holde en linjal loddrett over veggen.':'Hver rad er én hel, delt i like store deler. Legg en linjal loddrett over veggen for å sammenligne brøker. Fargelegg gjerne brikkene du bruker.',
    body:`${wall()}<h2>Utforsk</h2><ol class="q">${Q.map(([q,a])=>`<li><span>${q}</span>${key?`<span class="a">${a}</span>`:'<span class="ln"></span>'}</li>`).join('')}</ol>`,foot:[ft(T),key?'Side 2 · fasit til læreren':'Side 1 · elevark']});
  A.push({id:'brokveggen', ch:'kap2', title:T, fit:'8. trinn · Kapittel 2 · Brøk', link:'#kap2-forkorting', topics:['forkorting','brok-desimal'], thumbs:['Side 1 · elevark','Side 2 · fasit'], board:'#brokvegg',
    short:'Utforsk like store brøker, sammenligning og desimaltall med en brøkvegg.',
    desc:'Elevene bruker en brøkvegg til å finne like store brøker, sammenligne og ordne brøker, og koble brøker til desimaltall og prosent. Tavleversjonen er en brøkvegg dere fargelegger sammen, med en flyttbar linjal.',
    inside:['Side 1: elevark med brøkvegg og åtte utforskende spørsmål','Side 2: fasit','Tavleversjon: interaktiv brøkvegg med farger, linjal og visning som brøk, desimaltall eller prosent'], check,
    css:`.wall{display:block;margin:1mm auto 0;font-family:"Atkinson Hyperlegible"}ol.q{margin:0;padding-left:6mm;font-size:10.3pt;line-height:1.35}ol.q li{margin-bottom:1.4mm}ol.q li::marker{color:${C.pen};font-weight:700}ol.q .a{display:block}ol.q .ln{height:7mm}`,
    pages:[sheet(false),sheet(true)]});
}

/* ---------- 6 Brøkstafetten ---------- */
{ const T='Brøkstafetten';
  const F=(n,d)=>{ const g=gcd(n,d); return [n/g,d/g]; };
  const show=([n,d])=>d===1?String(n):(n>d?`${fr(n,d)} = ${Math.floor(n/d)} ${fr(n%d,d)}`:fr(n,d));
  const add=(a,b,c,d)=>F(a*d+c*b,b*d), sub=(a,b,c,d)=>F(a*d-c*b,b*d), mul=(a,b,c,d)=>F(a*c,b*d), div=(a,b,c,d)=>F(a*d,b*c);
  const t=[ // [etappe, oppgave, svar]
    [1,`${fr(2,7)} + ${fr(3,7)}`,add(2,7,3,7)],[1,`${fr(5,8)} − ${fr(1,8)}`,sub(5,8,1,8)],[1,`${fr(1,2)} + ${fr(1,4)}`,add(1,2,1,4)],[1,`${fr(2,3)} − ${fr(1,6)}`,sub(2,3,1,6)],[1,`${fr(3,4)} + ${fr(2,5)}`,add(3,4,2,5)],
    [2,`3 · ${fr(2,5)}`,mul(3,1,2,5)],[2,`${fr(2,3)} · ${fr(3,4)}`,mul(2,3,3,4)],[2,`${fr(1,2)} · ${fr(4,9)}`,mul(1,2,4,9)],[2,`${fr(5,6)} · 3`,mul(5,6,3,1)],[2,`${fr(3,8)} av 40`,mul(3,8,40,1)],
    [3,`${fr(3,4)} : 3`,div(3,4,3,1)],[3,`6 : ${fr(2,3)}`,div(6,1,2,3)],[3,`${fr(2,5)} : ${fr(4,5)}`,div(2,5,4,5)],[3,`${fr(3,4)} : ${fr(1,8)}`,div(3,4,1,8)],[3,`${fr(5,6)} : ${fr(2,3)}`,div(5,6,2,3)],
    [4,`Ida spiser ${fr(1,3)} av en pizza og Jonas ${fr(1,4)}. Hvor stor del av pizzaen har de spist til sammen?`,add(1,3,1,4)],
    [4,`En flaske har ${fr(3,4)} liter saft. Hvor mange glass à ${fr(1,8)} liter kan du fylle?`,div(3,4,1,8)],
    [4,`Halvparten av de 28 elevene i klassen går på tur. ${fr(1,4)} av dem som går på tur, sykler. Hvor mange sykler?`,mul(1,4,14,1)],
    [4,`1 ${fr(1,2)} + ${fr(2,3)}`,add(3,2,2,3)],
    [4,`(${fr(1,2)} + ${fr(1,3)}) · 6`,mul(...add(1,2,1,3),6,1)]];
  const check=()=>{ const exp=['5/7','1/2','3/4','1/2','23/20','6/5','1/2','2/9','5/2','15/1','1/4','9/1','1/2','6/1','5/4','7/12','6/1','7/2','13/6','5/1'];
    t.forEach((x,i)=>assert(x[2].join('/')===exp[i],'stafett '+(i+1)+' '+x[2].join('/'))); };
  // NB: oppgave 18: 1/4 av 14 = 7/2 er ikke helt — bytt til 1/7
  t[17]=[4,`Halvparten av de 28 elevene i klassen går på tur. ${fr(1,7)} av dem som går på tur, sykler. Hvor mange sykler?`,mul(1,7,14,1)];
  const check2=()=>{ const exp=['5/7','1/2','3/4','1/2','23/20','6/5','1/2','2/9','5/2','15/1','1/4','9/1','1/2','6/1','5/4','7/12','6/1','2/1','13/6','5/1'];
    t.forEach((x,i)=>assert(x[2].join('/')===exp[i],'stafett '+(i+1)+' '+x[2].join('/'))); };
  const ET=['','Pluss og minus','Ganging','Deling','Blandet og tekst'];
  const cards=t.map((x,i)=>`<span class="tag">Etappe ${x[0]} · ${ET[x[0]]}</span><span class="nr">Kort ${i+1}</span><b class="sn">${i+1}</b><div class="sq${x[1].length>120?' long':''}">${x[1]}</div>`);
  const p1=page({eye:'Klasseaktivitet · 8. trinn · Kapittel 2 · Regning med brøk',title:T,lede:'Lagkonkurranse i fire etapper. Laget løser ett kort om gangen, får svaret godkjent og henter neste kort. Det laget som først er ferdig med kort 20, vinner. Varighet: 25–35 minutter.',
    body:`<h2>Forberedelser</h2><ol class="st"><li>Del klassen i lag på 3–4 elever. Skriv ut side 2–4 én gang per lag og klipp ut kortene.</li><li>Legg hvert lags kort i en bunke i rekkefølge, med kort 1 øverst, på kateteret.</li></ol>
    <h2>Slik spiller dere</h2><ol class="st"><li>Én elev fra laget henter kort 1. Laget regner sammen og skriver utregningen på et ark.</li><li>En ny elev går med svaret til læreren. Er det riktig, får laget neste kort. Er det feil, må laget prøve igjen.</li><li>Svar skal være forkortet så langt det går. Uekte brøker kan også skrives som blandet tall.</li></ol>
    <div class="box"><b class="t">Til læreren: fasit</b><div class="kj">${t.map((x,i)=>`<span><b>${i+1}.</b> ${show(x[2])}</span>`).join('')}</div></div>
    <p><b>Variant:</b> Gi ett poeng for hvert kort, og stopp etter 20 minutter. Lag som er raske, kan få kortene fra etappe 4 som bonus.</p>`,foot:[ft(T),'Side 1 · instruksjoner og fasit']});
  A.push({id:'brokstafetten', ch:'kap2', title:T, fit:'8. trinn · Kapittel 2 · Regning med brøk', link:'#kap2-brok-add', topics:['brok-add','brok-mul','brok-div'],
    short:'Lagstafett med 20 brøkkort i fire etapper: pluss og minus, ganging, deling og tekst.',
    desc:'Lagene løser 20 kort i rekkefølge: addisjon og subtraksjon, multiplikasjon, divisjon og til slutt blandede oppgaver og tekstoppgaver. Hvert svar må godkjennes av læreren før laget får neste kort.',
    inside:['Side 1: instruksjoner og fasit','Side 2–4: 20 oppgavekort, 8 per ark (ett sett per lag)'], check:check2,
    css:`.sn{font:800 30pt "Bricolage Grotesque";color:${C.pen};line-height:1;margin-bottom:2mm}.sq{font-size:17pt;line-height:1.45;max-width:78mm}.sq.long{font-size:12pt}.sq .frac{font-size:.95em}.kj{display:grid;grid-template-columns:repeat(4,1fr);gap:2.4mm 4mm;font-size:10.5pt;align-items:center}`,
    pages:[p1,...cardPages({cards,cols:2,rows:4,eye:'Klasseaktivitet · Brøkstafetten',title:T,foot:ft(T),start:2,label:'oppgavekort'})]});
}

/* ---------- 7 Algebradomino ---------- */
{ const T='Algebradomino';
  const sq='<sup>2</sup>', cu='<sup>3</sup>';
  const D=[ ['3x + 2x','5x',x=>3*x+2*x,x=>5*x,'x'],['7a − 2a + a','6a',a=>7*a-2*a+a,a=>6*a,'a'],['2(x + 3)','2x + 6',x=>2*(x+3),x=>2*x+6,'x'],['4 · 3a','12a',a=>12*a,a=>12*a,'a'],['x + x + x + x','4x',x=>4*x,x=>4*x,'x'],
    ['5x + 3 − 2x + 1','3x + 4',x=>5*x+3-2*x+1,x=>3*x+4,'x'],['3(2x − 1)','6x − 3',x=>3*(2*x-1),x=>6*x-3,'x'],['12x : 4','3x',x=>12*x/4,x=>3*x,'x'],['det dobbelte av x pluss 5','2x + 5',x=>2*x+5,x=>2*x+5,'x'],['x · x · x','x'+cu,x=>x*x*x,x=>x**3,'x'],
    ['3x · 2x','6x'+sq,x=>3*x*2*x,x=>6*x*x,'x'],['8a − (3a + 2)','5a − 2',a=>8*a-(3*a+2),a=>5*a-2,'a'],['4 mindre enn tre ganger x','3x − 4',x=>3*x-4,x=>3*x-4,'x'],['a + 2a + 3a + 4','6a + 4',a=>a+2*a+3*a+4,a=>6*a+4,'a'],['2(x + 1) + 3(x − 1)','5x − 1',x=>2*(x+1)+3*(x-1),x=>5*x-1,'x'],
    ['x'+sq+' + 3x'+sq,'4x'+sq,x=>x*x+3*x*x,x=>4*x*x,'x'],['halvparten av 8a','4a',a=>8*a/2,a=>4*a,'a'],['6x + 4 − 6x','4',x=>6*x+4-6*x,x=>4,'x'],['(x + 5) − (x − 2)','7',x=>(x+5)-(x-2),x=>7,'x'],['9x − 4x − 5x','0',x=>9*x-4*x-5*x,x=>0,'x'] ];
  const check=()=>{ const pts=[-3,-1.5,0.5,2,3.7]; D.forEach((d,i)=>{ pts.forEach(p=>assert(Math.abs(d[2](p)-d[3](p))<1e-9,'domino '+d[0]));
      D.forEach((e,j)=>{ if(i!==j&&e[4]===d[4]) assert(pts.some(p=>Math.abs(d[2](p)-e[3](p))>1e-9),'tvetydig '+d[0]+' / '+e[1]); }); }); };
  const N=D.length; // brikke k: [svar k | oppgave k+1]
  const order=[0,7,3,12,5,16,9,1,18,10,14,2,6,13,4,19,11,8,15,17]; // rekkefølge i kjeden (blandet)
  const cards=order.map((k,i)=>{ const nx=order[(i+1)%N]; return `<div class="dm"><div class="dl"><span>Svar</span><b>${D[k][1]}</b></div><div class="dr"><span>Forenkle</span><b>${D[nx][0].replace(/\(([^)]*)\)/g,m=>m.replace(/ /g,'&nbsp;'))}</b></div></div>`; });
  const R=rng(87); const printed=shuffle(cards,R);
  const p1=page({eye:'Klasseaktivitet · 8. trinn · Kapittel 3 · Algebraiske uttrykk',title:T,lede:'Grupper på 2–4 elever legger 20 dominobrikker i en lukket ring. Venstre side av hver brikke er et svar. Høyre side er et uttrykk som skal forenkles, og svaret står på venstre side av neste brikke. Varighet: 20 minutter.',
    body:`<h2>Forberedelser</h2><ol class="st"><li>Skriv ut side 2–3 én gang per gruppe og klipp ut brikkene.</li><li>Bland brikkene og legg dem med forsiden opp.</li></ol>
    <h2>Slik spiller dere</h2><ol class="st"><li>Velg en hvilken som helst brikke å starte med.</li><li>Forenkle uttrykket på høyre side. Finn brikken som har svaret på venstre side, og legg den inntil.</li><li>Fortsett til alle brikkene ligger i en ring. Går det opp til slutt, har dere regnet riktig.</li><li>Den som legger en brikke, må forklare for de andre hvorfor svaret stemmer.</li></ol>
    <div class="box red"><b class="t">Pass på</b><ul class="st"><li>Bare like ledd kan slås sammen: 3x + 4 blir ikke 7x.</li><li>Minus foran en parentes endrer fortegnet på alle leddene inni: 8a − (3a + 2) = 8a − 3a − 2.</li><li>x · x · x = x³, men x + x + x = 3x.</li></ul></div>
    <div class="box"><b class="t">Til læreren: ringen i riktig rekkefølge</b><ol class="kj">${order.map(k=>`<li>${D[k][0]} <span class="a">= ${D[k][1]}</span></li>`).join('')}</ol></div>`,foot:[ft(T),'Side 1 · instruksjoner']});
  A.push({id:'algebradomino', ch:'kap3', title:T, fit:'8. trinn · Kapittel 3 · Algebraiske uttrykk', link:'#kap3-uttrykk', topics:['uttrykk','forenkling','gange-alg','parenteser'],
    short:'Domino der elevene forenkler uttrykk og legger brikkene i en ring.',
    desc:'Gruppene legger 20 dominobrikker i en ring ved å forenkle uttrykk: like ledd, parenteser, ganging, potenser og uttrykk skrevet med ord. Ringen går bare opp hvis alle svarene er riktige.',
    inside:['Side 1: instruksjoner, vanlige feil og hele ringen i riktig rekkefølge','Side 2–3: 20 dominobrikker, 10 per ark'], check,
    css:`.card{padding:2.5mm}.dm{display:flex;width:100%;height:100%;border:2px solid ${C.ink};border-radius:3mm;overflow:hidden}.dm>div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5mm;padding:2mm}.dl{border-right:2px dashed ${C.muted};background:${C.soft}}.dm span{font:400 7.5pt "JetBrains Mono",monospace;text-transform:uppercase;color:${C.muted};letter-spacing:.05em}.dm b{font-size:15pt;line-height:1.25}.dr b{font-size:13pt}
      ol.kj{columns:2;column-gap:6mm;margin:0;padding-left:6mm;font-size:9.5pt;line-height:1.45}`,
    pages:[p1,...cardPages({cards:printed,cols:2,rows:5,eye:'Klasseaktivitet · Algebradomino',title:T,foot:ft(T),start:2,label:'dominobrikker'})]});
}

/* ---------- 8 Fyrstikkmønstre ---------- */
{ const T='Fyrstikkmønstre';
  const stick=(x1,y1,x2,y2)=>{ const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy), ux=dx/L, uy=dy/L, g=1.0; return `<line x1="${x1+ux*g}" y1="${y1+uy*g}" x2="${x2-ux*g}" y2="${y2-uy*g}" stroke="#C9A36A" stroke-width=".85" stroke-linecap="round"/><circle cx="${x2-ux*g*1.5}" cy="${y2-uy*g*1.5}" r=".72" fill="${C.red}"/>`; };
  const u=8;
  const figA=n=>{ let s=''; for(let i=0;i<=n;i++) s+=stick(i*u,u,i*u,0); for(let i=0;i<n;i++){ s+=stick(i*u,0,(i+1)*u,0); s+=stick(i*u,u,(i+1)*u,u); } return {s,w:n*u,h:u}; };
  const figB=n=>{ let s=''; const h=u*0.866; for(let i=0;i<n;i++){ const up=i%2===0, x=i*u/2; if(up){ if(i===0) s+=stick(x,h,x+u/2,0); s+=stick(x+u/2,0,x+u,h); s+=stick(x,h,x+u,h); } else { s+=stick(x,0,x+u,0); s+=stick(x+u,0,x+u/2,h); } } return {s,w:(n+1)*u/2,h}; };
  // B: n trekanter vekselvis opp/ned: 2n+1 pinner
  const figC=n=>{ let s=''; const r=u*0.6; for(let i=0;i<=n;i++) s+=stick(i*u,u+r,i*u,r); for(let i=0;i<n;i++){ s+=stick(i*u,u+r,(i+1)*u,u+r); s+=stick(i*u,r,(i+1)*u,r); s+=stick(i*u,r,i*u+u/2,0); s+=stick(i*u+u/2,0,(i+1)*u,r); } return {s,w:n*u,h:u+r}; };
  const count=(f,n)=>(f(n).s.match(/<line/g)||[]).length;
  const P=[{k:'A',name:'Kvadrater',f:figA,form:'3n + 1',fn:n=>3*n+1},{k:'B',name:'Trekanter',f:figB,form:'2n + 1',fn:n=>2*n+1},{k:'C',name:'Hus',f:figC,form:'5n + 1',fn:n=>5*n+1}];
  const check=()=>{ P.forEach(p=>{ for(let n=1;n<=6;n++) assert(count(p.f,n)===p.fn(n),'telling '+p.k+n+': '+count(p.f,n)); }); assert(3*33+1===100,'A100'); assert(5*39+1<=200&&5*40+1>200,'C200'); };
  const draw=p=>{ let x=0, parts='', H=0; for(let n=1;n<=3;n++){ const g=p.f(n); H=Math.max(H,g.h); parts+=`<g transform="translate(${x},2)">${g.s}<text x="${g.w/2}" y="${g.h+6.5}" text-anchor="middle" font-size="2.4" fill="${C.muted}" font-family="JetBrains Mono">Figur ${n}</text></g>`; x+=g.w+16; } return `<svg viewBox="-8 0 ${x+4} ${H+9}" height="${((H+9)*1.75).toFixed(1)}mm" style="max-width:100%;display:block">${parts}</svg>`; };
  const NS=[1,2,3,4,5,10,50];
  const block=(p,key)=>`<div class="pat"><div class="ph"><b>Mønster ${p.k} · ${p.name}</b></div>${draw(p)}
    <table class="t"><tr><th>Figur</th>${NS.map(n=>`<td>${n}</td>`).join('')}<th>n</th></tr><tr><th>Fyrstikker</th>${NS.map(n=>`<td>${key?`<span class="a">${p.fn(n)}</span>`:''}</td>`).join('')}<td>${key?`<span class="a">${p.form}</span>`:''}</td></tr></table></div>`;
  const sheet=key=>page({eye:(key?'Fasit · ':'')+'Utforsk · 8. trinn · Kapittel 3 · Mønster',title:T,key,lede:key?'Tabellene utfylt, formlene og svarene på spørsmålene.':'Tell fyrstikkene i figur 1–3, og finn ut hvor mange det blir i figur 4, 5, 10 og 50 uten å tegne alt. Skriv til slutt en formel for figur n.',
    body:`${P.map(p=>block(p,key)).join('')}
    <h2>Utfordringer</h2><ol class="q"><li><span>Hvilken figur i mønster A bruker nøyaktig 100 fyrstikker?</span>${key?'<span class="a">3n + 1 = 100 gir n = 33. Figur 33.</span>':'<span class="ln"></span>'}</li>
    <li><span>Du har 200 fyrstikker. Hvor mange hus i mønster C kan du lage på rad? Hvor mange fyrstikker blir til overs?</span>${key?'<span class="a">5n + 1 ≤ 200 gir n = 39 hus. Det bruker 196 fyrstikker, så 4 blir til overs.</span>':'<span class="ln"></span>'}</li>
    <li><span>Hvorfor er det «+ 1» i alle formlene? Forklar med figurene.</span>${key?'<span class="a">Den første figuren trenger én ekstra fyrstikk for å lukke figuren. Hver ny del bruker en fyrstikk som allerede står der.</span>':'<span class="ln"></span>'}</li></ol>`,foot:[ft(T),key?'Side 2 · fasit til læreren':'Side 1 · elevark']});
  A.push({id:'fyrstikkmonstre', ch:'kap3', title:T, fit:'8. trinn · Kapittel 3 · Mønster', link:'#kap3-monster', topics:['monster'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Tell fyrstikker i tre mønstre og finn formler for figur n.',
    desc:'Elevene utforsker tre fyrstikkmønstre (kvadrater, trekanter og hus), fyller ut tabeller, finner formler for figur n og bruker formlene til å svare på utfordringer. Ta gjerne med ekte fyrstikker eller tannpirkere.',
    inside:['Side 1: elevark med tre mønstre, tabeller og utfordringer','Side 2: fasit med tabeller, formler og svar'], check,
    css:`.pat{margin-bottom:2.5mm}.ph b{font-size:11.5pt;color:${C.pen}}.pat table.t{width:100%;margin-top:1mm}.pat td{height:8mm;width:10%}ol.q{margin:0;padding-left:6mm;font-size:10.3pt;line-height:1.35}ol.q li{margin-bottom:1.4mm}ol.q li::marker{color:${C.pen};font-weight:700}ol.q .a{display:block}`,
    pages:[sheet(false),sheet(true)]});
}

/* ---------- 9 Knekk koden ---------- */
{ const T='Knekk koden', ORD='SUPERHJERNE', AB='ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ';
  const L=[ ['x + 7 = 26',x=>x+7===26], ['x − 9 = 12',x=>x-9===12], ['3x = 48',x=>3*x===48], ['2x + 3 = 13',x=>2*x+3===13], ['4x − 5 = 67',x=>4*x-5===67],
    [`${fr('x',2)} + 3 = 7`,x=>x/2+3===7], ['5x − 7 = 3x + 13',x=>5*x-7===3*x+13], ['3(x − 2) = 9',x=>3*(x-2)===9],
    ['Jeg tenker på et tall. Ganger jeg det med 3 og legger til 6, får jeg 60. Hvilket tall tenker jeg på?',x=>3*x+6===60],
    ['7x + 4 = 3x + 60',x=>7*x+4===3*x+60], ['To tall som følger etter hverandre, har summen 11. Hva er det minste tallet?',x=>x+(x+1)===11] ];
  const sol=[...ORD].map(c=>AB.indexOf(c)+1);
  const check=()=>{ L.forEach((l,i)=>{ assert(l[1](sol[i]),'likning '+(i+1)); let n=0; for(let x=-50;x<=100;x+=0.5) if(l[1](x)) n++; assert(n===1,'unik '+(i+1)); }); };
  const table=`<div class="ab">${[...AB].map((c,i)=>`<div><b>${c}</b><span>${i+1}</span></div>`).join('')}</div>`;
  const sheet=key=>page({eye:(key?'Fasit · ':'')+'Klasseaktivitet · 8. trinn · Kapittel 3 · Likninger',title:T,key,lede:key?`Løsningene og kodeordet ${ORD}.`:'Løs likningene. Hver løsning er et tall som hører til en bokstav i tabellen. Bokstavene i rekkefølge gir et hemmelig kodeord. Den første som knekker koden, vinner!',
    body:`${table}<div class="lk">${L.map((l,i)=>`<div class="li"><b class="n">${i+1}</b><span class="eq">${l[0]}</span><span class="an">x = ${key?`<span class="a">${sol[i]}</span>`:'<i></i>'} <em>→</em> ${key?`<span class="a">${ORD[i]}</span>`:'<i class="s"></i>'}</span></div>`).join('')}</div>
    <h2>Kodeordet</h2><div class="code">${[...ORD].map((c,i)=>`<div><span>${i+1}</span><b>${key?c:''}</b></div>`).join('')}</div>`,foot:[ft(T),key?'Side 2 · fasit til læreren':'Side 1 · elevark']});
  A.push({id:'knekk-koden', ch:'kap3', title:T, fit:'8. trinn · Kapittel 3 · Likninger', link:'#kap3-likninger', topics:['likninger','problemlosning'], thumbs:['Side 1 · elevark','Side 2 · fasit'],
    short:'Løs 11 likninger, gjør svarene om til bokstaver og knekk et hemmelig kodeord.',
    desc:'Elevene løser 11 likninger og tekstoppgaver med økende vanskegrad. Hver løsning gir en bokstav, og bokstavene danner et kodeord. Passer som konkurranse i par eller som stasjon.',
    inside:['Side 1: elevark med bokstavtabell, 11 likninger og plass til kodeordet','Side 2: fasit'], check,
    css:`.ab{display:grid;grid-template-columns:repeat(15,1fr);border:1.2px solid ${C.ink};margin:1mm 0 3mm}.ab div{display:flex;flex-direction:column;align-items:center;border:.5px solid #9AA6BD;padding:1mm 0}.ab b{font-size:11pt}.ab span{font:400 8.5pt "JetBrains Mono";color:${C.pen}}
      .lk{display:flex;flex-direction:column}.li{display:grid;grid-template-columns:8mm 1fr 52mm;align-items:center;gap:2mm;min-height:13.5mm;border-bottom:1px solid ${C.line};font-size:11pt}.li .n{color:${C.pen};font-size:12pt}.li .eq{line-height:1.3}.an{display:flex;align-items:center;gap:2mm}.an i{display:inline-block;width:16mm;border-bottom:1px solid ${C.ink};height:6mm}.an i.s{width:9mm}.an em{font-style:normal;color:${C.muted}}
      .code{display:flex;gap:2mm}.code div{width:13mm;height:15mm;border:1.6px solid ${C.ink};border-radius:2mm;position:relative;display:grid;place-items:center}.code span{position:absolute;top:.6mm;left:1.2mm;font:400 7pt "JetBrains Mono";color:${C.muted}}.code b{font:800 18pt "Bricolage Grotesque";color:${C.red}}`,
    pages:[sheet(false),sheet(true)]});
}

/* ---------- 10 Senk skipet ---------- */
{ const T='Senk skipet i koordinatsystemet';
  const grid=(lab)=>{ const M=6, s=5.6, W=(2*M)*s; let g=`<svg viewBox="-8 -8 ${W+16} ${W+16}" width="88mm" height="88mm" font-family="Atkinson Hyperlegible"><style>text{paint-order:stroke;stroke:#fff;stroke-width:.9px}</style>`;
    for(let i=-M;i<=M;i++){ const p=(i+M)*s; g+=`<line x1="${p}" y1="0" x2="${p}" y2="${W}" stroke="#C3CBDB" stroke-width=".3"/><line x1="0" y1="${p}" x2="${W}" y2="${p}" stroke="#C3CBDB" stroke-width=".3"/>`; }
    g+=`<line x1="0" y1="${M*s}" x2="${W+3}" y2="${M*s}" stroke="${C.ink}" stroke-width=".6"/><line x1="${M*s}" y1="${W}" x2="${M*s}" y2="-3" stroke="${C.ink}" stroke-width=".6"/><text x="${W+5}" y="${M*s+1.2}" font-size="3.4" font-weight="700">x</text><text x="${M*s-1}" y="-4.5" font-size="3.4" font-weight="700">y</text>`;
    for(let i=-M;i<=M;i++){ if(!i) continue; const p=(i+M)*s; g+=`<text x="${p+(i<0?-.6:0)}" y="${M*s+3.8}" font-size="2.6" text-anchor="middle">${nf(i)}</text><text x="${M*s-1.3}" y="${(M-i)*s+.95}" font-size="2.6" text-anchor="end">${nf(i)}</text>`; }
    g+=`<text x="${M*s-1.3}" y="${M*s+3.8}" font-size="2.6" text-anchor="end">0</text>`;
    return `<div class="sg"><b>${lab}</b>${g}</svg></div>`; };
  const p1=page({eye:'Klasseaktivitet · 8. trinn · Kapittel 4 · Koordinater',title:T,lede:'Et spill for to elever. Begge skjuler skip i koordinatsystemet sitt og prøver å senke skipene til motstanderen ved å si koordinater. Varighet: 20–30 minutter.',
    body:`<h2>Forberedelser</h2><ol class="st"><li>Skriv ut side 2 til hver elev.</li><li>Sett dere slik at dere ikke ser hverandres ark, eller sett opp en bok mellom dere.</li><li>Tegn skipene i «Mitt hav». Et skip er en rett rekke med punkter (krysningspunkter mellom linjene), vannrett eller loddrett:<ul class="st"><li>1 hangarskip på 4 punkter</li><li>2 kryssere på 3 punkter</li><li>3 ubåter på 2 punkter</li></ul>Skipene kan ikke ligge inntil hverandre.</li></ol>
    <h2>Slik spiller dere</h2><ol class="st"><li>Si et punkt med koordinater, for eksempel «(−3, 2)». Husk: x-koordinaten først, så y-koordinaten.</li><li>Motstanderen svarer «treff» eller «bom». Merk av i «Motstanderens hav»: kryss for treff, ring for bom.</li><li>Når alle punktene i et skip er truffet, sier motstanderen «senket».</li><li>Bytt på å skyte. Den som først senker alle skipene, vinner.</li></ol>
    <div class="box red"><b class="t">Regel som gir mer læring</b><p>Hvis noen sier et punkt feil, for eksempel bytter om x og y, gjelder skuddet punktet som faktisk ble sagt. Skriv alle skuddene i listen på arket.</p></div>
    <div class="box"><b class="t">Til læreren</b><p>Bruk tavleversjonen (koordinatsystem på smartboard) til å vise et eksempel først: marker et skip og la klassen si koordinatene. Snakk om hvorfor (2, −3) og (−3, 2) er to forskjellige punkter.</p></div>`,foot:[ft(T),'Side 1 · instruksjoner']});
  const p2=page({eye:'Klasseaktivitet · Senk skipet',title:T,small:'spillbrett',body:`<div class="two">${grid('Mitt hav')}${grid('Motstanderens hav')}</div>
    <h2>Skipene mine</h2><p>Kryss av når et skip er senket: &nbsp; Hangarskip □ &nbsp; Krysser □ □ &nbsp; Ubåt □ □ □</p>
    <h2>Skudd jeg har sendt</h2><div class="log">${Array.from({length:30},(_,i)=>`<div><span>${i+1}</span>( &nbsp; &nbsp; , &nbsp; &nbsp; )</div>`).join('')}</div>`,foot:[ft(T),'Side 2 · spillbrett (ett per elev)']});
  A.push({id:'senk-skipet', ch:'kap4', title:T, fit:'8. trinn · Kapittel 4 · Koordinater', link:'#kap4-koordinater', topics:['koordinater'], thumbs:['Side 1 · instruksjoner','Side 2 · spillbrett'], board:'#koordtavle',
    short:'Senk skipet i et koordinatsystem med negative koordinater.',
    desc:'Elevene spiller to og to. De skjuler skip i et koordinatsystem fra −6 til 6 og skyter ved å si koordinater. Tavleversjonen er et koordinatsystem der dere plasserer punkter og tegner figurer sammen.',
    inside:['Side 1: instruksjoner og regler','Side 2: spillbrett med to koordinatsystemer og skuddliste','Tavleversjon: interaktivt koordinatsystem med punkter og linjer'],
    css:`.two{display:flex;justify-content:space-between}.sg b{display:block;text-align:center;font-size:11pt;color:${C.pen};margin-bottom:1mm}.log{display:grid;grid-template-columns:repeat(5,1fr);gap:2mm 3mm;font-size:11pt}.log div{border-bottom:1px solid #B9C2D3;padding:1mm 0;white-space:nowrap}.log span{font:400 7.5pt "JetBrains Mono";color:${C.muted};margin-right:1.5mm}`,
    pages:[p1,p2]});
}

/* ---------- 11 Gjett regelen ---------- */
{ const T='Gjett regelen';
  const rules=[ [1,'y = x + 3',x=>x+3],[1,'y = x + 7',x=>x+7],[1,'y = x − 2',x=>x-2],[1,'y = 2x',x=>2*x],[1,'y = 3x',x=>3*x],[1,'y = 10x',x=>10*x],[1,'y = x − 5',x=>x-5],[1,'y = 5x',x=>5*x],
    [2,'y = 2x + 1',x=>2*x+1],[2,'y = 3x − 1',x=>3*x-1],[2,'y = 2x + 5',x=>2*x+5],[2,'y = 4x − 3',x=>4*x-3],[2,'y = 10 − x',x=>10-x],[2,'y = 5x + 2',x=>5*x+2],[2,'y = 3x + 4',x=>3*x+4],[2,'y = 20 − 2x',x=>20-2*x],
    [3,'y = x · x',x=>x*x],[3,'y = x · x + 1',x=>x*x+1],[3,'y = x : 2',x=>x/2],[3,'y = 0,5x + 3',x=>0.5*x+3],[3,'y = 100 − 10x',x=>100-10*x],[3,'y = 2x · x',x=>2*x*x],[3,'y = (x + 1) · 2',x=>(x+1)*2],[3,'y = x · x − x',x=>x*x-x] ];
  const check=()=>{ const sig=rules.map(r=>[0,1,2,3,5].map(r[2]).join()); assert(new Set(sig).size===rules.length,'like regler'); };
  const star=n=>'★'.repeat(n)+'<span style="color:#C3CBDB">'+'★'.repeat(3-n)+'</span>';
  const cards=rules.map((r,i)=>`<span class="tag">Regelkort ${i+1}</span><span class="nr">${star(r[0])}</span><b class="rl">${r[1]}</b><div class="ex">x = 3 gir y = ${nf(r[2](3))}</div>`);
  const tab=()=>`<div class="tb"><table class="t"><tr><th>x</th><th>y</th></tr>${Array.from({length:6},()=>'<tr><td></td><td></td></tr>').join('')}</table><p>Regelen er: y = <span class="w"></span></p></div>`;
  const p1=page({eye:'Klasseaktivitet · 8. trinn · Kapittel 4 · Funksjoner',title:T,lede:'En funksjonsmaskin for hele klassen eller grupper. Én har et hemmelig regelkort. De andre sier tall inn i maskinen, får tall ut og prøver å finne regelen. Varighet: 15–25 minutter.',
    body:`<h2>Forberedelser</h2><ol class="st"><li>Skriv ut og klipp ut regelkortene på side 2–3. Kortene har tre vanskegrader: ★ enkel, ★★ middels, ★★★ vanskelig.</li><li>Skriv ut notatarket på side 4 til hver elev eller gruppe.</li></ol>
    <h2>Slik spiller dere</h2><ol class="st"><li>Maskinen (læreren eller en elev) trekker et regelkort i hemmelighet.</li><li>De andre sier et x-tall. Maskinen regner ut y med regelen og sier svaret. Alle skriver x og y i tabellen.</li><li>Når noen tror de har regelen, sier de den ikke høyt, men tester den: «Hvis x er 10, blir y …». Stemmer det, har de funnet regelen.</li><li>Den som finner regelen, blir neste maskin.</li></ol>
    <div class="box"><b class="t">Eksempel</b><p>Regelkortet er y = 2x + 1. Klassen sier x = 1, 2, 3 og får y = 3, 5, 7. Når x øker med 1, øker y med 2. Da må det være 2x, og så + 1.</p></div>
    <div class="box red"><b class="t">Snakk om</b><ul class="st"><li>Hvilke x-tall er lurest å spørre om? (Prøv x = 0 og x = 1.)</li><li>Hvordan ser du på tabellen at regelen inneholder 3x?</li><li>Tegn punktene i et koordinatsystem. Hvilke regler gir rette linjer?</li></ul></div>`,foot:[ft(T),'Side 1 · instruksjoner']});
  const p4=page({eye:'Klasseaktivitet · Gjett regelen',title:T,small:'notatark',body:`<p>Skriv x og y for hver runde. Se etter mønster: Hva skjer med y når x øker med 1?</p><div class="tbs">${Array.from({length:6},tab).join('')}</div>`,foot:[ft(T),'Side 4 · notatark']});
  A.push({id:'gjett-regelen', ch:'kap4', title:T, fit:'8. trinn · Kapittel 4 · Funksjoner', link:'#kap4-funksjonsuttrykk', topics:['funksjonsuttrykk','grafer'],
    short:'Funksjonsmaskin: still x-spørsmål og finn den hemmelige regelen.',
    desc:'Én er funksjonsmaskin med et hemmelig regelkort. De andre sier x-verdier, får y-verdier og bruker tabellen til å finne regelen. 24 regelkort i tre vanskegrader, fra y = x + 3 til y = x · x − x.',
    inside:['Side 1: instruksjoner, eksempel og spørsmål å snakke om','Side 2–3: 24 regelkort i tre vanskegrader','Side 4: notatark med seks tabeller'], check,
    css:`.rl{font:700 22pt "Atkinson Hyperlegible";white-space:nowrap}.ex{font-size:9pt;color:${C.muted};margin-top:2mm}.card .nr{color:${C.orange};font-size:11pt}
      .tbs{display:grid;grid-template-columns:repeat(3,1fr);gap:7mm 6mm;margin-top:3mm}.tb table{width:100%}.tb td{height:9.5mm}.tb p{margin-top:2.5mm;font-size:10.5pt}.tb .w{display:inline-block;width:28mm;border-bottom:1px solid ${C.ink}}`,
    pages:[p1,...cardPages({cards,cols:3,rows:4,eye:'Klasseaktivitet · Gjett regelen',title:T,foot:ft(T),start:2,label:'regelkort'}),p4]});
}

/* ---------- 12 Grafhistorier ---------- */
{ const T='Grafhistorier', R=rng(812);
  const S=[ ['Mia går til skolen i jevnt tempo hele veien.',[[0,0],[10,8]]],
    ['Jonas går til butikken, handler en stund, og går så videre til skolen.',[[0,0],[3.5,4],[6.5,4],[10,8]]],
    ['Sara går hjemmefra, men snur fordi hun har glemt matpakka. Så går hun hele veien til skolen.',[[0,0],[2.5,3],[5,0],[10,8]]],
    ['Ali går rolig til bussholdeplassen, venter på bussen og tar bussen til skolen.',[[0,0],[2.5,1.5],[5.5,1.5],[7,8],[10,8]]],
    ['Nora sykler fort til treningen og går sakte hjem igjen.',[[0,0],[2,7],[10,0]]],
    ['Elias går til en venn, blir der en stund og går hjem igjen like fort som han gikk dit.',[[0,0],[3,5],[7,5],[10,0]]],
    ['Lukas løper ut døra, men blir sliten og går saktere og saktere.','c1'],
    ['Thea går sakte først, og så fortere og fortere fordi hun er sent ute.','c2'] ];
  const graph=(pts)=>{ const W=70,H=46, X=x=>8+x*(W-12)/10, Y=y=>H-8-y*(H-14)/8; let p;
    if(pts==='c1') p=Array.from({length:21},(_,i)=>{ const t=i/2; return [t,8*(1-Math.pow(1-t/10,2.2))]; });
    else if(pts==='c2') p=Array.from({length:21},(_,i)=>{ const t=i/2; return [t,8*Math.pow(t/10,2.2)]; }); else p=pts;
    return `<svg viewBox="0 0 ${W} ${H}" width="74mm" height="49mm" font-family="Atkinson Hyperlegible"><line x1="8" y1="${H-8}" x2="${W-2}" y2="${H-8}" stroke="${C.ink}" stroke-width=".7"/><line x1="8" y1="${H-8}" x2="8" y2="3" stroke="${C.ink}" stroke-width=".7"/><path d="M${W-4} ${H-9.5} L${W-2} ${H-8} L${W-4} ${H-6.5}M6.5 5 L8 3 L9.5 5" fill="none" stroke="${C.ink}" stroke-width=".7"/>
      <text x="${W-2}" y="${H-3}" font-size="3.2" text-anchor="end">Tid</text><text x="10" y="4.5" font-size="3.2">Avstand hjemmefra</text>
      <polyline points="${p.map(q=>X(q[0]).toFixed(2)+','+Y(q[1]).toFixed(2)).join(' ')}" fill="none" stroke="${C.pen}" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/></svg>`; };
  const L='ABCDEFGH'; const gOrder=shuffle([0,1,2,3,4,5,6,7],R), sOrder=shuffle([0,1,2,3,4,5,6,7],R);
  const check=()=>{ assert(new Set(gOrder).size===8&&new Set(sOrder).size===8,'perm'); };
  const cards=[...gOrder.map((k,i)=>`<span class="tag">Graf</span><span class="nr gl">${L[i]}</span>${graph(S[k][1])}`), ...sOrder.map((k,i)=>`<span class="tag">Historie</span><span class="nr gl">${i+1}</span><p class="hs">${S[k][0]}</p>`)];
  const key=sOrder.map((k,i)=>`<span><b>${i+1}</b> → <span class="a">${L[gOrder.indexOf(k)]}</span></span>`).join('');
  const p1=page({eye:'Klasseaktivitet · 8. trinn · Kapittel 4 · Grafer i hverdagen',title:T,lede:'Grupper på 2–4 elever kobler 8 grafer med 8 historier om veien til og fra skolen. Grafene viser avstanden hjemmefra mens tiden går. Varighet: 20 minutter.',
    body:`<h2>Slik gjør dere</h2><ol class="st"><li>Skriv ut side 2–3 til hver gruppe og klipp ut kortene. Legg grafkortene i én rekke og historiekortene i en annen.</li><li>Gruppen finner grafen som passer til hver historie og legger kortene sammen.</li><li>For hvert par skal gruppen kunne forklare: Hva betyr det når grafen stiger? Når den er vannrett? Når den synker?</li><li>Til slutt skriver hver elev sin egen historie og tegner grafen. Bytt med en annen gruppe og se om de klarer å koble dem.</li></ol>
    <div class="box red"><b class="t">Dette er lurt å legge merke til</b><ul class="st"><li>Grafen stiger: avstanden hjemmefra øker. Bratt graf betyr høy fart.</li><li>Vannrett graf: personen står stille.</li><li>Grafen synker: personen er på vei hjem.</li><li>En buet graf betyr at farten endrer seg hele tiden.</li></ul></div>
    <div class="box"><b class="t">Til læreren: fasit (historie → graf)</b><div class="kj">${key}</div></div>
    <p><b>Variant:</b> Les en historie høyt og la elevene tegne grafen på mini-tavler før dere ser på kortene.</p>`,foot:[ft(T),'Side 1 · instruksjoner og fasit']});
  A.push({id:'grafhistorier', ch:'kap4', title:T, fit:'8. trinn · Kapittel 4 · Grafer i hverdagen', link:'#kap4-diagrammer', topics:['diagrammer'],
    short:'Koble 8 grafer med 8 historier om veien til skolen.',
    desc:'Gruppene kobler grafer som viser avstand hjemmefra og tid, med korte historier: stopp i butikken, glemt matpakke, bussen, sykkelturen. Etterpå lager elevene sine egne grafhistorier.',
    inside:['Side 1: instruksjoner, hva elevene bør legge merke til, og fasit','Side 2–3: 8 grafkort og 8 historiekort'], check,
    css:`.gl{font:800 14pt "Bricolage Grotesque"!important;color:${C.pen}!important}.hs{font-size:13pt;line-height:1.4;max-width:76mm;margin:0}.kj{display:grid;grid-template-columns:repeat(8,1fr);gap:2mm;font-size:12pt}`,
    pages:[p1,...cardPages({cards,cols:2,rows:4,eye:'Klasseaktivitet · Grafhistorier',title:T,foot:ft(T),start:2,label:'kort'})]});
}

module.exports=A;
