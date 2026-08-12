import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { App, decisionFor } from './App';
import { Provider } from 'react-redux';
import { initialDemoState, resetDemo, store, STORAGE_KEY } from './store';

const renderApp = () => render(<Provider store={store}><App /></Provider>);

beforeEach(() => { localStorage.clear(); store.dispatch(resetDemo()); });
afterEach(() => cleanup());

test('decision rules expose a blocked state until every requirement is verified', () => {
  const start = decisionFor(initialDemoState);
  expect(start.ready).toBe(false);
  expect(start.unknown).toBe(5);
  const next = { ...initialDemoState, requirements: { ...initialDemoState.requirements, capacity: 'verified' as const, delivery: 'verified' as const, warranty: 'verified' as const, team: 'verified' as const, documents: 'verified' as const } };
  expect(decisionFor(next)).toMatchObject({ ready: true, score: 100, verified: 5 });
});

test('analyst can verify requirements, see GO, save a note and persist the decision', async () => {
  const user = userEvent.setup();
  renderApp();
  expect(screen.getByText('În verificare')).toBeInTheDocument();
  for (const title of ['Capacitate minimă 180 kWp', 'Livrare în maximum 120 zile', 'Garanție de minimum 5 ani', 'Echipă locală de instalare', 'Pachet de documente complet']) {
    await user.selectOptions(screen.getByLabelText(`Stare: ${title}`), 'verified');
  }
  expect(screen.getByText('GO posibil')).toBeInTheDocument();
  const note = screen.getByLabelText('Notă locală pentru dosar');
  await user.type(note, 'Confirmat cu echipa comercială.');
  await user.click(screen.getByRole('button', { name: 'Marchează GO' }));
  expect(screen.getByRole('button', { name: 'Marchează GO' })).toHaveClass('selected-go');
  expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')).toMatchObject({ decision: 'go', note: 'Confirmat cu echipa comercială.' });
});

test('reset demo restores the initial requirement state', async () => {
  const user = userEvent.setup();
  renderApp();
  await user.selectOptions(screen.getByLabelText('Stare: Capacitate minimă 180 kWp'), 'not_met');
  await user.click(screen.getByRole('button', { name: 'Resetează demo' }));
  expect(screen.getByLabelText('Stare: Capacitate minimă 180 kWp')).toHaveValue('proof');
});

test('sources tab opens a synthetic excerpt card', async () => {
  const user = userEvent.setup();
  renderApp();
  await user.click(screen.getByRole('tab', { name: /Surse și fragmente/ }));
  await user.click(screen.getByRole('button', { name: /Caiet tehnic/ }));
  expect(screen.getByRole('dialog')).toHaveTextContent('FRAGMENT SINTETIC');
  expect(screen.getByText(/Fragment creat pentru demo/)).toBeInTheDocument();
});
