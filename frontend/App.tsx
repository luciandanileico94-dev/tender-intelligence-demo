import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { buyers, companies, cpvDomains, demoTenders, detailFor, searchEntities } from './demoData';
import type { Detail, EntityResult, Tender } from './types';
import { clearSelection, closeEvidence, openEvidence, selectTender, setQuery, type AppDispatch, type RootState } from './store';

const money = (n: number) => new Intl.NumberFormat('ro-RO').format(n) + ' MDL';
const active = demoTenders.filter((t) => ['Publicată', 'Clarificări', 'Evaluare'].includes(t.status));
const nav = ['Azi', 'Oportunități', 'Dosarele mele', 'Căutare în dovezi', 'Cumpărători', 'Companii', 'Ce oferă produsul', 'Sistem'] as const;
type Page = (typeof nav)[number];
const initialPipeline = { 'SYN-RO-26-001': 'În pregătire', 'SYN-RO-26-009': 'În pregătire', 'SYN-RO-26-013': 'Depus', 'SYN-RO-26-016': 'Depus' };

const loadPipeline = () => {
  try {
    return { ...initialPipeline, ...JSON.parse(localStorage.getItem('tender-pipeline') || '{}') } as Record<string, string>;
  } catch {
    return initialPipeline;
  }
};

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { query, selectedTenderId, evidenceIndex } = useSelector((state: RootState) => state.dashboard);
  const [page, setPage] = useState<Page>('Azi');
  const [entity, setEntity] = useState<EntityResult | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pipeline, setPipeline] = useState<Record<string, string>>(loadPipeline);
  const tender = demoTenders.find((item) => item.id === selectedTenderId);
  const detail = tender && detailFor(tender);
  const evidence = detail && evidenceIndex !== null ? detail.evidence[evidenceIndex] : null;

  const openTender = (id: string) => {
    dispatch(selectTender(id));
    setPage('Oportunități');
    setMenuOpen(false);
  };
  const go = (next: Page) => {
    setPage(next);
    setEntity(null);
    setMenuOpen(false);
    dispatch(clearSelection());
  };
  const savePipeline = (next: Record<string, string>) => {
    setPipeline(next);
    localStorage.setItem('tender-pipeline', JSON.stringify(next));
  };

  return <div className="app-shell">
    <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
      <div className="brand"><b>TI</b><span><strong>Tender Intelligence</strong><small>EDIȚIE PUBLICĂ · 2026</small></span></div>
      <nav aria-label="Navigaţie principală">
        {nav.map((item) => <button key={item} className={page === item ? 'active' : ''} onClick={() => go(item)}>{item}{item === 'Oportunități' && <em>{active.length}</em>}</button>)}
      </nav>
      <div className="sidebar-foot">● Date sintetice<small>fixture local · fără reţea</small></div>
    </aside>
    {menuOpen && <button className="sidebar-scrim" aria-label="Închide meniul" onClick={() => setMenuOpen(false)} />}
    <div className="main-wrap">
      <header className="topbar">
        <button className="menu-toggle" aria-label="Deschide meniul" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <div><span className="crumb">EDIŢIE PUBLICĂ / {page.toUpperCase()}</span><h1>{page}</h1></div>
        <span className="refresh">● Date actualizate pentru prezentare</span>
      </header>
      <main>
        {page === 'Azi' && <Dashboard open={openTender} go={go} />}
        {page === 'Oportunități' && <Opportunities open={openTender} selected={detail} />}
        {page === 'Dosarele mele' && <Pipeline data={pipeline} setData={savePipeline} open={openTender} />}
        {page === 'Căutare în dovezi' && <Search query={query} setQuery={(value) => dispatch(setQuery(value))} open={openTender} entity={(value) => { setEntity(value); setPage(value.entityType === 'buyer' ? 'Cumpărători' : 'Companii'); }} />}
        {(page === 'Cumpărători' || page === 'Companii') && <Dossiers kind={page === 'Cumpărători' ? 'buyer' : 'company'} selected={entity} select={setEntity} open={openTender} />}
        {page === 'Ce oferă produsul' && <Capabilities />}
        {page === 'Sistem' && <System />}
      </main>
    </div>
    {evidence && <div className="scrim"><aside className="drawer">
      <button className="close" onClick={() => dispatch(closeEvidence())} aria-label="Închide">×</button>
      <span className="label">DOVADĂ CITATĂ</span><h2>{evidence.name}</h2><code>{evidence.source}</code>
      <blockquote>{evidence.snippet}</blockquote><p className="muted">Fragment sintetic pentru trasabilitate; nu reprezintă un document real.</p>
    </aside></div>}
  </div>;
}

