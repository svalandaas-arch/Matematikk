import json
B='https://matematikk.net/res/eksamen/10-kl/opgLK20/'
DOK=[
 dict(id='v25',navn='Våren 2025',dato='20.05.2025',deler=[(1,B+'ut_v25.pdf'),(2,B+'ut_v25.pdf')]),
 dict(id='v23',navn='Våren 2023',dato='22.05.2023',deler=[(2,B+'ut_v23_del2.pdf')]),
 dict(id='v22',navn='Våren 2022',dato='24.05.2022',deler=[(1,B+'ut_v22_del1.pdf'),(2,B+'ut_v22_del2.pdf')]),
]
# (eksamen, del, nr, side, [temaer], beskrivelse i egne ord)
R=[
 ('v25',1,1,3,['statistikk'],'Vurdere påstander om lunsjvaner ut fra et diagram'),
 ('v25',1,2,4,['tall'],'Treffprosent ved skudd, og hvor mange treff som trengs'),
 ('v25',1,3,5,['algebra','okonomi'],'Finne prisen på én baguette ut fra to kjøp i kantina'),
 ('v25',1,4,6,['funksjoner'],'Stigningstallet til en graf for drivstofforbruk'),
 ('v25',1,5,7,['geometri'],'Foreslå mål på en koffert og regne ut volum i liter'),
 ('v25',1,6,8,['algebra'],'Kontrollere en løsning og finne flere løsninger av en likning'),
 ('v25',1,7,9,['programmering','geometri'],'Forklare et program og finne resultatet for en trekant'),
 ('v25',2,1,3,['resonnering','funksjoner','programmering'],'Figurmønster: tegne, lage tabell og finne formel'),
 ('v25',2,2,4,['okonomi','tall'],'Sammenligne fire tilbud på sokker'),
 ('v25',2,3,5,['funksjoner','okonomi'],'Forklare en spareformel og regne ut saldo etter 15 år'),
 ('v25',2,4,6,['sannsynlighet'],'Vurdere om spill med terning og kuler er rettferdige'),
 ('v25',2,5,7,['statistikk'],'Sentralmål og spredning for mobilbruk, med diagram'),
 ('v25',2,6,8,['funksjoner','okonomi'],'Grafer for tre tilbud på festlokale, og når hvert lønner seg'),
 ('v25',2,7,9,['statistikk','resonnering'],'Treningsvaner i et diagram, og vurdere to elevers modeller'),
 ('v25',2,8,10,['resonnering','algebra'],'Påstander om summer av oddetall og tall etter hverandre'),
 ('v23',2,1,3,['funksjoner','okonomi'],'Tolke grafer for leie av elsparkesykkel hos to firmaer'),
 ('v23',2,2,4,['tall','okonomi'],'Sammenligne fire tilbud på smoothie'),
 ('v23',2,3,5,['statistikk','resonnering'],'Gjennomsnittslønn, og finne antall elever fra et nytt gjennomsnitt'),
 ('v23',2,4,6,['geometri','resonnering'],'Vurdere en elevs metode for arealet av en halvsirkel'),
 ('v23',2,5,7,['programmering','sannsynlighet'],'Forklare en terningsimulering og antall kast'),
 ('v23',2,6,8,['tall','okonomi'],'Fast beløp eller beløp som dobles hver dag i to uker'),
 ('v23',2,7,9,['resonnering','algebra'],'Utforske og finne en generell formel for et blått areal'),
 ('v23',2,8,10,['okonomi','algebra'],'Modellere hva det koster å eie en brukt mopedbil i to år'),
 ('v22',1,1,3,['algebra'],'Finne prisen på én vare ut fra to samlede kjøp'),
 ('v22',1,2,4,['funksjoner'],'Sant eller usant ut fra en graf for bremselengde'),
 ('v22',1,3,5,['geometri','algebra'],'Lengde og bredde i et rektangel der bredden er dobbelt så lang'),
 ('v22',1,4,5,['geometri'],'Volumet av en eske brettet av papir (flervalg)'),
 ('v22',1,5,6,['tall'],'Vise med en figur at en multiplikasjon gir et bestemt svar'),
 ('v22',1,6,6,['okonomi','algebra'],'Velge uttrykk for samlet billettinntekt (flervalg)'),
 ('v22',1,7,7,['funksjoner'],'Antall bakterier etter to dager med 10 % vekst per dag'),
 ('v22',1,8,8,['funksjoner'],'Koble fire funksjonsuttrykk til riktig graf'),
 ('v22',2,1,3,['funksjoner','okonomi'],'Tolke en lineær funksjon for leie av lokale'),
 ('v22',2,2,3,['geometri'],'Omkretsen av et kvadrat satt sammen av rektangler'),
 ('v22',2,3,4,['sannsynlighet'],'Begrunne at sannsynligheten for partallssum er 40 %'),
 ('v22',2,4,4,['algebra'],'Tegne figurer i et mønster ut fra en formel'),
 ('v22',2,5,5,['funksjoner'],'Begrunne at stigningstallet til en graf er 3'),
 ('v22',2,6,5,['algebra'],'Vurdere om et steg i en likningsløsning er riktig'),
 ('v22',2,7,6,['statistikk'],'Vurdere en grafisk framstilling av klimautslipp kritisk'),
 ('v22',2,8,7,['programmering','geometri'],'Forklare et program og tegne figuren det lager'),
 ('v22',2,9,8,['tall','resonnering'],'Utforske og generalisere et mønster med kvadrattall'),
 ('v22',2,10,9,['okonomi','resonnering'],'Velge mobilabonnement ut fra en prisoversikt'),
]
url={(d['id'],p):u for d in DOK for p,u in d['deler']}
OFF={('v25',2):12}
O=[dict(id=f'{e}-{dl}-{nr}',eks=e,del_=dl,nr=nr,side=s,tema=t,besk=b,url=url[(e,dl)]+f'#page={s+OFF.get((e,dl),0)}') for e,dl,nr,s,t,b in R]
assert len({o['id'] for o in O})==len(O)
json.dump(dict(dok=[dict(id=d['id'],navn=d['navn'],dato=d['dato'],deler=[dict(del_=p,url=u) for p,u in d['deler']]) for d in DOK],oppg=O),open('ekte.json','w'),ensure_ascii=False)
from collections import Counter
print(len(O),Counter(t for o in O for t in o['tema']))
