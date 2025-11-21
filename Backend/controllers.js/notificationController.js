const Notification = require('../models/Notification');

const createNotification = async (userId, type, title, message, data = {}) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      data
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

const getNotifications = async (req, res) => {
  try {
    console.log('🔔 [Backend] Get notifications request');
    console.log('🔔 [Backend] User:', req.user ? req.user.id : 'No user');
    
    if (!req.user || !req.user.id) {
      console.error('🔔 [Backend] No user ID found');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { page = 1, limit = 20 } = req.query;
    
    const notifications = await Notification.find({ userId: req.user.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({ 
      userId: req.user.id, 
      read: false 
    });

    console.log('🔔 [Backend] Found notifications:', notifications.length);
    console.log('🔔 [Backend] Unread count:', unreadCount);

    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('🔔 [Backend] Error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notification', error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notifications', error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete notification', error: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
