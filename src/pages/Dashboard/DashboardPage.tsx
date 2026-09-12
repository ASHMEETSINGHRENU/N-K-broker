import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brokerApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import {
  Building2,
  Users2,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Plus
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await brokerApi.getAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to load broker analytics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-[#18181A] w-1/4" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#18181A] border border-[#2A2A2D]" />
          ))}
        </div>
      </div>
    );
  }

  const m = data?.metrics || {};

  return (
    <div className="space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Broker Operations Overview
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Executive Workspace
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/broker/properties/new"
            className="bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Listing</span>
          </Link>
          <Link
            to="/broker/leads"
            className="border border-[#2A2A2D] hover:border-[#C5A880] bg-[#18181A] text-[#F7F5F0] px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors"
          >
            Manage Leads
          </Link>
        </div>
      </div>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Listings */}
        <div className="bg-[#18181A] border border-[#2A2A2D] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#A3A3A8]">Active Inventory</span>
            <Building2 className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-serif text-3xl text-[#F7F5F0] font-medium">{m.activeListings || 0}</div>
          <span className="text-[10px] text-[#71717A] mt-1 block">
            {m.pendingListings || 0} pending moderation
          </span>
        </div>

        {/* Total Inquiries / Leads */}
        <div className="bg-[#18181A] border border-[#2A2A2D] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#A3A3A8]">Assigned Leads</span>
            <Users2 className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-serif text-3xl text-[#F7F5F0] font-medium">{m.totalLeads || 0}</div>
          <div className="flex items-center gap-2 text-[10px] text-[#C5A880] mt-1 font-mono">
            <span>{m.newLeads || 0} NEW Inquiries</span>
            <span>•</span>
            <span>{m.activeLeads || 0} Active</span>
          </div>
        </div>

        {/* Viewings Scheduled */}
        <div className="bg-[#18181A] border border-[#2A2A2D] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#A3A3A8]">Upcoming Viewings</span>
            <Calendar className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-serif text-3xl text-[#F7F5F0] font-medium">
            {data?.upcomingViewings?.length || 0}
          </div>
          <span className="text-[10px] text-[#71717A] mt-1 block">Scheduled on-site VIP tours</span>
        </div>

        {/* Commissions Earned */}
        <div className="bg-[#18181A] border border-[#2A2A2D] p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#A3A3A8]">Earned Commission</span>
            <DollarSign className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="font-serif text-2xl text-[#C5A880] font-medium truncate">
            {formatAED(m.totalNetBrokerCommissionAED || 0)}
          </div>
          <span className="text-[10px] text-[#71717A] mt-1 block">
            Pending clearance: {formatAED(m.pendingCommissionAED || 0)}
          </span>
        </div>
      </div>

      {/* Main Grid: Pipeline Stage & Viewings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (7 cols): Lead Stage Distribution */}
        <div className="lg:col-span-7 bg-[#18181A] border border-[#2A2A2D] p-6">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#2A2A2D]">
            <h3 className="font-serif text-xl font-light text-[#F7F5F0]">Lead Pipeline Progression</h3>
            <Link
              to="/broker/leads"
              className="text-[11px] uppercase tracking-wider text-[#C5A880] hover:underline flex items-center gap-1"
            >
              <span>Inspect Pipeline</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            {['NEW', 'CONTACTED', 'QUALIFIED', 'VIEWING', 'NEGOTIATION', 'CONVERTED'].map((st) => {
              const count = data?.leadsByStatus?.find((s: any) => s._id === st)?.count || 0;
              const pct = m.totalLeads > 0 ? (count / m.totalLeads) * 100 : 0;
              return (
                <div key={st} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A3A3A8] uppercase tracking-wider font-mono">{st}</span>
                    <span className="font-semibold text-[#F7F5F0]">{count} leads</span>
                  </div>
                  <div className="w-full bg-[#121214] h-2 border border-[#2A2A2D]">
                    <div
                      className="bg-[#C5A880] h-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (5 cols): Upcoming Viewings Schedule */}
        <div className="lg:col-span-5 bg-[#18181A] border border-[#2A2A2D] p-6">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#2A2A2D]">
            <h3 className="font-serif text-xl font-light text-[#F7F5F0]">Scheduled Private Viewings</h3>
            <Link
              to="/broker/viewings"
              className="text-[11px] uppercase tracking-wider text-[#C5A880] hover:underline"
            >
              All Viewings
            </Link>
          </div>

          {data?.upcomingViewings?.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#71717A]">
              No upcoming viewings scheduled for today.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {data?.upcomingViewings?.map((v: any) => (
                <div key={v._id} className="p-3 bg-[#121214] border border-[#2A2A2D] space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono text-[#C5A880]">
                      {v.viewingTimeSlot}
                    </span>
                    <span className="bg-[#262629] text-[10px] text-[#A3A3A8] px-2 py-0.5 uppercase tracking-wider">
                      {v.status}
                    </span>
                  </div>
                  <span className="font-serif text-base font-medium text-[#F7F5F0] block truncate">
                    {v.property?.title}
                  </span>
                  <span className="text-[11px] text-[#71717A] block">
                    {v.property?.community} • {formatAED(v.property?.priceAED)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Audit Trail */}
      <div className="bg-[#18181A] border border-[#2A2A2D] p-6">
        <div className="mb-4 pb-3 border-b border-[#2A2A2D]">
          <h3 className="font-serif text-xl font-light text-[#F7F5F0]">Recent Operational Activity</h3>
        </div>

        <div className="space-y-3 text-xs">
          {data?.recentActivities?.map((act: any) => (
            <div key={act._id} className="flex items-center justify-between p-2.5 bg-[#121214] border border-[#2A2A2D]/60">
              <div className="flex items-center gap-3">
                <Clock className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span className="text-[#A3A3A8]">{act.details}</span>
              </div>
              <span className="text-[10px] text-[#71717A] font-mono shrink-0">
                {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
