import os
from rembg import remove
from PIL import Image
import io

icon_dir = '/Users/henry/Documents/code/gemini/personal-web-os/src/assets/icons'
processed_dir = '/Users/henry/Documents/code/gemini/personal-web-os/src/assets/icons/processed'

if not os.path.exists(processed_dir):
    os.makedirs(processed_dir)

files = [f for f in os.listdir(icon_dir) if f.endswith('.png')]

print(f"Found {len(files)} icons to process.")

for file in files:
    input_path = os.path.join(icon_dir, file)
    output_path = os.path.join(icon_dir, file) # Overwrite original
    
    print(f"Processing {file}...")
    
    try:
        with open(input_path, 'rb') as i:
            input_data = i.read()
            output_data = remove(input_data)
            
        with open(output_path, 'wb') as o:
            o.write(output_data)
            
        print(f"Successfully processed {file}")
    except Exception as e:
        print(f"Failed to process {file}: {e}")

print("Done.")
