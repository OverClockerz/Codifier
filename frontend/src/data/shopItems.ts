import { ShopItem } from '../types/game';

/**
 * SHOP ITEMS CONFIGURATION
 * =========================
 * 
 * Shop items are HARDCODED in the frontend (this file).
 * The items themselves don't need to be fetched from the backend.
 * 
 * However, when a player purchases an item:
 * 1. Frontend deducts currency from player
 * 2. Frontend adds item to player's inventory
 * 3. Frontend calls updatePlayerData() to save updated currency & inventory to backend
 * 
 * When a player uses an item:
 * 1. Frontend calculates the effect (XP boost, stress reduction, etc.)
 * 2. Frontend applies the effect to player state
 * 3. Frontend calls updatePlayerData() to save the updated state to backend
 * 
 * 📊 SHOP STRUCTURE:
 * - 5 Consumable items (single-use, provide temporary or instant effects)
 * - 5 Permanent items (one-time purchase, provide permanent passive bonuses)
 * 
 * See /services/api.ts: updatePlayerData() for backend sync
 */

export const shopItems: ShopItem[] = [
  // ==========================================================
  // CONSUMABLE ITEMS (5 items)
  // ==========================================================
  {
    id: 'coffee',
    name: 'Premium Coffee',
    description: 'Reduces stress by 10 and increases mood by 15. Instant effect.',
    type: 'consumable',
    effect: {
      stressReduction: 10,
      moodIncrease: 15,
    },
    price: 50,
    icon: '☕',
  },
  {
    id: 'aromatherapy-kit',
    name: 'Aromatherapy Kit',
    description: 'Instantly reduces stress by 25 and increases mood by 20. Calming scents soothe the mind.',
    type: 'consumable',
    effect: {
      stressReduction: 25,
      moodIncrease: 20,
    },
    price: 90,
    icon: '🌸',
  },
  {
    id: 'vacation-package',
    name: 'Vacation Package',
    description: 'Adds 3 paid leave days.',
    type: 'consumable',
    effect: {
      paidLeaves: 3,
    },
    price: 300,
    icon: '🏖️',
  },
  {
    id: 'chocolate-box',
    name: 'Box of Chocolates',
    description: 'Instantly increases mood by 25. Sweet delight!',
    type: 'consumable',
    effect: {
      moodIncrease: 25,
    },
    price: 120,
    icon: '🍫',
  },
  {
    id: 'stress-ball',
    name: 'Stress Ball',
    description: 'Reduces stress by 20. Quick relief!',
    type: 'consumable',
    effect: {
      stressReduction: 20,
    },
    price: 40,
    icon: '⚪',
  },
  // ==========================================================
  // PERMANENT ITEMS (5 items)
  // ==========================================================
  {
    id: 'meditation-app',
    name: 'Meditation App Subscription',
    description: 'Permanent 5% stress reduction on all tasks.',
    type: 'permanent-buff',
    effect: {
      stressReduction: 5,
    },
    price: 500,
    icon: '🧘',
  },
  {
    id: 'standing-desk',
    name: 'Standing Desk',
    description: 'Permanent 10% mood increase from work tasks.',
    type: 'permanent-buff',
    effect: {
      moodIncrease: 10,
    },
    price: 800,
    icon: '🪑',
  },
  {
    id: 'headphones',
    name: 'Noise-Canceling Headphones',
    description: 'Permanent 8% stress reduction on all tasks.',
    type: 'permanent-buff',
    effect: {
      stressReduction: 8,
    },
    price: 600,
    icon: '🎧',
  },
  {
    id: 'ergonomic-chair',
    name: 'Ergonomic Chair',
    description: 'Permanent buff: Reduces stress from long tasks by 12%.',
    type: 'permanent-buff',
    effect: {
      stressReduction: 12,
    },
    price: 1000,
    icon: '💺',
  },
  {
    id: 'monitor-upgrade',
    name: 'Ultra-Wide Monitor',
    description: 'Permanent 7% productivity boost on all workspace tasks.',
    type: 'permanent-buff',
    effect: {
      expBoost: 7,
    },
    price: 750,
    icon: '🖥️',
  },
];

// Legacy export for backward compatibility
export const SHOP_ITEMS = shopItems;