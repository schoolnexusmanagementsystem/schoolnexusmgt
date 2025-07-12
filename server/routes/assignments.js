import express from 'express';
import db from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get assignments for a class
router.get('/class/:classId', async (req, res) => {
  try {
    const { classId } = req.params;
    const assignments = await db.getAssignmentsByClass(classId);
    res.json({ assignments });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to get assignments' });
  }
});

// Get assignments for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const assignments = await db.getAssignmentsByStudent(studentId);
    res.json({ assignments });
  } catch (error) {
    console.error('Get student assignments error:', error);
    res.status(500).json({ error: 'Failed to get student assignments' });
  }
});

// Create assignment
router.post('/', requireRole(['teacher', 'school-admin']), async (req, res) => {
  try {
    const assignmentData = {
      ...req.body,
      schoolId: req.tenantId
    };
    const assignment = await db.create('assignments', assignmentData);
    res.status(201).json({ assignment, message: 'Assignment created successfully' });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Update assignment
router.put('/:id', requireRole(['teacher', 'school-admin']), async (req, res) => {
  try {
    const assignment = await db.update('assignments', req.params.id, req.body);
    res.json({ assignment, message: 'Assignment updated successfully' });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// Delete assignment
router.delete('/:id', requireRole(['teacher', 'school-admin']), async (req, res) => {
  try {
    await db.delete('assignments', req.params.id);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

export default router;