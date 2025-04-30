from flask import request, jsonify
from mongoengine import ValidationError, FieldDoesNotExist
from models import *
import bcrypt
import random
from datetime import datetime, timedelta
from flask_mail import Message
from bson import ObjectId
from collections import defaultdict

def encrypt(value):
    # encrypt value with bcrypt
    bytes = value.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(bytes, salt)

#Routes
def init_routes(app, mail):


    @app.route('/users', methods=['POST']) 
    def create_user():     
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
    

    @app.route('/users/email/<email>', methods=['GET', 'PATCH'])
    def manage_user_by_email(email):
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
                            # add address attribute if does not exist
                            if key == 'address':
                                filter_criteria = {'_id': user.id}
                                update_operation = {'$set': {'address': value}}
                                User._get_collection().update_one(filter_criteria, update_operation)
                            else:
                                setattr(user, key, value)
                            
                user.save()

                user_dict = user.to_mongo().to_dict() 
                return jsonify(user_dict), 200

            except User.DoesNotExist:
                return jsonify({"error": "User not found"}), 404
            except Exception as err:
                return jsonify({"error": "Failed to update user", "message": str(err)}), 500    

    @app.route('/users/subscribed', methods=['GET'])
    def get_subscribed_users():
        ''' Fetch all users who are subscribed to promotions '''
        try:
            # Query users who are subscribed to promotions
            subscribed_users = User.objects(receive_promotions=True)
            
            # Create a list to store the user details to send back
            users_list = []
            for user in subscribed_users:
                user_data = {
                    "email": user.email,
                    "name": user.first_name,
                    "receive_promotions": user.receive_promotions
                }
                users_list.append(user_data)

            # Return the list of subscribed users
            return jsonify(users_list), 200

        except Exception as err:
            return jsonify({"error": "Failed to fetch subscribed users", "message": str(err)}), 500
        
    @app.route('/addresses', methods=['POST']) 
    def create_new_address(): 
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

                for key, value in data.items():
                    if key == 'card_number' and value != "":
                        payment_card.card_number = str(encrypt(data['card_number']))
                        payment_card.last_four = data['card_number'][-4:]

                    elif key == 'cvc' and value != "":
                        payment_card.cvc = str(encrypt(data['cvc']))

                    elif hasattr(payment_card, key):
                        setattr(payment_card, key, value)

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

    # @app.route('/movies/homepageInfo', methods=['POST', 'GET']) 
    # def moviesTitleAndPic(): 
    #     if request.method == 'GET':
    #         try:
    #             movies = Movie.objects()  # Fetch all movies from the database
    #             movies_list = [
    #                     {"id": str(movie.id), 
    #                     "title": movie.title, 
    #                     ""
    #                     "trailer_picture_url": movie.trailer_picture_url, 
    #                     "trailer_video_url": movie.trailer_video_url,
    #                     "currently_running": movie.currently_running} 
    #                 for movie in movies]  
    #             return jsonify(movies_list), 200
    #         except Exception as err:
    #             return jsonify({"error": "Failed to fetch movies", "message": str(err)}), 500
        
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
                shows_list = []
                for show in shows:
                    show_dict = show.to_mongo().to_dict()

                    # Convert ObjectIds to strings
                    show_dict['_id'] = str(show_dict['_id'])
                    show_dict['movie'] = str(show_dict['movie']) if isinstance(show_dict.get('movie'), ObjectId) else show_dict.get('movie')
                    show_dict['showroom'] = str(show_dict['showroom']) if isinstance(show_dict.get('showroom'), ObjectId) else show_dict.get('showroom')

                    shows_list.append(show_dict)

                return jsonify(shows_list), 200
            except Exception as err:
                return jsonify({"error": "Failed to fetch shows", "message": str(err)}), 500
            
    @app.route('/shows/id/<id>', methods=['GET'])
    def get_show_by_id(id):
        ''' Fetch show with matching id '''
        if request.method == 'GET': 
            try:
                show = Show.objects.get(id=id)
                show_dict = show.to_mongo().to_dict()
                return jsonify(show_dict), 200
            except Exception as err:
                return jsonify({"error": "Failed to fetch show", "message": str(err)}), 500
            
    @app.route('/shows/<id>/book_seats', methods=['Post'])
    def book_seats(id):
        ''' Append new seats to the taken_seats array for a show '''
        if request.method == 'POST':
            try:
                new_seats = request.json.get('seats', [])
                
                show = Show.objects.get(id=id)
                
                # Append the new seats to the taken_seats array, avoiding duplicates
                show.update(add_to_set__taken_seats={"$each": new_seats})
                
                updated_show = show.to_mongo().to_dict()
                return jsonify(updated_show), 200

            except Exception as err:
                return jsonify({"error": "Failed to book seats", "message": str(err)}), 500

    @app.route('/shows/movie/<movieId>', methods=['GET'])
    def get_shows_by_movie(movieId):
        ''' Fetch all shows with date as targetDate '''
        if request.method == 'GET': 
            try:
                # Fetch all shows for the targetDate
                shows = Show.objects(movie=movieId)
                shows_list = []
                for show in shows:
                    show_dict = show.to_mongo().to_dict()

                    # Convert ObjectIds to strings
                    show_dict['_id'] = str(show_dict['_id'])
                    show_dict['movie'] = str(show_dict['movie']) if isinstance(show_dict.get('movie'), ObjectId) else show_dict.get('movie')
                    show_dict['showroom'] = str(show_dict['showroom']) if isinstance(show_dict.get('showroom'), ObjectId) else show_dict.get('showroom')

                    shows_list.append(show_dict)

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
        
    @app.route('/promotions', methods=['GET', 'POST'])
    def promotions():
        '''
        Fetches all promotions from the database, including the movie_id reference.
        '''
        if request.method == 'GET':
            try:
                promotions = Promotion.objects().select_related()
                
                promotions_list = []
                for promotion in promotions:
                        promo_data = {
                            "_id": str(promotion.id),
                            "promo_code": promotion.promo_code,
                            "discount": float(promotion.discount),
                            "expiration_date": promotion.expiration_date.isoformat(),
                            "movie_id": str(promotion.movie_id.id),
                            "movie_title": promotion.movie_id.title,
                            "email_send": promotion.email_send 
                        }
                        promotions_list.append(promo_data)
                return jsonify(promotions_list), 200
            except Exception as err:
                return jsonify({"error": "Failed to fetch promotions","message": str(err) }), 500
            
        elif request.method == 'POST':
            json = request.json 
            try:
                json["expiration_date"] = datetime.fromisoformat(json["expiration_date"].replace("Z", "+00:00"))
                promotion = Promotion(**json)
                promotion.validate()
                promotion.save()
                return jsonify({"message": "Promotion created successfully", "promotion_id": str(promotion.id)}), 201
            except Exception as err:
                return jsonify({"error": "Failed to add promotion", "message": str(err)}), 500
    @app.route('/promotions/<promotion_id>', methods=['PUT', 'DELETE'])
    def promotion(promotion_id):
        '''
        Updates an existing promotion based on the provided promotion ID.
        '''
        if request.method == 'PUT':
            try:
                promotion = Promotion.objects(id=promotion_id).first()
                
                if not promotion:
                    return jsonify({"error": "Promotion not found"}), 404
                
                json = request.json
                
                if "expiration_date" in json:
                    json["expiration_date"] = datetime.fromisoformat(json["expiration_date"].replace("Z", "+00:00"))
                
                if "movie_id" in json:
                    movie_id = json["movie_id"]
                    # Check if the movie_id is a valid ObjectId string
                    if not ObjectId.is_valid(movie_id):
                        return jsonify({"error": "Invalid movie_id"}), 400
                    json["movie_id"] = ObjectId(movie_id)
                
                # Update the promotion with the new data
                for key, value in json.items():
                    if hasattr(promotion, key):
                        setattr(promotion, key, value)
                
                # Validate and save the updated npromotion
                promotion.validate()
                promotion.save()
                
                return jsonify({"message": "Promotion updated successfully", "promotion_id": str(promotion.id)}), 200
            except Exception as err:
                return jsonify({"error": "Failed to update promotion", "message": str(err)}), 500
        if request.method == 'DELETE':
            '''Delete the specific promotion'''
            try:
                # Fetch the promotion by ID
                promotion = Promotion.objects.get(id=promotion_id)  
             
                promotion.delete()

                return jsonify({"message": "Promotion deleted successfully"}), 200

            except Promotion.DoesNotExist:
                return jsonify({"error": "Promotion not found"}), 404
            except Exception as err:
                return jsonify({"error": "Failed to delete promotion", "message": str(err)}), 500
            
    @app.route('/promotions/send', methods=['POST'])
    def sendPromotion():
        if request.method == 'POST':
            json = request.json
            promo_id = json.get('promotion').get('_id')

            try:
                promotion = Promotion.objects.get(id=promo_id)
            except Promotion.DoesNotExist:
                return jsonify({"error": "Promotion not found"}), 404
            
            subscribers = User.objects(receive_promotions=True)
            
            email_list = [user.email for user in subscribers]

            movie = promotion.movie_id  

            expiration_date = promotion.expiration_date.strftime('%Y-%m-%d %H:%M:%S')
            if not movie:
                return jsonify({"error": "Movie not found"}), 404

            # Prepare email content
            subject = f"Exclusive Promotion: {promotion.promo_code}"
            body = f"Dear User,\n\nWe are excited to announce our latest promotion: {promotion.promo_code}\n\n" \
                f"For the movie {movie.title}!!!\n\n" \
                f"Promotion expires: {expiration_date}"

            try:
                # Send email to all subscribers
                msg = Message(subject, sender=os.environ['MAIL_USERNAME'], recipients=email_list)
                msg.body = body
                mail.send(msg)
                promotion.update(set__email_send=True)
                return jsonify({"message": f"Promotion sent to {len(email_list)} users."}), 200
            except Exception as e:
                return jsonify({"error": f"Failed to send emails: {str(e)}"}), 500
            
    @app.route('/OrderConfirmation/send', methods=['POST']) # need booking id
    def sendOrderConfirmation():
        try:
            data = request.json
            booking_id = data.get("booking_id")

            if not booking_id:
                return jsonify({"error": "Missing booking_id"}), 400

            # Fetch booking
            booking = Booking.objects.get(id=ObjectId(booking_id))
            user = booking.customer
            show = booking.show
            movie = show.movie if show else None
            tickets = booking.tickets
            seats = booking.seats
            promotion = booking.promotion

            # Compose order summary
            ticket_counts = defaultdict(int)
            ticket_prices = {}

            for ticket in tickets:
                ticket_counts[ticket.ticket_type] += 1
                ticket_prices[ticket.ticket_type] = ticket.price  # assumes price is consistent per type

            # Compose ticket summary
            ticket_lines = ""
            for ticket_type, count in ticket_counts.items():
                line = f"{count} x {ticket_type.capitalize()} ticket"
                if count > 1:
                    line += f"s"
                line += f" @ ${ticket_prices[ticket_type]} each\n"
                ticket_lines += line

            promo_text = f"\nPromotion Code Applied: {promotion.promo_code} | Discount: {promotion.discount}%\n" if promotion else ""

            body = f"""\
                Hello {user.first_name},

                Thank you for your booking!

                Here is your order summary:

                Movie: {movie.title if movie else 'N/A'}
                Date: {show.date}
                Time: {show.time}
                Seats: {seats}

                Tickets:
                {ticket_lines}
                {promo_text}

                Total Price: ${booking.price}

                Purchase Date: {booking.date.strftime('%Y-%m-%d %H:%M:%S')}

                Enjoy your movie!
                """

            subject = "Your Movie Booking Confirmation"
            msg = Message(subject, sender=os.environ['MAIL_USERNAME'], recipients=[user.email])
            msg.body = body
            mail.send(msg)
            return jsonify({"message": "Order confirmation email sent!"}), 200

        except Exception as err:
            return jsonify({"error": "Failed to send confirmation email", "message": str(err)}), 500
        
    @app.route('/bookings/<userId>', methods=['GET']) 
    def get_bookings(userId):     
        ''' Fetch all bookings of user with specified userId '''
        try:
            user_id = ObjectId(userId)

            # Fetch bookings where customer == userId
            bookings = Booking.objects(customer=user_id)

            bookings_list = []
            for booking in bookings:
                # Extract ticket info from embedded documents
                booking_data = {
                    "id": str(booking.id),
                    "seats": booking.seats,
                    "movie_name": booking.show.movie.title if booking.show and booking.show.movie else "N/A",
                    #"date": booking.show.date.strftime("%Y-%m-%d") if booking.show and booking.show.date else "N/A",
                    #"time": booking.show.time.strftime("%H:%M") if booking.show and booking.show.time else "N/A",
                    "date": booking.show.date,
                    "time": booking.show.time,
                    "price": booking.price,
                }
                bookings_list.append(booking_data)

            return jsonify(bookings_list), 200

        except Exception as err:
            return jsonify({"error": "Failed to fetch bookings", "message": str(err)}), 500
    
    @app.route('/bookings', methods=['POST'])
    def create_booking():
        try:
            data = request.json

            customer_id = data.get("customer_id")
            show_id = data.get("show_id")
            promo_id = data.get("promotion_id", None)
            ticket_info = data.get("tickets")
            seat_list = data.get("seats")
            total_price = data.get("price")

            if not customer_id or not show_id or not ticket_info or not seat_list:
                return jsonify({"error": "Missing required fields"}), 400

            # Validate quantities match
            total_tickets = sum(ticket.get("quantity", 0) for ticket in ticket_info)
            if total_tickets != len(seat_list):
                return jsonify({"error": "Number of tickets does not match number of seats"}), 400

            # Fetch references
            customer = User.objects.get(id=ObjectId(customer_id))
            show = Show.objects.get(id=ObjectId(show_id))
            promotion = Promotion.objects.get(id=ObjectId(promo_id)) if promo_id else None

            # Create flattened Ticket objects
            ticket_objects = []
            seat_index = 0
            for ticket in ticket_info:
                for _ in range(ticket["quantity"]):
                    ticket_objects.append(Ticket(
                        ticket_type=ticket["ticket_type"],
                        price=ticket["price"]
                    ))
                    seat_index += 1


            # Create and save booking
            booking = Booking(
                date=datetime.utcnow(),
                customer=customer,
                promotion=promotion,
                show=show,
                price=total_price,
                tickets=ticket_objects,
                seats=seat_list
            )

            booking.save()

            return jsonify({
                "message": "Booking successfully created",
                "booking_id": str(booking.id),
                "total_price": total_price,
                "seats": seat_list,
                "ticket_count": total_tickets
            }), 201

        except Exception as e:
            return jsonify({"error": f"Failed to create booking: {str(e)}"}), 500
    
    return


    