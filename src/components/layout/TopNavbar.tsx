
import { useState } from 'react';
import { Bell, Menu, Moon, Sun, LogOut, Settings, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';

interface TopNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useUser();
  const [notifications] = useState(5);
  const [showSearch, setShowSearch] = useState(false);

  const handleNotificationClick = () => {
    console.log('Opening notifications...');
    // Implement notification panel logic
  };

  const handleProfileClick = (action: string) => {
    console.log(`Profile action: ${action}`);
    switch (action) {
      case 'profile':
        // Navigate to profile page
        break;
      case 'settings':
        // Navigate to settings page
        break;
      case 'logout':
        logout();
        break;
    }
  };

  const handleSearch = (query: string) => {
    console.log(`Searching for: ${query}`);
    // Implement search functionality
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section - Swapped: Menu and Search */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="relative">
            {showSearch ? (
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search..."
                  className="w-64 h-8"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e.currentTarget.value);
                    }
                  }}
                  onBlur={() => setShowSearch(false)}
                  autoFocus
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(true)}
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Center Section */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            School Nexus
          </h1>
        </div>

        {/* Right Section - Swapped: Theme toggle, Notifications, and Profile */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'light' ? 
              <Moon className="h-4 w-4" /> : 
              <Sun className="h-4 w-4" />
            }
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="relative hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={handleNotificationClick}
          >
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-0"
              >
                {notifications}
              </Badge>
            )}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-800">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                <Badge variant="secondary" className="mt-1 text-xs capitalize">
                  {user?.role?.replace('-', ' ')}
                </Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => handleProfileClick('profile')}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => handleProfileClick('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleProfileClick('logout')}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
