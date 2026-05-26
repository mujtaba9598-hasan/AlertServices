import urllib.request
import json

url = 'https://api.jsonbin.io/v3/b'
data = b'{"trades": []}'
headers = {
    'Content-Type': 'application/json',
    'X-Bin-Private': 'false'
}

req = urllib.request.Request(url, data=data, headers=headers, method='POST')
try:
    res = urllib.request.urlopen(req)
    response_data = res.read().decode('utf-8')
    print("SUCCESS")
    print(response_data)
except Exception as e:
    print(f"FAILED: {e}")
