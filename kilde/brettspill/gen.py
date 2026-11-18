# Lager brettspill (A4 liggende, 6 x 6, fire på rad) som HTML. Kjør: python3 gen.py  -> out/<id>.html + spill.json
import itertools, random, math, json, os
from fractions import Fraction as Fr
from collections import Counter

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
os.makedirs(OUT, exist_ok=True)
D6 = range(1, 7)

def nf(v):
    """Norsk tallformat: komma som desimaltegn, minus som −."""
    if isinstance(v, Fr):
        v = float(v)
    if isinstance(v, float):
        if abs(v - round(v)) < 1e-9:
            v = int(round(v))
        else:
            s = ('%.2f' % v).rstrip('0').rstrip('.')
            return s.replace('-', '−').replace('.', ',')
    s = str(v)
    if len(s.lstrip('-')) > 4:
        neg = s.startswith('-'); t = s.lstrip('-'); g = ''
        while len(t) > 3:
            g = ' ' + t[-3:] + g; t = t[:-3]
        s = ('-' if neg else '') + t + g
    return s.replace('-', '−')

# ---------- svg-hjelpere ----------
def die(n, s=34, col='#141E36'):
    P = {1: [(2, 2)], 2: [(1, 1), (3, 3)], 3: [(1, 1), (2, 2), (3, 3)], 4: [(1, 1), (3, 1), (1, 3), (3, 3)],
         5: [(1, 1), (3, 1), (2, 2), (1, 3), (3, 3)], 6: [(1, 1), (3, 1), (1, 2), (3, 2), (1, 3), (3, 3)]}[n]
    dots = ''.join(f'<circle cx="{x*10}" cy="{y*10}" r="3.6" fill="{col}"/>' for x, y in P)
    return f'<svg class="die" width="{s}" height="{s}" viewBox="0 0 40 40"><rect x="2" y="2" width="36" height="36" rx="8" fill="#fff" stroke="{col}" stroke-width="2.6"/>{dots}</svg>'

def shape(kind, w=30):
    st = 'fill="var(--a2)" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"'
    if kind == 'R': p = f'<rect x="3" y="7" width="34" height="22" rx="1" {st}/>'
    elif kind == 'T': p = f'<path d="M3 30H37L14 6Z" {st}/><path d="M14 6V30" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="2.5 2"/>'
    elif kind == 'P': p = f'<path d="M3 30H29L37 7H11Z" {st}/><path d="M11 7V30" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="2.5 2"/>'
    elif kind == 'Tr': p = f'<path d="M3 30H37L28 7H12Z" {st}/><path d="M12 7V30" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="2.5 2"/>'
    elif kind == 'O': p = f'<rect x="3" y="7" width="34" height="22" rx="1" fill="none" stroke="var(--ink)" stroke-width="3"/>'
    elif kind == 'B': p = f'<path d="M4 13 12 6H37V25L29 32H4Z" {st}/><path d="M4 13H29V32M29 13 37 6" fill="none" stroke="var(--ink)" stroke-width="2.2" stroke-linejoin="round"/>'
    elif kind == 'Py': p = f'<path d="M4 31 20 4 36 31Z" {st}/><path d="M20 4 26 25 36 31M26 25 4 31" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"/>'
    elif kind == 'TP': p = f'<path d="M4 31H26L15 13Z" {st}/><path d="M15 13 25 4 36 22 26 31M36 22H31" fill="none" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/>'
    return f'<svg class="shp" width="{w}" height="{w*0.9:.0f}" viewBox="0 0 40 36">{p}</svg>'

def plane(x0, x1, y0, y1, items, size=82):
    """Lite koordinatsystem. items: ('pt',x,y) eller ('line',a,b)."""
    W = x1 - x0; H = y1 - y0; u = min(size * 1.1 / W, size / H); pw, ph = W * u, H * u
    m = 6; ml = 12 if x0 >= 0 else 6
    X = lambda x: (x - x0) * u + ml; Y = lambda y: (y1 - y) * u + m
    g = ''.join(f'<path d="M{X(x):.1f} {Y(y0):.1f}V{Y(y1):.1f}" stroke="#C9D3E3" stroke-width=".7"/>' for x in range(x0, x1 + 1))
    g += ''.join(f'<path d="M{X(x0):.1f} {Y(y):.1f}H{X(x1):.1f}" stroke="#C9D3E3" stroke-width=".7"/>' for y in range(y0, y1 + 1))
    g += f'<path d="M{X(x0):.1f} {Y(0):.1f}H{X(x1):.1f}M{X(0):.1f} {Y(y0):.1f}V{Y(y1):.1f}" stroke="#141E36" stroke-width="1.3"/>'
    lab = ''
    step = 1 if W <= 7 else 2
    for x in range(x0, x1 + 1):
        if x and x % step == 0:
            lab += f'<text x="{X(x):.1f}" y="{Y(0)+7.2:.1f}" font-size="6.2" text-anchor="middle">{nf(x)}</text>'
    for y in range(y0, y1 + 1):
        if y and y % 2 == 0:
            lab += f'<text x="{X(0)-2:.1f}" y="{Y(y)+2.2:.1f}" font-size="6.2" text-anchor="end">{nf(y)}</text>'
    it = ''
    for t in items:
        if t[0] == 'pt':
            it += f'<circle cx="{X(t[1]):.1f}" cy="{Y(t[2]):.1f}" r="3.6" fill="var(--a)" stroke="#141E36" stroke-width="1.2"/>'
        else:
            a, b = t[1], t[2]
            pts = []
            for x in (x0, x1):
                y = a * x + b
                if y0 <= y <= y1: pts.append((x, y))
            if a:
                for y in (y0, y1):
                    x = (y - b) / a
                    if x0 <= x <= x1: pts.append((x, y))
            pts = sorted(set((round(px, 4), round(py, 4)) for px, py in pts))
            if len(pts) >= 2:
                (ax, ay), (bx, by) = pts[0], pts[-1]
                it += f'<path d="M{X(ax):.1f} {Y(ay):.1f}L{X(bx):.1f} {Y(by):.1f}" stroke="var(--a)" stroke-width="2.6" stroke-linecap="round"/>'
    return f'<svg class="pl" width="{pw+m+ml:.0f}" height="{ph+2*m:.0f}" viewBox="0 0 {pw+m+ml:.1f} {ph+2*m:.1f}" font-family="Inter" fill="#141E36">{g}{lab}{it}</svg>'

# ---------- fylling av brettet ----------
def weights(nd, outcomes):
    w = Counter(); rolls = list(itertools.product(D6, repeat=nd))
    for r in rolls:
        for k in set(outcomes(r)): w[k] += 1
    return w, rolls

