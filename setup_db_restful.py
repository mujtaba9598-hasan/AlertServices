import urllib.request
import json

url = 'https://api.restful-api.dev/objects'
data = b'{"name": "AlertServiceTrades2026", "data": {"trades": []}}'
headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

req = urllib.request.Request(url, data=data, headers=headers, method='POST')
try:
    res = urllib.request.urlopen(req)
    response_data = res.read().decode('utf-8')
    print("SUCCESS")
    print(response_data)
except Exception as e:
    print(f"FAILED: {e}")
