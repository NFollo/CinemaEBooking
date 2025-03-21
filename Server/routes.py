from flask import request, jsonify
from mongoengine import ValidationError, FieldDoesNotExist
from models import *
import bcrypt
import random
from datetime import datetime, timedelta
from flask_mail import Message

def encrypt(value):
    # encrypt value with bcrypt
    bytes = value.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(bytes, salt)

#Routes
def init_routes(app, mail):

    @app.route('/users', methods=['GET']) 
    def login(): 
        # if request.method == 'POST': # Handle POST requests
        #     json = request.json 
        #     try:
        #         user = User(**json)  
        #         user.validate()   
        #         user.save()   
        #     except FieldDoesNotExist as err:
        #         return jsonify({"error": "Invalid field in request", "message": str(err)}), 400
        #     except ValidationError as err:
        #         return jsonify({"error": str(err)}), 400  
            
            # return jsonify({"message": "Success added!"}), 201
        ''' Grab list of users '''
        if request.method == 'GET': # Handle GET requests
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

            existing_user = User.objects(email=json['email']).first()
            if existing_user:
                return jsonify({"error": "Email already exists"}), 409  # 409 Conflict, check if user is already in the db
            
            try:
                user = User(**json)  
                
                # encrypt password with bcrypt and store the hash as a string
                user.password = str(encrypt(str(user.password)))

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
        
    @app.route('/createPaymentCard', methods=['POST']) # TODO: Users should only be able to add up to three payment cards... - Angel
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


    # Helper method for generating a verification code
    def generateVerificationCode():
        return str(random.randint(100000, 999999))

    @app.route('/forgotPassword', methods=['POST']) 
    def forgotPassword():
        json = request.json
        email = json.get('email') 

        # check if there is an email
        if not email:
            return jsonify({"error": "Email is required"}), 400

        # check if there is already an email in the database
        user = User.objects(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
            # Generate a verification code

        verification_code = generateVerificationCode()
        expiration_time = datetime.now() + timedelta(minutes=10)  # Code expires in 10 minutes

        # save to database
        user.verification_code = verification_code
        user.code_exp = expiration_time
        user.save()

        # Send verification code to the user
        msg = Message('Password Reset Verification Code', sender=os.environ['MAIL_USERNAME'], recipients=[email])
        msg.body = f'Your verification code is: {verification_code}'
        mail.send(msg)

        return jsonify({ "message": "Verification code sent to your email"}), 200
    

    @app.route('/verifyCode', methods=['POST'])
    def verify_code():
        '''
        Verify the code entered by the user.
        '''
        json = request.json
        email = json.get('email')
        code = json.get('code')

        if not email or not code:
            return jsonify({"error": "Email and code are required"}), 400

        user = User.objects(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check if the code matches and is not expired
        if user.verification_code == code and user.code_exp > datetime.now():
            return jsonify({"message": "Code verified"}), 200
        else:
            return jsonify({"error": "Invalid or expired code"}), 400
        
    @app.route('/resetPassword', methods=['POST']) # TODO: add error checking on whether or not the password has been used before? - Angel
    def reset_password():
        '''
        Reset the user's password.
        '''
        json = request.json
        email = json.get('email')
        new_password = json.get('new_password')

        if not email or not new_password:
            return jsonify({"error": "Email and new password are required"}), 400

        user = User.objects(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Encrypt the new password
        user.password = str(encrypt(new_password))
        user.verification_code = None  # Clear the verification code
        user.code_expiration = None  # Clear the expiration time
        user.save()

        return jsonify({"message": "Password reset successfully"}), 200

    return