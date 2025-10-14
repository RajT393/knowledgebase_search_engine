
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_huggingface import HuggingFacePipeline
from transformers import pipeline

def get_llm(model_name: str = "google/flan-t5-small", temperature: float = 0.7):
    """
    Get a Hugging Face pipeline for text generation.

    Args:
        model_name (str, optional): The name of the model to use. Defaults to "google/flan-t5-small".
        temperature (float, optional): The temperature to use for the model. Defaults to 0.7.

    Returns:
        HuggingFacePipeline: A Hugging Face pipeline.
    """
    pipe = pipeline(
        "text2text-generation",
        model=model_name,
        max_length=512,
        device=-1  # Force CPU usage
    )
    # The temperature flag is not valid for flan-t5 models and will be ignored.
    return HuggingFacePipeline(pipeline=pipe)

def get_prompt_template() -> PromptTemplate:
    """
    Get the prompt template for the RAG system.

    Returns:
        PromptTemplate: A prompt template.
    """
    prompt_template = """
    You are an expert assistant. Your task is to answer the user's question based *only* on the provided context.
    Read the context carefully, synthesize the information, and provide a clear, concise answer.Do not repeat yourself.
    Do not add any information that is not in the context.

    Context:
    {context}

    Question:
    {question}

    Concise Answer:
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

