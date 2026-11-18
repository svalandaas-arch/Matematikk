# Flere typer brettspill (ikke fire på rad). Kjør etter gen.py: python3 gen2.py -> out/<id>.html + spill2.json
import os, json
_src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gen.py')).read()
exec(_src[:_src.index('meta = []')])   # henter CSS, die(), nf() osv.

CSS2 = CSS + '''
.board.free{display:block;position:relative;padding:5mm}
.board.free>svg{display:block}
.snl{display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(6,1fr);gap:2.6mm;height:100%}
.sq{background:#fff;border:.5mm solid var(--ink);border-radius:2.4mm;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4.5mm 1mm 1mm;line-height:1.1}
.sq .no{position:absolute;left:1.4mm;top:1mm;font-size:7.5pt;font-weight:700;color:#56617A}
.sq.task{background:#FFFDF4}
.sq .q{font-family:"Bricolage Grotesque";font-weight:800;font-size:13pt}
.sq .q.s{font-size:10pt}
.sq .hint{white-space:nowrap;font-size:6.8pt;font-weight:700;margin-top:1mm;padding:.3mm 1.4mm;border-radius:99px;color:#fff}
.sq .hint.up{background:#1B7646}.sq .hint.down{background:#C2362B}
.sq.start,.sq.goal{background:var(--ink);color:#fff}.sq.start .no,.sq.goal .no{color:#fff}
.sq .big{font-family:"Bricolage Grotesque";font-weight:800;font-size:15pt}
.ovl{position:absolute;left:5mm;top:5mm;pointer-events:none}
.fg{display:grid;gap:2.6mm;height:100%}
.fg div{background:#fff;border:.6mm solid var(--ink);border-radius:3mm;display:flex;align-items:center;justify-content:center;font-family:"Bricolage Grotesque";font-weight:800}
.score{display:grid;grid-template-columns:1fr 1fr;gap:2mm;margin-bottom:3mm}
.score div{border:.4mm solid var(--ink);border-radius:2.5mm;padding:1.6mm 2.5mm;font-size:8.5pt;font-weight:600;height:15mm;background:#fff}
.mono{display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(7,1fr);gap:1.6mm;height:100%}
.ms{background:#fff;border:.45mm solid var(--ink);border-radius:2mm;padding:1.1mm;display:flex;flex-direction:column;font-size:6.9pt;line-height:1.18;overflow:hidden}
.ms b{font-family:"Bricolage Grotesque";font-size:8.3pt;display:block;margin-bottom:.5mm}
.ms .amt{margin-top:auto;font-weight:700;font-size:7.4pt}
.ms.corner{background:var(--a2)}
.ms.plus{border-top:2.4mm solid #1B7646}.ms.minus{border-top:2.4mm solid #C2362B}.ms.pct{border-top:2.4mm solid var(--a)}
.mid{grid-column:2/7;grid-row:2/7;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:3mm}
.mid .logo{font-family:"Bricolage Grotesque";font-weight:800;font-size:34pt;color:var(--a)}
.mid p{margin:0;font-size:10pt;max-width:95mm}
.mid .start{font-size:13pt;font-weight:700;border:.5mm solid var(--ink);border-radius:99px;padding:1.5mm 5mm;background:#fff}
.pgfull{width:297mm;height:210mm;padding:10mm 11mm;page-break-after:always;overflow:hidden}
.pgfull h2{font-family:"Bricolage Grotesque";font-weight:800;font-size:20pt;margin:0 0 1mm}
.pgfull .lead{margin:0 0 4mm;font-size:9.5pt;color:#56617A}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:8mm}
table.log{border-collapse:collapse;width:100%;font-size:8.5pt}
table.log th{background:var(--a2);text-align:left}
table.log th,table.log td{border:.3mm solid #8E99AE;padding:0 2mm;height:6.3mm}
table.log td:first-child,table.log th:first-child{width:9mm;text-align:center;color:#56617A}
.fasit{columns:2;column-gap:10mm;font-size:9pt;line-height:1.45}
.fasit h3{font-family:"Bricolage Grotesque";font-size:12pt;margin:0 0 1.5mm;break-after:avoid}
.fasit p{margin:0 0 1mm;break-inside:avoid}
.fasit .blk{break-inside:avoid;margin-bottom:4mm}
'''

def side(g, lv, chips, steps, ex=None, box='', win=('Først i mål vinner!', ''), lvtxt=None):
    st = ''.join(f'<li>{s}</li>' for s in steps)
    exh = ''
    if ex:
        dd = ''.join(die(n, 28) for n in ex.get('d', []))
        exh = f'<div class="ex">{f"<div class=dd>{dd}</div>" if dd else ""}{ex.get("pic","")}{ex["txt"]}</div>'
    cls = ' class="xlong"' if len(g['title']) > 17 else ' class="long"' if len(g['title']) > 12 else ''
    return f'''<div class="side"><span class="lvl">Nivå {lv}</span><h1{cls}>{g['title']}</h1><p class="sub">{g['sub']}</p>
<div class="chips">{''.join(f'<span>{c}</span>' for c in chips)}</div><ol class="steps">{st}</ol>{f'<div class="box">{box}</div>' if box else ''}{exh}
<div class="win"><b>{win[0]}</b><span>{win[1]}</span></div>
<div class="foot"><span>{g['title']} · {lvtxt or g['lv'][lv-1]}</span><span>{g['grade']}. trinn · {g['chname']}</span></div></div>'''

