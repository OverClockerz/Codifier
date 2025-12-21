import firebase_admin
from firebase_admin import credentials, firestore

def initialize_firebase():
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred, {
        'projectId': 'office-conquest',
    })

def save_user(user_data):
    db = firestore.client()
    users_ref = db.collection('users')
    users_ref.document(user_data['login']).set(user_data)