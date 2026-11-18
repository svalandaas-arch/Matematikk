# Flere varianter av de nye spilltypene. Kjør etter gen.py og gen2.py: python3 gen3.py -> out/<id>.html + spill3.json
import os, json, math, re, random, itertools
from fractions import Fraction as Fr
_src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'gen2.py')).read()
exec(_src[:_src.index('meta2 = []')])
import sympy as sp
import re as R

CSS3 = CSS2 + '''
.sq .q.xs{font-family:Inter;font-weight:700;font-size:7.8pt;line-height:1.2}
.sq .q.m{font-size:10.5pt}
.tr{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:5mm;height:100%;padding:3mm}
.tr div{background:#fff;border:.8mm solid var(--ink);border-radius:5mm;display:flex;align-items:center;justify-content:center;text-align:center;font-family:"Bricolage Grotesque";font-weight:800;font-size:30pt;box-shadow:1.4mm 1.4mm 0 var(--a)}
.tr div.m{font-size:22pt}.tr div.s{font-size:17pt}
.target{display:flex;align-items:center;gap:3mm;background:#fff;border:.6mm solid var(--ink);border-radius:4mm;padding:2mm 3.5mm;margin-bottom:3mm}
.target span{font-size:8.5pt;font-weight:700;line-height:1.2}.target b{font-family:"Bricolage Grotesque";font-weight:800;font-size:22pt;margin-left:auto;white-space:nowrap}
.ms3{display:grid;grid-template-columns:repeat(3,22mm);grid-template-rows:repeat(3,22mm);gap:2mm;margin:2mm 0 4mm}
.ms3 div{border:.5mm solid #141E36;border-radius:2mm;display:flex;align-items:center;justify-content:center;font-family:"Bricolage Grotesque";font-weight:800;font-size:13pt;text-align:center}
.strip{display:flex;flex-direction:column;gap:2.4mm;height:100%}
.lane{display:flex;align-items:stretch;gap:2mm;flex:1}
.lane .who{writing-mode:vertical-rl;transform:rotate(180deg);font-size:8pt;font-weight:700;text-align:center;background:var(--ink);color:#fff;border-radius:2mm;padding:1mm}
.lane svg{flex:1}
.bars{display:flex;flex-direction:column;justify-content:space-between;height:100%}
.bar{display:flex;align-items:center;gap:2.4mm}
.bar span{width:9mm;font-family:"Bricolage Grotesque";font-weight:800;font-size:13pt;text-align:center}
.bar .cells{flex:1;display:grid;grid-template-columns:repeat(12,1fr);border:.7mm solid var(--ink);border-radius:1.6mm;overflow:hidden;background:#fff;height:15mm}
.bar .cells i{border-right:.3mm solid #8E99AE}.bar .cells i:last-child{border-right:0}
.bar .own{width:16mm;height:11mm;border:.4mm dashed #8E99AE;border-radius:2mm;font-size:6.5pt;color:#56617A;display:flex;align-items:flex-start;justify-content:center;padding-top:.6mm}
.hun{display:grid;gap:5mm;height:100%;align-content:center;justify-content:center}
.hun .f{display:flex;flex-direction:column;gap:1mm}
.hun .f b{font-family:"Bricolage Grotesque";font-size:11pt}
'''

def fmt_frac(v, mixed=True):
    v = Fr(v); s = '−' if v < 0 else ''; v = abs(v)
    if v.denominator == 1: return s + nf(v.numerator)
    w, r = divmod(v.numerator, v.denominator)
    if w and mixed: return f'{s}{w} {r}/{v.denominator}'
    return f'{s}{v.numerator}/{v.denominator}'
def dec(v, d=1):
    return nf(round(float(v), d)) if abs(float(v) - round(float(v))) > 1e-9 else nf(int(round(float(v))))

# ---------- kontroll av algebra med sympy ----------
def to_sym(t):
    t = t.replace('−', '-').replace('·', '*').replace(':', '/').replace('²', '**2').replace(' ', '')
    t = re.sub(r'(\d)([a-zA-Z(])', r'\1*\2', t); t = re.sub(r'([a-zA-Z)])(\()', r'\1*\2', t); t = re.sub(r'\)([a-zA-Z\d])', r')*\1', t)
    return sp.sympify(t, locals={'x': sp.Symbol('x'), 'a': sp.Symbol('a'), 'b': sp.Symbol('b'), 'y': sp.Symbol('y')})
def same(e1, e2): return sp.simplify(to_sym(e1) - to_sym(e2)) == 0

# ================= Stigespill: felles mal =================
LAYOUTS = [
  ({3: 21, 11: 27, 19: 36, 28: 45, 33: 47}, {46: 29, 41: 23, 31: 13, 25: 8, 16: 2}),
  ({4: 18, 9: 30, 20: 34, 27: 43, 35: 46}, {47: 32, 39: 22, 29: 12, 24: 6, 14: 3}),
  ({2: 15, 13: 31, 22: 38, 26: 44, 37: 47}, {45: 28, 42: 25, 33: 17, 21: 7, 11: 5}),
]
def stige(g, tasks, layout, ex, rule=None, fas_fmt=' = '):
    global LADDERS, SNAKES
    LADDERS, SNAKES = LAYOUTS[layout]
    pages = []; tasksq = sorted(list(LADDERS) + list(SNAKES))
    for lv in (1, 2):
        assert len(tasks[lv]) == 10, (g['id'], lv, len(tasks[lv]))
        T = dict(zip(tasksq, tasks[lv])); cells = []
        for n in range(1, 49):
            c, r = sqpos(n); inner = f'<span class="no">{n}</span>'; cls = 'sq'
            if n == 1: inner += '<span class="big">Start</span>'; cls += ' start'
            elif n == 48: inner += '<span class="big">Mål</span>'; cls += ' goal'
            elif n in T:
                q = T[n][0]; cls += ' task'; L = len(re.sub('<[^>]+>', '', q))
                qc = ' xs' if L > 16 else ' s' if L > 10 else ' m' if L > 7 else ''
                inner += f'<span class="q{qc}">{q}</span>'
                inner += f'<span class="hint up">Riktig → {LADDERS[n]}</span>' if n in LADDERS else f'<span class="hint down">Feil → {SNAKES[n]}</span>'
            cells.append(f'<div class="{cls}" style="grid-row:{r+1};grid-column:{c+1}">{inner}</div>')
        svg = ''.join(ladder_svg(a, b) for a, b in LADDERS.items()) + ''.join(snake_svg(a, b) for a, b in SNAKES.items())
        inner = f'<div class="snl">{"".join(cells)}</div><svg class="ovl" width="{BW}mm" height="{BH}mm" viewBox="0 0 {BW} {BH}" opacity=".62">{svg}</svg>'
        foot = min(LADDERS); top = LADDERS[foot]
        steps = ['Alle starter på rute 1. Kast terningen og flytt like mange ruter fremover.',
                 ('Lander du på en <b>stige</b>, må du løse oppgaven i ruta. ' + (rule[lv] + ' ' if rule else '') + 'Riktig svar: klatre opp. Feil svar: bli stående.'),
                 'Lander du på en <b>slange</b>, må du også løse oppgaven. Riktig svar: du slipper unna. Feil svar: skli ned.',
                 'Motspilleren sjekker svaret i fasiten på siste side. Så er det neste spiller sin tur.']
        q0, a0 = T[foot]; e = ex(lv, q0, a0) if callable(ex) else f'Du svarer {a0}.'
        exd = dict(txt=f'Du lander på rute {foot} med oppgaven <b>{q0.replace("<br>", ", ")}</b>. {e} Riktig, så du klatrer opp til rute {top}.')
        pages.append(pg(g, inner, side(g, lv, ['2–4 spillere', '1 terning', '1 brikke hver'], steps, exd, win=('Først til rute 48 vinner!', 'Du trenger ikke treffe nøyaktig.')), 'free'))
    fas = f'<h2>Fasit · {g["title"]}</h2><p class="lead">Til motspilleren. Brett arket eller legg det med fasiten ned.</p><div class="fasit">'
    for lv in (1, 2):
        fas += f'<div class="blk"><h3>Nivå {lv}</h3>' + ''.join(f'<p>Rute {n}: <b>{q}</b>{fas_fmt}{a}</p>' for n, (q, a) in zip(tasksq, tasks[lv])) + '</div>'
    pages.append(full(g, fas + '</div>'))
    g['typ'] = 'Stigespill'; g['thumbs'] = g['lv'] + ['Fasit til begge brettene']
    return g, pages

