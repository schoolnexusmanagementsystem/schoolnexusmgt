import express from 'express';
import db from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all students in school
router.get('/', async (req, res) => {
  try {
    const students = await db.find('students', { schoolId: req.tenantId });
    res.json({ students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to get students' });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await db.findById('students', req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ student });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to get student' });
  }
});

// Create student
router.post('/', requireRole(['school-admin']), async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      schoolId: req.tenantId
    };
    const student = await db.create('students', studentData);
    res.status(201).json({ student, message: 'Student created successfully' });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update student
router.put('/:id', requireRole(['school-admin']), async (req, res) => {
  try {
    const student = await db.update('students', req.params.id, req.body);
    res.json({ student, message: 'Student updated successfully' });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:id', requireRole(['school-admin']), async (req, res) => {
  try {
    await db.delete('students', req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

export default router;