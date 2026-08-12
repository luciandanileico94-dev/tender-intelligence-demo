export type Decision = 'GO' | 'WATCH' | 'NO-GO';
export type Document = { name: string; complete: boolean; source: string; page: number; offset: number; snippet: string };
export type Bid = { firm: string; price_mdl: number; quality: number; delivery_days: number; status: string };
export type CPV = { code: string; name: string };
export type Tender = { id: string; title: string; buyer: string; buyerId: string; cpv: CPV; status: string; decision: Decision; deadline: string; value_mdl: number; fit: number; risk: number; summary: string; requirements: string[]; documents: Document[]; bids: Bid[]; historyNote?: string };
export type Conclusion = { title: string; text: string; source: string; confidence: 'Ridicată' | 'Medie' | 'Limitată'; };
export type Detail = { tender: Tender; checks: { label: string; value: boolean; note: string }[]; evidence: Document[]; conclusions: Conclusion[] };
export type EntityResult = { kind: 'Cumpărător' | 'Companie' | 'Procedură' | 'Dovadă' | 'Analiză'; title: string; subtitle: string; entityType?: 'buyer' | 'company'; entityId?: string; tenderId?: string };
