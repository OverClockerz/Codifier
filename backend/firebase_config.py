import firebase_admin
from firebase_admin import credentials, db

def initialize_firebase():
    cred = credentials.Certificate('serviceAccountKey.json') 
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://social-flow-423402-default-rtdb.firebaseio.com/' 
    })