import os
import json

app_data_dir = r"C:\Users\Mujtaba Hasan\.gemini\antigravity\brain"
conv_ids = [
    "5d3469b6-5c62-408a-9307-9a35877b8eb2",
    "15a59e5b-7b8c-4493-9680-057c711e0384"
]

target_files = [
    "index.html", "about.html", "calculator.html", "contact.html", 
    "easter-egg-hints.html", "grinding.html", "pvp-training.html", 
    "sea-events.html", "titles.html", "raids.html", "trials.html", "trading.html"
]

file_contents = {}

for cid in conv_ids:
    log_file = os.path.join(app_data_dir, cid, ".system_generated", "logs", "transcript.jsonl")
    if not os.path.exists(log_file):
        print(f"Skipping {cid}, log not found.")
        continue
        
    print(f"Processing {cid}...")
    try:
        with open(log_file, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    step = json.loads(line)
                    if 'tool_calls' in step:
                        for call in step['tool_calls']:
                            func_name = call.get('name', call.get('function_name', ''))
                            if 'write_to_file' in func_name or 'replace_file_content' in func_name:
                                args = call.get('args', call.get('arguments', {}))
                                if isinstance(args, str):
                                    try:
                                        args = json.loads(args)
                                    except:
                                        pass
                                
                                target_path = args.get('TargetFile', '')
                                if isinstance(target_path, str) and target_path.startswith('"') and target_path.endswith('"'):
                                    target_path = json.loads(target_path)
                                
                                # Strict match
                                if not isinstance(target_path, str) or "Gohar" not in target_path:
                                    continue
                                
                                for t_file in target_files:
                                    if target_path.endswith(t_file):
                                        content = args.get('CodeContent', '')
                                        # Also handle replace_file_content full reconstruction?
                                        # Actually replace_file_content only has 'ReplacementContent', not full file.
                                        # Let's focus on write_to_file
                                        if 'write_to_file' in func_name:
                                            if isinstance(content, str) and content.startswith('"') and content.endswith('"'):
                                                try:
                                                    content = json.loads(content)
                                                except:
                                                    pass
                                            if content:
                                                file_contents[t_file] = content
                                                print(f"Found complete {t_file} via write_to_file in {cid}")
                except json.JSONDecodeError:
                    continue
    except Exception as e:
        print(f"Error reading {log_file}: {e}")

print(f"\nFinal files found: {list(file_contents.keys())}")

restore_dir = r"C:\Users\Mujtaba Hasan\Downloads\Gohar"
for filename, content in file_contents.items():
    out_path = os.path.join(restore_dir, filename)
    with open(out_path, 'w', encoding='utf-8') as f:
        # Handle string escapes
        if '\\n' in content and not '\n' in content:
            content = content.encode().decode('unicode_escape')
        f.write(content)
    print(f"Successfully restored {filename}")
