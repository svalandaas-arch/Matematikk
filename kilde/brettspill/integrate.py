# Legger brettspillene inn i nettsiden: PDF-er, forhåndsvisning (sprite) og kode i index.html
import json, os, shutil, subprocess, glob, re
from PIL import Image
G = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(G, 'out')
REPO = '/home/claude/matematikk'; AKT = os.path.join(REPO, 'aktiviteter')
UP = '/mnt/user-data/attachments/eb9f38cb-336c-51d2-a47b-b55e03dce7a7/'
meta = {m['id']: m for m in json.load(open(os.path.join(OUT, 'spill.json')))}
own = [
 dict(id='terningduellen', title='Terningduellen', sub='Regn deg til fire på rad', grade=8, ch='kap1', chname='Tall og tallregning', topic='flere-ledd', link='#kap1-flere-ledd',
      short='Kast terningene, regn med de fire regneartene og ta et tall på brettet. Først til fire på rad.', a='#2F6FD0', a2='#E4ECFB',
      lv=['Middels: to eller tre av tre terninger', 'Vanskelig: alle tre terningene, med parenteser', 'Enkel: to terninger, tre på rad'],
      src=UP + '495b6160-Brettspill_med_terninger.pdf'),
 dict(id='brokjakten', title='Brøkjakten', sub='Fire på rad med like store brøker', grade=8, ch='kap2', chname='Delelighet og brøk', topic='forkorting', link='#kap2-forkorting',
      short='Lag en brøk med to terninger og finn en like stor brøk, modell eller regnestykke på brettet.', a='#E9A23B', a2='#FCEFD6',
      lv=['Nivå 1: sirkler, strimler og prikker', 'Nivå 2: brøker, tallinjer og ord', 'Nivå 3: regnestykker med brøk'],
      src=UP + 'cb1df66d-Br_kjakten___brettspill.pdf'),
]
order = ['terningduellen', 'brokjakten', 'likningsjakten', 'punktjakten', 'statistikkjakten', 'arealjakten', 'volumjakten', 'sannsynlighetsjakten',
         'parentesjakten', 'grafjakten', 'prosentjakten', 'tallsystemjakten']
for o in own: meta[o['id']] = o
TMP = os.path.join(G, 'spr'); shutil.rmtree(TMP, ignore_errors=True); os.makedirs(TMP)
files = []; entries = []
CHN = {'kap1': 1, 'kap2': 2, 'kap3': 3, 'kap4': 4}
for i, gid in enumerate(order):
    m = meta[gid]
    src = m.get('src') or os.path.join(OUT, gid + '.pdf')
    shutil.copy(src, os.path.join(AKT, gid + '.pdf'))
    subprocess.run(['pdftoppm', '-jpeg', '-jpegopt', 'quality=88', '-scale-to-x', '760', '-scale-to-y', '537', src, os.path.join(TMP, f'{i:02d}')], check=True)
    pages = sorted(glob.glob(os.path.join(TMP, f'{i:02d}-*.jpg'))); assert len(pages) == 3, (gid, pages)
    o = len(files); files += pages
    num = CHN.get(m['ch'], int(m['ch'][-1]))
    entries.append(dict(id=gid, grade=m['grade'], ch=m['ch'], title=m['title'], fit=f"{m['grade']}. trinn · Kapittel {num} · {m['chname']}", link=m['link'],
        topics=[m['topic']], pages=3, short=m['short'], desc=m['short'], inside=['Tre spillebrett med regler, ett på hver side: ' + '; '.join(m['lv'])],
        thumbs=m['lv'], own=True, kind='Brettspill', sp=dict(f='aktiviteter/forhbs.jpg', o=o, n=None, land=1), sub=m['sub'], col=m['a']))
