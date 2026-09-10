"""Rebuild the local grounded-advisor index from the current seeded catalogue."""

from __future__ import annotations

import os

from neo4j import GraphDatabase

from cct.core_processes.customer_care.advisor import create_default_advisor_service, glossary_documents, product_documents
from cct.infrastructure.neo4j.entity_repository import COMMUNITY_SCHEMA

from serve import build_dependencies


def main() -> None:
    uri = os.environ.get("CCT_NEO4J_URI", "bolt://localhost:7687")
    user = os.environ.get("CCT_NEO4J_USER", "neo4j")
    password = os.environ["CCT_NEO4J_PASSWORD"]
    database = os.environ.get("CCT_NEO4J_DATABASE", "neo4j")
    driver = GraphDatabase.driver(uri, auth=(user, password))
    try:
        with driver.session(database=database) as session:
            for statement in COMMUNITY_SCHEMA:
                session.run(statement).consume()
        dependencies = build_dependencies(driver, database)
        glossary_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "docs", "requirements", "glossary.md")
        create_default_advisor_service(
            product_documents(dependencies.product_repository) + glossary_documents(glossary_path)
        )
        print("Rebuilt the local advisor index")
    finally:
        driver.close()


if __name__ == "__main__":
    main()