def pg(g, inner, sidehtml, cls='free'):
    return f'<section class="pg" style="--a:{g["a"]};--a2:{g["a2"]}"><div class="board {cls}">{inner}</div>{sidehtml}</section>'

def full(g, html):
    return f'<section class="pgfull" style="--a:{g["a"]};--a2:{g["a2"]}">{html}</section>'

GAMES2 = []

# ================= 1. Potensstigen (stigespill) =================
BW, BH, PAD, GAP = 188 - 10, 190 - 10, 0, 2.6   # mm innenfor padding
CW, CH = (BW - 7 * GAP) / 8, (BH - 5 * GAP) / 6
def sqpos(n):
    r = (n - 1) // 8; c = (n - 1) % 8
    if r % 2: c = 7 - c
    return c, 5 - r
def center(n):
    c, r = sqpos(n); return c * (CW + GAP) + CW / 2, r * (CH + GAP) + CH / 2
LADDERS = {3: 21, 11: 27, 19: 36, 28: 45, 33: 47}
SNAKES = {46: 29, 41: 23, 31: 13, 25: 8, 16: 2}
def ladder_svg(a, b):
    x1, y1 = center(a); x2, y2 = center(b)
    y1 -= CH * 0.5; y2 += CH * 0.5
    import math
    dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy); nx, ny = -dy / L * 2.6, dx / L * 2.6
    s = f'<path d="M{x1+nx:.1f} {y1+ny:.1f}L{x2+nx:.1f} {y2+ny:.1f}M{x1-nx:.1f} {y1-ny:.1f}L{x2-nx:.1f} {y2-ny:.1f}" stroke="#8A5A2B" stroke-width="1.3" stroke-linecap="round"/>'
    k = int(L / 6)
    for i in range(1, k):
        t = i / k; px, py = x1 + dx * t, y1 + dy * t
        s += f'<path d="M{px+nx:.1f} {py+ny:.1f}L{px-nx:.1f} {py-ny:.1f}" stroke="#8A5A2B" stroke-width="1"/>'
    return s
def snake_svg(a, b):
    import math
    x1, y1 = center(a); x2, y2 = center(b)
    y1 += CH * 0.5; y2 -= CH * 0.5
    dx, dy = x2 - x1, y2 - y1; L = math.hypot(dx, dy); nx, ny = -dy / L, dx / L
    pts = []
    for i in range(41):
        t = i / 40; w = math.sin(t * math.pi * 3) * 4.2 * (1 - t * 0.5)
        pts.append((x1 + dx * t + nx * w, y1 + dy * t + ny * w))
    d = 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in pts)
    return (f'<path d="{d}" stroke="#2E9E6A" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="{d}" stroke="#BFE8D1" stroke-width="1" fill="none" stroke-dasharray="1.2 2"/>'
            f'<circle cx="{x1:.1f}" cy="{y1:.1f}" r="2.6" fill="#2E9E6A"/><circle cx="{x1-.8:.1f}" cy="{y1-.6:.1f}" r=".55" fill="#fff"/><circle cx="{x1+.8:.1f}" cy="{y1-.6:.1f}" r=".55" fill="#fff"/>')
