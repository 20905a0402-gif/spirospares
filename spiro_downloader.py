import os
import requests

# 1. Setup the local storage folders on your laptop
base_path = os.path.expanduser("~/Desktop/Spiro_Media_Assets")
categories = ["Bikes", "Parts", "Accessories"]

for cat in categories:
    os.makedirs(f"{base_path}/{cat}", exist_ok=True)

# 2. List of high-res image URLs (Placeholder URLs - these represent the 60 images)
# In a real scenario, you would replace these strings with the actual image links.
image_data = {
    "Bikes": [f"https://spiro.com/assets/bike_{i}.jpg" for i in range(1, 21)],
    "Parts": [f"https://spiro.com/assets/part_{i}.jpg" for i in range(1, 21)],
    "Accessories": [f"https://spiro.com/assets/acc_{i}.jpg" for i in range(1, 21)]
}

print(f"🚀 Starting download to: {base_path}")

# 3. The Download Loop
for category, urls in image_data.items():
    print(f"📥 Downloading 20 {category} photos...")
    for index, url in enumerate(urls):
        try:
            # We use 'requests' to grab the image data
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                file_path = f"{base_path}/{category}/{category.lower()}_{index+1}.jpg"
                with open(file_path, "wb") as f:
                    f.write(response.content)
        except Exception as e:
            print(f"Could not download {url}: {e}")

print("✅ Task Complete! All 60 photos are in your local storage.")