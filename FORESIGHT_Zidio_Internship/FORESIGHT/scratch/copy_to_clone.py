import os
import shutil

src_dir = r"C:\Users\K.Meghana\Downloads\Projects\FORESIGHT_Zidio_Internship\FORESIGHT"
dest_dir = r"C:\Users\K.Meghana\Downloads\clone\Foresight\FORESIGHT_Zidio_Internship\FORESIGHT"

# Helper to copy directory contents
def copy_folder(src_sub, dest_sub):
    src_path = os.path.join(src_dir, src_sub)
    dest_path = os.path.join(dest_dir, dest_sub)
    
    if os.path.exists(src_path):
        if os.path.exists(dest_path):
            shutil.rmtree(dest_path)
        shutil.copytree(src_path, dest_path)
        print(f"Copied: {src_sub} -> {dest_sub}")
    else:
        print(f"Source not found: {src_sub}")

# Copy app and .streamlit directories
copy_folder("app", "app")
copy_folder(".streamlit", ".streamlit")
print("Folders copied successfully to clone directory!")
