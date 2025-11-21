import { X, Check, Trash2, Package, Plane, Sparkles, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
    // Auto-refresh notifications every 10 seconds when panel is open
    let interval;
    if (isOpen) {
      interval = setInterval(fetchNotifications, 10000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      console.log('🔔 Fetching notifications...');
      const token = localStorage.getItem('token');
      console.log('🔔 Token exists:', !!token);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      console.log('🔔 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('🔔 Failed to fetch notifications:', response.status, errorData);
        return;
      }
      
      const data = await response.json();
      console.log('🔔 Notifications received:', data.notifications?.length || 0);
      console.log('🔔 Unread count:', data.unreadCount);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('🔔 Failed to fetch notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'cloth_added':
        return <ShoppingBag className="text-green-500" size={20} />;
      case 'cloth_removed':
        return <Package className="text-red-500" size={20} />;
      case 'trip_planned':
        return <Plane className="text-blue-500" size={20} />;
      case 'outfit_suggested':
        return <Sparkles className="text-purple-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = Math.floor((now - notifDate) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-[101] transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600 flex-shrink-0">
            <div>
              <h2 className="text-lg font-bold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-xs text-white/80">{unreadCount} unread</p>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-all">
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Mark all as read */}
          {unreadCount > 0 && (
            <div className="p-3 border-b bg-gray-50 flex-shrink-0">
              <button
                onClick={markAllAsRead}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
              >
                <Check size={16} />
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Package size={48} className="mb-2" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-4 hover:bg-gray-50 transition-all ${
                      !notif.read ? 'bg-indigo-50/50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">
                              {notif.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatTime(notif.createdAt)}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {!notif.read && (
                              <button
                                onClick={() => markAsRead(notif._id)}
                                className="p-1.5 hover:bg-green-100 rounded-lg transition-all"
                                title="Mark as read"
                              >
                                <Check size={14} className="text-green-600" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notif._id)}
                              className="p-1.5 hover:bg-red-100 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={14} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