for e in entries: e['sp']['n'] = len(files)
im = Image.new('RGB', (760, 537 * len(files)), 'white')
for k, f in enumerate(files): im.paste(Image.open(f).convert('RGB').resize((760, 537)), (0, 537 * k))
im.save(os.path.join(AKT, 'forhbs.jpg'), quality=66, optimize=True, progressive=True)
print('sprite', len(files), 'sider', os.path.getsize(os.path.join(AKT, 'forhbs.jpg')) // 1024, 'kB')

p = os.path.join(REPO, 'index.html'); s = open(p).read()
def rep(a, b):
    global s
    assert s.count(a) == 1, ('fant ikke entydig', a[:90], s.count(a)); s = s.replace(a, b)
block = '/*BSSTART*/const BRETT=' + json.dumps(entries, ensure_ascii=False) + ';ACTS.push(...BRETT);/*BSEND*/'
if '/*BSSTART*/' in s:
    s = re.sub(r'/\*BSSTART\*/.*?/\*BSEND\*/', lambda _: block, s, flags=re.S)
else:
    rep('/*ACTSEND*/;\n', '/*ACTSEND*/;\n' + block + '\n')
    # forhåndsvisning i liggende format
    rep('''const actPg=(a,k,cls)=>{ const sp=a.sp, y=sp.n>1?(sp.o+k-1)*100/(sp.n-1):0; return `<div class="${cls||'pv-img'} act-pg" ''',
        '''const actPg=(a,k,cls)=>{ const sp=a.sp, y=sp.n>1?(sp.o+k-1)*100/(sp.n-1):0; return `<div class="${cls||'pv-img'} act-pg${sp.land?' land':''}" ''')
    rep('.pv-pages .pv-img.act-pg{aspect-ratio:600/849}', '''.pv-pages .pv-img.act-pg{aspect-ratio:600/849}
.pv-pages .pv-img.act-pg.land{aspect-ratio:900/636;max-width:min(100%,1000px)}
.bs-intro{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px 22px;margin:4px 0 26px;padding:16px 20px;border:1.5px solid var(--line);border-radius:10px;background:var(--surface)}
.bs-intro p{margin:0;font-size:.95rem;color:var(--muted)}.bs-intro b{color:var(--ink)}
.bs-grade{margin:30px 0 8px}
.bs-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr));gap:18px}
.bs-card{border:1.5px solid var(--ink);border-radius:12px;background:var(--surface);overflow:hidden;display:flex;flex-direction:column}
.bs-card .bs-top{border-top:6px solid var(--c);padding:16px 18px 6px}
.bs-card h3{margin:2px 0 4px;font-size:1.3rem}
.bs-card .bs-fit{margin:0;font-family:var(--f-mono);font-size:.72rem;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.bs-card .bs-sub{margin:0 0 6px;font-weight:600}
.bs-card p.bs-short{margin:0;color:var(--muted);font-size:.95rem}
.bs-th{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:12px 18px}
.bs-th button{all:unset;cursor:pointer;display:flex;flex-direction:column;gap:4px;font-size:.74rem;color:var(--muted);line-height:1.25}
.bs-th button:focus-visible{outline:3px solid var(--pen);outline-offset:3px;border-radius:4px}
.bs-th .act-pg{aspect-ratio:900/636;border:1px solid var(--line);border-radius:4px;box-shadow:0 1px 4px rgba(14,20,36,.12)}
.bs-th button:hover .act-pg{border-color:var(--ink)}
.bs-act{display:flex;flex-wrap:wrap;gap:8px;padding:4px 18px 16px;margin-top:auto;align-items:center}
.bs-done{margin-left:auto;font-size:.85rem;display:flex;gap:6px;align-items:center;color:var(--muted)}''')
    # meny, forside og ruting
    rep('''<li><a href="#aktiviteter" ${route==='aktiviteter'?'aria-current="page"':''}><span>Klasseaktiviteter</span>''',
        '''<li><a href="#brettspill" ${route==='brettspill'?'aria-current="page"':''}><span>Brettspill</span><span class="tally">${BRETT.length} spill</span></a></li><li><a href="#aktiviteter" ${route==='aktiviteter'?'aria-current="page"':''}><span>Klasseaktiviteter</span>''')
    rep('''    <section class="group" aria-labelledby="ka2"><h2 id="ka2">Klasseaktiviteter</h2>''',
        '''    <section class="group" aria-labelledby="bs2"><h2 id="bs2">Brettspill</h2><a class="chap-card" href="#brettspill"><span class="num" style="font-size:2.6rem">Brett</span><h3>Brettspill med terninger</h3><p class="meta">${BRETT.length} brettspill til utskrift, ett til hvert kapittel på 8.–10. trinn. Tre brett med ulik vanskelighetsgrad i hvert spill. Først til fire på rad.</p></a></section>
    <section class="group" aria-labelledby="ka2"><h2 id="ka2">Klasseaktiviteter</h2>''')
    rep("  else if (r==='aktiviteter'){ renderActivities(); cur=r; }\n",
        "  else if (r==='brettspill'){ renderBoardGames(); cur=r; }\n  else if (r==='aktiviteter'){ renderActivities(); cur=r; }\n")
    rep("if(r==='laerer'||r==='spill'||r==='aktiviteter'||BOARDS[r]", "if(r==='laerer'||r==='spill'||r==='brettspill'||r==='aktiviteter'||BOARDS[r]")
    rep('function renderActivities(focus){', r'''function renderBoardGames(){
  const card=a=>{ const c=BOOK.chapters.find(x=>x.id===a.ch);
    return `<article class="bs-card ov-r${DONE.has(a.id)?' done':''}" data-id="${a.id}" style="--c:${a.col}"><div class="bs-top"><p class="bs-fit">${a.fit}</p><h3>${a.title}</h3><p class="bs-sub">${a.sub}</p><p class="bs-short">${a.short}</p></div>
      <div class="bs-th">${[1,2,3].map(k=>`<button type="button" data-actpv="${a.id}" data-pg="${k}" aria-label="Se brett ${k}: ${a.thumbs[k-1]}">${actPg(a,k,'bs-pg')}<span>${a.thumbs[k-1]}</span></button>`).join('')}</div>
      <div class="bs-act"><a class="btn small" href="${actHref(a)}" target="_blank" rel="noopener" data-file="${a.id}.pdf">Last ned PDF</a><a class="btn ghost small" href="${a.link}">Se delkapitlet</a>
        <label class="bs-done ov-done"><input type="checkbox" data-done="${a.id}" ${DONE.has(a.id)?'checked':''}> Gjennomført</label></div></article>`; };
  main.innerHTML=`<div class="col">
    <nav class="crumb" aria-label="Brødsmuler"><a href="#matte">Forside</a><span>›</span><span>Brettspill</span></nav>
    <header class="topic-head"><p class="eyebrow">For lærere · til utskrift</p><h1>Brett<span class="hl">spill</span></h1>
      <p class="lede">${BRETT.length} brettspill med terninger, ett til hvert kapittel på 8.–10. trinn. Hvert spill har tre brett med ulik vanskelighetsgrad, så alle i klassen kan spille det samme spillet på sitt nivå.</p></header>
    <div class="bs-intro"><p><b>Du trenger:</b> brettet skrevet ut i A4 liggende, terninger og en blyant. To elever spiller mot hverandre.</p><p><b>Slik virker det:</b> Elevene kaster, regner og merker en rute med ring eller kryss. Først til fire på rad vinner.</p><p><b>Tips:</b> Laminer brettene og bruk tusj, så kan de brukes mange ganger. Klikk på et brett for å se det i stort format.</p></div>
    ${[8,9,10].map(g=>{ const L=BRETT.filter(a=>a.grade===g); return L.length?`<h2 class="bs-grade">${g}. trinn</h2><div class="bs-list">${L.map(card).join('')}</div>`:''; }).join('')}
    <footer class="foot">Matematikk · Brettspill · ${BRETT.length} spill · ${BRETT.length*3} brett. Spillene finnes også under Klasseaktiviteter.</footer></div>`;
  main.querySelectorAll('[data-done]').forEach(c=>c.addEventListener('change',()=>DONE.toggle(c.dataset.done,c.checked)));
}
function renderActivities(focus){''')
    # forhåndsvisningen sier «instruksjoner først» – ikke for brettspill
    rep("Forhåndsvisning · ${a.pages} sider${a.thumbs?'':' · instruksjoner først'}", "Forhåndsvisning · ${a.pages} ${a.kind==='Brettspill'?'brett':'sider'}${a.thumbs?'':' · instruksjoner først'}")
open(p, 'w').write(s)
print('ok', len(entries))
