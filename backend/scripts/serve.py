"""Run the API locally against a real Neo4j instance.

Usage: python backend/scripts/serve.py
Reads CCT_NEO4J_URI / CCT_NEO4J_USER / CCT_NEO4J_PASSWORD / CCT_NEO4J_DATABASE
(only the password is required; the rest default to the same localhost/
Community values used elsewhere in this repository). CCT_API_HOST defaults
to loopback-only (127.0.0.1, matching deployment-architecture.md's intended
host-side exposure); the Docker Compose `api` service (DR-0014) overrides it
to 0.0.0.0 so the process is reachable across the container network -- the
host port mapping is still the only thing exposed to the host.

This is the one place in the repository allowed to import both cct.api and
cct.infrastructure -- see DR-0013 and this directory's README.
"""

from __future__ import annotations

import os

from neo4j import GraphDatabase
import uvicorn

from cct.api.app import create_app
from cct.api.dependencies import ApiDependencies
from cct.core_processes.customer_care.advisor import QdrantKnowledgeIndex, create_default_advisor_service
from cct.core_processes.customer_care.travel_intent_extraction import create_default_travel_intent_extractor
from cct.infrastructure.neo4j.entity_repository import COMMUNITY_SCHEMA, Neo4jEntityRepository
from cct.resource_management.contracts import EntityKind
from cct.resource_management.default_registry import create_entity_registry
from cct.resource_management.repository_ports import ScopedEntityRepository
from seed.orchestrator import build_repositories, reset_seed_data, run_seed
from startup_state import (
    build_source_manifest,
    force_requested,
    index_is_required,
    load_manifest,
    manifest_path,
    project_root_for,
    rebuild_advisor_index,
    seed_is_required,
    write_manifest,
)


def build_dependencies(driver, database: str) -> ApiDependencies:
    registry = create_entity_registry()
    repository = Neo4jEntityRepository(driver, database, registry)

    def scoped(*kinds: EntityKind) -> ScopedEntityRepository:
        return ScopedEntityRepository(repository, allowed_kinds=frozenset(kinds))

    return ApiDependencies(
        person_repository=scoped(EntityKind.PERSON, EntityKind.PERSON_ROLE),
        partner_repository=scoped(EntityKind.ORGANISATION, EntityKind.ORGA_ROLE),
        product_repository=scoped(EntityKind.TOURISTIC_PRODUCT_ITEM),
        stock_repository=scoped(EntityKind.STOCK_ITEM),
        order_repository=scoped(EntityKind.ORDER_ITEM),
    )


def main() -> None:
    uri = os.environ.get("CCT_NEO4J_URI", "bolt://localhost:7687")
    user = os.environ.get("CCT_NEO4J_USER", "neo4j")
    password = os.environ["CCT_NEO4J_PASSWORD"]
    database = os.environ.get("CCT_NEO4J_DATABASE", "neo4j")

    driver = GraphDatabase.driver(uri, auth=(user, password))
    try:
        driver.verify_connectivity()
        with driver.session(database=database) as session:
            for statement in COMMUNITY_SCHEMA:
                session.run(statement).consume()

        project_root = project_root_for(__file__)
        current_manifest = build_source_manifest(project_root)
        previous_manifest = load_manifest(manifest_path())
        with driver.session(database=database) as session:
            database_has_data = session.run("MATCH (n) RETURN count(n) > 0 AS has_data").single()["has_data"]
        seed_required = seed_is_required(
            previous_manifest,
            current_manifest,
            force=force_requested(),
            database_has_data=database_has_data,
        )
        index_required = index_is_required(previous_manifest, current_manifest, seed_required=seed_required)
        if seed_required:
            reset_seed_data(driver, database)
            run_seed(build_repositories(driver, database))

        app = create_app()
        app.state.dependencies = build_dependencies(driver, database)
        index_path = os.environ.get("CCT_ADVISOR_INDEX_PATH", "/var/lib/cct/advisor-index")
        index_missing = not QdrantKnowledgeIndex.collection_exists(index_path)
        if index_required or index_missing:
            rebuild_advisor_index(
                app.state.dependencies.product_repository,
                app.state.dependencies.partner_repository,
                project_root,
            )
        app.state.advisor_service = create_default_advisor_service()
        app.state.travel_intent_extractor = create_default_travel_intent_extractor()
        write_manifest(current_manifest)
        host = os.environ.get("CCT_API_HOST", "127.0.0.1")
        uvicorn.run(app, host=host, port=8000)
    finally:
        driver.close()


if __name__ == "__main__":
    main()
