"""Unit tests for seed.images's lookup/merge helpers."""

from __future__ import annotations

import unittest
from datetime import date

from seed import images, schema


def _image(product_id: str = "ACC-01") -> schema.ImageSeed:
    return schema.ImageSeed.model_validate(
        {
            "productId": product_id,
            "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Example.jpg",
            "imageSourcePageUrl": "https://commons.wikimedia.org/wiki/File:Example.jpg",
            "imageCreatorCredit": "Example Creator",
            "imageLicenceCode": "CC-BY-SA-4.0",
            "imageLicenceVersion": "4.0",
            "imageAttributionText": "Example Creator, CC BY-SA 4.0, via Wikimedia Commons",
            "imageAltText": "A bright double hotel room with a large window.",
            "imageVerifiedDate": "2026-08-18",
        }
    )


class IndexImagesByProductTest(unittest.TestCase):
    def test_indexes_by_product_id(self) -> None:
        index = images.index_images_by_product((_image("ACC-01"), _image("FLT-01")))
        self.assertEqual({"ACC-01", "FLT-01"}, set(index))


class ImagePropertiesTest(unittest.TestCase):
    def test_no_image_yields_empty_properties(self) -> None:
        self.assertEqual({}, images.image_properties(None))

    def test_image_yields_every_term_010_property(self) -> None:
        props = images.image_properties(_image())
        self.assertEqual("https://commons.wikimedia.org/wiki/Special:FilePath/Example.jpg", props["imageUrl"])
        self.assertEqual("CC-BY-SA-4.0", props["imageLicenceCode"])
        self.assertEqual(date(2026, 8, 18), props["imageVerifiedDate"])
        self.assertEqual(
            {
                "imageUrl",
                "imageSourcePageUrl",
                "imageCreatorCredit",
                "imageLicenceCode",
                "imageLicenceVersion",
                "imageAttributionText",
                "imageAltText",
                "imageVerifiedDate",
            },
            set(props),
        )


if __name__ == "__main__":
    unittest.main()
