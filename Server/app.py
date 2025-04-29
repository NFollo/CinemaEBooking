from flask import Flask, request
import subprocess
import os
from dotenv import load_dotenv
from routes import init_routes
from db import init_db
from flask_cors import CORS
from flask_mail import Mail

# Start Flask App
app = Flask(__name__)
CORS(app)

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
    app.config['MAIL_SERVER'] = os.environ['MAIL_SERVER']
    app.config['MAIL_PORT'] = os.environ['MAIL_PORT']
    app.config['MAIL_USE_TLS'] = os.environ['MAIL_USE_TLS']
    app.config['MAIL_USERNAME'] = os.environ['MAIL_USERNAME']
    app.config['MAIL_PASSWORD'] = os.environ['MAIL_PASSWORD']
    mail = Mail(app)
    init_db(app)
    init_routes(app, mail)
    app.run(debug=True)
    