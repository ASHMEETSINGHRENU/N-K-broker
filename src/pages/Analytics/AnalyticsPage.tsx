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
      <div className="flex items-center justify-between pb-6 border-b border-[#E9E1D4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold">
            Operational Benchmarking
          </span>
          <h1 className="font-display text-3xl font-light tracking-tight text-[#102A43]">
            Performance Analytics
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block mb-1">
            Conversion Velocity
          </span>
          <div className="font-display text-3xl text-[#B08D57] font-medium">
            {m.conversionRatePct || 0}%
          </div>
          <span className="text-[10px] text-[#6B7280] mt-1 block font-ui">Lead-to-closed transaction ratio</span>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block mb-1">
            Historical Sales Volume
          </span>
          <div className="font-display text-2xl text-[#102A43] font-medium truncate">
            {formatAED(m.totalSalesVolumeAED || 0)}
          </div>
          <span className="text-[10px] text-[#6B7280] mt-1 block font-ui">Verified Dubai Land Dept volume</span>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block mb-1">
            Client Quality Rating
          </span>
          <div className="font-display text-3xl text-[#102A43] font-medium">
            {m.rating || 4.98} <span className="text-xs text-[#6B7280] font-ui">/ 5.0</span>
          </div>
          <span className="text-[10px] text-[#6B7280] mt-1 block font-ui">VIP client satisfaction index</span>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block mb-1">
            Active Inventory Pool
          </span>
          <div className="font-display text-3xl text-[#102A43] font-medium">
            {m.activeListings || 0} Listings
          </div>
          <span className="text-[10px] text-[#6B7280] mt-1 block font-ui">Under direct broker representation</span>
        </div>
      </div>
    </div>
  );
};
