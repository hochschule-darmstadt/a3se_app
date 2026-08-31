import unittest

from cct.resource_management.contracts import EntityKind
from cct.resource_management.id_policy import format_entity_id, format_position_id


class IdentifierPolicyTest(unittest.TestCase):
    def test_root_ids_are_fixed_width_and_prefixed(self):
        self.assertEqual("PER-000123", format_entity_id(EntityKind.PERSON, 123))
        self.assertEqual("ORD-999999", format_entity_id(EntityKind.ORDER_ITEM, 999999))

    def test_position_ids_are_scoped_to_the_order(self):
        self.assertEqual("ORD-000123-P01", format_position_id("ORD-000123", 1))
        self.assertEqual("ORD-000123-P12", format_position_id("ORD-000123", 12))

    def test_sequences_reject_overflow(self):
        with self.assertRaises(ValueError):
            format_entity_id(EntityKind.PERSON, 1_000_000)
        with self.assertRaises(ValueError):
            format_position_id("ORD-000123", 100)
