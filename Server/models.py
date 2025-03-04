import mongoengine as me
from mongoengine import connect, get_db
import os
from dotenv import load_dotenv


load_dotenv()
# Models for MongoDB
connect("CinemaEBooking", host=os.environ["MONGO_URI"])
class User(me.Document):
    email = me.StringField(required=True)
    password = me.StringField(required=True)
    privelage = me.StringField(default="user") # either a user or an admin
    meta = {"collection": "users"} # explicitly set the collection name, otherwise the collection will be called user instead of users

class Review(me.EmbeddedDocument):
    reviewer = me.StringField()
    rating = me.StringField()
    body = me.StringField()

class Movie(me.Document):
    title = me.StringField(required=True)
    synopsis = me.StringField()
    mpaa_us_film_rating_code = me.StringField()
    reviews = me.ListField(me.StringField()) # array of strings 
    trailer_picture_url = me.StringField()
    trailer_video_url = me.StringField()
    show_dates_and_times = me.ListField(me.DateTimeField())
    directors = me.ListField(me.StringField())
    casts = me.ListField(me.StringField())
    categories = me.ListField(me.StringField())
    producers = me.ListField(me.StringField())
    reviews = me.ListField(me.EmbeddedDocumentField(Review))
    currentlyRunning = me.BooleanField()
    meta = {"collection": "movies"}

