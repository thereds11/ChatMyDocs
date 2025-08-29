# backend/app/rag/ingestion.py
from pathlib import Path
from typing import List
import logging
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain_core.documents import Document
from app.core.config import settings
from app.rag import store  # 👈 import the module, not the object

logger = logging.getLogger("chatmydocs")

splitter = RecursiveCharacterTextSplitter(
    chunk_size=settings.CHUNK_SIZE,
    chunk_overlap=settings.CHUNK_OVERLAP
)

def _loader_for(path: Path):
    s = path.suffix.lower()
    if s == ".pdf":
        return PyPDFLoader(str(path))
    if s == ".docx":
        return Docx2txtLoader(str(path))
    return TextLoader(str(path), encoding="utf-8")

def load_and_split(paths: List[Path]) -> List[Document]:
    logger.info("ingest: loading %d file(s)", len(paths))
    docs: List[Document] = []
    for p in paths:
        logger.info("ingest: load %s", p.name)
        raw = _loader_for(p).load()
        logger.info("ingest: loaded %s -> %d page docs", p.name, len(raw))
        texts = [d.page_content for d in raw]
        metas = [d.metadata for d in raw]
        chunks = splitter.create_documents(texts, metas)
        logger.info("ingest: split %s -> %d chunks", p.name, len(chunks))
        docs.extend(chunks)
    logger.info("ingest: total chunks = %d", len(docs))
    return docs

def ingest(paths: List[Path]) -> int:
    logger.info("ingest: pipeline start")
    docs = load_and_split(paths)
    if not docs:
        logger.info("ingest: no chunks produced")
        return 0
    logger.info("ingest: adding %d chunks to Chroma...", len(docs))
    # 👇 read the CURRENT store (after reset it will be the new instance)
    store.vectorstore.add_documents(docs)
    logger.info("ingest: add_documents finished")
    return len(docs)