def ev(t):
    return sp.nsimplify(to_sym(t.replace('(−', '(-')))

# --- Minusstigen ---
def B_minus():
    q1 = ['−5 + 8', '3 − 9', '−4 − 6', '7 + (−3)', '−2 − (−7)', '−8 + 3', '6 − (−4)', '−12 + 12', '−3 + (−9)', '0 − 7']
    q2 = ['−4 · 6', '−5 · (−3)', '−36 : 9', '−42 : (−7)', '(−2)²', '3 · (−4) + 5', '−2 · (3 − 8)', '−18 : 3 − 4', '(−1) · (−1) · (−1)', '−6 + 4 · (−2)']
    T = {lv: [(q, nf(int(ev(q)))) for q in qs] for lv, qs in ((1, q1), (2, q2))}
    g = dict(id='minusstigen', title='Minusstigen', sub='Stigespill med negative tall', grade=8, ch='kap1', chname='Tall og tallregning', topic='negative-tall', link='#kap1-negative-tall',
             a='#3B6FD8', a2='#E4ECFB', lv=['Nivå 1: addisjon og subtraksjon', 'Nivå 2: multiplikasjon, divisjon og flere ledd'],
             short='Stiger og slanger med negative tall: svar riktig for å klatre opp stigen eller slippe unna slangen.')
    return stige(g, T, 1, None)

# --- Brøkstigen ---
def B_brok():
    t1 = [('Forkort 6/8', '3/4'), ('Forkort 12/18', '2/3'), ('3/4 som desimaltall', '0,75'), ('0,2 som brøk', '1/5'), ('Utvid 2/5 til tideler', '4/10'),
          ('Størst: 3/5 eller 2/3?', '2/3'), ('Forkort 15/20', '3/4'), ('1/8 som desimaltall', '0,125'), ('2/3 av 18', '12'), ('7/4 som blandet tall', '1 3/4')]
    assert Fr(6, 8) == Fr(3, 4) and Fr(12, 18) == Fr(2, 3) and Fr(15, 20) == Fr(3, 4) and Fr(2, 3) > Fr(3, 5) and Fr(2, 3) * 18 == 12
    q2 = [('1/2 + 1/3', Fr(1, 2) + Fr(1, 3)), ('3/4 − 1/6', Fr(3, 4) - Fr(1, 6)), ('2/3 · 3/5', Fr(2, 3) * Fr(3, 5)), ('3/4 : 3/8', Fr(3, 4) / Fr(3, 8)), ('1 1/2 + 2/3', Fr(3, 2) + Fr(2, 3)),
          ('5/6 − 1/2', Fr(5, 6) - Fr(1, 2)), ('4 · 3/8', 4 * Fr(3, 8)), ('2/5 : 4', Fr(2, 5) / 4), ('2 − 3/4', 2 - Fr(3, 4)), ('1/4 + 1/4 · 2', Fr(1, 4) + Fr(1, 4) * 2)]
    T = {1: t1, 2: [(q, fmt_frac(v)) for q, v in q2]}
    g = dict(id='brokstigen', title='Brøkstigen', sub='Stigespill med brøk', grade=8, ch='kap2', chname='Delelighet og brøk', topic='brok-add', link='#kap2-brok-add',
             a='#E9A23B', a2='#FCEFD6', lv=['Nivå 1: forkorte, utvide og desimaltall', 'Nivå 2: regning med brøk'],
             short='Stiger og slanger med brøkoppgaver: forkorting, desimaltall og de fire regneartene med brøk.')
    return stige(g, T, 2, None, fas_fmt=' → ')

# --- Algebrastigen ---
def B_alg():
    t1 = [('3a + 5a', '8a'), ('7x − 2x + x', '6x'), ('4a + 3b − a', '3a + 3b'), ('2x + 5 + 3x − 1', '5x + 4'), ('6b − 2b − 4b', '0'),
          ('5y − 5y + 2', '2'), ('x = 3: 4x + 2', '14'), ('a = 5: 2a − 7', '3'), ('x = −2: 3x + 1', '−5'), ('a = 4: a² + a', '20')]
    t2 = [('3(x + 4)', '3x + 12'), ('−2(a − 5)', '−2a + 10'), ('4x · 3', '12x'), ('2a · 3a', '6a²'), ('5 − (x − 2)', '7 − x'),
          ('2(x + 1) + 3x', '5x + 2'), ('x(x + 3)', 'x² + 3x'), ('6x : 2', '3x'), ('4(2a − 1) − 3a', '5a − 4'), ('−(3 − y) + 2y', '3y − 3')]
    for q, a in t1:
        if ':' in q and '=' in q:
            v, e = q.split(':'); var, val = v.split('='); assert to_sym(e).subs(sp.Symbol(var.strip()), int(val.replace('−', '-'))) == to_sym(a), q
        else: assert same(q, a), q
    for q, a in t2: assert same(q, a), q
    g = dict(id='algebrastigen', title='Algebrastigen', sub='Stigespill med algebraiske uttrykk', grade=8, ch='kap3', chname='Algebra', topic='forenkling', link='#kap3-forenkling',
             a='#2E9E6A', a2='#E3F4EB', lv=['Nivå 1: trekke sammen og sette inn', 'Nivå 2: parenteser og multiplikasjon'],
             short='Stiger og slanger med algebra: trekk sammen, sett inn verdier og løs opp parenteser.')
    return stige(g, {1: t1, 2: t2}, 0, None)

