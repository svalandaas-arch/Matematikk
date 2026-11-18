# Øvingseksamener for 10. trinn: oppgaver, fasit og løsningsforslag. Kjør: python3 eks.py -> eks.json
import json, math, os
from fractions import Fraction as Fr

# ---------- kontroller utregningene ----------
C = math.isclose
assert 3 + 4 * 5 == 23 and (-3) ** 2 - 2 ** 3 == 1 and Fr(2, 3) + Fr(1, 4) == Fr(11, 12)
assert 800 * .75 == 600 and 600 * 1.25 == 750
assert 2 * (3 + 4) == 5 * 3 - 1
assert 20 * 10 * 15 == 3000 and 2 * (200 + 300 + 150) == 1300
assert Fr(3, 10) * Fr(2, 9) == Fr(1, 15)
s1 = 20000 * 1.035 ** 10; assert round(s1) == 28212
assert math.ceil(math.log(1.5) / math.log(1.035)) == 12 and 20000 * 1.035 ** 11 < 30000 < 20000 * 1.035 ** 12
d = [2, 5, 3, 4, 6, 3, 2, 8, 4, 3, 5, 3]; assert sum(d) == 48 and sorted(d)[5:7] == [3, 4]
assert C(sum(d[:7] + [18] + d[8:]) / 12, 58 / 12)
assert C(49 / 0.25, 196)
assert C(math.sqrt(25 - 1.4 ** 2), 4.8) and round(math.sqrt(25 - 4.9 ** 2), 2) == 0.99
assert sum(1 for a in range(1, 7) for b in range(1, 7) if a + b in (6, 7, 8)) == 16
assert sum(1 for a in range(1, 7) for b in range(1, 7) if a + b in (2, 6, 7, 8, 12)) == 18
n = 0; tot = 0
while tot < 5000: tot += 150 + 10 * n; n += 1
assert n == 21 and tot == 5250
assert 7.2 / 0.9 == 8 and 3 * 10 ** 4 + 2 * 10 ** 2 == 30200
assert 480 * 1.25 == 600 and 750 / 1.25 == 600
assert C(math.pi * 25, 78.54, rel_tol=1e-4)
assert 450 * 24 + 300 == 11100 and round(2100 / 9000 * 100, 1) == 23.3
tb = (20 + math.sqrt(400 + 30)) / 10; assert round(tb, 2) == 4.07 and -5 * 4 + 40 + 1.5 == 21.5
V = math.pi * 0.6 ** 2 * 1.5 * 1000; assert round(V) == 1696 and round(V / 25, 1) == 67.9
assert 10 * 9 * 8 * 7 == 5040
A = [12, 15, 18, 20, 20, 21, 22, 24, 25, 28]; B = [8, 14, 19, 20, 21, 21, 23, 26, 29, 34]
assert sum(A) == 205 and sum(B) == 215 and sorted(B)[4:6] == [21, 21]
assert 3 * 150 + 2 * 80 == 610 and 2 * 150 + 4 * 80 == 620
assert all(((2 * k + 1) ** 2 - 1) % 8 == 0 for k in range(100))
assert 160 * 12 == 1920 and 1920 * .85 == 1632
assert (-2) ** 2 + 2 * 3 == 10 and (-2 - 3) ** 2 == 25 and 3 * -2 - 3 ** 2 == -15
assert 3 * 6 / 2 == 9 and 7.5 / 3 == 2.5
assert C(199 * 11.7, 2328.3) and round(2390 / 199, 2) == 12.01
assert round(400000 * .85 ** 3) == 245650 and math.ceil(math.log(.25) / math.log(.85)) == 9
assert round(96 + math.pi * 16 / 2, 1) == 121.1 and round(32 + math.pi * 8 / 2, 1) == 44.6
assert 0 * 4 + 1 * 9 + 2 * 7 + 3 * 3 + 4 * 2 == 40
assert sum(i for i in range(1, 101) if i % 3 == 0) == 1683 and sum(i for i in range(1, 101) if i % 3 == 0 or i % 5 == 0) == 2418
assert (4000 + 1500) / 200 == 27.5

# ---------- figurer (SVG, tilpasser seg mørk modus med currentColor) ----------
def axes(x0, x1, y0, y1, W=300, H=220, xs=1, ys=1, xl='x', yl='y', grid=True):
    m = 34; pw, ph = W - m - 12, H - m - 12
    X = lambda x: m + (x - x0) / (x1 - x0) * pw; Y = lambda y: 12 + (y1 - y) / (y1 - y0) * ph
    s = ''
    if grid:
        x = x0
        while x <= x1 + 1e-9: s += f'<path d="M{X(x):.1f} {Y(y0):.1f}V{Y(y1):.1f}" stroke="currentColor" stroke-opacity=".14"/>'; x += xs
        y = y0
        while y <= y1 + 1e-9: s += f'<path d="M{X(x0):.1f} {Y(y):.1f}H{X(x1):.1f}" stroke="currentColor" stroke-opacity=".14"/>'; y += ys
    ax, ay = (0 if x0 <= 0 <= x1 else x0), (0 if y0 <= 0 <= y1 else y0)
    s += f'<path d="M{X(x0):.1f} {Y(ay):.1f}H{X(x1)+6:.1f}M{X(ax):.1f} {Y(y0):.1f}V{Y(y1)-6:.1f}" stroke="currentColor" stroke-width="1.4"/>'
    x = x0
    while x <= x1 + 1e-9:
        if abs(x - ax) > 1e-9 or ay != 0: s += f'<text x="{X(x):.1f}" y="{Y(ay)+14:.1f}" text-anchor="middle">{fmt(x)}</text>'
        x += xs
    y = y0
    while y <= y1 + 1e-9:
        if abs(y - ay) > 1e-9 or ax != 0: s += f'<text x="{X(ax)-5:.1f}" y="{Y(y)+4:.1f}" text-anchor="end">{fmt(y)}</text>'
        y += ys
    s += f'<text x="{X(x1)+4:.1f}" y="{Y(ay)-6:.1f}" text-anchor="end" font-style="italic">{xl}</text><text x="{X(ax)+6:.1f}" y="{Y(y1)+2:.1f}" font-style="italic">{yl}</text>'
    return s, X, Y
