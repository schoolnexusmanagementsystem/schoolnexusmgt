
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  ClipboardCheck, 
  BookOpen, 
  TrendingUp,
  Calendar,
  FileText,
  Users,
  BarChart3
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export const QuickActions = () => {
  const { user } = useUser();

  const getQuickActions = () => {
    switch (user?.role) {
      case 'school-admin':
        return [
          { 
            id: 'add-student', 
            label: 'Add Student', 
            icon: UserPlus, 
            color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
            action: () => console.log('Adding new student...')
          },
          { 
            id: 'mark-attendance', 
            label: 'Mark Attendance', 
            icon: ClipboardCheck, 
            color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
            action: () => console.log('Opening attendance marking...')
          },
          { 
            id: 'view-reports', 
            label: 'View Reports', 
            icon: BarChart3, 
            color: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
            action: () => console.log('Loading reports dashboard...')
          },
          { 
            id: 'manage-classes', 
            label: 'Manage Classes', 
            icon: BookOpen, 
            color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
            action: () => console.log('Opening class management...')
          },
        ];
      
      case 'teacher':
        return [
          { 
            id: 'take-attendance', 
            label: 'Take Attendance', 
            icon: ClipboardCheck, 
            color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
            action: () => console.log('Opening attendance for teacher...')
          },
          { 
            id: 'create-assignment', 
            label: 'Create Assignment', 
            icon: FileText, 
            color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
            action: () => console.log('Creating new assignment...')
          },
          { 
            id: 'view-gradebook', 
            label: 'View Gradebook', 
            icon: BarChart3, 
            color: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
            action: () => console.log('Opening gradebook...')
          },
          { 
            id: 'schedule-class', 
            label: 'Schedule Class', 
            icon: Calendar, 
            color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
            action: () => console.log('Opening class scheduler...')
          },
        ];
      
      case 'student':
        return [
          { 
            id: 'view-assignments', 
            label: 'View Assignments', 
            icon: FileText, 
            color: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
            action: () => console.log('Loading student assignments...')
          },
          { 
            id: 'check-grades', 
            label: 'Check Grades', 
            icon: TrendingUp, 
            color: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
            action: () => console.log('Loading student grades...')
          },
          { 
            id: 'view-timetable', 
            label: 'View Timetable', 
            icon: Calendar, 
            color: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
            action: () => console.log('Loading student timetable...')
          },
          { 
            id: 'join-class', 
            label: 'Join Class', 
            icon: Users, 
            color: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
            action: () => console.log('Joining virtual class...')
          },
        ];
      
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Card key={action.id} className="p-4 hover:shadow-lg transition-all duration-200">
            <Button
              onClick={action.action}
              className={`w-full h-16 text-white font-medium ${action.color} shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon className="h-6 w-6" />
                <span className="text-sm">{action.label}</span>
              </div>
            </Button>
          </Card>
        );
      })}
    </div>
  );
};
