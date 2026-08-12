# Tender Intelligence

Tender Intelligence este un cockpit pentru furnizori: descoperă proceduri pe coduri CPV, leagă cerinţe şi dovezi, compară oferte şi construieşte dosare pentru decizia GO / WATCH / NO-GO. Dosarele cumpărătorilor şi companiilor afişează numai date derivate din istoricul sintetic disponibil.

## Ediţia publică

Cele 18 proceduri, companii, cumpărători, oferte şi analize sunt sintetice şi marcate SYN/Fictiv/Exemplu. Sunt 12 proceduri active (Publicată, Clarificări, Evaluare) şi 6 istorice (Finalizată, Anulată, Eşuată). Nu sunt prezentate drept statistici sau fapte de piaţă. Codurile CPV sunt taxonomie publică; documentele folosesc surse locale `fixture://`.

Sursa comună este [`shared/tenders.json`](shared/tenders.json), consumată de UI şi de adaptorul Python. Toate valorile sunt în MDL.

## Limite

Produsul complet poate adăuga import autorizat, OCR, analiză documentară, căutare persistentă şi colaborare. Această ediţie nu conţine documente reale sau contacte, nu face import live şi păstrează fluxul local în `localStorage`.

## Rulare

```sh
npm ci
npm run check
npm test -- --run
npm run build
python -m unittest discover -s tests -v
```

UI-ul este în [`frontend/App.tsx`](frontend/App.tsx), iar API-ul local Python în [`tender_intelligence/`](tender_intelligence/).