def fmt(v):
    v = round(v, 6); return (str(int(v)) if v == int(v) else str(v).replace('.', ',')).replace('-', '−')
def svg(inner, W=300, H=220):
    return f'<svg class="eks-fig" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="inherit" font-size="11" fill="currentColor" role="img">{inner}</svg>'
def fig_line():
    s, X, Y = axes(0, 6, 0, 14, xs=1, ys=2)
    s += f'<path d="M{X(0)} {Y(2)}L{X(6)} {Y(14)}" stroke="var(--pen)" stroke-width="2.4"/>'
    for x, y in ((0, 2), (4, 10)): s += f'<circle cx="{X(x)}" cy="{Y(y)}" r="3.6" fill="var(--pen)"/>'
    return svg(s)
def fig_tiles():
    u = 14; out = ''; ox = 10
    for n in (1, 2, 3):
        cells = [(0, i) for i in range(n + 1)] + [(i, 0) for i in range(1, n + 1)] + [(n + 1, 0)] if False else None
        # figur n: et L med n+1 fliser oppover og 2n fliser bortover (totalt 3n + 1)
        cells = [(0, i) for i in range(n + 1)] + [(i, 0) for i in range(1, 2 * n + 1)]
        assert len(cells) == 3 * n + 1
        for cx, cy in cells:
            out += f'<rect x="{ox+cx*u}" y="{150-(cy+1)*u}" width="{u-1.5}" height="{u-1.5}" rx="2" fill="var(--pen)" fill-opacity=".25" stroke="currentColor"/>'
        out += f'<text x="{ox}" y="172">Figur {n}</text>'
        ox += (2 * n + 1) * u + 26
    return svg(out, 330, 180)
def fig_bars():
    D = [('Fotball', 9), ('Håndball', 6), ('Ski', 4), ('Svømming', 3), ('Annet', 3)]
    s, X, Y = axes(0, 5, 0, 10, W=320, H=220, xs=10, ys=2, xl='', yl='Antall', grid=False)
    s = ''
    m = 34; ph = 220 - m - 12; Yb = lambda v: 12 + (10 - v) / 10 * ph
    for v in range(0, 11, 2): s += f'<path d="M{m} {Yb(v):.1f}H312" stroke="currentColor" stroke-opacity=".14"/><text x="{m-5}" y="{Yb(v)+4:.1f}" text-anchor="end">{v}</text>'
    for i, (n, v) in enumerate(D):
        x = m + 8 + i * 55
        s += f'<rect x="{x}" y="{Yb(v):.1f}" width="40" height="{Yb(0)-Yb(v):.1f}" fill="var(--pen)" fill-opacity=".75"/><text x="{x+20}" y="{Yb(0)+14:.1f}" text-anchor="middle" font-size="10">{n}</text>'
    s += f'<path d="M{m} {Yb(0):.1f}H312M{m} {Yb(0):.1f}V12" stroke="currentColor" stroke-width="1.4"/>'
    return svg(s, 320, 220)
def fig_walk():
    s, X, Y = axes(0, 80, 0, 6, W=320, H=220, xs=10, ys=1, xl='min', yl='km')
    P = [(0, 0), (20, 2), (30, 2), (60, 4), (70, 5.5), (80, 5.5)]
    s += '<path d="M' + ' L'.join(f'{X(x):.1f} {Y(y):.1f}' for x, y in P) + '" fill="none" stroke="var(--pen)" stroke-width="2.4" stroke-linejoin="round"/>'
    return svg(s, 320, 220)
def fig_garden():
    u = 18; s = f'<g transform="translate(26 0)"><path d="M20 30H{20+12*u}V{30+8*u}H20Z" fill="var(--pen)" fill-opacity=".12" stroke="currentColor" stroke-width="1.6"/>'
    cx, cy, r = 20 + 12 * u, 30 + 4 * u, 4 * u
    s += f'<path d="M{cx} {cy-r}A{r} {r} 0 0 1 {cx} {cy+r}" fill="var(--pen)" fill-opacity=".12" stroke="currentColor" stroke-width="1.6"/>'
    s += f'<text x="{20+6*u}" y="24" text-anchor="middle">12 m</text><text x="12" y="{30+4*u+4}" text-anchor="end">8 m</text>'
    return svg(s + '</g>', 46 + 12 * u + r + 20, 30 + 8 * u + 20)
def fig_tri():
    s = '<path d="M20 165H68V101Z" fill="var(--pen)" fill-opacity=".12" stroke="currentColor" stroke-width="1.6"/><text x="44" y="180" text-anchor="middle">3</text><text x="74" y="137">4</text><text x="38" y="128" text-anchor="end">5</text>'
    s += '<path d="M110 165H230V5Z" fill="var(--pen)" fill-opacity=".12" stroke="currentColor" stroke-width="1.6"/><text x="170" y="180" text-anchor="middle">7,5</text><text x="236" y="90">?</text><text x="164" y="80" text-anchor="end">?</text>'
    return svg(s, 260, 188)

# ---------- oppgavene ----------
TEMA = {'tall': 'Tall og regning', 'algebra': 'Algebra og likninger', 'funksjoner': 'Funksjoner', 'geometri': 'Geometri og måling',
        'sannsynlighet': 'Sannsynlighet og kombinatorikk', 'statistikk': 'Statistikk', 'okonomi': 'Økonomi', 'programmering': 'Programmering og regneark', 'resonnering': 'Utforsking og argumentasjon'}
def code(t): return '<pre class="eks-code"><code>' + t.strip('\n').replace('<', '&lt;') + '</code></pre>'
O = []
def T(sett, delen, nr, tema, niv, tekst, fasit, los, fig=None):
    O.append(dict(id=f's{sett}-{nr}', sett=sett, del_=delen, nr=nr, tema=tema, niv=niv, tekst=tekst, fasit=fasit, los=los, fig=fig))

