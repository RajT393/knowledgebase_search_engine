
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI
from app.utils import get_env_variable
import os

def get_llm(model_name: str = "gemini-pro", temperature: float = 0.7):
    """
    Get a Google Generative AI model.

    Args:
        model_name (str, optional): The name of the model to use. Defaults to "gemini-pro".
        temperature (float, optional): The temperature to use for the model. Defaults to 0.7.

    Returns:
        ChatGoogleGenerativeAI: A Google Generative AI model.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set.")
    return ChatGoogleGenerativeAI(model=model_name, temperature=temperature, google_api_key=api_key)

def get_prompt_template() -> PromptTemplate:
    """
    Get the prompt template for the RAG system.

    Returns:
        PromptTemplate: A prompt template.
    """
    prompt_template = """
    You are an intelligent assistant that answers questions based on the provided document context.
    Use only the context below to answer accurately.

    Context:
    {context}

    Question:
    {question}

    Answer concisely and clearly, without speculation.
    """
    return PromptTemplate(template=prompt_template, input_variables=["context", "question"])

def create_llm_chain(llm, prompt_template: PromptTemplate) -> LLMChain:
    """
    Create an LLM chain.

    Args:
        llm: The language model to use.
        prompt_template (PromptTemplate): The prompt template to use.

    Returns:
        LLMChain: An LLM chain.
    """
    return LLMChain(llm=llm, prompt=prompt_template)

