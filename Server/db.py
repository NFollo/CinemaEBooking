from flask import current_app, g
from werkzeug.local import LocalProxy
from flask_pymongo import PyMongo

mongo = PyMongo()

def init_db(app):
    """ Initialize MongoDB with the Flask app """
    mongo.init_app(app)  

def get_db():
    """ Get the database instance """
    if 'db' not in g:
        g.db = mongo.db  
    return g.db


db = LocalProxy(get_db)