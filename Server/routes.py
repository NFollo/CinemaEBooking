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

    @app.route('/users', methods=['GET', 'POST']) 
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
                return jsonify({"error": "Failed to fetch users", "message": str(err)}), 500
            
        if request.method == 'POST': # Handle POST requests
            '''
            returns the ObjectId of the created User document as a string upon success
            '''
            json = request.json 

            existing_user = User.objects(email=json['email']).first()
            if existing_user:
                return jsonify({"error": "Email already exists"}), 409  # 409 Conflict, check if user is already in the db
            
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
    
    @app.route('/users/<email>', methods=['GET', 'PATCH'])
    def get_user_by_email(email):
        ''' Fetch a single user by email '''
        if request.method == 'GET':  # Handle GET requests
            try:
                user = User.objects.get(email=email)  # Fetch the user by email
                user_dict = user.to_mongo().to_dict()  # Convert to JSON
                return jsonify(user_dict), 200
            except User.DoesNotExist:
                return jsonify({"error": "User not found"}), 404
            except Exception as err:
                return jsonify({"error": "Failed to fetch user", "message": str(err)}), 500
    
        elif request.method == 'PATCH':  # Handle PATCH requests
            try:
                user = User.objects.get(email=email)  # Fetch the user by email
                data = request.get_json()  # Get the JSON data from the request body

                # Update the user's fields with the provided data
                for key, value in data.items():
                    if hasattr(user, key):
                        if key == 'password':  # Encrypt the password if it's being updated
                            hashed_password = encrypt(value)  # Use the encrypt function
                            setattr(user, key, str(hashed_password))  # Store the hashed password as a string
                        else:
                            setattr(user, key, value)
                            
                user.save()

                user_dict = user.to_mongo().to_dict() 
                return jsonify(user_dict), 200

            except User.DoesNotExist:
                return jsonify({"error": "User not found"}), 404
            except Exception as err:
                return jsonify({"error": "Failed to update user", "message": str(err)}), 500    

    @app.route('/addresses/<id>', methods=['GET', 'PATCH']) # shouldn't be able to delete
    def get_address_by_id(id):
        ''' Fetch or update address by ID '''
        if request.method == 'GET':  
            try:
                address = Address.objects.get(id=id)  
                address_dict = address.to_mongo().to_dict()  
                return jsonify(address_dict), 200
            except Address.DoesNotExist:
                return jsonify({"error": "Address not found"}), 404
            except Exception as err:
                return jsonify({"error": "Failed to fetch address", "message": str(err)}), 500

        elif request.method == 'PATCH':  # Handle PATCH requests
            try:
                address = Address.objects.get(id=id)  
                data = request.get_json()  

                for key, value in data.items():
                    if hasattr(address, key):
                        setattr(address, key, value)

                address.save()  # Save the updated address

                address_dict = address.to_mongo().to_dict()  # Convert to JSON
                return jsonify(address_dict), 200

            except Address.DoesNotExist:
                return jsonify({"error": "Address not found"}), 404
            except Exception as err:
                return jsonify({"error": "Failed to update address", "message": str(err)}), 500
            
    @app.route('/paymentCards/<id>', methods=['GET', 'PATCH', 'DELETE'])
    def get_payment_cards_by_customer(id):
        ''' Fetch all payment cards related to customer by customerID '''
        if request.method == 'GET': 
            try:
                # Fetch all payment cards for the customerid
                payment_cards = PaymentCard.objects(customer=id)  # Fetch all cards for the customer
                payment_cards_list = [card.to_mongo().to_dict() for card in payment_cards] 
                return jsonify(payment_cards_list), 200
            except Exception as err:
                return jsonify({"error": "Failed to fetch payment cards", "message": str(err)}), 500

        elif request.method == 'PATCH':  # Handle PATCH requests
            '''Update the specific payment card'''
            try:
                # Fetch the payment card by ID
                payment_card = PaymentCard.objects.get(id=id)  
                data = request.get_json() 

                if 'card_number' in data:
                    payment_card.card_number = str(encrypt(data['card_number']))
                    payment_card.last_four = data['card_number'][-4:]
                if 'cvc' in data:
                    payment_card.cvc = str(encrypt(data['cvc']))
                if 'expiration_date' in data:
                    payment_card.expiration_date = data['expiration_date']
                if 'cardholder_name' in data:
                    payment_card.cardholder_name = data['cardholder_name']

                payment_card.save()  

                payment_card_dict = payment_card.to_mongo().to_dict()  # Convert to JSON
                return jsonify(payment_card_dict), 200 #

            except PaymentCard.DoesNotExist:
                return jsonify({"error": "Payment card not found"}), 404
            except Exception as err:
                return jsonify({"error": "Failed to update payment card", "message": str(err)}), 500
            
        elif request.method == 'DELETE':  # Handle DELETE requests
            '''Delete the specific payment card'''
            try:
                # Fetch the payment card by ID
                payment_card = PaymentCard.objects.get(id=id)  
                
                # delete billing address along with payment
                if payment_card.billing_address:
                    billing_address = Address.objects.get(id=payment_card.billing_address.id)
                    billing_address.delete()

                payment_card.delete()
                return jsonify({"message": "Payment card deleted successfully"}), 200

            except PaymentCard.DoesNotExist:
                return jsonify({"error": "Payment card not found"}), 404
            except Exception as err:
                return jsonify({"error": "Failed to delete payment card", "message": str(err)}), 500
    

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
    
    @app.route('/movies/<targetTitle>', methods=['GET'])
    def get_movie_by_title(targetTitle):
        '''Fetch the movie with id as title'''
        try:
            movie = Movie.objects.get(title=targetTitle)
            movie_dict = movie.to_mongo().to_dict()
            return jsonify(movie_dict), 200
        except Exception as err:
            return jsonify({"error": "Failed to fetch movie", "message": str(err)}), 500

    @app.route('/movies/homepageInfo', methods=['POST', 'GET']) 
    def moviesTitleAndPic(): 
        if request.method == 'GET':
            try:
                movies = Movie.objects()  # Fetch all movies from the database
                movies_list = [
                        {"id": str(movie.id), 
                        "title": movie.title, 
                        "trailer_picture_url": movie.trailer_picture_url, 
                        "trailer_video_url": movie.trailer_video_url,
                        "currently_running": movie.currently_running} 
                    for movie in movies]  
                return jsonify(movies_list), 200
            except Exception as err:
                return jsonify({"error": "Failed to fetch movies", "message": str(err)}), 500
        
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

                paymentCard.last_four = paymentCard.card_number[-4:]

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
    
    @app.route('/sendConfirmation', methods=['POST']) 
    def sendConfirmation():
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
        msg = Message('Sign Up Verification Code', sender=os.environ['MAIL_USERNAME'], recipients=[email])
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
        

    @app.route('/getPassword', methods=['POST'])
    def get_db_password():
        '''
        Return the stored password of the specified user.
        '''
        json = request.json
        email = json.get('email')

        if not email:
            return jsonify({"error": "Email required"}), 400

        user = User.objects(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"encrypted_password": user.password}), 200
    

    @app.route('/compareEncrypted', methods=['POST'])
    def check_encrypted_match():
        '''
        Returns true if plaintext matches ciphertext. Returns false otherwise.
        '''
        json = request.json
        plaintext = json.get('plaintext').encode('utf-8')
        ciphertext = json.get('ciphertext').encode('utf-8')

        # STRING CORRECTION NEEDED BECAUSE OF STORING STRING IN DB
        ciphertext = ciphertext[2:-1]

        if not plaintext or not ciphertext:
            return jsonify({"error": "Plaintext and ciphertext required"}), 400

        result = bcrypt.checkpw(plaintext, ciphertext)

        return jsonify({"result": result}), 200
    

    @app.route('/getPrivilege', methods=['POST'])
    def get_privilege():
        '''
        Return the privilege of the specified user.
        '''
        json = request.json
        email = json.get('email')

        if not email:
            return jsonify({"error": "Email required"}), 400

        user = User.objects(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"privilege": user.privilege}), 200
    
    @app.route('/sendProfileChangedEmail', methods=['POST'])
    def send_profile_changed_email():
        json = request.json
        email = json.get('email') 

        # Check if there is an email
        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Send verification code to the user
        msg = Message('Profile Changed!', sender=os.environ['MAIL_USERNAME'], recipients=[email])
        msg.body = 'Your profile has been changed!'
        mail.send(msg)

        return jsonify({"message": "Profile updated email has been successfully sent!"}), 200
    
    @app.route('/shows/<targetDate>', methods=['GET'])
    def get_shows_by_date(targetDate):
        ''' Fetch all shows with date as targetDate '''
        if request.method == 'GET': 
            try:
                # Fetch all shows for the targetDate
                shows = Show.objects(date=targetDate)
                shows_list = [show.to_mongo().to_dict() for show in shows] 
                return jsonify(shows_list), 200
            except Exception as err:
                return jsonify({"error": "Failed to fetch shows", "message": str(err)}), 500
            
    @app.route('/showrooms/<targetId>', methods=['GET'])
    def get_showrooms_by_id(targetId):
        ''' Fetch the showroom with id as targetId '''
        if request.method == 'GET': 
            try:
                # Fetch all shows for the targetDate
                showroom = Showroom.objects.get(id=targetId)
                showroom_dict = showroom.to_mongo().to_dict()
                return jsonify(showroom_dict), 200
            except Exception as err:
                return jsonify({"error": "Failed to fetch showroom", "message": str(err)}), 500
            
    @app.route('/showrooms/number/<targetNumber>', methods=['GET'])
    def get_showroom_by_number(targetNumber):
        ''' Fetch the showroom with number as targetNumber '''
        if request.method == 'GET': 
            try:
                # Fetch all shows for the targetDate
                showroom = Showroom.objects.get(showroom_number=targetNumber)
                showroom_dict = showroom.to_mongo().to_dict()
                return jsonify(showroom_dict), 200
            except Exception as err:
                return jsonify({"error": "Failed to fetch showroom", "message": str(err)}), 500
            
    @app.route('/shows', methods=['POST']) 
    def newShow(): 
        '''
        returns the ObjectId of the created Show document as a string upon success
        '''
        if request.method == 'POST': # Handle POST requests
            json = request.json 
            try:
                show = Show(**json)  
                show.validate()   
                show.save()
            except FieldDoesNotExist as err:
                return jsonify({"error": "Invalid field in request", "message": str(err)}), 400
            except ValidationError as err:
                return jsonify({"error": str(err)}), 400  
                
            return jsonify({"show_id": str(show.id)}), 201 # Return DB ObjectId reference

    return