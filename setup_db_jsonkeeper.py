import urllib.request
import json

url = 'https://jsonkeeper.com/api/store'
data = b'{"trades": []}'
headers = {
    'Content-Type': 'application/json'
}

req = urllib.request.Request(url, data=data, headers=headers, method='POST')
try:
    res = urllib.request.urlopen(req)
    response_data = res.read().decode('utf-8')
    print("SUCCESS")
    print(response_data)
except Exception as e:
    print(f"FAILED: {e}")
