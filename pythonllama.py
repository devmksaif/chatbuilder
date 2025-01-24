import requests
import json

url = "http://127.0.0.1:11434/api/generate/"
headers = {
    "Content-Type": "application/json"
}
data = {
    "model": "llama3.2:1b",
    "prompt": "what does 'Nheb nkhales fatourat mteeyi' in tunisian???",
    "temperature": 0.7,
    "max_tokens": 150
}

response = requests.post(url, headers=headers, json=data)

import json

raw_response = response.text
full_context = ""
try:
    data = [json.loads(obj) for obj in raw_response.splitlines()]  # Split and load each JSON object
    for i in data:
        full_context += i["response"]
except json.JSONDecodeError as e:
    print("Error parsing JSON:", e)


print(full_context)