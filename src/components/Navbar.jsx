import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useTracker } from '../hooks/useTracker';
import { Menu, X, User, LayoutDashboard, LogOut, Sun, Moon, Monitor } from 'lucide-react';
import WorkWellLogo from './WorkWellLogo';

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const { currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useTracker();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const cycleTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="h-4.5 w-4.5 text-amber-500" />;
    if (theme === 'dark') return <Moon className="h-4.5 w-4.5 text-indigo-400" />;
    return <Monitor className="h-4.5 w-4.5 text-slate-400" />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light Mode';
    if (theme === 'dark') return 'Dark Mode';
    return 'System Theme';
  };

  const isDashboardPage = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/profile');

  const handleLoginClick = () => {
    if (onLoginClick) onLoginClick();
    else navigate('/?auth=login');
    setIsOpen(false);
  };

  const handleRegisterClick = () => {
    if (onRegisterClick) onRegisterClick();
    else navigate('/?auth=register');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 border-b border-brand-secondary/15 dark:border-slate-800/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <WorkWellLogo logoColorClass="text-brand-dark dark:text-white" />
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-6">
            {!isDashboardPage && (
              <>
                <a href="#fitur" className="text-sm font-semibold text-brand-secondary hover:text-brand-dark dark:text-slate-300 dark:hover:text-white transition-colors">Features</a>
                <a href="#carakerja" className="text-sm font-semibold text-brand-secondary hover:text-brand-dark dark:text-slate-300 dark:hover:text-white transition-colors">How It Works</a>
                <a href="#tentang" className="text-sm font-semibold text-brand-secondary hover:text-brand-dark dark:text-slate-300 dark:hover:text-white transition-colors">Benefits</a>
              </>
            )}

            {/* Theme Selector */}
            <button
              onClick={cycleTheme}
              className="flex items-center space-x-1.5 p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer"
              title={`Tema: ${getThemeLabel()} (Klik untuk ganti)`}
            >
              {getThemeIcon()}
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                {isDashboardPage ? (
                  <>
                    <span className="text-sm font-semibold text-brand-secondary dark:text-slate-400">
                      Halo, <span className="text-brand-dark dark:text-white">{currentUser.name}</span>
                    </span>
                    <Link
                      to="/profile"
                      className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-650 dark:text-slate-300 hover:text-brand-secondary dark:hover:text-white"
                      title="Profil"
                    >
                      <User className="h-4.5 w-4.5" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1.5 px-4 py-2 border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Keluar</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-brand-secondary hover:bg-brand-secondary/95 text-white rounded-xl text-sm font-bold shadow-md shadow-brand-secondary/15 transition-all active:scale-98"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-brand-secondary dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-sm font-semibold transition-all cursor-pointer active:scale-98"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLoginClick}
                  className="px-4 py-2 text-brand-secondary hover:text-brand-dark dark:text-slate-300 dark:hover:text-white text-sm font-semibold cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="px-4.5 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-brand-dark rounded-xl text-sm font-bold shadow-md shadow-brand-primary/10 transition-all cursor-pointer active:scale-98"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => {
                if (isDashboardPage) {
                  setIsMobileSidebarOpen(!isMobileSidebarOpen);
                } else {
                  setIsOpen(!isOpen);
                }
              }}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white focus:outline-none cursor-pointer"
            >
              {isDashboardPage
                ? (isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />)
                : (isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />)
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Landing Page only) */}
      {isOpen && !isDashboardPage && (
        <div className="md:hidden border-b border-brand-secondary/15 dark:border-slate-800 bg-white dark:bg-slate-950 animate-in slide-in-from-top-4 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#fitur"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-brand-secondary hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-brand-dark dark:text-slate-300 dark:hover:text-white"
            >
              Features
            </a>
            <a
              href="#carakerja"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-brand-secondary hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-brand-dark dark:text-slate-300 dark:hover:text-white"
            >
              How It Works
            </a>
            <a
              href="#tentang"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-semibold text-brand-secondary hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-brand-dark dark:text-slate-300 dark:hover:text-white"
            >
              Benefits
            </a>

            {/* Theme cycle */}
            <div className="pt-3 pb-2 px-3 border-t border-brand-secondary/10 dark:border-slate-800 flex justify-between items-center text-sm font-semibold text-brand-secondary dark:text-slate-400">
              <span>Tema Aplikasi</span>
              <button
                onClick={cycleTheme}
                className="flex items-center space-x-2 py-1.5 px-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {getThemeIcon()}
                <span>{getThemeLabel()}</span>
              </button>
            </div>

            {currentUser ? (
              <div className="pt-4 pb-2 border-t border-brand-secondary/10 dark:border-slate-800">
                <div className="px-3 mb-3">
                  <div className="text-base font-bold text-brand-dark dark:text-white">{currentUser.name}</div>
                  <div className="text-xs font-medium text-brand-secondary dark:text-slate-400">{currentUser.email}</div>
                </div>
                <div className="space-y-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-semibold text-brand-secondary hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-brand-dark"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-xl text-base font-bold text-rose-500 hover:bg-rose-500/10"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-2 border-t border-brand-secondary/10 dark:border-slate-800 flex flex-col space-y-2 px-3">
                <button
                  onClick={handleLoginClick}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-900 text-brand-secondary dark:text-slate-300 font-bold rounded-2xl text-center cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-2xl text-center cursor-pointer shadow-md shadow-brand-primary/10"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
