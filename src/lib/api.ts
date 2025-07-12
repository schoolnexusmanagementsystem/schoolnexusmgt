const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('school-nexus-token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{
      user: any;
      token: string;
      message: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = response.token;
    localStorage.setItem('school-nexus-token', response.token);
    localStorage.setItem('school-nexus-user', JSON.stringify(response.user));

    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('school-nexus-token');
      localStorage.removeItem('school-nexus-user');
    }
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/auth/me');
  }

  // Schools
  async getSchools() {
    return this.request<{ schools: any[] }>('/schools');
  }

  async getSchool(id: string) {
    return this.request<{ school: any }>(`/schools/${id}`);
  }

  async getSchoolStats(id: string) {
    return this.request<{ stats: any }>(`/schools/${id}/stats`);
  }

  // Users
  async getUsers() {
    return this.request<{ users: any[] }>('/users');
  }

  async getUser(id: string) {
    return this.request<{ user: any }>(`/users/${id}`);
  }

  // Students
  async getStudents() {
    return this.request<{ students: any[] }>('/students');
  }

  async getStudent(id: string) {
    return this.request<{ student: any }>(`/students/${id}`);
  }

  async createStudent(data: any) {
    return this.request<{ student: any; message: string }>('/students', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Teachers
  async getTeachers() {
    return this.request<{ teachers: any[] }>('/teachers');
  }

  async getTeacher(id: string) {
    return this.request<{ teacher: any }>(`/teachers/${id}`);
  }

  async createTeacher(data: any) {
    return this.request<{ teacher: any; message: string }>('/teachers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Classes
  async getClasses() {
    return this.request<{ classes: any[] }>('/classes');
  }

  async getClass(id: string) {
    return this.request<{ class: any }>(`/classes/${id}`);
  }

  async createClass(data: any) {
    return this.request<{ class: any; message: string }>('/classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Attendance
  async getAttendance(classId: string, date: string) {
    return this.request<{ attendance: any }>(`/attendance/class/${classId}/${date}`);
  }

  async markAttendance(classId: string, date: string, records: any[]) {
    return this.request<{ attendance: any; message: string }>(`/attendance/class/${classId}/${date}`, {
      method: 'POST',
      body: JSON.stringify({ records }),
    });
  }

  // Assignments
  async getAssignments(classId?: string) {
    const endpoint = classId ? `/assignments/class/${classId}` : '/assignments';
    return this.request<{ assignments: any[] }>(endpoint);
  }

  async getStudentAssignments(studentId: string) {
    return this.request<{ assignments: any[] }>(`/assignments/student/${studentId}`);
  }

  async createAssignment(data: any) {
    return this.request<{ assignment: any; message: string }>('/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Reports
  async generateAttendanceReport(data: any) {
    return this.request<{ report: any; message: string }>('/reports/attendance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generatePerformanceReport(data: any) {
    return this.request<{ report: any; message: string }>('/reports/performance', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Documents
  async getDocuments() {
    return this.request<{ documents: any[] }>('/documents');
  }

  async getDocument(id: string) {
    return this.request<{ document: any }>(`/documents/${id}`);
  }

  // Notifications
  async getNotifications() {
    return this.request<{ notifications: any[] }>('/notifications');
  }

  async getUnreadCount() {
    return this.request<{ count: number }>('/notifications/unread/count');
  }

  async markNotificationAsRead(id: string) {
    return this.request<{ notification: any; message: string }>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request<{ message: string }>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // AI Chat
  async sendChatMessage(message: string, history: any[] = []) {
    return this.request<{
      response: string;
      messageId: string;
      timestamp: string;
    }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    });
  }

  async generateDocument(type: string, data: any) {
    return this.request<{
      document: any;
      message: string;
    }>('/ai/generate-document', {
      method: 'POST',
      body: JSON.stringify({ type, data }),
    });
  }

  async getChatHistory() {
    return this.request<{ messages: any[] }>('/ai/chat-history');
  }

  async clearChatHistory() {
    return this.request<{ message: string }>('/ai/chat-history', {
      method: 'DELETE',
    });
  }

  async getAISuggestions() {
    return this.request<{ suggestions: string[] }>('/ai/suggestions');
  }

  // Billing
  async getBillingInfo(schoolId: string) {
    return this.request<{ billing: any }>(`/billing/school/${schoolId}`);
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string; version: string }>('/health');
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('school-nexus-token', token);
  }
}

export const api = new ApiService();