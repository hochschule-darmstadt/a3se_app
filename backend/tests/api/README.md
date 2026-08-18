# API and Contract Tests

One `test_<resource>_api.py` per router, using `fastapi.testclient.TestClient`
with explicit `app.dependency_overrides` (never a real Neo4j connection) per
`docs/implementation/fastapi.md`. Each covers success paths, 404/409/422
error mapping, pagination, and that mutating routes depend on the actor
placeholder while read routes do not. `test_openapi_contract.py` (once every
router exists) asserts operation-id uniqueness, tags, status codes, and
discriminated-union schemas across the whole surface.
