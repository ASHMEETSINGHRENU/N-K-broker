import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useBrokerAuth } from '../context/AuthContext';
import { useBrokerNotifications } from '../context/NotificationContext';
import {
  LayoutDashboard,
  Building2,
  Users2,
  UserCheck,
  Calendar,
  DollarSign,
  BarChart3,
  User,
  LogOut,
  Bell,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const BrokerLayout: React.FC = () => {
  const { user, logout } = useBrokerAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useBrokerNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/broker/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/broker/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', path: '/broker/properties', icon: Building2 },
    { label: 'Leads Pipeline', path: '/broker/leads', icon: Users2, badgeCount: unreadCount },
    { label: 'Client Workspace', path: '/broker/clients', icon: UserCheck },
    { label: 'Viewings Schedule', path: '/broker/viewings', icon: Calendar },
    { label: 'Commissions', path: '/broker/commissions', icon: DollarSign },
    { label: 'Performance', path: '/broker/analytics', icon: BarChart3 },
    { label: 'Broker Profile', path: '/broker/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#121214] text-[#F7F5F0] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#18181A] border-r border-[#2A2A2D] flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#2A2A2D]">
            <Link to="/broker/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-[#C5A880] flex items-center justify-center text-[#C5A880]">
                <span className="font-serif font-bold text-xs">NK</span>
              </div>
              <div>
                <span className="font-serif text-lg tracking-[0.16em] uppercase text-[#F7F5F0] block leading-none">
                  NESTANDKEY
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A880] font-medium block mt-0.5">
                  BROKER WORKSPACE
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-none text-xs uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#262629] text-[#C5A880] border-l-2 border-[#C5A880] font-semibold'
                      : 'text-[#A3A3A8] hover:text-[#F7F5F0] hover:bg-[#262629]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#C5A880]" />
                    <span>{item.label}</span>
                  </div>
                  {item.badgeCount && item.badgeCount > 0 ? (
                    <span className="bg-[#C5A880] text-[#18181A] text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                      {item.badgeCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-[#2A2A2D] space-y-3">
          {/* External links */}
          <div className="flex gap-2">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-[10px] uppercase tracking-wider py-1.5 border border-[#2A2A2D] text-[#A3A3A8] hover:text-[#C5A880] hover:border-[#C5A880] transition-colors"
            >
              Public Site
            </a>
            <a
              href="http://localhost:5175"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-[10px] uppercase tracking-wider py-1.5 border border-[#2A2A2D] text-[#A3A3A8] hover:text-[#C5A880] hover:border-[#C5A880] transition-colors"
            >
              Admin Panel
            </a>
          </div>

          {/* User Info & Logout */}
          <div className="pt-2 border-t border-[#2A2A2D] flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#262629] border border-[#C5A880] flex items-center justify-center text-[#C5A880] text-xs font-serif shrink-0">
                {user?.name?.slice(0, 2).toUpperCase() || 'BR'}
              </div>
              <div className="truncate">
                <span className="text-xs font-medium text-[#F7F5F0] block truncate">
                  {user?.name || 'Broker Specialist'}
                </span>
                <span className="text-[10px] text-[#C5A880] block font-mono">
                  RERA Authorized
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-[#A3A3A8] hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Executive Top Bar */}
        <header className="h-16 bg-[#18181A] border-b border-[#2A2A2D] px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono">
              Brokerage Advisory
            </span>
            <span className="text-[#3A3A40] text-xs">•</span>
            <span className="text-xs text-[#A3A3A8] font-medium uppercase tracking-wider">
              {navItems.find((n) => location.pathname.startsWith(n.path))?.label || 'Desk'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Notification Bell & Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-[#A3A3A8] hover:text-[#C5A880] border border-[#2A2A2D] hover:border-[#C5A880] transition-colors"
                title="Lead & Viewing Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-[#C5A880]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-mono font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center shadow-md animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#18181A] border border-[#2A2A2D] text-white shadow-2xl py-3 z-50">
                  <div className="px-4 pb-2.5 border-b border-[#2A2A2D] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span className="font-serif text-sm text-white font-medium">
                        Broker Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-mono bg-[#C5A880] text-[#18181A] px-1.5 py-0.2 rounded-full font-bold">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#2A2A2D]/60 text-xs">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-[#71717A] space-y-1">
                        <Bell className="w-8 h-8 mx-auto text-[#2A2A2D] mb-2" />
                        <p className="text-xs text-[#A3A3A8]">No incoming notifications</p>
                        <p className="text-[10px] text-[#71717A]">
                          New client inquiries and viewing updates will appear here in real-time.
                        </p>
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notif) => (
                        <div
                          key={notif._id}
                          onClick={() => {
                            if (!notif.isRead) markAsRead(notif._id);
                            if (notif.link) {
                              navigate(notif.link);
                              setIsNotifOpen(false);
                            }
                          }}
                          className={`p-3.5 hover:bg-[#212124] transition-colors cursor-pointer flex items-start gap-3 ${
                            !notif.isRead ? 'bg-[#212124]/50 border-l-2 border-[#C5A880]' : ''
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full bg-[#C5A880] mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="font-serif text-xs font-medium text-[#F7F5F0] block truncate">
                              {notif.title}
                            </span>
                            <p className="text-[11px] text-[#A3A3A8] line-clamp-2 mt-0.5 leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="text-[9px] font-mono text-[#71717A] block mt-1">
                              {new Date(notif.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}{' '}
                              • {new Date(notif.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 pt-2.5 border-t border-[#2A2A2D] text-center">
                    <Link
                      to="/broker/leads"
                      onClick={() => setIsNotifOpen(false)}
                      className="text-[10px] uppercase font-mono tracking-wider text-[#C5A880] hover:underline"
                    >
                      View All Leads & Inquiries Pipeline →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#212124] border border-[#2A2A2D] text-[10px] font-mono text-[#A3A3A8]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Broker Desk Live</span>
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 overflow-y-auto bg-[#121214] p-8 lg:p-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