def fill(nd, outcomes, seed, cap=3, fixed=None):
    rnd = random.Random(seed)
    w, rolls = weights(nd, outcomes)
    if fixed is not None:
        cells = list(fixed)
    else:
        keys = sorted(w, key=str)
        if len(keys) > 36:
            # velg 36 ulike, vektet mot de som oftere er mulige, men behold variasjon
            pool = keys[:]; chosen = []; cov = set()
            outs = {r: set(outcomes(r)) for r in rolls}
            while len(chosen) < 36:
                gain = {k: sum(1 for r in rolls if r not in cov and k in outs[r]) for k in pool}
                if max(gain.values()) > 0 and len(chosen) < 30:
                    k = max(pool, key=lambda k: (gain[k], rnd.random()))
                else:
                    ws = [math.sqrt(w[k]) for k in pool]; k = rnd.choices(pool, ws)[0]
                chosen.append(k); pool.remove(k); cov |= {r for r in rolls if k in outs[r]}
            cells = chosen
        else:
            cnt = {k: 1 for k in keys}
            while sum(cnt.values()) < 36:
                k = max((k for k in keys if cnt[k] < cap), key=lambda k: (w[k] / (cnt[k] + 1), rnd.random()), default=None)
                if k is None: cap += 1; continue
                cnt[k] += 1
            cells = [k for k in keys for _ in range(cnt[k])]
    for k in cells:
        assert w[k] > 0, ('uoppnåelig rute', k)
    # plasser slik at like ruter ikke er naboer
    best = None
    for _ in range(4000):
        rnd.shuffle(cells)
        bad = 0
        for i in range(36):
            r, c = divmod(i, 6)
            for dr, dc in ((0, 1), (1, -1), (1, 0), (1, 1)):
                rr, cc = r + dr, c + dc
                if 0 <= rr < 6 and 0 <= cc < 6 and cells[rr * 6 + cc] == cells[i]: bad += 1
        if best is None or bad < best[0]: best = (bad, cells[:])
        if bad == 0: break
    cells = best[1]
    on = set(cells)
    cover = sum(1 for r in rolls if set(outcomes(r)) & on) / len(rolls)
    return cells, cover

# ---------- spillene ----------
GAMES = []
def game(**g): GAMES.append(g); return g

def frac_html(n, d):
    return f'<span class="fr"><span>{nf(n)}</span><span>{nf(d)}</span></span>'

# ===== 8. trinn: Likningsjakten =====
def eq_l1(x, rnd):
    a = rnd.randint(2, 9); t = rnd.randrange(6)
    if t == 0: return f'x + {a} = {x+a}'
    if t == 1: return f'{a} + x = {x+a}'
    if t == 2: return f'x − {min(a,x) if x>1 else 1} = {x-(min(a,x) if x>1 else 1)}'
    if t == 3: b = rnd.randint(2, 6); return f'{b}x = {b*x}'
    if t == 4: c = x + a; return f'{c} − x = {a}'
    b = rnd.randint(2, 5); return f'x · {b} = {b*x}'
def eq_l2(x, rnd):
    a = rnd.randint(2, 6); b = rnd.randint(1, 9); t = rnd.randrange(4)
    if t == 0: return f'{a}x + {b} = {a*x+b}'
    if t == 1: return f'{a}x − {b} = {a*x-b}'.replace('= -', '= −')
    if t == 2: return f'{b} + {a}x = {a*x+b}'
    c = a * x + b; return f'{c} − {a}x = {b}'
def eq_l3(x, rnd):
    t = rnd.randrange(4)
    if t == 0:
        a = rnd.randint(3, 6); c = rnd.randint(1, a - 1); b = rnd.randint(1, 9); d = (a - c) * x + b
        return f'{a}x + {b} = {c if c>1 else ""}x + {d}'
    if t == 1:
        a = rnd.randint(2, 5); b = rnd.randint(1, 5); return f'{a}(x + {b}) = {a*(x+b)}'
    if t == 2:
        a = rnd.randint(2, 4); b = rnd.randint(1, x) if x > 1 else 1
        if b >= x: b = max(1, x - 1) if x > 1 else 1
        v = a * (x - b); return f'{a}(x − {b}) = {nf(v)}'
    a = rnd.randint(3, 6); c = rnd.randint(1, a - 1); b = rnd.randint(1, 8); d = (a - c) * x - b
    rhs = f'{c if c>1 else ""}x + {d}' if d > 0 else (f'{c if c>1 else ""}x − {-d}' if d < 0 else f'{c if c>1 else ""}x')
    return f'{a}x − {b} = {rhs}'
def solve_ok(eq, x):
    l, r = eq.replace('−', '-').replace('·', '*').split('=')
    f = lambda s: eval(s.replace('(', '*(').replace('x', '*X').replace(' ', '').lstrip('*').replace('+*', '+').replace('-*', '-').replace('(*', '(').replace('**', '*'), {'X': x})
    return abs(f(l) - f(r)) < 1e-9
def lik_board(gen, seed):
    rnd = random.Random(seed); cells = []
    for x in D6:
        s = set()
        while len(s) < 6:
            e = gen(x, rnd)
            assert solve_ok(e, x), (e, x)
            assert sum(solve_ok(e, y) for y in range(-20, 40)) == 1, e
            s.add(e)
        cells += sorted(s)
    sol = {e: x for x in D6 for e in cells[(x-1)*6:x*6]}
    return cells, (lambda r: [e for e in cells if sol[e] == r[0]])

def B_lik():
    boards = []
    for lv, gen, ex in ((1, eq_l1, ('x + 3 = 7', '4 + 3 = 7')), (2, eq_l2, ('3x − 2 = 10', '3 · 4 − 2 = 10')), (3, eq_l3, ('5x + 1 = 2x + 13', '5 · 4 + 1 = 21 og 2 · 4 + 13 = 21'))):
        cells, out = lik_board(gen, 100 + lv)
        cells, cover = fill(1, out, 200 + lv, fixed=cells)
        boards.append(dict(level=lv, cells=[('t', c) for c in cells], cover=cover,
            dice=1, steps=['Kast én terning. Tallet du får, er <b>x</b>.',
                'Finn en <b>ledig</b> likning som har x som løsning.',
                'Sett inn tallet og vis at begge sidene blir like. Merk ruta. Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.',
                'Ingen ledig likning? Da er det neste spiller sin tur.'],
            ex=dict(d=[4], txt=f'Du kaster 4, så x = 4. <b>{ex[0]}</b> passer, fordi {ex[1]}.')))
    return boards
game(id='likningsjakten', title='Likningsjakten', sub='Fire på rad med likninger', grade=8, ch='kap3', chname='Algebra',
     topic='likninger', link='#kap3-likninger', a='#2E9E6A', a2='#E3F4EB', dice_n='1 terning', make=B_lik,
     short='Kast terningen og finn en likning som har tallet som løsning. Først til fire på rad.',
     lv=['Nivå 1: x + a = b, ax = b', 'Nivå 2: ax + b = c', 'Nivå 3: x på begge sider og parenteser'])

