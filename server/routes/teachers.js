import express from 'express';
import db from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all teachers in school
router.get('/', async (req, res) => {
  try {
    const teachers = await db.find('teachers', { schoolId: req.tenantId });
    res.json({ teachers });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: 'Failed to get teachers' });
  }
});

// Get teacher by ID
router.get('/:id', async (req, res) => {
  try {
    const teacher = await db.findById('teachers', req.params.id);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json({ teacher });
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ error: 'Failed to get teacher' });
  }
});

// Create teacher
router.post('/', requireRole(['school-admin']), async (req, res) => {
  try {
    const teacherData = {
      ...req.body,
      schoolId: req.tenantId
    };
    const teacher = await db.create('teachers', teacherData);
    res.status(201).json({ teacher, message: 'Teacher created successfully' });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

// Update teacher
router.put('/:id', requireRole(['school-admin']), async (req, res) => {
  try {
    const teacher = await db.update('teachers', req.params.id, req.body);
    res.json({ teacher, message: 'Teacher updated successfully' });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

// Delete teacher
router.delete('/:id', requireRole(['school-admin']), async (req, res) => {
  try {
    await db.delete('teachers', req.params.id);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

export default router;