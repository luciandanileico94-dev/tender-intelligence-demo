# Tender Intelligence

Tender Intelligence este un cockpit intern pentru furnizori care caută, compară și pregătesc participarea la achiziții publice din orice domeniu CPV. Dashboard-ul prioritizează acțiunea următoare, radarul arată oportunități active, iar fiecare procedură leagă cerințele, documentele, ofertele, tiparele de preț și decizia GO / WATCH / NO-GO de dovezi citabile. Dossiers interactive pentru cumpărători și companii arată recurența, participările, concurenții și istoricul procedurilor.

## Ce oferă produsul

- detectare timpurie a oportunităților pe cod și denumire CPV;
- mapare a cerințelor și documentelor cu evidența sursei;
- comparație competitor / preț / calitate și identificarea riscului de demping;
- tipare de cumpărare și recurență la buyer;
- prioritizare explicabilă GO / WATCH / NO-GO;
- task-uri, leads și submissions urmărite în pipeline;
- trasabilitate pentru fiecare concluzie.

## Ediție publică și limite

Această EDIȚIE PUBLICĂ este un build static React + TypeScript + Redux. Toate companiile, cumpărătorii, procedurile, ofertele și rezultatele sunt sintetice și marcate SYN/Fictiv/Exemplu; sursele sunt exclusiv `fixture://`. Codurile și denumirile CPV sunt taxonomie oficială publică, singurele date reale folosite.

Produsul complet poate integra ingestion, OCR, analiză documentară, căutare persistentă, colaborare și surse autorizate. Ediția publică nu face ingestion live, nu conține documente sau contacte reale, nu execută scrieri de rețea și păstrează pipeline-ul doar în `localStorage`. Nu sunt prezentate statistici reale de piață.

## Arhitectură

- UI: React + TypeScript + Redux Toolkit + Vite în [`frontend/App.tsx`](frontend/App.tsx).
- Date sintetice concise și derivări: [`frontend/demoData.ts`](frontend/demoData.ts).
- Analiză și adapter Python păstrate pentru verificări: [`tender_intelligence/`](tender_intelligence/).
- Teste: Vitest / React Testing Library, Playwright desktop și mobile, pytest.

## Rulare și verificări

```sh
npm ci
npm run check
npm test -- --run
npm run build
npm run test:e2e
pytest -q
```

Capturile din `docs/screenshots/` sunt artefacte existente ale clonei. Pentru capturi production proaspete, pornește `npm run build && npm run preview`, apoi folosește Playwright în mediul browser disponibil.

## Igiena datelor

Repository-ul nu conține companii reale, contacte, ID-uri reale, documente reale, secrete sau surse HTTP. ID-urile sunt `SYN-*` / `BUY-SYN-*` / `SUP-SYN-*`, iar numele de business conțin Fictiv sau Exemplu.
