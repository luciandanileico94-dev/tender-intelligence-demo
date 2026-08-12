import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { App } from './App';
import { Provider } from 'react-redux';
import { clearSelection, setQuery, store } from './store';

const renderApp = () => render(<Provider store={store}><App /></Provider>);

beforeEach(() => {
  store.dispatch(clearSelection());
  store.dispatch(setQuery(''));
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok:true,json:async()=>[]}));
});
afterEach(() => cleanup());

test('loads local API and exposes a tender detail with blocked gate', async () => {
  const user = userEvent.setup();
  vi.mocked(fetch).mockResolvedValueOnce({ok:true,json:async()=>[{id:'SYN-RO-2026-001',title:'Dosar solar',buyer:'Orașul Fictiv Nord'}]} as Response)
    .mockResolvedValueOnce({ok:true,json:async()=>({tender:{id:'SYN-RO-2026-001',title:'Dosar solar',buyer:'Orașul Fictiv Nord',deadline:'2026-09-30',value_eur:1},dossier:{checks:{identitate:true,calendar:true,buget:true,criterii:true,documente:false},score:4,max_score:5,gate:'blocked',label:'Blocat'},bids:[],completeness:{complete:0,total:0,items:[]},claim:{claim:'Afirmație sintetică',evidence_ids:[],confidence:'scăzută',uncertainty:'Demo',evidence:[]}})} as Response);
  renderApp();
  await user.click(await screen.findByRole('button', {name:/Dosar solar/}));
  expect(await screen.findByText(/Blocat 4\/5/)).toBeInTheDocument();
});

test('static demo filters, selects a tender, and opens an evidence drawer', async () => {
  const user = userEvent.setup();
  renderApp();
  await user.click(screen.getByRole('button', {name:'Schimbă'}));

  const search = screen.getByRole('textbox', {name:'Caută în dosare'});
  await user.type(search, 'solar');
  expect(screen.getByRole('button', {name:/Sistem solar demonstrativ/})).toBeInTheDocument();
  expect(screen.queryByRole('button', {name:/Mobilier modular/})).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', {name:/Sistem solar demonstrativ/}));
  expect(await screen.findByRole('heading', {name:/Sistem solar demonstrativ/})).toBeInTheDocument();
  await user.click(screen.getByRole('button', {name:'E1'}));
  expect(await screen.findByRole('heading', {name:'Caiet tehnic'})).toBeInTheDocument();
  expect(screen.getByText('fixture://syn-001/caiet')).toBeInTheDocument();
  expect(screen.getByRole('button', {name:'Închide'})).toBeInTheDocument();
  await user.click(screen.getByRole('button', {name:'Închide'}));
  expect(screen.queryByRole('heading', {name:'Caiet tehnic'})).not.toBeInTheDocument();
});