# ===== Øvingseksamen 1 =====
T(1, 1, 1, 'tall', 1, 'Regn ut.<ol type="a"><li>3 + 4 · 5</li><li>(−3)² − 2³</li><li>2/3 + 1/4</li></ol>',
  'a) 23 &nbsp; b) 1 &nbsp; c) 11/12',
  '<p>a) Gange før pluss: 4 · 5 = 20, og 3 + 20 = <b>23</b>.</p><p>b) (−3)² = 9 og 2³ = 8, så 9 − 8 = <b>1</b>.</p><p>c) Fellesnevner 12: 8/12 + 3/12 = <b>11/12</b>.</p>')
T(1, 1, 2, 'okonomi', 1, 'En jakke koster 800 kr. Prisen settes ned med 25 %.<ol type="a"><li>Hva er den nye prisen?</li><li>Senere settes den nye prisen opp igjen med 25 %. Forklar hvorfor prisen ikke blir 800 kr.</li></ol>',
  'a) 600 kr &nbsp; b) Den nye prisen blir 750 kr.',
  '<p>a) 25 % av 800 kr er 200 kr. 800 kr − 200 kr = <b>600 kr</b>.</p><p>b) Nå regner vi 25 % av 600 kr, som er 150 kr. Prisen blir 750 kr. Prosenten regnes av et mindre beløp, så økningen blir mindre enn nedgangen.</p>')
T(1, 1, 3, 'algebra', 1, 'Løs likningene.<ol type="a"><li>3x − 7 = 11</li><li>2(x + 4) = 5x − 1</li></ol>',
  'a) x = 6 &nbsp; b) x = 3',
  '<p>a) 3x = 18, så <b>x = 6</b>.</p><p>b) 2x + 8 = 5x − 1. Trekk 2x fra og legg til 1 på begge sider: 9 = 3x, så <b>x = 3</b>.</p><p>Kontroll: 2(3 + 4) = 14 og 5 · 3 − 1 = 14.</p>')
T(1, 1, 4, 'funksjoner', 2, 'Grafen viser en lineær funksjon.<ol type="a"><li>Bestem stigningstallet og konstantleddet.</li><li>Skriv et funksjonsuttrykk for funksjonen.</li><li>Hva er y når x = 7?</li></ol>',
  'a) Stigningstall 2, konstantledd 2 &nbsp; b) y = 2x + 2 &nbsp; c) y = 16',
  '<p>a) Grafen skjærer y-aksen i 2, så konstantleddet er 2. Fra (0, 2) til (4, 10) øker y med 8 når x øker med 4. Stigningstallet er 8 : 4 = <b>2</b>.</p><p>b) <b>y = 2x + 2</b></p><p>c) y = 2 · 7 + 2 = <b>16</b>.</p>', fig_line())
T(1, 1, 5, 'geometri', 2, 'En eske har form som et rett prisme med lengde 20 cm, bredde 10 cm og høyde 15 cm.<ol type="a"><li>Hvor mange liter rommer esken?</li><li>Hvor stor er overflaten til esken?</li></ol>',
  'a) 3 liter &nbsp; b) 1 300 cm²',
  '<p>a) V = 20 cm · 10 cm · 15 cm = 3 000 cm³. Siden 1 liter = 1 000 cm³, rommer esken <b>3 liter</b>.</p><p>b) To og to sideflater er like: 2 · (20 · 10 + 20 · 15 + 10 · 15) = 2 · (200 + 300 + 150) = <b>1 300 cm²</b>.</p>')
T(1, 1, 6, 'sannsynlighet', 2, 'En pose har 3 røde, 5 blå og 2 grønne kuler.<ol type="a"><li>Du trekker én kule. Hva er sannsynligheten for at den er blå?</li><li>Du trekker to kuler uten å legge den første tilbake. Hva er sannsynligheten for at begge er røde?</li></ol>',
  'a) 1/2 &nbsp; b) 1/15',
  '<p>a) 5 av 10 kuler er blå: P = 5/10 = <b>1/2</b>.</p><p>b) Første kule: 3/10. Da er det 2 røde igjen av 9 kuler: 2/9. P = 3/10 · 2/9 = 6/90 = <b>1/15</b>.</p>')
T(1, 1, 7, 'programmering', 2, 'Se på programmet.' + code('tall = 1\nfor i in range(5):\n    tall = tall * 2\nprint(tall)') + '<ol type="a"><li>Hva skriver programmet ut?</li><li>Endre programmet slik at det regner ut 3⁵.</li></ol>',
  'a) 32 &nbsp; b) Bytt 2 med 3 i linje 3. Da skrives 243 ut.',
  '<p>a) Løkka går 5 ganger, og tallet dobles hver gang: 2, 4, 8, 16, 32. Programmet skriver ut <b>32</b>, som er 2⁵.</p><p>b) Endre linje 3 til <code>tall = tall * 3</code>. Da blir svaret 3⁵ = 243.</p>')
T(1, 2, 8, 'algebra', 2, 'Figurene er laget av kvadratiske fliser.<ol type="a"><li>Hvor mange fliser er det i figur 4 og figur 5?</li><li>Lag en formel for antall fliser i figur n.</li><li>Hvilken figur har 151 fliser?</li></ol>',
  'a) 13 og 16 &nbsp; b) 3n + 1 &nbsp; c) Figur 50',
  '<p>a) Antallet øker med 3 for hver figur: 4, 7, 10, <b>13</b>, <b>16</b>.</p><p>b) Figur n har n + 1 fliser oppover og 2n fliser bortover: <b>3n + 1</b>.</p><p>c) 3n + 1 = 151 gir 3n = 150, så <b>n = 50</b>.</p>', fig_tiles())
T(1, 2, 9, 'okonomi', 2, 'Emma setter inn 20 000 kr på en konto med 3,5 % rente per år.<ol type="a"><li>Hvor mye står på kontoen etter ett år?</li><li>Lag en formel for hvor mye som står på kontoen etter x år. Hvor mye står på kontoen etter 10 år?</li><li>Hvor mange år tar det før det står mer enn 30 000 kr på kontoen?</li></ol>',
  'a) 20 700 kr &nbsp; b) K(x) = 20 000 · 1,035ˣ, omtrent 28 212 kr &nbsp; c) 12 år',
  '<p>a) Vekstfaktoren er 1,035. 20 000 · 1,035 = <b>20 700 kr</b>.</p><p>b) <b>K(x) = 20 000 · 1,035ˣ</b>. K(10) = 20 000 · 1,035¹⁰ ≈ <b>28 212 kr</b>.</p><p>c) Prøv deg fram, eller bruk regneark eller graftegner: K(11) ≈ 29 199 kr og K(12) ≈ 30 221 kr. Det tar <b>12 år</b>.</p>')
