import { ShopItem } from '../types/game';
export const shopItems: ShopItem[] = [
  // ==========================================================
  // CONSUMABLE ITEMS (5 items)
  // ==========================================================
  {
    id: 'coffee',
    name: 'Premium Coffee',
    item_type: 'regular',
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
    id: 'focus-timer',
    name: 'Focus Timer',
    item_type: 'double-edged',
    description: 'Sacrifices 20% mood due to rigid structure, but reduces stress by 40%through clear work/rest schedule (must have atleast 20 mood to buy)',
    type: 'consumable',
    effect: {
      stressReduction: 40,
      moodIncrease: -20,
    },
    price: 200,
    icon: '⏱️',
  },
  {
    id: 'aromatherapy-kit',
    name: 'Aromatherapy Kit',
    item_type: 'regular',
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
    item_type: 'regular',
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
    item_type: 'regular',
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
    item_type: 'regular',
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
  item_type: 'regular',
  description: 'Permanent 10% stress reduction on all tasks.',
  type: 'permanent-buff',
  effect: {
    stressReduction: 10,
  },
  price: 2200,
  icon: '🧘',
},
{
  id: 'standing-desk',
  name: 'Standing Desk',
  item_type: 'regular',
  description: 'Permanent 35% mood increase from work tasks.',
  type: 'permanent-buff',
  effect: {
    moodIncrease: 35,
  },
  price: 2500,
  icon: '🪑',
},
{
  id: 'headphones',
  name: 'Noise-Canceling Headphones',
  item_type: 'regular',
  description: 'Permanent 20% stress reduction on all tasks.',
  type: 'permanent-buff',
  effect: {
    stressReduction: 20,
  },
  price: 1800,
  icon: '🎧',
},
{
  id: 'smart-desk-lamp',
  name: 'Smart Desk Lamp',
  item_type: 'regular',
  description: 'Permanent 120% productivity (EXP) boost with adaptive lighting for optimal concentration.',
  type: 'permanent-buff',
  effect: {
    expBoost: 120,
  },
  price: 6000, // EXP items scaled to 5000–8000
  icon: '💡',
},
{
  id: 'ergonomic-chair',
  name: 'Ergonomic Chair',
  item_type: 'regular',
  description: 'Permanent 40% stress reduction from long tasks.',
  type: 'permanent-buff',
  effect: {
    stressReduction: 40,
  },
  price: 2300,
  icon: '💺',
},
{
  id: 'monitor-upgrade',
  name: 'Ultra-Wide Monitor',
  item_type: 'regular',
  description: 'Permanent 80% productivity (EXP) boost on all workspace tasks.',
  type: 'permanent-buff',
  effect: {
    expBoost: 80,
  },
  price: 5000, // EXP items scaled to 5000–8000
  icon: '🖥️',
}
];

// Legacy export for backward compatibility
export const SHOP_ITEMS = shopItems;