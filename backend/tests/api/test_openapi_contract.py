"""Contract checks against the whole generated OpenAPI document (openapi.md)."""

from __future__ import annotations

import unittest

from cct.api.app import create_app

HTTP_METHODS = ("get", "post", "put", "delete", "patch")
MUTATING_METHODS = ("post", "put", "delete", "patch")


class OpenApiContractTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.schema = create_app().openapi()

    def operations(self):
        for path, methods in self.schema["paths"].items():
            for method, operation in methods.items():
                if method in HTTP_METHODS:
                    yield path, method, operation

    def test_every_operation_has_a_stable_unique_operation_id(self) -> None:
        operation_ids = [operation["operationId"] for _, _, operation in self.operations()]
        self.assertEqual(len(operation_ids), len(set(operation_ids)), "duplicate operationId found")
        self.assertTrue(all(operation_ids), "empty operationId found")

    def test_every_operation_has_a_domain_tag(self) -> None:
        for path, method, operation in self.operations():
            with self.subTest(path=path, method=method):
                self.assertTrue(operation.get("tags"), f"{method.upper()} {path} has no tag")

    def test_every_operation_has_a_summary_or_explicit_id_only(self) -> None:
        # FastAPI derives a summary from the function name when none is given;
        # every operation must at least resolve to a non-empty summary.
        for path, method, operation in self.operations():
            with self.subTest(path=path, method=method):
                self.assertTrue(operation.get("summary"))

    def test_mutating_operations_declare_a_success_status_and_error_responses(self) -> None:
        for path, method, operation in self.operations():
            if method not in MUTATING_METHODS:
                continue
            with self.subTest(path=path, method=method):
                responses = operation["responses"]
                success_codes = [code for code in responses if code.startswith(("2",))]
                self.assertTrue(success_codes, f"{method.upper()} {path} declares no success response")
                # every mutating operation in this API can at least fail validation
                self.assertIn("422", responses, f"{method.upper()} {path} missing 422 response")

    def test_error_responses_use_the_shared_error_schema(self) -> None:
        for path, method, operation in self.operations():
            for code, response in operation["responses"].items():
                if not code.startswith(("4", "5")):
                    continue
                with self.subTest(path=path, method=method, code=code):
                    content = response.get("content", {}).get("application/json", {})
                    schema_ref = content.get("schema", {}).get("$ref", "")
                    self.assertTrue(
                        schema_ref.endswith("ErrorResponse") or "$ref" in content.get("schema", {}).get("items", {}),
                        f"{method.upper()} {path} {code} does not use ErrorResponse: {content}",
                    )

    def test_discriminated_union_request_schemas_use_one_of(self) -> None:
        # FastAPI nests a discriminated union inside the property that holds it
        # (e.g. PersonRoleCreateRequest.properties.role), not at the schema's
        # own top level.
        components = self.schema["components"]["schemas"]
        discriminated_fields = [
            (name, field_name)
            for name, schema in components.items()
            for field_name, field_schema in schema.get("properties", {}).items()
            if "discriminator" in field_schema
        ]
        self.assertTrue(discriminated_fields, "expected at least one discriminated-union request field")
        for name, field_name in discriminated_fields:
            with self.subTest(schema=name, field=field_name):
                field_schema = components[name]["properties"][field_name]
                self.assertIn("oneOf", field_schema)
                self.assertIn("propertyName", field_schema["discriminator"])
                self.assertIn("mapping", field_schema["discriminator"])

    def test_mutating_routes_do_not_expose_actor_as_a_request_parameter(self) -> None:
        # The actor placeholder is a pure dependency (no request shape), so it
        # must never leak into the visible parameter/body schema.
        for path, method, operation in self.operations():
            if method not in MUTATING_METHODS:
                continue
            with self.subTest(path=path, method=method):
                for parameter in operation.get("parameters", []):
                    self.assertNotIn("actor", parameter["name"].lower())

    def test_pagination_query_parameters_are_bounded(self) -> None:
        # Nested collections (roles under a person/organisation, positions under
        # an order) are bounded by their owner and deliberately not paginated;
        # only true top-level, path-param-free list endpoints must bound `limit`.
        list_paths = [
            (path, method, operation)
            for path, method, operation in self.operations()
            if method == "get" and operation["operationId"].startswith("list") and "{" not in path
        ]
        self.assertTrue(list_paths)
        for path, method, operation in list_paths:
            with self.subTest(path=path, method=method):
                names = {parameter["name"] for parameter in operation.get("parameters", [])}
                self.assertIn("limit", names)


if __name__ == "__main__":
    unittest.main()
