# School Nexus - AI-Powered School Management System

A production-ready, full-stack SaaS School Management System with multi-tenant architecture, AI-powered dashboards, and role-based interfaces.

## 🚀 Features

### Core Platform Features
- **Multi-Tenant SaaS Architecture**: Unique tenant IDs for each school with data isolation
- **Super Admin Dashboard**: Full control over schools, subscriptions, and system-wide metrics
- **Role-Based Access Control**: Super Admin, School Admin, Teachers, Students, Parents, Visitors
- **Dynamic Dashboard Interface**: Role-specific statistics, quick actions, and recent activities

### AI-Powered Features
- **AI Chat Assistant**: GPT-4 powered chat with school-specific context
- **Voice Input Support**: Speech-to-text functionality using browser APIs
- **Document Generation**: AI-powered generation of ID cards, report cards, certificates, and admission letters
- **Smart Suggestions**: Role-based AI suggestions for common queries

### Communication & Notifications
- **Real-time Notifications**: Socket.IO powered real-time notifications
- **Push Notifications**: PWA support with push notification capabilities
- **Chat System**: School-specific chat functionality
- **Telegram/WhatsApp Integration**: Bot integration for external platforms

### Document Management
- **Dynamic Document Generation**: Template-based document creation
- **PDF Export**: Download and preview capabilities
- **Document Templates**: ID cards, report cards, certificates, admission letters

### PWA Features
- **Installable App**: Works on desktop and mobile
- **Offline Support**: Service worker caching
- **Push Notifications**: Native notification support
- **Responsive Design**: Mobile-first approach

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching
- **Socket.IO Client** for real-time features

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **bcryptjs** for password hashing
- **OpenAI API** for AI features
- **Multer** for file uploads

### Database
- **In-memory storage** (development)
- **PostgreSQL** ready (production)
- **Multi-tenant architecture** with data isolation

### DevOps & Deployment
- **Docker** support
- **Environment-based configuration**
- **Health check endpoints**
- **Error handling middleware**

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd school-nexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start them separately
   npm run dev          # Frontend only
   npm run server       # Backend only
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api
   - Health Check: http://localhost:3001/api/health

## 🔐 Authentication

### Demo Credentials
The system comes with pre-configured demo users:

- **Super Admin**: `superadmin@schoolnexus.com` / `any-password`
- **School Admin**: `admin@example.com` / `any-password`
- **Teacher**: `sarah.johnson@riverside.edu` / `any-password`
- **Student**: `emma.wilson@student.riverside.edu` / `any-password`

*Note: In demo mode, any password is accepted. In production, proper password validation is implemented.*

## 🏗 Project Structure

```
school-nexus/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layout/         # Layout components
│   │   └── ui/            # UI components (shadcn/ui)
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities and API
│   └── pages/             # Page components
├── server/                # Backend source code
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── services/          # Business logic services
│   ├── database/          # Database layer
│   └── index.js           # Server entry point
├── public/                # Static assets
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
└── package.json           # Dependencies and scripts
```

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```env
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=your-production-jwt-secret
   OPENAI_API_KEY=your-openai-api-key
   DATABASE_URL=postgresql://user:pass@host:port/db
   ```

3. **Deploy to your preferred platform**
   - **Vercel**: Frontend deployment
   - **Railway**: Full-stack deployment
   - **Render**: Full-stack deployment
   - **Fly.io**: Full-stack deployment
   - **AWS/GCP/Azure**: Custom deployment

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t school-nexus .
   ```

2. **Run container**
   ```bash
   docker run -p 3001:3001 --env-file .env school-nexus
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `JWT_SECRET` | JWT signing secret | Required |
| `OPENAI_API_KEY` | OpenAI API key | Optional |
| `FRONTEND_URL` | Frontend URL | `http://localhost:5173` |

### Database Configuration

The application uses in-memory storage for development. For production:

1. Set up PostgreSQL database
2. Update `DATABASE_URL` in environment variables
3. Replace in-memory database with PostgreSQL adapter

## 📱 PWA Features

### Installation
- **Desktop**: Click install prompt or use browser menu
- **Mobile**: Add to home screen from browser menu

### Offline Support
- Service worker caches essential resources
- Works offline for basic functionality
- Syncs data when connection is restored

### Push Notifications
- Browser-based push notifications
- Real-time updates for new assignments, grades, etc.
- Customizable notification preferences

## 🤖 AI Features

### Chat Assistant
- School-specific AI context
- Role-based responses
- Document generation capabilities
- Voice input support

### Document Generation
- **ID Cards**: Student identification cards
- **Report Cards**: Academic performance reports
- **Certificates**: Achievement certificates
- **Admission Letters**: Enrollment confirmations

### Voice Input
- Browser-based speech recognition
- Real-time transcription
- Multi-language support (browser-dependent)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Schools
- `GET /api/schools` - List schools (Super Admin)
- `GET /api/schools/:id` - Get school details
- `POST /api/schools` - Create school (Super Admin)

### Users
- `GET /api/users` - List users in school
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user

### AI
- `POST /api/ai/chat` - Send chat message
- `POST /api/ai/generate-document` - Generate document
- `GET /api/ai/suggestions` - Get AI suggestions

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `GET /api/notifications/unread/count` - Get unread count

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Granular permissions
- **Multi-Tenant Isolation**: Data separation between schools
- **Input Validation**: Request validation and sanitization
- **CORS Protection**: Cross-origin request protection
- **Helmet Security**: Security headers

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
npm run test

# Backend tests
npm run test:server

# E2E tests
npm run test:e2e
```

### Test Coverage
```bash
npm run test:coverage
```

## 📊 Monitoring & Analytics

### Health Checks
- `GET /api/health` - Application health status
- Database connectivity checks
- External service status

### Logging
- Structured logging with timestamps
- Error tracking and reporting
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Discussions**: [GitHub Discussions](link-to-discussions)
- **Email**: support@schoolnexus.com

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for AI capabilities
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Vite](https://vitejs.dev) for build tooling

---

**School Nexus** - Empowering education with AI-driven management solutions.
