import os
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def clean_json(text):
    text = re.sub(r"```json", "", text)
    text = re.sub(r"```", "", text)
    return text.strip()


def generate_mindmap_with_context(topic: str, context_chunks: list):
    context = "\n\n".join(context_chunks)

    prompt = f"""
You are an expert teacher.

Using ONLY the context below, generate a hierarchical mindmap.

Return strictly in JSON format:
{{
  "topic": "",
  "subtopics": [
    {{
      "title": "",
      "points": []
    }}
  ]
}}

Topic: {topic}

Context:
{context}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return clean_json(response.text)


def generate_direct_mindmap(topic: str):
    prompt = f"""
Generate a detailed hierarchical mindmap for topic: {topic}

Return strictly in JSON:
{{
  "topic": "",
  "subtopics": [
    {{
      "title": "",
      "points": []
    }}
  ]
}}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return clean_json(response.text)