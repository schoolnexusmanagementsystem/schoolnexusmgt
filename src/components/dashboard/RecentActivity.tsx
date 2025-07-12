
import { Clock, User, FileText, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/contexts/UserContext';

export const RecentActivity = () => {
  const { user } = useUser();

  const getActivitiesForRole = () => {
    switch (user?.role) {
      case 'school-admin':
        return [
          { icon: User, title: 'New teacher registered', description: 'Sarah Johnson joined Mathematics department', time: '2 minutes ago', type: 'success' },
          { icon: FileText, title: 'Monthly report generated', description: 'November 2024 academic report is ready', time: '15 minutes ago', type: 'info' },
          { icon: AlertCircle, title: 'Low attendance alert', description: 'Class 10-A attendance below 85%', time: '1 hour ago', type: 'warning' },
          { icon: CheckCircle, title: 'Fee payment received', description: '$2,340 from 15 students', time: '2 hours ago', type: 'success' },
          { icon: TrendingUp, title: 'Enrollment increased', description: '12 new admissions this week', time: '3 hours ago', type: 'success' }
        ];
      case 'teacher':
        return [
          { icon: CheckCircle, title: 'Assignment submitted', description: '25/30 students completed Math homework', time: '5 minutes ago', type: 'success' },
          { icon: User, title: 'Parent meeting scheduled', description: 'Meeting with John\'s parents tomorrow', time: '30 minutes ago', type: 'info' },
          { icon: FileText, title: 'Exam results uploaded', description: 'Mid-term results for Class 9-B', time: '1 hour ago', type: 'success' },
          { icon: AlertCircle, title: 'Student absent', description: 'Emma Wilson missed 3 consecutive classes', time: '2 hours ago', type: 'warning' }
        ];
      case 'student':
        return [
          { icon: FileText, title: 'New assignment posted', description: 'Physics homework due Friday', time: '10 minutes ago', type: 'info' },
          { icon: CheckCircle, title: 'Assignment graded', description: 'Math quiz - Score: 85/100', time: '1 hour ago', type: 'success' },
          { icon: User, title: 'Parent-teacher meeting', description: 'Scheduled for next Monday 3 PM', time: '2 hours ago', type: 'info' },
          { icon: AlertCircle, title: 'Exam reminder', description: 'Chemistry exam in 3 days', time: '4 hours ago', type: 'warning' }
        ];
      default:
        return [
          { icon: TrendingUp, title: 'Platform growth', description: '5 new schools joined this week', time: '1 hour ago', type: 'success' },
          { icon: AlertCircle, title: 'Server maintenance', description: 'Scheduled for Sunday 2 AM', time: '2 hours ago', type: 'warning' },
          { icon: CheckCircle, title: 'Payment processed', description: '$15,670 in subscription renewals', time: '3 hours ago', type: 'success' },
          { icon: User, title: 'Support ticket resolved', description: 'Integration issue for Riverside High', time: '4 hours ago', type: 'info' }
        ];
    }
  };

  const activities = getActivitiesForRole();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'info': return 'text-blue-600 dark:text-blue-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  };

  return (
    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors duration-200">
                <div className={`p-2 rounded-full ${getTypeColor(activity.type)} bg-opacity-10`}>
                  <activity.icon className={`h-4 w-4 ${getTypeColor(activity.type)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {activity.title}
                    </p>
                    <Badge variant="secondary" className={`text-xs ${getTypeBadge(activity.type)} ml-2`}>
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
