import zipfile
import os
import shutil

zip_path = r"C:\Users\K.Meghana\Downloads\Projects\zidio_project\Sirs given files\retailpulse-main.zip"
dest_dir = r"C:\Users\K.Meghana\Downloads\Projects\FORESIGHT_Zidio_Internship\FORESIGHT"

if os.path.exists(zip_path):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        for member in zip_ref.infolist():
            # Strip the 'retailpulse-main/' prefix
            filename = member.member_name if hasattr(member, 'member_name') else member.filename
            if filename.startswith("retailpulse-main/"):
                relative_path = filename[len("retailpulse-main/"):]
                if not relative_path:
                    continue
                
                target_path = os.path.join(dest_dir, relative_path)
                
                if member.is_dir():
                    os.makedirs(target_path, exist_ok=True)
                else:
                    # Make sure parent directory exists
                    os.makedirs(os.path.dirname(target_path), exist_ok=True)
                    with zip_ref.open(member) as source, open(target_path, "wb") as target:
                        shutil.copyfileobj(source, target)
                    print(f"Extracted: {relative_path}")
    print("Extraction completed successfully to correct folder!")
else:
    print("Zip file not found!")
