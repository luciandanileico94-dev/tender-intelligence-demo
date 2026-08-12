import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { evidence, offers, opportunity, requirements } from './demoData';
import { hydrate, resetDemo, setDecision, setNote, setRequirement, STORAGE_KEY, type AppDispatch, type RootState } from './store';
import type { DemoState, RequirementState } from './types';

const money = (value: number) => new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

export function decisionFor(state: DemoState) {
  const values = Object.values(state.requirements);
  const verified = values.filter((value) => value === 'verified').length;
  const blockers = values.filter((value) => value === 'not_met').length;
  const unknown = values.filter((value) => value === 'proof').length;
  const ready = blockers === 0 && unknown === 0;
  return { verified, blockers, unknown, ready, score: Math.round((verified / requirements.length) * 100) };
}

export function App() {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((root: RootState) => root.demo);
  const [tab, setTab] = useState<'summary' | 'sources'>('summary');
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const result = useMemo(() => decisionFor(state), [state]);
  const selected = evidence.find((item) => item.id === selectedEvidence);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) { try { dispatch(hydrate(JSON.parse(saved) as DemoState)); } catch { localStorage.removeItem(STORAGE_KEY); } }
  }, [dispatch]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);

  const updateRequirement = (id: string, value: RequirementState) => dispatch(setRequirement({ id, value }));
  const reset = () => { dispatch(resetDemo()); setTab('summary'); setSelectedEvidence(null); };

  return <div className="app-shell">
    <header className="topbar"><div className="brand-mark">TI</div><div><p className="overline">Tender Intelligence · spațiu demonstrativ</p><h1>Astăzi</h1></div><div className="top-actions"><span className="synthetic-badge">● Doar date sintetice</span><button className="button quiet" onClick={reset}>Resetează demo</button></div></header>
    <main>
      <section className="intro"><div><p className="overline accent">Următoarea acțiune</p><h2>Verifică dacă merită pregătită oferta.</h2><p className="lead">Un singur caz, un traseu clar: citește fragmentele, marchează cerințele și lasă dosarul să îți arate ce mai lipsește.</p></div><div className="intro-meta"><span>1 oportunitate cu fit {opportunity.fit}</span><span>Termen: {opportunity.deadline}</span></div></section>
      <section className="workspace-grid"><aside className="queue panel"><div className="panel-heading"><div><p className="overline">Coada de lucru</p><h3>Oportunitate de verificat</h3></div><span className="count">01</span></div><button className="opportunity-card" aria-current="page"><span className="card-label">FIT {opportunity.fit}</span><strong>{opportunity.title}</strong><span>{opportunity.buyer}</span><span className="card-footer"><b>{money(opportunity.budget)}</b><span>Deschis <i>↗</i></span></span></button><div className="queue-note"><span className="spark">✦</span><span><b>Acțiune recomandată</b><br />Confirmă dovezile critice înainte de decizie.</span></div></aside>
        <article className="dossier panel"><div className="dossier-head"><div><p className="overline accent">DOSAR · {opportunity.id}</p><h2>{opportunity.title}</h2><p>{opportunity.buyer} <span className="dot-separator">·</span> termen {opportunity.deadline}</p></div><div className={`decision-pill ${result.ready ? 'ready' : result.blockers ? 'blocked' : 'pending'}`}><span>{result.ready ? 'GO posibil' : result.blockers ? 'NO-GO' : 'În verificare'}</span><b>{result.score}% pregătit</b></div></div>
          <div className="tabs" role="tablist" aria-label="Vizualizare dosar"><button role="tab" aria-selected={tab === 'summary'} onClick={() => setTab('summary')}>Rezumat și decizie</button><button role="tab" aria-selected={tab === 'sources'} onClick={() => setTab('sources')}>Surse și fragmente <span>{evidence.length}</span></button></div>
          {tab === 'summary' ? <Summary state={state} result={result} onRequirement={updateRequirement} onEvidence={setSelectedEvidence} onNote={(value) => dispatch(setNote(value))} onDecision={(value) => dispatch(setDecision(value))} /> : <Sources onEvidence={setSelectedEvidence} />}
        </article>
      </section>
      <footer className="disclaimer"><span>ⓘ</span><span><b>Demo static post-submission.</b> Toate numele, valorile, cerințele și fragmentele sunt inventate. Nu au fost colectate documente sau date prin crawling.</span></footer>
    </main>
    {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedEvidence(null)}><section className="evidence-modal" role="dialog" aria-modal="true" aria-labelledby="evidence-title" onClick={(event) => event.stopPropagation()}><button className="close-button" aria-label="Închide fragmentul" onClick={() => setSelectedEvidence(null)}>×</button><p className="overline accent">{selected.kind === 'excerpt' ? 'FRAGMENT SINTETIC' : 'ATAȘAMENT DEMONSTRATIV'}</p><h2 id="evidence-title">{selected.title}</h2><div className="quote-card">“{selected.excerpt}”</div><p className="modal-meta">Referință internă: {selected.id} <span>·</span> {selected.page}</p><p>{selected.note}</p></section></div>}
  </div>;
}

