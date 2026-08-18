# Inventory

Package for MOD-INV and owner of StockItem writes, availability, allocation, and inventory invariants.

`service.py` is this module's public application interface: create/get/list/
update/delete for `StockItem`. `create_stock_item` requires a `product_id` and
validates it via Touristic Product Management's own `service.get_product`
before writing the `REPRESENTS_PRODUCT` edge.
