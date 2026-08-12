from ai.gemini_detector import analyze_donation_image
IMAGE_PATH = "test_donation.jpg"


result = analyze_donation_image(
    IMAGE_PATH
)


print("\n===================================")
print("GEMINI DONATION DETECTION")
print("===================================")

print(result)