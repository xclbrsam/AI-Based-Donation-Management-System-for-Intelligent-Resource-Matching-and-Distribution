import json
import os
from pathlib import Path

from dotenv import load_dotenv
from PIL import Image
from google import genai
from google.genai import types


# =====================================================
# LOAD .ENV
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(
    BASE_DIR / ".env"
)


# =====================================================
# GEMINI API KEY
# =====================================================

API_KEY = os.getenv(
    "GEMINI_API_KEY"
)

if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY is not configured."
    )


# =====================================================
# GEMINI CLIENT
# =====================================================

client = genai.Client(
    api_key=API_KEY
)

# =====================================================
# GEMINI RESPONSE SCHEMA
# =====================================================

DONATION_SCHEMA = {
    "type": "object",
    "properties": {
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "item": {
                        "type": "string"
                    },
                    "category": {
                        "type": "string"
                    },
                    "quantity": {
                        "type": "integer"
                    },
                    "confidence": {
                        "type": "number"
                    }
                },
                "required": [
                    "item",
                    "category",
                    "quantity",
                    "confidence"
                ]
            }
        }
    },
    "required": ["items"]
}


# =====================================================
# ANALYZE DONATION IMAGE
# =====================================================

def analyze_donation_image(image_path):

    try:

        image = Image.open(image_path)

        prompt = """
You are an AI assistant for a donation management system.

Analyze the uploaded image and identify ALL visible
physical items that could reasonably be donated.

Rules:

1. Detect every visible donation-relevant item.
2. If there are 3 books, return quantity as 3.
3. Group identical items together.
4. Do not invent objects that are not visible.
5. Ignore people, faces, hands and background objects.
6. Focus on physical donation items.
7. Use simple item names.
8. Assign each item to an appropriate category.

Possible categories:

Clothing
Books
Education
Electronics
Furniture
Household
Food
Toys
Other

Confidence must be between 0 and 1.

Return ONLY the requested JSON structure.
"""

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=[
                image,
                prompt
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_json_schema=DONATION_SCHEMA
            )
        )

        raw_response = response.text

        data = json.loads(raw_response)

        return {
            "success": True,
            "items": data.get("items", [])
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }