
import os
import logging
from dotenv import load_dotenv

def setup_environment():
    """Load environment variables from .env file."""
    load_dotenv()

def get_env_variable(variable_name: str, default_value: str = None) -> str:
    """
    Get an environment variable.

    Args:
        variable_name (str): The name of the environment variable.
        default_value (str, optional): The default value to return if the variable is not found. Defaults to None.

    Returns:
        str: The value of the environment variable.
    """
    value = os.getenv(variable_name)
    if value is None:
        if default_value is None:
            raise ValueError(f"Environment variable '{variable_name}' not found.")
        return default_value
    return value

def setup_logging():
    """Configure logging for the application."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler()
        ]
    )

