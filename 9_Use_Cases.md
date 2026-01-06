# 9. Use Cases and Process Flow

This document outlines the primary use cases for "Office-RPG" and the interactions between the main actors: the **Player** and the **Game Admin**.

## Use Case Diagram

This diagram shows the key interactions each actor can have with the system.

```
+-------------------------------------------------+
| System: Office-RPG - The Office RPG               |
|                                                 |
|  Actors:                                        |
|    - Player                                     |
|    - Game Admin                                 |
|                                                 |
|  Use Cases for Player:                          |
|    - Register for Account                       |
|    - Login / Logout                             |
|    - View Dashboard (Stats, Profile)            |
|    - Navigate Office Zones                      |
|    - Accept / Start Quest                       |
|    - Complete Skill Quest (Coding, Typing, etc.)|
|    - Manage Character (Rest, Recover)           |
|    - View Leaderboards (Future Feature)         |
|                                                 |
|  Use Cases for Game Admin:                      |
|    - Manage Player Accounts                     |
|    - View System-wide Analytics                 |
|    - Configure Game Parameters (e.g., Quest    |
|      difficulty, XP rewards)                    |
|    - Broadcast Announcements / Events           |
|                                                 |
+-------------------------------------------------+

Diagram:

       +-------------------+
       |      Player       |
       +-------------------+
              |
              |
  +-----------+-----------+
  |                       |
(Register)            (Login)
  |                       |
  +-----------+-----------+
              |
      (View Dashboard)
              |
      (Navigate Zones)
              |
  +-----------+-----------+
  |                       |
(Accept Quest)     (Manage Character)
  |
(Complete Skill Quest)


       +-------------------+
       |    Game Admin     |
       +-------------------+
              |
              |
      (Manage Players)
              |
      (View Analytics)
              |
   (Configure Game Params)
```

## Process Flow: A Player's Typical Game Session

This flow describes the step-by-step process a player goes through during a typical session.

1.  **Start:** The Player navigates to the game's web address.
2.  **Authentication:**
    *   If a new player, they select "Register" and submit their details. The system creates a new player account.
    *   The Player logs in with their credentials. The system authenticates them and loads their game data.
3.  **Dashboard:**
    *   The Player lands on their main dashboard. They can see their character's stats (e.g., `Stress`, `Mood`, `XP`, `Reputation`), current level, and available quests.
4.  **Quest Selection:**
    *   The Player reviews the list of available quests, noting the skill type (e.g., Coding, Comprehension) and rewards.
    *   They accept a quest.
5.  **Gameplay:**
    *   The game transitions to the quest interface (e.g., a coding editor, a document viewer).
    *   The Player attempts to complete the quest objective within the given constraints (e.g., time limit, passing test cases). Undertaking the quest might increase `Stress`.
6.  **Quest Completion:**
    *   **Success:** If the objective is met, the Player is rewarded with `XP`, `Currency`, and `Reputation`. Their stats are updated, and they receive a significant `Mood` boost.
    *   **Failure:** If the objective is not met, the Player receives no rewards and their `Stress` level increases, while their `Mood` may drop.
7.  **Stat Management:**
    *   After the quest, the Player's `Mood` and `Stress` levels have changed.
    *   If `Stress` is high or `Mood` is low, the Player may decide to navigate to a non-work zone.
    *   For example, they go to the **Cafeteria** or the **Game Lounge** to engage in activities that lower `Stress` and improve `Mood`.
8.  **Repeat or End Session:**
    *   The Player can choose to take on another quest, repeating the cycle of work and rest.
    *   Alternatively, the Player can log out, saving their progress for the next session.