# ===== 8. trinn: Punktjakten =====
def B_punkt():
    boards = []
    specs = [(1, [('y = x + 2', lambda x: x + 2), ('y = 2x', lambda x: 2 * x), ('y = 9 − x', lambda x: 9 - x)], 'txt'),
             (2, [('y = x − 2', lambda x: x - 2), ('y = 4 − x', lambda x: 4 - x), ('y = 2x − 5', lambda x: 2 * x - 5)], 'graf'),
             (3, [('y = x²', lambda x: x * x), ('y = 3x − 8', lambda x: 3 * x - 8), ('y = 10 − 2x', lambda x: 10 - 2 * x)], 'txt')]
    for lv, fs, kind in specs:
        def out(r, fs=fs, kind=kind):
            x = r[0]; return [(x, f(x)) for _, f in fs if kind != 'graf' or -3 <= f(x) <= 5]
        cells, cover = fill(1, out, 300 + lv, cap=3)
        if kind == 'graf': cl = [('g', plane(0, 6, -3, 5, [('pt', x, y)], 76)) for x, y in cells]
        else: cl = [('n', f'({nf(x)}, {nf(y)})') for x, y in cells]
        x = 3; f0 = fs[1]
        boards.append(dict(level=lv, cells=cl, cover=cover, dice=1,
            steps=['Kast én terning. Tallet du får, er <b>x</b>.',
                   'Velg én av de tre funksjonene i boksen under, og regn ut <b>y</b>.',
                   ('Finn punktet (x, y) i en <b>ledig</b> rute og merk den.' if kind != 'graf' else 'Finn en <b>ledig</b> rute der punktet (x, y) er tegnet, og merk den.') + ' Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.',
                   'Ingen ledig rute? Da er det neste spiller sin tur.'],
            box='<div class="fns">' + ''.join(f'<span>{n}</span>' for n, _ in fs) + '</div>',
            ex=dict(d=[x], txt=f'Du kaster 3 og velger <b>{f0[0]}</b>. Da er y = {nf(f0[1](3))}, og punktet er <b>(3, {nf(f0[1](3))})</b>.')))
    return boards
game(id='punktjakten', title='Punktjakten', sub='Fire på rad i koordinatsystemet', grade=8, ch='kap4', chname='Funksjoner',
     topic='funksjonsuttrykk', link='#kap4-funksjonsuttrykk', a='#3B6FD8', a2='#E4ECFB', dice_n='1 terning', make=B_punkt,
     short='Kast terningen, velg en funksjon og finn punktet på brettet. Først til fire på rad.',
     lv=['Nivå 1: lineære funksjoner, punkter som tall', 'Nivå 2: punktene er tegnet i koordinatsystem', 'Nivå 3: med andregradsfunksjon og negative verdier'])

