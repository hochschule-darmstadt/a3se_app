"""Persisted fingerprints for deterministic seed data and the advisor index."""

from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import Any

from cct.core_processes.customer_care.advisor import (
    create_default_advisor_service,
    glossary_documents,
    product_documents,
)


def project_root_for(script_file: str | Path) -> Path:
    """Resolve the repository root both on the host and in the API image."""
    script_path = Path(script_file).resolve()
    host_root = script_path.parents[2]
    if (host_root / "docs").is_dir():
        return host_root
    return script_path.parents[1]


def manifest_path() -> Path:
    return Path(os.environ.get("CCT_SEED_STATE_PATH", "/var/lib/cct/advisor-state/source-manifest.json"))


def _hash_files(files: list[Path], root: Path) -> str:
    digest = hashlib.sha256()
    for path in sorted(files, key=lambda item: item.as_posix()):
        relative = path.relative_to(root).as_posix()
        digest.update(relative.encode("utf-8"))
        digest.update(b"\0")
        digest.update(path.read_bytes())
        digest.update(b"\0")
    return digest.hexdigest()


def _hash_values(values: dict[str, Any]) -> str:
    payload = json.dumps(values, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def build_source_manifest(project_root: Path) -> dict[str, Any]:
    sources = project_root / "scripts" / "seed" / "sources"
    glossary = project_root / "docs" / "requirements" / "glossary.md"
    seed_files = sorted(sources.glob("*.json"))
    product_source = sources / "products.json"
    seed_logic_files = [
        project_root / "scripts" / "seed" / "orchestrator.py",
        project_root / "scripts" / "seed" / "loader.py",
        project_root / "scripts" / "seed" / "schema.py",
        project_root / "scripts" / "seed" / "inventory.py",
    ]
    index_logic_files = [
        project_root / "src" / "cct" / "core_processes" / "customer_care" / "advisor.py",
        project_root / "src" / "cct" / "resource_management" / "touristic_product_management" / "search.py",
    ]
    required = [*seed_files, glossary, *seed_logic_files, *index_logic_files]
    missing = [str(path) for path in required if not path.is_file()]
    if missing:
        raise FileNotFoundError(f"Cannot build startup manifest; missing files: {', '.join(missing)}")

    seed_input_hash = _hash_files(seed_files, project_root)
    index_input_hash = _hash_files([product_source, glossary], project_root)
    seed_logic_hash = _hash_files(seed_logic_files, project_root)
    index_logic_hash = _hash_files(index_logic_files, project_root)
    seed_fingerprint = _hash_values({"seedInputHash": seed_input_hash, "seedLogicHash": seed_logic_hash})
    index_fingerprint = _hash_values(
        {
            "indexInputHash": index_input_hash,
            "indexLogicHash": index_logic_hash,
            "embeddingModel": "sentence-transformers/all-MiniLM-L6-v2",
            "indexSchemaVersion": 1,
            "ollamaModel": os.environ.get("CCT_OLLAMA_MODEL", "qwen3:8b"),
        }
    )
    return {
        "manifestVersion": 1,
        "seedInputHash": seed_input_hash,
        "seedLogicHash": seed_logic_hash,
        "seedFingerprint": seed_fingerprint,
        "indexInputHash": index_input_hash,
        "indexLogicHash": index_logic_hash,
        "indexFingerprint": index_fingerprint,
    }


def load_manifest(path: Path | None = None) -> dict[str, Any] | None:
    target = path or manifest_path()
    try:
        value = json.loads(target.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return None
    return value if isinstance(value, dict) else None


def write_manifest(manifest: dict[str, Any], path: Path | None = None) -> None:
    target = path or manifest_path()
    target.parent.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile("w", encoding="utf-8", dir=target.parent, delete=False) as temporary:
        json.dump(manifest, temporary, indent=2, sort_keys=True)
        temporary.write("\n")
        temporary_path = Path(temporary.name)
    os.replace(temporary_path, target)


def seed_is_required(previous: dict[str, Any] | None, current: dict[str, Any], *, force: bool, database_has_data: bool) -> bool:
    return force or not database_has_data or previous is None or previous.get("seedFingerprint") != current["seedFingerprint"]


def index_is_required(previous: dict[str, Any] | None, current: dict[str, Any], *, seed_required: bool) -> bool:
    return seed_required or previous is None or previous.get("indexFingerprint") != current["indexFingerprint"]


def force_requested() -> bool:
    return os.environ.get("CCT_FORCE_SEED", "").casefold() in {"1", "true", "yes", "on"}


def rebuild_advisor_index(product_repository, partner_repository, project_root: Path) -> None:
    glossary_path = project_root / "docs" / "requirements" / "glossary.md"
    documents = product_documents(product_repository, partner_repository) + glossary_documents(glossary_path)
    create_default_advisor_service(documents, rebuild=True)
