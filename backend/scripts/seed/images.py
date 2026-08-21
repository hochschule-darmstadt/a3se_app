"""TERM-010 image metadata helpers.

This module picks which product gets which image record (a plain 1:1
lookup, since issue #12 scopes images to "at least one per representative
resource", not every product instance) and expresses the portal fallback
contract seed data hands downstream consumers.

The actual fallback *rendering* is a frontend concern (issue #22, not yet
built); what seed data guarantees is that a product with no image record
simply has no `imageUrl` property at all -- absence, not a broken link -- so
a future client can deterministically decide to show its own fallback
graphic whenever the property is missing, without needing to probe a URL.
"""

from __future__ import annotations

from . import schema


def index_images_by_product(images: tuple[schema.ImageSeed, ...]) -> dict[str, schema.ImageSeed]:
    return {image.product_id: image for image in images}


def image_properties(image: schema.ImageSeed | None) -> dict[str, object]:
    """Property fragment to merge into a product's properties, or empty."""

    if image is None:
        return {}
    return {"imageUrl": image.image_url}
