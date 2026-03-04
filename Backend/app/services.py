import os
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def clean_json(text):
    import re

    # Remove markdown code blocks
    text = re.sub(r"```json", "", text)
    text = re.sub(r"```", "", text)

    # Remove text before first {
    start = text.find("{")
    if start != -1:
        text = text[start:]

    # Remove trailing commas
    text = re.sub(r",\s*}", "}", text)
    text = re.sub(r",\s*]", "]", text)

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
You are an expert academic knowledge organizer.

Analyze the text and generate a highly structured, conceptually deep mindmap.

Strict Requirements:
- Minimum 5 major subtopics
- Maximum 8 subtopics
- Each subtopic must contain 4–6 non-repetitive, conceptually strong points
- Avoid vague phrases like "important aspect"
- Use precise academic terminology
- Do not repeat ideas across subtopics
- Ensure logical grouping
- Ensure hierarchical clarity

Return STRICT JSON only in this format:
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

def validate_mindmap_structure(data):
    if "subtopics" not in data:
        return False

    if len(data["subtopics"]) < 5:
        return False

    for sub in data["subtopics"]:
        if "points" not in sub:
            return False
        if len(sub["points"]) < 4:
            return False

    return True

def safe_parse_json(text):
    import json

    try:
        return json.loads(text)
    except Exception:
        cleaned = clean_json(text)
        return json.loads(cleaned)