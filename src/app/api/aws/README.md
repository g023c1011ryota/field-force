# AWS Lambda (FastAPI)

FastAPI app for AWS Lambda (Mangum adapter). This lives under `src/app/api`
to align with the existing API layout, but it is not a Next.js Route Handler.

## Structure

```
src/app/api/aws/
  app.py
  auth.py
  db.py
  requirements.txt
src/app/api/checkin/
  fastapi.py
src/app/api/notifications/
  fastapi.py
src/app/api/reports/
  fastapi.py
src/app/api/tasks/
  fastapi.py
```

## Build (zip)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt -t package
cp app.py auth.py db.py package/
cp -R ../checkin ../notifications ../reports ../tasks package/
cd package
zip -r ../lambda.zip .
```

## Lambda settings

- Runtime: Python 3.12
- Handler: `app.handler`
- Env: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Optional: `CHECKIN_RADIUS_METERS` (default: 200)
- VPC: private subnets + `lambda-sg`

## Endpoints

- `GET /health`
- `GET /tasks`
- `GET /tasks/{task_id}`
- `POST /tasks`
- `GET /reports`
- `GET /reports/{employee_id}/{report_date}`
- `POST /reports`
- `GET /notifications`
- `POST /notifications`
- `GET /checkin/health`
- `POST /checkin/start`
- `POST /checkin/end`
- `GET /checkin/latest`

## Database notes

- `checkins` テーブルが必要です。`docs/db_schema.sql` の追加分を反映してください。
