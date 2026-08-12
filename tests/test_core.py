import unittest
from tender_intelligence.fixtures import all_tenders,get_tender
from tender_intelligence.analysis import compare_bids,dossier,entity_analytics
from tender_intelligence.security import allowed_source,safe_text
class CoreTests(unittest.TestCase):
 def test_shared_fixture_contract(self):
  ts=all_tenders(); self.assertEqual(len(ts),18); self.assertEqual(sum(t['status'] in ('Publicată','Clarificări','Evaluare') for t in ts),12); self.assertTrue(all('value_mdl' in t and 'cpv' in t for t in ts))
 def test_domain_and_history(self):
  self.assertEqual(get_tender('SYN-RO-26-001')['cpv']['code'],'03000000-1'); self.assertEqual(get_tender('SYN-RO-26-013')['status'],'Finalizată')
 def test_analysis_mdl_and_entities(self):
  t=get_tender('SYN-RO-26-013'); self.assertEqual(compare_bids(t)[0]['price_mdl'],792100); self.assertEqual(dossier(t)['score'],5); self.assertIn('cpv_mix',entity_analytics(all_tenders(),'Nordic Byte Fictiv SRL','company'))
 def test_strict_sources(self):
  self.assertTrue(allowed_source('fixture://syn-ro-26-001/caiet-de-sarcini')); self.assertFalse(allowed_source('fixture:///empty')); self.assertFalse(allowed_source('fixture://syn-ro-26-001/a/../b')); self.assertFalse(allowed_source('fixture://user:pass@syn-ro-26-001/doc')); self.assertFalse(allowed_source('fixture://syn-ro-26-001/doc?x=1')); self.assertFalse(allowed_source('https://example.invalid/doc')); self.assertIn('&lt;script&gt;',safe_text('<script>'))
