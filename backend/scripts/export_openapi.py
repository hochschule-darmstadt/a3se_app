"""Export the FastAPI OpenAPI document without a live database.

Usage: python backend/scripts/export_openapi.py [output_path]
"""

from __future__ import annotations

import json
from pathlib import Path
import sys

from cct.api.app import create_app

DEFAULT_OUTPUT = Path(__file__).parents[2] / "frontend" / "packages" / "api-client" / "generated" / "openapi.json"


def main() -> None:
    output_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUTPUT
    output_path.parent.mkdir(parents=True, exist_ok=True)
    schema = create_app().openapi()
    output_path.write_text(json.dumps(schema, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"Wrote OpenAPI document to {output_path}")


if __name__ == "__main__":
    main()
