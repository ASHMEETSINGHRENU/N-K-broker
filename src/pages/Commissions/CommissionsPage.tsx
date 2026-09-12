import React, { useState, useEffect } from 'react';
import { brokerApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import { DollarSign, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

export const CommissionsPage: React.FC = () => {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await brokerApi.getCommissions();
        setCommissions(res.commissions || []);
        setMetrics(res.metrics);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Financial Ledger
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Commission & Payout Management
          </h1>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#18181A] border border-[#2A2A2D] p-6">
          <span className="text-[10px] uppercase tracking-wider text-[#A3A3A8] block mb-1">
            Total Closed Deals
          </span>
          <div className="font-serif text-3xl text-[#F7F5F0] font-medium">{metrics?.count || 0}</div>
        </div>

        <div className="bg-[#18181A] border border-[#2A2A2D] p-6">
          <span className="text-[10px] uppercase tracking-wider text-[#A3A3A8] block mb-1">
            Gross Brokerage Fee (Platform)
          </span>
          <div className="font-serif text-3xl text-[#A3A3A8] font-medium">
            {formatAED(metrics?.totalGrossAED || 0)}
          </div>
        </div>

        <div className="bg-[#18181A] border border-[#2A2A2D] p-6">
          <span className="text-[10px] uppercase tracking-wider text-[#C5A880] block mb-1">
            Net Broker Split Commission
          </span>
          <div className="font-serif text-3xl text-[#C5A880] font-medium">
            {formatAED(metrics?.totalNetBrokerAED || 0)}
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-[#18181A] border border-[#2A2A2D] animate-pulse" />
          ))}
        </div>
      ) : commissions.length === 0 ? (
        <div className="text-center py-24 bg-[#18181A] border border-[#2A2A2D] p-8 text-xs text-[#71717A]">
          No closed commission transactions on record.
        </div>
      ) : (
        <div className="bg-[#18181A] border border-[#2A2A2D] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121214] border-b border-[#2A2A2D] text-[#71717A] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Property</th>
                <th className="p-4">Sale Price</th>
                <th className="p-4">Gross Fee (2%)</th>
                <th className="p-4">Your Split Net</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2D]">
              {commissions.map((c) => (
                <tr key={c._id} className="hover:bg-[#262629]/40">
                  <td className="p-4 font-mono text-[#C5A880] font-medium">{c.transactionId}</td>
                  <td className="p-4 text-[#F7F5F0] font-serif">{c.property?.title || 'Luxury Estate'}</td>
                  <td className="p-4 font-serif text-[#F7F5F0]">{formatAED(c.salePriceAED)}</td>
                  <td className="p-4 font-mono text-[#A3A3A8]">{formatAED(c.grossCommissionAED)}</td>
                  <td className="p-4 font-mono text-[#C5A880] font-semibold">
                    {formatAED(c.netBrokerCommissionAED)} ({c.brokerSplitPct}%)
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 font-semibold ${
                        c.status === 'PAID' || c.status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
