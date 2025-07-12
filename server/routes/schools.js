import express from 'express';
import db from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all schools (super admin only)
router.get('/', requireRole(['super-admin']), async (req, res) => {
  try {
    const schools = await db.find('schools');
    res.json({ schools });
  } catch (error) {
    console.error('Get schools error:', error);
    res.status(500).json({ error: 'Failed to get schools' });
  }
});

// Get school by ID
router.get('/:id', async (req, res) => {
  try {
    const school = await db.findById('schools', req.params.id);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }
    res.json({ school });
  } catch (error) {
    console.error('Get school error:', error);
    res.status(500).json({ error: 'Failed to get school' });
  }
});

// Create new school (super admin only)
router.post('/', requireRole(['super-admin']), async (req, res) => {
  try {
    const { name, address, phone, email, website, subscriptionPlan } = req.body;

    if (!name || !address || !phone || !email) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const schoolData = {
      name,
      address,
      phone,
      email,
      website: website || '',
      subscriptionPlan: subscriptionPlan || 'basic',
      subscriptionStatus: 'active',
      maxStudents: subscriptionPlan === 'premium' ? 2000 : 800,
      maxTeachers: subscriptionPlan === 'premium' ? 150 : 60
    };

    const school = await db.create('schools', schoolData);
    res.status(201).json({ school, message: 'School created successfully' });
  } catch (error) {
    console.error('Create school error:', error);
    res.status(500).json({ error: 'Failed to create school' });
  }
});

// Update school
router.put('/:id', requireRole(['super-admin', 'school-admin']), async (req, res) => {
  try {
    const { name, address, phone, email, website, subscriptionPlan } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (website) updateData.website = website;
    if (subscriptionPlan) updateData.subscriptionPlan = subscriptionPlan;

    const school = await db.update('schools', req.params.id, updateData);
    res.json({ school, message: 'School updated successfully' });
  } catch (error) {
    console.error('Update school error:', error);
    res.status(500).json({ error: 'Failed to update school' });
  }
});

// Get school statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const stats = await db.getSchoolStats(req.params.id);
    res.json({ stats });
  } catch (error) {
    console.error('Get school stats error:', error);
    res.status(500).json({ error: 'Failed to get school statistics' });
  }
});

// Get school users
router.get('/:id/users', async (req, res) => {
  try {
    const users = await db.getUsersBySchool(req.params.id);
    res.json({ users });
  } catch (error) {
    console.error('Get school users error:', error);
    res.status(500).json({ error: 'Failed to get school users' });
  }
});

// Update subscription status
router.put('/:id/subscription', requireRole(['super-admin']), async (req, res) => {
  try {
    const { subscriptionStatus, subscriptionPlan } = req.body;
    const updateData = {};

    if (subscriptionStatus) updateData.subscriptionStatus = subscriptionStatus;
    if (subscriptionPlan) updateData.subscriptionPlan = subscriptionPlan;

    const school = await db.update('schools', req.params.id, updateData);
    res.json({ school, message: 'Subscription updated successfully' });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

export default router;