import os
import glob
import json

app_data_dir = r"C:\Users\Mujtaba Hasan\.gemini\antigravity\brain"
log_files = glob.glob(os.path.join(app_data_dir, '*', '.system_generated', 'logs', 'transcript.jsonl'))

target_files = [
    "index.html", "about.html", "calculator.html", "contact.html", 
    "easter-egg-hints.html", "grinding.html", "pvp-training.html", 
    "sea-events.html", "titles.html", "raids.html", "trials.html", "trading.html"
]

file_contents = {}
log_files.sort(key=os.path.getmtime)

for log_file in log_files:
    try:
        with open(log_file, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    step = json.loads(line)
                    if 'tool_calls' in step:
                        for call in step['tool_calls']:
                            func_name = call.get('name', '')
                            
                            if 'write_to_file' in func_name:
                                args = call.get('args', {})
                                
                                if isinstance(args, str):
                                    try:
                                        args = json.loads(args)
                                    except:
                                        pass
                                        
                                target_path = args.get('TargetFile', '')
                                if isinstance(target_path, str) and target_path.startswith('"') and target_path.endswith('"'):
                                    target_path = json.loads(target_path)
                                
                                # STRICT CHECK: Must be inside the Gohar directory
                                if "Gohar" not in target_path:
                                    continue
                                    
                                for t_file in target_files:
                                    if target_path.endswith(t_file):
                                        content = args.get('CodeContent', '')
                                        if isinstance(content, str) and content.startswith('"') and content.endswith('"'):
                                            try:
                                                content = json.loads(content)
                                            except:
                                                pass
                                        
                                        if content:
                                            file_contents[t_file] = content
                                            print(f"Found {t_file} for Gohar")
                except json.JSONDecodeError:
                    continue
    except Exception as e:
        pass

print(f"Found contents for: {list(file_contents.keys())}")

restore_dir = r"C:\Users\Mujtaba Hasan\Downloads\Gohar"
for filename, content in file_contents.items():
    out_path = os.path.join(restore_dir, filename)
    with open(out_path, 'w', encoding='utf-8') as f:
        # handle json dumped strings if they have \n escaped
        if '\\n' in content and not '\n' in content:
            content = content.encode().decode('unicode_escape')
        f.write(content)
    print(f"Restored {filename} to {out_path}")