# --- Pytagorasstigen ---
def B_pyt():
    k1 = [(3, 4), (6, 8), (5, 12), (9, 12), (8, 15), (1, 1), (7, 24), (2, 3), (12, 16), (4, 4)]
    t1 = [(f'{a} og {b}', dec(math.hypot(a, b))) for a, b in k1]
    k2 = [(10, 6), (13, 5), (25, 7), (17, 8), (26, 10), (5, 4), (41, 9), (10, 5), (20, 12), (6, 3)]
    t2 = [(f'h = {h}<br>k = {k}', dec(math.sqrt(h * h - k * k))) for h, k in k2]
    g = dict(id='pytagorasstigen', title='Pytagorasstigen', sub='Stigespill med Pytagoras-setningen', grade=9, ch='9k2', chname='Geometri', topic='pytagoras', link='#9k2-pytagoras',
             a='#8257D8', a2='#EEE7FB', lv=['Nivå 1: finn hypotenusen', 'Nivå 2: finn kateten'],
             short='Stiger og slanger med rettvinklede trekanter: regn ut hypotenusen eller kateten med Pytagoras.')
    rule = {1: 'Tallene er katetene. Finn hypotenusen, med én desimal hvis det trengs.', 2: 'Ruta viser hypotenusen (h) og én katet (k). Finn den andre kateten, med én desimal hvis det trengs.'}
    def exf(lv, q, a):
        p = [int(t) for t in R.findall(r'\d+', q)]
        return f'Du regner √({p[0]}² + {p[1]}²) = {a}.' if lv == 1 else f'Du regner √({p[0]}² − {p[1]}²) = {a}.'
    return stige(g, {1: t1, 2: t2}, 2, exf, rule=rule, fas_fmt=' → ')

# --- Sannsynlighetsstigen ---
def B_sanns2():
    t1 = [('Terning: P(6)', '1/6'), ('Terning: P(partall)', '1/2 = 3/6'), ('Mynt: P(kron)', '1/2'), ('Kortstokk: P(hjerter)', '1/4 = 13/52'), ('Terning: P(over 4)', '1/3 = 2/6'),
          ('3 røde og 5 blå kuler: P(rød)', '3/8'), ('Kortstokk: P(ess)', '1/13 = 4/52'), ('Tall 1–10: P(primtall)', '2/5 = 4/10'), ('Terning: P(7)', '0'), ('2 grønne og 6 gule: P(gul)', '3/4 = 6/8')]
    t2 = [('To mynter: P(to kron)', '1/4'), ('To terninger: P(sum 12)', '1/36'), ('To terninger: P(to like)', '1/6 = 6/36'), ('3 bukser, 4 gensere: antall antrekk', '12'),
          ('PIN med 4 siffer: antall koder', '10 000'), ('To terninger: P(sum 7)', '1/6 = 6/36'), ('Mynt og terning: P(kron og 6)', '1/12'), ('3 personer i kø: antall rekkefølger', '6'),
          ('To mynter: P(minst én kron)', '3/4'), ('To terningkast: P(ingen 6-ere)', '25/36')]
    # kontroller nivå 2 ved å telle utfall
    D = list(itertools.product(range(1, 7), repeat=2))
    assert Fr(sum(a + b == 12 for a, b in D), 36) == Fr(1, 36) and Fr(sum(a == b for a, b in D), 36) == Fr(1, 6)
    assert Fr(sum(a + b == 7 for a, b in D), 36) == Fr(1, 6) and Fr(sum(6 not in (a, b) for a, b in D), 36) == Fr(25, 36)
    g = dict(id='sannsynlighetsstigen', title='Sannsynlighetsstigen', sub='Stigespill med sannsynlighet og kombinatorikk', grade=9, ch='9k4', chname='Sannsynlighet', topic='en-hendelse', link='#9k4-en-hendelse',
             a='#D9475A', a2='#FBE5E8', lv=['Nivå 1: én hendelse', 'Nivå 2: flere hendelser og kombinatorikk'],
             short='Stiger og slanger med sannsynlighet: én hendelse, flere hendelser og antall muligheter.')
    return stige(g, {1: t1, 2: t2}, 1, None, fas_fmt=' → ')
def LAYOUT_FIRST(k):
    L, S = LAYOUTS[k]; return sorted(list(L) + list(S)).index(min(L))

# --- Likningsstigen ---
def B_likn():
    t1 = ['3(x − 2) = 12', 'x/4 = 5', '2x + 7 = 5x − 2', 'x/3 + 2 = 6', '5 − 2x = 11', '4(x + 1) = 2x + 10', 'x/2 − x/5 = 3', '0,5x + 3 = 7', '7x = 2x + 35', '2(3x − 1) = 4x + 6']
    t2 = ['x² = 49', 'x² − 16 = 0', '2x² = 50', 'x² + 9 = 45', 'x + y = 10<br>x − y = 4', '2x + y = 11<br>x − y = 1', 'x(x − 3) = 0', 'y = 2x<br>x + y = 12', '(x − 2)² = 9', 'x² = 2x']
    x, y = sp.symbols('x y')
    def solve(q):
        eqs = [e for e in q.split('<br>')]
        E = [sp.Eq(to_sym(l.replace(',', '.')), to_sym(r.replace(',', '.'))) for l, r in (e.split('=') for e in eqs)]
        if len(E) == 1:
            s = sorted(sp.solve(E[0], x), reverse=True)
            if len(s) == 1: return f'x = {nf(int(s[0]))}'
            if s[0] == -s[1]: return f'x = ±{nf(int(s[0]))}'
            return f'x = {nf(int(s[0]))} eller x = {nf(int(s[1]))}'
        s = sp.solve(E, [x, y]); return f'x = {nf(int(s[x]))}, y = {nf(int(s[y]))}'
    T = {1: [(q, solve(q)) for q in t1], 2: [(q, solve(q)) for q in t2]}
    g = dict(id='likningsstigen', title='Likningsstigen', sub='Stigespill med likninger', grade=10, ch='10k1', chname='Algebra', topic='likn10', link='#10k1-likn10',
             a='#4C5BD4', a2='#E6E8FA', lv=['Nivå 1: likninger med parenteser og brøk', 'Nivå 2: andregradslikninger og likningssett'],
             short='Stiger og slanger med likninger: parenteser, brøk, andregradslikninger og likningssett.')
    return stige(g, T, 2, lambda lv, q, a: f'Du løser den og får {a}.', fas_fmt=' → ')

