import json
import glob
import os

app_data_dir = r"C:\Users\Mujtaba Hasan\.gemini\antigravity\brain"
# use current conversation first
log_file = os.path.join(app_data_dir, "a50def65-6e7d-42de-9d36-44bca454e72f", ".system_generated", "logs", "transcript.jsonl")

with open(log_file, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            if 'tool_calls' in step:
                for call in step['tool_calls']:
                    print("CALL KEYS:", list(call.keys()))
                    if 'function' in call:
                        print("FUNC:", call['function'])
                    else:
                        print("RAW CALL:", call)
                    exit(0)
        except Exception as e:
            pass
