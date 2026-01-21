import os

from fastapi import HTTPException
from starlette.requests import Request


def get_tenant_id(request: Request) -> str:
    event = request.scope.get("aws.event", {})
    claims = (
        event.get("requestContext", {})
        .get("authorizer", {})
        .get("jwt", {})
        .get("claims", {})
    )
    tenant_id = claims.get("custom:tenant_id") or claims.get("tenant_id")
    if not tenant_id:
        tenant_id = os.environ.get("TENANT_ID_FALLBACK")
    if not tenant_id:
        raise HTTPException(status_code=401, detail="tenant_id missing")
    return tenant_id
