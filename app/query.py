from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ingest import load_documents, chunk_documents
from app.retriever import create_vector_store, create_retriever
from app.generator import get_llm, get_prompt_template, create_llm_chain
from langchain.chains import RetrievalQA
import os
import traceback
from sentence_transformers import CrossEncoder

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

# Load the Cross-Encoder model once
# This model is used for re-ranking retrieved documents
print("--- Loading Cross-Encoder model... ---")
reranker_model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
print("--- Cross-Encoder model loaded. ---")

@router.post("/query")
async def query(request: QueryRequest):
    """
    Query the RAG system.

    Args:
        request (QueryRequest): The query request.

    Returns:
        dict: The answer to the query.
    """
    print("--- Query received. Starting process. ---")
    doc_dir = "documents"
    if not os.path.exists(doc_dir) or not os.listdir(doc_dir):
        print("!!! ERROR: Documents directory is empty or missing.")
        raise HTTPException(status_code=400, detail="No documents found. Please upload documents first.")

    try:
        # 1. Load all documents from the directory
        print("--- Loading documents... ---")
        documents = []
        for filename in os.listdir(doc_dir):
            file_path = os.path.join(doc_dir, filename)
            if os.path.isfile(file_path):
                print(f"--- Loading file: {file_path} ---")
                documents.extend(load_documents(file_path))
        print("--- Documents loaded. ---")
        
        if not documents:
            print("!!! ERROR: No documents found to process.")
            raise HTTPException(status_code=400, detail="No documents found to process.")

        # 2. Chunk the documents
        print("--- Chunking documents... ---")
        chunks = chunk_documents(documents)
        print(f"--- Documents chunked into {len(chunks)} chunks. ---")

        # 3. Create a fresh vector store every time
        print("--- Creating vector store... ---")
        vector_store = create_vector_store(chunks)
        print("--- Vector store created. ---")

    except Exception as e:
        # This will catch errors during document loading, chunking, or embedding
        print(f"!!! ERROR during document processing: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to process documents: {e}")

    # 4. Initial retrieval
    print("--- Performing initial retrieval... ---")
    retriever = create_retriever(vector_store, k=10) # Retrieve more documents initially
    initial_docs = retriever.get_relevant_documents(request.query)
    print(f"--- Retrieved {len(initial_docs)} documents. ---")

    # 5. Re-ranking
    print("--- Re-ranking documents... ---")
    if initial_docs:
        # Prepare sentences for re-ranker
        sentence_pairs = [[request.query, doc.page_content] for doc in initial_docs]
        scores = reranker_model.predict(sentence_pairs)

        # Sort documents by score
        scored_docs = sorted(zip(scores, initial_docs), key=lambda x: x[0], reverse=True)
        
        # Select top N re-ranked documents (e.g., top 3)
        top_n_reranked_docs = [doc for score, doc in scored_docs[:3]]
        print(f"--- Selected {len(top_n_reranked_docs)} documents after re-ranking. ---")
    else:
        top_n_reranked_docs = []
        print("--- No documents to re-rank. ---")

    # 6. Create the LLM chain with re-ranked documents
    print("--- Loading LLM... ---")
    llm = get_llm()
    print("--- LLM loaded. ---")

    # Manually create context from re-ranked documents
    context = "\n\n".join([doc.page_content for doc in top_n_reranked_docs])
    prompt_template = get_prompt_template()
    
    # Use LLMChain directly for more control over context
    llm_chain = create_llm_chain(llm, prompt_template)

    # 7. Run the query
    try:
        print("--- Running query with re-ranked context... ---")
        result = llm_chain.invoke({"context": context, "question": request.query})
        print("--- Query finished. ---")
        
        # The result from llm_chain.invoke is a dictionary, the answer is in 'text' key
        answer = result['text']

        # Return source documents from the re-ranked list
        return {"answer": answer, "source_documents": [doc.metadata for doc in top_n_reranked_docs]}
    except Exception as e:
        print(f"!!! ERROR during query: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error during query: {str(e)}")