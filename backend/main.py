from dotenv import load_dotenv
from app import create_app

load_dotenv()

app=create_app()

# ─── LOCAL DEV ONLY ───────────────────────────────────
if __name__ == "__main__":
    print("🚀 Server running (dev)")
    app.run(port=5000, debug=True)