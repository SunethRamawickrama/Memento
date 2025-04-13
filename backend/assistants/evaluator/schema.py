from pydantic import BaseModel, Field

class Evaluation(BaseModel):
    """ A grade for the user's recall of a journal event """

    recall: float = Field(
        ge=0.0, le=1.0,
        description="How accurately does the response reflect key details and facts from the conversation?",
        default=None
    )
    confidence: float = Field(
        ge=0.0, le=1.0,
        description="How convincingly does the user present their answers?",
        default=None
    )
    clarity: float = Field(
        ge=0.0, le=1.0,
        description="Is the user's response clear, coherent, and easy to understand?",
        default=None
    )
    overall: float = Field(
        ge=0.0, le=1.0,
        description="A holistic assessment that takes into account all of the above aspects.",
        default=None
    )