POT = {
 1: [('2⁴', '16'), ('3³', '27'), ('10⁴', '10 000'), ('5¹', '5'), ('7⁰', '1'), ('(−2)³', '−8'), ('−3²', '−9'), ('4² − 2³', '16 − 8 = 8'), ('2⁵ : 4', '32 : 4 = 8'), ('10³ · 6', '6 000')],
 2: [('2³ · 2⁴', '2⁷ = 128'), ('5⁶ : 5⁴', '5² = 25'), ('a² · a⁵', 'a⁷'), ('x⁸ : x³', 'x⁵'), ('3² · 3 · 3²', '3⁵ = 243'), ('10⁷ : 10⁴', '10³ = 1 000'), ('2³ · 3²', '8 · 9 = 72'), ('2³ + 2²', '8 + 4 = 12'), ('4⁵ : 4⁵', '4⁰ = 1'), ('a³ · b² · a', 'a⁴b²')],
}
def B_stige():
    g = dict(id='potensstigen', title='Potensstigen', sub='Stigespill med potenser', grade=8, ch='kap1', chname='Tall og tallregning', topic='potenser', link='#kap1-potenser',
             a='#8A5A2B', a2='#F6EBDD', typ='Stigespill', lv=['Nivå 1: regn ut potenser', 'Nivå 2: regneregler for potenser'],
             short='Stiger og slanger med potensoppgaver: svar riktig for å klatre opp stigen eller slippe unna slangen.')
    pages = []; tasksq = sorted(list(LADDERS) + list(SNAKES))
    for lv in (1, 2):
        tasks = dict(zip(tasksq, POT[lv]))
        cells = {}
        for n in range(1, 49):
            c, r = sqpos(n); inner = f'<span class="no">{n}</span>'; cls = 'sq'
            if n == 1: inner += '<span class="big">Start</span>'; cls += ' start'
            elif n == 48: inner += '<span class="big">Mål</span>'; cls += ' goal'
            elif n in tasks:
                q = tasks[n][0]; cls += ' task'
                inner += f'<span class="q{" s" if len(q)>8 else ""}">{q}</span>'
                inner += f'<span class="hint up">Riktig → {LADDERS[n]}</span>' if n in LADDERS else f'<span class="hint down">Feil → {SNAKES[n]}</span>'
            cells[(r, c)] = f'<div class="{cls}" style="grid-row:{r+1};grid-column:{c+1}">{inner}</div>'
        svg = ''.join(ladder_svg(a, b) for a, b in LADDERS.items()) + ''.join(snake_svg(a, b) for a, b in SNAKES.items())
        inner = f'<div class="snl">{"".join(cells.values())}</div><svg class="ovl" width="{BW}mm" height="{BH}mm" viewBox="0 0 {BW} {BH}" opacity=".62">{svg}</svg>'
        steps = ['Alle starter på rute 1. Kast terningen og flytt like mange ruter fremover.',
                 'Lander du på en <b>stige</b>, må du regne ut oppgaven i ruta. Riktig svar: klatre opp. Feil svar: bli stående.',
                 'Lander du på en <b>slange</b>, må du også regne ut oppgaven. Riktig svar: du slipper unna. Feil svar: skli ned.',
                 'Motspilleren sjekker svaret i fasiten på siste side. Så er det neste spiller sin tur.']
        ex = {1: dict(txt='Du lander på rute 3 med oppgaven <b>2⁴</b>. Du svarer 2 · 2 · 2 · 2 = 16. Riktig, så du klatrer opp til rute 21.'),
              2: dict(txt='Du lander på rute 3 med oppgaven <b>2³ · 2⁴</b>. Du svarer 2⁷ = 128. Riktig, så du klatrer opp til rute 21.')}[lv]
        pages.append(pg(g, inner, side(g, lv, ['2–4 spillere', '1 terning', '1 brikke hver'], steps, ex, win=('Først til rute 48 vinner!', 'Du trenger ikke treffe nøyaktig.')), 'free'))
    fas = '<h2>Fasit · Potensstigen</h2><p class="lead">Til motspilleren. Brett ut eller legg arket med fasiten ned.</p><div class="fasit">'
    for lv in (1, 2):
        fas += f'<div class="blk"><h3>Nivå {lv}</h3>' + ''.join(f'<p>Rute {n}: <b>{q}</b> = {a}</p>' for n, (q, a) in zip(tasksq, POT[lv])) + '</div>'
    pages.append(full(g, fas + '</div>'))
    g['thumbs'] = ['Nivå 1: regn ut potenser', 'Nivå 2: regneregler for potenser', 'Fasit til begge brettene']
    return g, pages

# ================= 2. Faktorfangeren (strategi) =================
def B_faktor():
    g = dict(id='faktorfangeren', title='Faktorfangeren', sub='Strategispill med faktorer og primtall', grade=8, ch='kap2', chname='Delelighet og brøk', topic='delelighet', link='#kap2-delelighet',
             a='#7A4FC9', a2='#EEE6FA', typ='Strategispill', lv=['Nivå 1: tallene 1–24', 'Nivå 2: tallene 1–36', 'Nivå 3: tallene 1–48'],
             short='Ta et tall og få det som poeng, men motspilleren får alle faktorene. Hvem tenker lurest?')
    pages = []
    for lv, N, cols in ((1, 24, 6), (2, 36, 6), (3, 48, 8)):
        rows = N // cols; fs = {1: 24, 2: 22, 3: 19}[lv]
        cells = ''.join(f'<div style="font-size:{fs}pt">{n}</div>' for n in range(1, N + 1))
        inner = f'<div class="fg" style="grid-template-columns:repeat({cols},1fr);grid-template-rows:repeat({rows},1fr)">{cells}</div>'
        steps = ['Spiller 1 velger et ledig tall som har minst én <b>ledig faktor</b> på brettet (et mindre tall det kan deles på). Tallet blir dine poeng.',
                 'Motspilleren får <b>alle</b> de ledige faktorene til tallet som poeng.',
                 'Merk det du får med ditt tegn: spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕. Så bytter dere: spiller 2 velger et tall.',
                 'Når ingen ledige tall har ledige faktorer igjen, er spillet over. Tallene som er igjen, får ingen. Legg sammen poengene.']
        ex = dict(txt='Du tar <b>12</b> og får 12 poeng. Er 1, 2, 3, 4 og 6 ledige, får motspilleren 1 + 2 + 3 + 4 + 6 = 16. Lurt? Tar du <b>23</b>, får motspilleren bare 1.')
        box = '<div class="score"><div>Spiller 1 ○<br>poeng:</div><div>Spiller 2 ✕<br>poeng:</div></div>'
        tot = N * (N + 1) // 2
        pages.append(pg(g, inner, side(g, lv, ['2 spillere', '1 blyant', 'ingen terning'], steps, ex, box,
            win=('Flest poeng vinner!', f'Alle tallene til sammen er {tot} poeng. Kan du få mer enn halvparten?')), 'free'))
    g['thumbs'] = g['lv']
    return g, pages

