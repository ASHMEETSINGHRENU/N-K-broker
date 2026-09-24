import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brokerApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import {
  Users2,
  ArrowRight,
  MessageSquare,
  Phone,
  Clock,
  Calendar,
  CheckCircle2,
  Bell,
  Sparkles,
  Send,
  X,
  AlertCircle
} from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('');

  // Quick Notify Modal state
  const [selectedLeadForNotify, setSelectedLeadForNotify] = useState<any | null>(null);
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');
  const [notifyType, setNotifyType] = useState('STATUS_CHANGE');
  const [isSendingNotify, setIsSendingNotify] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const res = await brokerApi.getLeads(activeStatus || undefined);
      setLeads(res.leads || []);
    } catch (err) {
      console.error('Failed to load broker leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [activeStatus]);

  const stages = ['', 'NEW', 'CONTACTED', 'QUALIFIED', 'VIEWING', 'NEGOTIATION', 'CONVERTED', 'LOST'];
  const newLeadsCount = leads.filter((l) => l.status === 'NEW').length;

  const handleOpenNotifyModal = (lead: any) => {
    setSelectedLeadForNotify(lead);
    setNotifyTitle(`Update on ${lead.property?.title || 'your luxury residence inquiry'}`);
    setNotifyMessage('');
    setNotifySuccess(false);
    setNotifyError(null);
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForNotify || !notifyMessage.trim()) return;

    setIsSendingNotify(true);
    setNotifyError(null);
    try {
      await brokerApi.sendClientNotification({
        recipientEmail: selectedLeadForNotify.email,
        recipientName: selectedLeadForNotify.name,
        title: notifyTitle.trim() || `Update on ${selectedLeadForNotify.property?.title || 'Inquiry'}`,
        message: notifyMessage.trim(),
        type: notifyType,
        link: '/profile'
      });

      // Log activity note in lead
      await brokerApi.addLeadNote(
        selectedLeadForNotify._id,
        `Quick alert dispatched to client: "${notifyTitle.trim()}" - ${notifyMessage.trim()}`
      );

      setNotifySuccess(true);
      setTimeout(() => {
        setNotifySuccess(false);
        setSelectedLeadForNotify(null);
        setNotifyTitle('');
        setNotifyMessage('');
      }, 1800);
    } catch (err: any) {
      setNotifyError(err.message || 'Failed to dispatch notification to client');
    } finally {
      setIsSendingNotify(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Client Acquisition Engine</span>
          </div>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Leads & Inquiries Pipeline
          </h1>
          <p className="text-xs text-[#A3A3A8] font-light mt-1">
            Track inquiries, update pipeline statuses, and dispatch real-time property notifications directly to clients.
          </p>
        </div>

        {newLeadsCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#C5A880]/10 border border-[#C5A880]/40 text-[#C5A880] text-xs font-mono">
            <Bell className="w-3.5 h-3.5 animate-bounce" />
            <span>{newLeadsCount} New Inquiries Awaiting Response</span>
          </div>
        )}
      </div>

      {/* Stage Filters */}
      <div className="flex flex-wrap gap-2 text-xs">
        {stages.map((st) => (
          <button
            key={st}
            onClick={() => setActiveStatus(st)}
            className={`px-3 py-1.5 uppercase tracking-wider border transition-all text-[11px] flex items-center gap-1.5 ${
              activeStatus === st
                ? 'bg-[#262629] border-[#C5A880] text-[#C5A880] font-semibold'
                : 'border-[#2A2A2D] text-[#A3A3A8] hover:text-[#F7F5F0]'
            }`}
          >
            <span>{st || 'All Pipeline Stages'}</span>
            {st === 'NEW' && newLeadsCount > 0 && (
              <span className="px-1 py-0.2 bg-blue-500 text-white rounded-full text-[9px] font-bold">
                {newLeadsCount}
              </span>
            )}
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
        <div className="text-center py-24 bg-[#18181A] border border-[#2A2A2D] p-8 text-xs text-[#71717A] space-y-2">
          <Users2 className="w-8 h-8 mx-auto text-[#2A2A2D] mb-2" />
          <p>No active leads currently in this pipeline stage.</p>
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
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2D]">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-[#262629]/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#262629] border border-[#C5A880] flex items-center justify-center text-[#C5A880] font-serif text-xs font-semibold shrink-0">
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
                    <div className="flex items-center justify-end gap-2">
                      {/* Direct Notify Client Action Button */}
                      <button
                        onClick={() => handleOpenNotifyModal(lead)}
                        className="px-2.5 py-1.5 border border-[#2A2A2D] hover:border-[#C5A880] text-[#A3A3A8] hover:text-[#C5A880] text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                        title="Send Real-Time Notification to Client"
                      >
                        <Bell className="w-3 h-3 text-[#C5A880]" />
                        <span>Notify</span>
                      </button>

                      {/* Full Lead Workspace Link */}
                      <Link
                        to={`/broker/leads/${lead._id}`}
                        className="px-3 py-1.5 bg-[#262629] hover:bg-[#323236] text-xs uppercase tracking-wider text-[#C5A880] border border-[#C5A880]/40 hover:border-[#C5A880] inline-flex items-center gap-1 font-semibold transition-all"
                      >
                        <span>Engage</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Direct Notification Modal */}
      {selectedLeadForNotify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#18181A] border border-[#2A2A2D] shadow-2xl p-6 sm:p-8 relative text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2D] mb-6">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#C5A880]" />
                <h3 className="font-serif text-lg font-light text-[#F7F5F0]">
                  Dispatch Client Notification
                </h3>
              </div>
              <button
                onClick={() => setSelectedLeadForNotify(null)}
                className="text-[#71717A] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {notifySuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#C5A880] mx-auto animate-bounce" />
                <h4 className="font-serif text-xl font-light text-[#F7F5F0]">
                  Notification Dispatched
                </h4>
                <p className="text-xs text-[#A3A3A8] max-w-sm mx-auto leading-relaxed">
                  Real-time alert transmitted to {selectedLeadForNotify.name} ({selectedLeadForNotify.email}).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendNotification} className="space-y-4">
                {notifyError && (
                  <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{notifyError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#A3A3A8] mb-1">
                    Recipient Client
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedLeadForNotify.name} • ${selectedLeadForNotify.email}`}
                    className="w-full bg-[#121214] border border-[#2A2A2D] p-2.5 text-xs text-[#A1A1AA] cursor-not-allowed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#A3A3A8] mb-1">
                    Alert Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={notifyTitle}
                    onChange={(e) => setNotifyTitle(e.target.value)}
                    placeholder="e.g. Viewing confirmation, off-plan allocation, pricing update"
                    className="w-full bg-[#121214] border border-[#2A2A2D] focus:border-[#C5A880] p-2.5 text-xs text-[#F7F5F0] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#A3A3A8] mb-1">
                    Notification Category
                  </label>
                  <select
                    value={notifyType}
                    onChange={(e) => setNotifyType(e.target.value)}
                    className="w-full bg-[#121214] border border-[#2A2A2D] focus:border-[#C5A880] p-2.5 text-xs text-[#F7F5F0] focus:outline-none"
                  >
                    <option value="STATUS_CHANGE">Pipeline Status Update</option>
                    <option value="VIEWING_SCHEDULED">Viewing Itinerary & Slot</option>
                    <option value="BROKER_ASSIGNED">Broker Mandate Introduction</option>
                    <option value="GENERAL">Confidential Property Advisory Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#A3A3A8] mb-1">
                    Client Notification Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={notifyMessage}
                    onChange={(e) => setNotifyMessage(e.target.value)}
                    placeholder="Enter message text that will display in the client's notification bell and personal dashboard..."
                    className="w-full bg-[#121214] border border-[#2A2A2D] focus:border-[#C5A880] p-2.5 text-xs text-[#F7F5F0] focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#2A2A2D]">
                  <button
                    type="button"
                    onClick={() => setSelectedLeadForNotify(null)}
                    className="px-4 py-2 border border-[#2A2A2D] text-xs uppercase text-[#A3A3A8] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingNotify}
                    className="px-5 py-2 bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] font-bold text-xs uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingNotify ? 'Transmitting...' : 'Send Live Alert'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
