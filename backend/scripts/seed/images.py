"""TERM-010 image metadata helpers.

Structural validation (HTTPS-only, required-field-whenever-imageUrl-present,
alt-text-not-derived-from-filename) already happens in `schema.ImageSeed`.
This module only does the two things that validation layer cannot: picking
which product gets which image record (a plain 1:1 lookup, since issue #12
scopes images to "at least one per representative resource", not every
product instance) and expressing the portal fallback contract seed data
hands downstream consumers.

The actual fallback *rendering* is a frontend concern (issue #22, not yet
built); what seed data guarantees is that a product with no image record
simply has no `imageUrl` property at all -- absence, not a broken link -- so
a future client can deterministically decide to show its own fallback
graphic whenever the property is missing, without needing to probe a URL.
"""

from __future__ import annotations

from . import schema

FALLBACK_IMAGE_ALT_TEXT = "Portal image unavailable for this resource."


def index_images_by_product(images: tuple[schema.ImageSeed, ...]) -> dict[str, schema.ImageSeed]:
    return {image.product_id: image for image in images}


def image_properties(image: schema.ImageSeed | None) -> dict[str, object]:
    """Property fragment to merge into a product's properties, or empty."""

    if image is None:
        return {}
    return {
        "imageUrl": image.image_url,
        "imageSourcePageUrl": image.image_source_page_url,
        "imageCreatorCredit": image.image_creator_credit,
        "imageLicenceCode": image.image_licence_code,
        "imageLicenceVersion": image.image_licence_version,
        "imageAttributionText": image.image_attribution_text,
        "imageAltText": image.image_alt_text,
        "imageVerifiedDate": _parse_iso_date(image.image_verified_date),
    }


def _parse_iso_date(value: str):  # -> datetime.date
    from datetime import date

    return date.fromisoformat(value)
