import express from 'express';
import db from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get billing information for school
router.get('/school/:schoolId', requireRole(['super-admin', 'school-admin']), async (req, res) => {
  try {
    const school = await db.findById('schools', req.params.schoolId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }
    
    const billing = {
      schoolId: school.id,
      subscriptionPlan: school.subscriptionPlan,
      subscriptionStatus: school.subscriptionStatus,
      monthlyFee: school.subscriptionPlan === 'premium' ? 99 : 49,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      usage: {
        students: 1247,
        teachers: 89,
        storage: '2.3 GB'
      }
    };
    
    res.json({ billing });
  } catch (error) {
    console.error('Get billing error:', error);
    res.status(500).json({ error: 'Failed to get billing information' });
  }
});

// Update subscription plan
router.put('/school/:schoolId/subscription', requireRole(['super-admin']), async (req, res) => {
  try {
    const { subscriptionPlan, subscriptionStatus } = req.body;
    const updateData = {};
    
    if (subscriptionPlan) updateData.subscriptionPlan = subscriptionPlan;
    if (subscriptionStatus) updateData.subscriptionStatus = subscriptionStatus;
    
    const school = await db.update('schools', req.params.schoolId, updateData);
    res.json({ school, message: 'Subscription updated successfully' });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

export default router;