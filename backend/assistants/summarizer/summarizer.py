from google import genai
from dotenv import load_dotenv

from .prompts import SUMMARIZER_PROMPT
from .schema import *

load_dotenv()

def main(journal_entry, person):
    client = genai.Client()
    content = SUMMARIZER_PROMPT.format(journal_entry=journal_entry, person=person)

    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=content,
        config={
            'response_mime_type': 'application/json',
            'response_schema': Memory,
        },
    )

    event_summary: Memory = response.parsed
    return event_summary.model_dump()

