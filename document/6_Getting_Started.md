# 6. Game Starting Guide

This guide provides instructions on how to set up and run the "Office-RPG" project locally for development or testing purposes.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (LTS version recommended) and **npm**
- **Python** (version 3.8 or higher) and **pip**
- **Git** for version control

## Installation and Setup

1.  **Clone the Repository:**
    Open your terminal and clone the project repository from GitHub.

    ```bash
    git clone <your-repository-url>
    cd Office-RPG
    ```

2.  **Setup the Backend:**

    - Navigate to the backend directory.

    ```bash
    cd backend
    ```

    - Create a virtual environment. This isolates the project's dependencies.

    ```bash
    python -m venv venv
    ```

    - Activate the virtual environment.
      - On Windows: `venv\Scripts\activate`
      - On macOS/Linux: `source venv/bin/activate`
    - Install the required Python packages.

    ```bash
    pip install -r requirements.txt
    ```

    - **(Optional)** You may need to create a `.env` file in the `backend` directory to store environment variables like API keys for the Gemini API.

3.  **Setup the Frontend:**
    - In a new terminal, navigate to the frontend directory.
    ```bash
    cd frontend
    ```
    - Install the required npm packages.
    ```bash
    npm install
    ```

## Running the Application

1.  **Start the Backend Server:**

    - In the terminal with the backend virtual environment activated, run the main application file.

    ```bash
    python main.py
    ```

    - The backend server will typically start on a local port (e.g., `http://127.0.0.1:5000`). Keep this terminal running.

2.  **Start the Frontend Development Server:**
    - In the terminal for the frontend, run the Vite development server.
    ```bash
    npm run dev
    ```
    - Vite will start the frontend application, usually on `http://localhost:5173`, and open it in your default web browser.

## How to Play

1.  **Register:** Once the application is running, the first step is to create a new player account through the registration page.
2.  **Login:** Use your credentials to log in.
3.  **Start Your Journey:** You will be welcomed to the game and can start exploring the different zones and taking on your first quests. Your initial goal is to complete introductory tasks to familiarize yourself with the game mechanics. Good luck!
