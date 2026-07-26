import os

file_path = r"C:\Users\K.Meghana\Downloads\Projects\FORESIGHT\app\app.py"
if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        for idx, line in enumerate(lines):
            if 'Page 3' in line or 'Settings' in line or 'studio_model' in line:
                # print without raising emoji error
                print(f"Line {idx+1}: {ascii(line.strip())}")
else:
    print("File not found!")
