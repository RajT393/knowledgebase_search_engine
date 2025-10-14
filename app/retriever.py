
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
import os

EMBEDDING_DIR = "embeddings"

def create_vector_store(chunks: list) -> FAISS:
    """
    Create a FAISS vector store from a list of document chunks.

    Args:
        chunks (list): A list of document chunks.

    Returns:
        FAISS: A FAISS vector store.
    """
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vector_store = FAISS.from_documents(chunks, embedding=embeddings)
    return vector_store

def create_retriever(vector_store: FAISS, k: int = 5):
    """
    Create a retriever from a FAISS vector store.

    Args:
        vector_store (FAISS): A FAISS vector store.
        k (int, optional): The number of relevant documents to retrieve. Defaults to 5.

    Returns:
        RetrievalQA: A retriever.
    """
    return vector_store.as_retriever(k=k)