# ================= Tre som treffer (strategi, egentlig tre på rad) =================
MAGIC = [[2, 7, 6], [9, 5, 1], [4, 3, 8]]
def treff(g, levels):
    pages = []; teacher = ''
    for lv, (cards, target, tdesc, ex) in enumerate(levels, 1):
        assert len(cards) == 9
        cells = ''.join(f'<div class="{"s" if len(re.sub("<[^>]+>","",c))>7 else "m" if len(re.sub("<[^>]+>","",c))>4 else ""}">{c}</div>' for c in cards)
        steps = ['Legg brettet mellom dere. Dere bytter på å ta ett kort om gangen: tegn ditt tegn på kortet (spiller 1 ○, spiller 2 ✕).',
                 f'Et kort kan bare tas én gang. Målet er å ha <b>tre kort</b> som til sammen blir <b>{target}</b>.',
                 'Du kan ha flere enn tre kort, men det er nøyaktig tre av dem som skal gi summen.',
                 'Tenk på hva motspilleren trenger, og ta det kortet først hvis du kan. Blir alle kortene tatt uten vinner, er det uavgjort.']
        box = f'<div class="target"><span>Tre kort som til<br>sammen blir</span><b>{target}</b></div>'
        pages.append(pg(g, f'<div class="tr">{cells}</div>', side(g, lv, ['2 spillere', '1 blyant', 'ingen terning'], steps, dict(txt=ex), box,
                       win=('Først til tre kort med riktig sum vinner!', 'Spill flere runder og bytt på hvem som begynner.')), 'free'))
        # lærerside: kortene ordnet som et magisk kvadrat
        sq = ''.join(f'<div>{cards[MAGIC[r][c]-1]}</div>' for r in range(3) for c in range(3))
        teacher += f'<div class="blk"><h3>Nivå {lv}: summen {target}</h3><div class="ms3">{sq}</div></div>'
    pages.append(full(g, f'<h2>For læreren · {g["title"]}</h2><p class="lead">Spillet er egentlig tre på rad i forkledning. Legger du kortene i et magisk kvadrat, gir hver rad, kolonne og diagonal summen. Tre kort med riktig sum er alltid en linje i kvadratet. Vis elevene dette etter noen runder, og la dem prøve å forklare hvorfor.</p><div class="cols">{teacher}</div>'))
    g['typ'] = 'Strategispill'; g['thumbs'] = g['lv'] + ['For læreren: det magiske kvadratet']
    return g, pages
def check_treff(vals, target):
    # alle trippel med riktig sum må svare til linjene i det magiske kvadratet (8 stk)
    tr = [c for c in itertools.combinations(range(9), 3) if sum(vals[i] for i in c) == target]
    assert len(tr) == 8, (len(tr), target)
def B_null():
    v1 = list(range(-4, 5)); v2 = [3 * k for k in range(-4, 5)]
    check_treff(v1, 0); check_treff(v2, 0)
    g = dict(id='nullspillet', title='Nullspillet', sub='Strategispill med negative tall', grade=8, ch='kap1', chname='Tall og tallregning', topic='negative-tall', link='#kap1-negative-tall',
             a='#3B6FD8', a2='#E4ECFB', lv=['Nivå 1: tallene −4 til 4', 'Nivå 2: tallene −12 til 12'],
             short='Ta kort etter tur. Den som først har tre kort med summen 0, vinner. Et strategispill med negative tall.')
    return treff(g, [([nf(v) for v in v1], '0', '', 'Du har −3, 1 og 4. Det er −3 + 1 + 4 = 2. Ikke 0 ennå! Tar du 2, kan −3 + 1 + 2 = 0 bli din vinner.'),
                     ([nf(v) for v in v2], '0', '', 'Du har −9 og 3. Hvilket kort trenger du? −9 + 3 + 6 = 0. Har motspilleren allerede tatt 6, må du tenke nytt.')])
def B_brokspill():
    v1 = [Fr(i, 12) for i in range(1, 10)]; check_treff(v1, Fr(15, 12))
    c1 = [fmt_frac(v) for v in v1]
    v2 = [Fr(i, 10) for i in range(1, 10)]; check_treff(v2, Fr(3, 2))
    forms = [lambda v: fmt_frac(v), lambda v: dec(v, 2), lambda v: nf(int(v * 100)) + ' %']
    c2 = [forms[i % 3](v) for i, v in enumerate(v2)]
    g = dict(id='brokspillet', title='Brøkspillet', sub='Strategispill med brøk, desimaltall og prosent', grade=8, ch='kap2', chname='Delelighet og brøk', topic='brok-add', link='#kap2-brok-add',
             a='#E9A23B', a2='#FCEFD6', lv=['Nivå 1: brøker med summen 5/4', 'Nivå 2: brøk, desimaltall og prosent med summen 1,5'],
             short='Ta kort etter tur. Den som først har tre kort som til sammen blir målsummen, vinner. Strategi med brøkaddisjon.')
    return treff(g, [(c1, '5/4', '', 'Du har 1/4 og 2/3. 1/4 + 2/3 = 11/12. Du mangler 4/12 = 1/3 for å få 5/4.'),
                     (c2, '1,5', '', 'Du har 0,2 og 70 %. Det er 0,2 + 0,7 = 0,9. Du trenger 0,6, altså 6/10 = 3/5.')])
def B_algspill():
    c1 = [f'{"" if i==1 else i}x + {10-i}' for i in range(1, 10)]
    c2 = [f'{"" if i==1 else i}a − {"" if i==9 else 10-i}b' for i in range(1, 10)]
    x, a, b = sp.symbols('x a b')
    tr = [c for c in itertools.combinations(range(9), 3) if sp.simplify(sum(to_sym(c1[i]) for i in c) - to_sym('15x + 15')) == 0]; assert len(tr) == 8
    tr = [c for c in itertools.combinations(range(9), 3) if sp.simplify(sum(to_sym(c2[i]) for i in c) - to_sym('15a − 15b')) == 0]; assert len(tr) == 8
    g = dict(id='algebraspillet', title='Algebraspillet', sub='Strategispill med algebraiske uttrykk', grade=8, ch='kap3', chname='Algebra', topic='forenkling', link='#kap3-forenkling',
             a='#2E9E6A', a2='#E3F4EB', lv=['Nivå 1: summen 15x + 15', 'Nivå 2: summen 15a − 15b'],
             short='Ta kort etter tur. Den som først har tre uttrykk som til sammen blir målsummen, vinner. Trening i å trekke sammen.')
    return treff(g, [(c1, '15x + 15', '', 'Du har 2x + 8 og 6x + 4. Til sammen 8x + 12. Du trenger 7x + 3 for å få 15x + 15.'),
                     (c2, '15a − 15b', '', 'Du har a − 9b og 5a − 5b. Til sammen 6a − 14b. Du trenger 9a − b.')])

