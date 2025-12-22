# Project Structure - "Office" Game Frontend

This document describes the complete folder structure and purpose of each file in the project.

---

## 📁 Root Directory

```
/
├── App.tsx                          # Main app component with routing
├── README.md                        # Project overview
├── BACKEND_INTEGRATION.md           # Complete backend integration guide
├── PROJECT_STRUCTURE.md             # This file
├── .env.example                     # Environment variables template
└── Attributions.md                  # Credits and attributions
```

---

## 📁 /components - UI Components

### Main Game Components
```
/components/
├── GamePage.tsx                     # Main game page wrapper
├── GameDashboard.tsx                # Game dashboard (after "Start Your Career")
├── PlayerCard.tsx                   # Player stats card (level, XP, mood, stress)
├── QuestCard.tsx                    # Individual quest card display
├── QuestList.tsx                    # List of all quests
├── QuestTasks.tsx                   # Quest tasks component
├── QuestInteractionModal.tsx        # Modal for interactive quests (multiple-choice)
├── ZoneSelector.tsx                 # Zone navigation tabs
├── ZoneHeader.tsx                   # Zone header component
├── ProfileModal.tsx                 # Quick-view profile modal
├── ProfilePage.tsx                  # Full profile page with radar charts
├── NotificationsModal.tsx           # Notifications modal
├── MusicPlayer.tsx                  # Background music player
├── DigitalClock.tsx                 # Digital clock display
├── ErrorBoundary.tsx                # Error boundary wrapper
└── Tooltip.tsx                      # Tooltip component
```

### Landing Page Components
```
/components/
├── LandingPage.tsx                  # Main landing page
├── Hero.tsx                         # Hero section
├── Features.tsx                     # Features section
├── About.tsx                        # About section
├── Gallery.tsx                      # Gallery section
├── CallToAction.tsx                 # CTA section
├── Footer.tsx                       # Footer
├── Navigation.tsx                   # Navigation bar
├── VideoBackground.tsx              # Video background component
└── GitHubAuthModal.tsx              # GitHub authentication modal
```

### Activities
```
/components/activities/
└── SimpleQuestModal.tsx             # Simple quest modal (legacy)
```

### Charts
```
/components/charts/
└── SimpleRadarChart.tsx             # Radar chart for skills visualization
```

### Effects
```
/components/effects/
├── ScrambleText.tsx                 # Scramble text animation effect
├── ScrollReveal.tsx                 # Scroll-triggered reveal animation
├── ScrollVideo.tsx                  # Scroll-synced video playback
└── PinnedImageReveal.tsx            # Pinned image reveal effect
```

### Transitions
```
/components/transitions/
├── PageTransition.tsx               # GSAP page transitions
├── TransitionLink.tsx               # Link component with transitions
├── TransitionOverlays.tsx           # Transition overlay effects
├── ZoneTransition.tsx               # Zone change transitions
├── QuestStartTransition.tsx         # Quest start animations
├── LevelUpTransition.tsx            # Level up animation
└── LoadingScreen.tsx                # Loading screen component
```

### UI Components (shadcn/ui)
```
/components/ui/
├── accordion.tsx
├── alert.tsx
├── alert-dialog.tsx
├── avatar.tsx
├── badge.tsx
├── button.tsx
├── card.tsx
├── checkbox.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── input.tsx
├── label.tsx
├── popover.tsx
├── progress.tsx
├── scroll-area.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── slider.tsx
├── sonner.tsx (toast notifications)
├── switch.tsx
├── tabs.tsx
├── textarea.tsx
└── tooltip.tsx
```

---

## 📁 /contexts - React Context Providers

```
/contexts/
├── GameContext.tsx                  # Main game state management (⭐ KEY FILE)
│                                    # Handles: player data, quests, inventory, 
│                                    # shop purchases, leveling, reputation
└── AuthContext.tsx                  # Authentication state management
                                     # Handles: GitHub OAuth, user session
```

**Important**: `GameContext.tsx` is where you'll integrate the backend API. See inline comments for guidance.

---

## 📁 /data - Game Configuration & Data

```
/data/
├── gameConfig.ts                    # Game configuration constants
│                                    # (XP curves, salary, mood/stress thresholds)
├── quests.ts                        # Quest data (⚠️ Will be replaced by backend)
└── shopItems.ts                     # Shop items (⭐ Hardcoded in frontend)
```

**Note**: 
- `quests.ts` currently contains hardcoded quests, but these will be fetched from the backend
- `shopItems.ts` contains the 10 shop items (5 consumables, 5 permanent) and stays in frontend

---

## 📁 /services - API & Backend Integration

```
/services/
├── api.ts                           # API service layer (⭐ KEY FILE)
│                                    # Contains all backend API functions:
│                                    # - fetchPlayerData()
│                                    # - updatePlayerData()
│                                    # - fetchQuestsData()
│                                    # - updateQuestData()
│                                    # - GitHub OAuth functions
│
└── databaseSchema.ts                # Complete database schema definition
                                     # Use this as reference for backend implementation
```

---

## 📁 /types - TypeScript Type Definitions

```
/types/
└── game.ts                          # All game-related TypeScript types
                                     # (PlayerState, Quest, ShopItem, etc.)
```

