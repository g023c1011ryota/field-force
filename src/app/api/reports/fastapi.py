from datetime import date

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from starlette.requests import Request

from auth import get_tenant_id
from db import get_conn

router = APIRouter()


class ReportCreate(BaseModel):
    employee_id: str = Field(..., max_length=255)
    report_date: date
    content: str = Field(..., max_length=2000)
    attachment_s3_path: str | None = None


@router.get("/reports")
def list_reports(request: Request, limit: int = 50):
    tenant_id = get_tenant_id(request)
    limit = max(1, min(limit, 200))

    conn = get_conn()
    try:
        rows = conn.run(
            """
            SELECT employee_id, report_date, content, attachment_s3_path, created_at
            FROM reports
            WHERE tenant_id = %s
            ORDER BY report_date DESC
            LIMIT %s
            """,
            (tenant_id, limit),
        )
    finally:
        conn.close()

    items = []
    for row in rows:
        items.append(
            {
                "employee_id": row[0],
                "report_date": row[1].isoformat() if row[1] else None,
                "content": row[2],
                "attachment_s3_path": row[3],
                "created_at": row[4].isoformat() if row[4] else None,
            }
        )
    return {"items": items}


@router.get("/reports/{employee_id}/{report_date}")
def get_report(employee_id: str, report_date: date, request: Request):
    tenant_id = get_tenant_id(request)

    conn = get_conn()
    try:
        rows = conn.run(
            """
            SELECT employee_id, report_date, content, attachment_s3_path, created_at
            FROM reports
            WHERE tenant_id = %s AND employee_id = %s AND report_date = %s
            """,
            (tenant_id, employee_id, report_date),
        )
    finally:
        conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="report not found")

    row = rows[0]
    return {
        "item": {
            "employee_id": row[0],
            "report_date": row[1].isoformat() if row[1] else None,
            "content": row[2],
            "attachment_s3_path": row[3],
            "created_at": row[4].isoformat() if row[4] else None,
        }
    }


@router.post("/reports")
def create_report(body: ReportCreate, request: Request):
    tenant_id = get_tenant_id(request)

    conn = get_conn()
    try:
        conn.run(
            """
            INSERT INTO reports (
              tenant_id, employee_id, report_date, content, attachment_s3_path
            ) VALUES (%s,%s,%s,%s,%s)
            """,
            (
                tenant_id,
                body.employee_id,
                body.report_date,
                body.content,
                body.attachment_s3_path,
            ),
        )
    finally:
        conn.close()

    return {"ok": True}
