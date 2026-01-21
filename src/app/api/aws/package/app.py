from fastapi import FastAPI
from mangum import Mangum

from checkin.fastapi import router as checkin_router
from notifications.fastapi import router as notifications_router
from reports.fastapi import router as reports_router
from tasks.fastapi import router as tasks_router

app = FastAPI()

app.include_router(tasks_router)
app.include_router(reports_router)
app.include_router(notifications_router)
app.include_router(checkin_router)


@app.get("/health")
def health():
    return {"ok": True}


handler = Mangum(app)
