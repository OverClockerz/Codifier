import firebase_admin
from firebase_admin import credentials, db
import os

def initialize_firebase():
    """
    Initializes the Firebase Admin SDK, checking to prevent re-initialization.
    """
    if not firebase_admin._apps:
        # Check if we are running in a environment with default credentials
        # (like Google Cloud Shell or some CI/CD)
        database_url = os.getenv('FIREBASE_DATABASE_URL', 'https://codifiergit-00515167-c4af4-default-rtdb.asia-southeast1.firebasedatabase.app/')
        key_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_KEY', 'serviceAccountKey.json')

        if os.path.exists(key_path):
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred, {
                'databaseURL': database_url
            })
        else:
            # Fallback for environments where serviceAccountKey.json might not be present
            # but other auth methods (like default ADC) might be available, 
            # though usually for local dev you want the key.
            # If we MUST have a key, we keep the previous logic.
            print(f"WARNING: {key_path} not found. Firebase might not initialize correctly.")
            firebase_admin.initialize_app(options={
                'databaseURL': database_url
            })

def save_user(user_data: dict):
    """
    Saves a user's data to the Firebase Realtime Database.
    The user_data is passed as a dictionary, which is saved as a JSON object.

    Args:
        user_data (dict): A dictionary containing the user's information. 
                          It must contain a 'login' key to be used as the user's unique ID.
    """
    if not isinstance(user_data, dict):
        raise TypeError('User data must be a dictionary.')

    user_id = user_data.get('login')
    if not user_id:
        raise ValueError("The 'login' key is required in user_data to identify the user.")

    try:
        # Get a reference to the path where the user should be saved
        user_ref = db.reference(f'users/{user_id}')
        # Set the data at that path. This will overwrite existing data at this path.
        user_ref.set(user_data)
        print(f"Successfully saved user '{user_id}' to the database.")
    except Exception as e:
        print(f"An error occurred while saving user data: {e}")
        raise