function Summary({ state, result, onRequirement, onEvidence, onNote, onDecision }: { state: DemoState; result: ReturnType<typeof decisionFor>; onRequirement: (id: string, value: RequirementState) => void; onEvidence: (id: string) => void; onNote: (value: string) => void; onDecision: (value: 'go' | 'no-go') => void }) {
  return <><div className="summary-grid"><div><p className="overline">Context</p><p className="summary-copy">{opportunity.summary}</p><div className="stat-row"><span><b>{money(opportunity.budget)}</b><small>buget estimat</small></span><span><b>{offers.length}</b><small>oferte sintetice</small></span><span><b>{result.verified}/{requirements.length}</b><small>cerințe verificate</small></span></div></div><div className="rule-card"><p className="overline">Regulă transparentă</p><strong>GO doar când toate cele {requirements.length} cerințe sunt verificate.</strong><span>O cerință neîndeplinită produce NO-GO. O dovadă lipsă menține dosarul în verificare.</span></div></div>
    <div className="section-heading"><div><p className="overline accent">1 · Verificare</p><h3>Cerințe și dovezi</h3></div><span className="progress-label">{result.verified} verificate <i>·</i> {result.unknown} de clarificat</span></div>
    <div className="requirements">{requirements.map((item) => <div className={`requirement ${state.requirements[item.id]}`} key={item.id}><div className="requirement-copy"><span className="requirement-icon">{state.requirements[item.id] === 'verified' ? '✓' : state.requirements[item.id] === 'not_met' ? '!' : '?'}</span><div><strong>{item.title}</strong><p>{item.detail}</p><button className="evidence-link" onClick={() => onEvidence(item.evidenceId)}>Vezi dovada · {item.proof}</button></div></div><label className="state-control"><span>Stare</span><select aria-label={`Stare: ${item.title}`} value={state.requirements[item.id]} onChange={(event) => onRequirement(item.id, event.target.value as RequirementState)}><option value="verified">Verificat</option><option value="proof">Necesită dovadă</option><option value="not_met">Neîndeplinit</option></select></label></div>)}</div>
    <div className="section-heading offers-heading"><div><p className="overline accent">2 · Comparare</p><h3>Oferte sintetice</h3></div><span className="progress-label">Prețul nu decide singur</span></div><div className="offers"><div className="offer-head"><span>Furnizor</span><span>Preț</span><span>Fit</span><span>Livrare</span></div>{offers.map((offer, index) => <div className={`offer ${index === 0 && result.ready ? 'recommended' : ''}`} key={offer.name}><span><b><i>{index + 1}</i>{offer.name}</b><small>{offer.note}</small></span><strong>{money(offer.price)}</strong><span className="fit-number">{Math.max(0, offer.fit - result.blockers * 5 - result.unknown * 2)}<small>/100</small></span><span>{offer.delivery} zile</span></div>)}</div><p className="risk-note"><span>!</span><b>Risc explicabil:</b> {result.blockers ? `${result.blockers} cerință neîndeplinită blochează decizia.` : result.unknown ? `${result.unknown} dovezi lipsă păstrează riscul deschis.` : 'Toate cerințele sunt verificate, iar comparația poate fi folosită pentru decizie.'}</p>
    <div className="decision-area"><div><p className="overline accent">3 · Decizia analistului</p><h3>Ce faci cu acest dosar?</h3><p>Decizia este locală și rămâne salvată în acest browser.</p></div><div className="decision-actions"><button className={`button ${state.decision === 'go' ? 'selected-go' : ''}`} onClick={() => onDecision('go')} disabled={!result.ready}>Marchează GO</button><button className={`button ${state.decision === 'no-go' ? 'selected-no-go' : ''}`} onClick={() => onDecision('no-go')}>Marchează NO-GO</button></div></div><label className="note-field"><span>Notă locală pentru dosar</span><textarea value={state.note} onChange={(event) => onNote(event.target.value)} placeholder="De exemplu: cer confirmarea echipei de instalare..."></textarea></label></>;
}

function Sources({ onEvidence }: { onEvidence: (id: string) => void }) { return <div className="sources-view"><div className="section-heading"><div><p className="overline accent">Bibliotecă de lucru</p><h3>Surse și fragmente</h3></div><span className="progress-label">fără fișiere originale</span></div><p className="lead">Aceste carduri arată cum poate fi legată o cerință de o probă. Sunt fragmente scrise special pentru demonstrație, nu documente descărcate.</p><div className="source-grid">{evidence.map((item) => <button className="source-card" key={item.id} onClick={() => onEvidence(item.id)}><span className="source-type">{item.kind === 'excerpt' ? 'EXTRAS' : 'ATAȘAMENT'}</span><strong>{item.title}</strong><small>{item.page}</small><p>{item.excerpt}</p><span className="source-open">Deschide fragmentul ↗</span></button>)}</div></div>; }
