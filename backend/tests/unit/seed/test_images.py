"""Unit tests for seed.images's lookup/merge helpers."""

from __future__ import annotations

import unittest

from seed import images, schema


def _image(product_id: str = "ACC-01") -> schema.ImageSeed:
    return schema.ImageSeed.model_validate(
        {
            "productId": product_id,
            "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Example.jpg",
        }
    )


class IndexImagesByProductTest(unittest.TestCase):
    def test_indexes_by_product_id(self) -> None:
        index = images.index_images_by_product((_image("ACC-01"), _image("FLT-01")))
        self.assertEqual({"ACC-01", "FLT-01"}, set(index))


class ImagePropertiesTest(unittest.TestCase):
    def test_no_image_yields_empty_properties(self) -> None:
        self.assertEqual({}, images.image_properties(None))

    def test_image_yields_image_url_property(self) -> None:
        props = images.image_properties(_image())
        self.assertEqual(
            {"imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Example.jpg"},
            props,
        )


if __name__ == "__main__":
    unittest.main()
