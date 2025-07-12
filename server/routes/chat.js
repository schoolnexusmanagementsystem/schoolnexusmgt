import express from 'express';
import db from '../database/init.js';

const router = express.Router();

// Get chat history for user
router.get('/history', async (req, res) => {
  try {
    const messages = await db.find('chatMessages', { 
      userId: req.user.id,
      schoolId: req.tenantId 
    });
    
    // Sort by timestamp (oldest first)
    const sortedMessages = messages.sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    res.json({ messages: sortedMessages });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

// Clear chat history
router.delete('/history', async (req, res) => {
  try {
    const messages = await db.find('chatMessages', { 
      userId: req.user.id,
      schoolId: req.tenantId 
    });
    
    for (const message of messages) {
      await db.delete('chatMessages', message.id);
    }
    
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

export default router;