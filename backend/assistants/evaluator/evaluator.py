from google import genai
from dotenv import load_env

from .schema import *
from .prompts import *

load_env()

def main(summary, recall_questions):
    client = genai.Client()
    content = QA_PROMPT.format(summary=summary, recall_questions=recall_questions)

    qa_transcript = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=content,
    )

    event_summary: Evaluation = response.parsed
    content = GRADER_PROMPT.format(qa_transcript=qa_transcript)

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