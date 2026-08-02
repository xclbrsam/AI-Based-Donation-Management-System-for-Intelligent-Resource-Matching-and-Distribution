def recommend_ngo(category):
    recommendations = {
        "Food": {
            "ngo": "Food Bank NGO",
            "confidence": "98%"
        },
        "Clothes": {
            "ngo": "Helping Hands NGO",
            "confidence": "95%"
        },
        "Books": {
            "ngo": "Education Trust NGO",
            "confidence": "96%"
        },
        "Medicine": {
            "ngo": "Health Care NGO",
            "confidence": "99%"
        },
        "Electronics": {
            "ngo": "Tech Recycle NGO",
            "confidence": "92%"
        },
        "Other": {
            "ngo": "Community Support NGO",
            "confidence": "90%"
        }
    }

    return recommendations.get(
        category,
        {
            "ngo": "Community Support NGO",
            "confidence": "85%"
        }
    )