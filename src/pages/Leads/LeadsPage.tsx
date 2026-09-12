import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brokerApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import { Users2, ArrowRight, MessageSquare, Phone, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('');

  useEffect(() => {
    async function loadLeads() {
      setIsLoading(true);
      try {
        const res = await brokerApi.getLeads(activeStatus || undefined);
        setLeads(res.leads || []);
      } catch (err) {
        console.error('Failed to load broker leads:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLeads();
  }, [activeStatus]);

  const stages = ['', 'NEW', 'CONTACTED', 'QUALIFIED', 'VIEWING', 'NEGOTIATION', 'CONVERTED', 'LOST'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Client Acquisition Engine
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Leads & Inquiries Pipeline
          </h1>
        </div>
      </div>

      {/* Stage Filters */}
      <div className="flex flex-wrap gap-2 text-xs">
        {stages.map((st) => (
          <button
            key={st}
            onClick={() => setActiveStatus(st)}
            className={`px-3 py-1.5 uppercase tracking-wider border transition-all text-[11px] ${
              activeStatus === st
                ? 'bg-[#262629] border-[#C5A880] text-[#C5A880] font-semibold'
                : 'border-[#2A2A2D] text-[#A3A3A8] hover:text-[#F7F5F0]'
            }`}
          >
            {st || 'All Pipeline Stages'}
          </button>
        ))}
      </div>

      {/* Leads List / Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#18181A] border border-[#2A2A2D] animate-pulse" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-24 bg-[#18181A] border border-[#2A2A2D] p-8 text-xs text-[#71717A]">
          No active leads currently in this pipeline stage.
        </div>
      ) : (
        <div className="bg-[#18181A] border border-[#2A2A2D] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121214] border-b border-[#2A2A2D] text-[#71717A] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Lead ID & Client</th>
                <th className="p-4">Interested Residence</th>
                <th className="p-4">Target Budget</th>
                <th className="p-4">Source</th>
                <th className="p-4">Stage</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2D]">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-[#262629]/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#262629] border border-[#C5A880] flex items-center justify-center text-[#C5A880] font-serif text-xs font-semibold">
                        {lead.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-serif text-sm font-medium text-[#F7F5F0] block">
                          {lead.name}
                        </span>
                        <span className="text-[10px] text-[#C5A880] font-mono">
                          {lead.leadId} • {lead.preferredContactMethod}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {lead.property ? (
                      <div>
                        <span className="text-[#F7F5F0] font-medium block truncate max-w-xs">
                          {lead.property.title}
                        </span>
                        <span className="text-[10px] text-[#71717A]">
                          {lead.property.community} • {formatAED(lead.property.priceAED)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#71717A] italic">General Advisory Mandate</span>
                    )}
                  </td>
                  <td className="p-4 font-serif text-sm text-[#F7F5F0]">
                    {lead.estimatedBudgetAED ? formatAED(lead.estimatedBudgetAED) : '—'}
                  </td>
                  <td className="p-4 font-mono text-[10px] text-[#A3A3A8]">
                    {lead.source}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 font-mono font-semibold ${
                        lead.status === 'NEW'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : lead.status === 'VIEWING'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : lead.status === 'CONVERTED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/broker/leads/${lead._id}`}
                      className="text-xs uppercase tracking-wider text-[#C5A880] hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span>Engage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
