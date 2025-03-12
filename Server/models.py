import mongoengine as me
from mongoengine import connect, get_db
import os
from dotenv import load_dotenv


load_dotenv()
# Models for MongoDB
connect("CinemaEBooking", host=os.environ["MONGO_URI"])
class Address(me.Document):
    street = me.StringField(required=True)
    city = me.StringField(required=True)
    state = me.StringField(required=True)
    zip_code = me.StringField(required=True)
    meta = {"collection": "addresses"}

class PaymentCard(me.Document):
    card_number = me.StringField(required=True, primary_key=True)
    month = me.StringField(required=True)
    year = me.StringField(required=True)
    billing_address = me.ReferenceField(Address, required=True)
    meta = {"collection": "payment_cards"}

class Promotion(me.Document):
    promo_code = me.StringField(required=True, primary_key=True)
    discount = me.DecimalField(required=True)
    meta = {"collection": "promotions"}

class Ticket(me.Document):
    ticket_type = me.StringField(default="adult") # one of adult, senior, or child
    price = me.IntField(required=True)
    meta = {"collection": "shows"}

class Show(me.Document):
    show_id = me.IntField(primary_key=True)
    date = me.DateTimeField(required=True)
    duration = me.IntField(required=True)
    meta = {"collection": "shows"}

class Booking(me.Document):
    booking_id = me.IntField(primary_key=True)
    promotion = me.ReferenceField(Promotion)
    tickets = me.ListField(me.ReferenceField(Ticket))
    show = me.ReferenceField(Show)
    meta = {"collection": "bookings"}

class User(me.Document):
    user_id = me.IntField(primary_key=True)
    first_name = me.StringField(required=True)
    last_name = me.StringField(required=True)
    email = me.StringField(required=True)
    password = me.StringField(required=True)
    privilege = me.StringField(default="customer") # either customer or admin
    customer_status = me.IntField(default=0) # 0 = active, 1 = inactive, 2 = suspended
    payment_cards = me.ListField(me.ReferenceField(PaymentCard))
    address = me.ReferenceField(Address)
    bookings = me.ListField(me.ReferenceField(Booking))
    meta = {"collection": "users"} # explicitly set the collection name, otherwise the collection will be called user instead of users


class Review(me.EmbeddedDocument):
    reviewer = me.StringField()
    rating = me.StringField()
    body = me.StringField()
    meta = {"collection": "reviews"}

class Movie(me.Document):
    title = me.StringField(required=True)
    categories = me.ListField(me.StringField())
    cast = me.ListField(me.StringField())
    directors = me.ListField(me.StringField())
    producers = me.ListField(me.StringField())
    synopsis = me.StringField()
    reviews = me.ListField(me.ReferenceField(Review))
    trailer_picture_url = me.StringField()
    trailer_video_url = me.StringField()
    mpaa_us_film_rating_code = me.StringField()
    shows = me.ListField(me.ReferenceField(Show))
    meta = {"collection": "movies"}

class Showroom(me.Document):
    showroom_id = me.IntField(primary_key=True)
    seat_count = me.IntField(required=True)
    shows = me.ListField(me.ReferenceField(Show))
    meta = {"collection": "showrooms"}

class Theatre(me.Document):
    theatre_number = me.IntField(primary_key=True)
    showrooms = me.ReferenceField(Showroom)
    meta = {"collection": "theatres"}

class Cinema(me.Document):
    cinema_id = me.IntField(primary_key=True)
    name = me.StringField(required=True)
    theater = me.ReferenceField(Theatre)
    meta = {"collection": "cinemas"}