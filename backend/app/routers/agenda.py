from fastapi import APIRouter, HTTPException
from ..models.schemas import AgendaRequest, AgendaAIResponse
from ..services.ai import optimize_agenda

router = APIRouter(
    prefix="/api",
    tags=["agenda"]
)


@router.post("/agenda", response_model=AgendaAIResponse)
async def create_agenda(request: AgendaRequest):
    """
    AI Agenda Optimizer endpoint.

    This is called from the /agenda page when users submit meeting topics.
    The AI organizes the topics into a structured, time-boxed agenda.

    Request body:
    - message: The user's current message (list of topics)
    - history: Array of previous messages in the conversation

    Returns:
    - response: AI-generated organized agenda
    """
    try:
        # Call AI service to optimize the agenda
        ai_response = optimize_agenda(
            user_message=request.message,
            conversation_history=request.history
        )

        return AgendaAIResponse(response=ai_response)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing agenda request: {str(e)}"
        )
