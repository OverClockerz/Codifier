// ============================================================
// CAFETERIA ZONE COMPONENT
// ============================================================
import { motion } from 'motion/react';
import { useGame } from '../contexts/GameContext';
import { SHOP_ITEMS } from '../data/shopItems';
import { ShopItem } from '../types/game';
import { Coffee, ShoppingCart, Check, Sparkles } from 'lucide-react';
import { purchaseItem } from '../utils/calculations';

// --- NEW IMPORTS ---
import { ShopButton } from '../components/effects/ShopButton';
import { Snackbar } from '../components/ui/snackbar';
import { useSnackbar } from '../hooks/useSnackbar';

export function Cafeteria() {
  // ============================================================
  // STATE & HOOKS
  // ============================================================
  const { player, setPlayer } = useGame();
  
  // Initialize the Snackbar Hook
  const { isActive, message, triggerSnackbar } = useSnackbar();

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================
  
  // Check if player owns an item
  const isPurchased = (itemId: string) => {
    return player.permanentBuffs.some(item => item.itemId === itemId);
  };

  // Check if player can afford an item
  const canAfford = (price: number) => {
    return player.currency >= price;
  };

  const consumptionCriteria = (item: ShopItem) :boolean => {
    switch (item.item_type) {
      case 'double-edged':
        return itemCondition(item.id);
      case 'regular':
        return true;
      default:
        return true;
    }
  }

  function itemCondition(itemId: string): boolean {
    switch (itemId) {
      case 'focus-timer':
        return player.mood >= 20;
      default:
        return true;
    }
  }

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  const handlePurchase = (item: ShopItem) => {
    // 1. Calculate State
    const state = purchaseItem(player, item); 

    if (state.success) {
      console.log(state.playerData);
      
      // 2. Update Context
      setPlayer(state.playerData); 

      // 3. Show Snackbar (Replaces alert)
      triggerSnackbar(state.message); 
    } else {
      // Optional: Trigger error snackbar if purchase failed logic
      triggerSnackbar("Purchase failed.");
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* ============================================================ */}
      {/* ZONE HEADER */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-r from-amber-900/50 to-amber-800/50 border border-amber-700 rounded-2xl p-6"
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
              <div className="text-3xl text-white">${Intl.NumberFormat('en-US').format(player.currency)}</div>
            </div>
            <div className="text-sm text-amber-200">
              💡 Salary is paid at the end of the month
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
            const affordable = canAfford(item.price) && consumptionCriteria(item);
            const isPermanent = item.type === 'permanent-buff';
            
            // Logic for disabling button
            const isDisabled = !affordable || (purchased && isPermanent);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`
                  bg-gray-900/50 border rounded-xl p-5 transition-all group relative
                  ${(purchased && isPermanent ? 'border-gray-800 opacity-60' : (affordable ? 'border-gray-700 hover:border-amber-500' 
                    : 'border-gray-800 opacity-60'))
                  }
                `}
              >
                {/* Item Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{item.icon}</div>
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
                <p className="text-sm text-gray-400 mb-4 min-h-10">{item.description}</p>

                {/* Price and Purchase Button */}
                <div className="flex items-center justify-between">
                  <div className="text-xl text-amber-400">${item.price}</div>
                  
                  {/* --- REPLACED BUTTON WITH SHOPBUTTON COMPONENT --- */}
                  <ShopButton
  item={item}
  onPurchase={handlePurchase}
  disabled={isDisabled}
  className={`
    px-4 py-2 rounded-lg text-sm flex items-center gap-2
    ${!isDisabled
      ? 'bg-amber-600 hover:bg-amber-700 text-white' // The Orange Button
      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
    }
  `}
>
  <ShoppingCart className="w-4 h-4" />
  {purchased && isPermanent ? 'Owned' : 'Buy'}
</ShopButton>

                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* OWNED PERMANENT ITEMS */}
      {/* ============================================================ */}
      {player.permanentBuffs && player.permanentBuffs.length > 0 && (
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
            {player.permanentBuffs
              .map((buff, index) => {
                const shopItem = SHOP_ITEMS.find(i => i.id === buff.itemId);
                return (
                  <div
                    key={`${buff.itemId}-${index}`}
                    className="bg-green-900/30 border border-green-600 px-4 py-2 rounded-lg text-green-300 text-sm"
                  >
                    {shopItem ? shopItem.icon : ''} {shopItem ? shopItem.name : buff.name}
                  </div>
                );
              })
            }
          </div>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* GLOBAL SNACKBAR NOTIFICATION */}
      {/* ============================================================ */}
      <Snackbar 
        isOpen={isActive} 
        message={message} 
      />
      
    </div>
  );
}