T(1, 2, 10, 'statistikk', 2, 'Tolv elever skrev ned hvor mange timer skjermtid de hadde i går:<p class="eks-data">2, 5, 3, 4, 6, 3, 2, 8, 4, 3, 5, 3</p><ol type="a"><li>Finn gjennomsnittet, medianen, typetallet og variasjonsbredden.</li><li>Lag et passende diagram.</li><li>Det viser seg at 8 skulle vært 18. Hvilke av målene i a) endrer seg?</li></ol>',
  'a) Gjennomsnitt 4, median 3,5, typetall 3, variasjonsbredde 6 &nbsp; c) Gjennomsnittet og variasjonsbredden',
  '<p>a) Summen er 48, så gjennomsnittet er 48 : 12 = <b>4</b>. Sortert: 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 6, 8. Medianen er (3 + 4) : 2 = <b>3,5</b>. Typetallet er <b>3</b>. Variasjonsbredden er 8 − 2 = <b>6</b>.</p><p>b) For eksempel et søylediagram med antall timer langs x-aksen og antall elever langs y-aksen.</p><p>c) Summen blir 58, og gjennomsnittet blir omtrent 4,8. Variasjonsbredden blir 16. Medianen og typetallet endrer seg ikke, fordi den største verdien ikke påvirker dem.</p>')
T(1, 2, 11, 'funksjoner', 3, 'To strømavtaler:<ul><li>Avtale A: 49 kr per måned + 1,20 kr per kWh</li><li>Avtale B: 1,45 kr per kWh, ingen fast pris</li></ul><ol type="a"><li>Lag funksjonsuttrykk for prisen per måned for hver avtale.</li><li>Tegn grafene for et forbruk fra 0 til 600 kWh.</li><li>Når lønner det seg å velge avtale A?</li></ol>',
  'a) A(x) = 1,20x + 49 og B(x) = 1,45x &nbsp; c) Når forbruket er over 196 kWh',
  '<p>a) <b>A(x) = 1,20x + 49</b> og <b>B(x) = 1,45x</b>, der x er antall kWh.</p><p>b) Bruk en graftegner. Begge grafene er rette linjer, og B starter i origo.</p><p>c) Grafene skjærer hverandre der 1,20x + 49 = 1,45x, det vil si 0,25x = 49 og x = 196. Avtale A er billigst når forbruket er <b>over 196 kWh</b>.</p>')
T(1, 2, 12, 'geometri', 2, 'En stige er 5,0 m lang og står mot en vegg. Foten av stigen står 1,4 m fra veggen.<ol type="a"><li>Hvor høyt opp på veggen når stigen?</li><li>Stigen skal nå 4,9 m opp. Hvor langt fra veggen må foten stå?</li></ol>',
  'a) 4,8 m &nbsp; b) Omtrent 1,0 m',
  '<p>a) Pytagoras: h² = 5,0² − 1,4² = 25 − 1,96 = 23,04. h = √23,04 = <b>4,8 m</b>.</p><p>b) a² = 5,0² − 4,9² = 25 − 24,01 = 0,99. a = √0,99 ≈ <b>1,0 m</b>.</p>')
T(1, 2, 13, 'sannsynlighet', 3, 'Ali og Bea kaster to terninger. Ali vinner hvis summen er 6, 7 eller 8. Ellers vinner Bea.<ol type="a"><li>Er spillet rettferdig? Begrunn svaret.</li><li>Foreslå en endring som gjør spillet rettferdig.</li></ol>',
  'a) Nei, P(Ali vinner) = 16/36 &nbsp; b) For eksempel at Ali også vinner på summen 2 og 12',
  '<p>a) Det er 36 like sannsynlige utfall. Summen 6 kan komme på 5 måter, 7 på 6 måter og 8 på 5 måter. P(Ali vinner) = 16/36, som er mindre enn 1/2. Spillet er <b>ikke rettferdig</b>, Bea har størst sjanse.</p><p>b) Ali trenger 18 av 36 utfall. Hvis Ali også vinner på summen 2 (1 måte) og 12 (1 måte), får han 18/36 = 1/2. Andre løsninger er også mulige.</p>')
T(1, 2, 14, 'programmering', 3, 'Jonas sparer 150 kr den første uka. Hver uke etter det sparer han 10 kr mer enn uka før.<ol type="a"><li>Hvor mye sparer han i uke 5, og hvor mye har han spart til sammen etter 5 uker?</li><li>Lag et program eller et regneark som finner hvor mange uker det tar før han har spart minst 5 000 kr.</li></ol>',
  'a) 190 kr i uke 5, 850 kr til sammen &nbsp; b) 21 uker',
  '<p>a) 150, 160, 170, 180, <b>190</b>. Til sammen <b>850 kr</b>.</p><p>b) Et eksempel på program:</p>' + code('spart = 0\nbelop = 150\nuker = 0\nwhile spart < 5000:\n    spart = spart + belop\n    belop = belop + 10\n    uker = uker + 1\nprint(uker, spart)') + '<p>Programmet skriver ut 21 og 5250. Det tar <b>21 uker</b>. Etter 20 uker har han bare spart 4 900 kr.</p>')
T(1, 2, 15, 'resonnering', 3, 'Påstand: «Summen av tre hele tall som kommer etter hverandre, er alltid delelig med 3.»<ol type="a"><li>Test påstanden med tre eksempler.</li><li>Vis at påstanden alltid stemmer.</li><li>Gjelder det samme for fire tall etter hverandre og tallet 4?</li></ol>',
  'b) n − 1 + n + n + 1 = 3n &nbsp; c) Nei',
  '<p>a) For eksempel 1 + 2 + 3 = 6, 4 + 5 + 6 = 15 og 10 + 11 + 12 = 33. Alle er delelige med 3.</p><p>b) Kall det midterste tallet n. Da er summen (n − 1) + n + (n + 1) = <b>3n</b>, som alltid er delelig med 3.</p><p>c) <b>Nei.</b> 1 + 2 + 3 + 4 = 10, som ikke er delelig med 4. Generelt er n + (n + 1) + (n + 2) + (n + 3) = 4n + 6, og 6 er ikke delelig med 4.</p>')

