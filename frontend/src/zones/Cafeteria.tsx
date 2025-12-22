// ============================================================
// CAFETERIA ZONE COMPONENT
// ============================================================
// In-game shop for purchasing consumables and permanent buffs
// 
// FEATURES:
// - Browse and purchase items (hardcoded in /data/shopItems.ts)
// - View owned permanent buffs
// - Real-time currency display
// 
// BACKEND INTEGRATION - FULLY CONNECTED:
// ✅ Shop items are hardcoded in frontend (no API needed)
// ✅ When player purchases an item:
//    1. Frontend deducts currency locally
//    2. Frontend adds item to inventory/permanentBuffs
//    3. GameContext automatically calls updatePlayerData() to sync with backend
// ✅ Backend stores purchased items in player's inventory or permanentItems array
// 
// NO SHOP API ENDPOINTS NEEDED - purchases handled via /api/player/update
// ============================================================

import { motion } from 'motion/react';
import { useGame } from '../contexts/GameContext';
import { SHOP_ITEMS } from '../data/shopItems';
import { ShopItem } from '../types/game';
import { Coffee, ShoppingCart, Check, Sparkles } from 'lucide-react';

export function Cafeteria() {
  // ============================================================
  // STATE & DATA FETCHING
  // ============================================================
  // TODO: Replace with API call in production
  const { player, purchaseItem, inventory } = useGame();

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  
  // Check if player owns an item
  const isPurchased = (itemId: string) => {
    return inventory.some(item => item.item.id === itemId);
  };

  // Check if player can afford an item
  const canAfford = (price: number) => {
    return player.currency >= price;
  };

  // Get item display icon
  const getItemIcon = (item: ShopItem) => {
    return item.icon;
  };

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  const handlePurchase = (itemId: string) => {
    // TODO: In production, make API call
    // await fetch('/api/shop/purchase', {
    //   method: 'POST',
    //   body: JSON.stringify({ itemId, playerId: player.id }),
    // });
    purchaseItem(itemId);
  };

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* ZONE HEADER */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-900/50 to-amber-800/50 border border-amber-700 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Coffee className="w-8 h-8 text-amber-400" />
          <div>
            <h2 className="text-2xl text-white">Cafeteria - Shop</h2>
            <p className="text-sm text-amber-300">
              Purchase boosters and buffs to enhance your performance. Permanent items provide lasting benefits!
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CURRENCY DISPLAY */}
        {/* ============================================================ */}
        <div className="bg-black/30 border border-amber-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-amber-300 mb-1">Your Budget</div>
              <div className="text-3xl text-white">${player.currency.toLocaleString()}</div>
            </div>
            <div className="text-sm text-amber-200">
              💡 Salary paid at end of month
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* SHOP ITEMS GRID */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOP_ITEMS.map((item, index) => {
            const purchased = isPurchased(item.id);
            const affordable = canAfford(item.price);
            const isPermanent = item.type === 'permanent-buff';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`
                  bg-gray-900/50 border rounded-xl p-5 transition-all group relative
                  ${purchased && isPermanent
                    ? 'border-green-600 bg-green-900/10' 
                    : affordable 
                    ? 'border-gray-700 hover:border-amber-500' 
                    : 'border-gray-800 opacity-60'
                  }
                `}
              >
                {/* Item Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{getItemIcon(item)}</div>
                  {purchased && isPermanent && (
                    <div className="flex items-center gap-1 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      <Check className="w-3 h-3" />
                      Owned
                    </div>
                  )}
                  {isPermanent && !purchased && (
                    <div className="flex items-center gap-1 text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                      <Sparkles className="w-3 h-3" />
                      Permanent
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <h3 className="text-white mb-2">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-4 min-h-[40px]">{item.description}</p>

                {/* Price and Purchase Button */}
                <div className="flex items-center justify-between">
                  <div className="text-xl text-amber-400">${item.price}</div>
                  <button
                    onClick={() => handlePurchase(item.id)}
                    disabled={!affordable || (purchased && isPermanent)}
                    className={`
                      px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2
                      ${affordable && !(purchased && isPermanent)
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {purchased && isPermanent ? 'Owned' : 'Buy'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* OWNED PERMANENT ITEMS */}
      {/* ============================================================ */}
      {inventory.filter(item => item.item.type === 'permanent-buff').length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-900/20 border border-green-700 rounded-xl p-6"
        >
          <h3 className="text-xl text-white mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-400" />
            Your Permanent Items
          </h3>
          <div className="flex flex-wrap gap-3">
            {inventory
              .filter(item => item.item.type === 'permanent-buff')
              .map((invItem, index) => (
                <div
                  key={`${invItem.item.id}-${index}`}
                  className="bg-green-900/30 border border-green-600 px-4 py-2 rounded-lg text-green-300 text-sm"
                >
                  {invItem.item.icon} {invItem.item.name}
                </div>
              ))
            }
          </div>
        </motion.div>
      )}
    </div>
  );
}
