
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Bot, User, FileText, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { StatisticsCards } from './StatisticsCards';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: 'chart' | 'document' | 'table';
    title: string;
    data?: any;
  }>;
}

export const AIChatPanel = () => {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    setIsChatActive(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(message, user?.role || 'student'),
        timestamp: new Date(),
        attachments: message.toLowerCase().includes('report') || message.toLowerCase().includes('chart') ? [
          {
            type: 'chart',
            title: 'Student Performance Chart',
            data: { type: 'bar', values: [85, 90, 78, 92, 88] }
          }
        ] : undefined
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (query: string, role: string) => {
    const responses = {
      'school-admin': {
        'attendance': 'Current school attendance rate is 94.2%. Here\'s the breakdown by grade level...',
        'report': 'I\'ve generated your monthly report. It shows improved performance across all departments...',
        'students': 'You currently have 1,247 active students. 45 new enrollments this month...',
        'default': 'I can help you manage school operations, generate reports, track student performance, and more. What would you like to know?'
      },
      'teacher': {
        'grade': 'Your students\' average grade is 85.4%. Here are the detailed analytics...',
        'assignment': 'You have 12 pending assignments to review. Would you like me to prioritize them?',
        'attendance': 'Class attendance for your subjects averages 96.8%. Here\'s the detailed breakdown...',
        'default': 'I can help you with grading, attendance tracking, lesson planning, and student progress. How can I assist?'
      },
      'student': {
        'assignment': 'You have 5 pending assignments. The next due date is Friday for Physics homework...',
        'grade': 'Your current GPA is 3.7. Here\'s your subject-wise performance breakdown...',
        'schedule': 'Tomorrow you have Math at 9 AM, Physics at 11 AM, and Chemistry at 2 PM...',
        'default': 'I can help you track assignments, check grades, view your schedule, and study tips. What do you need?'
      }
    };

    const roleResponses = responses[role as keyof typeof responses] || responses.student;
    
    for (const [key, response] of Object.entries(roleResponses)) {
      if (query.toLowerCase().includes(key)) {
        return response;
      }
    }
    
    return roleResponses.default;
  };

  const handleClearChat = () => {
    setMessages([]);
    setIsChatActive(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Dashboard Content - Hidden when chat is active */}
      {!isChatActive && (
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            {/* Statistics Cards */}
            <StatisticsCards />
            
            {/* Quick Actions */}
            <QuickActions />
            
            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>
      )}

      {/* Chat Messages - Shown when chat is active */}
      {isChatActive && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center">
                <Bot className="mr-2 h-5 w-5 text-blue-600" />
                <span className="font-semibold text-slate-900 dark:text-slate-100">School Nexus AI Assistant</span>
                <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {user?.role?.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
                className="bg-white/50 dark:bg-slate-700/50"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="max-w-4xl mx-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-3xl ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`p-2 rounded-full ${msg.type === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-purple-500 to-blue-600'}`}>
                      {msg.type === 'user' ? 
                        <User className="h-4 w-4 text-white" /> : 
                        <Bot className="h-4 w-4 text-white" />
                      }
                    </div>
                    <div className={`p-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-white/80 dark:bg-slate-700/80 text-slate-900 dark:text-slate-100'}`}>
                      <p className="text-sm">{msg.content}</p>
                      {msg.attachments && (
                        <div className="mt-2 space-y-2">
                          {msg.attachments.map((attachment, index) => (
                            <div key={index} className="p-2 bg-white/20 rounded border flex items-center space-x-2">
                              {attachment.type === 'chart' && <BarChart3 className="h-4 w-4" />}
                              {attachment.type === 'document' && <FileText className="h-4 w-4" />}
                              <span className="text-xs">{attachment.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-700/80">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat Input - Always at bottom */}
      <div className="p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-t">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 flex space-x-2">
              <Input
                placeholder="Ask me anything about your school..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
