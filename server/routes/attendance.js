import express from 'express';
import db from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get attendance for a class on a specific date
router.get('/class/:classId/:date', async (req, res) => {
  try {
    const { classId, date } = req.params;
    const attendance = await db.getAttendance(req.tenantId, classId, date);
    res.json({ attendance });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Failed to get attendance' });
  }
});

// Mark attendance for a class
router.post('/class/:classId/:date', requireRole(['teacher', 'school-admin']), async (req, res) => {
  try {
    const { classId, date } = req.params;
    const { records } = req.body;
    
    const attendance = await db.markAttendance(req.tenantId, classId, date, records);
    res.json({ attendance, message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// Get student attendance summary
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    // This would need to be implemented based on class enrollment
    const attendance = await db.find('attendance', { schoolId: req.tenantId });
    res.json({ attendance });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({ error: 'Failed to get student attendance' });
  }
});

export default router;