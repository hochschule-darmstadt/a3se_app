"""Keyset pagination boundary and cursor round-trip tests."""

from __future__ import annotations

import base64
import unittest

from cct.resource_management.pagination import (
    MAX_LIMIT,
    MIN_LIMIT,
    PageRequest,
    decode_cursor,
    encode_cursor,
)


class PageRequestBoundsTest(unittest.TestCase):
    def test_default_limit_is_within_bounds(self) -> None:
        request = PageRequest()
        self.assertTrue(MIN_LIMIT <= request.limit <= MAX_LIMIT)

    def test_minimum_and_maximum_limit_are_accepted(self) -> None:
        PageRequest(limit=MIN_LIMIT)
        PageRequest(limit=MAX_LIMIT)

    def test_limit_below_minimum_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            PageRequest(limit=MIN_LIMIT - 1)

    def test_limit_above_maximum_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            PageRequest(limit=MAX_LIMIT + 1)


class CursorRoundTripTest(unittest.TestCase):
    def test_cursor_round_trips_the_last_entity_id(self) -> None:
        cursor = encode_cursor("I21-ORDER-01")
        self.assertEqual("I21-ORDER-01", decode_cursor(cursor))

    def test_cursor_is_opaque_not_the_raw_identifier(self) -> None:
        cursor = encode_cursor("I21-ORDER-01")
        self.assertNotEqual("I21-ORDER-01", cursor)

    def test_structurally_invalid_cursor_is_rejected(self) -> None:
        with self.assertRaises(ValueError):
            decode_cursor("a")

    def test_cursor_not_encoding_valid_utf8_is_rejected(self) -> None:
        malformed = base64.urlsafe_b64encode(b"\xff\xfe").decode("ascii")
        with self.assertRaises(ValueError):
            decode_cursor(malformed)


if __name__ == "__main__":
    unittest.main()
