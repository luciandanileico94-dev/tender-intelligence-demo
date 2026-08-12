export type Document = { name: string; complete: boolean; source: string; page: number; offset: number };
export type Tender = { id: string; title: string; buyer: string; status: string; deadline: string; value_eur: number; documents: Document[]; bids: Bid[] };
export type Bid = { firm: string; price_eur: number; technical: number; delivery_days: number; documents: number };
export type Detail = { tender: Tender; dossier: { checks: Record<string, boolean>; score: number; max_score: number; gate: 'ready'|'blocked'; label: string }; bids: Bid[]; completeness: { complete: number; total: number; items: Document[] }; claim: { claim: string; evidence_ids: string[]; confidence: string; uncertainty: string; evidence: Document[] } };
