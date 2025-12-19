# 🚀 Quick Start Guide - Office Game

## ⚡ 3-Minute Setup

### 1. Install & Run
```bash
npm install
npm run dev
```

### 2. Open Browser
Navigate to `http://localhost:5173`

### 3. Start Playing
1. Click **"Start Your Career"**
2. Use GitHub username (any name works for demo)
3. Explore zones via tabs

---

## 🎮 First Steps in Game

### After Login, You'll See:

```
┌─────────────────────────────────────┐
│  Player Card (Level 1, $5000)       │
├─────────────────────────────────────┤
│  📊 Overview | 💻 Workspace |       │
│  🎮 Game Lounge | 👥 Meeting Room  │
│  ☕ Cafeteria                       │
└─────────────────────────────────────┘
```

### Click Each Tab:

#### 📊 Overview
- View all active quests
- See career metrics
- Check active buffs

#### 💻 Workspace (Blue)
- 4-6 technical quests
- Click "Start" to begin
- Earn EXP & currency

#### 🎮 Game Lounge (Purple)
- 3-4 logic puzzles
- Reduces stress
- Increases mood

#### 👥 Meeting Room (Orange)
- 3-4 soft skill tasks
- Team collaboration
- Communication practice

#### ☕ Cafeteria (Green)
- Shop for buffs
- Buy stress relievers
- Purchase EXP boosters

---

## 🎯 Your First Quest

### Step 1: Go to Workspace Tab
Click the **💻 Workspace** tab

### Step 2: Choose a Quest
You'll see quest cards like:

```
┌────────────────────────────────────┐
│  Code Review                       │
│  Review pull requests from team    │
│                                    │
│  [+50 EXP] [+15 Stress] [4 days]  │
│                         [Start] →  │
└────────────────────────────────────┘
```

### Step 3: Click "Start"
- Quest begins immediately
- Demo mode auto-completes
- Rewards added to your account

### Step 4: Check Your Stats
- See EXP increase in player card
- Watch level progress bar
- Currency added to budget

---

## 💡 Tips for New Players

### Managing Stress
1. **Workspace quests** = ⬆️ Stress
2. **Game Lounge** = ⬇️ Stress
3. **Cafeteria items** = ⬇️ Stress

### Maximizing Progress
1. Complete **daily quests** first (easier)
2. Save **weekly quests** for steady progress
3. Plan **monthly quests** carefully

### Using the Shop
1. Buy **Coffee** for quick stress relief
2. Get **Meditation App** for permanent benefit
3. Save currency for **EXP Boosters**

---

## 🔧 Testing Features

### Clear Game Data
```javascript
// Browser console (F12)
localStorage.clear();
location.reload();
```

### Check Quest Count
```javascript
// Browser console
const state = JSON.parse(
  localStorage.getItem('office_game_YOUR_ID')
);
console.log('Active Quests:', state.activeQuests.length);
```

### Force Level Up (Testing)
```javascript
// In GameContext.tsx, line 347
// Temporarily change formula for testing
return Math.floor(10); // Easy level ups
```

---

## 📚 Common Questions

### Q: Why don't I see any quests?
**A:** Clear localStorage and reload:
```javascript
localStorage.clear();
location.reload();
```

### Q: How do I change quest difficulty?
**A:** Edit `data/quests.ts` and modify `difficulty: 1-5`

### Q: Can I add my own quests?
**A:** Yes! Add to `data/quests.ts`:
```typescript
{
  title: 'My Custom Quest',
  zone: 'workspace',
  frequency: 'daily',
  difficulty: 3,
  expReward: 100,
  currencyReward: 50,
  stressImpact: 15,
  moodImpact: -5,
  deadline: 24, // hours
  assignedBy: 'manager-alex',
}
```

### Q: How do I integrate with backend?
**A:** 
1. Set up your API server
2. Add `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```
3. Uncomment API calls in `services/api.ts`
4. Update zone components to use API

### Q: Where are the quest definitions?
**A:** `data/quests.ts` - Lines 4-402

### Q: How do I change zone colors?
**A:** In each zone file, modify:
```typescript
<QuestCard theme="blue" /> // Change to purple or orange
```

---

## 🎨 Customization Quick Reference

### Change Quest Rewards
```typescript
// data/quests.ts
expReward: 100,        // ← Change this
currencyReward: 50,    // ← And this
stressImpact: 20,      // ← And this
```

### Change Starting Currency
```typescript
// data/gameConfig.ts
startingCurrency: 5000 // ← Change this
```

### Change Level Up Speed
```typescript
// data/gameConfig.ts - Line ~20
export function getExperienceForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5)); // ← Adjust formula
}
```

### Add New Shop Item
```typescript
// data/shopItems.ts
{
  id: 'new-item',
  name: 'My Item',
  description: 'What it does',
  type: 'consumable',
  effect: {
    stressReduction: 20,
    moodIncrease: 10,
  },
  price: 150,
  icon: '☕',
}
```

---

## 📁 File Locations Cheat Sheet

| What to Modify | File Location |
|----------------|---------------|
| Quests | `data/quests.ts` |
| Shop Items | `data/shopItems.ts` |
| Game Settings | `data/gameConfig.ts` |
| Zone Visuals | `zones/*.tsx` |
| Quest Card Design | `components/QuestCard.tsx` |
| Player Dashboard | `components/GameDashboard.tsx` |
| API Integration | `services/api.ts` |

---

## 🐛 Troubleshooting

### Issue: Quests not showing
```bash
# Solution 1: Clear cache
localStorage.clear()
location.reload()

# Solution 2: Check console for errors
# Press F12 and look at Console tab

# Solution 3: Verify quest data
# Check data/quests.ts has quests defined
```

### Issue: Zone tab blank
```bash
# Check import in GameDashboard.tsx
import { Workspace } from '../zones/Workspace';

# Verify zone component exports
export function Workspace() { ... }

# Clear browser cache
Ctrl+Shift+R (hard reload)
```

### Issue: Quest card not styled
```bash
# Check QuestCard import
import { QuestCard } from '../components/QuestCard';

# Verify Tailwind is working
# Check styles/globals.css loaded

# Check theme prop
<QuestCard theme="blue" /> # Valid: blue, purple, orange
```

---

## 🎯 Success Checklist

After setup, verify:

- [ ] Game loads without errors
- [ ] Can login with any username
- [ ] See player card with Level 1
- [ ] Overview tab shows metrics
- [ ] Workspace tab shows 4-6 quests
- [ ] Game Lounge shows 3-4 quests
- [ ] Meeting Room shows 3-4 quests
- [ ] Cafeteria shows shop items
- [ ] Can click "Start" on quests
- [ ] Can purchase items in shop

If all ✓, you're ready to play! 🎉

---

## 🚀 Next Steps

1. ✅ **Play the game** - Complete quests in each zone
2. ✅ **Add content** - Create custom quests in `data/quests.ts`
3. ✅ **Customize** - Change colors, rewards, difficulty
4. ✅ **Backend** - Integrate API when ready
5. ✅ **Deploy** - Push to Vercel or Netlify

---

## 📖 More Documentation

- [README.md](README.md) - Overview & features
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Detailed navigation
- [ARCHITECTURE.md](ARCHITECTURE.md) - Component architecture
- [OPTIMIZATION_SUMMARY.md](OPTIMIZATION_SUMMARY.md) - What was optimized

---

**Ready to level up your career? Let's go! 🎮**
