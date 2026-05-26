import os
import glob
import json

app_data_dir = r"C:\Users\Mujtaba Hasan\.gemini\antigravity\brain"
log_files = glob.glob(os.path.join(app_data_dir, '*', '.system_generated', 'logs', 'transcript.jsonl'))

for log_file in log_files:
    try:
        with open(log_file, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    step = json.loads(line)
                    if 'tool_calls' in step:
                        for call in step['tool_calls']:
                            func_name = call.get('function_name', '')
                            # Sometimes the key might be 'function' or 'name' inside 'function'
                            if 'function' in call:
                                func_name = call['function'].get('name', '')
                            
                            if 'write_to_file' in func_name or 'write_to_file' in str(call):
                                print(f"Found write_to_file tool call in {log_file}!")
                                print(json.dumps(call, indent=2)[:1000]) # Print first 1000 chars
                                exit(0)
                except json.JSONDecodeError:
                    continue
    except Exception as e:
        pass