# ================= Brøkløpet (løpespill på tallinja) =================
def lane_svg(start, W=150, H=17, stars=(), whole=None):
    # én stripe fra start til start+1 med tolvdeler
    s = f'<rect x="0" y="{H*0.38:.1f}" width="{W}" height="{H*0.24:.1f}" fill="#fff" stroke="#141E36" stroke-width=".5"/>'
    for i in range(13):
        x = i * W / 12; big = i in (0, 12); mid = i == 6; q = i in (3, 9); t = i in (4, 8)
        h = H * (0.44 if big else 0.3 if mid else 0.22 if (q or t) else 0.16)
        s += f'<path d="M{x:.2f} {H/2-h:.2f}V{H/2+h:.2f}" stroke="#141E36" stroke-width="{.7 if big else .4}"/>'
    s += f'<text x="1" y="{H-0.6:.1f}" font-size="3.6" font-weight="800" font-family="Bricolage Grotesque">{start}</text>'
    for st in stars:
        x = st * W / 12; s += f'<text x="{x:.2f}" y="{H*0.3:.2f}" font-size="4.6" text-anchor="middle" fill="#E9A23B">★</text>'
    return f'<svg width="100%" height="100%" viewBox="-1.5 0 {W+3} {H}" preserveAspectRatio="none" font-family="Inter">{s}</svg>'
def B_brokloep():
    g = dict(id='broklopet', title='Brøkløpet', sub='Løpespill på tallinja med brøk', grade=8, ch='kap2', chname='Delelighet og brøk', topic='brok-add', link='#kap2-brok-add',
             a='#E07B39', a2='#FCEBDD', typ='Løpespill', lv=['Nivå 1: legg sammen brøker', 'Nivå 2: legg sammen eller trekk fra'],
             short='Kast terningene, regn med brøkene og flytt på tallinja. Lander du på en stjerne, får du en ekstra tur. Først til 4 vinner.')
    STARS = {0: (5,), 1: (8,), 2: (3, 10), 3: (7,)}
    TAB = {1: {1: Fr(1, 12), 2: Fr(1, 6), 3: Fr(1, 4), 4: Fr(1, 3), 5: Fr(1, 2), 6: Fr(2, 3)},
           2: {1: Fr(5, 12), 2: Fr(1, 2), 3: Fr(3, 4), 4: Fr(5, 6), 5: Fr(1, 1), 6: Fr(4, 3)}}
    pages = []
    for lv in (1, 2):
        lanes = ''
        for p in (1, 2):
            for k in range(4):
                lanes += f'<div class="lane"><span class="who">Spiller {p}</span>{lane_svg(f"{k} → {k+1}", stars=STARS[k])}</div>'
            if p == 1: lanes += '<div style="height:3mm"></div>'
        tab = '<table class="maptab"><tr><th>Terning</th>' + ''.join(f'<th>{die(i,18)}</th>' for i in range(1, 7)) + '</tr><tr><th>Brøk</th>' + ''.join(f'<td>{fmt_frac(TAB[lv][i])}</td>' for i in range(1, 7)) + '</tr></table>'
        steps = ['Hver spiller har sin egen tallinje fra 0 til 4, delt i tolvdeler. Alle starter på 0.',
                 'Kast to terninger. Tabellen viser hvilken brøk hver terning gir.',
                 ('Flytt <b>summen</b> av de to brøkene, eller bare én av dem.' if lv == 1 else 'Flytt <b>summen</b> eller <b>differansen</b> av de to brøkene, eller bare én av dem.') + ' Skriv regnestykket og sett et merke der du lander.',
                 'Lander du nøyaktig på en <b>stjerne</b> ★, får du en ekstra tur. Motspilleren sjekker utregningen.']
        ex = {1: dict(d=[3, 4], txt='Du kaster 3 og 4: 1/4 + 1/3 = 3/12 + 4/12 = <b>7/12</b>. Står du på 0, lander du på 7/12.'),
              2: dict(d=[3, 4], txt='Du kaster 3 og 4: 3/4 + 5/6 = <b>1 7/12</b>, eller 5/6 − 3/4 = <b>1/12</b>. Velg det som treffer en stjerne!')}[lv]
        pages.append(pg(g, f'<div class="strip">{lanes}</div>', side(g, lv, ['2 spillere', '2 terninger', 'blyant'], steps, ex, tab, win=('Først til 4 vinner!', 'Du trenger ikke treffe 4 nøyaktig.')), 'free'))
    g['thumbs'] = g['lv']
    return g, pages

