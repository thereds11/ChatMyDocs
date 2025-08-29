from pathlib import Path
from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain_core.documents import Document
from app.core.config import settings
from app.rag.store import vectorstore

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
    docs: List[Document] = []
    for p in paths:
        loader = _loader_for(p)
        raw = loader.load()     # list[Document]
        texts = [d.page_content for d in raw]
        metas = [d.metadata for d in raw]
        docs.extend(splitter.create_documents(texts, metas))
    return docs

def ingest(paths: List[Path]) -> int:
    docs = load_and_split(paths)
    if docs:
        vectorstore.add_documents(docs)
    return len(docs)
