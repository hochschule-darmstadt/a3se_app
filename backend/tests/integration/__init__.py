"""Backend integration tests."""

from pathlib import Path
import sys


SOURCE_ROOT = Path(__file__).parents[2] / "src"
if str(SOURCE_ROOT) not in sys.path:
    sys.path.insert(0, str(SOURCE_ROOT))