# ===== Øvingseksamen 2 =====
T(2, 1, 1, 'tall', 1, 'Regn ut.<ol type="a"><li>2,5 · 4</li><li>7,2 : 0,9</li><li>3 · 10⁴ + 2 · 10²</li></ol>', 'a) 10 &nbsp; b) 8 &nbsp; c) 30 200',
  '<p>a) 2,5 · 4 = <b>10</b>.</p><p>b) Gang begge tallene med 10: 72 : 9 = <b>8</b>.</p><p>c) 30 000 + 200 = <b>30 200</b>.</p>')
T(2, 1, 2, 'tall', 2, '<ol type="a"><li>Skriv 45 000 000 på standardform.</li><li>Skriv 0,0032 på standardform.</li><li>Regn ut (4 · 10³) · (2 · 10⁵). Skriv svaret på standardform.</li></ol>', 'a) 4,5 · 10⁷ &nbsp; b) 3,2 · 10⁻³ &nbsp; c) 8 · 10⁸',
  '<p>a) Flytt kommaet 7 plasser: <b>4,5 · 10⁷</b>.</p><p>b) Flytt kommaet 3 plasser mot høyre: <b>3,2 · 10⁻³</b>.</p><p>c) 4 · 2 = 8 og 10³ · 10⁵ = 10⁸. Svaret er <b>8 · 10⁸</b>.</p>')
T(2, 1, 3, 'okonomi', 2, 'Merverdiavgiften (mva) er 25 %.<ol type="a"><li>En vare koster 480 kr uten mva. Hva koster den med mva?</li><li>En annen vare koster 750 kr med mva. Hva koster den uten mva?</li></ol>', 'a) 600 kr &nbsp; b) 600 kr',
  '<p>a) 480 · 1,25 = <b>600 kr</b>.</p><p>b) 750 : 1,25 = <b>600 kr</b>. Det er feil å trekke fra 25 % av 750 kr, fordi mva-en er regnet av prisen uten mva.</p>')
T(2, 1, 4, 'algebra', 2, '<ol type="a"><li>Trekk sammen: 3(2a − 4) − 2(a − 5)</li><li>Trekk sammen: (x + 3)² − x²</li><li>Faktoriser: x² − 9</li></ol>', 'a) 4a − 2 &nbsp; b) 6x + 9 &nbsp; c) (x + 3)(x − 3)',
  '<p>a) 6a − 12 − 2a + 10 = <b>4a − 2</b>.</p><p>b) x² + 6x + 9 − x² = <b>6x + 9</b>.</p><p>c) Konjugatsetningen: <b>(x + 3)(x − 3)</b>.</p>')
T(2, 1, 5, 'funksjoner', 2, 'Tabellen viser noen verdier for en funksjon.<table class="eks-tab"><tr><th>x</th><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><th>y</th><td>5</td><td>3</td><td>1</td><td>−1</td></tr></table><ol type="a"><li>Forklar hvorfor funksjonen er lineær.</li><li>Skriv et funksjonsuttrykk.</li><li>Finn nullpunktet til funksjonen.</li></ol>',
  'b) y = −2x + 5 &nbsp; c) x = 2,5',
  '<p>a) y endrer seg like mye (−2) hver gang x øker med 1. Da er grafen en rett linje.</p><p>b) Stigningstallet er −2 og konstantleddet er 5: <b>y = −2x + 5</b>.</p><p>c) −2x + 5 = 0 gir <b>x = 2,5</b>.</p>')
T(2, 1, 6, 'geometri', 2, 'En sirkel har radius 5 cm. Bruk π ≈ 3,14.<ol type="a"><li>Finn omkretsen.</li><li>Finn arealet.</li><li>Finn arealet av en kvart sirkel med samme radius.</li></ol>', 'a) 31,4 cm &nbsp; b) 78,5 cm² &nbsp; c) Omtrent 19,6 cm²',
  '<p>a) O = 2πr ≈ 2 · 3,14 · 5 = <b>31,4 cm</b>.</p><p>b) A = πr² ≈ 3,14 · 25 = <b>78,5 cm²</b>.</p><p>c) 78,5 : 4 ≈ <b>19,6 cm²</b>.</p>')
T(2, 1, 7, 'statistikk', 1, '25 elever svarte på hvilken idrett de liker best. Diagrammet viser svarene.<ol type="a"><li>Hvor mange prosent av elevene valgte fotball?</li><li>Hvilket diagram passer best for å vise andelene? Begrunn svaret.</li></ol>',
  'a) 36 % &nbsp; b) Sektordiagram', '<p>a) 9 av 25 = 9/25 = 36/100 = <b>36 %</b>.</p><p>b) Et <b>sektordiagram</b> viser hvor stor del hver gruppe er av helheten.</p>', fig_bars())
T(2, 2, 8, 'okonomi', 2, 'En mobil koster 9 000 kr kontant. Du kan også betale 450 kr per måned i 24 måneder, pluss et etableringsgebyr på 300 kr.<ol type="a"><li>Hvor mye koster mobilen til sammen med avbetaling?</li><li>Hvor mange prosent dyrere er det å betale med avbetaling?</li></ol>', 'a) 11 100 kr &nbsp; b) Omtrent 23,3 %',
  '<p>a) 450 · 24 + 300 = <b>11 100 kr</b>.</p><p>b) Forskjellen er 2 100 kr. 2 100 : 9 000 ≈ 0,233, altså <b>23,3 %</b> dyrere.</p>')
