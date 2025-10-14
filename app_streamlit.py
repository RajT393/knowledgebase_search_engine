
import streamlit as st
import requests
import os

# --- Page Configuration ---
st.set_page_config(
    page_title="Knowledge-Base Search Engine",
    page_icon="📚",
    layout="wide",
)

# --- Backend API Configuration ---
FASTAPI_URL = "http://127.0.0.1:8000"

# --- Helper Functions ---
def upload_documents(files):
    """Send files to the backend for processing."""
    with st.spinner("Processing documents..."):
        try:
            response = requests.post(f"{FASTAPI_URL}/api/upload", files=[("files", file) for file in files])
            response.raise_for_status()  # Raise an exception for bad status codes
            st.success("Documents uploaded and processed successfully!")
        except requests.exceptions.RequestException as e:
            st.error(f"Error uploading documents: {e}")

def ask_question(query):
    """Send a question to the backend and get an answer."""
    with st.spinner("Searching for answers..."):
        try:
            response = requests.post(f"{FASTAPI_URL}/api/query", json={"query": query})
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            st.error(f"Error getting answer: {e}")
            return None

# --- UI Components ---
st.title("📚 Knowledge-Base Search Engine")
st.write("Upload your documents and ask questions to get AI-powered answers.")

with st.sidebar:
    st.header("1. Upload Documents")
    uploaded_files = st.file_uploader(
        "Choose PDF or TXT files", accept_multiple_files=True, type=["pdf", "txt"]
    )
    if st.button("Process Documents") and uploaded_files:
        upload_documents(uploaded_files)

st.header("2. Ask a Question")
query_input = st.text_input("Enter your question here:")

if st.button("Get Answer") and query_input:
    result = ask_question(query_input)
    if result:
        st.subheader("Answer:")
        st.write(result.get("answer", "No answer found."))

        if "source_documents" in result and result["source_documents"]:
            with st.expander("Show Sources"):
                for doc in result["source_documents"]:
                    st.info(f"Source: {doc.get('source', 'N/A')}")