# ================= Brøkkrigen og Prosentkrigen (erobring) =================
def B_brokkrig():
    g = dict(id='brokkrigen', title='Brøkkrigen', sub='Erobre flest brøkstriper', grade=8, ch='kap2', chname='Delelighet og brøk', topic='forkorting', link='#kap2-forkorting',
             a='#C2362B', a2='#FBE3E0', typ='Erobringsspill', lv=['Nivå 1: tolvdeler', 'Nivå 2: brøk, desimaltall og prosent'],
             short='Kast terningene og fargelegg brøkdeler av stripene. Den som har mest av en stripe, eier den. Flest striper vinner.')
    TAB = {1: [('1/12', 1), ('1/6', 2), ('1/4', 3), ('1/3', 4), ('1/2', 6), ('2/3', 8)],
           2: [('4/24', 2), ('0,25', 3), ('50 %', 6), ('6/18', 4), ('5/6', 10), ('0,75', 9)]}
    for lv, t in TAB.items():
        for txt, n in t:
            v = Fr(int(txt.split('/')[0]), int(txt.split('/')[1])) if '/' in txt else (Fr(txt.replace(' %', '')) / 100 if '%' in txt else Fr(txt.replace(',', '.')))
            assert v * 12 == n, (txt, n)
    pages = []
    for lv in (1, 2):
        bars = ''.join(f'<div class="bar"><span>{chr(65+i)}</span><div class="cells">{"<i></i>"*12}</div><div class="own">Eier</div></div>' for i in range(8))
        tab = '<table class="maptab"><tr><th>Terning</th>' + ''.join(f'<th>{die(i,18)}</th>' for i in range(1, 7)) + '</tr><tr><th>Del</th>' + ''.join(f'<td>{t}</td>' for t, _ in TAB[lv]) + '</tr></table>'
        steps = ['Hver stripe er en hel, delt i 12 like deler. Kast to terninger. Tabellen viser hvilken brøk hver terning gir.',
                 'Fargelegg de to brøkdelene i ledige ruter, i samme stripe eller i to ulike striper. Skriv brøken i feltet du fargela.' + (' Skriv brøken som tolvdeler.' if lv == 2 else ''),
                 'Spiller 1 tegner ○ i rutene sine, spiller 2 tegner ✕. Er det ikke plass til en brøkdel, mister du den.',
                 'Når alle stripene er fulle, eier den som har flest ruter i en stripe, hele stripen. Skriv navnet i eierfeltet.']
        ex = {1: dict(d=[3, 5], txt='Du kaster 3 og 5: 1/4 og 1/2. Det er 3 og 6 tolvdeler. Du kan fylle 9 ruter i én stripe, eller dele dem på to.'),
              2: dict(d=[2, 6], txt='Du kaster 2 og 6: 0,25 og 0,75. Det er 3/12 og 9/12, til sammen en hel stripe!')}[lv]
        pages.append(pg(g, f'<div class="bars">{bars}</div>', side(g, lv, ['2 spillere', '2 terninger', 'blyant'], steps, ex, tab, win=('Flest striper vinner!', 'Står det likt, vinner den med flest ruter totalt.')), 'free'))
    g['thumbs'] = g['lv']
    return g, pages
def hundred(cols, rows, u=8.2):
    W, H = cols * u, rows * u
    s = ''.join(f'<path d="M{i*u:.2f} 0V{H:.2f}" stroke="{"#141E36" if i%10==0 else "#AFBACD"}" stroke-width="{.6 if i%10==0 else .3}"/>' for i in range(cols + 1))
    s += ''.join(f'<path d="M0 {i*u:.2f}H{W:.2f}" stroke="{"#141E36" if i%10==0 else "#AFBACD"}" stroke-width="{.6 if i%10==0 else .3}"/>' for i in range(rows + 1))
    return f'<svg width="{W+1:.1f}mm" height="{H+1:.1f}mm" viewBox="-.5 -.5 {W+1:.1f} {H+1:.1f}"><rect width="{W}" height="{H}" fill="#fff"/>{s}</svg>'
def B_proskrig():
    g = dict(id='prosentkrigen', title='Prosentkrigen', sub='Erobre flest hundreruter', grade=10, ch='10k3', chname='Økonomi', topic='finne-prosent', link='#10k3-finne-prosent',
             a='#1F9AA6', a2='#DFF3F4', typ='Erobringsspill', lv=['Nivå 1: prosent av 100 ruter', 'Nivå 2: prosent av 200 ruter'],
             short='Kast terningene og fargelegg prosentdeler av rutefeltene. Den som har mest av et felt, eier det.')
    TAB = {1: [5, 10, 15, 20, 25, 30], 2: [2.5, 7.5, 12.5, 15, 22.5, 35]}
    for p in TAB[2]: assert (p * 200 / 100) == int(p * 200 / 100)
    pages = []
    for lv in (1, 2):
        if lv == 1:
            fields = ''.join(f'<div class="f"><b>Felt {chr(65+i)} · 100 ruter</b>{hundred(10, 10, 7.9)}</div>' for i in range(4))
            inner = f'<div class="hun" style="grid-template-columns:repeat(2,auto)">{fields}</div>'
        else:
            fields = ''.join(f'<div class="f"><b>Felt {chr(65+i)} · 200 ruter</b>{hundred(20, 10, 8.1)}</div>' for i in range(2))
            inner = f'<div class="hun">{fields}</div>'
        tab = '<table class="maptab"><tr><th>Terning</th>' + ''.join(f'<th>{die(i,18)}</th>' for i in range(1, 7)) + '</tr><tr><th>Prosent</th>' + ''.join(f'<td>{nf(p)}</td>' for p in TAB[lv]) + '</tr></table>'
        N = 100 if lv == 1 else 200
        steps = [f'Hvert felt har {N} ruter. Kast to terninger. Tabellen viser hvor mange prosent hver terning gir.',
                 'Velg én av prosentene, eller summen av begge. Regn ut hvor mange ruter det er av ett felt, og fargelegg dem i ledige ruter i det feltet.',
                 'Skriv prosenten og antall ruter i området. Spiller 1 tegner ○, spiller 2 ✕. Er det ikke plass, står du over.',
                 'Når alle feltene er fulle, eller ingen kan gjøre flere trekk, eier den som har flest ruter i et felt, hele feltet.']
        ex = {1: dict(d=[4, 6], txt='Du kaster 4 og 6: 20 % eller 30 %, eller 50 % til sammen. 50 % av 100 ruter er <b>50 ruter</b>.'),
              2: dict(d=[3, 6], txt='Du kaster 3 og 6: 12,5 % og 35 %. 12,5 % av 200 er <b>25 ruter</b>. Summen 47,5 % av 200 er <b>95 ruter</b>.')}[lv]
        pages.append(pg(g, inner, side(g, lv, ['2 spillere', '2 terninger', 'fargeblyanter'], steps, ex, tab, win=('Flest felt vinner!', 'Står det likt, vinner den med flest ruter totalt.')), 'free'))
    g['thumbs'] = g['lv']
    return g, pages

# ================= Oppussingen (rundbane) =================
PI = 3.14
def OQ(t, txt, f, fas): return dict(t=t, txt=txt, typ='minus' if f < 0 else 'plus' if f > 0 else 'corner', f=lambda s, f=f: f, fas=fas, v=f)
def kr2(v):
    s = f'{abs(v):,.2f}'.replace(',', ' ').replace('.', ',')
    if s.endswith(',00'): s = s[:-3]
    return ('− ' if v < 0 else '+ ' if v > 0 else '') + s.replace(' ', ' ') + ' kr'