# ================= 3. Koordinatløpet (billøp på rutenett) =================
def track_svg(x0, x1, y0, y1, outer, inner, start, W=178, H=180, cars=True):
    u = min(W / (x1 - x0 + 1.4), H / (y1 - y0 + 1.4)); ox = (W - (x1 - x0) * u) / 2; oy = (H - (y1 - y0) * u) / 2
    X = lambda x: ox + (x - x0) * u; Y = lambda y: oy + (y1 - y) * u
    poly = lambda P: 'M' + ' L'.join(f'{X(x):.2f} {Y(y):.2f}' for x, y in P) + 'Z'
    s = f'<rect width="{W}" height="{H}" fill="#fff" opacity=".0"/><path d="{poly(outer)} {poly(inner)}" fill="#fff" fill-rule="evenodd"/>'
    for x in range(x0, x1 + 1):
        s += f'<path d="M{X(x):.2f} {Y(y0):.2f}V{Y(y1):.2f}" stroke="#B7C2D6" stroke-width="{.35 if x else .7}"/>'
    for y in range(y0, y1 + 1):
        s += f'<path d="M{X(x0):.2f} {Y(y):.2f}H{X(x1):.2f}" stroke="#B7C2D6" stroke-width="{.35 if y else .7}"/>'
    if x0 < 0 < x1 or y0 < 0 < y1:
        s += f'<path d="M{X(x0):.2f} {Y(0):.2f}H{X(x1):.2f}M{X(0):.2f} {Y(y0):.2f}V{Y(y1):.2f}" stroke="#141E36" stroke-width=".7"/>'
    else:
        s += f'<path d="M{X(x0):.2f} {Y(y0):.2f}H{X(x1):.2f}M{X(x0):.2f} {Y(y0):.2f}V{Y(y1):.2f}" stroke="#141E36" stroke-width=".7"/>'
    s += f'<path d="{poly(outer)}" fill="none" stroke="#141E36" stroke-width="1.1" stroke-linejoin="round"/><path d="{poly(inner)}" fill="none" stroke="#141E36" stroke-width="1.1" stroke-linejoin="round"/>'
    # tall på aksene
    ax = 0 if x0 < 0 < x1 else x0; ay = 0 if y0 < 0 < y1 else y0
    for x in range(x0, x1 + 1, 2):
        if x == ax and ay == 0: continue
        s += f'<text x="{X(x):.2f}" y="{Y(ay)+3.2:.2f}" font-size="2.6" text-anchor="middle" font-weight="600">{nf(x)}</text>'
    for y in range(y0, y1 + 1, 2):
        if y == ay and ax == 0 and y == 0: continue
        if y == ay and x0 >= 0: continue
        s += f'<text x="{X(ax)-1.1:.2f}" y="{Y(y)+0.9:.2f}" font-size="2.6" text-anchor="end" font-weight="600">{nf(y)}</text>'
    # start/mål-strek (sjakkrutet)
    (sx, sa), (_, sb) = start
    n = int(abs(sb - sa) * 2); ys = min(sa, sb)
    for i in range(n):
        for j in range(2):
            if (i + j) % 2 == 0:
                s += f'<rect x="{X(sx)-u*0.25+j*u*0.25:.2f}" y="{Y(ys+(i+1)/2):.2f}" width="{u*0.25:.2f}" height="{u/2:.2f}" fill="#141E36"/>'
    s += f'<path d="M{X(sx)-u*.25:.2f} {Y(sa):.2f}V{Y(sb):.2f}M{X(sx)+u*.25:.2f} {Y(sa):.2f}V{Y(sb):.2f}" stroke="#141E36" stroke-width=".5"/>'
    s += f'<text x="{X(sx)+u*0.6:.2f}" y="{Y(max(sa,sb))-1.6:.2f}" font-size="3.4" font-weight="800" font-family="Bricolage Grotesque">Start og mål →</text>'
    return f'<svg width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}" font-family="Inter" fill="#141E36">{s}</svg>'
