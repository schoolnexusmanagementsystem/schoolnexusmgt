
import { useState } from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  ClipboardList, 
  BarChart3, 
  Settings, 
  GraduationCap,
  UserCheck,
  FileText,
  CreditCard,
  MessageSquare,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/contexts/UserContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
      { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
      { id: 'notifications', label: 'Notifications', icon: Bell, badge: 5 },
    ];

    switch (user?.role) {
      case 'school-admin':
        return [
          ...baseItems,
          { id: 'students', label: 'Students', icon: Users, badge: null },
          { id: 'teachers', label: 'Teachers', icon: GraduationCap, badge: null },
          { id: 'classes', label: 'Classes', icon: BookOpen, badge: null },
          { id: 'attendance', label: 'Attendance', icon: UserCheck, badge: null },
          { id: 'timetable', label: 'Timetable', icon: Calendar, badge: null },
          { id: 'assignments', label: 'Assignments', icon: ClipboardList, badge: null },
          { id: 'reports', label: 'Reports', icon: BarChart3, badge: null },
          { id: 'documents', label: 'Documents', icon: FileText, badge: null },
          { id: 'billing', label: 'Billing', icon: CreditCard, badge: null },
          { id: 'settings', label: 'Settings', icon: Settings, badge: null },
        ];
      
      case 'teacher':
        return [
          ...baseItems,
          { id: 'my-classes', label: 'My Classes', icon: BookOpen, badge: null },
          { id: 'students', label: 'Students', icon: Users, badge: null },
          { id: 'attendance', label: 'Attendance', icon: UserCheck, badge: 12 },
          { id: 'assignments', label: 'Assignments', icon: ClipboardList, badge: 8 },
          { id: 'gradebook', label: 'Gradebook', icon: BarChart3, badge: null },
          { id: 'timetable', label: 'Timetable', icon: Calendar, badge: null },
          { id: 'documents', label: 'Documents', icon: FileText, badge: null },
          { id: 'settings', label: 'Settings', icon: Settings, badge: null },
        ];
      
      case 'student':
        return [
          ...baseItems,
          { id: 'subjects', label: 'My Subjects', icon: BookOpen, badge: null },
          { id: 'assignments', label: 'Assignments', icon: ClipboardList, badge: 5 },
          { id: 'grades', label: 'Grades', icon: BarChart3, badge: null },
          { id: 'timetable', label: 'Timetable', icon: Calendar, badge: null },
          { id: 'attendance', label: 'Attendance', icon: UserCheck, badge: null },
          { id: 'documents', label: 'Documents', icon: FileText, badge: null },
          { id: 'settings', label: 'Settings', icon: Settings, badge: null },
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    console.log(`Navigating to: ${itemId}`);
    
    // Implement actual functionality based on the clicked item
    switch(itemId) {
      case 'dashboard':
        // Reset to dashboard view
        break;
      case 'students':
        console.log('Loading students management...');
        break;
      case 'teachers':
        console.log('Loading teachers management...');
        break;
      case 'attendance':
        console.log('Loading attendance tracker...');
        break;
      case 'timetable':
        console.log('Loading timetable...');
        break;
      case 'assignments':
        console.log('Loading assignments...');
        break;
      case 'reports':
        console.log('Loading reports...');
        break;
      case 'messages':
        console.log('Loading messages...');
        break;
      case 'notifications':
        console.log('Loading notifications...');
        break;
      case 'settings':
        console.log('Loading settings...');
        break;
      default:
        console.log(`Loading ${itemId}...`);
    }
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md 
        border-r border-slate-200 dark:border-slate-700 z-50 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {/* Collapse Toggle Button */}
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                className="h-8 w-8 p-0"
              >
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`
                    w-full justify-start h-12 px-3 text-left
                    ${isActive 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }
                    ${isCollapsed ? 'px-2' : ''}
                  `}
                  onClick={() => handleItemClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 truncate ml-3">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="destructive" 
                          className="ml-auto h-5 min-w-[20px] flex items-center justify-center text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
