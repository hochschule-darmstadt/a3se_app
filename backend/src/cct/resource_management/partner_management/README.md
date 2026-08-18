# Partner Management

Package for MOD-SM and owner of Organisation and OrgaRole writes and invariants.

`service.py` is this module's public application interface: create/get/list/
update/delete for `Organisation`, plus role operations nested under an
Organisation (`create_orga_role`, `get_orga_role`, `list_orga_roles`,
`update_orga_role`, `delete_orga_role`). `get_orga_role` also serves as the
read Touristic Product Management calls to validate a `SUPPLIED_BY` reference
before writing it. `cct.api` calls these functions only.
