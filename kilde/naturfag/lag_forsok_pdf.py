"""Lager utskriftsvennlige elevark (PDF) for alle forsøk i forsøksbanken."""
import json, re, sys, os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table,
                                TableStyle, KeepTogether, Flowable)

F = '/usr/share/fonts/truetype/dejavu/'
pdfmetrics.registerFont(TTFont('Sans', F + 'DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('Sans-B', F + 'DejaVuSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Sans-I', F + 'DejaVuSans-Oblique.ttf'))
from reportlab.pdfbase.pdfmetrics import registerFontFamily
registerFontFamily('Sans', normal='Sans', bold='Sans-B', italic='Sans-I', boldItalic='Sans-B')

INK = HexColor('#14241C'); PEN = HexColor('#1E6B4A'); MUTED = HexColor('#56685E')
LINE = HexColor('#C9D6CC'); SOFT = HexColor('#EEF5F0'); RED = HexColor('#C2362B'); REDSOFT = HexColor('#FBEDEB')

st = {
 'eyebrow': ParagraphStyle('e', fontName='Sans', fontSize=8.5, textColor=MUTED, leading=11),
 'h1': ParagraphStyle('h1', fontName='Sans-B', fontSize=20, leading=24, textColor=INK, spaceAfter=2),
 'h2': ParagraphStyle('h2', fontName='Sans-B', fontSize=11.5, leading=15, textColor=PEN, spaceBefore=8, spaceAfter=4),
 'p': ParagraphStyle('p', fontName='Sans', fontSize=10, leading=14, textColor=INK),
 'small': ParagraphStyle('s', fontName='Sans', fontSize=8.5, leading=11, textColor=MUTED),
 'cell': ParagraphStyle('c', fontName='Sans', fontSize=9.5, leading=12.5, textColor=INK),
 'cellb': ParagraphStyle('cb', fontName='Sans-B', fontSize=9.5, leading=12.5, textColor=INK),
}

def clean(t):
    t = re.sub(r'<[^>]+>', '', t)
    return t.replace('&', '&amp;').replace('<', '&lt;')

class Lines(Flowable):
    """Skrivelinjer"""
    def __init__(self, n, w=None, gap=7.5*mm, indent=0):
        super().__init__(); self.n = n; self.gap = gap; self.w0 = w; self.indent = indent
    def wrap(self, aw, ah):
        self.w = self.w0 or aw; return self.w, self.n * self.gap
    def draw(self):
        c = self.canv; c.setStrokeColor(LINE); c.setLineWidth(.6)
        for i in range(self.n):
            y = self.n * self.gap - (i + 1) * self.gap + 1
            c.line(self.indent, y, self.w, y)

class Grid(Flowable):
    """Rutenett til graf"""
    def __init__(self, h=55*mm, step=5*mm):
        super().__init__(); self.h = h; self.step = step
    def wrap(self, aw, ah):
        self.w = aw; return aw, self.h
    def draw(self):
        c = self.canv; c.setStrokeColor(HexColor('#DCE6DE')); c.setLineWidth(.35)
        x = 0
        while x <= self.w + .1: c.line(x, 0, x, self.h); x += self.step
        y = 0
        while y <= self.h + .1: c.line(0, y, self.w, y); y += self.step
        c.setStrokeColor(INK); c.setLineWidth(1.1)
        c.line(10*mm, 8*mm, 10*mm, self.h - 3*mm); c.line(10*mm, 8*mm, self.w - 3*mm, 8*mm)

def boxed(flow, bg, border, pad=7):
    t = Table([[flow]], colWidths=['100%'])
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), bg), ('BOX', (0, 0), (-1, -1), 1, border),
                           ('LEFTPADDING', (0, 0), (-1, -1), pad), ('RIGHTPADDING', (0, 0), (-1, -1), pad),
                           ('TOPPADDING', (0, 0), (-1, -1), pad), ('BOTTOMPADDING', (0, 0), (-1, -1), pad)]))
    return t

def make(lab, out):
    L = lab['lab']; W = A4[0] - 36*mm
    meta = f"Naturfag {lab['grade']}. trinn · Kapittel {lab['chnum']}: {clean(lab['chtitle'])}" + (f" · {clean(lab['topic'])}" if lab['topic'] else '')

    def page(c, d):
        c.saveState()
        c.setFont('Sans', 7.5); c.setFillColor(MUTED)
        c.drawString(18*mm, 10*mm, f"{lab['type']} · {clean(L['title'])}")
        c.drawRightString(A4[0] - 18*mm, 10*mm, f"Side {d.page}")
        c.setStrokeColor(PEN); c.setLineWidth(3); c.line(18*mm, A4[1] - 12*mm, A4[0] - 18*mm, A4[1] - 12*mm)
        c.restoreState()

    doc = BaseDocTemplate(out, pagesize=A4, leftMargin=18*mm, rightMargin=18*mm, topMargin=17*mm, bottomMargin=16*mm,
                          title=clean(L['title']), author='Naturfag 8.–10. trinn')
    doc.addPageTemplates([PageTemplate(frames=[Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='f')], onPage=page)])
    s = []
    s.append(Paragraph(meta + f" · ca. {lab['min']} min", st['eyebrow']))
    s.append(Paragraph(clean(L['title']), st['h1']))
    s.append(Spacer(1, 6))

    s.append(Paragraph('Dette trenger du', st['h2']))
    ut = [[Paragraph('•', st['p']), Paragraph(clean(x), st['p'])] for x in L['utstyr']]
    t = Table(ut, colWidths=[5*mm, W - 5*mm]); t.setStyle(TableStyle([('LEFTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 1.5), ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5), ('VALIGN', (0, 0), (-1, -1), 'TOP')]))
    s.append(t)

    risk = [Paragraph('<b><font color="#C2362B">Sikkerhet</font></b>', st['p']), Spacer(1, 3)]
    risk += [Paragraph('• ' + clean(x), st['p']) for x in L['risiko']]
    s += [Spacer(1, 10), boxed(risk, REDSOFT, RED)]

    s.append(Spacer(1, 4))
    s.append(Paragraph('Slik gjør du det', st['h2']))
    big = ParagraphStyle('pb', parent=st['p'], fontSize=10.5, leading=15)
    pr = [[Paragraph(f'<b>{i+1}</b>', ParagraphStyle('n', parent=big, textColor=white, alignment=1)), Paragraph(clean(x), big)] for i, x in enumerate(L['steg'])]
    t = Table(pr, colWidths=[8*mm, W - 8*mm])
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (0, -1), PEN), ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LINEBELOW', (0, 0), (-1, -1), 4, white),
                           ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4), ('LEFTPADDING', (1, 0), (1, -1), 8)]))
    s.append(t)
    doc.build(s)

if __name__ == '__main__':
    labs = json.load(open(sys.argv[1])); outdir = sys.argv[2]; os.makedirs(outdir, exist_ok=True)
    for lab in labs:
        make(lab, os.path.join(outdir, f"forsok-{lab['id']}.pdf"))
    print(len(labs), 'PDF-er laget')
