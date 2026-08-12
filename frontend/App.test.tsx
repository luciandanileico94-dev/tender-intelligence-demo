import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';
import { App } from './App';

beforeEach(() => { vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok:true,json:async()=>[...([])]})); });

test('loads local API and exposes a tender detail with blocked gate', async () => {
  const user = userEvent.setup();
  vi.mocked(fetch).mockResolvedValueOnce({ok:true,json:async()=>[{id:'SYN-RO-2026-001',title:'Dosar solar',buyer:'Orașul Fictiv Nord'}]} as Response)
    .mockResolvedValueOnce({ok:true,json:async()=>({tender:{id:'SYN-RO-2026-001',title:'Dosar solar',buyer:'Orașul Fictiv Nord',deadline:'2026-09-30',value_eur:1},dossier:{checks:{identitate:true,calendar:true,buget:true,criterii:true,documente:false},score:4,max_score:5,gate:'blocked',label:'Blocat'},bids:[],completeness:{complete:0,total:0,items:[]},claim:{claim:'Afirmație sintetică',evidence_ids:[],confidence:'scăzută',uncertainty:'Demo',evidence:[]}})} as Response);
  render(<App />);
  await user.click(await screen.findByRole('button', {name:/Dosar solar/}));
  expect(await screen.findByText(/Blocat 4\/5/)).toBeInTheDocument();
});
