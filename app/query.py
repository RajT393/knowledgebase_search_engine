
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ingest import load_documents, chunk_documents
from app.retriever import create_vector_store, create_retriever
from app.generator import get_llm, get_prompt_template, create_llm_chain
from langchain.chains import RetrievalQA
import os

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

vector_store = None

@router.post("/query")
async def query(request: QueryRequest):
    """
    Query the RAG system.

    Args:
        request (QueryRequest): The query request.

    Returns:
        dict: The answer to the query.
    """
    global vector_store
    if vector_store is None:
        documents = []
        doc_dir = "documents"
        if not os.path.exists(doc_dir):
            return {"answer": "No documents found. Please upload documents first."}
        for filename in os.listdir(doc_dir):
            file_path = os.path.join(doc_dir, filename)
            if os.path.isfile(file_path):
                documents.extend(load_documents(file_path))
        
        if not documents:
            return {"answer": "No documents found. Please upload documents first."}

        chunks = chunk_documents(documents)
        vector_store = create_vector_store(chunks)

    llm = get_llm()
    prompt_template = get_prompt_template()
    llm_chain = create_llm_chain(llm, prompt_template)

    retriever = create_retriever(vector_store)

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": prompt_template}
    )

    try:
        result = qa_chain({"query": request.query})
        return {"answer": result["result"], "source_documents": [doc.metadata for doc in result["source_documents"]]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

