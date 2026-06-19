"""Clerk JWT verification and user/org resolution."""
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db
from app.models.models import Organization, User

security = HTTPBearer(auto_error=False)

_jwks_cache: dict | None = None


async def _get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache:
        return _jwks_cache
    async with httpx.AsyncClient() as client:
        resp = await client.get(settings.CLERK_JWKS_URL)
        resp.raise_for_status()
        _jwks_cache = resp.json()
    return _jwks_cache


async def verify_clerk_token(token: str) -> dict:
    """Decode and verify a Clerk-issued JWT."""
    try:
        jwks = await _get_jwks()
        header = jwt.get_unverified_header(token)
        key_id = header.get("kid")
        signing_key = next((k for k in jwks.get("keys", []) if k.get("kid") == key_id), None)
        if not signing_key:
            raise HTTPException(status_code=401, detail="Invalid token: key not found")
        payload = jwt.decode(token, signing_key, algorithms=["RS256"], options={"verify_aud": False})
        return payload
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}")


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract and validate the current user from JWT."""
    if not credentials:
        raise HTTPException(status_code=403, detail="Not authenticated")
    payload = await verify_clerk_token(credentials.credentials)
    clerk_id = payload.get("sub")
    if not clerk_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    result = await db.execute(select(User).where(User.clerk_id == clerk_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found — sign in again")
    return user


async def resolve_user_org(user: User, db: AsyncSession) -> tuple[User, Organization]:
    """
    Pure helper (not a FastAPI dependency) — resolves user + org.
    Call this from inside endpoints that already have both `user` and `db`.
    """
    if not user.org_id:
        raise HTTPException(status_code=403, detail="User has no organization")
    result = await db.execute(select(Organization).where(Organization.id == user.org_id))
    org = result.scalar_one_or_none()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return user, org


def require_role(*roles: str):
    """Dependency factory: enforce minimum role."""
    async def _check(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail=f"Requires role: {', '.join(roles)}")
        return current_user
    return _check


require_admin = require_role("admin", "owner")
require_owner = require_role("owner")
