export type RequirementState = 'verified' | 'proof' | 'not_met';

export type Requirement = {
  id: string;
  evidenceId: string;
  title: string;
  detail: string;
  proof: string;
  risk: string;
};

export type Evidence = {
  id: string;
  title: string;
  kind: 'excerpt' | 'attachment';
  page: string;
  excerpt: string;
  note: string;
};

export type Offer = {
  name: string;
  price: number;
  fit: number;
  delivery: number;
  note: string;
};

export type DemoState = {
  requirements: Record<string, RequirementState>;
  note: string;
  decision: 'go' | 'no-go' | null;
};
