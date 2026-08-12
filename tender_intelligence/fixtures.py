"""Shared synthetic fixtures used by the UI and the local Python adapter."""
import json
import re
from copy import deepcopy
from pathlib import Path

SOURCE = Path(__file__).parent.parent / "shared" / "tenders.json"
SYNTHETIC_TENDERS = json.loads(SOURCE.read_text(encoding="utf-8"))

def _normalise(t: dict) -> dict:
    t = deepcopy(t)
    t["documents"] = [{"name":d[0],"complete":d[1],"source":f"fixture://{t['id'].lower()}/{re.sub(r'[^a-z0-9]+','-',d[0].lower()).strip('-')}","page":d[2],"offset":d[2]*117,"snippet":d[3]} for d in t.pop("docs")]
    t["bids"] = [{"firm":b[0],"price_mdl":b[1],"quality":b[2],"delivery_days":b[3],"status":b[4]} for b in t["bids"]]
    return t

def all_tenders() -> list[dict]: return [_normalise(x) for x in SYNTHETIC_TENDERS]
def get_tender(tender_id: str) -> dict | None:
    return next((_normalise(x) for x in SYNTHETIC_TENDERS if x["id"] == tender_id), None)
