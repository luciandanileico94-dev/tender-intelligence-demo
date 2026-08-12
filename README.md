# Tender Intelligence — demo sintetic (React + TypeScript)

Demonstrație locală, clean-room, pentru analiza unui dosar de achiziție. Toate
înregistrările sunt evident fictive (`SYN-*`, cumpărători și firme „Fictiv”);
nu există date de producție, documente reale, contacte, identificatori reali,
afirmații guvernamentale, rețea sau LLM.

## Stack

React 19, TypeScript, Vite și CSS fără UI kit; API-ul este Python 3.12 stdlib.
Setul de date este fixture local, iar fiecare sursă este `fixture://`.

## Arhitectură și flux de date

În local, procesul Python servește `static/` și răspunde la `/api/tenders` și
`/api/tenders/{id}`. React consumă API-ul și afișează badge-ul **API local**.
Pe GitHub Pages build-ul este complet static: adapterul explicit din
`frontend/demoData.ts` furnizează aceleași fixtures, iar badge-ul spune
**Demo static**. Nu există fallback ascuns între moduri.

## Pornire

Necesită Python 3.12 și folosește doar biblioteca standard:

```sh
python -m tender_intelligence.api
```

Comanda servește UI-ul build-uit la `http://127.0.0.1:8000/`. Pentru dezvoltare
React, în alt terminal: `npm ci && npm run dev`.

## Criteriu P1 → fișier → test

| Criteriu | Implementare | Verificare |
|---|---|---|
| API local / Demo static vizibil | `frontend/App.tsx`, `demoData.ts` | `frontend/App.test.tsx` |
| poartă 4/5 și 5/5 | `tender_intelligence/analysis.py` | `tests/test_core.py` |
| bid comparison + empty state | `frontend/App.tsx` | `frontend/App.test.tsx` + build |
| sursă, pagină, offset | `claims.py`, drawer în `App.tsx` | `tests/test_core.py` |
| date sintetice și allowlist | `fixtures.py`, `security.py` | core tests + CI guard |

## Test, live demo și limitări

`./scripts/run_checks.sh` rulează compilarea Python, testele Python și React,
type-check și build-ul static. Live demo este `npm run build`, urmat de
`python3 -m tender_intelligence.api`. Nu sunt folosite date reale, documente
reale, rețea, LLM sau afirmații despre munca vreunei instituții publice.

## Ce demonstrează

- filtrarea listei și detaliul unei licitații;
- comparația exactă a trei oferte;
- completitudinea documentelor și poarta blocată la 4/5, pregătită la 5/5;
- afirmație citată cu ID-uri de dovezi, sursă, pagină, offset, încredere și
  incertitudine;
- escape pentru text și allowlist pentru schemele `fixture://`.

Verificarea CI compilează Python, rulează testele unittest, caută URL-uri/date
reale în conținut și verifică sintaxa JavaScript. Nu sunt incluse screenshot-uri.
