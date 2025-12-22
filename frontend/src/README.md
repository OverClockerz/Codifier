# Office - Gamified Career Simulation RPG

A gamified career simulation that merges professional life with structured learning through a pseudo-parody office environment.

**Frontend Version**: v2.0 - Backend-Ready Release

---

## 📚 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| 👉 **[GETTING_STARTED.md](/GETTING_STARTED.md)** | **Start here!** Complete introduction for new developers |
| 🔧 [README_BACKEND_SETUP.md](/README_BACKEND_SETUP.md) | Quick backend integration guide (5 min) |
| 📖 [BACKEND_INTEGRATION.md](/BACKEND_INTEGRATION.md) | Complete backend integration reference |
| 📁 [PROJECT_STRUCTURE.md](/PROJECT_STRUCTURE.md) | Full project structure documentation |
| 📝 [CHANGELOG.md](/CHANGELOG.md) | Version history and changes |

---

## 🎮 Game Overview

Office features four primary zones where players complete dynamic quests while managing a Mood/Stress dual-bar system:

- **Workspace** - Technical training through coding challenges
- **Game Lounge** - Critical thinking with puzzles and logic games  
- **Meeting Room** - Soft skills development through team activities
- **Cafeteria** - In-game shop for buffs and consumables

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Myst-Blazeio/Gamified-Career-Simulation-App.git
cd Gamified-Career-Simulation-App

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

## 📁 Project Structure

```
office/
├── zones/              # ⭐ Game zones (Workspace, GameLounge, MeetingRoom, Cafeteria)
├── components/         # ⭐ UI components (QuestCard, GameDashboard, etc.)
├── contexts/           # ⭐ State management (GameContext, AuthContext)
├── data/              # ⭐ Game data (quests.ts, shopItems.ts, gameConfig.ts)
├── services/          # ⭐ Backend integration layer (api.ts - ready for backend)
├── types/             # TypeScript type definitions
└── styles/            # Global CSS and Tailwind config
```

📖 **See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed navigation guide**

## ✨ Key Features

### Core Mechanics
- ✅ **Four Game Zones** with unique quest types
- ✅ **Dynamic Quest System** (daily, weekly, monthly)
- ✅ **Mood/Stress Management** with burnout mechanic
- ✅ **Experience & Leveling** with salary progression
- ✅ **Shop System** with buffs and consumables
- ✅ **Career System** with multiple runs

### UI/UX
- ✅ Unified quest card design across all zones
- ✅ Smooth GSAP animations and transitions
- ✅ Profile system with radar charts
- ✅ Notifications system
- ✅ Background music player
- ✅ Mobile responsive design

## 🎯 Adding New Quests

### Quick Add
Open `data/quests.ts` and add to the appropriate array:

```typescript
{
  title: 'New Feature Implementation',
  description: 'Build a new feature from scratch',
  zone: 'workspace',              // workspace | game-lounge | meeting-room
  frequency: 'daily',             // daily | weekly | monthly
  skillCategory: 'technical',
  difficulty: 4,                  // 1-5
  expReward: 150,
  currencyReward: 200,
  stressImpact: 20,
  moodImpact: 5,
  deadline: 48,                   // hours
  assignedBy: 'manager-alex',
}
```

Quests automatically appear in the game - no additional code needed!

## 🔌 Backend Integration (Future-Ready)

The frontend is **100% complete and backend-ready**! See detailed integration guides:

- 🚀 **Quick Start**: [README_BACKEND_SETUP.md](/README_BACKEND_SETUP.md) - Get running in 5 minutes
- 📖 **Complete Guide**: [BACKEND_INTEGRATION.md](/BACKEND_INTEGRATION.md) - Detailed integration steps
- 📊 **Database Schema**: [/services/databaseSchema.ts](/services/databaseSchema.ts) - Complete schema reference

### What the Frontend Needs from Backend

**4 Core Endpoints** (all pre-configured in `/services/api.ts`):

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/player/get` | Fetch player data from database |
| POST | `/api/player/update` | Save player data to database |
| GET | `/api/quests/get` | Fetch available quests for player |
| POST | `/api/quests/update` | Update quest status |
| POST | `/api/auth/github` | GitHub OAuth authentication |

### Quick Integration Steps

1. **Set environment variable** in `.env`:
   ```bash
   REACT_APP_API_URL=http://localhost:5000
   ```

2. **Implement the 4 endpoints** in your backend (Node.js, Python, Go, etc.)

3. **Use the database schema** from `/services/databaseSchema.ts`

4. **Done!** Frontend will automatically use your backend

**See [BACKEND_INTEGRATION.md](/BACKEND_INTEGRATION.md) for complete code examples and data flow diagrams.**

## 🎨 Customizing Zones

Each zone has a consistent structure with easy theme customization:

```typescript
// zones/Workspace.tsx
<QuestCard
  quest={quest}
  theme="blue"    // blue | purple | orange
  onStart={handleStartQuest}
/>
```

**Zone Colors:**
- Workspace: Blue (`from-blue-900/50`)
- Game Lounge: Purple (`from-purple-900/50`)
- Meeting Room: Orange (`from-orange-900/50`)
- Cafeteria: Amber (`from-amber-900/50`)

## 📊 Game Mechanics

### Quest Types
- **Daily Quests** - 6 generated per day (short tasks, lower rewards)
- **Weekly Quests** - 4 generated per week (medium tasks, good rewards)
- **Monthly Quests** - 3 generated per month (major projects, high rewards)

### Experience & Leveling
- Base EXP formula: `100 * (level ^ 1.5)`
- Level up unlocks higher salaries
- EXP retained across career runs

### Mood/Stress System
- **Mood** decreases with stressful tasks
- **Stress** increases with difficult quests
- **Burnout** triggers when Mood hits 0
- Recover through Game Lounge or Cafeteria items

### Salary System
- Base: $1,000 + (level - 1) × $200
- Monthly payments based on reputation
- Bonuses/penalties from performance

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Clear Game Data (for testing)
```javascript
// Browser console
localStorage.clear();
location.reload();
```

## 📦 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Motion** (Framer Motion) - Animations
- **GSAP** - Advanced animations
- **Lucide React** - Icons
- **Recharts** - Charts and graphs

## 📝 Code Organization Benefits

### Before Refactor
- ❌ 600+ lines of duplicate quest card code
- ❌ Inconsistent styling across zones
- ❌ Hard to maintain and update
- ❌ No clear backend integration path

### After Refactor
- ✅ Single `QuestCard` component (60% code reduction)
- ✅ Consistent design across all zones
- ✅ Clear comments for navigation
- ✅ Backend-ready architecture in `services/api.ts`
- ✅ Easy to add new quests and zones

## 🔍 Quick Navigation

| Task | Location |
|------|----------|
| Add quests | `data/quests.ts` |
| Modify game logic | `contexts/GameContext.tsx` |
| Style zones | `zones/*.tsx` |
| Backend integration | `services/api.ts` |
| Add shop items | `data/shopItems.ts` |
| Change colors | `zones/*.tsx` (theme prop) |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🗺️ Roadmap

- [ ] Backend API integration
- [ ] AI-powered dynamic quest generation
- [ ] Real-time multiplayer features
- [ ] Achievement system
- [ ] Career progression analytics dashboard
- [ ] Mobile app (React Native)

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed documentation

---

**Built with ❤️ for developers who want to level up their careers**

## 🎮 Gameplay Screenshots

*Coming soon - Add screenshots of each zone in action!*

## ⚡ Performance

- Optimized React rendering
- Efficient state management
- Lazy loading for heavy components
- Local storage for instant load times