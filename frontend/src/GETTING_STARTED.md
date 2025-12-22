# 🎮 Getting Started with "Office" Game Frontend

Welcome to the "Office" game frontend! This guide will help you get started with the project and understand how to connect it to your backend.

---

## 📖 Table of Contents

1. [Quick Overview](#quick-overview)
2. [What You Have](#what-you-have)
3. [What You Need](#what-you-need)
4. [5-Minute Setup](#5-minute-setup)
5. [How It Works](#how-it-works)
6. [Next Steps](#next-steps)
7. [Documentation Index](#documentation-index)

---

## 🎯 Quick Overview

**"Office"** is a gamified career simulation RPG built with React and TypeScript. The frontend handles all game logic (calculations, animations, UI) while the backend stores player data.

### Key Features

- 🎭 **4 Zones**: Workspace, Game Lounge, Meeting Room, Cafeteria
- 📊 **Dual-Bar System**: Manage Mood (0-100) and Stress (0-100)
- 🎯 **Quest System**: Daily, weekly, and monthly quests with interactive questions
- 💰 **Shop**: 10 items (5 consumables, 5 permanent buffs)
- 📈 **Progression**: Level up, gain skills, build reputation
- 🔄 **Career Runs**: Get fired at -20% reputation, restart with bonus levels
- 🎨 **Polished UI**: GSAP animations, transitions, music player

---

## ✅ What You Have (Frontend)

The frontend is **100% complete** and includes:

### ✅ Core Game Features
- Player progression system (levels, XP, currency)
- Quest system with interactive multiple-choice questions
- Mood/Stress management with burnout mechanics
- Reputation system with game over at -20%
- Skills system with radar chart visualization
- Shop with 10 items (consumables and permanent buffs)
- Inventory management
- Career history tracking
- Monthly performance reports
- Notifications system

### ✅ UI Components
- Landing page with hero section
- Game dashboard with zone navigation
- Quest pages with interactive questions
- Profile page with statistics
- Shop interface
- Music player
- Level up animations
- Page transitions (GSAP)

### ✅ Backend Integration Layer
- Complete API service (`/services/api.ts`)
- Database schema (`/services/databaseSchema.ts`)
- Environment configuration (`.env.example`)
- Comprehensive documentation

### ✅ Documentation
- Backend integration guide (`/BACKEND_INTEGRATION.md`)
- Quick setup guide (`/README_BACKEND_SETUP.md`)
- Project structure (`/PROJECT_STRUCTURE.md`)
- Changelog (`/CHANGELOG.md`)

---

## ⏳ What You Need (Backend)

You need to implement a backend server with **4 core endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/player/get` | Fetch player data from database |
| POST | `/api/player/update` | Save player data to database |
| GET | `/api/quests/get` | Fetch available quests for player |
| POST | `/api/quests/update` | Update quest status (start/complete/fail) |
| POST | `/api/auth/github` | GitHub OAuth authentication |

**Backend Tech Stack**: Any (Node.js, Python, Go, Java, etc.)  
**Database**: Any (MongoDB, PostgreSQL, MySQL, etc.)

---

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (if needed)

```bash
npm install
```

### Step 2: Set Environment Variables

1. Copy the template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env`:
   ```bash
   # Your backend API URL
   REACT_APP_API_URL=http://localhost:5000

   # GitHub OAuth (get from https://github.com/settings/developers)
   REACT_APP_GITHUB_CLIENT_ID=your_github_client_id_here
   REACT_APP_GITHUB_REDIRECT_URI=http://localhost:3000
   ```

### Step 3: Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

### Step 4: Explore the Frontend

- Landing page → Click "Start Your Career"
- Login with GitHub (will fail until backend is ready)
- Explore the game dashboard
- Try completing a quest
- Visit the shop (Cafeteria zone)

---

## 🔧 How It Works

### Data Flow

```
Frontend (React)
    ↓
  [Game Logic & Calculations]
    ↓
  [Update Local State]
    ↓
API Service (/services/api.ts)
    ↓
Backend API Endpoints
    ↓
Database
```

### Example: Completing a Quest

1. **User clicks "Complete Quest"** in the UI
2. **Frontend calculates rewards**:
   - XP gain based on performance score
   - Currency gain based on performance
   - Skills improvement
   - Mood/Stress changes
   - Reputation update
3. **Frontend updates local state** immediately (smooth UX)
4. **Frontend calls API**: `updatePlayerData(player)`
5. **Backend saves** to database
6. **On next login**: `fetchPlayerData()` loads from database

### Example: Purchasing Shop Item

1. **User buys "Premium Coffee"** (costs 50 currency)
2. **Frontend checks** if player has enough currency
3. **Frontend deducts** 50 currency
4. **Frontend adds** item to inventory
5. **Frontend calls API**: `updatePlayerData({ currency: 2450, inventory: [...] })`
6. **Backend saves** updated player data

---

## 🚀 Next Steps

### For Frontend Testing (Without Backend)

The game works without a backend using localStorage:

1. ✅ Run `npm start`
2. ✅ Play the game
3. ✅ Data saves to browser localStorage
4. ✅ Refresh page → data persists

**Perfect for frontend development and testing!**

### For Backend Integration

Follow these steps in order:

1. **Read the integration guide**: `/BACKEND_INTEGRATION.md`
2. **Review database schema**: `/services/databaseSchema.ts`
3. **Implement 4 backend endpoints** (GET/POST player, GET/POST quests, POST auth)
4. **Set `REACT_APP_API_URL`** in `.env`
5. **Test the integration**

### For Production Deployment

1. **Deploy backend** to your server (Heroku, AWS, DigitalOcean, etc.)
2. **Deploy frontend** to static hosting (Vercel, Netlify, etc.)
3. **Update `.env`** with production URLs:
   ```bash
   REACT_APP_API_URL=https://your-backend.com
   REACT_APP_GITHUB_REDIRECT_URI=https://your-frontend.com
   ```
4. **Test end-to-end**

---

## 📚 Documentation Index

### Essential Reading

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **This file** | Getting started guide | Read first |
| [`/README_BACKEND_SETUP.md`](/README_BACKEND_SETUP.md) | Quick backend setup | When ready to integrate |
| [`/BACKEND_INTEGRATION.md`](/BACKEND_INTEGRATION.md) | Complete integration guide | For detailed implementation |

### Reference Documentation

| Document | Purpose |
|----------|---------|
| [`/services/databaseSchema.ts`](/services/databaseSchema.ts) | Database schema with examples |
| [`/PROJECT_STRUCTURE.md`](/PROJECT_STRUCTURE.md) | Complete file structure overview |
| [`/CHANGELOG.md`](/CHANGELOG.md) | Version history and changes |
| [`/.env.example`](/.env.example) | Environment variables template |

### Code Documentation

| File | Purpose |
|------|---------|
| `/services/api.ts` | All API functions with JSDoc comments |
| `/contexts/GameContext.tsx` | Main game logic with inline comments |
| `/data/shopItems.ts` | Shop items configuration |
| `/types/game.ts` | TypeScript type definitions |

---

## 🎯 Key Concepts

### Frontend Handles Game Logic

All calculations happen in the frontend:
- ✅ XP and level up calculations
- ✅ Currency rewards
- ✅ Mood/Stress changes
- ✅ Skills improvement
- ✅ Reputation updates
- ✅ Shop item effects

**Why?** For instant responsiveness and smooth gameplay.

### Backend is a Data Store

The backend only stores and retrieves data:
- ✅ Save player state
- ✅ Load player state
- ✅ Provide quests
- ✅ Track quest completion
- ✅ Authenticate users

**Why?** Simple, scalable, and easy to maintain.

### Shop Items are Hardcoded

The 10 shop items are defined in `/data/shopItems.ts`:
- ✅ No need to fetch from backend
- ✅ Effects calculated in frontend
- ✅ Only inventory/currency saved to backend

**Why?** Shop items rarely change, no need for database complexity.

### Quests Come from Backend

Quest data is fetched from the backend:
- ✅ Backend maintains quest pool
- ✅ Backend decides which quests to show
- ✅ Allows dynamic quest rotation

**Why?** You can add new quests without redeploying frontend.

---

## 🐛 Troubleshooting

### Game doesn't load quests

**Cause**: Backend not running or `REACT_APP_API_URL` incorrect.  
**Solution**: Check `.env` file and verify backend is running.

### GitHub login fails

**Cause**: `REACT_APP_GITHUB_CLIENT_ID` not set or invalid.  
**Solution**: Create GitHub OAuth app at https://github.com/settings/developers and copy Client ID.

### Data doesn't persist

**Cause**: Backend not saving data properly.  
**Solution**: Check backend logs for errors. Verify `POST /api/player/update` is working.

### CORS errors

**Cause**: Backend not allowing requests from frontend origin.  
**Solution**: Add CORS headers in backend for `http://localhost:3000`.

---

## 💡 Tips

### Development Workflow

1. **Frontend development**: Use localStorage (works offline)
2. **Backend development**: Implement endpoints one by one
3. **Integration testing**: Connect frontend to local backend
4. **Production deployment**: Deploy both to cloud

### Best Practices

- ✅ Always check browser console for errors
- ✅ Use browser DevTools Network tab to debug API calls
- ✅ Keep `.env` in `.gitignore` (never commit secrets)
- ✅ Test with different player states (new player, high level, low reputation)
- ✅ Read inline code comments for guidance

---

## 🎮 Game Design Summary

### 4 Zones

1. **Workspace** - Technical training quests (Python, Git, Databases)
2. **Game Lounge** - Critical thinking puzzles (reduces stress)
3. **Meeting Room** - Soft skills training (Communication, Teamwork)
4. **Cafeteria** - Shop to buy items

### Progression Loop

```
Complete Quests
    ↓
Gain XP, Currency, Skills
    ↓
Level Up
    ↓
Unlock Higher Difficulty Quests
    ↓
Earn More Currency
    ↓
Buy Shop Items
    ↓
Get Permanent Buffs
    ↓
Complete More Quests
```

### Challenge: Manage Mood & Stress

- **Workspace quests** increase stress, decrease mood
- **Game Lounge quests** decrease stress, increase mood
- **Meeting Room quests** vary based on performance
- **Shop items** provide stress relief and mood boosts
- **Burnout** at Mood ≤ 20
- **Fired** at Reputation < -20%

---

## 🎉 You're Ready!

You now have everything you need to:

1. ✅ **Explore the frontend** - Run it locally and try all features
2. ✅ **Understand the architecture** - Game logic in frontend, data in backend
3. ✅ **Integrate with backend** - Follow `/BACKEND_INTEGRATION.md`
4. ✅ **Deploy to production** - Deploy frontend and backend separately

---

## 📞 Questions?

Check the documentation:

1. **Backend setup**: [`/README_BACKEND_SETUP.md`](/README_BACKEND_SETUP.md)
2. **Integration details**: [`/BACKEND_INTEGRATION.md`](/BACKEND_INTEGRATION.md)
3. **File structure**: [`/PROJECT_STRUCTURE.md`](/PROJECT_STRUCTURE.md)
4. **API reference**: `/services/api.ts` (inline JSDoc comments)
5. **Database schema**: `/services/databaseSchema.ts`

---

**Happy coding! 🚀**

---

**Frontend Version**: 2.0  
**Status**: ✅ Production Ready  
**Last Updated**: December 21, 2025
