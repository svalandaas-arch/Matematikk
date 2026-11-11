#!/usr/bin/env python3
"""Lager tale og setter sammen videoer.

  python3 kilde/video/lag.py kilde/video/specs9.json [tid ...] --tts edge|elevenlabs|stille

Krever at bildene er tegnet først (node kilde/video/render.js ...). Talen lages setning for setning
(ett lydklipp per segment), så bildene byttes nøyaktig når stemmen begynner på neste del.
Resultat: video/<tid>.mp4 og video/<tid>.jpg i roten av repoet.

--tts edge        Gratis nevral norsk stemme (pip install edge-tts). Stemme: --stemme nb-NO-FinnNeural
--tts elevenlabs  Bruker miljøvariablene ELEVENLABS_API_KEY og ELEVENLABS_VOICE_ID
--tts stille      Ingen tale, bare stillhet med riktig lengde (for å teste bilder og flyt)
"""
import argparse, asyncio, hashlib, json, os, subprocess, sys, urllib.request
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(os.path.dirname(HERE)); UT=os.path.join(HERE,'ut'); VID=os.path.join(ROOT,'video')
LEAD, GAP, TAIL = 0.5, 0.8, 1.5   # stillhet før første ord, mellom segmenter og etter siste ord (sekunder)
SLUTT='Prøv selv i modellen på nettstedet!'

def run(cmd): r=subprocess.run(cmd,capture_output=True,text=True); return r
def dur(f):
    try: return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]).decode())
    except Exception: return 0.0

def tts(text,out,a):
    if a.tts=='stille':
        r=run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','anullsrc=r=44100:cl=mono','-t',f'{max(1.0,len(text)*0.065):.2f}','-q:a','9',out])
        if r.returncode: raise RuntimeError(r.stderr[-300:])
    elif a.tts=='edge':
        import edge_tts
        asyncio.run(edge_tts.Communicate(text, a.stemme, rate=a.fart).save(out))
    elif a.tts=='elevenlabs':
        key=os.environ.get('ELEVENLABS_API_KEY'); vid=os.environ.get('ELEVENLABS_VOICE_ID')
        if not key or not vid: sys.exit('Sett miljøvariablene ELEVENLABS_API_KEY og ELEVENLABS_VOICE_ID først.')
        body=json.dumps({'text':text,'model_id':a.modell,'voice_settings':{'stability':0.5,'similarity_boost':0.75}}).encode()
        req=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128',data=body,headers={'xi-api-key':key,'Content-Type':'application/json','Accept':'audio/mpeg'})
        with urllib.request.urlopen(req,timeout=120) as r, open(out,'wb') as f: f.write(r.read())

def clip(text,d,i,a):
    """Lager (eller gjenbruker) lydklipp nr. i. Gjenbrukes når tekst, stemme og innstillinger er uendret."""
    key=hashlib.sha1(json.dumps([text,a.tts,a.stemme,a.fart,a.modell,os.environ.get('ELEVENLABS_VOICE_ID','')]).encode()).hexdigest()[:16]
    mp3=os.path.join(d,f'a{i:02d}.mp3'); tag=os.path.join(d,f'a{i:02d}.key'); wav=os.path.join(d,f'a{i:02d}.wav')
    if not (os.path.exists(mp3) and os.path.exists(tag) and open(tag).read()==key):
        tts(text,mp3,a); open(tag,'w').write(key)
    # trim stillhet i start/slutt og gjør om til likt format
    r=run(['ffmpeg','-y','-loglevel','error','-i',mp3,'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse','-ar','44100','-ac','1',wav])
    if r.returncode or not os.path.exists(wav) or dur(wav)<0.2:
        r=run(['ffmpeg','-y','-loglevel','error','-i',mp3,'-ar','44100','-ac','1',wav])
        if r.returncode: raise RuntimeError(r.stderr[-300:])
    return wav

