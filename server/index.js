import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import schoolRoutes from './routes/schools.js';
import userRoutes from './routes/users.js';
import studentRoutes from './routes/students.js';
import teacherRoutes from './routes/teachers.js';
import classRoutes from './routes/classes.js';
import attendanceRoutes from './routes/attendance.js';
import assignmentRoutes from './routes/assignments.js';
import reportRoutes from './routes/reports.js';
import documentRoutes from './routes/documents.js';
import billingRoutes from './routes/billing.js';
import aiRoutes from './routes/ai.js';
import notificationRoutes from './routes/notifications.js';
import chatRoutes from './routes/chat.js';

// Import middleware
import { authenticateToken } from './middleware/auth.js';
import { tenantMiddleware } from './middleware/tenant.js';

// Import database
import { initDatabase } from './database/init.js';

// Import AI service
import { initAIService } from './services/ai.js';

// Import notification service
import { initNotificationService } from './services/notifications.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', authenticateToken, tenantMiddleware, schoolRoutes);
app.use('/api/users', authenticateToken, tenantMiddleware, userRoutes);
app.use('/api/students', authenticateToken, tenantMiddleware, studentRoutes);
app.use('/api/teachers', authenticateToken, tenantMiddleware, teacherRoutes);
app.use('/api/classes', authenticateToken, tenantMiddleware, classRoutes);
app.use('/api/attendance', authenticateToken, tenantMiddleware, attendanceRoutes);
app.use('/api/assignments', authenticateToken, tenantMiddleware, assignmentRoutes);
app.use('/api/reports', authenticateToken, tenantMiddleware, reportRoutes);
app.use('/api/documents', authenticateToken, tenantMiddleware, documentRoutes);
app.use('/api/billing', authenticateToken, billingRoutes);
app.use('/api/ai', authenticateToken, tenantMiddleware, aiRoutes);
app.use('/api/notifications', authenticateToken, tenantMiddleware, notificationRoutes);
app.use('/api/chat', authenticateToken, tenantMiddleware, chatRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join school-specific room
  socket.on('join-school', (schoolId) => {
    socket.join(`school-${schoolId}`);
    console.log(`User ${socket.id} joined school ${schoolId}`);
  });

  // Join user-specific room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${socket.id} joined user room ${userId}`);
  });

  // Handle chat messages
  socket.on('chat-message', (data) => {
    // Broadcast to school room
    socket.to(`school-${data.schoolId}`).emit('new-message', data);
  });

  // Handle notifications
  socket.on('notification', (data) => {
    socket.to(`user-${data.userId}`).emit('new-notification', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize services
const initializeApp = async () => {
  try {
    // Initialize database
    await initDatabase();
    console.log('✅ Database initialized');

    // Initialize AI service
    await initAIService();
    console.log('✅ AI service initialized');

    // Initialize notification service
    await initNotificationService();
    console.log('✅ Notification service initialized');

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`🚀 School Nexus Server running on port ${PORT}`);
      console.log(`📱 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    process.exit(1);
  }
};

initializeApp();

export { io };