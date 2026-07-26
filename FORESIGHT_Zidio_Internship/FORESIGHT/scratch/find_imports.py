import os

project_dir = r"C:\Users\K.Meghana\Downloads\Projects\FORESIGHT_Zidio_Internship\FORESIGHT\app"
for root, dirs, files in os.walk(project_dir):
    for file in files:
        if file.endswith(".py"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                if "from app." in content or "import app." in content:
                    print(f"File: {os.path.relpath(path, project_dir)}")
                    for idx, line in enumerate(content.splitlines()):
                        if "from app." in line or "import app." in line:
                            print(f"  Line {idx+1}: {line.strip()}")
