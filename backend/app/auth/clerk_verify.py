"""

Clerk JWT verification — optional when CLERK_JWKS_URL is not set (dev fallback).

"""



import os

from typing import Any



import httpx

import jwt

from jwt import PyJWKClient



_jwks_client: PyJWKClient | None = None





def is_auth_disabled() -> bool:

    """Read at call time so backend/.env is respected after load_dotenv."""

    return os.getenv("AUTH_DISABLED", "false").lower() == "true"





def _get_jwks_client() -> PyJWKClient | None:

    global _jwks_client

    jwks_url = os.getenv("CLERK_JWKS_URL", "")

    if not jwks_url:

        return None

    if _jwks_client is None:

        _jwks_client = PyJWKClient(jwks_url)

    return _jwks_client





def verify_clerk_token(token: str) -> dict[str, Any] | None:

    """

    Verify Bearer token from Clerk. Returns JWT payload or None.

    When AUTH_DISABLED=true, accepts dev/local tokens for local saves.

    """

    if is_auth_disabled():

        if not token or token in ("dev", "local"):

            return {

                "sub": "dev_user_local",

                "email": "dev@educompiler.local",

                "username": "devuser",

            }



    client = _get_jwks_client()

    if not client:

        if is_auth_disabled() and token in ("dev", "local"):

            return {

                "sub": "dev_user_local",

                "email": "dev@educompiler.local",

                "username": "devuser",

            }

        return None



    try:

        key = client.get_signing_key_from_jwt(token)

        issuer = os.getenv("CLERK_ISSUER", "") or None

        payload = jwt.decode(

            token,

            key.key,

            algorithms=["RS256"],

            issuer=issuer,

            options={"verify_aud": False},

        )

        return dict(payload)

    except (jwt.PyJWTError, httpx.HTTPError, Exception):

        return None