T(2, 2, 9, 'funksjoner', 3, 'Høyden til en ball er gitt ved h(t) = −5t² + 20t + 1,5, der h er høyden i meter og t er tiden i sekunder etter at ballen ble kastet.<ol type="a"><li>Tegn grafen til h for 0 ≤ t ≤ 4,1.</li><li>Hvor høyt kommer ballen, og når skjer det?</li><li>Når treffer ballen bakken?</li></ol>',
  'b) 21,5 m etter 2 s &nbsp; c) Etter omtrent 4,07 s',
  '<p>a) Bruk en graftegner. Grafen er en parabel som vender nedover.</p><p>b) Toppunktet er (2, 21,5). Ballen kommer <b>21,5 m</b> opp etter <b>2 sekunder</b>.</p><p>c) Nullpunktet til h for t &gt; 0 er t ≈ <b>4,07 s</b>.</p>')
T(2, 2, 10, 'geometri', 3, 'En vanntank har form som en sylinder. Diameteren er 1,2 m og høyden er 1,5 m.<ol type="a"><li>Hvor mange liter rommer tanken?</li><li>Tanken fylles med 25 liter per minutt. Hvor lang tid tar det å fylle den?</li></ol>', 'a) Omtrent 1 696 liter &nbsp; b) Omtrent 68 minutter',
  '<p>a) r = 0,6 m. V = π · 0,6² · 1,5 ≈ 1,696 m³ ≈ <b>1 696 liter</b>. (Med π ≈ 3,14 blir svaret omtrent 1 696 liter også.)</p><p>b) 1 696 : 25 ≈ 67,9 minutter, altså omtrent <b>1 time og 8 minutter</b>.</p>')
T(2, 2, 11, 'sannsynlighet', 2, 'En PIN-kode består av fire sifre fra 0 til 9.<ol type="a"><li>Hvor mange ulike PIN-koder finnes det?</li><li>Hvor mange PIN-koder har fire ulike sifre?</li><li>En kode velges tilfeldig. Hva er sannsynligheten for at alle sifrene er ulike?</li></ol>', 'a) 10 000 &nbsp; b) 5 040 &nbsp; c) 0,504',
  '<p>a) 10 · 10 · 10 · 10 = <b>10 000</b>.</p><p>b) 10 · 9 · 8 · 7 = <b>5 040</b>.</p><p>c) 5 040 : 10 000 = <b>0,504</b>, altså litt over 50 %.</p>')
T(2, 2, 12, 'statistikk', 3, 'To klasser hadde samme prøve (maks 35 poeng).<p class="eks-data">Klasse A: 12, 15, 18, 20, 20, 21, 22, 24, 25, 28<br>Klasse B: 8, 14, 19, 20, 21, 21, 23, 26, 29, 34</p><ol type="a"><li>Finn gjennomsnitt og median for hver klasse.</li><li>Finn variasjonsbredden for hver klasse.</li><li>Hvilken klasse gjorde det best? Argumenter.</li></ol>',
  'a) A: 20,5 og 20,5. B: 21,5 og 21 &nbsp; b) A: 16, B: 26',
  '<p>a) A: Summen er 205, så gjennomsnittet er <b>20,5</b>. Medianen er (20 + 21) : 2 = <b>20,5</b>. B: Summen er 215, så gjennomsnittet er <b>21,5</b>. Medianen er (21 + 21) : 2 = <b>21</b>.</p><p>b) A: 28 − 12 = <b>16</b>. B: 34 − 8 = <b>26</b>.</p><p>c) Klasse B har litt høyere gjennomsnitt og median, men resultatene er mer spredt. Klasse A er jevnere. Et godt svar bruker både sentralmål og spredning.</p>')
T(2, 2, 13, 'algebra', 3, 'På kino betaler 3 voksne og 2 barn til sammen 610 kr. 2 voksne og 4 barn betaler til sammen 620 kr.<ol type="a"><li>Sett opp et likningssett.</li><li>Hva koster en billett for voksne og en for barn?</li></ol>', 'b) Voksen 150 kr, barn 80 kr',
  '<p>a) 3v + 2b = 610 og 2v + 4b = 620.</p><p>b) Fra den andre likningen: v = 310 − 2b. Sett inn i den første: 3(310 − 2b) + 2b = 610, som gir 930 − 4b = 610 og b = 80. Da er v = 310 − 160 = 150. Voksen: <b>150 kr</b>, barn: <b>80 kr</b>.</p><p>Kontroll: 3 · 150 + 2 · 80 = 610.</p>')
T(2, 2, 14, 'programmering', 3, 'Programmet skal avgjøre om et tall er et primtall.' + code('n = int(input("Skriv et tall: "))\ner_primtall = True\nfor d in range(2, n):\n    if n % d == 0:\n        er_primtall = False\nprint(er_primtall)') + '<ol type="a"><li>Hva skriver programmet ut når n = 7 og når n = 12?</li><li>Hva skjer når n = 1? Forklar feilen og rett den.</li><li>Forklar hvorfor det holder å teste d opp til √n.</li></ol>',
  'a) True og False &nbsp; b) Programmet skriver True, men 1 er ikke et primtall',
  '<p>a) 7 har ingen divisorer mellom 2 og 6, så programmet skriver <b>True</b>. 12 er delelig med 2, så det skriver <b>False</b>.</p><p>b) Når n = 1 kjører ikke løkka, og programmet skriver True. Men 1 er ikke et primtall. Legg til for eksempel <code>if n &lt; 2: er_primtall = False</code>.</p><p>c) Hvis n = a · b og både a og b er større enn √n, blir a · b større enn n. Minst én av faktorene må derfor være √n eller mindre.</p>')
T(2, 2, 15, 'resonnering', 3, 'Påstand: «Når du kvadrerer et oddetall og trekker fra 1, får du alltid et tall som er delelig med 8.»<ol type="a"><li>Test påstanden med tre oddetall.</li><li>Vis at påstanden alltid stemmer.</li></ol>',
  'b) (2k + 1)² − 1 = 4k(k + 1)',
  '<p>a) 3² − 1 = 8, 5² − 1 = 24 og 7² − 1 = 48. Alle er delelige med 8.</p><p>b) Et oddetall kan skrives 2k + 1. (2k + 1)² − 1 = 4k² + 4k = <b>4k(k + 1)</b>. Av to hele tall etter hverandre er ett alltid et partall, så k(k + 1) er delelig med 2. Da er 4k(k + 1) delelig med 8.</p>')

