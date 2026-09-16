"""The documented LangGraph diagram must match the compiled graph topology."""

from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from unittest import TestCase

ROOT = Path(__file__).parents[4]
SCRIPT = ROOT / "backend" / "scripts" / "export_travel_agent_graph.py"


class TravelAgentGraphDiagramTest(TestCase):
    def test_committed_mermaid_matches_compiled_graph(self) -> None:
        spec = spec_from_file_location("export_travel_agent_graph", SCRIPT)
        module = module_from_spec(spec)
        spec.loader.exec_module(module)
        committed = module.DEFAULT_OUTPUT.read_text(encoding="utf-8")
        self.assertEqual(
            committed, module.render_mermaid(),
            "Regenerate with: python backend/scripts/export_travel_agent_graph.py",
        )
