"""Deterministic dossier logic; no inference or external service is involved."""
GATE_NAMES = ("identitate", "calendar", "buget", "criterii", "documente")

def dossier(tender: dict) -> dict:
    docs = tender.get("documents", [])
    checks = {
        "identitate": bool(tender.get("title") and tender.get("buyer")),
        "calendar": bool(tender.get("deadline")),
        "buget": tender.get("value_eur", 0) > 0,
        "criterii": any(d["name"] == "Criterii de atribuire" and d["complete"] for d in docs),
        "documente": all(d.get("complete", False) for d in docs),
    }
    score = sum(checks.values())
    return {"checks": checks, "score": score, "max_score": 5, "gate": "ready" if score == 5 else "blocked", "label": "Pregătit" if score == 5 else "Blocat"}

def compare_bids(tender: dict) -> list[dict]:
    return sorted(tender.get("bids", []), key=lambda bid: bid["price_eur"])

def completeness(tender: dict) -> dict:
    docs = tender.get("documents", [])
    complete = sum(bool(d.get("complete")) for d in docs)
    return {"complete": complete, "total": len(docs), "items": docs}
