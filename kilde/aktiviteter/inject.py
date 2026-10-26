import json,os,re,sys
SCR='/tmp/claude-0/-home-claude/eb9f38cb-336c-51d2-a47b-b55e03dce7a7/scratchpad'
acts=[]
for g in ('8','9','10'):
    f=f'{SCR}/jt/acts/acts{g}.json'
    if os.path.exists(f): acts+=json.load(open(f))
amap={}
af=f'{SCR}/jt/acts/assets.txt'
if os.path.exists(af):
    for line in open(af):
        if line.strip(): k,v=line.split(); amap[k]='/_blob/'+v
for a in acts:
    if a['id'] in amap: a['pdf']=amap[a['id']]
own=[a for a in acts if a.get('own')]
missing=[a['id'] for a in own if 'pdf' not in a]
print('mangler asset:',missing)
p=f'{SCR}/matematikk8.html'; s=open(p).read()
s=re.sub(r'/\*ACTSSTART\*/.*?/\*ACTSEND\*/', lambda m:'/*ACTSSTART*/'+json.dumps(acts,ensure_ascii=False)+'/*ACTSEND*/', s, flags=re.S)
open(p,'w').write(s); print(len(acts),'aktiviteter')
