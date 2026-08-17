"""Backend unit tests, grouped by production module."""

from pathlib import Path
import sys


# Let the repository check exercise the src layout before an editable install.
SOURCE_ROOT = Path(__file__).parents[2] / "src"
if str(SOURCE_ROOT) not in sys.path:
    sys.path.insert(0, str(SOURCE_ROOT))
