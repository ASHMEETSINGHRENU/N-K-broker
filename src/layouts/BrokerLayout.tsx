import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useBrokerAuth } from '../context/AuthContext';
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
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const BrokerLayout: React.FC = () => {
  const { user, logout } = useBrokerAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/broker/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/broker/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', path: '/broker/properties', icon: Building2 },
    { label: 'Leads Pipeline', path: '/broker/leads', icon: Users2 },
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-none text-xs uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#262629] text-[#C5A880] border-l-2 border-[#C5A880] font-semibold'
                      : 'text-[#A3A3A8] hover:text-[#F7F5F0] hover:bg-[#262629]/50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#C5A880]" />
                  <span>{item.label}</span>
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
      <main className="flex-1 overflow-y-auto bg-[#121214] p-8 lg:p-12">
        <Outlet />
      </main>
    </div>
  );
};
