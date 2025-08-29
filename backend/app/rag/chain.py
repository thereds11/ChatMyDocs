# backend/app/rag/chain.py
from langchain_community.chat_models import ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain.chains.combine_documents.stuff import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from app.core.config import settings
from app.rag import store  # 👈 use module (dynamic vectorstore)

llm = ChatOllama(
    model=settings.LLM_MODEL,
    base_url=settings.BASE_URL,
    temperature=0.4,
    timeout=120,
)

prompt = PromptTemplate.from_template(
    """You are a helpful assistant. Use ONLY the provided context to answer the user's question.
If the answer is not in the context, say you don't know.

Question:
{input}

Context:
{context}
"""
)

def _build_chain():
    retriever = store.vectorstore.as_retriever(search_kwargs={"k": settings.TOP_K})
    combine_chain = create_stuff_documents_chain(
        llm=llm,
        prompt=prompt,
        document_variable_name="context",
    )
    return create_retrieval_chain(retriever, combine_chain)

# global handle used by app.main
RAG_CHAIN = _build_chain()

def refresh_chain():
    """Rebuild the retriever + RAG chain against the current vectorstore."""
    global RAG_CHAIN
    RAG_CHAIN = _build_chain()
    return True
