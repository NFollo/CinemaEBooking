from flask import request, jsonify
from mongoengine import ValidationError, FieldDoesNotExist
from models import *

#Routes
def init_routes(app):

    @app.route('/users', methods=['POST', 'GET']) 
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
            try:
                users = User.objects()  # Fetch all movies from the database
                users_list = [user.to_mongo().to_dict() for user in users]  # Convert to JSON
                return jsonify(users_list), 200
            except Exception as err:
                    return jsonify({"error": "Failed to fetch movies", "message": str(err)}), 500
        

    @app.route('/movies', methods=['POST', 'GET']) 
    def movies(): 
        if request.method == 'POST':
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
        elif request.method == 'GET':
            try:
                movies = Movie.objects()  # Fetch all movies from the database
                movies_list = [{**movie.to_mongo().to_dict(), "_id": str(movie.id)} for movie in movies] 
                return jsonify(movies_list), 200
            except Exception as err:
                return jsonify({"error": "Failed to fetch movies", "message": str(err)}), 500
            
    @app.route('/movies/homepageInfo', methods=['POST', 'GET']) 
    def moviesTitleAndPic(): 
        if request.method == 'GET':
            try:
                movies = Movie.objects()  # Fetch all movies from the database
                movies_list = [
                        {"id": str(movie.id), 
                        "title": movie.title, 
                        "trailer_picture_url": movie.trailer_picture_url, 
                        "currently_running": movie.currently_running} 
                    for movie in movies]  
                return jsonify(movies_list), 200
            except Exception as err:
                return jsonify({"error": "Failed to fetch movies", "message": str(err)}), 500
            
    @app.route('/signUp', methods=['POST']) 
    def signUp(): 
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
    return