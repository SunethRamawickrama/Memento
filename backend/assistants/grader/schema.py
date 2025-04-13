from pydantic import BaseModel, Field

class RecallQuestion(BaseModel):
    """ A recall question about the journal event """

    context : str = Field(
        description="context of the journal event that does not include the answer to the question",
        default=None
    )

    question : str = Field(
        description="recall question about the journal event",
        default=None
    )

    answer : str = Field(
        description="answer to the recall question",
        default=None
    )

class Memory(BaseModel):
    """ A summary of a single journal event """

    summary : str = Field(
        description="summary of the journal event",
        default=None
    )

    recall_questions : list[RecallQuestion] = Field(
        description="recall questions about the journal event",
        default_factory=list
    )