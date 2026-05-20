from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

app = FastAPI(title="UN Votes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LIVE_DATA_DIR = Path("data/live")

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/resolutions/ga")
def get_ga_resolutions():
    ga_file = LIVE_DATA_DIR / "ga_archive.json"
    if ga_file.exists():
        with open(ga_file, "r") as f:
            return json.load(f)
    return []

@app.get("/api/resolutions/sc")
def get_sc_resolutions():
    sc_file = LIVE_DATA_DIR / "sc_archive.json"
    if sc_file.exists():
        with open(sc_file, "r") as f:
            return json.load(f)
    return []
