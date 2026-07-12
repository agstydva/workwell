import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTracker } from '../hooks/useTracker';
import { useTheme } from '../hooks/useTheme';
import { LayoutDashboard, User, LogOut, HeartPulse, X, ClipboardList, BarChart3, Sun, Moon, Monitor, Flower2 } from 'lucide-react';
import WorkWellLogo from './WorkWellLogo';

const Sidebar = () => {
  const { logout, currentUser } = useAuth();
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useTracker();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileSidebarOpen(false);
  };

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-4 w-4 text-brand-primary" />;
    if (theme === 'dark') return <Moon className="h-4 w-4 text-indigo-300" />;
    return <Monitor className="h-4 w-4 text-slate-300" />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light Mode';
    if (theme === 'dark') return 'Dark Mode';
    return 'System Theme';
  };

  const handleNavClick = (target) => {
    setIsMobileSidebarOpen(false);
    if (target === 'dashboard') {
      if (location.pathname !== '/dashboard') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (target === 'habits' || target === 'analytics') {
      navigate(`/dashboard?scroll=${target}`);
      if (location.pathname === '/dashboard') {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (target === 'wellness-center') {
      navigate('/wellness-center');
    } else if (target === 'profile') {
      navigate('/profile');
    }
  };

  const navItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      active: location.pathname === '/dashboard' && !location.search.includes('scroll')
    },
    {
      id: 'habits',
      name: 'Habits',
      icon: ClipboardList,
      active: location.pathname === '/dashboard' && location.search.includes('scroll=habits')
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      active: location.pathname === '/dashboard' && location.search.includes('scroll=analytics')
    },
    {
      id: 'wellness-center',
      name: 'Wellness Center',
      icon: Flower2,
      active: location.pathname === '/wellness-center'
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: User,
      active: location.pathname === '/profile'
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-brand-secondary text-white">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-brand-dark/20 flex items-center justify-between">
        <WorkWellLogo logoColorClass="text-white" />
        
        <div className="flex items-center space-x-1">
          {/* Theme cycle button */}
          <button
            onClick={cycleTheme}
            className="p-1.5 hover:bg-brand-dark/20 text-white/80 hover:text-white rounded-xl cursor-pointer transition-colors"
            title={`Tema: ${getThemeLabel()} (Klik untuk ganti)`}
          >
            {getThemeIcon()}
          </button>

          {/* Mobile close button inside drawer */}
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="md:hidden p-1.5 text-white/70 hover:text-white hover:bg-brand-dark/20 rounded-xl cursor-pointer transition-colors"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Profile Details mini card */}
      <div className="p-4 mx-4 mt-6 bg-brand-dark/15 border border-brand-dark/10 rounded-2xl flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-brand-primary text-brand-dark flex items-center justify-center font-extrabold text-sm shadow-md">
          {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-bold truncate text-white">{currentUser?.name}</p>
          <p className="text-[10px] text-brand-primary/95 font-bold uppercase tracking-wider">SaaS Active</p>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 group text-left cursor-pointer ${
                item.active
                  ? 'bg-brand-dark text-white shadow-inner pl-4.5 border-l-4 border-brand-primary'
                  : 'text-white/80 hover:bg-brand-dark/15 hover:text-white hover:translate-x-1'
              }`}
            >
              <Icon className="h-4.5 w-4.5 transition-transform group-hover:scale-105" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Informative Tip Box */}
      <div className="p-4 mx-4 mb-4 bg-brand-dark/20 border border-brand-dark/15 rounded-2xl">
        <div className="flex items-start space-x-2.5 text-left">
          <HeartPulse className="h-4.5 w-4.5 text-brand-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Tips Sehat</h4>
            <p className="text-[10px] text-white/85 font-medium leading-relaxed">
              Regangkan otot leher & bahu setiap 1 jam untuk menghindari kelelahan otot (RSI).
            </p>
          </div>
        </div>
      </div>

      {/* Logout Action */}
      <div className="p-4 border-t border-brand-dark/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl text-xs font-bold transition-all group cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5 text-white/80 group-hover:text-rose-300" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Docked) */}
      <aside className="w-64 border-r border-brand-secondary/15 hidden md:flex flex-col h-screen sticky top-0 transition-colors duration-200">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer (Slide-out) */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-brand-secondary z-50 md:hidden flex flex-col transition-transform duration-300 ease-out transform shadow-2xl ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
