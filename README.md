# Tender Intelligence — demo sintetic (React + TypeScript)

Demonstrație clean-room pentru analiza unui dosar de achiziție. Toate datele
sunt sintetice (`SYN-*`, cumpărători și firme „Fictiv”), iar sursele folosesc
schema `fixture://`. Nu sunt folosite date private, secrete, servicii externe
sau rețea în fluxul demo.

## Stack și arhitectură

- UI: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/), cu intrarea în [`frontend/main.tsx`](frontend/main.tsx) și componenta [`frontend/App.tsx`](frontend/App.tsx).
- State cross-component: [Redux Toolkit](https://redux-toolkit.js.org/) — [store și slice](frontend/store.ts) gestionează filtrul, selecția dosarului și evidence drawer; acțiunile sunt folosite direct de UI.
- API Python REST: [`tender_intelligence/api.py`](tender_intelligence/api.py) expune `GET /api/tenders` și `GET /api/tenders/{id}`. [Analiza criteriilor](tender_intelligence/analysis.py) și fixture-urile sunt locale.
- Teste UI: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) + [Vitest](https://vitest.dev/) în [`frontend/App.test.tsx`](frontend/App.test.tsx).
- E2E: [Playwright](https://playwright.dev/) în [`e2e/dashboard.spec.ts`](e2e/dashboard.spec.ts), rulat împotriva build-ului prin [`playwright.config.ts`](playwright.config.ts).

## Moduri de rulare

```sh
npm ci
npm run dev
```

Pentru producție statică și E2E:

```sh
VITE_DATA_MODE=static npm run build
npm run preview
npx playwright install chromium
npm run test:e2e
```

`VITE_DATA_MODE` este selectorul unic, ales la build, și acceptă `static` sau
`local`. Preview-ul de producție, E2E și GitHub Pages îl setează la `static`,
astfel încât interfața pornește direct cu date sintetice, fără request către
`/api`. Dezvoltarea locală (`npm run dev`) rămâne în modul API (`local`), iar
butonul „Schimbă” continuă să permită comutarea în UI. Build-ul scrie în
`static/` și folosește adapterul static din [`frontend/demoData.ts`](frontend/demoData.ts).
Local, aplicația poate folosi API-ul Python:

```sh
python3 -m tender_intelligence.api
```

## Verificare și publicare

[`frontend/App.test.tsx`](frontend/App.test.tsx) verifică încărcarea API-ului,
poarta blocată, filtrarea, selecția și evidence drawer. Testul Playwright verifică
aceleași interacțiuni pe viewport desktop și mobile, plus rolurile/etichetele de
bază ale UI-ului.

### Capturi reale

Imaginile sunt capturi reale ale preview-ului static, pe viewport desktop și
mobile, cu datele sintetice din demo: [`dashboard-desktop.png`](docs/screenshots/dashboard-desktop.png)
și [`dashboard-mobile.png`](docs/screenshots/dashboard-mobile.png).

Workflow-ul [CI](.github/workflows/ci.yml) rulează unittest Python, TypeScript
check, unit tests, build, Playwright și guard-ul pentru conținut sintetic, apoi
`npm audit --audit-level=high`. Workflow-ul de [GitHub Pages](.github/workflows/pages.yml)
rămâne activ și publică directorul `static/`.

Nu sunt incluse GraphQL, Jest, Next.js sau React Native.
