import os
from functools import lru_cache
from typing import List

from dotenv import load_dotenv


# Load values from backend/.env during local development.
# In deployment, Vercel/Render/Railway/etc. should provide these as environment variables.
load_dotenv()


class Settings:
    """Small settings object so the rest of the app does not read env vars directly."""

    def __init__(self) -> None:
        self.supabase_url = os.getenv("SUPABASE_URL", "")
        self.supabase_key = os.getenv("SUPABASE_KEY", "")
        self.frontend_origins = self._split_origins(
            os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
        )

    @staticmethod
    def _split_origins(value: str) -> List[str]:
        return [origin.strip() for origin in value.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cache settings once so every request uses the same configuration."""

    return Settings()
