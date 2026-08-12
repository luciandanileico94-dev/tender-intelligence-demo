"""Deterministic dossier and entity analytics over the shared MDL/CPV fixtures."""
def dossier(tender: dict) -> dict:
    docs=tender.get('documents',[]); checks={'identitate':bool(tender.get('title') and tender.get('buyer')),'calendar':bool(tender.get('deadline')),'buget':tender.get('value_mdl',0)>0,'criterii':bool(docs),'documente':all(d.get('complete',False) for d in docs)}
    score=sum(checks.values()); return {'checks':checks,'score':score,'max_score':5,'gate':'ready' if score==5 else 'blocked','label':'Pregătit' if score==5 else 'Blocat'}
def compare_bids(tender: dict) -> list[dict]: return sorted(tender.get('bids',[]),key=lambda b:b['price_mdl'])
def completeness(tender: dict) -> dict:
    docs=tender.get('documents',[]); return {'complete':sum(bool(d.get('complete')) for d in docs),'total':len(docs),'items':docs}
def entity_analytics(tenders:list[dict], name:str, kind:str) -> dict:
    related=[t for t in tenders if (t.get('buyer')==name if kind=='buyer' else any(b['firm']==name for b in t.get('bids',[])))]
    bids=[b for t in related for b in t.get('bids',[]) if kind=='buyer' or b['firm']==name]
    return {'procedures':len(related),'cpv_mix':sorted({t['cpv']['code'] for t in related}),'completed':sum(t['status']=='Finalizată' for t in related),'failed':sum(t['status'] in ('Eşuată','Anulată') for t in related),'participations':len(bids),'wins':sum(b['status']=='Câştigătoare' for b in bids),'average_discount_pct':round(sum((1-b['price_mdl']/next(t['value_mdl'] for t in related if b in t['bids']))*100 for b in bids)/len(bids),1) if bids else 0,'competitors':sorted({b['firm'] for t in related for b in t.get('bids',[]) if b['firm']!=name})}
