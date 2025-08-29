import logging
import os
from pathlib import Path

from langchain_chroma import Chroma
from langchain_community.embeddings import OllamaEmbeddings

from app.core.config import settings

logger = logging.getLogger("chatmydocs")

# (optional) silence chroma telemetry noise
os.environ.setdefault("ANONYMIZED_TELEMETRY", "False")

persist_dir = Path(settings.PERSIST_DIR)
persist_dir.mkdir(exist_ok=True)

embeddings = OllamaEmbeddings(
    model=settings.EMBED_MODEL,
    base_url=settings.BASE_URL,
)


def _new_chroma() -> Chroma:
    return Chroma(
        collection_name=settings.COLLECTION_NAME,
        embedding_function=embeddings,
        persist_directory=str(persist_dir),
    )


# module-level handle; other modules should import *the module* and read this name
vectorstore = _new_chroma()


def rebuild_vectorstore() -> Chroma:
    """Create a new Chroma instance and replace the module-level handle."""
    global vectorstore
    logger.info("rebuild_vectorstore: creating new Chroma handle")
    vectorstore = _new_chroma()
    return vectorstore


def reset_store() -> None:
    """Delete collection then rebuild a fresh store + collection."""
    logger.info("reset_store: deleting collection %s", settings.COLLECTION_NAME)
    try:
        vectorstore._client.delete_collection(settings.COLLECTION_NAME)
        logger.info("reset_store: deleted")
    except Exception:
        logger.exception("reset_store: delete_collection failed (continuing)")
    rebuild_vectorstore()
    logger.info("reset_store: rebuilt vectorstore")
