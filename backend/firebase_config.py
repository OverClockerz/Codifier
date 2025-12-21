import firebase_admin
from firebase_admin import credentials, db

def initialize_firebase():
    cred = credentials.Certificate('serviceAccountKey.json') 
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://codifiergit-00515167-c4af4-default-rtdb.asia-southeast1.firebasedatabase.app/' 
    })