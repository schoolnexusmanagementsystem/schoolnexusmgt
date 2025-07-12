import db from '../database/init.js';
import { io } from '../index.js';

export const initNotificationService = async () => {
  console.log('✅ Notification service initialized');
};

export const createNotification = async (data) => {
  try {
    const notification = await db.create('notifications', {
      ...data,
      isRead: false,
      createdAt: new Date()
    });

    // Send real-time notification via Socket.IO
    if (data.userId) {
      io.to(`user-${data.userId}`).emit('new-notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

export const sendSchoolNotification = async (schoolId, notificationData) => {
  try {
    const users = await db.getUsersBySchool(schoolId);
    
    const notifications = [];
    for (const user of users) {
      const notification = await createNotification({
        ...notificationData,
        schoolId,
        userId: user.id
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('Send school notification error:', error);
    throw error;
  }
};

export const sendRoleNotification = async (schoolId, role, notificationData) => {
  try {
    const users = await db.getUsersBySchool(schoolId);
    const roleUsers = users.filter(user => user.role === role);
    
    const notifications = [];
    for (const user of roleUsers) {
      const notification = await createNotification({
        ...notificationData,
        schoolId,
        userId: user.id
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('Send role notification error:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const notification = await db.findById('notifications', notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found or access denied');
    }

    const updatedNotification = await db.update('notifications', notificationId, {
      isRead: true,
      readAt: new Date()
    });

    return updatedNotification;
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
};

export const getUnreadNotifications = async (userId) => {
  try {
    const notifications = await db.find('notifications', {
      userId,
      isRead: false
    });

    return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Get unread notifications error:', error);
    throw error;
  }
};

// Notification templates
export const notificationTemplates = {
  newAssignment: (assignment) => ({
    title: 'New Assignment Posted',
    message: `A new assignment "${assignment.title}" has been posted in ${assignment.className}`,
    type: 'assignment',
    priority: 'medium'
  }),

  assignmentDue: (assignment) => ({
    title: 'Assignment Due Soon',
    message: `Assignment "${assignment.title}" is due in ${assignment.dueIn}`,
    type: 'reminder',
    priority: 'high'
  }),

  gradePosted: (grade) => ({
    title: 'Grade Posted',
    message: `Your grade for ${grade.assignment} has been posted: ${grade.score}/${grade.maxScore}`,
    type: 'grade',
    priority: 'medium'
  }),

  attendanceAlert: (attendance) => ({
    title: 'Attendance Alert',
    message: `Your attendance is currently at ${attendance.percentage}%. Please improve attendance.`,
    type: 'alert',
    priority: 'high'
  }),

  parentMeeting: (meeting) => ({
    title: 'Parent-Teacher Meeting',
    message: `Parent-teacher meeting scheduled for ${meeting.date} at ${meeting.time}`,
    type: 'meeting',
    priority: 'medium'
  }),

  schoolAnnouncement: (announcement) => ({
    title: 'School Announcement',
    message: announcement.message,
    type: 'announcement',
    priority: 'medium'
  }),

  subscriptionExpiring: (school) => ({
    title: 'Subscription Expiring',
    message: `Your subscription will expire on ${school.expiryDate}. Please renew to continue using School Nexus.`,
    type: 'billing',
    priority: 'high'
  }),

  newStudent: (student) => ({
    title: 'New Student Enrolled',
    message: `${student.name} has been enrolled in Grade ${student.grade}`,
    type: 'enrollment',
    priority: 'low'
  }),

  newTeacher: (teacher) => ({
    title: 'New Teacher Joined',
    message: `${teacher.name} has joined the ${teacher.department} department`,
    type: 'staff',
    priority: 'low'
  })
};

// Helper function to send notifications based on events
export const sendEventNotification = async (event, data, schoolId) => {
  try {
    const template = notificationTemplates[event];
    if (!template) {
      console.warn(`No notification template found for event: ${event}`);
      return;
    }

    const notificationData = template(data);
    
    // Determine target users based on event type
    switch (event) {
      case 'newAssignment':
        // Send to students in the class
        await sendRoleNotification(schoolId, 'student', notificationData);
        break;
      
      case 'gradePosted':
        // Send to specific student
        if (data.studentId) {
          await createNotification({
            ...notificationData,
            schoolId,
            userId: data.studentId
          });
        }
        break;
      
      case 'attendanceAlert':
        // Send to specific student
        if (data.studentId) {
          await createNotification({
            ...notificationData,
            schoolId,
            userId: data.studentId
          });
        }
        break;
      
      case 'parentMeeting':
        // Send to parents
        await sendRoleNotification(schoolId, 'parent', notificationData);
        break;
      
      case 'schoolAnnouncement':
        // Send to all users in school
        await sendSchoolNotification(schoolId, notificationData);
        break;
      
      case 'subscriptionExpiring':
        // Send to school admin
        await sendRoleNotification(schoolId, 'school-admin', notificationData);
        break;
      
      case 'newStudent':
      case 'newTeacher':
        // Send to school admin
        await sendRoleNotification(schoolId, 'school-admin', notificationData);
        break;
      
      default:
        console.warn(`Unknown event type: ${event}`);
    }
  } catch (error) {
    console.error('Send event notification error:', error);
  }
};