function Dashboard({ open, go }: { open: (id: string) => void; go: (page: Page) => void }) {
  return <><div className="page-intro"><div><span className="label">MIŞCĂRI DE AZI</span><h2>Semnale pentru următoarea decizie</h2><p>O vedere operaţională asupra procedurilor din 12 domenii CPV.</p></div><button className="primary" onClick={() => go('Oportunități')}>Vezi oportunităţile →</button></div>
    <div className="kpi-grid"><K label="Oportunităţi active" value={active.length} /><K label="Termene apropiate" value={active.filter((t) => t.deadline < '2026-09-27').length} /><K label="Proceduri istorice" value={demoTenders.length - active.length} /><K label="Sănătatea datelor" value="98%" /></div>
    <section className="card"><h3>Oportunităţi prioritare</h3>{active.slice(0, 6).map((tender) => <button className="action" key={tender.id} onClick={() => open(tender.id)}><div><b>{tender.title}</b><small>{tender.cpv.code} · {tender.buyer} · {money(tender.value_mdl)}</small></div><strong>{tender.fit} fit →</strong></button>)}</section>
  </>;
}

function K({ label, value }: { label: string; value: number | string }) {
  return <div className="kpi"><span>{label}</span><strong>{value}</strong><small>derivat din datele publice sintetice</small></div>;
}

function Opportunities({ open, selected }: { open: (id: string) => void; selected?: Detail }) {
  const [search, setSearch] = useState('');
  const [cpv, setCpv] = useState('Toate');
  const [status, setStatus] = useState('Toate');
  const [decision, setDecision] = useState('Toate');
  const list = demoTenders.filter((tender) =>
    (cpv === 'Toate' || tender.cpv.code === cpv) &&
    (status === 'Toate' || tender.status === status) &&
    (decision === 'Toate' || tender.decision === decision) &&
    `${tender.title} ${tender.summary} ${tender.requirements.join(' ')} ${tender.buyer} ${tender.cpv.code}`.toLowerCase().includes(search.toLowerCase()),
  );
  return <><div className="page-intro"><div><span className="label">RADAR DE ACHIZIŢII · CPV</span><h2>Oportunităţi</h2><p>Caută proceduri după cod CPV, domeniu, stare sau decizie.</p></div></div>
    <div className="toolbar">
      <input aria-label="Caută cod, domeniu sau titlu" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Caută CPV, denumire, cumpărător sau ID SYN" />
      <select aria-label="Filtru domeniu" value={cpv} onChange={(event) => setCpv(event.target.value)}><option>Toate</option>{cpvDomains.map((item) => <option key={item.code}>{item.code}</option>)}</select>
      <select aria-label="Filtru stare" value={status} onChange={(event) => setStatus(event.target.value)}><option>Toate</option>{['Publicată', 'Clarificări', 'Evaluare', 'Finalizată', 'Anulată', 'Eşuată'].map((item) => <option key={item}>{item}</option>)}</select>
      <select aria-label="Filtru decizie" value={decision} onChange={(event) => setDecision(event.target.value)}><option>Toate</option><option>GO</option><option>WATCH</option><option>NO-GO</option></select>
    </div>
    <div className="opportunity-layout"><div className="opportunity-list">
      {list.length ? list.map((tender) => <button className="opportunity" key={tender.id} onClick={() => open(tender.id)}><div className={`decision ${tender.decision.toLowerCase()}`}>{tender.decision}</div><div className="opp-main"><b>{tender.title}</b><small>{tender.cpv.code} · {tender.cpv.name}</small><small>{tender.buyer} · {tender.status} · termen {tender.deadline}</small></div><div className="score"><strong>{tender.fit}</strong><small>FIT</small></div></button>) : <div className="empty"><b>Nicio procedură găsită</b><p>Schimbă filtrele sau termenul căutat.</p></div>}
    </div>{selected && <TenderDetail tender={selected.tender} />}</div>
  </>;
}

