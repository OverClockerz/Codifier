# 8. Dataflow Diagram

This diagram illustrates the flow of data between the user, the frontend application, the backend server, and external services.

## High-Level Dataflow

```
[User] <--> [Frontend (React SPA)] <--> [Backend API (Python)] <--> [Database]
                                             ^
                                             |
                                             v
                                     [Google Gemini API]
```

## Detailed Flow Description

1.  **User Interaction:**
    *   The **User** interacts with the **Frontend** application in their web browser. Actions include logging in, selecting a quest, or navigating between zones.

2.  **Frontend to Backend (API Requests):**
    *   The **Frontend** handles UI updates and local game state.
    *   For actions that require persistent data or complex logic, the frontend sends an HTTP request (e.g., GET, POST) to the **Backend API**.
    *   Examples:
        *   `POST /login` -> User credentials sent for authentication.
        *   `GET /api/player` -> Request to fetch the player's profile and stats.
        *   `POST /api/quests/start` -> Request to begin a new quest.
        *   `POST /api/quests/complete` -> Submitting the results of a completed quest.

3.  **Backend Logic:**
    *   The **Backend API** receives requests from the frontend.
    *   It processes the requests, applying business logic (e.g., verifying answers, calculating score, updating stats).
    *   It communicates with the **Database** to create, read, update, or delete records (e.g., updating player XP, saving quest progress).

4.  **Integration with External API (Gemini):**
    *   For certain features, like generating a new coding challenge, the **Backend API** sends a request to the **Google Gemini API**.
    *   The backend formats a prompt (e.g., "Create a medium-difficulty Python coding problem about list manipulation").
    *   The **Gemini API** processes the prompt and returns the generated content (the coding problem).
    *   The **Backend** then formats this content and sends it back to the **Frontend** as part of a quest's data.

5.  **Backend to Frontend (API Responses):**
    *   After processing, the **Backend API** sends a response back to the **Frontend**. This is typically in JSON format.
    *   Examples:
        *   A success message with a user token upon login.
        *   A JSON object containing player data.
        *   The details of a newly generated quest.
    *   The **Frontend** receives the JSON data, updates its state, and re-renders the UI to reflect the new information (e.g., displaying the new quest, updating the player's XP bar).

This cycle of request and response forms the foundation of the game's interactive experience.
