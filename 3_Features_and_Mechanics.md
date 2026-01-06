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