function TenderDetail({ tender }: { tender: Tender }) {
  const dispatch = useDispatch<AppDispatch>();
  const detail = detailFor(tender);
  return <article className="tender-detail"><span className="label">{tender.id} · {tender.status}</span><h2>{tender.title}</h2><p data-testid="selected-cpv">{tender.cpv.code} · {tender.cpv.name}</p><p>{tender.buyer} · buget {money(tender.value_mdl)}</p>
    <div className="detail-stats"><div><small>Fit</small><b>{tender.fit}/100</b></div><div><small>Risc</small><b>{tender.risk}/100</b></div><div><small>Oferte</small><b>{tender.bids.length}</b></div><div><small>Stare</small><b>{tender.status}</b></div></div>
    <h3>Context şi istoric</h3><p>{tender.summary} Analiza de mai jos foloseşte exclusiv istoricul sintetic al ediţiei publice.</p>
    <h3>Cerinţe obligatorii</h3>{detail.checks.map((check) => <div className="checklist" key={check.label}>✓ {check.label} — <small>{check.note}</small></div>)}
    <h3>Concluzii explicabile</h3>{detail.conclusions.map((conclusion, index) => <button className="analysis-row" key={conclusion.title} onClick={() => dispatch(openEvidence(index % detail.evidence.length))}><div><b>{conclusion.title}</b><p>{conclusion.text}</p><small>Încredere: {conclusion.confidence}</small></div><span>Vezi dovada →</span></button>)}
    <h3>Oferte · preţ / calitate</h3>{tender.bids.map((bid) => <div className="offer" key={bid.firm}><b>{bid.firm}</b><span>{money(bid.price_mdl)}</span><span>{bid.quality}/100 calitate</span><span>{bid.status}</span></div>)}
  </article>;
}

function Pipeline({ data, setData, open }: { data: Record<string, string>; setData: (value: Record<string, string>) => void; open: (id: string) => void }) {
  return <><div className="page-intro"><div><span className="label">SPAŢIU DE LUCRU LOCAL</span><h2>Dosarele mele</h2><p>Mută procedurile între etape; starea rămâne salvată în acest browser.</p></div></div><div className="pipeline-grid">
    {['De evaluat', 'În pregătire', 'Depus'].map((stage) => <section className="stage" key={stage}><h3>{stage}</h3>{demoTenders.filter((tender) => (data[tender.id] || 'De evaluat') === stage).map((tender) => <div className="pipeline-card" key={tender.id}><button onClick={() => open(tender.id)}>{tender.title}</button><select aria-label={`Etapă pentru ${tender.title}`} value={data[tender.id] || 'De evaluat'} onChange={(event) => setData({ ...data, [tender.id]: event.target.value })}>{['De evaluat', 'În pregătire', 'Depus'].map((item) => <option key={item}>{item}</option>)}</select></div>)}</section>)}
  </div></>;
}

