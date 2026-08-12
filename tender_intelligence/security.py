from html import escape
from urllib.parse import urlparse

ALLOWED_SCHEMES = {"fixture"}

def safe_text(value: object) -> str:
    return escape(str(value), quote=True)

def allowed_source(url: str) -> bool:
    parsed = urlparse(url)
    return parsed.scheme in ALLOWED_SCHEMES and (not parsed.netloc or parsed.netloc.startswith("syn-"))
