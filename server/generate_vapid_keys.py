"""
One-time script to generate VAPID keys for web push notifications.

Usage:
    cd server
    source ../venv/bin/activate
    python generate_vapid_keys.py

Copy the output into your .env.local file.
"""
import base64

from cryptography.hazmat.primitives.serialization import (
    Encoding,
    NoEncryption,
    PrivateFormat,
    PublicFormat,
)
from py_vapid import Vapid

vapid = Vapid()
vapid.generate_keys()

# URL-safe base64 encoded private key (raw 32 bytes)
private_raw = vapid.private_key.private_numbers().private_value.to_bytes(32, "big")
private_b64 = base64.urlsafe_b64encode(private_raw).decode().rstrip("=")

# URL-safe base64 encoded public key (uncompressed point, 65 bytes)
public_raw = vapid.public_key.public_bytes(
    encoding=Encoding.X962,
    format=PublicFormat.UncompressedPoint,
)
public_b64 = base64.urlsafe_b64encode(public_raw).decode().rstrip("=")

print("Add these to your .env.local:\n")
print(f'export VAPID_PRIVATE_KEY="{private_b64}"')
print(f'export VAPID_PUBLIC_KEY="{public_b64}"')
