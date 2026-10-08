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
      <div className="flex items-center justify-between pb-6 border-b border-[#E9E1D4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold">
            Financial Ledger
          </span>
          <h1 className="font-display text-3xl font-light tracking-tight text-[#102A43]">
            Commission & Payout Management
          </h1>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block mb-1">
            Total Closed Deals
          </span>
          <div className="font-display text-3xl text-[#102A43] font-normal">{metrics?.count || 0}</div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block mb-1">
            Gross Brokerage Fee (Platform)
          </span>
          <div className="font-display text-3xl text-[#6B7280] font-normal">
            {formatAED(metrics?.totalGrossAED || 0)}
          </div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-[#B08D57] font-mono block mb-1">
            Net Broker Split Commission
          </span>
          <div className="font-display text-3xl text-[#B08D57] font-semibold">
            {formatAED(metrics?.totalNetBrokerAED || 0)}
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-[#FFFDF8] border border-[#E9E1D4] animate-pulse" />
          ))}
        </div>
      ) : commissions.length === 0 ? (
        <div className="text-center py-24 bg-[#FFFDF8] border border-[#E9E1D4] p-8 text-xs text-[#6B7280] shadow-sm">
          No closed commission transactions on record.
        </div>
      ) : (
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F3EA] border-b border-[#E9E1D4] text-[#6B7280] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Property</th>
                <th className="p-4">Sale Price</th>
                <th className="p-4">Gross Fee (2%)</th>
                <th className="p-4">Your Split Net</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1D4]">
              {commissions.map((c) => (
                <tr key={c._id} className="hover:bg-[#F7F3EA]/60 transition-colors">
                  <td className="p-4 font-mono text-[#B08D57] font-medium">{c.transactionId}</td>
                  <td className="p-4 text-[#102A43] font-display font-medium text-sm">{c.property?.title || 'Luxury Estate'}</td>
                  <td className="p-4 font-display text-sm text-[#102A43]">{formatAED(c.salePriceAED)}</td>
                  <td className="p-4 font-mono text-[#6B7280]">{formatAED(c.grossCommissionAED)}</td>
                  <td className="p-4 font-mono text-[#B08D57] font-semibold">
                    {formatAED(c.netBrokerCommissionAED)} ({c.brokerSplitPct}%)
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] uppercase font-mono px-2 py-0.5 font-semibold ${
                        c.status === 'PAID' || c.status === 'APPROVED'
                          ? 'bg-emerald-50 text-[#5D7A65] border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
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
