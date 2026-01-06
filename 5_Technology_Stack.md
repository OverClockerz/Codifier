# 5. Technology Stack and Tools

"Office-RPG" is built with a modern and robust technology stack, chosen for its performance, scalability, and strong developer ecosystems.

## Frontend

- **Framework:** **React** (with TypeScript) - A powerful JavaScript library for building dynamic and responsive user interfaces.
- **Build Tool:** **Vite** - A next-generation frontend build tool that provides an extremely fast development server and optimized build process.
- **Styling:**
  - **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
  - **shadcn/ui:** A collection of beautifully designed, accessible, and reusable components built on top of Radix UI and Tailwind CSS.
  - **CSS/Globals:** Standard CSS for base styling and global theme definitions.
- **State Management:** **React Context API** - Used for managing global game state like authentication status and player data (`AuthContext`, `GameContext`).
- **Animation:** **Framer Motion** - A popular library for creating fluid animations and transitions in React. (Inferred from component names like `PinnedImageReveal`).

## Backend

- **Language:** **Python** - A versatile and widely-used language with a rich ecosystem of libraries for web development and AI.
- **Framework:** **Flask / FastAPI** (inferred) - A lightweight and flexible web framework for building the REST API.
- **AI & Machine Learning:**
  - **Google Gemini API:** Integrated for dynamically generating in-game content, such as coding problems, comprehension texts, and other quest-related materials.

## Development & Deployment

- **Version Control:** **Git & GitHub** - Used for source code management, collaboration, and version control.
- **Package Managers:**
  - **npm:** For managing JavaScript dependencies on the frontend.
  - **pip:** For managing Python dependencies on the backend.
- **Runtime Environment:** **Node.js** - For the frontend development server and build process.

This technology stack allows for a clean separation of concerns, enabling parallel development on the feature-rich frontend and the powerful backend logic.
