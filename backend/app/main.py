import logging
import tempfile
import time
from pathlib import Path
from typing import Annotated, Any

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.core.config import settings
from app.rag.chain import RAG_CHAIN, refresh_chain
from app.rag.ingestion import ingest
from app.rag.store import embeddings, reset_store, vectorstore

logger = logging.getLogger("chatmydocs")
logging.basicConfig(level=logging.INFO)


app = FastAPI(title="ChatMyDocs API", version="0.1.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


@app.get("/health")
def health() -> dict[str, bool]:
    logger.info("GET /health")
    return {"ok": True}


@app.get("/stats")
def stats() -> dict[str, int]:
    count = vectorstore._collection.count()
    logger.info(f"GET /stats -> {count}")
    return {"documents": count}


@app.post("/ingest")
async def ingest_files(
    files: Annotated[list[UploadFile], File(...)],
) -> dict[str, int]:
    t0 = time.perf_counter()
    logger.info(f"POST /ingest start: {len(files)} file(s): {[f.filename for f in files]}")
    tmpdir = Path(tempfile.mkdtemp(prefix="cmd_ingest_"))
    paths: list[Path] = []
    total_bytes = 0
    try:
        logger.info("/ingest: embeddings ping…")
        _ = embeddings.embed_query("ping")
        logger.info("/ingest: embeddings ping OK")
        for f in files:
            data = await f.read()
            total_bytes += len(data)
            p = tmpdir / f.filename.replace(" ", "_")
            with p.open("wb") as out:
                out.write(data)
            paths.append(p)
        logger.info(f"/ingest saved -> {tmpdir}, total_bytes={total_bytes}")

        added = ingest(paths)
        new_count = vectorstore._collection.count()
        dt = time.perf_counter() - t0
        logger.info(f"/ingest done: added_chunks={added}, new_count={new_count}, dt={dt:.2f}s")
        return {"added_chunks": added, "total_documents": new_count}
    except Exception:
        logger.exception("/ingest failed")
        raise


@app.post("/query")
def query(request: QueryRequest) -> dict[str, Any]:
    logger.info(f"POST /query q='{request.question[:80]}'")
    _ = embeddings.embed_query("ping")
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
    logger.info(f"/query ok -> {len(sources)} sources")
    return {"answer": res["answer"], "sources": sources}


@app.post("/reset")
def reset() -> dict[str, bool | str]:
    logger.info("POST /reset start")
    reset_store()  # deletes collection + rebuilds vectorstore
    refresh_chain()  # rebuilds retriever/chain to point at new store
    logger.info("POST /reset done")
    return {"ok": True, "message": "Vector store reset."}
