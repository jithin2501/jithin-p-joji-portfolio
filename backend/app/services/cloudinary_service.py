import os
import cloudinary
import cloudinary.uploader
from typing import Optional

class CloudinaryService:
    def __init__(self):
        # Configure Cloudinary credentials from environment variables
        cloudinary.config(
            cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", ""),
            api_key=os.getenv("CLOUDINARY_API_KEY", ""),
            api_secret=os.getenv("CLOUDINARY_API_SECRET", "")
        )

    def upload_base64_image(self, base64_str: str, folder: str = "portfolio") -> Optional[str]:
        if not base64_str:
            return None
        
        # If it's already a URL, return it directly
        if base64_str.startswith("http://") or base64_str.startswith("https://"):
            return base64_str

        try:
            # Cloudinary uploader supports base64 strings directly out-of-the-box
            response = cloudinary.uploader.upload(
                base64_str,
                folder=folder,
                overwrite=True,
                resource_type="image"
            )
            return response.get("secure_url")
        except Exception as e:
            print("Cloudinary upload failed:", e)
            raise e