def build(s,a):
    tid=s['tid']; d=os.path.join(UT,tid)
    if not os.path.exists(os.path.join(d,'beats.json')): print('MANGLER BILDER',tid,'(kjør render.js først)'); return False
    beats=json.load(open(os.path.join(d,'beats.json')))
    frames=sorted(f for f in os.listdir(d) if f.startswith('f') and f.endswith('.png') and f not in('f00-title.png','f99-end.png'))
    assert len(frames)==len(beats),(tid,len(frames),len(beats))
    texts=[s['title']+'.']+[g['say'] for g in s['segs']]+[s.get('slutt',SLUTT)]
    wavs=[clip(t,d,i,a) for i,t in enumerate(texts)]; D=[dur(w) for w in wavs]
    # tidslinje for lyden: LEAD, klipp0, GAP, klipp1, GAP, ...
    start=[]; t=LEAD
    for x in D: start.append(t); t+=x+GAP
    total=t-GAP+TAIL
    # lydspor
    lst=os.path.join(d,'lyd.txt'); sil=lambda n,sec: (run(['ffmpeg','-y','-loglevel','error','-f','lavfi','-i','anullsrc=r=44100:cl=mono','-t',f'{sec}',os.path.join(d,n)]), os.path.join(d,n))[1]
    lead=sil('_lead.wav',LEAD); gap=sil('_gap.wav',GAP); tail=sil('_tail.wav',TAIL)
    with open(lst,'w') as L:
        L.write(f"file '{lead}'\n")
        for i,w in enumerate(wavs): L.write(f"file '{w}'\n"+(f"file '{gap}'\n" if i<len(wavs)-1 else ''))
        L.write(f"file '{tail}'\n")
    voice=os.path.join(d,'voice.wav'); r=run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i',lst,'-c','copy',voice])
    if r.returncode: print('LYDFEIL',tid,r.stderr[-300:]); return False
    # tidslinje for bildene: bildet byttes 0,3 s før stemmen starter på segmentet
    tl=[('f00-title.png',0.0)]
    for gi in range(len(s['segs'])):
        a0=start[gi+1]; b0=start[gi+2]-GAP; idx=[k for k,bt in enumerate(beats) if bt['gi']==gi]; n=len(idx)
        for j,k in enumerate(idx): tl.append((frames[k], max(0,a0-0.3) if j==0 else a0+j*(b0-a0)/n))
    tl.append(('f99-end.png',max(0,start[-1]-0.3)))
    vl=os.path.join(d,'list.txt')
    with open(vl,'w') as L:
        for i,(f,t0) in enumerate(tl):
            nt=tl[i+1][1] if i+1<len(tl) else total
            L.write(f"file '{os.path.join(d,f)}'\nduration {nt-t0:.3f}\n")
        L.write(f"file '{os.path.join(d,tl[-1][0])}'\n")
    os.makedirs(VID,exist_ok=True); tmp=os.path.join(VID,f'.{tid}.tmp.mp4'); out=os.path.join(VID,f'{tid}.mp4')
    r=run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i',vl,'-i',voice,'-filter_complex','[0:v]fps=30,format=yuv420p[v]','-map','[v]','-map','1:a','-c:v','libx264','-preset','medium','-crf','22','-tune','stillimage','-c:a','aac','-b:a','128k','-t',f'{total:.2f}','-movflags','+faststart',tmp])
    if r.returncode: print('VIDEOFEIL',tid,r.stderr[-300:]); return False
    os.replace(tmp,out)
    run(['ffmpeg','-y','-loglevel','error','-i',os.path.join(d,'f00-title.png'),'-q:v','4',os.path.join(VID,f'{tid}.jpg')])
    print('ok',tid,f'{total:.1f} s',len(tl),'bilder',os.path.getsize(out)//1024,'kB'); return True

if __name__=='__main__':
    ap=argparse.ArgumentParser(); ap.add_argument('specs'); ap.add_argument('tids',nargs='*'); ap.add_argument('--tts',default='edge',choices=['edge','elevenlabs','stille'])
    ap.add_argument('--stemme',default='nb-NO-FinnNeural'); ap.add_argument('--fart',default='-6%'); ap.add_argument('--modell',default='eleven_multilingual_v2')
    a=ap.parse_args(); S=json.load(open(a.specs)); bad=0
    for s in S:
        if a.tids and s['tid'] not in a.tids: continue
        try:
            if not build(s,a): bad+=1
        except Exception as e: print('FEIL',s['tid'],e); bad+=1
    print('alt ok' if not bad else f'FEIL: {bad}'); sys.exit(1 if bad else 0)
