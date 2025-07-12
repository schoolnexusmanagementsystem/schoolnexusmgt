import express from 'express';
import db from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get documents for user
router.get('/', async (req, res) => {
  try {
    const documents = await db.find('documents', { 
      userId: req.user.id,
      schoolId: req.tenantId 
    });
    res.json({ documents });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Failed to get documents' });
  }
});

// Get document by ID
router.get('/:id', async (req, res) => {
  try {
    const document = await db.findById('documents', req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ document });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Failed to get document' });
  }
});

// Download document
router.get('/download/:id', async (req, res) => {
  try {
    const document = await db.findById('documents', req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // In a real app, this would serve the actual PDF file
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${document.filename}"`);
    res.send('Mock PDF content');
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
});

// Delete document
router.delete('/:id', async (req, res) => {
  try {
    await db.delete('documents', req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;