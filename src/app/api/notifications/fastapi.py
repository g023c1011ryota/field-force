import uuid

from fastapi import APIRouter
from pydantic import BaseModel, Field
from starlette.requests import Request

from auth import get_tenant_id
from db import get_conn

router = APIRouter()


class NotificationCreate(BaseModel):
    employee_id: str = Field(..., max_length=255)
    message: str = Field(..., max_length=200)


@router.get("/notifications")
def list_notifications(request: Request, employee_id: str, unread_only: bool = False):
    tenant_id = get_tenant_id(request)

    conn = get_conn()
    try:
        if unread_only:
            rows = conn.run(
                """
                SELECT notification_id, message, is_read, sent_at
                FROM notifications
                WHERE tenant_id = %s AND employee_id = %s AND is_read = false
                ORDER BY sent_at DESC
                """,
                (tenant_id, employee_id),
            )
        else:
            rows = conn.run(
                """
                SELECT notification_id, message, is_read, sent_at
                FROM notifications
                WHERE tenant_id = %s AND employee_id = %s
                ORDER BY sent_at DESC
                """,
                (tenant_id, employee_id),
            )
    finally:
        conn.close()

    items = []
    for row in rows:
        items.append(
            {
                "notification_id": str(row[0]),
                "message": row[1],
                "is_read": row[2],
                "sent_at": row[3].isoformat() if row[3] else None,
            }
        )
    return {"items": items}


@router.post("/notifications")
def create_notification(body: NotificationCreate, request: Request):
    tenant_id = get_tenant_id(request)
    notification_id = str(uuid.uuid4())

    conn = get_conn()
    try:
        conn.run(
            """
            INSERT INTO notifications (
              tenant_id, employee_id, notification_id, message
            ) VALUES (%s,%s,%s,%s)
            """,
            (
                tenant_id,
                body.employee_id,
                notification_id,
                body.message,
            ),
        )
    finally:
        conn.close()

    return {"notification_id": notification_id}
