import zipfile
import os

zip_path = r"C:\Users\K.Meghana\Downloads\Projects\zidio_project\Sirs given files\retailpulse-main.zip"
if os.path.exists(zip_path):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        print("Python files in zip:")
        for f in zip_ref.namelist():
            if f.endswith(".py"):
                print(" ", f)
        print("CSV files in zip:")
        for f in zip_ref.namelist():
            if f.endswith(".csv"):
                print(" ", f)
else:
    print("Zip file not found!")