def B_race():
    g = dict(id='koordinatlopet', title='Koordinatløpet', sub='Billøp i koordinatsystemet', grade=8, ch='kap4', chname='Funksjoner', topic='koordinater', link='#kap4-koordinater',
             a='#D9475A', a2='#FCE7EA', typ='Løpespill', lv=['Nivå 1: første kvadrant', 'Nivå 2: alle fire kvadranter', 'Nivå 3: smal løype med skarpe svinger'],
             short='Kjør bil på rutenettet. Farten endres med én rute om gangen, og alle punktene skrives som koordinater.')
    T = {
      1: dict(r=(0, 20, 0, 20), outer=[(4, 1), (16, 1), (19, 4), (19, 16), (16, 19), (4, 19), (1, 16), (1, 4)],
              inner=[(8, 7), (12, 7), (13, 8), (13, 12), (12, 13), (8, 13), (7, 12), (7, 8)], start=((10, 1), (10, 7)), first='(9, 3)'),
      2: dict(r=(-10, 10, -10, 10), outer=[(-6, -9), (6, -9), (9, -6), (9, 2), (2, 9), (-6, 9), (-9, 6), (-9, -6)],
              inner=[(-3, -4), (3, -4), (4, -3), (4, 0), (0, 4), (-3, 4), (-4, 3), (-4, -3)], start=((0, -9), (0, -4)), first='(−1, −7)'),
      3: dict(r=(-10, 10, -9, 9), outer=[(-10, -9), (10, -9), (10, 9), (1, 9), (1, 3), (-1, 3), (-1, 9), (-10, 9)],
              inner=[(-7, -6), (7, -6), (7, 6), (4, 6), (4, -1), (-4, -1), (-4, 6), (-7, 6)], start=((0, -9), (0, -6)), first='(−1, −8)'),
    }
    pages = []
    for lv in (1, 2, 3):
        t = T[lv]
        inner = track_svg(*t['r'], t['outer'], t['inner'], t['start'])
        steps = [f'Hver spiller setter bilen sin i et punkt på startstreken, for eksempel {t["first"]}. Farten er (0, 0). Dere kjører mot høyre.',
                 'I hvert trekk endrer du farten med <b>−1, 0 eller +1</b> bortover (x) og oppover (y). Så flytter du bilen like langt som den nye farten.',
                 'Tegn en strek til det nye punktet, og skriv farten og punktet i loggen. Motspilleren sjekker.',
                 'Går streken utenfor løypa, har du <b>krasjet</b>: Stå over én runde, og start igjen fra siste punkt med fart (0, 0). To biler kan ikke stå i samme punkt.']
        ex = dict(txt='Farten var (2, 1), og bilen står i (5, 3). Du velger ny fart (3, 0). Da kjører du til <b>(8, 3)</b>. Neste gang kan farten bli (2–4, −1–1).')
        pages.append(pg(g, inner, side(g, lv, ['2–3 spillere', 'blyant i hver sin farge', 'loggark'], steps, ex, win=('Først rundt og over mål vinner!', 'Krysser to biler mål i samme runde, vinner den som kommer lengst forbi.')), 'free'))
    head = '<tr><th>#</th><th>Fart (x, y)</th><th>Punkt (x, y)</th></tr>'
    rows = ''.join(f'<tr><td>{i}</td><td></td><td></td></tr>' for i in range(1, 25))
    log = '<h2>Loggark · Koordinatløpet</h2><p class="lead">Skriv farten og punktet etter hvert trekk. Ny fart = gammel fart ± 1 i hver retning. Nytt punkt = gammelt punkt + ny fart.</p><div class="cols">' + \
          ''.join(f'<div><p style="margin:0 0 1.5mm;font-weight:700">Spiller {k}: ____________________</p><table class="log">{head}{rows}</table></div>' for k in (1, 2)) + '</div>'
    pages.append(full(g, log))
    g['thumbs'] = g['lv'] + ['Loggark til to spillere']
    return g, pages

# ================= 4. Arealkrigen (område) =================
def grid_svg(n, W=178, H=180, marks=()):
    u = min(W, H) / n; ox = (W - n * u) / 2; oy = (H - n * u) / 2
    s = ''.join(f'<path d="M{ox+i*u:.2f} {oy:.2f}V{oy+n*u:.2f}" stroke="#AFBACD" stroke-width=".3"/>' for i in range(n + 1))
    s += ''.join(f'<path d="M{ox:.2f} {oy+i*u:.2f}H{ox+n*u:.2f}" stroke="#AFBACD" stroke-width=".3"/>' for i in range(n + 1))
    s += f'<rect x="{ox:.2f}" y="{oy:.2f}" width="{n*u:.2f}" height="{n*u:.2f}" fill="none" stroke="#141E36" stroke-width="1"/>'
    return f'<svg width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">{s}</svg>'
def mini_example(kind):
    u = 5; s = ''
    for i in range(13): s += f'<path d="M{i*u} 0V{6*u}" stroke="#AFBACD" stroke-width=".5"/>'
    for i in range(7): s += f'<path d="M0 {i*u}H{12*u}" stroke="#AFBACD" stroke-width=".5"/>'
    if kind == 'rect':
        s += f'<rect x="{u}" y="{u}" width="{3*u}" height="{4*u}" fill="var(--a2)" stroke="#141E36" stroke-width="1.2"/><text x="{2.5*u}" y="{3.3*u}" font-size="7" text-anchor="middle" font-weight="800">12</text>'
        s += f'<rect x="{5*u}" y="{2*u}" width="{6*u}" height="{2*u}" fill="#fff" stroke="#141E36" stroke-width="1.2" stroke-dasharray="2 1.5"/><text x="{8*u}" y="{3.3*u}" font-size="7" text-anchor="middle" font-weight="800">12</text>'
    else:
        s += f'<path d="M{u} {5*u}H{5*u}V{u}Z" fill="var(--a2)" stroke="#141E36" stroke-width="1.2"/><text x="{3.7*u}" y="{4.1*u}" font-size="7" text-anchor="middle" font-weight="800">8</text>'
        s += f'<path d="M{u} {5*u}V{u}H{5*u}Z" fill="#fff" stroke="#141E36" stroke-width="1.2" stroke-dasharray="2 1.5"/><text x="{2.2*u}" y="{2.5*u}" font-size="7" text-anchor="middle" font-weight="800">8</text>'
    return f'<svg width="52mm" height="26mm" viewBox="0 0 {12*u} {6*u}" style="display:block;margin-bottom:1.5mm">{s}</svg>'
