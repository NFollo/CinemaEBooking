from flask import request, jsonify
from mongoengine import ValidationError, FieldDoesNotExist
from models import *
import bcrypt


def encrypt(value):
    # encrypt value with bcrypt
    bytes = value.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(bytes, salt)

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
            
    @app.route('/createUser', methods=['POST']) 
    def newUser(): 
        '''
        returns the ObjectId of the created User document as a string upon success
        '''
        if request.method == 'POST': # Handle POST requests
            json = request.json 
            try:
                user = User(**json)  
                
                # encrypt password with bcrypt and store the hash as a string
                user.password = str(encrypt(user.password))

                user.validate()   
                user.save()   
            except FieldDoesNotExist as err:
                return jsonify({"error": "Invalid field in request", "message": str(err)}), 400
            except ValidationError as err:
                return jsonify({"error": str(err)}), 400  
            
            return jsonify({"user_id": str(user.id)}), 201
        
    @app.route('/createAddress', methods=['POST']) 
    def newAddress(): 
        '''
        returns the ObjectId of the created Address document as a string upon success
        '''
        if request.method == 'POST': # Handle POST requests
            json = request.json 
            try:
                address = Address(**json)  
                address.validate()   
                address.save()
            except FieldDoesNotExist as err:
                return jsonify({"error": "Invalid field in request", "message": str(err)}), 400
            except ValidationError as err:
                return jsonify({"error": str(err)}), 400  
                
            return jsonify({"address_id": str(address.id)}), 201 # Return DB ObjectId reference
        
    @app.route('/createPaymentCard', methods=['POST']) 
    def newPaymentCard(): 
        '''
        returns the ObjectId of the created PaymentCard document as a string upon success
        '''
        if request.method == 'POST': # Handle POST requests
            json = request.json 
            try:
                paymentCard = PaymentCard(**json)  

                # encrypt card number with bcrypt and store the hash as a string
                paymentCard.card_number = str(encrypt(paymentCard.card_number))

                # encrypt cvc with bcrypt and store the hash as a string
                paymentCard.cvc = str(encrypt(paymentCard.cvc))

                paymentCard.validate()   
                paymentCard.save()
            except FieldDoesNotExist as err:
                return jsonify({"error": "Invalid field in request", "message": str(err)}), 400
            except ValidationError as err:
                return jsonify({"error": str(err)}), 400  
                
            return jsonify({"payment_card_id": str(paymentCard.id)}), 201 # Return DB ObjectId reference

    return