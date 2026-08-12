import type { Evidence, Offer, Requirement } from './types';

export const opportunity = {
  id: 'DEMO-MD-2026-014',
  title: 'Platformă solară pentru campusul Albastru',
  buyer: 'Municipiul Fictiv Nord',
  deadline: '30 septembrie 2026',
  budget: 240000,
  fit: 'ridicat',
  summary: 'Un caz demonstrativ pentru instalarea unei platforme solare într-un campus municipal. Dosarul este suficient de promițător pentru o verificare atentă înainte de a pregăti oferta.',
};

export const requirements: Requirement[] = [
  { id: 'capacity', evidenceId: 'E-01', title: 'Capacitate minimă 180 kWp', detail: 'Oferta trebuie să acopere capacitatea tehnică indicată în caiet.', proof: 'Caiet tehnic, extras sintetic 01', risk: 'Fără dovadă, compatibilitatea tehnică rămâne incertă.' },
  { id: 'delivery', evidenceId: 'E-02', title: 'Livrare în maximum 120 zile', detail: 'Calendarul propus trebuie să respecte fereastra de implementare.', proof: 'Calendar demonstrativ, extras sintetic 02', risk: 'Întârzierea poate afecta punctajul și planul de proiect.' },
  { id: 'warranty', evidenceId: 'E-03', title: 'Garanție de minimum 5 ani', detail: 'Condiția comercială trebuie să apară explicit în oferta depusă.', proof: 'Cerințe comerciale, extras sintetic 03', risk: 'O condiție nesusținută poate deveni o neconformitate.' },
  { id: 'team', evidenceId: 'E-04', title: 'Echipă locală de instalare', detail: 'Este necesară o echipă nominalizată pentru montaj și service.', proof: 'Anexă tehnică, extras sintetic 04', risk: 'Capacitatea de execuție nu este demonstrată încă.' },
  { id: 'documents', evidenceId: 'E-05', title: 'Pachet de documente complet', detail: 'Declarația, fișa tehnică și referințele trebuie să fie disponibile.', proof: 'Listă documente, extras sintetic 05', risk: 'Lipsurile de formă pot bloca depunerea.' },
];

export const evidence: Evidence[] = [
  { id: 'E-01', title: 'Caiet tehnic', kind: 'excerpt', page: 'extras 01', excerpt: 'Sistemul propus va avea o capacitate instalată de cel puțin 180 kWp.', note: 'Fragment creat pentru demo, fără fișier original și fără sursă externă.' },
  { id: 'E-02', title: 'Calendar demonstrativ', kind: 'excerpt', page: 'extras 02', excerpt: 'Punerea în funcțiune este planificată în 120 zile de la ordinul de începere.', note: 'Fragment creat pentru demo, folosit ca dovadă de lucru.' },
  { id: 'E-03', title: 'Cerințe comerciale', kind: 'excerpt', page: 'extras 03', excerpt: 'Perioada minimă de garanție pentru echipamente este de 60 luni.', note: 'Fragment creat pentru demo, nu reprezintă un document public.' },
  { id: 'E-04', title: 'Anexă tehnică', kind: 'excerpt', page: 'extras 04', excerpt: 'Echipa de instalare va include roluri locale pentru montaj și intervenții.', note: 'Fragment creat pentru demo, fără persoane sau organizații reale.' },
  { id: 'E-05', title: 'Listă de documente', kind: 'attachment', page: 'inventar sintetic', excerpt: 'Declarație de conformitate · fișă tehnică · referințe similare.', note: 'Atașament demonstrativ. Nu este un document încărcat de utilizator.' },
];

export const offers: Offer[] = [
  { name: 'Echipa Fictivă A', price: 221000, fit: 88, delivery: 115, note: 'Preț echilibrat, cu o cerință de confirmat.' },
  { name: 'Echipa Fictivă B', price: 234500, fit: 93, delivery: 105, note: 'Cel mai bun fit în scenariul inițial.' },
];

export const defaultRequirementStates = Object.fromEntries(requirements.map((item) => [item.id, 'proof'])) as Record<string, 'proof'>;