def B_areal():
    g = dict(id='arealkrigen', title='Arealkrigen', sub='Erobre mest areal på rutearket', grade=9, ch='9k2', chname='Plangeometri', topic='rektangel', link='#9k2-rektangel',
             a='#2C7FB8', a2='#DDEBF6', typ='Erobringsspill', lv=['Nivå 1: rektangler', 'Nivå 2: velg sidene selv', 'Nivå 3: rettvinklede trekanter'],
             short='Kast terningene og tegn rektangler eller trekanter på rutearket. Den som erobrer mest areal, vinner.')
    pages = []
    S = {1: (['Kast to terninger. Tallene er sidene i et <b>rektangel</b>.',
              'Tegn rektangelet langs rutelinjene i et ledig område. Det kan ikke overlappe andre figurer.',
              'Skriv arealet inni, og merk figuren med ditt tegn: spiller 1 ○, spiller 2 ✕.',
              'Får du ikke plass, står du over. Når begge har stått over etter hverandre, er spillet slutt.'],
             'Du kaster 3 og 4. Du kan tegne 3 × 4 eller 4 × 3. Arealet er <b>12 ruter</b>.', 'rect'),
         2: (['Kast to terninger og gang tallene sammen. Svaret er <b>arealet</b> du skal tegne.',
              'Tegn et rektangel med dette arealet. Du velger sidene selv.',
              'Skriv arealet inni, og merk figuren med ditt tegn: spiller 1 ○, spiller 2 ✕.',
              'Får du ikke plass, står du over. Når begge har stått over etter hverandre, er spillet slutt.'],
             'Du kaster 3 og 4. Arealet skal være <b>12 ruter</b>: Tegn 3 × 4, 2 × 6 eller 1 × 12, der det passer best.', 'rect'),
         3: (['Kast to terninger. Tallene er <b>katetene</b> i en rettvinklet trekant.',
              'Tegn trekanten med katetene langs rutelinjene i et ledig område. To trekanter kan dele et rektangel.',
              'Skriv arealet (katet · katet : 2) inni, og merk med ditt tegn: ○ eller ✕.',
              'Får du ikke plass, står du over. Når begge har stått over etter hverandre, er spillet slutt.'],
             'Du kaster 4 og 4. Arealet er 4 · 4 : 2 = <b>8 ruter</b>.', 'tri')}
    for lv in (1, 2, 3):
        st, ext, kind = S[lv]; n = {1: 18, 2: 18, 3: 16}[lv]
        pages.append(pg(g, grid_svg(n), side(g, lv, ['2 spillere', '2 terninger', 'blyant og linjal'], st, dict(txt=ext, pic=mini_example(kind)),
             box='<div class="score"><div>Spiller 1 ○<br>areal:</div><div>Spiller 2 ✕<br>areal:</div></div>',
             win=('Størst samlet areal vinner!', f'Hele arket er {n*n} ruter.')), 'free'))
    g['thumbs'] = g['lv']
    return g, pages

# ================= 5. Lommeboka (rundbane med økonomi) =================
def r2(v): return round(v + 1e-9, 2)
def kr(v):
    v = r2(v); s = f'{v:,.2f}'.replace(',', ' ').replace('.', ',')
    if s.endswith(',00'): s = s[:-3]
    return s.replace(' ', ' ') + ' kr'
