"""Load the issue #12 deterministic seed data into a real Neo4j instance.

Usage:
    python backend/scripts/seed_data.py           # fresh disposable database, then load
    python backend/scripts/seed_data.py --reset    # accepted for compatibility; same behavior

Reads CCT_NEO4J_URI / CCT_NEO4J_USER / CCT_NEO4J_PASSWORD / CCT_NEO4J_DATABASE
(only the password is required; the rest default to the same localhost/
Community values `serve.py` uses). Validates every seed source before
writing anything; on success prints a deterministic per-kind created/
already-present summary.
"""

from __future__ import annotations

import argparse
import os
import sys

from neo4j import GraphDatabase

from seed.orchestrator import build_repositories, ensure_schema, reset_seed_data, run_seed


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--reset", action="store_true", help="delete known seed entities (by ID prefix) before loading"
    )
    args = parser.parse_args()

    uri = os.environ.get("CCT_NEO4J_URI", "bolt://localhost:7687")
    user = os.environ.get("CCT_NEO4J_USER", "neo4j")
    password = os.environ["CCT_NEO4J_PASSWORD"]
    database = os.environ.get("CCT_NEO4J_DATABASE", "neo4j")

    driver = GraphDatabase.driver(uri, auth=(user, password))
    try:
        driver.verify_connectivity()
        ensure_schema(driver, database)
        # Seed data is an inspection fixture. Always start from an empty graph
        # so stale hand-created records and prior schema versions cannot leak
        # into the app. --reset remains accepted for compatibility.
        reset_seed_data(driver, database)
        repos = build_repositories(driver, database)
        summary = run_seed(repos)
        print(summary.report())
    finally:
        driver.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
