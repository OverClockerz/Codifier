# Office - Project Structure & Navigation Guide

## 📂 Directory Organization

```
office/
│
├── 🎮 GAME LOGIC & STATE
│   ├── contexts/
│   │   ├── GameContext.tsx          # ⭐ Core game state, quest management, player progression
│   │   └── AuthContext.tsx          # User authentication state
│   │
│   ├── data/
│   │   ├── quests.ts                # ⭐ All quest definitions (daily/weekly/monthly)
│   │   ├── shopItems.ts             # Cafeteria items and buffs
│   │   ├── gameConfig.ts            # Game formulas, leveling, salary calculations
│   │   └── npcs.ts                  # NPC character data
│   │
│   └── types/
│       └── game.ts                  # TypeScript type definitions
│
├── 🎨 UI COMPONENTS
│   ├── components/
│   │   ├── 🏠 LANDING PAGE
│   │   │   ├── LandingPage.tsx      # Main landing page wrapper
│   │   │   ├── Hero.tsx             # Hero section
│   │   │   ├── Features.tsx         # Features showcase
│   │   │   ├── Gallery.tsx          # Image gallery
│   │   │   ├── About.tsx            # About section
│   │   │   ├── CallToAction.tsx     # CTA section
│   │   │   ├── Footer.tsx           # Footer
│   │   │   └── Navigation.tsx       # Top navigation bar
│   │   │
│   │   ├── 🎮 GAME INTERFACE
│   │   │   ├── GamePage.tsx         # Main game container
│   │   │   ├── GameDashboard.tsx    # ⭐ Zone tabs and overview
│   │   │   ├── PlayerCard.tsx       # Player stats display
│   │   │   ├── QuestCard.tsx        # ⭐ Reusable quest card component
│   │   │   ├── QuestList.tsx        # Quest list with filters
│   │   │   ├── ZoneSelector.tsx     # Zone selection grid
│   │   │   └── ZoneHeader.tsx       # Zone header with back button
│   │   │
│   │   ├── 👤 PROFILE & NOTIFICATIONS
│   │   │   ├── ProfileModal.tsx     # Quick profile view
│   │   │   ├── ProfilePage.tsx      # Full profile page
│   │   │   └── NotificationsModal.tsx # Notifications panel
│   │   │
│   │   ├── 🔐 AUTHENTICATION
│   │   │   └── GitHubAuthModal.tsx  # Auth modal
│   │   │
│   │   ├── 🎵 AUDIO
│   │   │   └── MusicPlayer.tsx      # Background music player
│   │   │
│   │   ├── ✨ EFFECTS & ANIMATIONS
│   │   │   ├── effects/
│   │   │   │   ├── ScrambleText.tsx       # Text scramble effect
│   │   │   │   ├── ScrollReveal.tsx       # Scroll-triggered animations
│   │   │   │   ├── PinnedImageReveal.tsx  # Pinned image reveals
│   │   │   │   └── ScrollVideo.tsx        # Video scroll effects
│   │   │   │
│   │   │   └── transitions/
│   │   │       ├── PageTransition.tsx         # Page transitions
│   │   │       ├── LevelUpTransition.tsx     # Level up animation
│   │   │       ├── QuestStartTransition.tsx  # Quest start animation
│   │   │       ├── ZoneTransition.tsx        # Zone change animation
│   │   │       ├── LoadingScreen.tsx         # Loading screen
│   │   │       ├── TransitionLink.tsx        # Transition-enabled links
│   │   │       └── TransitionOverlays.tsx    # Overlay effects
│   │   │
│   │   ├── 📊 CHARTS
│   │   │   └── charts/
│   │   │       └── SimpleRadarChart.tsx # Radar chart for skills
│   │   │
│   │   ├── 🎯 ACTIVITIES
│   │   │   └── activities/
│   │   │       └── SimpleQuestModal.tsx # Quest activity modal
│   │   │
│   │   ├── 🖼️ FIGMA IMPORTS
│   │   │   └── figma/
│   │   │       └── ImageWithFallback.tsx # Protected image component
│   │   │
│   │   └── 🎨 UI PRIMITIVES
│   │       └── ui/                   # Shadcn UI components (40+ components)
│   │           ├── button.tsx
│   │           ├── card.tsx
│   │           ├── dialog.tsx
│   │           └── ... (and more)
│   │
├── 🏢 GAME ZONES
│   └── zones/
│       ├── Workspace.tsx            # ⭐ Technical training zone
│       ├── GameLounge.tsx           # ⭐ Critical thinking zone
│       ├── MeetingRoom.tsx          # ⭐ Soft skills zone
│       └── Cafeteria.tsx            # ⭐ Shop zone
│
├── 🔧 UTILITIES & SERVICES
│   ├── services/
│   │   └── api.ts                   # ⭐ Backend integration layer (ready for API)
│   │
│   ├── hooks/
│   │   └── usePageTransition.ts     # Page transition hook
│   │
│   └── utils/
│       └── smoothScroll.ts          # Smooth scroll utility
│
├── 🎨 ASSETS
│   ├── imports/                     # SVG paths and icons
│   │   ├── svg-qb2wx137qt.ts       # Play button icon
│   │   ├── svg-nxibdssaz9.ts
│   │   ├── svg-asbfp9h81j.ts
│   │   ├── svg-sz5ypmaapd.ts
│   │   └── svg-um99nn7qie.ts
│   │
│   └── styles/
│       └── globals.css              # Global styles and Tailwind config
│
└── 📄 DOCUMENTATION
    ├── README.md                    # Main project README
    ├── Attributions.md              # Asset attributions
    └── guidelines/
        └── Guidelines.md            # Development guidelines

```