# hver rute: (tittel, tekst, type, funksjon saldo->endring, fasittekst)
def SQ(t, txt, typ, f, fas): return dict(t=t, txt=txt, typ=typ, f=f, fas=fas)
L1 = [
 SQ('START', 'Lønn 3 000 kr. Trekk 20 % skatt.', 'plus', lambda s: 2400, '+ 2 400 kr (3 000 − 600)'),
 SQ('Kino', '2 billetter à 140 kr', 'minus', lambda s: -280, '− 280 kr'),
 SQ('Bursdag', 'Du får 500 kr', 'plus', lambda s: 500, '+ 500 kr'),
 SQ('Utsalg', 'Jakke 800 kr, 25 % avslag', 'minus', lambda s: -600, '− 600 kr (800 − 200)'),
 SQ('Mobil', 'Regning 250 kr', 'minus', lambda s: -250, '− 250 kr'),
 SQ('Sommerjobb', '12 timer à 150 kr', 'plus', lambda s: 1800, '+ 1 800 kr'),
 SQ('Sparekonto', 'Få 2 % rente av saldoen din', 'pct', None, '+ 2 % av saldoen. Eksempel: 4 000 kr gir + 80 kr'),
 SQ('Pizza', '3 pizzaer à 129 kr', 'minus', lambda s: -387, '− 387 kr'),
 SQ('Bruktsalg', 'Du selger et spill for 450 kr', 'plus', lambda s: 450, '+ 450 kr'),
 SQ('Busskort', '500 kr, 50 % ungdomsrabatt', 'minus', lambda s: -250, '− 250 kr'),
 SQ('Strømming', 'Abonnement 99 kr', 'minus', lambda s: -99, '− 99 kr'),
 SQ('Uhell', 'Ny mobilskjerm 1 200 kr', 'minus', lambda s: -1200, '− 1 200 kr'),
 SQ('Fridag', 'Ingenting skjer. Pust ut!', 'corner', lambda s: 0, '0 kr'),
 SQ('Trening', 'Treningsavgift 400 kr', 'minus', lambda s: -400, '− 400 kr'),
 SQ('Pant', '35 flasker à 3 kr', 'plus', lambda s: 105, '+ 105 kr'),
 SQ('Sko', '1 000 kr, 30 % avslag', 'minus', lambda s: -700, '− 700 kr (1 000 − 300)'),
 SQ('Gave', 'Gave til en venn 250 kr', 'minus', lambda s: -250, '− 250 kr'),
 SQ('Barnevakt', '4 timer à 120 kr', 'plus', lambda s: 480, '+ 480 kr'),
 SQ('Uflaks', 'Mist 10 % av saldoen din', 'pct', None, '− 10 % av saldoen. Eksempel: 4 000 kr gir − 400 kr'),
 SQ('Konsert', 'Billett 600 kr + 10 % gebyr', 'minus', lambda s: -660, '− 660 kr (600 + 60)'),
 SQ('Bruktsalg', 'Du selger sykkelen for 1 500 kr', 'plus', lambda s: 1500, '+ 1 500 kr'),
 SQ('3 for 2', '3 flasker brus à 25 kr. Betal for 2.', 'minus', lambda s: -50, '− 50 kr'),
 SQ('Quiz', 'Du vinner 300 kr', 'plus', lambda s: 300, '+ 300 kr'),
 SQ('Hodetelefoner', '600 kr, 15 % avslag', 'minus', lambda s: -510, '− 510 kr (600 − 90)'),
]
L2 = [
 SQ('START', 'Lønn 4 500 kr. Trekk 22 % skatt.', 'plus', lambda s: 3510, '+ 3 510 kr (4 500 · 0,78)'),
 SQ('Mva', 'Hodetelefoner 960 kr eks. mva. Legg til 25 % mva.', 'minus', lambda s: -1200, '− 1 200 kr (960 · 1,25)'),
 SQ('Ferie', 'Kjøp 40 euro. Kurs: 11,60 kr', 'minus', lambda s: -464, '− 464 kr (40 · 11,60)'),
 SQ('Prisøkning', 'Treningskort 450 kr, økt med 8 %', 'minus', lambda s: -486, '− 486 kr (450 · 1,08)'),
 SQ('Fond', 'Saldoen vokser med vekstfaktor 1,03', 'pct', None, 'Saldo · 1,03. Eksempel: 5 000 kr blir 5 150 kr'),
 SQ('Gave', 'Bestemor gir deg 750 kr', 'plus', lambda s: 750, '+ 750 kr'),
 SQ('Nettsalg', 'Selg PC for 2 400 kr. Nettstedet tar 12 % gebyr.', 'plus', lambda s: 2112, '+ 2 112 kr (2 400 · 0,88)'),
 SQ('Strøm', '350 kWh à 1,25 kr', 'minus', lambda s: -437.5, '− 437,50 kr'),
 SQ('Kredittkort', 'Regning 2 000 kr + 2,5 % rente', 'minus', lambda s: -2050, '− 2 050 kr (2 000 · 1,025)'),
 SQ('Utsalg', 'Genser 699 kr, 40 % avslag', 'minus', lambda s: -419.4, '− 419,40 kr (699 · 0,6)'),
 SQ('Mobil', 'Abonnement 389 kr', 'minus', lambda s: -389, '− 389 kr'),
 SQ('Valuta', 'Ferie i USA: 80 dollar. Kurs: 10,80 kr', 'minus', lambda s: -864, '− 864 kr (80 · 10,80)'),
 SQ('Skatt tilbake', 'Du får 6 % av 5 000 kr', 'corner', lambda s: 300, '+ 300 kr'),
 SQ('Konsert', '2 billetter à 595 kr', 'minus', lambda s: -1190, '− 1 190 kr'),
 SQ('Prisfall', 'Mobil 6 000 kr, prisen synker 35 %. Kjøp den!', 'minus', lambda s: -3900, '− 3 900 kr (6 000 · 0,65)'),
 SQ('Lønnsøkning', 'Få 4 % av 4 500 kr ekstra', 'plus', lambda s: 180, '+ 180 kr'),
 SQ('Lån', 'Betal tilbake 500 kr + 5 % rente til en venn', 'minus', lambda s: -525, '− 525 kr'),
 SQ('Sommerjobb', '20 timer à 168 kr, trekk 15 % skatt', 'plus', lambda s: 2856, '+ 2 856 kr (3 360 · 0,85)'),
 SQ('Uflaks', 'Saldoen synker med 10 %', 'pct', None, 'Saldo · 0,9. Eksempel: 5 000 kr blir 4 500 kr'),
 SQ('3 for 2', 'T-skjorter à 179 kr. Kjøp 3, betal for 2.', 'minus', lambda s: -358, '− 358 kr'),
 SQ('Toll og mva', 'Pakke fra utlandet 320 kr. Legg til 25 % mva.', 'minus', lambda s: -400, '− 400 kr (320 · 1,25)'),
 SQ('Quiz', 'Du vinner 1 000 kr', 'plus', lambda s: 1000, '+ 1 000 kr'),
 SQ('Strømming', '3 tjenester à 129 kr, 20 % rabatt', 'minus', lambda s: -309.6, '− 309,60 kr (387 · 0,8)'),
 SQ('Sparekonto', 'Få 3 % rente av saldoen', 'pct', None, 'Saldo · 1,03. Eksempel: 5 000 kr blir 5 150 kr'),
]
# sjekk at fasittekstene stemmer med regnestykket
import re as _re
for L in (L1, L2):
    for q in L:
        if q['f']:
            v = q['f'](0); m = _re.match(r'([+−]) ([\d\s ,]+) kr', q['fas'])
            if v:
                assert m, q['fas']
                num = float(m.group(2).replace(' ', '').replace(' ', '').replace(',', '.')) * (1 if m.group(1) == '+' else -1)
                assert abs(num - v) < 1e-6, (q['t'], num, v)
def perim():
    # 24 ruter rundt et 7 x 7-brett, med klokka fra nederste høyre hjørne (START)
    P = [(6, 6)] + [(6, c) for c in range(5, -1, -1)] + [(r, 0) for r in range(5, -1, -1)] + [(0, c) for c in range(1, 7)] + [(r, 6) for r in range(1, 6)]
    return P
