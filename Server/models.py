import mongoengine as me
from mongoengine import connect, get_db
import os
from dotenv import load_dotenv


load_dotenv()
# Models for MongoDB
connect("CinemaEBooking", host=os.environ["MONGO_URI"])
class Cinema(me.Document):
    name = me.StringField(required=True)
    meta = {"collection": "cinemas"}

class Theatre(me.Document):
    cinema = me.ReferenceField(Cinema, required=True)
    theatre_number = me.IntField(required=True)
    meta = {"collection": "theatres"}

class Showroom(me.Document):
    showroom_number = me.IntField(required=True)
    seat_count = me.IntField(required=True)
    theatre = me.ReferenceField(Theatre, required=True)
    meta = {"collection": "showrooms"}

class Movie(me.Document):
    title = me.StringField(required=True)
    synopsis = me.StringField(required=True)
    mpaa_us_film_rating_code = me.StringField(required=True)
    trailer_picture_url = me.StringField(required=True)
    trailer_video_url = me.StringField(required=True)
    categories = me.ListField(me.StringField(), required=True)
    cast = me.ListField(me.StringField(), required=True)
    directors = me.ListField(me.StringField(), required=True)
    producers = me.ListField(me.StringField(), required=True)
    currently_running = me.BooleanField(required=True)
    meta = {"collection": "movies"}

class Review(me.Document):
    reviewer = me.StringField(required=True)
    rating = me.StringField(required=True)
    body = me.StringField(required=True)
    movie = me.ReferenceField(Movie, required=True)
    meta = {"collection": "reviews"}

class Show(me.Document):
    movie = me.ReferenceField(Movie, required=True)
    showroom = me.ReferenceField(Showroom, required=True)
    date = me.StringField(required=True) # format "YYYY-MM-DD"
    time = me.IntField(required=True)
    duration = me.IntField(required=True)
    meta = {"collection": "shows"}

class Address(me.Document):
    type = me.StringField(required=True) # either 'home' or 'billing'
    street = me.StringField(required=True)
    city = me.StringField(required=True)
    state = me.StringField(required=True)
    country = me.StringField(required=True)
    zip_code = me.StringField(required=True)
    meta = {"collection": "addresses"}

class User(me.Document):
    #user_id = me.StringField(default="") # assigned upon verification, not upon creation, hence not required
    first_name = me.StringField(required=True)
    last_name = me.StringField(required=True)
    email = me.StringField(required=True)
    password = me.StringField(required=True) # stored as a bcrypt hash string
    phone_number = me.StringField(required=True) # format '###-###-####'
    privilege = me.StringField(default="customer", required=True) # either customer or admin
    customer_status = me.IntField(default=0, required=True) # 0 = active, 1 = inactive, 2 = suspended
    address = me.ReferenceField(Address)
    verification_code = me.StringField() # verifcation code, xxxxxx
    code_exp = me.DateTimeField() # time the code expires
    receive_promotions = me.BooleanField(required=True)
    verified_user = me.BooleanField(default=False)
    meta = {"collection": "users"} # explicitly set the collection name, otherwise the collection will be called user instead of users

class PaymentCard(me.Document):
    card_type = me.StringField(required=True)
    card_number = me.StringField(required=True)
    last_four = me.StringField(required=True)
    name_on_card = me.StringField(required=True)
    month = me.StringField(required=True)
    year = me.StringField(required=True)
    cvc = me.StringField(required=True)
    billing_address = me.ReferenceField(Address, required=True)
    customer = me.ReferenceField(User, required=True)
    meta = {"collection": "payment_cards"}

class Promotion(me.Document):
    promo_code = me.StringField(required=True)
    discount = me.DecimalField(required=True)
    meta = {"collection": "promotions"}

class Booking(me.Document):
    customer = me.ReferenceField(User, required=True)
    promotion = me.ReferenceField(Promotion)
    show = me.ReferenceField(Show, required=True)
    meta = {"collection": "bookings"}

class Ticket(me.Document):
    ticket_type = me.StringField(default="adult", required=True) # one of adult, senior, or child
    price = me.IntField(required=True)
    booking = me.ReferenceField(Booking, required=True)
    meta = {"collection": "shows"}