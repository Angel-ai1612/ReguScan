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
from app.services.clerk_users import bootstrap_clerk_user

security = HTTPBearer(auto_error=False)

_jwks_cache: dict[str, dict] = {}


async def _get_jwks(issuer: str | None = None) -> dict:
    urls: list[str] = []
    if issuer:
        urls.append(f"{issuer.rstrip('/')}/.well-known/jwks.json")
    urls.append(settings.CLERK_JWKS_URL)

    last_error: Exception | None = None
    for url in dict.fromkeys(urls):
        if url in _jwks_cache:
            return _jwks_cache[url]
        headers = {}
        if "api.clerk.com" in url and settings.CLERK_SECRET_KEY:
            headers["Authorization"] = f"Bearer {settings.CLERK_SECRET_KEY}"
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(url, headers=headers)
                resp.raise_for_status()
                _jwks_cache[url] = resp.json()
                return _jwks_cache[url]
        except httpx.HTTPError as exc:
            last_error = exc

    detail = "Unable to fetch Clerk JWKS"
    if last_error:
        detail = f"{detail}: {last_error}"
    raise HTTPException(status_code=401, detail=detail)


async def verify_clerk_token(token: str) -> dict:
    """Decode and verify a Clerk-issued JWT."""
    try:
        claims = jwt.get_unverified_claims(token)
        jwks = await _get_jwks(claims.get("iss"))
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
        return await bootstrap_clerk_user(clerk_id, payload, db)
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
