"""Fixtures intentionally fictional; never replace these with production data."""
from copy import deepcopy

SYNTHETIC_TENDERS = [
    {
        "id": "SYN-RO-2026-001",
        "title": "Sistem solar demonstrativ pentru campusul Albastru",
        "buyer": "Orașul Fictiv Nord",
        "status": "În evaluare",
        "deadline": "2026-09-30",
        "value_eur": 240000,
        "documents": [
            {"name": "Caiet tehnic", "complete": True, "source": "fixture://syn-001/caiet", "page": 4, "offset": 118},
            {"name": "Criterii de atribuire", "complete": True, "source": "fixture://syn-001/criterii", "page": 7, "offset": 203},
            {"name": "Calendar livrare", "complete": False, "source": "fixture://syn-001/calendar", "page": 2, "offset": 55},
        ],
        "bids": [
            {"firm": "Atelier Fictiv A", "price_eur": 221000, "technical": 88, "delivery_days": 120, "documents": 5},
            {"firm": "Atelier Fictiv B", "price_eur": 234500, "technical": 93, "delivery_days": 105, "documents": 5},
            {"firm": "Atelier Fictiv C", "price_eur": 209900, "technical": 79, "delivery_days": 150, "documents": 4},
        ],
    },
    {
        "id": "SYN-RO-2026-002", "title": "Mobilier modular pentru biblioteca Verde", "buyer": "Comuna Fictivă Sud", "status": "Publicat", "deadline": "2026-10-12", "value_eur": 78000,
        "documents": [{"name": "Specificații", "complete": True, "source": "fixture://syn-002/spec", "page": 1, "offset": 12}],
        "bids": [],
    },
]

def all_tenders() -> list[dict]:
    return deepcopy(SYNTHETIC_TENDERS)

def get_tender(tender_id: str) -> dict | None:
    return next((deepcopy(x) for x in SYNTHETIC_TENDERS if x["id"] == tender_id), None)
