# Forklaringsvideoer

Videoene i `video/` lages ved å filme de trinnvise modellene på nettsiden og legge på tale.

## Slik lages en video

1. **Manus** (`specs<trinn>.json`): én oppføring per delkapittel.
   ```json
   {"tid": "datasett", "m": "k9freq", "title": "Data og datasett",
    "segs": [{"st": [0], "say": "Det stemmen sier mens steg 0 vises."},
             {"st": [1, 2], "say": "Det stemmen sier mens steg 1 og 2 vises etter hverandre."}]}
   ```
   - `tid`: id-en til delkapitlet. `m`: modellen. `st`: hvilke steg i modellen som vises i segmentet (0 = første bilde, tallet er antall trykk på «Neste»).
   - Valgfritt: `v` (verdier til modellens `load`), `load`/`click` på et segment, `row: true` for bred visning, `slutt` for egen sluttreplikk.
   - `specs8.json` er manusene til 8. trinn og kan brukes som eksempel.
2. **Se hva modellene viser**: `node kilde/video/modeller.js 9` skriver ut alle delkapitlene på trinnet med modell og teksten på hvert steg. Tallene er de samme hver gang (fast frø), og de samme tallene brukes når bildene tegnes.
3. **Bilder**: `node kilde/video/render.js kilde/video/specs9.json [tid ...]` → `kilde/video/ut/<tid>/`.
4. **Tale og video**: `python3 kilde/video/lag.py kilde/video/specs9.json [tid ...] --tts edge` → `video/<tid>.mp4` og `video/<tid>.jpg`.
   - `--tts edge`: gratis nevral norsk stemme (`pip install edge-tts`), velg stemme med `--stemme nb-NO-FinnNeural` eller `nb-NO-PernilleNeural`.
   - `--tts elevenlabs`: bruker miljøvariablene `ELEVENLABS_API_KEY` og `ELEVENLABS_VOICE_ID`.
   - `--tts stille`: uten tale, for å teste bilder og flyt.
   - Lydklipp gjenbrukes når teksten er uendret, så bare endrede segmenter lages på nytt.
5. **Vis videoen på nettsiden**: legg `tid` til i listen `const VIDS=[...]` i `index.html`.

Krever Node med `playwright` (og Chromium), Python 3 og `ffmpeg`.
