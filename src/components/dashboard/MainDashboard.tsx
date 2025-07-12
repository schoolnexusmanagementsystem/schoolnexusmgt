
import { AIChatPanel } from './AIChatPanel';
import { Sidebar } from '@/components/layout/Sidebar';

interface MainDashboardProps {
  sidebarOpen: boolean;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ sidebarOpen }) => {
  return (
    <div className="pt-16 min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => {}} />
      
      <div className="flex-1 transition-all duration-300">
        <AIChatPanel />
      </div>
    </div>
  );
};
