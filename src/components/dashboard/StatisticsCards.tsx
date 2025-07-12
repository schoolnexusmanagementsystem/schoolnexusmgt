
import { Users, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

export const StatisticsCards = () => {
  const { user } = useUser();

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'school-admin':
        return [
          { title: 'Total Students', value: '1,247', icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%' },
          { title: 'Attendance Rate', value: '94.2%', icon: TrendingUp, color: 'from-green-500 to-green-600', change: '+2.1%' },
          { title: 'Total Teachers', value: '89', icon: BookOpen, color: 'from-purple-500 to-purple-600', change: '+5' },
          { title: 'Monthly Revenue', value: '$12,450', icon: Calendar, color: 'from-orange-500 to-orange-600', change: '+8.3%' }
        ];
      case 'teacher':
        return [
          { title: 'My Classes', value: '6', icon: BookOpen, color: 'from-blue-500 to-blue-600', change: '' },
          { title: 'Students', value: '180', icon: Users, color: 'from-green-500 to-green-600', change: '' },
          { title: 'Assignments Due', value: '12', icon: Calendar, color: 'from-purple-500 to-purple-600', change: '' },
          { title: 'Avg. Grade', value: '85.4%', icon: TrendingUp, color: 'from-orange-500 to-orange-600', change: '+3.2%' }
        ];
      case 'student':
        return [
          { title: 'Subjects', value: '8', icon: BookOpen, color: 'from-blue-500 to-blue-600', change: '' },
          { title: 'Assignments Due', value: '5', icon: Calendar, color: 'from-red-500 to-red-600', change: '' },
          { title: 'Attendance', value: '96.5%', icon: TrendingUp, color: 'from-green-500 to-green-600', change: '+1.2%' },
          { title: 'Upcoming Exams', value: '3', icon: Users, color: 'from-purple-500 to-purple-600', change: '' }
        ];
      default:
        return [
          { title: 'Schools', value: '45', icon: Users, color: 'from-blue-500 to-blue-600', change: '+3' },
          { title: 'Active Users', value: '12,890', icon: TrendingUp, color: 'from-green-500 to-green-600', change: '+15%' },
          { title: 'Monthly Revenue', value: '$89,450', icon: Calendar, color: 'from-purple-500 to-purple-600', change: '+12%' },
          { title: 'Support Tickets', value: '23', icon: BookOpen, color: 'from-orange-500 to-orange-600', change: '-8%' }
        ];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stat.value}
            </div>
            {stat.change && (
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-slate-500'} dark:${stat.change.startsWith('+') ? 'text-green-400' : stat.change.startsWith('-') ? 'text-red-400' : 'text-slate-400'}`}>
                {stat.change} from last month
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
