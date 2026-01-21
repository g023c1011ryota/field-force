import math
import os
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from starlette.requests import Request

from auth import get_tenant_id
from db import get_conn

router = APIRouter()


class CheckinCreate(BaseModel):
    employee_id: str = Field(..., max_length=255)
    lat: float
    lon: float
    accuracy: float | None = None
    recorded_at: datetime | None = None


def haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371000.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * r * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def resolve_base_location(conn, tenant_id: str, employee_id: str):
    rows = conn.run(
        """
        SELECT e.department_id, d.base_latitude, d.base_longitude
        FROM employees e
        JOIN departments d
          ON d.tenant_id = e.tenant_id
         AND d.department_id = e.department_id
        WHERE e.tenant_id = %s AND e.employee_id = %s
        """,
        (tenant_id, employee_id),
    )
    return rows[0] if rows else None


def insert_checkin(conn, payload: CheckinCreate, tenant_id: str, checkin_type: str):
    base = resolve_base_location(conn, tenant_id, payload.employee_id)
    if not base:
        raise HTTPException(status_code=404, detail="employee or department not found")

    department_id, base_lat, base_lon = base
    distance = haversine_meters(payload.lat, payload.lon, float(base_lat), float(base_lon))
    radius = float(os.environ.get("CHECKIN_RADIUS_METERS", "200"))
    is_within = distance <= radius

    recorded_at = payload.recorded_at or datetime.now(timezone.utc)
    if recorded_at.tzinfo is None:
        recorded_at = recorded_at.replace(tzinfo=timezone.utc)

    checkin_id = str(uuid.uuid4())
    conn.run(
        """
        INSERT INTO checkins (
          tenant_id, checkin_id, employee_id, department_id, checkin_type,
          lat, lon, accuracy, distance_meters, is_within_range, recorded_at
        ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """,
        (
            tenant_id,
            checkin_id,
            payload.employee_id,
            department_id,
            checkin_type,
            payload.lat,
            payload.lon,
            payload.accuracy,
            round(distance, 2),
            is_within,
            recorded_at,
        ),
    )

    return {
        "checkin_id": checkin_id,
        "department_id": department_id,
        "distance_meters": round(distance, 2),
        "is_within_range": is_within,
        "recorded_at": recorded_at.isoformat(),
    }


@router.get("/checkin/health")
def health():
    return {"ok": True}


@router.post("/checkin/start")
def checkin_start(body: CheckinCreate, request: Request):
    tenant_id = get_tenant_id(request)
    conn = get_conn()
    try:
        result = insert_checkin(conn, body, tenant_id, "start")
    finally:
        conn.close()
    return result


@router.post("/checkin/end")
def checkin_end(body: CheckinCreate, request: Request):
    tenant_id = get_tenant_id(request)
    conn = get_conn()
    try:
        result = insert_checkin(conn, body, tenant_id, "end")
    finally:
        conn.close()
    return result


@router.get("/checkin/latest")
def get_latest_checkin(request: Request, employee_id: str):
    tenant_id = get_tenant_id(request)
    conn = get_conn()
    try:
        rows = conn.run(
            """
            SELECT checkin_id, checkin_type, lat, lon, accuracy, distance_meters,
                   is_within_range, recorded_at, department_id
            FROM checkins
            WHERE tenant_id = %s AND employee_id = %s
            ORDER BY recorded_at DESC
            LIMIT 1
            """,
            (tenant_id, employee_id),
        )
    finally:
        conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="checkin not found")

    row = rows[0]
    return {
        "item": {
            "checkin_id": str(row[0]),
            "checkin_type": row[1],
            "lat": float(row[2]),
            "lon": float(row[3]),
            "accuracy": float(row[4]) if row[4] is not None else None,
            "distance_meters": float(row[5]) if row[5] is not None else None,
            "is_within_range": row[6],
            "recorded_at": row[7].isoformat() if row[7] else None,
            "department_id": row[8],
        }
    }
