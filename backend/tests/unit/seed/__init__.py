"""Unit tests for the issue #12 seed package (backend/scripts/seed/).

That package lives outside `backend/src` (see backend/scripts/README.md --
same composition-root exemption as `serve.py`), so it is not on `sys.path`
by the mechanism that makes `cct` importable during test discovery. This
package-level import adds `backend/scripts` once, before any test module
in this directory runs.
"""

import sys
from pathlib import Path

_SCRIPTS_DIR = Path(__file__).resolve().parents[3] / "scripts"
if str(_SCRIPTS_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS_DIR))
