import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brokerApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import {
  Building2,
  Users2,
  Calendar,
  DollarSign,
  Clock,
  ArrowRight,
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
      <div className="space-y-6 animate-pulse font-ui">
        <div className="h-8 bg-[#FFFDF8] border border-[#E9E1D4] w-1/4" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#FFFDF8] border border-[#E9E1D4]" />
          ))}
        </div>
      </div>
    );
  }

  const m = data?.metrics || {};

  return (
    <div className="space-y-10 font-ui text-[#3E4852]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-semibold">
            Broker Operations Overview
          </span>
          <h1 className="font-display text-3xl font-normal tracking-tight text-[#102A43]">
            Executive Workspace
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/broker/properties/new"
            className="bg-[#102A43] hover:bg-[#0B2135] text-[#FFFDF8] hover:text-[#D8C3A5] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#B08D57]" />
            <span>Create Listing</span>
          </Link>
          <Link
            to="/broker/leads"
            className="border border-[#E9E1D4] hover:border-[#B08D57] bg-[#FFFDF8] text-[#102A43] px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors shadow-xs"
          >
            Manage Leads
          </Link>
        </div>
      </div>

      {/* KPI Counters Grid - Warm White Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Listings */}
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#6B7280]">Active Inventory</span>
            <Building2 className="w-4 h-4 text-[#B08D57]" />
          </div>
          <div className="font-display text-3xl text-[#102A43] font-normal">{m.activeListings || 0}</div>
          <span className="text-[10px] text-[#6B7280] mt-1 block">
            {m.pendingListings || 0} pending moderation
          </span>
        </div>

        {/* Total Inquiries / Leads */}
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#6B7280]">Assigned Leads</span>
            <Users2 className="w-4 h-4 text-[#B08D57]" />
          </div>
          <div className="font-display text-3xl text-[#102A43] font-normal">{m.totalLeads || 0}</div>
          <div className="flex items-center gap-2 text-[10px] text-[#B08D57] mt-1 font-mono">
            <span>{m.newLeads || 0} NEW Inquiries</span>
            <span>•</span>
            <span>{m.activeLeads || 0} Active</span>
          </div>
        </div>

        {/* Viewings Scheduled */}
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#6B7280]">Upcoming Viewings</span>
            <Calendar className="w-4 h-4 text-[#B08D57]" />
          </div>
          <div className="font-display text-3xl text-[#102A43] font-normal">
            {data?.upcomingViewings?.length || 0}
          </div>
          <span className="text-[10px] text-[#6B7280] mt-1 block">Scheduled on-site VIP tours</span>
        </div>

        {/* Commissions Earned */}
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#6B7280]">Earned Commission</span>
            <DollarSign className="w-4 h-4 text-[#B08D57]" />
          </div>
          <div className="font-display text-2xl text-[#102A43] font-normal truncate">
            {formatAED(m.totalNetBrokerCommissionAED || 0)}
          </div>
          <span className="text-[10px] text-[#6B7280] mt-1 block">
            Pending clearance: {formatAED(m.pendingCommissionAED || 0)}
          </span>
        </div>
      </div>

      {/* Main Grid: Pipeline Stage & Viewings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (7 cols): Lead Stage Distribution */}
        <div className="lg:col-span-7 bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E9E1D4]">
            <h3 className="font-display text-xl text-[#102A43] font-normal">Lead Pipeline Progression</h3>
            <Link
              to="/broker/leads"
              className="text-[11px] uppercase tracking-wider text-[#B08D57] hover:underline flex items-center gap-1 font-semibold"
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
                    <span className="text-[#6B7280] uppercase tracking-wider font-mono">{st}</span>
                    <span className="font-semibold text-[#102A43]">{count} leads</span>
                  </div>
                  <div className="w-full bg-[#F7F3EA] h-2 border border-[#E9E1D4]">
                    <div
                      className="bg-[#102A43] h-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (5 cols): Upcoming Viewings Schedule */}
        <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E9E1D4]">
            <h3 className="font-display text-xl text-[#102A43] font-normal">Scheduled Private Viewings</h3>
            <Link
              to="/broker/viewings"
              className="text-[11px] uppercase tracking-wider text-[#B08D57] hover:underline font-semibold"
            >
              All Viewings
            </Link>
          </div>

          {data?.upcomingViewings?.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#6B7280]">
              No upcoming viewings scheduled for today.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {data?.upcomingViewings?.map((v: any) => (
                <div key={v._id} className="p-3 bg-[#F7F3EA] border border-[#E9E1D4] space-y-1.5 rounded-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono text-[#B08D57] font-semibold">
                      {v.viewingTimeSlot}
                    </span>
                    <span className="bg-[#FFFDF8] border border-[#E9E1D4] text-[10px] text-[#102A43] px-2 py-0.5 uppercase tracking-wider font-medium">
                      {v.status}
                    </span>
                  </div>
                  <span className="font-display text-base font-normal text-[#102A43] block truncate">
                    {v.property?.title}
                  </span>
                  <span className="text-[11px] text-[#6B7280] block">
                    {v.property?.community} • {formatAED(v.property?.priceAED)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Audit Trail */}
      <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
        <div className="mb-4 pb-3 border-b border-[#E9E1D4]">
          <h3 className="font-display text-xl text-[#102A43] font-normal">Recent Operational Activity</h3>
        </div>

        <div className="space-y-3 text-xs">
          {data?.recentActivities?.map((act: any) => (
            <div key={act._id} className="flex items-center justify-between p-2.5 bg-[#F7F3EA] border border-[#E9E1D4] rounded-xs">
              <div className="flex items-center gap-3">
                <Clock className="w-3.5 h-3.5 text-[#B08D57] shrink-0" />
                <span className="text-[#3E4852]">{act.details}</span>
              </div>
              <span className="text-[10px] text-[#6B7280] font-mono shrink-0">
                {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
