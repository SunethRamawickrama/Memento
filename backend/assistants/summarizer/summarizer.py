from google import genai
from dotenv import load_dotenv

from prompts import SUMMARIZER_PROMPT
from schema import *

load_dotenv()

def main(conversation):
    client = genai.Client()
    content = SUMMARIZER_PROMPT.format(conversation=conversation)

    response = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=content,
        config={
            'response_mime_type': 'application/json',
            'response_schema': list[Memory],
        },
    )

    print(response.text)

    event_summary: list[Memory] = response.parsed
    return event_summary

