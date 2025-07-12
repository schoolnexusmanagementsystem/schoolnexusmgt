import express from 'express';
import db from '../database/init.js';
import { createNotification, markNotificationAsRead, getUnreadNotifications } from '../services/notifications.js';

const router = express.Router();

// Get notifications for user
router.get('/', async (req, res) => {
  try {
    const notifications = await db.find('notifications', { 
      userId: req.user.id,
      schoolId: req.tenantId 
    });
    
    // Sort by creation date (newest first)
    const sortedNotifications = notifications.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json({ notifications: sortedNotifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// Get unread notifications count
router.get('/unread/count', async (req, res) => {
  try {
    const unreadNotifications = await getUnreadNotifications(req.user.id);
    res.json({ count: unreadNotifications.length });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await markNotificationAsRead(req.params.id, req.user.id);
    res.json({ notification, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    const notifications = await db.find('notifications', { 
      userId: req.user.id,
      schoolId: req.tenantId,
      isRead: false
    });
    
    for (const notification of notifications) {
      await markNotificationAsRead(notification.id, req.user.id);
    }
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    await db.delete('notifications', req.params.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;