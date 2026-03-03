import os
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def clean_json(text):
    import re

    text = re.sub(r"```json", "", text)
    text = re.sub(r"```", "", text)
    text = re.sub(r"\*\*", "", text)  # remove bold markers
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

def generate_mindmap_from_text(text: str):
    prompt = f"""
You are an expert academic teacher.

Analyze the following text carefully.

1. Identify the central theme automatically.
2. Generate a deeply structured hierarchical mindmap.
3. Minimum 5 major subtopics.
4. Each subtopic must have 4–6 meaningful points.
5. Ensure logical grouping and no repetition.
6. Keep explanations concise but conceptually strong.

Return STRICTLY in JSON format:
{{
  "topic": "",
  "subtopics": [
    {{
      "title": "",
      "points": []
    }}
  ]
}}

Text:
{text}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return clean_json(response.text)