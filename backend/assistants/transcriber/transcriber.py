from google import genai
from dotenv import load_env

load_env()

def main(audio_file_path: str):
    client = genai.Client()

    myfile = client.files.upload(file=audio_file_path)
    prompt = 'Generate a transcript of the speech.'

    transcript = client.models.generate_content(
        model='gemini-2.0-flash',
        contents=[prompt, myfile]
    )

    return transcript.text