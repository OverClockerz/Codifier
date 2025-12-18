import { ShopItem } from '../types/game';

export const SHOP_ITEMS: ShopItem[] = [
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
    id: 'energy-drink',
    name: 'Energy Drink',
    description: 'Gain 20% more EXP for the next hour.',
    type: 'consumable',
    effect: {
      expBoost: 20,
      duration: 60,
    },
    price: 75,
    icon: '⚡',
  },
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
    id: 'productivity-course',
    name: 'Productivity Course',
    description: 'Gain 15% more currency for the next 2 hours.',
    type: 'consumable',
    effect: {
      currencyBoost: 15,
      duration: 120,
    },
    price: 150,
    icon: '📚',
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
    id: 'healthy-snack',
    name: 'Healthy Snack Box',
    description: 'Increases mood by 10 and reduces stress by 5.',
    type: 'consumable',
    effect: {
      moodIncrease: 10,
      stressReduction: 5,
    },
    price: 60,
    icon: '🥗',
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
];
