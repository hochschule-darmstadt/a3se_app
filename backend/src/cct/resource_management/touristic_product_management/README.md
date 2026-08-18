# Touristic Product Management

Package for MOD-TPM and owner of TouristicProductItem writes, recursive stored structures, and invariants.

`service.py` is this module's public application interface: create/get/list/
update/delete for `TouristicProductItem`, `create_product`'s optional
`parent_product_id` for recursive `CONTAINS` composition (a package
containing a flight, accommodation, and excursion, where the excursion itself
contains insurance, is a real expected shape, not just the simple
flight-with-seats case), `get_component_tree` for a defensively depth-capped
recursive read, and `set_supplier` which validates the referenced OrgaRole via
Partner Management's own `service.get_orga_role` before writing `SUPPLIED_BY`.
