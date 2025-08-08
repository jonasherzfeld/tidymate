from flask import Blueprint, request, jsonify, send_file
import shortuuid
from pathlib import Path
import os
from PIL import Image
import io


from db.db import db
from utils.utils import login_required

CWD = Path(__file__).parent
BASE_DIR = CWD.parent.parent.parent.parent
DATA_DIR = f"{BASE_DIR}/data"
ACCESS_ROUTES = f"/file"

file = Blueprint('file', __name__)

# Define your resolution presets
IMAGE_SIZES = {
    'thumbnail': (64, 64),    # Small profile pic
    'medium': (200, 200),     # Card views
    'large': (400, 400),      # Profile page
    'original': None          # Keep original (optional)
}


@file.route('/upload', methods=['POST'])
@login_required
def upload_image(user):
    if 'file' not in request.files:
        return jsonify({
            "error": "No file part in POST"
        }), 401

    if 'file' not in request.files:
        return jsonify({
            "error": "No file part in POST"
        }), 401
    file_obj = request.files['file']

    file_ending = file_obj.content_type.split('/')[1]
    if file_ending not in ['jpeg', 'png', 'jpg']:
        return jsonify({
            "error": "Invalid file type"
        }), 401

    try:
        # Read and validate image
        file_bytes = file_obj.read()
        original_image = Image.open(io.BytesIO(file_bytes))

        # Convert RGBA to RGB if necessary (for JPEG compatibility)
        if original_image.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', original_image.size, (255, 255, 255))
            background.paste(original_image, mask=original_image.split(
            )[-1] if original_image.mode == 'RGBA' else None)
            original_image = background

        filename_base = shortuuid.ShortUUID().random(length=8)
        user_dir = f"userdata/{user.id}"
        full_user_dir = f"{DATA_DIR}/{user_dir}"

        # Create directory
        os.makedirs(full_user_dir, exist_ok=True)

        # Store URLs for different sizes
        image_urls = {}

        # Generate different resolutions
        for size_name, dimensions in IMAGE_SIZES.items():
            if dimensions is None:  # Original size
                processed_image = original_image
            else:
                # Create thumbnail with proper aspect ratio
                processed_image = original_image.copy()
                processed_image.thumbnail(dimensions, Image.Resampling.LANCZOS)

                # Optional: Create square crop for profile pics
                processed_image = crop_to_square(
                    processed_image, dimensions[0])

            # Save with optimized settings
            file_path = f"{full_user_dir}/{filename_base}_{size_name}.webp"
            save_optimized_image(processed_image, file_path, size_name)

            # Store URL
            image_urls[size_name] = f"{ACCESS_ROUTES}/{user_dir}/{filename_base}_{size_name}.webp"

        # Update user with default thumbnail URL
        user.thumbnail = f"{ACCESS_ROUTES}/{user_dir}/{filename_base}_thumbnail.webp"
        # Base path for other sizes
        db.session.commit()

        return jsonify({
            "success": True,
            "images": image_urls,
            "default_thumbnail": image_urls['thumbnail']
        }), 200

    except Exception as e:
        return jsonify({"error": f"Image processing failed: {str(e)}"}), 500


def crop_to_square(image, size):
    """Crop image to square aspect ratio from center"""
    width, height = image.size

    if width == height:
        return image.resize((size, size), Image.Resampling.LANCZOS)

    # Calculate crop box for center crop
    if width > height:
        left = (width - height) // 2
        top = 0
        right = left + height
        bottom = height
    else:
        left = 0
        top = (height - width) // 2
        right = width
        bottom = top + width

    cropped = image.crop((left, top, right, bottom))
    return cropped.resize((size, size), Image.Resampling.LANCZOS)


def save_optimized_image(image, file_path, size_name):
    """Save image with size-appropriate optimization"""
    if size_name == 'thumbnail':
        # Aggressive compression for thumbnails
        image.save(file_path, 'WEBP', quality=70, optimize=True)
    elif size_name == 'medium':
        # Balanced quality for medium images
        image.save(file_path, 'WEBP', quality=80, optimize=True)
    else:
        # Higher quality for large images
        image.save(file_path, 'WEBP', quality=85, optimize=True)


@file.route('/delete', methods=['DELETE'])
@login_required
def delete_image(user):
    if not user.thumbnail:
        return jsonify({
            "error": "No thumbnail to delete"
        }), 400

    try:
        # Extract the base filename from the thumbnail path
        # user.thumbnail should be something like "/file/userdata/{user_id}/{filename}_thumbnail.webp"
        if user.thumbnail.startswith("/file/"):
            # Parse the URL to get user_dir and filename base
            parts = user.thumbnail.split('/')
            if len(parts) >= 4:
                user_id = parts[3]  # userdata/{user_id}
                filename_with_suffix = parts[4]  # {filename}_thumbnail.webp

                # Extract base filename by removing the size suffix
                filename_base = filename_with_suffix.split(
                    '_')[0]  # Remove _thumbnail.webp

                user_dir = f"{DATA_DIR}/userdata/{user_id}"

                # Delete all versions of the image
                deleted_files = []
                for size_name in IMAGE_SIZES.keys():
                    file_path = f"{user_dir}/{filename_base}_{size_name}.webp"
                    if os.path.exists(file_path):
                        os.remove(file_path)
                        deleted_files.append(file_path)

                # Clear user thumbnail data
                user.thumbnail = ""
                if hasattr(user, 'profile_image_base'):
                    user.profile_image_base = ""
                db.session.commit()

                return jsonify({
                    "success": True,
                    "deleted_files": len(deleted_files),
                    "thumbnail": ""
                }), 200
            else:
                return jsonify({
                    "error": "Invalid thumbnail URL format"
                }), 400
        else:
            # Handle legacy file system paths
            thumbnail_path = user.thumbnail
            if os.path.isfile(thumbnail_path):
                # For legacy paths, try to delete the single file
                os.remove(thumbnail_path)
                user.thumbnail = ""
                db.session.commit()
                return jsonify({
                    "success": True,
                    "deleted_files": 1,
                    "thumbnail": ""
                }), 200
            else:
                return jsonify({
                    "error": "File not found"
                }), 404

    except Exception as e:
        return jsonify({
            "error": f"Failed to delete images: {str(e)}"
        }), 500


@file.route('/userdata/<user_id>/<filename>')
def serve_user_file(user_id, filename):
    """Serve user uploaded files (thumbnails)"""
    try:
        file_path = f"{BASE_DIR}/data/userdata/{user_id}/{filename}"
        print(file_path)
        if os.path.exists(file_path):
            print(f"Serving file: {file_path}")
            return send_file(file_path)
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
