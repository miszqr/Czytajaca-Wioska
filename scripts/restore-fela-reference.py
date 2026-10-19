"""Restore the unchanged reference PNG from its transport-safe archive."""
import base64
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
archive = root / "docs/references/fela-original"
manifest = json.loads((archive / "manifest.json").read_text())
encoded = "".join((archive / name).read_text().strip() for name in manifest["parts"])
data = base64.b64decode(encoded, validate=True)
if len(data) != manifest["bytes"] or hashlib.sha256(data).hexdigest() != manifest["sha256"]:
    raise SystemExit("Archive integrity check failed; the output was not written.")
target = archive.parent / manifest["filename"]
if target.exists() and target.read_bytes() != data:
    raise SystemExit(f"Refusing to replace a different file: {target}")
if not target.exists():
    target.write_bytes(data)
print(f"Verified: {target} ({len(data)} bytes, SHA-256 {manifest['sha256']})")
