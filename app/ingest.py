from langchain_community.document_loaders import PyMuPDFLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List

def load_documents(file_path: str) -> List[str]:
    """
    Load documents from a file path.

    Args:
        file_path (str): The path to the file.

    Returns:
        List[str]: A list of document contents.
    """
    if file_path.endswith(".pdf"):
        loader = PyMuPDFLoader(file_path)
    elif file_path.endswith(".txt"):
        loader = TextLoader(file_path, encoding='utf-8')
    else:
        raise ValueError("Unsupported file type.")
    return loader.load()

def chunk_documents(documents: List[str], chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """
    Split documents into chunks.

    Args:
        documents (List[str]): A list of document contents.
        chunk_size (int, optional): The size of each chunk. Defaults to 1000.
        chunk_overlap (int, optional): The overlap between chunks. Defaults to 200.

    Returns:
        List[str]: A list of document chunks.
    """
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    return text_splitter.split_documents(documents)