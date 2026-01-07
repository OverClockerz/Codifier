import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Coffee, DollarSign, Award, AlertTriangle, TrendingUp } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { Notification, NotificationType } from '../../types/game';
import { useEffect } from 'react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'quest':
      return <Award className="w-5 h-5 text-blue-400" />;
    case 'salary':
      return <DollarSign className="w-5 h-5 text-green-400" />;
    case 'bonus':
      return <TrendingUp className="w-5 h-5 text-purple-400" />;
    case 'buff':
      return <Coffee className="w-5 h-5 text-orange-400" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    case 'achievement':
      return <Award className="w-5 h-5 text-yellow-400" />;
    default:
      return <Bell className="w-5 h-5 text-gray-400" />;
  }
};

const getNotificationBg = (type: NotificationType, isRead: boolean) => {
  if (isRead) {
    return 'bg-gray-800/30';
  }
  
  switch (type) {
    case 'quest':
      return 'bg-blue-900/10';
    case 'salary':
      return 'bg-green-900/10';
    case 'bonus':
      return 'bg-purple-900/10';
    case 'buff':
      return 'bg-orange-900/10';
    case 'warning':
      return 'bg-yellow-900/10';
    case 'achievement':
      return 'bg-yellow-900/10';
    default:
      return 'bg-gray-800/30';
  }
};

const getTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const { notifications, markNotificationAsRead, clearAllNotifications, getUnreadCount } = useGame();
  
  const unreadCount = getUnreadCount();

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Mark all visible notifications as read when modal opens
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => {
        notifications.forEach(n => {
          if (!n.isRead) {
            markNotificationAsRead(n.id);
          }
        });
      }, 1000); // Delay to show unread indicator first
      
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-md bg-[#1d293d] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-125 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-16 text-center">
                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No notifications yet</p>
                <p className="text-sm text-gray-600 mt-1">You'll be notified about important updates</p>
              </div>
            ) : (
              <div className="py-2">
                {notifications
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`px-6 py-4 border-b border-gray-700/50 cursor-pointer hover:bg-gray-700/30 transition-colors ${getNotificationBg(
                        notification.type,
                        notification.isRead
                      )}`}
                    >
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm text-white">{notification.title}</h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {getTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {notification.message}
                          </p>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.isRead && (
                          <div className="mt-1.5">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-700 bg-gray-800/50">
              <button
                onClick={() => {
                  clearAllNotifications();
                  onClose();
                }}
                className="w-full px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-all text-sm"
              >
                Clear All
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}