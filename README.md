# 1. Problem Statement and Sustainable Development Goals

## The Problem: The Modern Skills Gap for Young Professionals

In today's fast-evolving job market, young adults and recent graduates face a significant challenge: the gap between academic knowledge and real-world workplace demands. Many enter the professional world unprepared for the multifaceted nature of an office environment. This includes not just technical skills, but also crucial soft skills like communication, time management, problem-solving under pressure, and navigating corporate culture.

The result is often a stressful and inefficient onboarding period, high employee turnover, and a sense of disillusionment for young talents. Traditional training methods, like online courses and workshops, can be passive, non-engaging, and fail to simulate the dynamic, high-pressure situations of a real office.

**Our Office RPG, "Office-RPG," provides a solution by simulating a corporate environment where players can learn, practice, and hone essential professional skills in a safe, engaging, and gamified setting.**

## Sustainable Development Goals (SDGs)

Our solution directly contributes to the following United Nations Sustainable Development Goals:

### Primary SDG

**Goal 8: Decent Work and Economic Growth**

- **Target 8.6:** By 2030, substantially reduce the proportion of youth not in employment, education, or training.
  - **Our Contribution:** "Office-RPG" acts as an innovative training platform that equips young adults with the practical and technical skills required by modern workplaces. By bridging the skills gap, we increase their employability and prepare them for decent, productive work, thereby stimulating economic growth.

### Secondary SDGs

**Goal 4: Quality Education**

- **Target 4.4:** By 2030, substantially increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment, decent jobs, and entrepreneurship.
  - **Our Contribution:** The game focuses on upscaling skills in a variety of domains—coding, comprehension, typing, and critical thinking—through its diverse quest system. It provides a form of accessible, high-quality vocational training that is both effective and engaging.

**Goal 9: Industry, Innovation, and Infrastructure**

- **Target 9.1:** Develop quality, reliable, sustainable and resilient infrastructure, including regional and transborder infrastructure, to support economic development and human well-being, with a focus on affordable and equitable access for all.
  - **Our Contribution:** While not physical infrastructure, "Office-RPG" represents an innovative digital infrastructure for professional development. It provides an affordable and scalable solution for individuals and organizations to foster a more skilled and resilient workforce, which is the backbone of any industry.

---

# 2. Solution Overview


## Office-RPG: The Office RPG

- **Topic Name:** Office-RPG
- **Theme:** A Gamified Corporate Life Simulation
- **Project Type:** Web-Based Role-Playing Game (RPG)

## Introduction

"Office-RPG" is an immersive office RPG that simulates the life of an employee in a modern tech company. It addresses the critical gap between academic learning and real-world job readiness by providing a platform where players can develop technical, mental, and soft skills. The game is designed for young adults, students, and junior professionals who want to gain a competitive edge in the job market and upscale their existing abilities in an engaging, low-risk environment.

## The Game

In "Office RPG," players navigate a virtual office, manage their character's core stats (like Stress, Mood, Experience, and Reputation), and complete a variety of "quests" that mirror real-world tasks. From writing code and attending meetings to solving critical aptitude problems and managing deadlines, every aspect of the game is designed to be a learning experience. The environment is dynamic, with events and challenges that require players to think on their feet and make strategic decisions.

## How It Solves the Problem

"Office-RPG" solves the skills gap problem by replacing passive learning with active, experiential training.

1.  **Skill Development in Disguise:** By embedding skill-based challenges (coding, typing, comprehension, MCQs) into an engaging RPG format, players learn and improve without feeling like they are studying. The focus is on fun, progress, and achievement.
2.  **Realistic Simulation:** The game simulates the pressures and trade-offs of an actual office. Players must balance their workload, well-being (Stress/Mood), and professional growth, teaching them crucial time and resource management skills.
3.  **Safe Environment for Failure:** Players can fail quests, miss deadlines, or make mistakes without real-world consequences. This encourages experimentation, resilience, and learning from failure—a critical aspect of professional growth.
4.  **Personalized Growth:** The game tracks a player's performance across different skill areas, allowing them to identify their strengths and weaknesses. This provides a clear path for targeted self-improvement.

Ultimately, "Office-RPG" is more than just a game; it is a career training simulator for the next generation of professionals.

