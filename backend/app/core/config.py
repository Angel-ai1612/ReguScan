"""Application settings — loaded from environment variables."""
from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    APP_NAME: str = "ReguScan"
    APP_ENV: Literal["local", "dev", "staging", "production"] = "local"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    SECRET_KEY: str = "change-me-in-production"

    # API
    API_V1_PREFIX: str = "/api/v1"
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    # Database (Supabase free tier)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/reguscan"
    DATABASE_URL_SYNC: str = "postgresql://postgres:postgres@localhost:5432/reguscan"
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20

    # Redis (Upstash free tier)
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_TTL_SECONDS: int = 3600

    # Auth (Clerk)
    CLERK_SECRET_KEY: str = ""
    CLERK_PUBLISHABLE_KEY: str = ""
    CLERK_WEBHOOK_SECRET: str = ""
    CLERK_JWKS_URL: str = "https://api.clerk.com/v1/jwks"
    CLERK_ISSUER: str = ""
    CLERK_JWT_AUDIENCE: str = ""
    CLERK_AUTHORIZED_PARTIES: str = ""

    # Payments (Stripe)
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_PRICE_STARTER: str = ""
    STRIPE_PRICE_PRO: str = ""
    STRIPE_PRICE_ENTERPRISE: str = ""

    # LLM — Groq (free: 14,400 req/day)
    GROQ_API_KEY: str = ""
    GROQ_MODEL_FAST: str = "llama-3.1-8b-instant"
    GROQ_MODEL_SMART: str = "llama-3.3-70b-versatile"

    # Embeddings — Gemini (free)
    GEMINI_API_KEY: str = ""
    GEMINI_EMBEDDING_MODEL: str = "models/text-embedding-004"

    # Vector DB (Pinecone free)
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX: str = "regulations"

    # Object Storage (Cloudflare R2 free)
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    R2_BUCKET: str = "reguscan"
    R2_PUBLIC_URL: str = ""

    # Email (Resend free: 3K/mo)
    RESEND_API_KEY: str = ""
    FROM_EMAIL: str = "noreply@reguscan.app"
    RESEND_TEST_RECIPIENT: str = ""

    # Monitoring
    SENTRY_DSN: str = ""

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # Scan limits by plan
    SCAN_LIMITS: dict = {
        "free": {"websites": 1, "scans_per_month": 1, "pages_per_scan": 10},
        "starter": {"websites": 3, "scans_per_month": 10, "pages_per_scan": 100},
        "pro": {"websites": 10, "scans_per_month": 100, "pages_per_scan": 500},
        "enterprise": {"websites": -1, "scans_per_month": -1, "pages_per_scan": -1},
    }

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def clerk_authorized_parties(self) -> list[str]:
        raw = self.CLERK_AUTHORIZED_PARTIES or self.ALLOWED_ORIGINS
        return [origin.strip() for origin in raw.split(",") if origin.strip()]

    @property
    def sentry_dsn(self) -> str:
        value = self.SENTRY_DSN.strip()
        if not value or "..." in value:
            return ""
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
