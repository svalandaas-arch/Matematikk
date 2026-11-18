# Brettspill

Lager brettspillene i aktiviteter/ (A4 liggende, 6 x 6, fire på rad).

1. `npm i @fontsource/bricolage-grotesque @fontsource/inter playwright` i denne mappa
2. `python3 gen.py` lager out/<id>.html og skriver ut hvor stor del av kastene som gir minst én mulig rute
3. `node pdf.js` lager PDF-ene og varsler om tekst som ikke får plass
4. `python3 integrate.py` kopierer PDF-ene til aktiviteter/, lager forhbs.jpg og oppdaterer BRETT i index.html

Terningduellen og Brøkjakten er lærerens egne PDF-er og kopieres inn som de er.