def B_oppuss():
    g = dict(id='oppussingen', title='Oppussingen', sub='Rundbanespill med areal, omkrets og volum', grade=9, ch='9k2', chname='Geometri', topic='sammensatte', link='#9k2-sammensatte',
             a='#B5651D', a2='#FBEBDD', typ='Rundbane', lv=['Nivå 1: areal og omkrets', 'Nivå 2: sirkel, volum og Pytagoras'],
             short='Pus opp huset! Regn ut areal, omkrets og volum for å finne prisen. Den som har mest penger igjen etter tre runder, vinner.')
    A = lambda a, b: a * b
    L1 = [
     OQ('START', 'Lønn: Du får 6 000 kr', 6000, '+ 6 000 kr'),
     OQ('Maling', 'Vegg 4 m × 2,5 m. Maling 30 kr per m²', -A(4, 2.5) * 30, '10 m² · 30 = 300 kr'),
     OQ('Gulvlist', 'Rom 4 m × 3 m. List rundt hele rommet, 45 kr per m', -(2 * (4 + 3)) * 45, '14 m · 45 = 630 kr'),
     OQ('Parkett', 'Gulv 4 m × 3 m. 250 kr per m²', -A(4, 3) * 250, '12 m² · 250 = 3 000 kr'),
     OQ('Fliser', 'Bad 2 m × 1,5 m. 400 kr per m²', -A(2, 1.5) * 400, '3 m² · 400 = 1 200 kr'),
     OQ('Bruktsalg', 'Selg gammel sofa: 800 kr', 800, '+ 800 kr'),
     OQ('Gjerde', 'Hage 10 m × 6 m, gjerde på tre sider (10 + 6 + 6). 100 kr per m', -(10 + 6 + 6) * 100, '22 m · 100 = 2 200 kr'),
     OQ('Taklist', 'Rom 5 m × 4 m. List rundt hele rommet, 40 kr per m', -(2 * (5 + 4)) * 40, '18 m · 40 = 720 kr'),
     OQ('Vindu', 'Glass 1,5 m × 0,8 m. 900 kr per m²', -A(1.5, 0.8) * 900, '1,2 m² · 900 = 1 080 kr'),
     OQ('Gavl', 'Trekant: grunnlinje 6 m, høyde 2 m. Maling 25 kr per m²', -(6 * 2 / 2) * 25, '6 m² · 25 = 150 kr'),
     OQ('Plen', 'Trapes: sidene 8 m og 6 m, høyde 5 m. 60 kr per m²', -((8 + 6) * 5 / 2) * 60, '35 m² · 60 = 2 100 kr'),
     OQ('Hjelp naboen', 'Du får 1 500 kr', 1500, '+ 1 500 kr'),
     OQ('Kaffepause', 'Ingenting skjer', 0, '0 kr'),
     OQ('Tapet', 'Vegg 3 m × 2,5 m. Én rull dekker 5 m² og koster 300 kr', -2 * 300, '7,5 m² → 2 ruller · 300 = 600 kr'),
     OQ('Terrasse', 'Kvadrat med side 4 m. 350 kr per m²', -16 * 350, '16 m² · 350 = 5 600 kr'),
     OQ('Kantlist', 'Terrasse 4 m × 4 m, list rundt. 25 kr per m', -16 * 25, '16 m · 25 = 400 kr'),
     OQ('Teppe', 'Parallellogram: grunnlinje 3 m, høyde 2 m. 150 kr per m²', -A(3, 2) * 150, '6 m² · 150 = 900 kr'),
     OQ('Returvarer', 'Lever tilbake fliser: 600 kr', 600, '+ 600 kr'),
     OQ('Uflaks', 'Vannlekkasje: 2 000 kr', -2000, '2 000 kr'),
     OQ('Dør', 'Dør 0,9 m × 2 m. Maling begge sider, 30 kr per m²', -(0.9 * 2 * 2) * 30, '3,6 m² · 30 = 108 kr'),
     OQ('Gulvvarme', 'Bad 2,5 m × 2 m. 500 kr per m²', -A(2.5, 2) * 500, '5 m² · 500 = 2 500 kr'),
     OQ('Bruktsalg', 'Selg sykkel: 1 200 kr', 1200, '+ 1 200 kr'),
     OQ('Hylle', 'Hyller 4 stk à 1,2 m. Planker 80 kr per m', -(4 * 1.2) * 80, '4,8 m · 80 = 384 kr'),
     OQ('Kantstein', 'Bed 3 m × 2 m, stein rundt. 70 kr per m', -(2 * (3 + 2)) * 70, '10 m · 70 = 700 kr'),
    ]
    L2 = [
     OQ('START', 'Lønn: Du får 8 000 kr', 8000, '+ 8 000 kr'),
     OQ('Rundt teppe', 'Radius 1 m. 200 kr per m²', -round(PI * 1 * 1 * 200, 2), '3,14 m² · 200 = 628 kr'),
     OQ('Sandkasse', '2 m × 1,5 m × 0,2 m. Sand 500 kr per m³', -round(2 * 1.5 * 0.2 * 500, 2), '0,6 m³ · 500 = 300 kr'),
     OQ('Betong', 'Trapp 1 m × 0,5 m × 2 m. 1 200 kr per m³', -1 * 0.5 * 2 * 1200, '1 m³ · 1 200 = 1 200 kr'),
     OQ('Stige', 'Mot en vegg: 4 m opp, foten 3 m ut. 120 kr per meter stige', -5 * 120, '√(3² + 4²) = 5 m · 120 = 600 kr'),
     OQ('Bruktsalg', 'Selg gammelt kjøkken: 3 000 kr', 3000, '+ 3 000 kr'),
     OQ('Basseng', 'Sylinder: r = 1 m, h = 0,5 m. Vann 20 kr per m³', -round(PI * 1 * 0.5 * 20, 2), '1,57 m³ · 20 = 31,40 kr'),
     OQ('Rund benk', 'Rundt et tre, diameter 2 m. 300 kr per meter omkrets', -round(PI * 2 * 300, 2), '6,28 m · 300 = 1 884 kr'),
     OQ('Isolasjon', 'Vegg 5 m × 2,4 m, 0,1 m tykk. 450 kr per m³', -round(5 * 2.4 * 0.1 * 450, 2), '1,2 m³ · 450 = 540 kr'),
     OQ('Takstein', 'Taket er 5 m på skrå og 3 m høyt. Finn bredden. 200 kr per m', -4 * 200, '√(5² − 3²) = 4 m · 200 = 800 kr'),
     OQ('Kumme', 'Kube med side 0,5 m, fylles med jord. 800 kr per m³', -round(0.125 * 800, 2), '0,125 m³ · 800 = 100 kr'),
     OQ('Hjelp naboen', 'Du får 2 000 kr', 2000, '+ 2 000 kr'),
     OQ('Kaffepause', 'Ingenting skjer', 0, '0 kr'),
     OQ('Rør', 'Sylinder: r = 0,1 m, 10 m lang. Isolasjon 2 000 kr per m³', -round(PI * 0.01 * 10 * 2000, 2), '0,314 m³ · 2 000 = 628 kr'),
     OQ('Pergola', 'Diagonal stiver i et rektangel 1,2 m × 1,6 m. 4 stivere, 50 kr per m', -4 * 2 * 50, '√(1,2² + 1,6²) = 2 m · 4 · 50 = 400 kr'),
     OQ('Fundament', 'Prisme 3 m × 2 m × 0,3 m betong. 1 200 kr per m³', -round(3 * 2 * 0.3 * 1200, 2), '1,8 m³ · 1 200 = 2 160 kr'),
     OQ('Bed', 'Halvsirkel med radius 2 m. Jord 100 kr per m². π = 3,14', -round(PI * 4 / 2 * 100, 2), '6,28 m² · 100 = 628 kr'),
     OQ('Returvarer', 'Lever tilbake fliser: 900 kr', 900, '+ 900 kr'),
     OQ('Uflaks', 'Vannlekkasje: 3 000 kr', -3000, '3 000 kr'),
     OQ('Akvarium', '80 cm × 40 cm × 50 cm. Vannbehandling 2 kr per liter', -160 * 2, '160 L · 2 = 320 kr'),
     OQ('Rampe', 'Rampe 4 m, 0,3 m høy. Bakkelengde (hele m)? 100 kr per m', -4 * 100, '√(4² − 0,3²) ≈ 3,99 → 4 m · 100 = 400 kr'),
     OQ('Bruktsalg', 'Selg peis: 2 500 kr', 2500, '+ 2 500 kr'),
     OQ('Vanntank', 'Sylinder: r = 0,5 m, h = 2 m. 1 000 kr per m³', -round(PI * 0.25 * 2 * 1000, 2), '1,57 m³ · 1 000 = 1 570 kr'),
     OQ('Gulvlist', 'L-formet rom, sidene 6, 4, 2, 2, 4 og 2 m. 40 kr per m', -(6 + 4 + 2 + 2 + 4 + 2) * 40, '20 m · 40 = 800 kr'),
    ]
    assert abs(math.sqrt(16 - 0.09) - 3.99) < 0.01 and math.isclose(math.hypot(1.2, 1.6), 2.0) and 80 * 40 * 50 / 1000 == 160
    for L in (L1, L2): assert len(L) == 24
    pages = []
    for lv, L in ((1, L1), (2, L2)):
        P = perim(); cells = ''
        for q, (r, c) in zip(L, P):
            corner = (r, c) in ((0, 0), (0, 6), (6, 0), (6, 6))
            cls = 'ms ' + ('corner' if corner or q['typ'] == 'corner' else q['typ'])
            sign = {'plus': 'Inn', 'minus': 'Ut', 'corner': ''}[q['typ']]
            cells += f'<div class="{cls}" style="grid-row:{r+1};grid-column:{c+1}"><b>{q["t"]}</b>{q["txt"]}<span class="amt">{sign}</span></div>'
        mid = f'<div class="mid"><div class="logo">Oppussingen</div><p class="start">Startkapital: 10 000 kr</p><p>Gå med klokka. Regn ut hva oppussingen koster, og trekk det fra.{" Bruk π = 3,14." if lv == 2 else ""}</p><p style="font-size:8.5pt;color:#56617A">Grønn kant: penger inn · Rød kant: penger ut</p></div>'
        steps = ['Alle starter på START med 10 000 kr. Skriv det øverst i regnskapet ditt.',
                 'Kast terningen og flytt. Regn ut areal, omkrets eller volum i ruta, og finn prisen.',
                 'Skriv utregningen og ny saldo. Motspilleren sjekker med fasiten.',
                 'Passerer eller lander du på START, får du lønn. Går saldoen under 0, skriver du minus og fortsetter.']
        ex = {1: dict(d=[2], txt='Du lander på <b>Gulvlist</b>: Omkretsen er 4 + 3 + 4 + 3 = 14 m. 14 · 45 = 630 kr. 10 000 − 630 = <b>9 370 kr</b>.'),
              2: dict(d=[1], txt='Du lander på <b>Rundt teppe</b>: Arealet er 3,14 · 1² = 3,14 m². 3,14 · 200 = 628 kr. 10 000 − 628 = <b>9 372 kr</b>.')}[lv]
        pages.append(pg(g, f'<div class="mono">{cells}{mid}</div>', side(g, lv, ['2–4 spillere', '1 terning', 'regnskap og kalkulator'], steps, ex, win=('Mest penger etter tre runder vinner!', 'Spillet er slutt når første spiller har gått tre runder.')), 'free'))
    head = '<tr><th>#</th><th>Rute</th><th>Utregning</th><th>Pris</th><th>Saldo</th></tr>'
    rows = '<tr><td>0</td><td>Start</td><td></td><td></td><td><b>10 000 kr</b></td></tr>' + ''.join(f'<tr><td>{i}</td><td></td><td></td><td></td><td></td></tr>' for i in range(1, 24))
    pages.append(full(g, '<h2>Regnskap · Oppussingen</h2><p class="lead">Én tabell per spiller. Skriv utregningen, prisen og den nye saldoen.</p><div class="cols">' +
        ''.join(f'<div><p style="margin:0 0 1.5mm;font-weight:700">Navn: ____________________</p><table class="log">{head}{rows}</table></div>' for _ in (1, 2)) + '</div>'))
    fas = '<h2>Fasit · Oppussingen</h2><p class="lead">Hva hver rute koster eller gir.</p><div class="fasit">'
    for lv, L in ((1, L1), (2, L2)):
        fas += f'<div class="blk"><h3>Nivå {lv}</h3>' + ''.join(f'<p><b>{q["t"]}:</b> {q["fas"]}{"" if q["v"]>=0 else ""} → <b>{kr2(q["v"])}</b></p>' for q in L) + '</div>'
    pages.append(full(g, fas + '</div>'))
    g['thumbs'] = g['lv'] + ['Regnskap til to spillere', 'Fasit til begge brettene']
    return g, pages

meta3 = []
for make in (B_minus, B_brok, B_alg, B_pyt, B_sanns2, B_likn, B_null, B_brokspill, B_algspill, B_brokloep, B_brokkrig, B_proskrig, B_oppuss):
    g, pages = make()
    html = f'<!doctype html><html lang="nb"><meta charset="utf-8"><style>{CSS3}</style>' + ''.join(pages) + '</html>'
    open(os.path.join(OUT, g['id'] + '.html'), 'w').write(html)
    meta3.append({k: g[k] for k in ('id', 'title', 'sub', 'grade', 'ch', 'chname', 'topic', 'link', 'short', 'lv', 'a', 'a2', 'typ', 'thumbs')})
    print(g['id'], len(pages), 'sider')
json.dump(meta3, open(os.path.join(OUT, 'spill3.json'), 'w'), ensure_ascii=False, indent=1)
