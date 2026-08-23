import uuid
from io import BytesIO

import cloudinary
import cloudinary.uploader
from PIL import Image, ImageOps
from starlette.concurrency import run_in_threadpool

from config import settings

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret.get_secret_value(),
    secure=True,
)

FOLDER = "blog/profile_pics"


def _process_and_upload(image_bytes: bytes) -> str:
    with Image.open(BytesIO(image_bytes)) as original:
        img = ImageOps.exif_transpose(original)
        img = ImageOps.fit(img, (300, 300), method=Image.Resampling.LANCZOS)

        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        output = BytesIO()
        img.save(output, format="JPEG", quality=85, optimize=True)
        output.seek(0)

    public_id = f"{FOLDER}/{uuid.uuid4().hex}"

    result = cloudinary.uploader.upload(
        output,
        public_id=public_id,
        resource_type="image",
        overwrite=True,
    )

    return result["public_id"]


def _delete(public_id: str) -> None:
    cloudinary.uploader.destroy(public_id, resource_type="image")


async def process_profile_picture(image_bytes: bytes) -> str:
    return await run_in_threadpool(_process_and_upload, image_bytes)


async def delete_profile_image(public_id: str | None) -> None:
    if public_id is None:
        return
    await run_in_threadpool(_delete, public_id)