def B_lomme():
    g = dict(id='lommeboka', title='Lommeboka', sub='Rundbanespill med prosent og privatøkonomi', grade=10, ch='10k3', chname='Økonomi', topic='prosentendring', link='#10k3-prosentendring',
             a='#1B7646', a2='#E2F3E9', typ='Rundbane', lv=['Nivå 1: prosent, rabatt og rente', 'Nivå 2: mva, valuta og vekstfaktor'],
             short='Gå rundt brettet med lønn, utsalg, regninger og renter. Før kontoutskrift. Hvem har mest penger etter tre runder?')
    pages = []
    for lv, L in ((1, L1), (2, L2)):
        P = perim(); assert len(P) == 24
        cells = ''
        for i, (q, (r, c)) in enumerate(zip(L, P)):
            corner = (r, c) in ((0, 0), (0, 6), (6, 0), (6, 6))
            cls = 'ms ' + ('corner' if corner or q['typ'] == 'corner' else q['typ'])
            sign = {'plus': 'Inn', 'minus': 'Ut', 'pct': '%', 'corner': ''}[q['typ']]
            cells += f'<div class="{cls}" style="grid-row:{r+1};grid-column:{c+1}"><b>{q["t"]}</b>{q["txt"]}<span class="amt">{sign}</span></div>'
        mid = f'<div class="mid"><div class="logo">Lommeboka</div><p class="start">Startsaldo: 2 000 kr</p><p>Gå med klokka. Hver gang du passerer eller lander på START, får du lønn.</p><p style="font-size:8.5pt;color:#56617A">Grønn kant: penger inn · Rød kant: penger ut · Farget kant: prosent av saldoen</p></div>'
        inner = f'<div class="mono">{cells}{mid}</div>'
        steps = ['Alle starter på START med 2 000 kr. Skriv det øverst i kontoutskriften din.',
                 'Kast terningen og flytt. Gjør det som står i ruta: regn ut beløpet og den nye saldoen.',
                 'Skriv hendelsen, utregningen og ny saldo i kontoutskriften. Motspilleren sjekker, gjerne med kalkulator og fasit.',
                 'Passerer eller lander du på START, får du lønn. Går saldoen under 0, skriver du minus og fortsetter.']
        ex = {1: dict(d=[4], txt='Du lander på <b>Utsalg</b>: jakke 800 kr, 25 % avslag. 25 % av 800 er 200, så du betaler 600 kr. 2 000 kr − 600 kr = <b>1 400 kr</b>.'),
              2: dict(d=[3], txt='Du lander på <b>Prisøkning</b>: 450 kr · 1,08 = 486 kr. 2 000 kr − 486 kr = <b>1 514 kr</b>.')}[lv]
        pages.append(pg(g, inner, side(g, lv, ['2–4 spillere', '1 terning', 'kontoutskrift og kalkulator'], steps, ex, win=('Mest penger etter tre runder vinner!', 'Spillet er slutt når første spiller har gått tre runder.')), 'free'))
    head = '<tr><th>#</th><th>Rute</th><th>Utregning</th><th>Inn / ut</th><th>Saldo</th></tr>'
    rows = '<tr><td>0</td><td>Start</td><td></td><td></td><td><b>2 000 kr</b></td></tr>' + ''.join(f'<tr><td>{i}</td><td></td><td></td><td></td><td></td></tr>' for i in range(1, 24))
    pages.append(full(g, '<h2>Kontoutskrift · Lommeboka</h2><p class="lead">Én tabell per spiller. Skriv utregningen, beløpet som går inn (+) eller ut (−), og den nye saldoen.</p><div class="cols">' +
        ''.join(f'<div><p style="margin:0 0 1.5mm;font-weight:700">Navn: ____________________</p><table class="log">{head}{rows}</table></div>' for _ in (1, 2)) + '</div>'))
    fas = '<h2>Fasit · Lommeboka</h2><p class="lead">Endring i saldoen for hver rute. Rutene med prosent av saldoen avhenger av hvor mye spilleren har.</p><div class="fasit">'
    for lv, L in ((1, L1), (2, L2)):
        fas += f'<div class="blk"><h3>Nivå {lv}</h3>' + ''.join(f'<p><b>{q["t"]}:</b> {q["fas"]}</p>' for q in L) + '</div>'
    pages.append(full(g, fas + '</div>'))
    g['thumbs'] = g['lv'] + ['Kontoutskrift til to spillere', 'Fasit til begge brettene']
    return g, pages

meta2 = []
for make in (B_stige, B_faktor, B_race, B_areal, B_lomme):
    g, pages = make()
    html = f'<!doctype html><html lang="nb"><meta charset="utf-8"><style>{CSS2}</style>' + ''.join(pages) + '</html>'
    open(os.path.join(OUT, g['id'] + '.html'), 'w').write(html)
    meta2.append({k: g[k] for k in ('id', 'title', 'sub', 'grade', 'ch', 'chname', 'topic', 'link', 'short', 'lv', 'a', 'a2', 'typ', 'thumbs')})
    print(g['id'], len(pages), 'sider')
json.dump(meta2, open(os.path.join(OUT, 'spill2.json'), 'w'), ensure_ascii=False, indent=1)
