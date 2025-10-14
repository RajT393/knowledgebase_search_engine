
# 7. Knowledge-base Search Engine

**Kind Attn: Unthinkable Applied Students**
It is noted that many students are uploading their resumes. We request everyone please go through the mail and do the assignment and upload it. If found any again action will be taken as per university norms.

PFB the list of assignment allocation in the below mentioned sheet along with the assignments attached below for your reference, kindly share the assignment with the candidates with respect to the exact allocation in front of their name.
Deadline to submit the assignment- 15th oct 2025.

All are asked to submit the assignment in the below link on or before 15th Oct 2025 without fail.

---

## 🎯 Objective
Search across documents and provide synthesized answers using LLM-based Retrieval-Augmented Generation (RAG).

## 🧩 Scope of Work
*   Input: Multiple text/PDF documents
*   Output: User query → synthesized answer
*   Frontend for query submission & display

## ⚙️ Technical Expectations
*   Backend API to handle document ingestion & queries
*   RAG implementation or embeddings for retrieval
*   LLM for answer synthesis

## 🧠 LLM Usage Guidance
*   Prompt example: “Using these documents, answer the user’s question succinctly.”

## 🧮 Deliverables
*   GitHub repo + README
*   Demo video

## 📊 Evaluation Focus
*   Retrieval accuracy, synthesis quality, code structure, LLM integration

---

## Project Overview
This project is a production-grade "Knowledge-base Search Engine" that uses a Retrieval-Augmented Generation (RAG) architecture to search across multiple uploaded documents (PDF/TXT) and provide accurate, synthesized answers to user queries. This version runs entirely locally, using free, open-source models from Hugging Face, and features a modern Next.js frontend.

## Architecture
The application follows a classic RAG pipeline:

1.  **Document Ingestion:** Users upload PDF or TXT files through a web interface. Uploading new files automatically clears previous ones to ensure a focused knowledge base.
2.  **Chunking:** The uploaded documents are split into smaller, manageable chunks.
3.  **Embedding:** Each chunk is converted into a numerical representation (embedding) using a local `SentenceTransformers` model (`all-MiniLM-L6-v2`).
4.  **Vector Storage:** The embeddings are stored in a local FAISS vector database for efficient similarity search. The vector store is rebuilt on every query to ensure it's always up-to-date with the latest uploaded files.
5.  **Retrieval & Re-ranking:** When a user asks a question, the query is embedded, and the vector database is searched for the most relevant document chunks. These initial results are then **re-ranked** by a `Cross-Encoder` model (`cross-encoder/ms-marco-MiniLM-L-6-v2`) to ensure only the most pertinent chunks are passed to the LLM.
6.  **Answer Synthesis:** The re-ranked chunks (context) and the original query are passed to a local instruction-tuned model (`google/flan-t5-small`), which generates a concise and accurate answer.

![RAG Architecture](https://i.imgur.com/3A2Y4fH.png)

---

## ⚙️ Technical Stack
*   **Backend:** Python (FastAPI)
*   **RAG Implementation:** LangChain
*   **Vector Database:** FAISS (Facebook AI Similarity Search)
*   **Embeddings:** Hugging Face SentenceTransformers (`all-MiniLM-L6-v2`)
*   **Re-ranking:** Hugging Face Cross-Encoder (`cross-encoder/ms-marco-MiniLM-L-6-v2`)
*   **LLM:** Hugging Face Transformers (`google/flan-t5-small`)
*   **Frontend:** Next.js (React) with Tailwind CSS
*   **File Formats:** PDF (via PyMuPDFLoader), TXT

---

## 🚀 Getting Started

### Prerequisites
*   Python 3.8+
*   Node.js (LTS version recommended)
*   `pip` and `npm` (or `yarn`) for package management.

### Installation & Setup
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/knowledgebase-search-engine.git
    cd knowledgebase_search_engine
    ```

2.  **Backend Setup:**
    *   **Create a Python virtual environment:**
        ```bash
        python -m venv envname
        source envname/bin/activate # On Windows, use `envname\Scripts\activate`
        ```
    *   **Install Python dependencies:**
        ```bash
        pip install -r requirements.txt
        ```

3.  **Frontend Setup:**
    *   **Navigate to the frontend directory:**
        ```bash
        cd frontend
        ```
    *   **Install Node.js dependencies:**
        ```bash
        npm install
        ```

    **Note:** The first time you run the application, the necessary Hugging Face models (a few hundred MBs each) will be downloaded and cached on your machine. This may take a few minutes depending on your internet connection.

### Running the Application
1.  **Start the FastAPI backend:**
    *   Open a new terminal in the project's root directory (`knowledgebase_search_engine`).
    *   Activate your Python virtual environment: `source envname/bin/activate` (or `envname\Scripts\activate` on Windows).
    *   Run:
        ```bash
        uvicorn app.main:app --reload
        ```
    The API will be accessible at `http://127.0.0.1:8000`.

2.  **Start the Next.js frontend:**
    *   Open *another* new terminal.
    *   Navigate to the `frontend` directory: `cd frontend`.
    *   Run:
        ```bash
        npm run dev
        ```
    The web interface will be available at `http://localhost:3000`.

---

## 📖 API Routes
*   **`POST /api/upload`**: Upload one or more PDF or TXT files. Clears previous files.
    *   **Request:** `multipart/form-data` with `files` field containing the files.
    *   **Response:** `{"message": "Successfully uploaded [filenames]"}`

*   **`GET /api/documents`**: List all currently uploaded document filenames.
    *   **Response:** `{"files": ["file1.pdf", "file2.txt"]}`

*   **`POST /api/query`**: Ask a question and get an answer.
    *   **Request Body:** `{"query": "Your question here"}`
    *   **Response:** `{"answer": "The generated answer.", "source_documents": [...]}`

---

## 🎥 Demo Video Guidance
Follow the instructions in `demo_video_guide.txt` to create a compelling video demonstration of the project for your portfolio or university evaluation.