# ===== 9. trinn: Statistikkjakten =====
def med(v):
    s = sorted(v); n = len(s); return Fr(s[n // 2]) if n % 2 else Fr(s[n // 2 - 1] + s[n // 2], 2)
def B_stat():
    boards = []
    def o1(r): return [('median', med(r)), ('variasjonsbredde', max(r) - min(r))]
    def o2(r):
        o = [('median', med(r)), ('variasjonsbredde', max(r) - min(r))]
        if sum(r) % 3 == 0: o.append(('gjennomsnitt', Fr(sum(r), 3)))
        c = Counter(r); m = max(c.values())
        if m > 1: o.append(('typetall', [k for k in c if c[k] == m][0]))
        return o
    def o3(r): return [('median', med(r)), ('gjennomsnitt', Fr(sum(r), 4)), ('variasjonsbredde', max(r) - min(r))]
    for lv, nd, out, ex in ((1, 3, o1, (2, 5, 3)), (2, 3, o2, (2, 5, 5)), (3, 4, o3, (2, 5, 3, 6))):
        cells, cover = fill(nd, out, 400 + lv, cap=3)
        cl = [('lab', (k, nf(v))) for k, v in cells]
        if lv == 1: txt = f'Du kaster 2, 5 og 3. Medianen er <b>3</b>, og variasjonsbredden er 5 − 2 = <b>3</b>.'
        elif lv == 2: txt = f'Du kaster 2, 5 og 5. Medianen er <b>5</b>, typetallet er <b>5</b>, gjennomsnittet er 12 : 3 = <b>4</b> og variasjonsbredden er <b>3</b>.'
        else: txt = f'Du kaster 2, 5, 3 og 6. Medianen er (3 + 5) : 2 = <b>4</b>, gjennomsnittet er 16 : 4 = <b>4</b> og variasjonsbredden er <b>4</b>.'
        boards.append(dict(level=lv, cells=cl, cover=cover, dice=nd,
            steps=[f'Kast {"alle tre" if nd==3 else "alle fire"} terningene. Tallene er et lite datasett.',
                   'Regn ut ' + ('medianen og variasjonsbredden.' if lv == 1 else 'medianen, gjennomsnittet, typetallet og variasjonsbredden. Noen av dem finnes ikke alltid.' if lv == 2 else 'medianen, gjennomsnittet og variasjonsbredden.'),
                   'Velg <b>én</b> ledig rute som passer, og merk den. Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.',
                   'Ingen ledig rute? Da er det neste spiller sin tur.'],
            ex=dict(d=list(ex), txt=txt)))
    return boards
game(id='statistikkjakten', title='Statistikkjakten', sub='Fire på rad med sentralmål', grade=9, ch='9k1', chname='Statistikk',
     topic='sentralmal', link='#9k1-sentralmal', a='#E07B39', a2='#FCEBDD', dice_n='3–4 terninger', make=B_stat,
     short='Kast terningene og regn ut median, gjennomsnitt, typetall eller variasjonsbredde. Først til fire på rad.',
     lv=['Nivå 1: median og variasjonsbredde (3 terninger)', 'Nivå 2: alle fire mål (3 terninger)', 'Nivå 3: fire terninger, desimaltall'])

# ===== 9. trinn: Arealjakten =====
def B_areal():
    boards = []
    def o1(r):
        a, b = r; return [('R', a * b), ('T', Fr(a * b, 2))]
    def o2(r):
        a, b = r; return [('R', a * b), ('O', 2 * (a + b))]
    def o3(r):
        o = []
        for p in itertools.permutations(r):
            a, b, h = p; o.append(('Tr', Fr((a + b) * h, 2))); o.append(('P', a * b))
        return o
    NAME = {'R': 'Rektangel', 'T': 'Trekant', 'O': 'Rektangel', 'P': 'Parallellogram', 'Tr': 'Trapes'}
    for lv, nd, out in ((1, 2, o1), (2, 2, o2), (3, 3, o3)):
        cells, cover = fill(nd, out, 500 + lv, cap=2)
        cl = [('shape', (k, ('O = ' if k == 'O' else 'A = ') + nf(v) + (' cm' if k == 'O' else ' cm²'))) for k, v in cells]
        steps = {1: ['Kast to terninger. Tallene er grunnlinja og høyden i centimeter.',
                     'Regn ut arealet av et <b>rektangel</b> eller en <b>trekant</b> med disse målene.',
                     'Finn en ledig rute med riktig figur og riktig areal. Merk den. Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.',
                     'Ingen ledig rute? Da er det neste spiller sin tur.'],
                 2: ['Kast to terninger. Tallene er lengden og bredden til et rektangel i centimeter.',
                     'Regn ut <b>arealet</b> (A) eller <b>omkretsen</b> (O).',
                     'Finn en ledig rute med det svaret, og merk den. Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.',
                     'Ingen ledig rute? Da er det neste spiller sin tur.'],
                 3: ['Kast tre terninger. Tallene er lengder i centimeter.',
                     'Lag et <b>trapes</b> (to tall er de parallelle sidene, ett er høyden) eller et <b>parallellogram</b> (to av tallene). Regn ut arealet.',
                     'Finn en ledig rute med riktig figur og areal. Merk den. Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.',
                     'Ingen ledig rute? Da er det neste spiller sin tur.']}[lv]
        ex = {1: ([3, 5], 'Du kaster 3 og 5. Rektangel: 3 · 5 = <b>15 cm²</b>. Trekant: 3 · 5 : 2 = <b>7,5 cm²</b>.'),
              2: ([3, 5], 'Du kaster 3 og 5. Arealet er 3 · 5 = <b>15 cm²</b>. Omkretsen er 3 + 5 + 3 + 5 = <b>16 cm</b>.'),
              3: ([2, 4, 5], 'Du kaster 2, 4 og 5. Trapes: (2 + 4) · 5 : 2 = <b>15 cm²</b>. Parallellogram: 4 · 5 = <b>20 cm²</b>.')}[lv]
        boards.append(dict(level=lv, cells=cl, cover=cover, dice=nd, steps=steps, ex=dict(d=ex[0], txt=ex[1]),
            box='<div class="legend">' + ''.join(f'<span>{shape(k, 26)}{NAME[k]}{" (omkrets)" if k=="O" else ""}</span>' for k in dict.fromkeys(k for k, _ in cells)) + '</div>'))
    return boards
game(id='arealjakten', title='Arealjakten', sub='Fire på rad med areal og omkrets', grade=9, ch='9k2', chname='Geometri',
     topic='rektangel', link='#9k2-rektangel', a='#8257D8', a2='#EEE7FB', dice_n='2–3 terninger', make=B_areal,
     short='Terningene gir målene. Regn ut areal eller omkrets av figuren, og finn svaret på brettet.',
     lv=['Nivå 1: rektangel og trekant', 'Nivå 2: areal og omkrets av rektangel', 'Nivå 3: trapes og parallellogram (3 terninger)'])

# ===== 9. trinn: Volumjakten =====
def B_vol():
    boards = []
    def o1(r):
        a, b, c = r; return [('B', a * b * c)]
    def o2(r):
        a, b, c = r; return [('B', 2 * (a * b + a * c + b * c))]
    def o3(r):
        o = []
        for a, b, h in itertools.permutations(r):
            v = Fr(a * b * h, 3)
            if v.denominator == 1: o.append(('Py', v))
            o.append(('TP', Fr(a * b, 2) * h))
        return o
    for lv, out in ((1, o1), (2, o2), (3, o3)):
        cells, cover = fill(3, out, 600 + lv, cap=2)
        unit = ' cm²' if lv == 2 else ' cm³'
        cl = [('shape', (k, ('O = ' if lv == 2 else 'V = ') + nf(v) + unit)) for k, v in cells]
        steps = {1: ['Kast tre terninger. Tallene er lengden, bredden og høyden til et rett prisme (en eske) i centimeter.',
                     'Regn ut <b>volumet</b>.'],
                 2: ['Kast tre terninger. Tallene er lengden, bredden og høyden til et rett prisme (en eske) i centimeter.',
                     'Regn ut <b>overflaten</b>: arealet av alle de seks sideflatene til sammen.'],
                 3: ['Kast tre terninger. Tallene er mål i centimeter.',
                     'Regn ut volumet av en <b>pyramide</b> med rektangulær grunnflate, eller av et <b>trekantprisme</b> med rettvinklet trekant som grunnflate. Du velger hvilket tall som er høyden.']}[lv]
        steps += ['Finn en ledig rute med svaret, og merk den. Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.', 'Ingen ledig rute? Kast én terning på nytt. Passer det fortsatt ikke, er det neste spiller sin tur.']
        ex = {1: ([2, 3, 5], 'Du kaster 2, 3 og 5. Volumet er 2 · 3 · 5 = <b>30 cm³</b>.'),
              2: ([2, 3, 5], 'Du kaster 2, 3 og 5. Overflaten er 2 · (2 · 3 + 2 · 5 + 3 · 5) = 2 · 31 = <b>62 cm²</b>.'),
              3: ([2, 3, 5], 'Du kaster 2, 3 og 5. Pyramide: 2 · 5 · 3 : 3 = <b>10 cm³</b>. Trekantprisme: (2 · 3 : 2) · 5 = <b>15 cm³</b>.')}[lv]
        b = dict(level=lv, cells=cl, cover=cover, dice=3, steps=steps, ex=dict(d=ex[0], txt=ex[1]))
        if lv == 3: b['box'] = '<div class="legend">' + f'<span>{shape("Py", 26)}Pyramide</span><span>{shape("TP", 26)}Trekantprisme</span></div>'
        boards.append(b)
    return boards
game(id='volumjakten', title='Volumjakten', sub='Fire på rad med volum og overflate', grade=9, ch='9k3', chname='Volum og overflate',
     topic='prisme-volum', link='#9k3-prisme-volum', a='#1F9AA6', a2='#DFF3F4', dice_n='3 terninger', make=B_vol,
     short='Tre terninger gir målene. Regn ut volum eller overflate, og finn svaret på brettet.',
     lv=['Nivå 1: volum av rett prisme', 'Nivå 2: overflate av rett prisme', 'Nivå 3: pyramide og trekantprisme'])

# ===== 9. trinn: Sannsynlighetsjakten =====
def B_sanns():
    boards = []
    E1 = [('Summen er 2', lambda a, b: a + b == 2), ('Summen er 3', lambda a, b: a + b == 3), ('Summen er 4', lambda a, b: a + b == 4),
          ('Summen er 5', lambda a, b: a + b == 5), ('Summen er 6', lambda a, b: a + b == 6), ('Summen er 7', lambda a, b: a + b == 7),
          ('Summen er 8', lambda a, b: a + b == 8), ('Summen er 9', lambda a, b: a + b == 9), ('Summen er 10', lambda a, b: a + b == 10),
          ('Summen er 11', lambda a, b: a + b == 11), ('Summen er 12', lambda a, b: a + b == 12), ('To like', lambda a, b: a == b),
          ('Minst én 6-er', lambda a, b: 6 in (a, b)), ('Minst én 1-er', lambda a, b: 1 in (a, b)), ('Summen er et partall', lambda a, b: (a + b) % 2 == 0),
          ('Summen er over 9', lambda a, b: a + b > 9), ('Summen er under 5', lambda a, b: a + b < 5), ('Produktet er over 20', lambda a, b: a * b > 20),
          ('Produktet er 12', lambda a, b: a * b == 12), ('Forskjellen er 1', lambda a, b: abs(a - b) == 1), ('Forskjellen er 3', lambda a, b: abs(a - b) == 3),
          ('Begge er oddetall', lambda a, b: a % 2 and b % 2), ('Begge er partall', lambda a, b: a % 2 == 0 and b % 2 == 0), ('Én 3-er og én 4-er', lambda a, b: {a, b} == {3, 4})]
    E3 = [('Summen er 5 eller 9', lambda a, b: a + b in (5, 9)), ('Ingen 6-ere', lambda a, b: 6 not in (a, b)), ('Ikke to like', lambda a, b: a != b),
          ('Begge under 4', lambda a, b: a < 4 and b < 4), ('Summen er partall og over 8', lambda a, b: (a + b) % 2 == 0 and a + b > 8),
          ('Minst én 5-er eller summen er 4', lambda a, b: 5 in (a, b) or a + b == 4), ('Én 1-er og én 6-er', lambda a, b: {a, b} == {1, 6}),
          ('Produktet er et oddetall', lambda a, b: (a * b) % 2 == 1), ('Summen er ikke 7', lambda a, b: a + b != 7),
          ('Begge over 4', lambda a, b: a > 4 and b > 4), ('To like eller summen er 7', lambda a, b: a == b or a + b == 7),
          ('Summen er 3, 4 eller 5', lambda a, b: a + b in (3, 4, 5)), ('Produktet er 6 eller 8', lambda a, b: a * b in (6, 8)),
          ('Forskjellen er 2 og summen er over 7', lambda a, b: abs(a - b) == 2 and a + b > 7), ('Ingen 1-ere og ingen 2-ere', lambda a, b: min(a, b) > 2),
          ('Én terning viser det dobbelte av den andre', lambda a, b: a == 2 * b or b == 2 * a), ('Summen er et primtall', lambda a, b: a + b in (2, 3, 5, 7, 11)),
          ('Produktet er et kvadrattall', lambda a, b: a * b in (1, 4, 9, 16, 25, 36)), ('Minst én 3-er og summen er under 7', lambda a, b: 3 in (a, b) and a + b < 7),
          ('Summen er 10, 11 eller 12', lambda a, b: a + b >= 10), ('Begge er partall eller begge er oddetall', lambda a, b: (a + b) % 2 == 0),
          ('Ikke noen 4-er', lambda a, b: 4 not in (a, b)), ('Forskjellen er 4 eller 5', lambda a, b: abs(a - b) >= 4), ('Summen er 6 og ingen 3-er', lambda a, b: a + b == 6 and 3 not in (a, b))]
    def oE(E): return lambda r: [n for n, f in E if f(*r)]
    c1, cov1 = fill(2, oE(E1), 701, cap=2)
    boards.append(dict(level=1, cells=[('t', c) for c in c1], cover=cov1, dice=2,
        steps=['Kast to terninger.', 'Se på rutene: hvilke hendelser skjedde med kastet ditt?',
               'Velg én ledig rute med en hendelse som skjedde, og merk den. Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.',
               'Ingen ledig rute passer? Da er det neste spiller sin tur. Tips: Noen hendelser skjer oftere enn andre.'],
        ex=dict(d=[3, 4], txt='Du kaster 3 og 4. <b>Summen er 7</b>, <b>Forskjellen er 1</b> og <b>Én 3-er og én 4-er</b> passer, og flere til.')))
    # nivå 2: sannsynligheten for summen, vist på ulike måter
    rnd = random.Random(702)
    P = {s: Fr(6 - abs(s - 7), 36) for s in range(2, 13)}
    def forms(p):
        n36 = p * 36; f = [frac_html(int(n36), 36), frac_html(p.numerator, p.denominator), nf(round(float(p) * 100, 1)) + ' %']
        return list(dict.fromkeys(f))
    def o2(r): return [P[sum(r)]]
    keys2, cov2 = fill(2, o2, 703, cap=7)
    cnt = Counter(); cl2 = []
    for p in keys2:
        fs = forms(p); cl2.append(('n', fs[cnt[p] % len(fs)])); cnt[p] += 1
    boards.append(dict(level=2, cells=cl2, cover=cov2, dice=2,
        steps=['Kast to terninger og finn summen.', 'Hva er sannsynligheten for å få akkurat den summen? Tabellen viser summen av alle 36 mulige kast.',
               'Finn en ledig rute med den sannsynligheten, som brøk, forkortet brøk eller prosent. Merk ruta: <b>ring</b> ○ eller <b>kryss</b> ✕.',
               'Ingen ledig rute? Da er det neste spiller sin tur.'],
        box='<table class="sumtab"><tr><th></th>' + ''.join(f'<th>{j}</th>' for j in D6) + '</tr>' + ''.join('<tr><th>' + str(i) + '</th>' + ''.join(f'<td>{i+j}</td>' for j in D6) + '</tr>' for i in D6) + '</table>',
        ex=dict(d=[2, 3], txt='Du kaster 2 og 3. Summen er 5. Fire av 36 kast gir sum 5, så P = 4/36 = <b>1/9</b> ≈ 11,1 %.')))
    c3, cov3 = fill(2, oE(E3), 704, cap=2)
    boards.append(dict(level=3, cells=[('t', c) for c in c3], cover=cov3, dice=2,
        steps=['Kast to terninger.', 'Les hendelsene nøye: <b>og</b> betyr at begge deler må stemme, <b>eller</b> betyr at minst én del må stemme, og <b>ikke</b> betyr det motsatte.',
               'Velg én ledig rute med en hendelse som skjedde, og merk den. Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.',
               'Ingen ledig rute passer? Da er det neste spiller sin tur.'],
        ex=dict(d=[5, 5], txt='Du kaster 5 og 5. <b>To like eller summen er 7</b> passer. <b>Ikke to like</b> passer ikke.')))
    return boards
game(id='sannsynlighetsjakten', title='Sannsynlighetsjakten', sub='Fire på rad med hendelser og sannsynlighet', grade=9, ch='9k4', chname='Sannsynlighet',
     topic='flere-hendelser', link='#9k4-flere-hendelser', a='#D9475A', a2='#FBE5E8', dice_n='2 terninger', make=B_sanns,
     short='Kast to terninger og finn en hendelse som skjedde, eller sannsynligheten for summen. Først til fire på rad.',
     lv=['Nivå 1: enkle hendelser', 'Nivå 2: sannsynligheten for summen', 'Nivå 3: hendelser med og, eller og ikke'])

# ===== 10. trinn: Parentesjakten =====
def poly(a2, a1, a0):
    s = ''
    for c, t in ((a2, 'x²'), (a1, 'x'), (a0, '')):
        if c == 0: continue
        sg = '−' if c < 0 else '+'; v = abs(c)
        term = (t if v == 1 and t else f'{v}{t}')
        s += (('−' if c < 0 else '') + term) if not s else f' {sg} {term}'
    return s
def B_par():
    boards = []
    def o1(r):
        a, b = r; return [(1, a + b, a * b)]
    def o2(r):
        a, b = r; return [(1, sa * a + sb * b, sa * a * sb * b) for sa in (1, -1) for sb in (1, -1)]
    def o3(r):
        o = []
        for a, b in (r, r[::-1]):
            o += [(a * a, 2 * a * b, b * b), (a * a, -2 * a * b, b * b), (a * a, 0, -b * b)]
        return o
    for lv, out in ((1, o1), (2, o2), (3, o3)):
        cells, cover = fill(2, out, 800 + lv, cap=2)
        cl = [('t', poly(*k)) for k in cells]
        steps = {1: ['Kast to terninger. Tallene er <b>a</b> og <b>b</b>.', 'Gang ut (x + a)(x + b) og trekk sammen.'],
                 2: ['Kast to terninger. Tallene er <b>a</b> og <b>b</b>.', 'Velg fortegn selv: gang ut (x + a)(x + b), (x + a)(x − b), (x − a)(x + b) eller (x − a)(x − b).'],
                 3: ['Kast to terninger. Det ene tallet er <b>a</b>, det andre er <b>b</b>. Du velger hvilket som er hva.', 'Bruk en kvadratsetning: (ax + b)², (ax − b)² eller (ax + b)(ax − b).']}[lv]
        steps += ['Finn en ledig rute med svaret, og merk den. Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.', 'Ingen ledig rute? Da er det neste spiller sin tur.']
        ex = {1: ([2, 5], 'Du kaster 2 og 5. (x + 2)(x + 5) = <b>x² + 7x + 10</b>.'),
              2: ([2, 5], 'Du kaster 2 og 5. (x − 2)(x + 5) = <b>x² + 3x − 10</b>, eller (x + 2)(x − 5) = <b>x² − 3x − 10</b>.'),
              3: ([2, 5], 'Du kaster 2 og 5. (2x − 5)² = <b>4x² − 20x + 25</b>, eller (5x + 2)(5x − 2) = <b>25x² − 4</b>.')}[lv]
        boards.append(dict(level=lv, cells=cl, cover=cover, dice=2, steps=steps, ex=dict(d=ex[0], txt=ex[1])))
    return boards
game(id='parentesjakten', title='Parentesjakten', sub='Fire på rad med parentesuttrykk', grade=10, ch='10k1', chname='Algebra',
     topic='polynom', link='#10k1-polynom', a='#4C5BD4', a2='#E6E8FA', dice_n='2 terninger', make=B_par,
     short='Terningene gir tallene i parentesene. Gang ut og finn uttrykket på brettet.',
     lv=['Nivå 1: (x + a)(x + b)', 'Nivå 2: velg fortegn selv', 'Nivå 3: kvadratsetningene'])

# ===== 10. trinn: Grafjakten =====
AM = {1: Fr(-2), 2: Fr(-1), 3: Fr(-1, 2), 4: Fr(1, 2), 5: Fr(1), 6: Fr(2)}
BM = {1: -3, 2: -2, 3: -1, 4: 1, 5: 2, 6: 3}
def fstr(a):
    if a.denominator == 1: return nf(int(a))
    return ('−' if a < 0 else '') + f'{abs(a.numerator)}/{a.denominator}'
def lin(a, b):
    at = '' if a == 1 else '−' if a == -1 else fstr(a)
    return f'y = {at}x {"+" if b>0 else "−"} {abs(b)}'
def B_graf():
    boards = []
    def out(r): return list({(AM[r[0]], BM[r[1]]), (AM[r[1]], BM[r[0]])})
    keys = [(a, b) for a in AM.values() for b in BM.values()]
    tab = '<table class="maptab"><tr><th>Terning</th>' + ''.join(f'<th>{die(i,18)}</th>' for i in D6) + '</tr><tr><th>a</th>' + ''.join(f'<td>{fstr(AM[i])}</td>' for i in D6) + '</tr><tr><th>b</th>' + ''.join(f'<td>{nf(BM[i])}</td>' for i in D6) + '</tr></table>'
    def table(a, b):
        return f'<table class="vt"><tr><td>x</td><td>2</td><td>4</td></tr><tr><td>y</td><td>{nf(int(2*a+b))}</td><td>{nf(int(4*a+b))}</td></tr></table>'
    def words(a, b):
        d = 'stiger' if a > 0 else 'synker'
        aa = abs(a); per = f'{fstr(aa)}' if aa.denominator == 1 else '1'
        if aa.denominator == 1: return f'Går gjennom (0, {nf(b)}) og {d} {per} når x øker med 1'
        return f'Går gjennom (0, {nf(b)}) og {d} 1 når x øker med 2'
    def other(a, b):
        # 2y = 2ax + 2b
        A = 2 * a; at = '' if A == 1 else '−' if A == -1 else fstr(A)
        return f'2y = {at}x {"+" if b>0 else "−"} {abs(2*b)}'
    rnd = random.Random(903)
    for lv in (1, 2, 3):
        cells, cover = fill(2, out, 900 + lv, fixed=keys)
        if lv == 1: cl = [('g', plane(-4, 4, -5, 5, [('line', float(a), b)], 72)) for a, b in cells]
        elif lv == 2: cl = [('html', table(a, b)) for a, b in cells]
        else:
            kinds = (['g'] * 9 + ['tab'] * 9 + ['w'] * 9 + ['o'] * 9); rnd.shuffle(kinds); cl = []
            for (a, b), k in zip(cells, kinds):
                if k == 'g': cl.append(('g', plane(-4, 4, -5, 5, [('line', float(a), b)], 72)))
                elif k == 'tab': cl.append(('html', table(a, b)))
                elif k == 'w': cl.append(('t', words(a, b)))
                else: cl.append(('t', other(a, b)))
        steps = ['Kast to terninger. Bruk tabellen: den ene terningen gir stigningstallet <b>a</b>, den andre gir konstantleddet <b>b</b>. Du velger hvilken som er hva.',
                 {1: 'Finn en ledig rute med grafen til y = ax + b.', 2: 'Finn en ledig rute med en verditabell som passer til y = ax + b.', 3: 'Finn en ledig rute som passer til y = ax + b. Den kan være en graf, en tabell, en beskrivelse eller en omskrevet likning.'}[lv],
                 'Forklar hvorfor den passer, og merk ruta. Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.', 'Ingen ledig rute? Da er det neste spiller sin tur.']
        boards.append(dict(level=lv, cells=cl, cover=cover, dice=2, steps=steps, box=tab,
            ex=dict(d=[2, 6], txt='Du kaster 2 og 6. Enten a = −1 og b = 3, altså <b>y = −x + 3</b>, eller a = 2 og b = −2, altså <b>y = 2x − 2</b>.')))
    return boards
game(id='grafjakten', title='Grafjakten', sub='Fire på rad med lineære funksjoner', grade=10, ch='10k2', chname='Funksjoner',
     topic='stigningstall', link='#10k2-stigningstall', a='#2C7FB8', a2='#E1EEF8', dice_n='2 terninger', make=B_graf,
     short='Terningene gir stigningstall og konstantledd. Finn grafen, tabellen eller beskrivelsen som passer.',
     lv=['Nivå 1: grafer', 'Nivå 2: verditabeller', 'Nivå 3: graf, tabell, ord og likning om hverandre'])

# ===== 10. trinn: Prosentjakten =====
PRIS = {1: 200, 2: 250, 3: 400, 4: 500, 5: 800, 6: 1000}
PROS = {1: 5, 2: 10, 3: 20, 4: 25, 5: 50, 6: 75}
def kr(v): return nf(v) + ' kr'
def B_pros():
    boards = []
    def pairs(r): return [(PRIS[r[0]], PROS[r[1]]), (PRIS[r[1]], PROS[r[0]])]
    def o1(r): return [Fr(p * q, 100) for p, q in pairs(r)]
    def o2(r): return [Fr(p * (100 + s * q), 100) for p, q in pairs(r) for s in (1, -1)]
    def o3(r):
        p = 5 * (r[0] + r[1]); return [Fr(100 + p, 100), Fr(100 - p, 100)]
    tab = '<table class="maptab"><tr><th>Terning</th>' + ''.join(f'<th>{die(i,18)}</th>' for i in D6) + '</tr><tr><th>Pris</th>' + ''.join(f'<td>{nf(PRIS[i])}</td>' for i in D6) + '</tr><tr><th>Prosent</th>' + ''.join(f'<td>{PROS[i]}</td>' for i in D6) + '</tr></table>'
    for lv, out in ((1, o1), (2, o2), (3, o3)):
        cells, cover = fill(2, out, 1000 + lv, cap=3 if lv == 3 else 2)
        cl = [('n', kr(v) if lv < 3 else nf(v)) for v in cells]
        steps = {1: ['Kast to terninger. Bruk tabellen: den ene terningen gir en <b>pris</b>, den andre gir en <b>prosent</b>. Du velger hvilken som er hva.',
                     'Regn ut hvor mange kroner prosenten er av prisen.'],
                 2: ['Kast to terninger. Bruk tabellen: den ene terningen gir en <b>pris</b>, den andre gir en <b>prosent</b>. Du velger hvilken som er hva.',
                     'Velg om prisen skal <b>øke</b> eller <b>synke</b> med prosenten, og regn ut den nye prisen.'],
                 3: ['Kast to terninger og legg sammen. Summen ganget med 5 er en prosent.',
                     'Velg om det er en <b>økning</b> eller en <b>nedgang</b>, og finn <b>vekstfaktoren</b>.']}[lv]
        steps += ['Finn en ledig rute med svaret, og merk den. Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.', 'Ingen ledig rute? Da er det neste spiller sin tur.']
        ex = {1: ([3, 4], 'Du kaster 3 og 4. 25 % av 400 kr = <b>100 kr</b>, eller 20 % av 500 kr = <b>100 kr</b>.'),
              2: ([3, 4], 'Du kaster 3 og 4. 400 kr som øker med 25 % blir <b>500 kr</b>. 500 kr som synker med 20 % blir <b>400 kr</b>.'),
              3: ([3, 4], 'Du kaster 3 og 4. Summen er 7, og 7 · 5 = 35 %. Økning: <b>1,35</b>. Nedgang: <b>0,65</b>.')}[lv]
        b = dict(level=lv, cells=cl, cover=cover, dice=2, steps=steps, ex=dict(d=ex[0], txt=ex[1]))
        if lv < 3: b['box'] = tab
        boards.append(b)
    return boards
game(id='prosentjakten', title='Prosentjakten', sub='Fire på rad med prosent og vekstfaktor', grade=10, ch='10k3', chname='Økonomi',
     topic='prosentendring', link='#10k3-prosentendring', a='#C98A12', a2='#FBF0D9', dice_n='2 terninger', make=B_pros,
     short='Terningene gir pris og prosent. Regn ut prosentdel, ny pris eller vekstfaktor.',
     lv=['Nivå 1: prosent av et beløp', 'Nivå 2: ny pris etter økning eller nedgang', 'Nivå 3: vekstfaktor'])

# ===== 10. trinn: Tallsystemjakten =====
def roman(n):
    s = ''
    for v, r in ((40, 'XL'), (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')):
        while n >= v: s += r; n -= v
    return s
def B_tall():
    boards = []
    for lv, out, fmt in ((1, lambda r: [r[0] + r[1]], lambda v: bin(v)[2:]), (2, lambda r: [r[0] * r[1]], lambda v: bin(v)[2:]),
                          (3, lambda r: [r[0] + r[1], r[0] * r[1]], roman)):
        cells, cover = fill(2, out, 1100 + lv, cap=4 if lv == 1 else 3)
        cl = [('n', fmt(v)) for v in cells]
        steps = {1: ['Kast to terninger og legg sammen.', 'Skriv summen i <b>totallsystemet</b>.'],
                 2: ['Kast to terninger og gang tallene.', 'Skriv produktet i <b>totallsystemet</b>.'],
                 3: ['Kast to terninger. Velg om du vil legge sammen eller gange.', 'Skriv svaret med <b>romertall</b>.']}[lv]
        steps += ['Finn en ledig rute med svaret, og merk den. Spiller 1 tegner <b>ring</b> ○, spiller 2 <b>kryss</b> ✕.', 'Ingen ledig rute? Da er det neste spiller sin tur.']
        ex = {1: ([4, 5], 'Du kaster 4 og 5. Summen er 9 = 8 + 1, altså <b>1001</b>.'),
              2: ([4, 5], 'Du kaster 4 og 5. Produktet er 20 = 16 + 4, altså <b>10100</b>.'),
              3: ([4, 5], 'Du kaster 4 og 5. Summen er 9 = <b>IX</b>. Produktet er 20 = <b>XX</b>.')}[lv]
        box = ('<div class="pv"><span>Plassverdier:</span>' + ''.join(f'<b>{v}</b>' for v in (32, 16, 8, 4, 2, 1)) + '</div>') if lv < 3 else ('<div class="pv"><span>Romertall:</span><b>I = 1</b><b>V = 5</b><b>X = 10</b><b>L = 50</b></div>')
        boards.append(dict(level=lv, cells=cl, cover=cover, dice=2, steps=steps, ex=dict(d=ex[0], txt=ex[1]), box=box))
    return boards
game(id='tallsystemjakten', title='Tallsystemjakten', sub='Fire på rad med totallsystemet og romertall', grade=10, ch='10k4', chname='Arbeid med matematikk',
     topic='tallsystem', link='#10k4-tallsystem', a='#5B6B82', a2='#E8ECF2', dice_n='2 terninger', make=B_tall,
     short='Regn med terningene og skriv svaret i totallsystemet eller med romertall. Først til fire på rad.',
     lv=['Nivå 1: summen i totallsystemet', 'Nivå 2: produktet i totallsystemet', 'Nivå 3: romertall'])

# ---------- HTML ----------
FONT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'node_modules', '@fontsource')
CSS = '''
@font-face{font-family:"Bricolage Grotesque";font-weight:700;src:url(FONT/bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff2)}
@font-face{font-family:"Bricolage Grotesque";font-weight:800;src:url(FONT/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2)}
@font-face{font-family:"Inter";font-weight:400;src:url(FONT/inter/files/inter-latin-400-normal.woff2)}
@font-face{font-family:"Inter";font-weight:600;src:url(FONT/inter/files/inter-latin-600-normal.woff2)}
@font-face{font-family:"Inter";font-weight:700;src:url(FONT/inter/files/inter-latin-700-normal.woff2)}
@page{size:297mm 210mm;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#fff;color:#141E36;font-family:Inter,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{--ink:#141E36;width:297mm;height:210mm;padding:10mm 11mm;display:flex;gap:9mm;page-break-after:always;overflow:hidden;position:relative}
.pg:last-child{page-break-after:auto}
.board{flex:none;width:188mm;height:190mm;background:var(--a2);border-radius:7mm;padding:5mm;display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(6,1fr);gap:2.6mm}
.cell{background:#fff;border:.6mm solid var(--ink);border-radius:3.2mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:1.2mm;overflow:hidden;line-height:1.15}
.c-n{font-family:"Bricolage Grotesque";font-weight:800;font-size:21pt;letter-spacing:-.01em}
.c-n.m{font-size:16pt}.c-n.s{font-size:12.5pt}
.c-t{font-family:"Bricolage Grotesque";font-weight:700;font-size:13pt}
.c-t.m{font-size:11.2pt}.c-t.s{font-size:9.6pt;font-family:Inter;font-weight:600}
.c-lab small{display:block;font-size:8pt;font-weight:600;letter-spacing:.02em;color:#56617A;margin-bottom:.6mm}
.c-lab b{font-family:"Bricolage Grotesque";font-weight:800;font-size:22pt}
.c-shape b{font-family:"Bricolage Grotesque";font-weight:800;font-size:11pt;margin-top:.8mm;white-space:nowrap}
.fr{display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1}
.fr span:first-child{border-bottom:.5mm solid currentColor;padding:0 1mm .6mm}.fr span:last-child{padding-top:.6mm}
.vt{border-collapse:collapse;font-family:"Bricolage Grotesque";font-weight:700;font-size:10.5pt}
.vt td{border:.35mm solid var(--ink);padding:.6mm 1.2mm;min-width:6.4mm;text-align:center}.vt td:first-child{background:var(--a2)}
.side{flex:1;display:flex;flex-direction:column;min-width:0}
.lvl{align-self:flex-start;font-size:8.5pt;font-weight:700;letter-spacing:.06em;text-transform:uppercase;background:var(--a);color:#fff;border-radius:99px;padding:1mm 3mm;margin-bottom:2.5mm}
h1.long{font-size:26pt!important}h1.xlong{font-size:20.5pt!important}
h1{font-family:"Bricolage Grotesque";font-weight:800;font-size:31pt;line-height:1;margin:0 0 1.6mm;letter-spacing:-.02em}
.sub{font-weight:700;font-size:11pt;margin:0 0 3mm}
.chips{display:flex;gap:1.6mm;flex-wrap:wrap;margin-bottom:3.5mm}
.chips span{border:.4mm solid var(--ink);border-radius:99px;padding:.7mm 2.6mm;font-size:8pt;font-weight:600}
ol.steps{list-style:none;padding:0;margin:0 0 3mm;counter-reset:s}
ol.steps li{position:relative;padding-left:8.5mm;margin-bottom:2.4mm;font-size:10pt;line-height:1.35;counter-increment:s}
ol.steps li::before{content:counter(s);position:absolute;left:0;top:-.2mm;width:5.6mm;height:5.6mm;border-radius:50%;background:var(--ink);color:#fff;font-size:8pt;font-weight:700;display:flex;align-items:center;justify-content:center}
.box{margin-bottom:3mm}
.ex{background:var(--a2);border-radius:4mm;padding:3mm 3.5mm;font-size:9.6pt;line-height:1.4;margin-bottom:3mm}
.ex .dd{display:flex;gap:1.6mm;margin-bottom:1.8mm}
.win{margin-top:auto;border-top:.4mm solid var(--ink);padding-top:2.4mm}
.win b{display:block;font-family:"Bricolage Grotesque";font-weight:800;font-size:13.5pt}
.win span{font-size:9pt}
.foot{font-size:7.5pt;color:#56617A;margin-top:2mm;display:flex;justify-content:space-between}
.fns{display:flex;flex-direction:column;gap:1.4mm}
.fns span{font-family:"Bricolage Grotesque";font-weight:700;font-size:12pt;border:.4mm solid var(--ink);border-radius:2.5mm;padding:1.2mm 3mm;background:#fff}
.legend{display:flex;flex-wrap:wrap;gap:1.5mm 4mm;font-size:8.8pt;font-weight:600}
.legend span{display:flex;align-items:center;gap:1.5mm}
table.maptab,table.sumtab{border-collapse:collapse;font-size:8.6pt;width:100%}
.maptab th,.maptab td,.sumtab th,.sumtab td{border:.3mm solid #AEB8CA;text-align:center;padding:.7mm .4mm}
.maptab th:first-child{text-align:left;padding-left:1.5mm;font-weight:600}
.maptab td{font-family:"Bricolage Grotesque";font-weight:700;font-size:10pt}
.maptab th svg{display:block;margin:auto}
.sumtab{font-size:7.2pt}.sumtab th{background:var(--a2)}.sumtab th,.sumtab td{padding:.1mm!important;line-height:1.25}
.pv{display:flex;flex-wrap:wrap;gap:1.4mm;align-items:center;font-size:8.8pt}
.pv span{font-weight:600;margin-right:1mm}.pv b{border:.4mm solid var(--ink);border-radius:2mm;padding:.6mm 2mm;font-family:"Bricolage Grotesque"}
'''.replace('FONT', 'file://' + FONT)

def cell_html(c):
    t, v = c
    if t == 'n':
        L = len(v.replace(' ', '')) if '<' not in v else 3
        return f'<div class="cell c-n{" s" if L>7 else " m" if L>4 else ""}">{v}</div>'
    if t == 't':
        L = len(v)
        math_ = all(ch in 'x0123456789+−-=()·:² y' for ch in v)
        if math_:
            nb = lambda z: z.replace(' ', '\u00a0')
            if '=' in v and L > 11:
                l, r = v.split(' = ', 1); v = nb(l) + '<br>=\u00a0' + nb(r)
                return f'<div class="cell c-t m">{v}</div>'
            if L > 11 and v.count(' ') >= 4:
                i = v.rfind(' + ') if v.rfind(' + ') > v.rfind(' − ') else v.rfind(' − ')
                v = nb(v[:i]) + '<br>' + nb(v[i+1:]); return f'<div class="cell c-t m">{v}</div>'
            return f'<div class="cell c-t{" m" if L>9 else ""}">{nb(v)}</div>'
        return f'<div class="cell c-t{" s" if L>18 else " m" if L>11 else ""}">{v}</div>'
    if t == 'lab':
        return f'<div class="cell c-lab"><small>{v[0]}</small><b>{v[1]}</b></div>'
    if t == 'shape':
        return f'<div class="cell c-shape">{shape(v[0], 46)}<b>{v[1]}</b></div>'
    return f'<div class="cell">{v}</div>'

def page(g, b):
    chips = ['2 spillere', ('1 terning' if b['dice'] == 1 else f'{b["dice"]} terninger'), '1 blyant']
    steps = ''.join(f'<li>{s}</li>' for s in b['steps'])
    box = f'<div class="box">{b["box"]}</div>' if b.get('box') else ''
    dd = ''.join(die(n, 30) for n in b['ex']['d'])
    return f'''<section class="pg" style="--a:{g['a']};--a2:{g['a2']}">
<div class="board">{''.join(cell_html(c) for c in b['cells'])}</div>
<div class="side"><span class="lvl">Nivå {b['level']}</span><h1{' class="xlong"' if len(g['title'])>17 else ' class="long"' if len(g['title'])>12 else ''}>{g['title']}</h1><p class="sub">{g['sub']}</p>
<div class="chips">{''.join(f'<span>{c}</span>' for c in chips)}</div>
<ol class="steps">{steps}</ol>{box}
<div class="ex"><div class="dd">{dd}</div>{b['ex']['txt']}</div>
<div class="win"><b>Først til fire på rad vinner!</b><span>Vannrett, loddrett eller på skrå. Blir brettet fullt, vinner den med flest ruter.</span></div>
<div class="foot"><span>{g['title']} · {g['lv'][b['level']-1]}</span><span>{g['grade']}. trinn · {g['chname']}</span></div></div></section>'''

meta = []
for g in GAMES:
    boards = g['make']()
    for b in boards:
        print(g['id'], 'nivå', b['level'], 'dekning %.0f %%' % (100 * b['cover']))
    html = f'<!doctype html><html lang="nb"><meta charset="utf-8"><style>{CSS}</style>' + ''.join(page(g, b) for b in boards) + '</html>'
    open(os.path.join(OUT, g['id'] + '.html'), 'w').write(html)
    meta.append({k: g[k] for k in ('id', 'title', 'sub', 'grade', 'ch', 'chname', 'topic', 'link', 'short', 'lv', 'a', 'a2')})
json.dump(meta, open(os.path.join(OUT, 'spill.json'), 'w'), ensure_ascii=False, indent=1)
