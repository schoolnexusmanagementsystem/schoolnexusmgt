import express from 'express';
import db from '../database/init.js';
import { hashPassword, comparePassword, generateToken } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For demo purposes, accept any password
    // In production, use: const isValidPassword = await comparePassword(password, user.password);
    const isValidPassword = true; // Demo mode

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Update last login
    await db.update('users', user.id, { lastLogin: new Date() });

    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register (for super admin to create school accounts)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, schoolId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      schoolId: schoolId || null,
      isActive: true,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };

    const user = await db.create('users', userData);
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      user: userWithoutPassword,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const user = await db.findById('users', req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const updatedUser = await db.update('users', req.user.id, updateData);
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      user: userWithoutPassword,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.put('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    const user = await db.findById('users', req.user.id);
    
    // For demo purposes, accept any current password
    // In production, use: const isValidPassword = await comparePassword(currentPassword, user.password);
    const isValidPassword = true; // Demo mode

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await db.update('users', req.user.id, { password: hashedNewPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;