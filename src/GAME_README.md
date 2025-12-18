# Office - A Gamified Career Simulation

A fully functional Educational RPG that merges professional life with structured learning through a pseudo-parody office environment.

## 🎮 Game Features Implemented

### Core Mechanics
- ✅ **Four Primary Zones**
  - The Workspace: Technical training (coding, debugging)
  - The Game Lounge: Critical thinking (logic puzzles, mental exercises)
  - The Meeting Room: Soft skills (communication, presentations)
  - The Cafeteria: In-game shop for buffs and items

- ✅ **Quest System**
  - Daily Quests (3 per day)
  - Weekly Quests (2 per week)
  - Monthly Quests (1 per month)
  - Interconnected Quest Chains
  - Quest status tracking (available, in-progress, completed, failed)

- ✅ **Mood/Stress Dual-Bar System**
  - Dynamic mood management (0-100%)
  - Stress accumulation (0-100%)
  - Burnout state when mood hits 0
  - Workspace blocked during burnout
  - Zone-specific impacts on mood/stress

- ✅ **Progression System**
  - Experience Points (EXP) and leveling
  - Dynamic currency system
  - Monthly salary disbursement
  - Base salary increases with level
  - Career run tracking

- ✅ **Shop & Items**
  - Consumable items (coffee, energy drinks, stress balls)
  - Permanent buffs (meditation app, ergonomic furniture)
  - Paid leave management
  - Active buff tracking with timers

- ✅ **Career System**
  - Multiple career runs
  - Experience retention across runs
  - Restart at 50% of max achieved level after firing
  - Career history tracking
  - Monthly performance reports

### UI/UX Features
- ✅ Comprehensive player dashboard with stats
- ✅ Interactive zone selection
- ✅ Detailed quest cards with all information
- ✅ Progress bars for level, mood, and stress
- ✅ Active buffs display
- ✅ Mobile responsive design
- ✅ Smooth animations and transitions
- ✅ Quest activity modal for task completion

### Authentication & Persistence
- ✅ GitHub username-based authentication (demo)
- ✅ Local storage persistence for game state
- ✅ User profile with avatar
- ✅ Session management

### Audio
- ✅ Background music player
- ✅ Mute/unmute controls
- ✅ Volume slider (0-100%)
- ✅ Persistent audio preferences
- ✅ Autoplay support

## 📁 Project Structure

```
/
├── types/
│   └── game.ts                    # TypeScript definitions
├── data/
│   ├── gameConfig.ts              # Game configuration & formulas
│   ├── npcs.ts                    # NPC data
│   ├── shopItems.ts               # Cafeteria items
│   └── quests.ts                  # Quest templates
├── contexts/
│   ├── AuthContext.tsx            # Authentication state
│   └── GameContext.tsx            # Game state management
├── components/
│   ├── activities/
│   │   └── SimpleQuestModal.tsx   # Quest activity interface
│   ├── GamePage.tsx               # Main game interface
│   ├── GameDashboard.tsx          # Player stats display
│   ├── ZoneSelector.tsx           # Zone selection UI
│   ├── QuestList.tsx              # Quest listing
│   ├── MusicPlayer.tsx            # Background music
│   ├── LandingPage.tsx            # Marketing page
│   └── GitHubAuthModal.tsx        # Authentication modal
├── assets/
│   └── audio/                     # Music files (add your own)
└── App.tsx                        # Root component
```

## 🎯 Game Mechanics

### Experience & Leveling
- Base EXP formula: `100 * (level ^ 1.5)`
- Leveling unlocks higher salaries and advanced quests
- EXP retained across career runs

### Salary System
- Base salary: $1000 + (level - 1) * $200
- Paid monthly based on performance
- Reputation-based adjustments:
  - 90%+: +20% bonus
  - 80-89%: +10% bonus
  - 70-79%: +5% bonus
  - 60-69%: No change
  - 50-59%: -5% penalty
  - 40-49%: -10% penalty
  - <40%: -20% penalty

### Reputation Scoring
Weighted average of:
- Task Completion Rate (40%)
- Code Quality Score (35%)
- Soft Skill Score (25%)

### Burnout System
- Triggered when Mood reaches 0
- Blocks access to The Workspace
- Recoverable through:
  - Game Lounge activities (-stress, +mood)
  - Cafeteria items
  - Paid leaves (+30 mood, -40 stress)

### Quest Difficulty Levels
1. ⭐ Easy (Green)
2. ⭐⭐ Medium (Blue)
3. ⭐⭐⭐ Hard (Yellow)
4. ⭐⭐⭐⭐ Very Hard (Orange)
5. ⭐⭐⭐⭐⭐ Expert (Red)

## 🔧 Customization

### Adding New Quests
Edit `/data/quests.ts` and add to the appropriate array:
```typescript
{
  title: 'Your Quest Title',
  description: 'Quest description',
  zone: 'workspace',
  frequency: 'daily',
  skillCategory: 'technical',
  difficulty: 3,
  expReward: 100,
  currencyReward: 50,
  stressImpact: 20,
  moodImpact: -5,
  deadline: 8,
  assignedBy: 'manager-alex',
}
```

### Adding Shop Items
Edit `/data/shopItems.ts`:
```typescript
{
  id: 'item-id',
  name: 'Item Name',
  description: 'What it does',
  type: 'consumable', // or 'permanent-buff'
  effect: {
    stressReduction: 10,
    moodIncrease: 15,
  },
  price: 100,
  icon: '☕',
}
```

### Adding NPCs
Edit `/data/npcs.ts`:
```typescript
{
  id: 'npc-id',
  name: 'NPC Name',
  role: 'Job Title',
  avatar: 'avatar-url',
  zone: 'workspace',
  dialogues: [...]
}
```

## 🚀 Future Enhancements

The current implementation is a fully functional demo. To expand:

1. **Interactive Activities**
   - Real code editor for Workspace (Monaco/CodeMirror)
   - Logic puzzle generators for Game Lounge
   - Typing test implementation for Meeting Room
   - Grammar quizzes and presentation builders

2. **Advanced Systems**
   - Email inbox with NPC messages
   - Cutscene system for quest assignment
   - Real-time deadline tracking with notifications
   - Monthly report visualization

3. **Multiplayer Features**
   - Leaderboards
   - Team quests
   - Office rankings

4. **Content Expansion**
   - More quest varieties
   - Seasonal events
   - Achievement system
   - Skill tree progression

## 💾 Save System

Game state is automatically saved to `localStorage` on:
- Quest completion/failure
- Item purchase/use
- Any stat changes

Saved data includes:
- Player stats (level, XP, currency, mood, stress)
- Active and completed quests
- Inventory items
- Active buffs
- Career history
- Monthly reports

## 🎵 Audio

Background music player features:
- Autoplay on page load (browser permitting)
- Volume control (0-100%)
- Mute/unmute toggle
- Persistent preferences
- Expandable/collapsible UI

Replace demo audio by adding files to `/assets/audio/` and updating the `musicUrl` in `MusicPlayer.tsx`.

## 📱 Responsive Design

Fully responsive for:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🎨 Theming

The game uses a dark theme with gradient accents:
- Primary: Blue (#3B82F6) to Purple (#A855F7)
- Workspace: Blue to Cyan
- Game Lounge: Purple to Pink
- Meeting Room: Green to Emerald
- Cafeteria: Yellow to Orange

---

**Enjoy building your career in Office!** 🎮💼
