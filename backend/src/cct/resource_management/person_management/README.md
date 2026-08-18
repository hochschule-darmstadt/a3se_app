# Person Management

Package for MOD-CM and owner of Person and PersonRole writes and invariants.

`service.py` is this module's public application interface: create/get/list/
update/delete for `Person`, plus role operations nested under a Person
(`create_person_role`, `get_person_role`, `list_person_roles`,
`update_person_role`, `delete_person_role`). `cct.api` calls these functions
only; it never touches `models.py`'s contracts or the repository directly.
