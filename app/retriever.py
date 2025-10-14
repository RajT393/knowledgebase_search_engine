
from langchain.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.chains import RetrievalQA
from app.utils import get_env_variable
import os

def create_vector_store(chunks: list, embedding_model: str = "google/gemini-pro") -> FAISS:
    """
    Create a FAISS vector store from a list of document chunks.

    Args:
        chunks (list): A list of document chunks.
        embedding_model (str, optional): The name of the embedding model to use. 
                                        Defaults to "google/gemini-pro".

    Returns:
        FAISS: A FAISS vector store.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set.")
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=api_key)
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

