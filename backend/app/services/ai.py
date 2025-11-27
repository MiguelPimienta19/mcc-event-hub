import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def optimize_agenda(user_message: str, conversation_history: list = None) -> str:
    """
    Uses OpenAI to organize meeting topics into a structured agenda.

    Args:
        user_message: The user's input (list of topics)
        conversation_history: Previous messages in the conversation

    Returns:
        AI-generated organized agenda
    """
    # System prompt that defines the AI's behavior
    system_prompt = """You help organize meeting topics into a clear agenda.

    Take the user's topics and arrange them in a logical order for the meeting."""

    # Build messages array
    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history if provided
    if conversation_history:
        messages.extend(conversation_history)

    # Add current user message
    messages.append({"role": "user", "content": user_message})

    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Fast and cost-effective
            messages=messages,
            temperature=0.7,  # Balance creativity and consistency
            max_tokens=500
        )

        return response.choices[0].message.content

    except Exception as e:
        # Return error message if OpenAI call fails
        return f"Sorry, I encountered an error: {str(e)}. Please make sure your OpenAI API key is set correctly."

