def cited_claim(tender: dict) -> dict:
    docs = tender.get("documents", [])
    evidence = [{"id": f"E{i+1}", "source": d["source"], "page": d["page"], "offset": d["offset"]} for i, d in enumerate(docs)]
    return {"claim": f"Dosarul {tender['id']} are {len(tender.get('bids', []))} oferte în comparație.", "evidence_ids": [x["id"] for x in evidence], "confidence": "medie" if evidence else "scăzută", "uncertainty": "Date demonstrative; confirmarea documentelor rămâne necesară.", "evidence": evidence}
