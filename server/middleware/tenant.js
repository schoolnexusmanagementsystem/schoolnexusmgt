import db from '../database/init.js';

export const tenantMiddleware = (req, res, next) => {
  // Super admin can access all data
  if (req.user.role === 'super-admin') {
    req.tenantId = req.query.schoolId || req.body.schoolId;
    return next();
  }

  // For other roles, use their school ID
  if (!req.user.schoolId) {
    return res.status(403).json({ error: 'No school assigned to user' });
  }

  req.tenantId = req.user.schoolId;
  next();
};

export const validateSchoolAccess = async (req, res, next) => {
  const { tenantId } = req;
  
  if (!tenantId) {
    return res.status(400).json({ error: 'School ID required' });
  }

  try {
    const school = await db.findById('schools', tenantId);
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    // Check if school subscription is active
    if (school.subscriptionStatus !== 'active') {
      return res.status(403).json({ error: 'School subscription is not active' });
    }

    req.school = school;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error validating school access' });
  }
};

export const scopedQuery = (req, res, next) => {
  // Add school ID to query filters for multi-tenant data isolation
  if (req.user.role !== 'super-admin') {
    req.query.schoolId = req.user.schoolId;
    if (req.body && !req.body.schoolId) {
      req.body.schoolId = req.user.schoolId;
    }
  }
  next();
};