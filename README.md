# Tender Intelligence · demo static

Aceasta este o demonstrație publică, clean-room, a unui flux privat de analiză a unei oportunități de achiziție. Produsul complet poate centraliza informații publice și documente de ofertă, poate ajuta la revizuirea documentelor și OCR, extragerea cerințelor, legarea afirmațiilor de dovezi și analiza ofertanților, premiilor și riscurilor.

## Scopul demo-ului

Demo-ul urmărește un singur caz românesc sintetic, post-submission:

1. În spațiul „Astăzi”, analistul vede o oportunitate cu fit ridicat și acțiunea următoare.
2. Deschide dosarul și trece între „Rezumat și decizie” și „Surse și fragmente”.
3. Citește carduri cu fragmente vizibil sintetice, apoi marchează fiecare cerință ca „Verificat”, „Necesită dovadă” sau „Neîndeplinit”.
4. Compară două oferte inventate. Pregătirea, riscul și fit-ul se recalculează din starea cerințelor.
5. Lasă o notă locală și poate marca GO doar când toate cele cinci cerințe sunt verificate. NO-GO poate fi marcat oricând.

Toate numele, valorile, cerințele, fragmentele și referințele sunt inventate. Nu sunt folosite tendere, organizații, persoane, oferte sau documente reale și nu se execută crawling.

## Limitare statică exactă

Aplicația este un build Vite static fără backend, API, scraping, OCR live, AI analysis, monitorizare în timp real sau sincronizare cu surse externe. Starea analistului și decizia sunt păstrate numai în `localStorage` al browserului. Butonul „Resetează demo” șterge starea locală prin revenirea la scenariul inițial. Este o demonstrație de flux, nu un serviciu operațional.

## Stack și Vercel

React, TypeScript, Redux Toolkit, Vite, Vitest și Playwright. Build-ul folosește `frontend/index.html` ca intrare și produce directorul static `static/`. Pe Vercel se poate folosi preset-ul Vite sau comanda `npm run build`, cu directorul de output `static`. Nu este necesară o funcție server.

## Verificare locală

```bash
npm ci
npm test
npm run check
npm run build
npm run test:e2e
```

Pentru inspecție manuală: `npm run dev`, apoi deschide adresa locală afișată de Vite. Testează selectarea celor cinci stări, deschiderea unui fragment, o notă, GO, NO-GO, refresh-ul paginii și resetarea demo-ului.
