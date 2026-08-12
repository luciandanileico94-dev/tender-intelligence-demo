export type Status = 'GO' | 'WATCH' | 'NO-GO';
export type Document = { name: string; complete: boolean; source: string; page: number; offset: number; snippet: string };
export type Bid = { firm: string; price_mdl: number; quality: number; delivery_days: number; status: string };
export type Tender = { id: string; title: string; buyer: string; buyerId: string; category: string; status: string; decision: Status; deadline: string; value_mdl: number; fit: number; risk: number; summary: string; requirements: string[]; documents: Document[]; bids: Bid[] };
export type Detail = { tender: Tender; checks: { label: string; value: boolean; note: string }[]; evidence: Document[] };
export type EntityResult = { kind: 'Cumpărător' | 'Companie' | 'Dovadă'; title: string; subtitle: string; tenderId?: string; source?: string };
