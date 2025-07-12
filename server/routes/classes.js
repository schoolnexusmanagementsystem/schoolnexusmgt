import express from 'express';
import db from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all classes in school
router.get('/', async (req, res) => {
  try {
    const classes = await db.find('classes', { schoolId: req.tenantId });
    res.json({ classes });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ error: 'Failed to get classes' });
  }
});

// Get class by ID
router.get('/:id', async (req, res) => {
  try {
    const classData = await db.findById('classes', req.params.id);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json({ class: classData });
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ error: 'Failed to get class' });
  }
});

// Create class
router.post('/', requireRole(['school-admin']), async (req, res) => {
  try {
    const classData = {
      ...req.body,
      schoolId: req.tenantId
    };
    const newClass = await db.create('classes', classData);
    res.status(201).json({ class: newClass, message: 'Class created successfully' });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ error: 'Failed to create class' });
  }
});

// Update class
router.put('/:id', requireRole(['school-admin']), async (req, res) => {
  try {
    const classData = await db.update('classes', req.params.id, req.body);
    res.json({ class: classData, message: 'Class updated successfully' });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ error: 'Failed to update class' });
  }
});

// Delete class
router.delete('/:id', requireRole(['school-admin']), async (req, res) => {
  try {
    await db.delete('classes', req.params.id);
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ error: 'Failed to delete class' });
  }
});

export default router;