## 🎯 Key Files for Different Tasks

### Adding New Quests
**File:** `data/quests.ts`
- Add to `DAILY_QUESTS`, `WEEKLY_QUESTS`, or `MONTHLY_QUESTS` arrays
- See line 4-119 for examples

### Modifying Game Logic
**File:** `contexts/GameContext.tsx`
- Quest initialization: Line 139
- Quest completion: Line 161
- Player progression: Line 347
- Shop purchases: Line 224

### Styling Zone Components
**Files:** `zones/*.tsx`
- All zones use the shared `QuestCard` component
- Zone headers have consistent styling
- Easy to modify themes

### Backend Integration
**File:** `services/api.ts`
- All API endpoints are pre-defined
- Just uncomment and add your API URL
- Currently uses mock data from GameContext

### Adding Shop Items
**File:** `data/shopItems.ts`
- Define items with effects
- Consumables and permanent buffs supported

## 🔍 Quick Find

### Looking for...?

| What | Where | Line |
|------|-------|------|
| Quest types | `types/game.ts` | ~50 |
| Level up logic | `contexts/GameContext.tsx` | ~347 |
| Zone switching | `components/GameDashboard.tsx` | ~30 |
| Quest card design | `components/QuestCard.tsx` | ~1 |
| Shop logic | `contexts/GameContext.tsx` | ~224 |
| Authentication | `contexts/AuthContext.tsx` | ~1 |
| Music player | `components/MusicPlayer.tsx` | ~1 |
| Profile display | `components/ProfilePage.tsx` | ~1 |

## 📊 Code Statistics

- **Total Components:** 60+
- **Lines of Code:** ~15,000+
- **Game Zones:** 4
- **Quest Types:** 3 (daily, weekly, monthly)
- **Shop Items:** 8+
- **UI Components:** 40+ (Shadcn UI)

## 🚀 Development Workflow

### 1. Start Development
```bash
npm run dev
```

### 2. Clear Game Data (for testing)
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### 3. Test Quest Display
1. Start the game
2. Click "Start Your Career"
3. Navigate to each zone tab
4. Verify quests appear

### 4. Add New Quest
1. Open `data/quests.ts`
2. Add quest object to appropriate array
3. Quest appears automatically in game

### 5. Integrate Backend
1. Open `services/api.ts`
2. Replace mock functions with real API calls
3. Update zone components to use API service

## 🎨 Component Hierarchy

```
App.tsx
├── AuthContext.Provider
│   ├── GameContext.Provider
│   │   ├── LandingPage (before auth)
│   │   │   ├── Navigation
│   │   │   ├── Hero
│   │   │   ├── Features
│   │   │   ├── PinnedImageReveal (x4 zones)
│   │   │   ├── Gallery
│   │   │   ├── About
│   │   │   ├── CallToAction
│   │   │   └── Footer
│   │   │
│   │   └── GamePage (after auth)
│   │       ├── MusicPlayer
│   │       ├── NotificationsModal
│   │       ├── ProfileModal
│   │       └── GameDashboard
│   │           ├── PlayerCard
│   │           ├── Tabs (Overview + 4 Zones)
│   │           │   ├── Overview
│   │           │   │   ├── Career Metrics
│   │           │   │   ├── All Quests List
│   │           │   │   └── Active Buffs
│   │           │   │
│   │           │   ├── Workspace
│   │           │   │   └── QuestCard (x multiple)
│   │           │   │
│   │           │   ├── GameLounge
│   │           │   │   └── QuestCard (x multiple)
│   │           │   │
│   │           │   ├── MeetingRoom
│   │           │   │   └── QuestCard (x multiple)
│   │           │   │
│   │           │   └── Cafeteria
│   │           │       └── Shop Items Grid
│   │           │
│   │           └── LevelUpTransition (conditional)
```

## 🛠️ Common Modifications

### Change Quest Rewards
```typescript
// data/quests.ts
expReward: 100,     // Increase/decrease EXP
currencyReward: 50, // Increase/decrease money
stressImpact: 20,   // Increase/decrease stress
```

### Add New Zone
1. Create `zones/NewZone.tsx`
2. Add to `GameDashboard.tsx` tabs
3. Add zone type to `types/game.ts`
4. Add quests with new zone type

### Change Level Up Formula
```typescript
// data/gameConfig.ts
export function getExperienceForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}
```

### Customize Zone Colors
```typescript
// zones/Workspace.tsx
className="from-blue-900/50 to-blue-800/50 border-blue-700"
theme="blue" // in QuestCard
```

## 📝 Notes

- **Protected Files:** Do not modify `/components/figma/ImageWithFallback.tsx`
- **UI Components:** Shadcn components in `/components/ui/` are auto-generated
- **SVG Imports:** Use existing SVG paths in `/imports/svg-*.ts`
- **Globals CSS:** Contains Tailwind v4 configuration
- **Quest IDs:** Auto-generated, don't need manual IDs

## 🔗 Dependencies

- React 18+
- TypeScript
- Tailwind CSS v4
- Motion (Framer Motion)
- GSAP
- Lucide Icons
- Recharts

---

**Last Updated:** December 2024
