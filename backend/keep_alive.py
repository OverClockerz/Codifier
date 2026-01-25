from dotenv import load_dotenv
import threading
import requests
import time
import os

load_dotenv()

KEEP_ALIVE_INTERVAL = 30  # seconds

def keep_alive():
    url = os.getenv("KEEP_ALIVE_URL","http://localhost:5000/health")
    if not url:
        return  # silently skip

    while True:
        try:
            requests.get(url, timeout=5)
            print("🔄 Keep-alive ping sent")
        except Exception as e:
            print("⚠️ Keep-alive failed:", e)
        time.sleep(KEEP_ALIVE_INTERVAL)

def start_keep_alive():
    thread = threading.Thread(target=keep_alive, daemon=True)
    thread.start()
