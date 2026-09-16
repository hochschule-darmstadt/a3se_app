"""Export the compiled travel-composition LangGraph as a Mermaid diagram.

The diagram is generated from the compiled graph, not drawn by hand, so the
documentation cannot silently diverge from the executable node/edge topology.

Usage: python backend/scripts/export_travel_agent_graph.py [output_path]
"""

from __future__ import annotations

from pathlib import Path
import sys

from cct.core_processes.customer_care.travel_agent_workflow import TravelAgentWorkflow

DEFAULT_OUTPUT = (
    Path(__file__).parents[2] / "docs" / "architecture" / "software-architecture" / "travel-agent-graph.mmd"
)


def render_mermaid() -> str:
    """Return LangGraph's own Mermaid rendering with normalized line endings."""
    return TravelAgentWorkflow().graph.get_graph().draw_mermaid().strip() + "\n"


def main() -> None:
    output_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUTPUT
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(render_mermaid(), encoding="utf-8", newline="\n")
    print(f"Wrote travel-agent graph to {output_path}")


if __name__ == "__main__":
    main()
