# Tender Intelligence — demo sintetic

Demonstrație locală, clean-room, pentru analiza unui dosar de achiziție. Toate
înregistrările sunt evident fictive (`SYN-*`, cumpărători și firme „Fictiv”);
nu există date de producție, documente reale, contacte, identificatori reali,
afirmații guvernamentale, rețea sau LLM.

## Pornire

Necesită Python 3.12 și folosește doar biblioteca standard:

```sh
python -m tender_intelligence.api
```

Comanda servește și UI-ul live la aceeași origine: `http://127.0.0.1:8000/`.
API-ul este intenționat minimal și local.

## Ce demonstrează

- filtrarea listei și detaliul unei licitații;
- comparația exactă a trei oferte;
- completitudinea documentelor și poarta blocată la 4/5, pregătită la 5/5;
- afirmație citată cu ID-uri de dovezi, sursă, pagină, offset, încredere și
  incertitudine;
- escape pentru text și allowlist pentru schemele `fixture://`.

Verificarea CI compilează Python, rulează testele unittest, caută URL-uri/date
reale în conținut și verifică sintaxa JavaScript. Nu sunt incluse screenshot-uri.
