
import { useState } from 'react';
import { TopNavbar } from '@/components/layout/TopNavbar';
import { MainDashboard } from '@/components/dashboard/MainDashboard';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <UserProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
          <TopNavbar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />
          <MainDashboard sidebarOpen={sidebarOpen} />
        </div>
      </UserProvider>
    </ThemeProvider>
  );
};

export default Index;
