
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Bot, User, FileText, BarChart3, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/contexts/UserContext';
import { api } from '@/lib/api';
import { StatisticsCards } from './StatisticsCards';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    type: 'chart' | 'document' | 'table';
    title: string;
    data?: any;
    downloadUrl?: string;
  }>;
}

export const AIChatPanel = () => {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Load chat history and suggestions on mount
    loadChatHistory();
    loadSuggestions();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await api.getChatHistory();
      const historyMessages: ChatMessage[] = response.messages.map((msg: any) => ({
        id: msg.id,
        type: 'user',
        content: msg.message,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(historyMessages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await api.getAISuggestions();
      setSuggestions(response.suggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

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

    try {
      const response = await api.sendChatMessage(message);
      
      const aiResponse: ChatMessage = {
        id: response.messageId,
        type: 'ai',
        content: response.response,
        timestamp: new Date(response.timestamp),
        attachments: message.toLowerCase().includes('report') || message.toLowerCase().includes('chart') ? [
          {
            type: 'chart',
            title: 'Student Performance Chart',
            data: { type: 'bar', values: [85, 90, 78, 92, 88] }
          }
        ] : undefined
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleVoiceInput = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Voice input is not supported in your browser');
      return;
    }

    setIsRecording(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // In a real app, this would record audio and send to Whisper API
      // For now, we'll simulate with a timeout
      
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        
        // Mock transcription
        const mockTranscription = "Show me today's attendance";
        setMessage(mockTranscription);
        toast.success('Voice input processed');
      }, 3000);
      
    } catch (error) {
      console.error('Voice input error:', error);
      toast.error('Failed to access microphone');
      setIsRecording(false);
    }
  };

  const handleGenerateDocument = async (type: string, data: any) => {
    try {
      setIsLoading(true);
      const response = await api.generateDocument(type, data);
      
      const aiResponse: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: `I've generated your ${type.replace('-', ' ')}. You can download it below.`,
        timestamp: new Date(),
        attachments: [
          {
            type: 'document',
            title: response.document.filename,
            downloadUrl: response.document.downloadUrl
          }
        ]
      };
      
      setMessages(prev => [...prev, aiResponse]);
      toast.success('Document generated successfully');
    } catch (error) {
      console.error('Failed to generate document:', error);
      toast.error('Failed to generate document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await api.clearChatHistory();
      setMessages([]);
      setIsChatActive(false);
      toast.success('Chat history cleared');
    } catch (error) {
      console.error('Failed to clear chat history:', error);
      toast.error('Failed to clear chat history');
    }
  };

  const handleDownloadDocument = (downloadUrl: string) => {
    // In a real app, this would trigger the download
    window.open(downloadUrl, '_blank');
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
            
            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                  <Bot className="mr-2 h-5 w-5 text-blue-600" />
                  AI Suggestions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start text-left h-auto p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="text-sm">{suggestion}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
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
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearChat}
                  className="bg-white/50 dark:bg-slate-700/50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChatActive(false)}
                  className="bg-white/50 dark:bg-slate-700/50"
                >
                  Back to Dashboard
                </Button>
              </div>
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
                            <div key={index} className="p-2 bg-white/20 rounded border flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {attachment.type === 'chart' && <BarChart3 className="h-4 w-4" />}
                                {attachment.type === 'document' && <FileText className="h-4 w-4" />}
                                <span className="text-xs">{attachment.title}</span>
                              </div>
                              {attachment.downloadUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadDocument(attachment.downloadUrl!)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              )}
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
                onClick={handleVoiceInput}
                disabled={isRecording}
                className={`text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 ${
                  isRecording ? 'animate-pulse bg-red-100 dark:bg-red-900/20' : ''
                }`}
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
