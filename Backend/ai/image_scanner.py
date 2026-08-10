
from ultralytics import YOLO


# =====================================================
# MODEL
# =====================================================

MODEL_PATH = "yolo26n.pt"


_model = None


def get_model():

    global _model

    if _model is None:

        _model = YOLO(
            MODEL_PATH
        )

    return _model


# =====================================================
# CATEGORY MAPPING
# =====================================================

CATEGORY_MAP = {

    # Clothing-like / personal items
     "backpack": "Other",
     "handbag": "Other",
     "suitcase": "Other",

    # Electronics
    "laptop": "Electronics",
    "cell phone": "Electronics",
    "keyboard": "Electronics",
    "mouse": "Electronics",
    "remote": "Electronics",
    "tv": "Electronics",

    # Books / education
    "book": "Books",

    # Furniture
    "chair": "Furniture",
    "couch": "Furniture",
    "bed": "Furniture",
    "dining table": "Furniture",

    # Household
    "bottle": "Household",
    "cup": "Household",
    "bowl": "Household",
    "vase": "Household",

    # Food
    "banana": "Food",
    "apple": "Food",
    "sandwich": "Food",
    "orange": "Food",
    "broccoli": "Food",
    "carrot": "Food",
    "pizza": "Food",
    "donut": "Food",
    "cake": "Food",

}


# =====================================================
# SCAN IMAGE
# =====================================================

def scan_image(image_path):

    model = get_model()


    # Run prediction

    results = model.predict(
        source=image_path,
        conf=0.25,
        verbose=False
    )


    if not results:

        return {
            "success": False,
            "message": "No objects detected."
        }


    result = results[0]


    if result.boxes is None:

        return {
            "success": False,
            "message": "No objects detected."
        }


    boxes = result.boxes


    if len(boxes) == 0:

        return {
            "success": False,
            "message": "No recognizable item detected."
        }


    detections = []


    for i in range(len(boxes)):

        class_id = int(
            boxes.cls[i].item()
        )

        confidence = float(
            boxes.conf[i].item()
        )


        class_name = model.names[
            class_id
        ]


        category = CATEGORY_MAP.get(
            class_name,
            "Other"
        )


        detections.append({

            "item": class_name,

            "category": category,

            "confidence": round(
                confidence * 100,
                2
            ),

        })


    # Sort by confidence

    detections.sort(
        key=lambda x:
        x["confidence"],
        reverse=True
    )


    best = detections[0]


    return {

        "success": True,

        "item": best["item"],

        "category": best["category"],

        "confidence": best["confidence"],

        "detections": detections,

    }