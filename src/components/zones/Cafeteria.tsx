import { useGame } from '../../contexts/GameContext';
import { SHOP_ITEMS } from '../../data/shopItems';
import { ShopItem } from '../../types/game';
import { Coffee, ShoppingCart, Check } from 'lucide-react';

export function Cafeteria() {
  const { player, purchaseItem, inventory } = useGame();

  const isPurchased = (itemId: string) => {
    return inventory.some(item => item.item.id === itemId);
  };

  const canAfford = (price: number) => {
    return player.currency >= price;
  };

  const getItemIcon = (item: ShopItem) => {
    return item.icon;
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Coffee className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl text-white">Cafeteria - Shop</h2>
        </div>
        <p className="text-slate-400 mb-6">
          Purchase boosters and buffs to enhance your performance. Permanent items provide lasting benefits, 
          while consumables give immediate effects.
        </p>

        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-300 mb-1">Your Budget</div>
              <div className="text-2xl text-white">${player.currency}</div>
            </div>
            <div className="text-sm text-blue-200">
              💡 Salary paid at end of month
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOP_ITEMS.map(item => {
            const purchased = isPurchased(item.id);
            const affordable = canAfford(item.price);
            const isPermanent = item.type === 'permanent-buff';

            return (
              <div
                key={item.id}
                className={`
                  bg-slate-900/50 border rounded-lg p-5 transition-all group relative
                  ${purchased && isPermanent
                    ? 'border-green-600 bg-green-900/10' 
                    : affordable 
                    ? 'border-slate-600 hover:border-amber-500' 
                    : 'border-slate-700 opacity-60'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{getItemIcon(item)}</div>
                  {purchased && isPermanent && (
                    <div className="flex items-center gap-1 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      <Check className="w-3 h-3" />
                      Owned
                    </div>
                  )}
                  {isPermanent && !purchased && (
                    <div className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                      Permanent
                    </div>
                  )}
                </div>

                <h3 className="text-white mb-2">{item.name}</h3>
                <p className="text-sm text-slate-400 mb-4 min-h-[40px]">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-xl text-amber-400">${item.price}</div>
                  <button
                    onClick={() => purchaseItem(item.id)}
                    disabled={!affordable || (purchased && isPermanent)}
                    className={`
                      px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2
                      ${affordable && !(purchased && isPermanent)
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      }
                    `}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {purchased && isPermanent ? 'Owned' : 'Buy'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {inventory.filter(item => item.item.type === 'permanent-buff').length > 0 && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-xl text-white mb-4">Your Permanent Items</h3>
          <div className="flex flex-wrap gap-3">
            {inventory.filter(item => item.item.type === 'permanent-buff').map((invItem, index) => (
              <div
                key={`${invItem.item.id}-${index}`}
                className="bg-green-900/20 border border-green-700 px-4 py-2 rounded-lg text-green-300 text-sm"
              >
                {invItem.item.icon} {invItem.item.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}