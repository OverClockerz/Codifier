# 🚀 Backend Setup Quick Start

This is a quick-start guide to connect the "Office" game frontend to your backend API. For complete details, see [`BACKEND_INTEGRATION.md`](/BACKEND_INTEGRATION.md).

---

## 📋 Prerequisites

✅ You have a backend server ready (Node.js/Express, Python/Flask, etc.)  
✅ Your backend can handle RESTful API requests  
✅ You understand JWT authentication basics  
✅ You have a database ready (MongoDB, PostgreSQL, MySQL, etc.)

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Set Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your backend URL:
   ```bash
   REACT_APP_API_URL=http://localhost:5000
   # Or your production URL:
   # REACT_APP_API_URL=https://your-backend-api.com
   
   # Add your GitHub OAuth credentials:
   REACT_APP_GITHUB_CLIENT_ID=your_github_client_id
   REACT_APP_GITHUB_REDIRECT_URI=http://localhost:3000
   ```

### Step 2: Implement Backend Endpoints

Your backend needs these **3 core endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/player/get` | Fetch complete player data (includes quests) |
| POST | `/api/player/update` | Update player data (handles all changes) |
| POST | `/api/auth/github` | GitHub OAuth |

**Note**: 
- ❌ No `/api/quests/*` endpoints needed - quests are part of player data
- ❌ No `/api/shop/*` endpoints needed - shop is client-side, purchases update player data

### Step 3: Database Schema

Use the schema from `/services/databaseSchema.ts`. Example:

```typescript
{
  username: string;
  githubInfo: {
    github_id: string;
    avatar_url: string;
    github_email: string;
  };
  level: number;
  experience: number;
  currency: number;
  mood: number;
  stress: number;
  reputation: number;
  skills: Record<string, number>;
  activeQuests: Quest[];
  completedQuests: Quest[];
  inventory: InventoryItem[];
  // ... see full schema in databaseSchema.ts
}
```

### Step 4: Test Connection

1. Start your backend server
2. Start the frontend: `npm start`
3. Login with GitHub
4. Check browser console for API calls
5. Verify data is saved to your database

---

## 🎯 What the Frontend Sends to Backend

### Example: Player Update Request

```json
POST /api/player/update
{
  "level": 5,
  "experience": 350,
  "currency": 2500,
  "mood": 70,
  "stress": 30,
  "reputation": 5.5,
  "skills": {
    "python": 45,
    "javascript": 38
  },
  "inventory": [
    {
      "itemId": "coffee",
      "itemName": "Premium Coffee",
      "quantity": 3
    }
  ]
}
```

### Example: Quest Update Request

```json
POST /api/quests/update
{
  "questId": "quest-001",
  "status": "completed",
  "performanceScore": 95,
  "completedAt": 1703160000000
}
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [`BACKEND_INTEGRATION.md`](/BACKEND_INTEGRATION.md) | Complete integration guide with examples |
| [`/services/databaseSchema.ts`](/services/databaseSchema.ts) | Full database schema with examples |
| [`/services/api.ts`](/services/api.ts) | All API functions (already implemented) |
| [`PROJECT_STRUCTURE.md`](/PROJECT_STRUCTURE.md) | Complete file structure overview |
| `.env.example` | Environment variables template |

---

## 🔧 How It Works

### Authentication Flow

```
1. User clicks "Login with GitHub"
2. Frontend redirects to GitHub OAuth
3. GitHub returns with auth code
4. Frontend sends code to your backend: POST /api/auth/github
5. Backend validates with GitHub, creates/fetches user
6. Backend returns JWT token
7. Frontend stores token and uses it for all API calls
```

### Game Data Flow

```
1. User completes a quest in frontend
2. Frontend calculates rewards (XP, currency, skills)
3. Frontend updates local state immediately (for responsiveness)
4. Frontend sends updated player data: POST /api/player/update
5. Backend saves to database
6. On page refresh: GET /api/player/get loads data from backend
```

---

## 🛠️ Integration Steps

### Option 1: Quick Integration (Recommended)

The frontend is **already set up** to use the backend. Just:

1. ✅ Set `REACT_APP_API_URL` in `.env`
2. ✅ Implement the 4 backend endpoints
3. ✅ Done! Frontend will automatically call your API

### Option 2: Manual Integration

If you want to customize the integration:

1. Open `/contexts/GameContext.tsx`
2. Import API functions:
   ```typescript
   import { fetchPlayerData, updatePlayerData } from '../services/api';
   ```
3. Replace `saveGame()` function to call `updatePlayerData()`
4. Replace `loadGame()` function to call `fetchPlayerData()`

See [`BACKEND_INTEGRATION.md`](/BACKEND_INTEGRATION.md) for detailed code examples.

---

## 🎮 Shop Items

Shop items are **hardcoded in the frontend** (`/data/shopItems.ts`):

- ✅ 5 consumable items (coffee, energy drink, vacation package, etc.)
- ✅ 5 permanent items (meditation app, standing desk, headphones, etc.)

When a player buys an item:
1. Frontend deducts currency
2. Frontend adds item to inventory
3. Frontend calls `POST /api/player/update` to save to backend

You don't need to manage shop items in your backend.

---

## 🔐 Authentication

The frontend uses GitHub OAuth for authentication:

1. User logs in via GitHub
2. Your backend receives the OAuth code
3. Backend exchanges code for GitHub user info
4. Backend creates/fetches player from database
5. Backend returns JWT token
6. Frontend stores token and includes it in all API requests

### Backend Responsibilities:
- ✅ Exchange GitHub code for user info
- ✅ Create new player if first login (use `INITIAL_PLAYER_TEMPLATE`)
- ✅ Generate and return JWT token
- ✅ Validate JWT on subsequent requests

---

## ❌ What's NOT in the Frontend Anymore

- ❌ NPCs and dialogue system - Removed
- ❌ Quest chains and requirements - Removed
- ❌ Backend folder - Removed (frontend only)

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch player data"

**Solution**: Make sure your backend is running and `REACT_APP_API_URL` is correct.

### Issue: CORS errors

**Solution**: Add CORS headers in your backend:
```javascript
// Express example
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue: 401 Unauthorized

**Solution**: Check that the JWT token is being sent correctly. Look in browser DevTools → Application → Local Storage → `auth_token`

### Issue: Data not persisting

**Solution**: Make sure `saveGame()` is being called. Check browser console for API call logs.

---

## 🧪 Testing Checklist

- [ ] GitHub OAuth login works
- [ ] Player data loads from backend on page refresh
- [ ] Quest completion saves to backend
- [ ] Shop purchases update inventory in backend
- [ ] Skills and reputation update correctly
- [ ] Level up saves to backend
- [ ] Notifications persist across sessions

---

## 📞 Need Help?

1. **Check documentation**:
   - [`BACKEND_INTEGRATION.md`](/BACKEND_INTEGRATION.md) - Complete guide
   - [`/services/databaseSchema.ts`](/services/databaseSchema.ts) - Schema reference
   - [`PROJECT_STRUCTURE.md`](/PROJECT_STRUCTURE.md) - File structure

2. **Check inline comments**:
   - `/services/api.ts` - API function documentation
   - `/contexts/GameContext.tsx` - Game logic documentation
   - `/data/shopItems.ts` - Shop items documentation

3. **Use browser DevTools**:
   - Network tab to see API calls
   - Console tab to see error messages
   - Application tab to check localStorage

---

## ✅ Summary

**Frontend is ready to go!** You just need to:

1. Set `REACT_APP_API_URL` in `.env`
2. Implement 4 backend endpoints
3. Use the database schema from `/services/databaseSchema.ts`
4. Test the integration

The frontend will handle all game logic (calculations, leveling, rewards) and send the final state to your backend for storage.

**Simple, clean, and backend-ready!** 🚀

---

**Last Updated**: December 21, 2025  
**Frontend Version**: v2.0 (Backend-Ready)