---

## 📁 /utils - Utility Functions

```
/utils/
├── calculations.ts                  # Game mechanics calculations
│                                    # (XP, level up, reputation, etc.)
└── smoothScroll.ts                  # Smooth scroll utility
```

---

## 📁 /zones - Zone Pages

```
/zones/
├── Workspace.tsx                    # Workspace zone (technical training)
├── GameLounge.tsx                   # Game Lounge zone (critical thinking)
├── MeetingRoom.tsx                  # Meeting Room zone (soft skills)
└── Cafeteria.tsx                    # Cafeteria zone (shop)
```

---

## 📁 /pages - Page Components

```
/pages/
└── QuestPage.tsx                    # Full-page quest view with interactive questions
```

---

## 📁 /styles - Global Styles

```
/styles/
└── globals.css                      # Global CSS styles
                                     # Includes Tailwind configuration and typography
```

---

## 📁 /hooks - Custom React Hooks

```
/hooks/
└── usePageTransition.ts             # Hook for managing page transitions
```

---

## 📁 /imports - Figma Assets

```
/imports/
├── svg-asbfp9h81j.ts
├── svg-nxibdssaz9.ts
├── svg-qb2wx137qt.ts
├── svg-sz5ypmaapd.ts
└── svg-um99nn7qie.ts
```

---

## 📁 /guidelines - Project Guidelines

```
/guidelines/
└── Guidelines.md                    # Project guidelines and best practices
```

---

## 🎯 Key Files for Backend Integration

When connecting to your backend, focus on these files:

1. **`/services/api.ts`** - Update API endpoint calls
2. **`/contexts/GameContext.tsx`** - Replace localStorage with API calls
3. **`/services/databaseSchema.ts`** - Reference for backend database structure
4. **`/.env`** - Set your backend API URL (copy from `.env.example`)
5. **`/BACKEND_INTEGRATION.md`** - Complete step-by-step guide

---

## 🔄 Data Flow

```
User Action (Quest Complete, Shop Purchase, etc.)
    ↓
GameContext.tsx (Calculate rewards, update local state)
    ↓
services/api.ts (Send data to backend)
    ↓
Backend API (Store in database)
```

```
Page Load / User Login
    ↓
GameContext.tsx → loadGame()
    ↓
services/api.ts → fetchPlayerData()
    ↓
Backend API (Fetch from database)
    ↓
GameContext.tsx (Update local state)
    ↓
UI Components (Display data)
```

---

## 📝 File Naming Conventions

- **Components**: PascalCase (e.g., `PlayerCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `usePageTransition.ts`)
- **Utilities**: camelCase (e.g., `calculations.ts`)
- **Types**: camelCase (e.g., `game.ts`)
- **CSS**: kebab-case (e.g., `globals.css`)

---

## 🚫 Removed Features

The following features have been removed from the codebase:

- ❌ **NPCs** - No NPC characters or dialogue system
- ❌ **Quest Chains** - No interconnected quest sequences
- ❌ **Quest Requirements** - Quests don't have unlock requirements
- ❌ **Backend Folder** - All backend code removed from frontend repo

---

## 📦 Dependencies Overview

**Key Libraries**:
- `react` & `react-dom` - Core framework
- `tailwindcss` - Styling
- `gsap` - Animations and transitions
- `recharts` - Charts (radar chart for skills)
- `sonner` - Toast notifications
- `lucide-react` - Icons

**All dependencies** are auto-imported in the build system - no manual installation needed for standard libraries.

---

## 🔍 Quick Search Guide

**Looking for...**

- Player data structure? → `/types/game.ts` (PlayerState)
- API functions? → `/services/api.ts`
- Game logic? → `/contexts/GameContext.tsx`
- Shop items? → `/data/shopItems.ts`
- Database schema? → `/services/databaseSchema.ts`
- Quest completion logic? → `/contexts/GameContext.tsx` (completeQuest function)
- Level up logic? → `/contexts/GameContext.tsx` (addExperience function)
- Shop purchase logic? → `/contexts/GameContext.tsx` (purchaseItem function)

---

## 📚 Documentation Files

- **`BACKEND_INTEGRATION.md`** - Complete backend integration guide
- **`PROJECT_STRUCTURE.md`** - This file
- **`README.md`** - Project overview
- **`.env.example`** - Environment setup template

---

## 🎮 Game Flow Summary

1. **Landing Page** (`/components/LandingPage.tsx`) → User lands here
2. **GitHub OAuth** (`/contexts/AuthContext.tsx`) → User logs in
3. **Game Dashboard** (`/components/GameDashboard.tsx`) → Main game interface
4. **Zone Navigation** (`/components/ZoneSelector.tsx`) → User selects zone
5. **Quest Selection** (`/zones/*.tsx`) → User sees available quests
6. **Quest Interaction** (`/pages/QuestPage.tsx`) → User completes quest
7. **Rewards** (`/contexts/GameContext.tsx`) → XP, currency, skills updated
8. **Shop** (`/zones/Cafeteria.tsx`) → User spends currency on items
9. **Profile** (`/components/ProfilePage.tsx`) → User views stats and progress

---

**Last Updated**: December 21, 2025
**Version**: Frontend v2.0 (Backend-Ready)
