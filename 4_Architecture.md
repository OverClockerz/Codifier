# 4. Project Architecture and Folder Structure

The "Office-RPG" project is built on a modern web architecture, separating the frontend and backend concerns for scalability and maintainability.

## High-Level Architecture

The application follows a classic **client-server model**:

- **Frontend (Client):** A single-page application (SPA) built with React and TypeScript. It is responsible for rendering the user interface, managing game state locally, and communicating with the backend via a RESTful API.
- **Backend (Server):** A Python-based server responsible for user authentication, data persistence, and serving the frontend application. It also integrates with external APIs like Gemini for dynamic content generation.

## Folder Structure

### `backend/`

This directory contains the Python server application.

- `main.py`: The entry point of the backend application, responsible for initializing the server (likely Flask or FastAPI) and configuring routes.
- `requirements.txt`: Lists all the Python dependencies for the backend.
- `routes/`: Contains the definitions for all API endpoints.
  - `ai_*.py`: Handles requests related to AI-powered quest generation.
  - `api_*.py`: Provides the core REST API for player data, quests, etc.
  - `auth.py`, `login.py`, `register.py`: Manage user authentication and session logic.
- `utils/`: A collection of helper modules.
  - `geminiapi.py`: A dedicated module to interact with the Google Gemini API.
  - `player_templates.py`: Likely contains default data or structures for new players.
- `templates/`: HTML templates, suggesting some server-side rendering for initial page loads or specific routes (e.g., login, dashboard).

### `frontend/`

This directory contains the React client-side application.

- `index.html`: The main HTML file that serves as the entry point for the React app.
- `package.json`: Defines the project's JavaScript dependencies and scripts.
- `vite.config.ts`: Configuration for the Vite build tool, used for development and bundling.
- `src/`: The main source code for the frontend.
  - `main.tsx`: The entry point of the React application, where the root component is rendered.
  - `App.tsx`: The root component of the application, which likely handles routing.
  - `components/`: Contains all the reusable React components, organized by feature (e.g., `quests/`, `player/`, `ui/`). The `ui/` subdirectory suggests the use of a component library like shadcn/ui.
  - `contexts/`: Holds React Context providers for managing global state, such as `AuthContext` and `GameContext`.
  - `pages/`: Components that represent entire pages or views within the application (e.g., `QuestPage.tsx`).
  - `services/`: Modules for handling external communication.
    - `api.ts`: A centralized module for making HTTP requests to the backend API.
    - `geminiService.ts`: A service specifically for interacting with any client-side Gemini API needs.
  - `hooks/`: Custom React hooks to encapsulate and reuse stateful logic.
  - `types/`: TypeScript type definitions for game objects and data structures.
  - `zones/`: Components representing the different interactive areas of the game world (e.g., `Workspace.tsx`, `Cafeteria.tsx`).
  - `public/`: Contains static assets like images, videos, and music that are publicly accessible.
