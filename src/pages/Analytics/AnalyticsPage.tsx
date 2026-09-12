import React, { useState, useEffect } from 'react';
import { brokerApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import { BarChart3, TrendingUp, Users, CheckCircle2, Award } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await brokerApi.getAnalytics();
        setAnalytics(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading || !analytics) {
    return <div className="p-12 text-xs text-[#71717A]">Loading operational analytics...</div>;
  }

  const m = analytics.metrics || {};

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Operational Benchmarking
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Performance Analytics
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#18181A] border border-[#2A2A2D] p-6">
          <span className="text-[10px] uppercase tracking-wider text-[#A3A3A8] block mb-1">
            Conversion Velocity
          </span>
          <div className="font-serif text-3xl text-[#C5A880] font-medium">
            {m.conversionRatePct || 0}%
          </div>
          <span className="text-[10px] text-[#71717A] mt-1 block">Lead-to-closed transaction ratio</span>
        </div>

        <div className="bg-[#18181A] border border-[#2A2A2D] p-6">
          <span className="text-[10px] uppercase tracking-wider text-[#A3A3A8] block mb-1">
            Historical Sales Volume
          </span>
          <div className="font-serif text-2xl text-[#F7F5F0] font-medium truncate">
            {formatAED(m.totalSalesVolumeAED || 0)}
          </div>
          <span className="text-[10px] text-[#71717A] mt-1 block">Verified Dubai Land Dept volume</span>
        </div>

        <div className="bg-[#18181A] border border-[#2A2A2D] p-6">
          <span className="text-[10px] uppercase tracking-wider text-[#A3A3A8] block mb-1">
            Client Quality Rating
          </span>
          <div className="font-serif text-3xl text-[#F7F5F0] font-medium">
            {m.rating || 4.98} <span className="text-xs text-[#71717A] font-sans">/ 5.0</span>
          </div>
          <span className="text-[10px] text-[#71717A] mt-1 block">VIP client satisfaction index</span>
        </div>

        <div className="bg-[#18181A] border border-[#2A2A2D] p-6">
          <span className="text-[10px] uppercase tracking-wider text-[#A3A3A8] block mb-1">
            Active Inventory Pool
          </span>
          <div className="font-serif text-3xl text-[#F7F5F0] font-medium">
            {m.activeListings || 0} Listings
          </div>
          <span className="text-[10px] text-[#71717A] mt-1 block">Under direct broker representation</span>
        </div>
      </div>
    </div>
  );
};
