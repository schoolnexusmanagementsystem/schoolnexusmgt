import express from 'express';
import { generateAIResponse, generateDocument } from '../services/ai.js';
import db from '../database/init.js';

const router = express.Router();

// AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    const { user } = req;
    const schoolId = req.tenantId;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Generate AI response
    const response = await generateAIResponse(message, user, schoolId);

    // Save chat message to database
    const chatMessage = await db.create('chatMessages', {
      userId: user.id,
      schoolId,
      message,
      response,
      timestamp: new Date()
    });

    res.json({
      response,
      messageId: chatMessage.id,
      timestamp: chatMessage.timestamp
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Generate document endpoint
router.post('/generate-document', async (req, res) => {
  try {
    const { type, data } = req.body;
    const { user } = req;
    const schoolId = req.tenantId;

    if (!type || !data) {
      return res.status(400).json({ error: 'Document type and data are required' });
    }

    // Validate document type
    const validTypes = ['id-card', 'report-card', 'certificate', 'admission-letter'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    // Generate document
    const document = await generateDocument(type, data, user, schoolId);

    // Save document to database
    const savedDocument = await db.create('documents', {
      userId: user.id,
      schoolId,
      type,
      data,
      filename: document.filename,
      createdAt: new Date()
    });

    res.json({
      document: {
        id: savedDocument.id,
        type,
        filename: document.filename,
        content: document.content,
        downloadUrl: `/api/documents/download/${savedDocument.id}`
      },
      message: 'Document generated successfully'
    });
  } catch (error) {
    console.error('Document generation error:', error);
    res.status(500).json({ error: 'Failed to generate document' });
  }
});

// Get chat history
router.get('/chat-history', async (req, res) => {
  try {
    const { user } = req;
    const schoolId = req.tenantId;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await db.find('chatMessages', { 
      userId: user.id,
      schoolId 
    });

    // Sort by timestamp and limit results
    const sortedMessages = messages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    res.json({
      messages: sortedMessages.reverse() // Return in chronological order
    });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

// Clear chat history
router.delete('/chat-history', async (req, res) => {
  try {
    const { user } = req;
    const schoolId = req.tenantId;

    const messages = await db.find('chatMessages', { 
      userId: user.id,
      schoolId 
    });

    // Delete all messages for this user in this school
    for (const message of messages) {
      await db.delete('chatMessages', message.id);
    }

    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
});

// Get AI suggestions based on user role
router.get('/suggestions', async (req, res) => {
  try {
    const { user } = req;
    const role = user.role;

    const suggestions = {
      'super-admin': [
        'Show me system-wide attendance statistics',
        'Generate a revenue report for all schools',
        'List all schools with expiring subscriptions',
        'Show platform usage metrics'
      ],
      'school-admin': [
        'Show today\'s attendance summary',
        'Generate monthly student performance report',
        'List teachers with upcoming evaluations',
        'Show enrollment trends for this month'
      ],
      'teacher': [
        'Show my class attendance for today',
        'List pending assignments to grade',
        'Generate student performance report',
        'Show upcoming parent-teacher meetings'
      ],
      'student': [
        'Show my upcoming assignments',
        'Check my current grades',
        'Show my class schedule for tomorrow',
        'Generate my attendance report'
      ],
      'parent': [
        'Show my child\'s recent grades',
        'Check upcoming parent-teacher meetings',
        'Show my child\'s attendance record',
        'Generate progress report for my child'
      ]
    };

    res.json({
      suggestions: suggestions[role] || suggestions.student
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

// Voice input processing (mock endpoint)
router.post('/voice', async (req, res) => {
  try {
    const { audioData } = req.body;
    const { user } = req;
    const schoolId = req.tenantId;

    // In a real app, this would use Whisper API or browser STT
    // For now, we'll return a mock response
    const mockTranscription = "Show me today's attendance";
    
    // Generate AI response based on transcribed text
    const response = await generateAIResponse(mockTranscription, user, schoolId);

    res.json({
      transcription: mockTranscription,
      response,
      message: 'Voice input processed successfully'
    });
  } catch (error) {
    console.error('Voice processing error:', error);
    res.status(500).json({ error: 'Failed to process voice input' });
  }
});

export default router;