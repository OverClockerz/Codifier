import firebase_admin
from firebase_admin import credentials, db

def initialize_firebase():
    cred = credentials.Certificate('path/to/your/serviceAccountKey.json') # Replace with your service account key
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://your-project-id.firebaseio.com' # Replace with your database URL
    })
