from flask import request, jsonify
from mongoengine import ValidationError, FieldDoesNotExist
from models import *

#Routes
def init_routes(app):

    @app.route('/login', methods=['POST', 'GET']) 
    def login(): 
        if request.method == 'POST': # Handle POST requests
            json = request.json 
            try:
                user = User(**json)  
                user.validate()   
                user.save()   
            except FieldDoesNotExist as err:
                return jsonify({"error": "Invalid field in request", "message": str(err)}), 400
            except ValidationError as err:
                return jsonify({"error": str(err)}), 400  
            
            return jsonify({"message": "Success added!"}), 201
        elif request.method == 'GET': # Handle GET requests
            return
        

    @app.route('/movies', methods=['POST', 'GET']) 
    def movies(): 
        json = request.json
        try:
            movies = Movie(**json)  
            movies.validate() 
            movies.save()     
        except FieldDoesNotExist as err:
            return jsonify({"error": "Invalid field in request", "message": str(err)}), 400
        except ValidationError as err:
            return jsonify({"error": str(err)}), 400  
        
        return jsonify({"message": "Success added!"}), 201

    return