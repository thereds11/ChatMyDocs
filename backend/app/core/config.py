from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    BASE_URL: str = "http://localhost:11434"  # Ollama
    LLM_MODEL: str = "llama3"
    EMBED_MODEL: str = "mxbai-embed-large"
    PERSIST_DIR: str = "chroma_store"
    COLLECTION_NAME: str = "chatmydocs"
    CHUNK_SIZE: int = 800
    CHUNK_OVERLAP: int = 100
    TOP_K: int = 4
    ALLOWED_ORIGINS: list[str] = ["http://localhost:8001", "http://127.0.0.1:8001"]


settings = Settings()
