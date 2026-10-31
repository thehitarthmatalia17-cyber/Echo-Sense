import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .config import settings
from .routers import users, screening, behavioral, tinnitus, ml_analysis

app = FastAPI(
    title="EchoSense API",
    description="AI-Powered Early Hearing Difficulty Screening System — Listen Beyond the Silence",
    version=settings.version
)

# CORS configuration for public web access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(users.router)
app.include_router(screening.router)
app.include_router(behavioral.router)
app.include_router(tinnitus.router)
app.include_router(ml_analysis.router)

# Locate frontend dist directory
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
assets_dir = os.path.join(frontend_dist, "assets")

if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "version": settings.version,
        "database": "connected"
    }

@app.get("/")
def serve_root():
    index_file = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {
        "project": "EchoSense",
        "tagline": "Listen Beyond the Silence.",
        "version": settings.version,
        "status": "healthy"
    }

@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
        raise HTTPException(status_code=404, detail="API endpoint not found")
    target_file = os.path.join(frontend_dist, full_path)
    if os.path.isfile(target_file):
        return FileResponse(target_file)
    index_file = os.path.join(frontend_dist, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
