import uuid
from datetime import date

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from starlette.requests import Request

from auth import get_tenant_id
from db import get_conn

router = APIRouter()
ALLOWED_STATUSES = {"TODO", "DOING", "DONE"}


class TaskCreate(BaseModel):
    project_id: str = Field(..., max_length=50)
    task_name: str = Field(..., max_length=50)
    due_date: date
    expected_value: int = Field(..., ge=0)
    assignee_id: str | None = None
    status: str = "TODO"


@router.get("/tasks")
def list_tasks(request: Request, limit: int = 100):
    tenant_id = get_tenant_id(request)
    limit = max(1, min(limit, 200))

    conn = get_conn()
    try:
        rows = conn.run(
            """
            SELECT task_id, project_id, task_name, due_date, status, expected_value, assignee_id
            FROM tasks
            WHERE tenant_id = %s
            ORDER BY due_date
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
                "task_id": str(row[0]),
                "project_id": row[1],
                "task_name": row[2],
                "due_date": row[3].isoformat() if row[3] else None,
                "status": row[4],
                "expected_value": row[5],
                "assignee_id": row[6],
            }
        )
    return {"items": items}


@router.get("/tasks/{task_id}")
def get_task(task_id: str, request: Request):
    try:
        task_uuid = uuid.UUID(task_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="invalid task_id") from exc

    tenant_id = get_tenant_id(request)
    conn = get_conn()
    try:
        rows = conn.run(
            """
            SELECT task_id, project_id, task_name, due_date, status, expected_value, assignee_id
            FROM tasks
            WHERE tenant_id = %s AND task_id = %s
            """,
            (tenant_id, str(task_uuid)),
        )
    finally:
        conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="task not found")

    row = rows[0]
    return {
        "task_id": str(row[0]),
        "project_id": row[1],
        "task_name": row[2],
        "due_date": row[3].isoformat() if row[3] else None,
        "status": row[4],
        "expected_value": row[5],
        "assignee_id": row[6],
    }


@router.post("/tasks")
def create_task(body: TaskCreate, request: Request):
    if body.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail="invalid status")

    tenant_id = get_tenant_id(request)
    task_id = str(uuid.uuid4())

    conn = get_conn()
    try:
        conn.run(
            """
            INSERT INTO tasks (
              tenant_id, task_id, project_id, task_name, due_date, status, expected_value, assignee_id
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            """,
            (
                tenant_id,
                task_id,
                body.project_id,
                body.task_name,
                body.due_date,
                body.status,
                body.expected_value,
                body.assignee_id,
            ),
        )
    finally:
        conn.close()

    return {"task_id": task_id}
