import json,os,re,sys
SCR='/tmp/claude-0/-home-claude/eb9f38cb-336c-51d2-a47b-b55e03dce7a7/scratchpad'
acts=[]
for g in ('8','9','10'):
    f=f'{SCR}/jt/acts/acts{g}.json'
    if os.path.exists(f): acts+=json.load(open(f))
p=f'{SCR}/matematikk8.html'; s=open(p).read()
s=re.sub(r'/\*ACTSSTART\*/.*?/\*ACTSEND\*/', lambda m:'/*ACTSSTART*/'+json.dumps(acts,ensure_ascii=False)+'/*ACTSEND*/', s, flags=re.S)
open(p,'w').write(s); print(len(acts),'aktiviteter')
