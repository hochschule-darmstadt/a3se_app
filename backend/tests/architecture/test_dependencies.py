"""Static dependency tests for the CCT modular Python package."""

from __future__ import annotations

import ast
from collections import defaultdict
from pathlib import Path
import unittest


SOURCE_ROOT = Path(__file__).parents[2] / "src"
CCT_ROOT = SOURCE_ROOT / "cct"
REPOSITORY_ROOT = Path(__file__).parents[3]
TOP_LEVEL = {"api", "core_processes", "resource_management", "infrastructure"}


def _module_name(path: Path) -> str:
    relative = path.relative_to(SOURCE_ROOT).with_suffix("")
    parts = relative.parts
    if parts[-1] == "__init__":
        parts = parts[:-1]
    return ".".join(parts)


def _imports(path: Path) -> set[str]:
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    discovered: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            discovered.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            discovered.add(node.module)
    return discovered


def _area(module: str) -> str | None:
    parts = module.split(".")
    return parts[1] if len(parts) > 1 and parts[0] == "cct" else None


class ArchitectureDependenciesTest(unittest.TestCase):
    """Enforce the static package constraints accepted for issue #19."""

    def setUp(self) -> None:
        self.dependencies: dict[str, set[str]] = {}
        for path in CCT_ROOT.rglob("*.py"):
            self.dependencies[_module_name(path)] = _imports(path)

    def test_expected_top_level_packages_exist(self) -> None:
        actual = {path.name for path in CCT_ROOT.iterdir() if path.is_dir()}
        self.assertTrue(TOP_LEVEL.issubset(actual))

    def test_layer_direction_and_adapter_boundaries(self) -> None:
        forbidden = {
            "resource_management": {"api", "core_processes", "infrastructure"},
            "core_processes": {"api", "infrastructure"},
            "api": {"infrastructure"},
        }
        violations: list[str] = []
        for importer, imports in self.dependencies.items():
            importer_area = _area(importer)
            prohibited = forbidden.get(importer_area, set())
            for imported in imports:
                if _area(imported) in prohibited:
                    violations.append(f"{importer} -> {imported}")
        self.assertEqual([], violations)

    def test_neo4j_driver_is_confined_to_neo4j_infrastructure(self) -> None:
        violations = [
            f"{importer} -> {imported}"
            for importer, imports in self.dependencies.items()
            for imported in imports
            if imported == "neo4j" or imported.startswith("neo4j.")
            if not importer.startswith("cct.infrastructure.neo4j")
        ]
        self.assertEqual([], violations)

    def test_framework_adapters_do_not_leak_into_business_modules(self) -> None:
        violations = [
            f"{importer} -> {imported}"
            for importer, imports in self.dependencies.items()
            for imported in imports
            if imported == "fastapi" or imported.startswith("fastapi.")
            if not importer.startswith("cct.api")
        ]
        self.assertEqual([], violations)

    def test_modules_do_not_import_another_modules_internal_persistence(self) -> None:
        internal_names = {"_internal", "internal", "persistence", "repository", "repositories"}
        violations: list[str] = []
        for importer, imports in self.dependencies.items():
            importer_parts = importer.split(".")
            importer_module = tuple(importer_parts[:3])
            for imported in imports:
                imported_parts = imported.split(".")
                imported_module = tuple(imported_parts[:3])
                if (
                    imported.startswith("cct.")
                    and importer_module != imported_module
                    and internal_names.intersection(imported_parts[3:])
                ):
                    violations.append(f"{importer} -> {imported}")
        self.assertEqual([], violations)

    def test_scaffold_directories_are_documented(self) -> None:
        ignored = {"__pycache__", "build", "dist", ".react-router", "node_modules"}
        undocumented: list[str] = []
        for root_name in ("frontend", "backend"):
            for directory in (REPOSITORY_ROOT / root_name).rglob("*"):
                if (
                    not directory.is_dir()
                    or ignored.intersection(directory.parts)
                    or directory.name.endswith(".egg-info")
                ):
                    continue
                if not (directory / "README.md").exists():
                    undocumented.append(str(directory.relative_to(REPOSITORY_ROOT)))
        self.assertEqual([], undocumented)

    def test_internal_package_dependencies_are_acyclic(self) -> None:
        graph: dict[str, set[str]] = defaultdict(set)
        for importer, imports in self.dependencies.items():
            importer_package = ".".join(importer.split(".")[:3])
            for imported in imports:
                if imported.startswith("cct."):
                    imported_package = ".".join(imported.split(".")[:3])
                    if importer_package != imported_package:
                        graph[importer_package].add(imported_package)

        visiting: set[str] = set()
        visited: set[str] = set()

        def visit(module: str, path: tuple[str, ...]) -> None:
            if module in visiting:
                self.fail("dependency cycle: " + " -> ".join((*path, module)))
            if module in visited:
                return
            visiting.add(module)
            for dependency in graph[module]:
                visit(dependency, (*path, module))
            visiting.remove(module)
            visited.add(module)

        for module in tuple(graph):
            visit(module, ())


if __name__ == "__main__":
    unittest.main()