# ===== Øvingseksamen 3 =====
T(3, 1, 1, 'tall', 1, 'Ordne tallene fra minst til størst: <p class="eks-data">0,7 &nbsp; 2/3 &nbsp; 68 % &nbsp; 3/5</p>', '3/5, 2/3, 68 %, 0,7',
  '<p>Skriv alle som desimaltall: 3/5 = 0,6, 2/3 ≈ 0,667, 68 % = 0,68 og 0,7. Rekkefølgen er <b>3/5, 2/3, 68 %, 0,7</b>.</p>')
T(3, 1, 2, 'okonomi', 1, 'Sara har en timelønn på 160 kr. En måned jobber hun 12 timer. Hun betaler 15 % skatt.<ol type="a"><li>Hva er bruttolønnen hennes?</li><li>Hva får hun utbetalt?</li></ol>', 'a) 1 920 kr &nbsp; b) 1 632 kr',
  '<p>a) 160 · 12 = <b>1 920 kr</b>.</p><p>b) 15 % av 1 920 kr er 288 kr. 1 920 − 288 = <b>1 632 kr</b>.</p>')
T(3, 1, 3, 'algebra', 2, 'Regn ut når a = −2 og b = 3.<ol type="a"><li>a² + 2b</li><li>(a − b)²</li><li>3a − b²</li></ol>', 'a) 10 &nbsp; b) 25 &nbsp; c) −15',
  '<p>a) (−2)² + 2 · 3 = 4 + 6 = <b>10</b>.</p><p>b) (−2 − 3)² = (−5)² = <b>25</b>.</p><p>c) 3 · (−2) − 3² = −6 − 9 = <b>−15</b>.</p>')
T(3, 1, 4, 'funksjoner', 1, 'Grafen viser en tur Ola gikk.<ol type="a"><li>Hvor langt gikk Ola til sammen?</li><li>Hvor lenge hvilte han?</li><li>I hvilket tidsrom gikk han raskest? Hvor fort gikk han da?</li></ol>', 'a) 5,5 km &nbsp; b) 10 minutter &nbsp; c) Mellom 60 og 70 minutter, 9 km/t',
  '<p>a) Grafen ender på <b>5,5 km</b>.</p><p>b) Grafen er vannrett fra 20 til 30 minutter: <b>10 minutter</b>.</p><p>c) Grafen er brattest fra 60 til 70 minutter. Da gikk han 1,5 km på 10 minutter, som er <b>9 km/t</b>.</p>', fig_walk())
T(3, 1, 5, 'geometri', 2, 'De to trekantene er formlike. Den minste har sidene 3, 4 og 5. Den korteste siden i den største er 7,5.<ol type="a"><li>Finn de to andre sidene i den største trekanten.</li><li>Finn arealet av den minste trekanten. Hvor mange ganger større er arealet av den største?</li></ol>',
  'a) 10 og 12,5 &nbsp; b) 6, og 6,25 ganger større',
  '<p>a) Forholdet er 7,5 : 3 = 2,5. Sidene blir 4 · 2,5 = <b>10</b> og 5 · 2,5 = <b>12,5</b>.</p><p>b) Den minste er rettvinklet: A = 3 · 4 : 2 = <b>6</b>. Den største: 7,5 · 10 : 2 = 37,5. 37,5 : 6 = <b>6,25</b>, som er 2,5².</p>', fig_tri())
T(3, 1, 6, 'sannsynlighet', 2, 'Du kaster en terning to ganger.<ol type="a"><li>Hva er sannsynligheten for to seksere?</li><li>Hva er sannsynligheten for minst én sekser?</li><li>Hva er sannsynligheten for at summen blir 10?</li></ol>', 'a) 1/36 &nbsp; b) 11/36 &nbsp; c) 1/12',
  '<p>a) 1/6 · 1/6 = <b>1/36</b>.</p><p>b) P(ingen seksere) = 5/6 · 5/6 = 25/36. P(minst én) = 1 − 25/36 = <b>11/36</b>.</p><p>c) Summen 10: (4, 6), (5, 5) og (6, 4). P = 3/36 = <b>1/12</b>.</p>')
T(3, 1, 7, 'resonnering', 3, 'Undersøk uttrykket (n + 1)² − n² for noen hele tall n. Hva legger du merke til? Vis at det alltid stemmer.', 'Svaret er alltid et oddetall, 2n + 1',
  '<p>n = 1 gir 3, n = 2 gir 5, n = 3 gir 7. Det ser ut som svaret alltid er et oddetall.</p><p>(n + 1)² − n² = n² + 2n + 1 − n² = <b>2n + 1</b>. 2n er et partall, så 2n + 1 er alltid et oddetall.</p>')
T(3, 2, 8, 'okonomi', 2, 'Et par hodetelefoner koster 199 euro i Tyskland og 2 390 kr i Norge. 1 euro koster 11,70 kr.<ol type="a"><li>Hvor er hodetelefonene billigst, og hvor mye billigere er de der?</li><li>Ved hvilken eurokurs koster de det samme begge steder?</li></ol>', 'a) I Tyskland, 61,70 kr billigere &nbsp; b) Omtrent 12,01 kr per euro',
  '<p>a) 199 · 11,70 = 2 328,30 kr. I Tyskland er de <b>61,70 kr</b> billigere.</p><p>b) 2 390 : 199 ≈ <b>12,01 kr</b> per euro.</p>')
T(3, 2, 9, 'funksjoner', 3, 'En ny bil koster 400 000 kr. Verdien synker med 15 % per år.<ol type="a"><li>Hva er bilen verdt etter 3 år?</li><li>Lag en funksjon som viser verdien etter x år. Tegn grafen.</li><li>Når er bilen verdt mindre enn 100 000 kr?</li></ol>', 'a) 245 650 kr &nbsp; b) V(x) = 400 000 · 0,85ˣ &nbsp; c) Etter 9 år',
  '<p>a) 400 000 · 0,85³ = <b>245 650 kr</b>.</p><p>b) <b>V(x) = 400 000 · 0,85ˣ</b>. Grafen synker, men blir aldri 0.</p><p>c) V(8) ≈ 108 996 kr og V(9) ≈ 92 647 kr. Bilen er verdt under 100 000 kr etter <b>9 år</b>.</p>')