function Search({ query, setQuery, open, entity }: { query: string; setQuery: (value: string) => void; open: (id: string) => void; entity: (value: EntityResult) => void }) {
  const results = useMemo(() => searchEntities().filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <><div className="page-intro"><div><span className="label">TRASABILITATE</span><h2>Căutare în dovezi</h2><p>Caută simultan proceduri, fragmente, analize, cumpărători şi companii.</p></div></div><input className="big-search" aria-label="Caută în dovezi" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex: 72000000-5 sau securitate" /><div className="results">{results.length ? results.map((item, index) => <button key={`${item.kind}-${item.title}-${index}`} onClick={() => item.tenderId ? open(item.tenderId) : entity(item)}><span>{item.kind}</span><div><b>{item.title}</b><small>{item.subtitle}</small></div>→</button>) : <div className="empty"><b>Niciun rezultat</b><p>Încearcă un cod CPV, o cerinţă sau o entitate.</p></div>}</div></>;
}

function Dossiers({ kind, selected, select, open }: { kind: 'buyer' | 'company'; selected: EntityResult | null; select: (value: EntityResult) => void; open: (id: string) => void }) {
  const list = kind === 'buyer' ? buyers : companies;
  const name = selected?.title;
  const related = demoTenders.filter((tender) => kind === 'buyer' ? tender.buyer === name : tender.bids.some((bid) => bid.firm === name));
  const bids = related.flatMap((tender) => tender.bids.filter((bid) => bid.firm === name));
  const wins = bids.filter((bid) => bid.status === 'Câştigătoare').length;
  const averageDiscount = bids.length ? Math.round(related.reduce((sum, tender) => { const bid = tender.bids.find((item) => item.firm === name); return sum + (bid ? (1 - bid.price_mdl / tender.value_mdl) * 100 : 0); }, 0) / bids.length) : 0;
  const finished = related.filter((tender) => tender.status === 'Finalizată').length;
  const averageOffers = related.length ? (related.reduce((sum, tender) => sum + tender.bids.length, 0) / related.length).toFixed(1) : '0';
  const cpvMix = new Set(related.map((tender) => tender.cpv.code)).size;
  return <><div className="page-intro"><div><span className="label">DOSARE DE ENTITATE</span><h2>{kind === 'buyer' ? 'Cumpărători' : 'Companii'}</h2><p>Istoric, profil CPV şi tipare derivate exclusiv din procedurile sintetice.</p></div></div><div className="dossier-grid">{list.map((item) => <button className="dossier-card entity-button" key={item.id} onClick={() => select({ kind: kind === 'buyer' ? 'Cumpărător' : 'Companie', title: item.name, subtitle: item.id, entityType: kind, entityId: item.id })}><h3>{item.name}</h3><p>{kind === 'buyer' ? 'pattern' in item && item.pattern : 'focus' in item && `CPV: ${item.focus}`}</p></button>)}</div>
    {selected && <section className="card dossier-view"><span className="label">{selected.subtitle}</span><h2>{name}</h2><div className="detail-stats"><div><small>{kind === 'buyer' ? 'Proceduri' : 'Participări'}</small><b>{related.length}</b></div><div><small>{kind === 'buyer' ? 'Finalizate' : 'Câştiguri'}</small><b>{kind === 'buyer' ? finished : wins}</b></div><div><small>{kind === 'buyer' ? 'Oferte / procedură' : 'Reducere medie'}</small><b>{kind === 'buyer' ? averageOffers : `${averageDiscount}%`}</b></div><div><small>Domenii CPV</small><b>{cpvMix}</b></div></div><h3>Proceduri asociate</h3>{related.map((tender) => <button className="action" key={tender.id} onClick={() => open(tender.id)}><div><b>{tender.title}</b><small>{tender.cpv.code} · {tender.status}</small></div><strong>Deschide →</strong></button>)}</section>}
  </>;
}

function Capabilities() {
  const items = [
    ['Descoperire multidomeniu', 'Monitorizare şi filtrare după CPV, cumpărător, stare şi semnale relevante.', 'Radar → filtru CPV → procedură'],
    ['Analiză documentară', 'Cerinţe, criterii, termene şi riscuri legate de fragmente verificabile.', 'Document → cerinţă → dovadă'],
    ['Decizie GO / WATCH / NO-GO', 'Prioritizare explicabilă după potrivire, risc, buget şi presiune competitivă.', 'Semnal → explicaţie → decizie'],
    ['Inteligenţă competitivă', 'Comparaţie preţ-calitate, tipare de participare şi poziţionare a ofertanţilor.', 'Companie → participări → strategie'],
    ['Dosare de cumpărător', 'Istoric al procedurilor, mix CPV, recurenţă şi context pentru pregătirea ofertei.', 'Cumpărător → istoric → oportunitate'],
    ['Pregătirea depunerii', 'Pipeline local pentru evaluare, pregătire şi urmărirea dosarelor depuse.', 'Oportunitate → dosar → depunere'],
  ];
  return <div className="capabilities-page"><div className="page-intro"><div><span className="label">AVANTAJ OPERAŢIONAL</span><h2>Ce oferă produsul</h2><p>Un singur spaţiu de lucru pentru a găsi, înţelege şi pregăti proceduri din orice domeniu CPV.</p></div></div><section className="card capability-list">{items.map(([title, benefit, flow]) => <div className="capability" key={title}><div><b>{title}</b><small>{benefit}</small><small><strong>Flux:</strong> {flow}</small></div></div>)}<div className="notice"><b>Limitele ediţiei publice:</b> datele de business şi documentele sunt sintetice; pipeline-ul este local. Produsul complet poate integra surse autorizate, OCR, colaborare şi actualizări persistente.</div></section></div>;
}

function System() {
  return <><div className="page-intro"><div><span className="label">CONTROLUL CALITĂŢII</span><h2>Sistem</h2><p>Starea setului public şi limitele sale sunt vizibile, nu ascunse.</p></div></div><section className="card"><h3>Sănătatea datelor</h3><div className="health-score">98%</div><p className="muted">12 proceduri active şi 6 istorice; toate datele de business sunt sintetice, iar codurile CPV provin din taxonomia publică. Sursele sunt limitate la schema locală fixture://.</p></section></>;
}
