from html import escape
from urllib.parse import urlparse
import re

ALLOWED_SCHEMES = {"fixture"}

def safe_text(value: object) -> str:
    return escape(str(value), quote=True)

def allowed_source(url: str) -> bool:
    parsed = urlparse(url)
    return bool(re.fullmatch(r"fixture://syn-[a-z0-9-]+/[a-z0-9-]+", url)) and parsed.scheme == 'fixture' and bool(parsed.netloc) and not parsed.username and not parsed.password and not parsed.query and not parsed.fragment and '..' not in parsed.path
