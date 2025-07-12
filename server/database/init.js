// In-memory database for development
// In production, this would be replaced with PostgreSQL or similar

class Database {
  constructor() {
    this.schools = new Map();
    this.users = new Map();
    this.students = new Map();
    this.teachers = new Map();
    this.classes = new Map();
    this.attendance = new Map();
    this.assignments = new Map();
    this.submissions = new Map();
    this.reports = new Map();
    this.documents = new Map();
    this.notifications = new Map();
    this.chatMessages = new Map();
    this.billing = new Map();
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Sample Schools
    const schools = [
      {
        id: 'school-1',
        name: 'Riverside High School',
        address: '123 Riverside Drive, City, State 12345',
        phone: '+1-555-0123',
        email: 'admin@riverside.edu',
        website: 'https://riverside.edu',
        subscriptionPlan: 'premium',
        subscriptionStatus: 'active',
        maxStudents: 2000,
        maxTeachers: 150,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'school-2',
        name: 'Sunset Elementary',
        address: '456 Sunset Blvd, City, State 12345',
        phone: '+1-555-0456',
        email: 'admin@sunset.edu',
        website: 'https://sunset.edu',
        subscriptionPlan: 'basic',
        subscriptionStatus: 'active',
        maxStudents: 800,
        maxTeachers: 60,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date()
      }
    ];

    schools.forEach(school => {
      this.schools.set(school.id, school);
    });

    // Sample Users
    const users = [
      {
        id: 'user-1',
        schoolId: 'school-1',
        name: 'John Smith',
        email: 'admin@example.com',
        password: '$2b$10$hashedpassword', // In real app, this would be hashed
        role: 'school-admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'user-2',
        schoolId: 'school-1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@riverside.edu',
        password: '$2b$10$hashedpassword',
        role: 'teacher',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        id: 'user-3',
        schoolId: 'school-1',
        name: 'Emma Wilson',
        email: 'emma.wilson@student.riverside.edu',
        password: '$2b$10$hashedpassword',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date()
      },
      {
        id: 'user-4',
        schoolId: null,
        name: 'Super Admin',
        email: 'superadmin@schoolnexus.com',
        password: '$2b$10$hashedpassword',
        role: 'super-admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isActive: true,
        lastLogin: new Date(),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ];

    users.forEach(user => {
      this.users.set(user.id, user);
    });

    // Sample Students
    const students = [
      {
        id: 'student-1',
        userId: 'user-3',
        schoolId: 'school-1',
        studentId: 'RHS2024001',
        firstName: 'Emma',
        lastName: 'Wilson',
        grade: '10',
        section: 'A',
        dateOfBirth: '2008-05-15',
        gender: 'female',
        address: '789 Oak Street, City, State 12345',
        phone: '+1-555-0789',
        parentName: 'Michael Wilson',
        parentPhone: '+1-555-0790',
        parentEmail: 'michael.wilson@email.com',
        emergencyContact: 'Lisa Wilson',
        emergencyPhone: '+1-555-0791',
        enrollmentDate: '2024-01-20',
        isActive: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date()
      }
    ];

    students.forEach(student => {
      this.students.set(student.id, student);
    });

    // Sample Teachers
    const teachers = [
      {
        id: 'teacher-1',
        userId: 'user-2',
        schoolId: 'school-1',
        employeeId: 'RHS2024001',
        firstName: 'Sarah',
        lastName: 'Johnson',
        department: 'Mathematics',
        subjects: ['Algebra', 'Geometry', 'Calculus'],
        qualification: 'M.Sc. Mathematics',
        experience: 8,
        phone: '+1-555-0456',
        address: '321 Pine Street, City, State 12345',
        hireDate: '2024-01-15',
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      }
    ];

    teachers.forEach(teacher => {
      this.teachers.set(teacher.id, teacher);
    });

    // Sample Classes
    const classes = [
      {
        id: 'class-1',
        schoolId: 'school-1',
        name: 'Algebra I',
        grade: '10',
        section: 'A',
        teacherId: 'teacher-1',
        subject: 'Mathematics',
        schedule: [
          { day: 'monday', startTime: '09:00', endTime: '10:00' },
          { day: 'wednesday', startTime: '09:00', endTime: '10:00' },
          { day: 'friday', startTime: '09:00', endTime: '10:00' }
        ],
        room: 'Room 101',
        maxStudents: 30,
        currentStudents: 25,
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      }
    ];

    classes.forEach(cls => {
      this.classes.set(cls.id, cls);
    });

    // Sample Assignments
    const assignments = [
      {
        id: 'assignment-1',
        classId: 'class-1',
        schoolId: 'school-1',
        title: 'Algebra Chapter 1 Quiz',
        description: 'Complete problems 1-20 from Chapter 1',
        dueDate: new Date('2024-12-20'),
        maxScore: 100,
        type: 'quiz',
        isActive: true,
        createdAt: new Date('2024-12-10'),
        updatedAt: new Date()
      }
    ];

    assignments.forEach(assignment => {
      this.assignments.set(assignment.id, assignment);
    });

    // Sample Notifications
    const notifications = [
      {
        id: 'notification-1',
        schoolId: 'school-1',
        userId: 'user-1',
        title: 'New Assignment Posted',
        message: 'Algebra Chapter 1 Quiz has been posted',
        type: 'assignment',
        isRead: false,
        createdAt: new Date('2024-12-10T10:00:00'),
        updatedAt: new Date()
      }
    ];

    notifications.forEach(notification => {
      this.notifications.set(notification.id, notification);
    });
  }

  // Generic CRUD operations
  async create(collection, data) {
    const id = `${collection}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const item = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this[collection].set(id, item);
    return item;
  }

  async findById(collection, id) {
    return this[collection].get(id);
  }

  async find(collection, filter = {}) {
    const items = Array.from(this[collection].values());
    
    return items.filter(item => {
      return Object.keys(filter).every(key => {
        if (Array.isArray(filter[key])) {
          return filter[key].includes(item[key]);
        }
        return item[key] === filter[key];
      });
    });
  }

  async update(collection, id, data) {
    const item = this[collection].get(id);
    if (!item) {
      throw new Error(`${collection} with id ${id} not found`);
    }
    
    const updatedItem = {
      ...item,
      ...data,
      updatedAt: new Date()
    };
    
    this[collection].set(id, updatedItem);
    return updatedItem;
  }

  async delete(collection, id) {
    const item = this[collection].get(id);
    if (!item) {
      throw new Error(`${collection} with id ${id} not found`);
    }
    
    this[collection].delete(id);
    return item;
  }

  // School-specific operations
  async getSchoolStats(schoolId) {
    const students = await this.find('students', { schoolId });
    const teachers = await this.find('teachers', { schoolId });
    const classes = await this.find('classes', { schoolId });
    
    return {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalClasses: classes.length,
      activeStudents: students.filter(s => s.isActive).length,
      activeTeachers: teachers.filter(t => t.isActive).length
    };
  }

  // User-specific operations
  async getUserByEmail(email) {
    const users = await this.find('users', { email });
    return users[0] || null;
  }

  async getUsersBySchool(schoolId) {
    return await this.find('users', { schoolId });
  }

  // Attendance operations
  async markAttendance(schoolId, classId, date, attendanceData) {
    const attendanceId = `attendance-${classId}-${date}`;
    const attendance = {
      id: attendanceId,
      schoolId,
      classId,
      date,
      records: attendanceData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.attendance.set(attendanceId, attendance);
    return attendance;
  }

  async getAttendance(schoolId, classId, date) {
    const attendanceId = `attendance-${classId}-${date}`;
    return this.attendance.get(attendanceId);
  }

  // Assignment operations
  async getAssignmentsByClass(classId) {
    return await this.find('assignments', { classId });
  }

  async getAssignmentsByStudent(studentId) {
    // This would need to be implemented based on class enrollment
    return await this.find('assignments');
  }

  // Notification operations
  async createNotification(data) {
    return await this.create('notifications', data);
  }

  async getNotificationsByUser(userId) {
    return await this.find('notifications', { userId });
  }

  async markNotificationAsRead(notificationId) {
    return await this.update('notifications', notificationId, { isRead: true });
  }
}

// Create singleton instance
const db = new Database();

export const initDatabase = async () => {
  // In a real application, this would initialize the database connection
  console.log('Database initialized with sample data');
  return db;
};

export default db;