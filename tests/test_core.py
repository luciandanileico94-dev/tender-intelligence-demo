import unittest

from tender_intelligence.fixtures import all_tenders, get_tender
from tender_intelligence.analysis import compare_bids, dossier
from tender_intelligence.claims import cited_claim
from tender_intelligence.security import allowed_source, safe_text


class CoreTests(unittest.TestCase):
    def test_fixtures_are_obvious_and_local(self):
        tenders = all_tenders()
        self.assertGreaterEqual(len(tenders), 2)
        self.assertTrue(all(t["id"].startswith("SYN-") and "Fictiv" in (t["buyer"] + str(t["bids"])) for t in tenders))
        self.assertTrue(all(d["source"].startswith("fixture://") for t in tenders for d in t["documents"]))

    def test_gate_blocked_at_four_and_ready_at_five(self):
        tender = get_tender("SYN-RO-2026-001")
        self.assertEqual(dossier(tender)["score"], 4)
        self.assertEqual(dossier(tender)["gate"], "blocked")
        tender["documents"][2]["complete"] = True
        self.assertEqual(dossier(tender)["score"], 5)
        self.assertEqual(dossier(tender)["gate"], "ready")

    def test_three_bid_comparison_and_claim(self):
        tender = get_tender("SYN-RO-2026-001")
        bids = compare_bids(tender)
        self.assertEqual(len(bids), 3)
        self.assertLess(bids[0]["price_eur"], bids[-1]["price_eur"])
        claim = cited_claim(tender)
        self.assertEqual(claim["evidence_ids"], ["E1", "E2", "E3"])
        self.assertTrue(claim["confidence"])

    def test_escaping_and_allowlist(self):
        self.assertIn("&lt;script&gt;", safe_text("<script>"))
        self.assertTrue(allowed_source("fixture://syn-001/page"))
        self.assertFalse(allowed_source("http" + "s://example.invalid/doc"))


if __name__ == "__main__":
    unittest.main()
