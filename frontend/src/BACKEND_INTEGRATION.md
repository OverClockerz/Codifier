# Backend Integration Guide for "Office" Game

This document provides complete instructions on how the frontend connects to your backend API and what you need to implement on the backend side.

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Backend API Requirements](#backend-api-requirements)
4. [API Endpoints Specification](#api-endpoints-specification)
5. [Data Schema](#data-schema)
6. [Environment Setup](#environment-setup)
7. [Data Flow](#data-flow)
8. [Testing the Integration](#testing-the-integration)
9. [Common Issues](#common-issues)

---

## Overview

The **"Office" game frontend is FULLY INTEGRATED** with backend APIs. 

### Key Principles

✅ **Frontend**: Handles all game logic, calculations, and UI rendering  
✅ **Backend**: Stores and retrieves player data (database layer only)  
✅ **Initial game state**: Fetched from backend on load  
✅ **Shop items**: Hardcoded in frontend, but purchases sync to backend  
✅ **NO shop API endpoints**: Shop purchases update player data via `/api/player/update`  

### How It Works

1. **User logs in** → Backend creates/fetches player from database
2. **Frontend loads** → Calls `GET /api/player/get` to fetch complete game state
3. **Player plays** → Frontend calculates all game logic locally
4. **State changes** → Frontend calls `POST /api/player/update` to sync with backend
5. **Player refreshes** → State loads from backend again

---

## Quick Start

### For Backend Developers

You need to implement **4 simple endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/player/get` | Fetch player's complete game state |
| `POST` | `/api/player/update` | Update player's game state |
| `POST` | `/api/auth/github` | GitHub OAuth authentication |

**Note**: You do NOT need `/api/quests/*` endpoints. Quests are sent as part of the player data in `activeQuests` and `completedQuests` arrays.

**Note**: You do NOT need `/api/shop/*` endpoints. Shop purchases update the player data through `/api/player/update`.

---

## Backend API Requirements

### Environment Variables

Create a `.env` file in your frontend root:

```bash
# Backend API URL
VITE_API_URL=http://localhost:5000

# GitHub OAuth (for authentication)
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
VITE_GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback
```

For production:
```bash
VITE_API_URL=https://your-production-api.com
```

---

## API Endpoints Specification

### 1. GET `/api/player/get`

**Purpose**: Fetch the current player's complete game state from the database.

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Expected Response (200 OK)**:

```json
{
  "_id": {
    "$oid": "694850f0a09403b1a8035ae4"
  },
  "username": "Myst-Blazeio",
  "githubinfo": {
    "github_id": "143222664",
    "avatar_url": "https://avatars.githubusercontent.com/u/143222664?v=4",
    "github_email": "pushkarpan03@gmail.com"
  },
  "level": 1,
  "experience": 0,
  "experienceToNextLevel": 100,
  "currency": 100,
  "mood": 70,
  "stress": 20,
  "isBurntOut": false,
  "baseSalary": 0,
  "currentMonthEarnings": 0,
  "currentMonthTasksCompleted": 0,
  "paidLeaves": 0,
  "currentDay": 1,
  "currentMonth": 1,
  "lastLoginDate": "2025-12-21T19:56:32.208415",
  "careerHistory": [],
  "currentRun": {
    "runNumber": 1,
    "startLevel": 1,
    "maxLevelAchieved": 1,
    "totalExperience": 0,
    "monthsWorked": 0,
    "reasonForEnd": "active"
  },
  "reputation": 0,
  "skills": {
    "python": 5,
    "git": 3,
    "problem_solving": 5,
    "communication": 4
  },
  "permanentItems": [],
  "activeQuests": [
    {
      "id": "quest-001",
      "title": "Organize Project Files",
      "description": "Clean up and structure all project files in the workspace.",
      "zone": "workspace",
      "frequency": "Daily",
      "difficulty": 2,
      "expReward": 40,
      "currencyReward": 15,
      "moodImpact": 4,
      "stressImpact": -1,
      "deadline": 1672531199,
      "status": "Pending",
      "startedAt": 1672444800,
      "skills": ["Organization", "Documentation"]
    }
  ],
  "completedQuests": [],
  "inventory": []
}
```

**Important Field Mappings**:
- `githubinfo` → Contains user's GitHub details (used for ID and avatar)
- `permanentItems` → Array of shop item IDs that are permanent buffs
- `activeQuests` → Full Quest objects (not just IDs)
- `completedQuests` → Full Quest objects that were completed
- `inventory` → Array of items in player's inventory

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Player not found (should create new player)
- `500 Internal Server Error`: Database error

---

### 2. POST `/api/player/update`

**Purpose**: Update the player's game state in the database. This is the ONLY endpoint needed for syncing all game changes (including shop purchases).

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body** (Complete player state):

```json
{
  "username": "Myst-Blazeio",
  "level": 2,
  "experience": 120,
  "experienceToNextLevel": 200,
  "currency": 450,
  "mood": 65,
  "stress": 35,
  "isBurntOut": false,
  "baseSalary": 500,
  "currentMonthEarnings": 150,
  "currentMonthTasksCompleted": 3,
  "paidLeaves": 1,
  "currentDay": 5,
  "currentMonth": 1,
  "lastLoginDate": "2025-12-21T20:30:00.000000",
  "careerHistory": [],
  "currentRun": {
    "runNumber": 1,
    "startLevel": 1,
    "maxLevelAchieved": 2,
    "totalExperience": 120,
    "monthsWorked": 0,
    "reasonForEnd": "active"
  },
  "reputation": 2.5,
  "skills": {
    "python": 7,
    "git": 5,
    "problem_solving": 6,
    "communication": 5
  },
  "permanentItems": ["meditation-app"],
  "activeQuests": [...],
  "completedQuests": [...],
  "inventory": [
    {
      "itemId": "coffee",
      "item": {
        "id": "coffee",
        "name": "Premium Coffee",
        "description": "Reduces stress by 10 points",
        "type": "consumable",
        "effect": {
          "stressReduction": 10,
          "moodIncrease": 5
        },
        "price": 50,
        "icon": "☕"
      },
      "quantity": 2,
      "purchasedAt": 1703160000000
    }
  ]
}
```

**What This Endpoint Handles**:
- ✅ Player stat updates (level, XP, currency, mood, stress)
- ✅ Shop item purchases (added to `inventory` or `permanentItems`)
- ✅ Quest completions (moved from `activeQuests` to `completedQuests`)
- ✅ Skill progression
- ✅ Reputation changes
- ✅ Career history updates

**Response (200 OK)**: Returns the complete updated player object (same format as GET `/api/player/get`)

**Error Responses**:
- `401 Unauthorized`: Invalid token
- `400 Bad Request`: Invalid data format
- `500 Internal Server Error`: Database error

---

### 3. POST `/api/auth/github`

**Purpose**: Exchange GitHub OAuth code for JWT token and create/fetch user.

**Request Body**:
```json
{
  "code": "github_oauth_code_here"
}
```

**Response (200 OK)**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "143222664",
    "username": "Myst-Blazeio",
    "email": "pushkarpan03@gmail.com",
    "avatar_url": "https://avatars.githubusercontent.com/u/143222664?v=4"
  }
}
```

**Backend Implementation Steps**:
1. Exchange the GitHub code for a GitHub access token
2. Fetch user info from GitHub API
3. Check if user exists in database:
   - **If YES**: Return existing user
   - **If NO**: Create new player with initial game state (see [Data Schema](#data-schema))
4. Generate JWT token for authentication
5. Return token + user info

**Frontend Usage**:
The frontend automatically:
1. Stores the token in `localStorage` as `auth_token`
2. Includes it in all subsequent API calls via `Authorization: Bearer <token>` header

---

## Data Schema

### Initial Player Template

When creating a new player, use this template:

```json
{
  "username": "user_from_github",
  "githubinfo": {
    "github_id": "from_github_api",
    "avatar_url": "from_github_api",
    "github_email": "from_github_api"
  },
  "level": 1,
  "experience": 0,
  "experienceToNextLevel": 100,
  "currency": 100,
  "mood": 70,
  "stress": 20,
  "isBurntOut": false,
  "baseSalary": 0,
  "currentMonthEarnings": 0,
  "currentMonthTasksCompleted": 0,
  "paidLeaves": 0,
  "currentDay": 1,
  "currentMonth": 1,
  "lastLoginDate": "ISO_DATE_STRING",
  "careerHistory": [],
  "currentRun": {
    "runNumber": 1,
    "startLevel": 1,
    "maxLevelAchieved": 1,
    "totalExperience": 0,
    "monthsWorked": 0,
    "reasonForEnd": "active"
  },
  "reputation": 0,
  "skills": {},
  "permanentItems": [],
  "activeQuests": [],
  "completedQuests": [],
  "inventory": []
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `username` | string | Player's display name |
| `githubinfo` | object | GitHub OAuth user data |
| `level` | number | Current player level |
| `experience` | number | Current XP in this level |
| `experienceToNextLevel` | number | XP needed to reach next level |
| `currency` | number | In-game currency (earned from quests) |
| `mood` | number | Mood stat (0-100) |
| `stress` | number | Stress stat (0-100) |
| `isBurntOut` | boolean | True if player reached burnout threshold |
| `reputation` | number | Reputation score (-20 to +∞, fired at -20) |
| `skills` | object | Key-value pairs of skill names and levels |
| `permanentItems` | array | IDs of permanent shop items owned |
| `activeQuests` | array | Full Quest objects currently available/in-progress |
| `completedQuests` | array | Full Quest objects that were completed |
| `inventory` | array | Items in player's inventory with quantities |

---

## Data Flow

### 1. Initial Load Flow

```
User logs in with GitHub
   ↓
Frontend receives JWT token
   ↓
Frontend calls: GET /api/player/get
   ↓
Backend returns complete player state
   ↓
Frontend transforms backend data to internal format
   ↓
Frontend displays game dashboard with player data
```

### 2. Shop Purchase Flow

```
User clicks "Buy" on shop item
   ↓
Frontend validates currency
   ↓
Frontend calculates effects locally
   ↓
Frontend adds item to inventory OR permanentItems
   ↓
Frontend updates player state (reduce currency)
   ↓
Frontend calls: POST /api/player/update
   ↓
Backend saves updated player state
   ↓
Frontend shows purchase confirmation
```

### 3. Quest Completion Flow

```
User completes quest (answers questions)
   ↓
Frontend calculates performance score
   ↓
Frontend calculates rewards (XP, currency, skills)
   ↓
Frontend updates player state locally
   ↓
Frontend moves quest from activeQuests to completedQuests
   ↓
Frontend calls: POST /api/player/update
   ↓
Backend saves updated player state
   ↓
Frontend shows completion animation
```

### 4. Auto-Save Flow

```
Player state changes (any action)
   ↓
React useEffect detects change
   ↓
Frontend calls: POST /api/player/update
   ↓
Backend saves updated state
   ↓
(Silent background save - no UI feedback)
```

---

## Environment Setup

### Frontend Setup

1. Create `.env` file:
```bash
VITE_API_URL=http://localhost:5000
VITE_GITHUB_CLIENT_ID=your_client_id
VITE_GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback
```

2. The frontend is already configured to use these endpoints. No code changes needed!

### Backend Setup

Your backend needs to:

1. **Implement the 3 endpoints** (GET /api/player/get, POST /api/player/update, POST /api/auth/github)
2. **Set up MongoDB** (or your preferred database) with the player schema
3. **Enable CORS** to allow requests from your frontend domain
4. **Implement JWT authentication** for securing endpoints

Example CORS setup (Express.js):
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## Testing the Integration

### Test Checklist

- [ ] **Login**: GitHub OAuth creates/fetches player in backend
- [ ] **Initial Load**: Player data loads from backend on first visit
- [ ] **Refresh Page**: Data persists after page refresh
- [ ] **Complete Quest**: Quest completion updates backend
- [ ] **Buy Shop Item**: Item appears in inventory after purchase
- [ ] **Use Shop Item**: Item effects apply and inventory updates
- [ ] **Level Up**: XP and level changes save to backend
- [ ] **Skills**: Skills update after quest completion
- [ ] **Reputation**: Reputation changes save correctly
- [ ] **Logout/Login**: Same data appears after re-login

### Debugging Tips

1. **Check Network Tab** in browser DevTools to see API calls
2. **Look for 401 errors** → Check if token is being sent correctly
3. **Look for 500 errors** → Check backend logs for database errors
4. **Check Console** for frontend error messages
5. **Verify localStorage** has `auth_token` after login

---

## Common Issues

### Issue 1: CORS Errors

**Error**: `Access to fetch blocked by CORS policy`

**Solution**: Add CORS middleware in your backend:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 2: 401 Unauthorized

**Error**: All API calls return 401

**Solution**: 
1. Check that `auth_token` exists in localStorage
2. Verify backend is reading the `Authorization` header correctly
3. Make sure JWT token hasn't expired

### Issue 3: Data Not Persisting

**Error**: Data resets on page refresh

**Solution**:
1. Verify `POST /api/player/update` is saving data to database
2. Check backend logs to see if updates are received
3. Make sure `GET /api/player/get` returns saved data

### Issue 4: Shop Purchases Not Saving

**Error**: Items disappear after refresh

**Solution**:
1. Verify that `inventory` or `permanentItems` arrays are being saved
2. Check that the `POST /api/player/update` request includes inventory data
3. Confirm backend is storing the full player object, not partial updates

---

## Summary

### What the Frontend Does

✅ Fetches initial game state from backend  
✅ Calculates all game logic (XP, rewards, skills, mood/stress)  
✅ Updates local state immediately for responsive UI  
✅ Automatically syncs state to backend on changes  
✅ Uses hardcoded shop items but syncs purchases to backend  

### What the Backend Needs to Do

✅ Implement 3 API endpoints  
✅ Store/retrieve player data in database  
✅ Handle GitHub OAuth authentication  
✅ Return data in the expected format  

### What You DON'T Need

❌ No `/api/quests/*` endpoints - quests are part of player data  
❌ No `/api/shop/*` endpoints - shop is handled client-side  
❌ No game logic in backend - frontend handles everything  

---

**Questions?** Check inline comments in:
- `/services/api.ts` - API service layer
- `/contexts/GameContext.tsx` - Game state management
- `/services/databaseSchema.ts` - Database schema reference

---

**Last Updated**: December 21, 2025  
**Frontend Version**: v2.0 (Backend Integrated)