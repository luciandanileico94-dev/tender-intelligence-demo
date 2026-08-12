import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { App } from './App';
import { Provider } from 'react-redux';
import { clearSelection, setQuery, store } from './store';

const renderApp=()=>render(<Provider store={store}><App/></Provider>);
beforeEach(()=>{store.dispatch(clearSelection());store.dispatch(setQuery(''));localStorage.clear()});
afterEach(()=>cleanup());

test('navigates from Today to opportunity detail and opens synthetic evidence',async()=>{const user=userEvent.setup();renderApp();await user.click(screen.getByRole('button',{name:/Vezi oportunitățile/}));expect(screen.getByRole('heading',{name:'Oportunități',level:2})).toBeInTheDocument();await user.click(screen.getByRole('button',{name:/Platformă de interoperabilitate/}));expect(screen.getByRole('heading',{name:/Platformă de interoperabilitate/})).toBeInTheDocument();await user.click(screen.getByRole('button',{name:/Caiet de sarcini/}));expect(screen.getAllByText('fixture://syn-1/caiet-de-sarcini').length).toBeGreaterThan(0);await user.click(screen.getByRole('button',{name:'Închide'}));expect(screen.getByRole('button',{name:/Caiet de sarcini/})).toBeInTheDocument()});
test('searches and persists pipeline stage locally',async()=>{const user=userEvent.setup();renderApp();await user.click(screen.getByRole('button',{name:/Căutare în dovezi/}));await user.type(screen.getByRole('textbox',{name:'Caută în dovezi'}),'Nordic Byte');expect(screen.getByText('Nordic Byte Fictiv SRL')).toBeInTheDocument();await user.click(screen.getByRole('button',{name:/Dosarele mele/}));const select=screen.getByRole('combobox',{name:/Platformă de interoperabilitate/});await user.selectOptions(select,'În pregătire');expect(screen.getByDisplayValue('În pregătire')).toBeInTheDocument();expect(JSON.parse(localStorage.getItem('tender-pipeline')||'{}')['SYN-RO-26-001']).toBe('În pregătire')});