---

# 3. Features and Game Mechanics

"Office-RPG" is built around a rich set of features and mechanics designed to create an immersive and educational experience.

## Main Features

1.  **Dynamic Quest System:** The core of the game. Players receive quests that target different skills. These are generated dynamically using Gemini to keep the experience fresh and challenging.
2.  **Character Progression & Stats:** Players have a customizable profile and a set of core stats (e.g., Coding, Soft Skills, Problem-Solving). Completing quests and activities levels up these stats, unlocking new abilities and opportunities.
3.  **Simulated Office Environment:** The game world is divided into different zones, each with a unique purpose (Workspace, Cafeteria, Game Lounge, Meeting Room), creating a believable corporate atmosphere.
4.  **Real-Time Stat Management:** Players must manage the delicate balance between their character's `Stress` and `Mood`. Overworking or failing quests leads to high stress and low mood, which negatively impacts performance. This mechanic teaches the importance of work-life balance and strategic decision-making.

## Important Features

1.  **Character Progression:**
    *   **Core Stats:** Players have a customizable profile and a set of core professional skills (e.g., Coding, Soft Skills, Problem-Solving).
    *   **Career Metrics:** Players also manage key career metrics:
        *   `Experience (XP)`: Gained from completing quests, allows the player to level up.
        *   `Currency`: In-game money earned from salary and quest bonuses.
        *   `Salary`: A regular income that can increase with promotions.
        *   `Reputation`: Grows with success and affects interactions and opportunities.

## Important Features

1.  **Skill-Based Quests:**
    - **Coding Quests:** An integrated coding platform where players solve real programming problems.
    - **Comprehension Quests:** Players analyze different questions and give answers.
    - **Typing Quests:** Timed typing challenges to improve speed and accuracy.
    - **MCQ Quests:** Multiple-choice questions that test technical knowledge and decision-making.
2.  **AI-Powered Content:** Gemini API is used to generate quest content, ensuring a wide variety of problems and scenarios.
3.  **Notifications and Events:** The game features dynamic events like "HR Mails," "Quest Statuses," and system notifications that mimic a real workday.
4.  **Player Profile & Analytics:** A detailed profile page shows player stats, completed quests, and performance analytics, visualized with charts.

## Extra & Miscellaneous Features

- **Music Player:** An in-game music player with different tracks (Lofi, Focus Beats) to help the player concentrate.
- **Digital Clock:** A real-time clock to enhance immersion.
- **Zone Transitions & Animations:** Smooth, animated transitions between different office zones and quest initiations.
- **Welcome Mails & Alerts:** Automated alerts for game events, character status (e.g., high stress), and achievements.
- **Authentication:** Secure login and registration system, including an option for GitHub authentication.

## Game Mechanics

1.  **The Game Loop:**
    *   The player starts their "day" in their Workspace.
    *   They receive quests via a quest generation manager.
    *   They choose a quest to undertake. Successfully completing a quest rewards the player with `XP`, `Currency`, and `Reputation`.
    *   Failing a quest or taking on too many tasks increases `Stress` and lowers `Mood`.
    *   Players must strategically take breaks by visiting non-work zones like the Cafeteria or Game Lounge to lower `Stress` and improve their `Mood`, ensuring they can continue to perform effectively.

2.  **Stat Management:**
    *   **Stress:** Increases from failing quests, overworking, or negative events. High stress negatively impacts performance and can lead to burnout (a "Game Over" state).
    *   **Mood:** Affected by quest success, achievements, and relaxation activities. A positive mood can provide performance boosts and unlock unique opportunities.
    *   The central challenge is balancing the desire for rewards (`XP`, `Currency`) with the need to manage `Stress` and `Mood`.

3.  **Leveling Up:**
    *   Gaining enough `XP` allows the player to "Level Up."
    *   Leveling up can increase their `Salary`, unlock more complex and rewarding quests.

---

# 4. Game Starting Guide

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

- **Login:** Quick and simply login using github authorization. No need to remember you credentials anymore
- **Start Your Journey:** You will be welcomed to the game and can start exploring the different zones and taking on your first quests. Your initial goal is to complete introductory tasks to familiarize yourself with the game mechanics. Good luck!

---
