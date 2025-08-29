from pathlib import Path
from langchain_community.embeddings import OllamaEmbeddings
from langchain_chroma import Chroma
from app.core.config import settings

persist_dir = Path(settings.PERSIST_DIR)
persist_dir.mkdir(parents=True, exist_ok=True)

embeddings = OllamaEmbeddings(
    model=settings.EMBED_MODEL,
    base_url=settings.BASE_URL,
)

vectorstore = Chroma(
    collection_name=settings.COLLECTION_NAME,
    embedding_function=embeddings,
    persist_directory=str(persist_dir),
)

def reset_store():
    # low-level delete + recreate empty collaction dir
    client = vectorstore._client
    client.delete_collection(settings.COLLECTION_NAME)
    persist_dir.mkdir(parents=True, exist_ok=True)