
# Knowledge-Base Search Engine

## 🎯 Objective
This project is a production-grade "Knowledge-base Search Engine" that uses a Retrieval-Augmented Generation (RAG) architecture to search across multiple uploaded documents (PDF/TXT) and provide accurate, synthesized answers to user queries.

## Architecture
The application follows a classic RAG pipeline:

1.  **Document Ingestion:** Users upload PDF or TXT files through a web interface.
2.  **Chunking:** The uploaded documents are split into smaller, manageable chunks (500-1000 tokens).
3.  **Embedding:** Each chunk is converted into a numerical representation (embedding) using a sentence transformer model.
4.  **Vector Storage:** The embeddings are stored in a FAISS vector database for efficient similarity search.
5.  **Query & Retrieval:** When a user asks a question, the query is embedded, and the vector database is searched for the most relevant document chunks (top-k).
6.  **Answer Synthesis:** The retrieved chunks (context) and the original query are passed to a large language model (LLM) like Gemini, which generates a concise and accurate answer.

![RAG Architecture](https://i.imgur.com/3A2Y4fH.png)

---

## ⚙️ Technical Stack
*   **Backend:** Python, FastAPI
*   **RAG Implementation:** LangChain
*   **Vector Database:** FAISS (Facebook AI Similarity Search)
*   **LLM:** Google Gemini
*   **Frontend:** Streamlit
*   **File Formats:** PDF, TXT

---

## 🧱 Project Structure
```
knowledgebase_search_engine/
├── app/
│ ├── main.py # FastAPI app definition
│ ├── upload.py # File upload endpoint
│ ├── query.py # Query processing endpoint
│ ├── ingest.py # Document loading and chunking
│ ├── retriever.py # Embedding and vector store logic
│ ├── generator.py # LLM interaction and answer synthesis
│ └── utils.py # Utility functions (logging, env vars)
├── documents/ # Storage for uploaded files
├── embeddings/ # Storage for FAISS index
├── requirements.txt # Project dependencies
├── README.md # This file
└── demo_video_guide.txt # Guide for creating a demo video
```

---

## 🚀 Getting Started

### Prerequisites
*   Python 3.8+
*   An API key for Google Gemini.

### Installation & Setup
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/knowledgebase-search-engine.git
    cd knowledgebase-search-engine
    ```

2.  **Create a virtual environment and install dependencies:**
    ```bash
    python -m venv venv
    source venv/bin/activate # On Windows, use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

3.  **Set up your environment variables:**
    Create a `.env` file in the root directory and add your Gemini API key:
    ```
    GEMINI_API_KEY="your_gemini_api_key"
    ```

### Running the Application
1.  **Start the FastAPI backend:**
    ```bash
    uvicorn app.main:app --reload
    ```
    The API will be accessible at `http://127.0.0.1:8000`.

2.  **Run the Streamlit frontend:**
    In a new terminal, run:
    ```bash
    streamlit run app_streamlit.py
    ```
    The web interface will be available at `http://localhost:8501`.

---

## 📖 API Routes
*   **`POST /api/upload`**: Upload one or more PDF or TXT files.
    *   **Request:** `multipart/form-data` with `files` field containing the files.
    *   **Response:** `{"message": "Successfully uploaded [filenames]"}`

*   **`POST /api/query`**: Ask a question and get an answer.
    *   **Request Body:** `{"query": "Your question here"}`
    *   **Response:** `{"answer": "The generated answer.", "source_documents": [...]}`

---

## 🧪 Example Usage

### 1. Upload Documents
Use the Streamlit UI or a tool like `curl` to upload your documents:
```bash
curl -X POST -F "files=@/path/to/your/document1.pdf" -F "files=@/path/to/your/document2.txt" http://127.0.0.1:8000/api/upload
```

### 2. Ask a Question
Once the documents are uploaded and processed, ask a question through the Streamlit UI or via the API:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"query": "What is the main topic of the documents?"}' http://127.0.0.1:8000/api/query
```

### Expected Output
The application will return a JSON object with the answer and the source documents that were used to generate it.

---

## 🎥 Demo Video Guidance
Follow the instructions in `demo_video_guide.txt` to create a compelling video demonstration of the project for your portfolio or university evaluation.
