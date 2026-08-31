from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from src.config import settings


def get_ip(request: Request) -> str:
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return get_remote_address(request)


limiter = Limiter(key_func=get_ip, storage_uri=settings.rate_limit_storage_uri)
