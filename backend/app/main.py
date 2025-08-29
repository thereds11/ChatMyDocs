from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
from pathlib import Path
from typing import List


from app.rag.chain import RAG_CHAIN
from app.rag.store import vectorstore, reset_store

from app.rag.ingestion import ingest

app = FastAPI(title="ChatMyDocs API", version="0.1.0")

ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/stats")
def stats():
    return {"documents": vectorstore._collection.count()}

@app.post("/ingest")
async def ingest_files(files: List[UploadFile] = File(...)):
    tmpdir = Path(tempfile.mkdtemp(prefix="cmd_ingest_"))
    paths: List[Path] = []

    for f in files:
        p = tmpdir / f.filename.replace(" ", "_")
        with p.open("wb") as out:
            out.write(await f.read())
        paths.append(p)
    added = ingest(paths)
    return {"added_chunks": added, "total_documents": vectorstore._collection.count()}

@app.post("/query")
def query(request: QueryRequest):
    if vectorstore._collection.count() == 0:
        return {"answer": "No documents ingested yet.", "sources": []}
    
    res = RAG_CHAIN.invoke({"input": request.question})
    ctx = res.get("context", [])
    sources = []
    for d in ctx:
        src = d.metadata.get("source", "inline")
        page = d.metadata.get("page", -1)
        if page != -1:
            sources.append({"source": src, "page": page})
    return {"answer": res["answer"], "sources": sources}

@app.post("/reset")
def reset():
    reset_store()
    return {"ok": True, "message": "Vector store reset."}