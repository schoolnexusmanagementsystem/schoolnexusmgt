import express from 'express';
import db from '../database/init.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all users in school
router.get('/', async (req, res) => {
  try {
    const users = await db.getUsersBySchool(req.tenantId);
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await db.findById('users', req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user
router.put('/:id', requireRole(['super-admin', 'school-admin']), async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const user = await db.update('users', req.params.id, updateData);
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', requireRole(['super-admin', 'school-admin']), async (req, res) => {
  try {
    await db.delete('users', req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;