T(3, 2, 10, 'geometri', 3, 'En hage består av et rektangel på 12 m × 8 m og en halvsirkel på den ene kortsiden.<ol type="a"><li>Finn arealet av hagen.</li><li>Det skal settes opp gjerde rundt hele hagen. Hvor langt blir gjerdet?</li></ol>', 'a) Omtrent 121,1 m² &nbsp; b) Omtrent 44,6 m',
  '<p>a) Rektangel: 12 · 8 = 96 m². Halvsirkel med radius 4 m: π · 4² : 2 ≈ 25,1 m². Til sammen omtrent <b>121,1 m²</b>.</p><p>b) Tre sider av rektangelet: 12 + 12 + 8 = 32 m. Buen: π · 8 : 2 ≈ 12,6 m. Til sammen omtrent <b>44,6 m</b>.</p>', fig_garden())
T(3, 2, 11, 'statistikk', 2, '25 elever svarte på hvor mange søsken de har.<table class="eks-tab"><tr><th>Søsken</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>Antall elever</th><td>4</td><td>9</td><td>7</td><td>3</td><td>2</td></tr></table><ol type="a"><li>Finn gjennomsnittet.</li><li>Finn medianen.</li><li>Hvor mange prosent av elevene har 2 søsken?</li></ol>', 'a) 1,6 &nbsp; b) 1 &nbsp; c) 28 %',
  '<p>a) 0 · 4 + 1 · 9 + 2 · 7 + 3 · 3 + 4 · 2 = 40. 40 : 25 = <b>1,6</b>.</p><p>b) Medianen er verdi nummer 13. De 4 første har 0, nummer 5–13 har 1. Medianen er <b>1</b>.</p><p>c) 7 : 25 = <b>28 %</b>.</p>')
T(3, 2, 12, 'okonomi', 2, 'Klassen selger 200 lodd til 20 kr per lodd. Premiene er én premie på 1 000 kr og fem premier på 100 kr.<ol type="a"><li>Hvor stort blir overskuddet hvis alle loddene blir solgt?</li><li>Du kjøper ett lodd. Hva er sannsynligheten for å vinne noe?</li><li>Hva må et lodd koste for at overskuddet skal bli 4 000 kr?</li></ol>', 'a) 2 500 kr &nbsp; b) 3 % &nbsp; c) 27,50 kr',
  '<p>a) Inntekt: 200 · 20 = 4 000 kr. Premier: 1 000 + 500 = 1 500 kr. Overskudd: <b>2 500 kr</b>.</p><p>b) 6 av 200 lodd vinner: 6/200 = <b>3 %</b>.</p><p>c) Inntekten må bli 4 000 + 1 500 = 5 500 kr. 5 500 : 200 = <b>27,50 kr</b>.</p>')
T(3, 2, 13, 'algebra', 3, 'Tallene 1, 3, 6, 10, … kalles trekanttall.<ol type="a"><li>Finn de to neste trekanttallene.</li><li>Trekanttall nummer n er n(n + 1)/2. Kontroller formelen for n = 4.</li><li>Er 210 et trekanttall? Begrunn svaret.</li></ol>', 'a) 15 og 21 &nbsp; c) Ja, nummer 20',
  '<p>a) Differansen øker med 1 hver gang: 10 + 5 = <b>15</b> og 15 + 6 = <b>21</b>.</p><p>b) 4 · 5 : 2 = 10. Det stemmer.</p><p>c) n(n + 1)/2 = 210 gir n(n + 1) = 420 = 20 · 21. <b>Ja</b>, 210 er trekanttall nummer 20.</p>')
T(3, 2, 14, 'programmering', 2, 'Se på programmet.' + code('sum = 0\nfor i in range(1, 101):\n    if i % 3 == 0:\n        sum = sum + i\nprint(sum)') + '<ol type="a"><li>Forklar hva programmet gjør.</li><li>Hva skriver programmet ut?</li><li>Endre programmet slik at det legger sammen alle tall fra 1 til 100 som er delelige med 3 eller 5.</li></ol>', 'b) 1683 &nbsp; c) Svaret blir 2418',
  '<p>a) Programmet går gjennom tallene fra 1 til 100 og legger sammen dem som er delelige med 3.</p><p>b) 3 + 6 + … + 99 = 3 · (1 + 2 + … + 33) = 3 · 561 = <b>1683</b>.</p><p>c) Endre linje 3 til <code>if i % 3 == 0 or i % 5 == 0:</code>. Da skriver programmet ut <b>2418</b>.</p>')
T(3, 2, 15, 'resonnering', 3, 'Sidene i en kube dobles.<ol type="a"><li>Hva skjer med overflaten?</li><li>Hva skjer med volumet?</li><li>Hva skjer med overflaten og volumet hvis sidene blir k ganger så lange? Forklar.</li></ol>', 'a) 4 ganger så stor &nbsp; b) 8 ganger så stort &nbsp; c) k² og k³',
  '<p>Kall siden s. Overflaten er 6s² og volumet er s³.</p><p>a) Med siden 2s blir overflaten 6 · (2s)² = 24s², altså <b>4 ganger</b> så stor.</p><p>b) Volumet blir (2s)³ = 8s³, altså <b>8 ganger</b> så stort.</p><p>c) Overflaten blir <b>k² ganger</b> så stor, og volumet blir <b>k³ ganger</b> så stort, fordi areal har to dimensjoner og volum har tre.</p>')

assert len(O) == 45 and len({o['id'] for o in O}) == 45
for o in O: assert o['tema'] in TEMA and o['niv'] in (1, 2, 3)
json.dump(dict(tema=TEMA, oppgaver=O), open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'eks.json'), 'w'), ensure_ascii=False)
from collections import Counter
print(Counter(o['tema'] for o in O)); print(Counter(o['niv'] for o in O))
