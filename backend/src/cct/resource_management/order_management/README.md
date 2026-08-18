# Order Management

Package for MOD-OM and owner of OrderItem writes, order structures, and order invariants.

`service.py` is this module's public application interface. `order/header` is
the aggregate root (create/get/list/update/delete); `order/position` is
nested under its header (create/get/list/delete, no update -- it has no
properties of its own, only relationships). `allocate_stock` and
`assign_traveller`/`assign_customer` validate their cross-module reference via
Inventory's `service.get_stock_item` or Person Management's
`service.get_person_role` before writing the edge. `get_order_detail`
delegates to the repository's bounded, id-only summary of a header's
positions (stock/product/supplier/traveller), never a raw graph read.
