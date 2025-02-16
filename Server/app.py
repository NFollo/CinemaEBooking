from flask import Flask, request
import subprocess
import os
from dotenv import load_dotenv
from routes import init_routes
from db import init_db

# Start Flask App
app = Flask(__name__)
load_dotenv()

# Run pipreqs to generate requirements.txt

def generate_requirements():
    try:
        subprocess.run(["pipreqs", "..\\", "--force"], check=True)
        print("requirements.txt generated successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
    except FileNotFoundError:
        print("Error: pipreqs is not installed. Install it using 'pip install pipreqs'.")



if __name__ == '__main__':
    generate_requirements()
    app.config['MONGO_URI'] = os.environ['MONGO_URI']
    init_db(app)
    init_routes(app)
    app.run(debug=True)
   
    

