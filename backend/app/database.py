from functools import lru_cache

from fastapi import HTTPException, status
from supabase import Client, create_client

from .config import get_settings


@lru_cache
def get_supabase() -> Client:
    """Create one Supabase client for the backend process.

    The key is read only on the server. This is important for your assignment:
    the React frontend should never contain a service role key or database URL secret.
    """

    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set before starting the API.")

    return create_client(settings.supabase_url, settings.supabase_key)


def unwrap_response(response):
    """Return Supabase data or convert a Supabase error into an HTTP error."""

    error = getattr(response, "error", None)
    if error:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Supabase request failed: {error}",
        )

    return getattr(response, "data", response)
