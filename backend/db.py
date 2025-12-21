import firebase_admin
from firebase_admin import credentials, db
import os

def initialize_firebase():
    """
    Initializes the Firebase Admin SDK for the Realtime Database, 
    checking to prevent re-initialization.
    """
    if not firebase_admin._apps:
        try:
            cred = credentials.Certificate('serviceAccountKey.json')
            # The databaseURL is crucial for the Realtime Database.
            firebase_admin.initialize_app(cred, {
                'databaseURL': 'https://codifiergit-00515167-c4af4-default-rtdb.asia-southeast1.firebasedatabase.app/'
            })
            print("Firebase SDK initialized successfully.")
        except FileNotFoundError:
            print("ERROR: 'serviceAccountKey.json' not found. Please ensure the service account key is in the backend directory.")
        except Exception as e:
            print(f"An unexpected error occurred during Firebase initialization: {e}")

def save_user(user_data: dict):
    """
    Saves a user's data to the Firebase Realtime Database.

    Args:
        user_data (dict): A dictionary containing the user's information.
                          It must contain a 'login' key to be used as the user's unique ID.
    """
    if not firebase_admin._apps:
        print("ERROR: Firebase is not initialized. Cannot save user.")
        return

    user_id = user_data.get('login')
    if not user_id:
        print("ERROR: 'login' key is required in user_data to save the user.")
        return

    try:
        ref = db.reference(f'users/{user_id}')
        ref.set(user_data)
        print(f"Successfully saved user '{user_id}' to the database.")
    except Exception as e:
        print(f"An error occurred while saving user data: {e}")
