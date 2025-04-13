from google import genai
from dotenv import load_dotenv

from .schema import *
from .prompts import *

load_dotenv()

def qa(summary, recall_questions):
    client = genai.Client()
    content = QA_PROMPT.format(summary=summary, recall_questions=recall_questions)

    qa_transcript = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=content,
    )

    return qa_transcript.text

def evaluate(context, recall_questions, questions, answer):
    client = genai.Client() 
    content = GRADER_PROMPT.format(
        context=context, recall_questions=recall_questions, question=questions, answer=answer
    )
    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=content,
        config={
            'response_mime_type': 'application/json',
            'response_schema': Evaluation,
        },
    )

    event_summary: Evaluation = response.parsed

    return (
        event_summary.recall, 
        event_summary.confidence,
        event_summary.clarity,
        event_summary.overall,
    )