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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D4]">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Client Acquisition Engine</span>
          </div>
          <h1 className="font-display text-3xl font-light tracking-tight text-[#102A43]">
            Leads & Inquiries Pipeline
          </h1>
          <p className="text-xs text-[#6B7280] font-light mt-1">
            Track inquiries, update pipeline statuses, and dispatch real-time property notifications directly to clients.
          </p>
        </div>

        {newLeadsCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFDF8] border border-[#B08D57] text-[#B08D57] text-xs font-mono shadow-sm">
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
                ? 'bg-[#102A43] border-[#102A43] text-[#FFFDF8] font-semibold shadow-sm'
                : 'border-[#E9E1D4] bg-[#FFFDF8] text-[#6B7280] hover:text-[#102A43] hover:border-[#B08D57]'
            }`}
          >
            <span>{st || 'All Pipeline Stages'}</span>
            {st === 'NEW' && newLeadsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#B08D57] text-[#FFFDF8] rounded-full text-[9px] font-bold">
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
            <div key={i} className="h-24 bg-[#FFFDF8] border border-[#E9E1D4] animate-pulse" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-24 bg-[#FFFDF8] border border-[#E9E1D4] p-8 text-xs text-[#6B7280] space-y-2 shadow-sm">
          <Users2 className="w-8 h-8 mx-auto text-[#B08D57] mb-2 opacity-50" />
          <p>No active leads currently in this pipeline stage.</p>
        </div>
      ) : (
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F3EA] border-b border-[#E9E1D4] text-[#6B7280] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Lead ID & Client</th>
                <th className="p-4">Interested Residence</th>
                <th className="p-4">Target Budget</th>
                <th className="p-4">Source</th>
                <th className="p-4">Stage</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1D4]">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-[#F7F3EA]/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#102A43] border border-[#B08D57] flex items-center justify-center text-[#D8C3A5] font-display text-xs font-semibold shrink-0">
                        {lead.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-display text-sm font-medium text-[#102A43] block">
                          {lead.name}
                        </span>
                        <span className="text-[10px] text-[#B08D57] font-mono">
                          {lead.leadId} • {lead.preferredContactMethod}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {lead.property ? (
                      <div>
                        <span className="text-[#102A43] font-medium block truncate max-w-xs">
                          {lead.property.title}
                        </span>
                        <span className="text-[10px] text-[#6B7280]">
                          {lead.property.community} • {formatAED(lead.property.priceAED)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#6B7280] italic">General Advisory Mandate</span>
                    )}
                  </td>
                  <td className="p-4 font-display text-sm text-[#102A43]">
                    {lead.estimatedBudgetAED ? formatAED(lead.estimatedBudgetAED) : '—'}
                  </td>
                  <td className="p-4 font-mono text-[10px] text-[#6B7280]">
                    {lead.source}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 font-mono font-semibold ${
                        lead.status === 'NEW'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : lead.status === 'VIEWING'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : lead.status === 'CONVERTED'
                          ? 'bg-emerald-50 text-[#5D7A65] border border-emerald-200'
                          : 'bg-[#F7F3EA] text-[#6B7280] border border-[#E9E1D4]'
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
                        className="px-2.5 py-1.5 border border-[#E9E1D4] hover:border-[#B08D57] text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8] text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                        title="Send Real-Time Notification to Client"
                      >
                        <Bell className="w-3 h-3 text-[#B08D57]" />
                        <span>Notify</span>
                      </button>

                      {/* Full Lead Workspace Link */}
                      <Link
                        to={`/broker/leads/${lead._id}`}
                        className="px-3 py-1.5 bg-[#102A43] hover:bg-[#1E3A5F] text-xs uppercase tracking-wider text-[#FFFDF8] border border-[#102A43] inline-flex items-center gap-1 font-semibold transition-all shadow-sm"
                      >
                        <span>Engage</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#B08D57]" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2135]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#FFFDF8] border border-[#E9E1D4] shadow-2xl p-6 sm:p-8 relative text-[#3E4852]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E9E1D4] mb-6">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#B08D57]" />
                <h3 className="font-display text-xl font-normal text-[#102A43]">
                  Dispatch Client Notification
                </h3>
              </div>
              <button
                onClick={() => setSelectedLeadForNotify(null)}
                className="text-[#6B7280] hover:text-[#102A43] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {notifySuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#5D7A65] mx-auto animate-bounce" />
                <h4 className="font-display text-xl font-normal text-[#102A43]">
                  Notification Dispatched
                </h4>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto leading-relaxed">
                  Real-time alert transmitted to {selectedLeadForNotify.name} ({selectedLeadForNotify.email}).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendNotification} className="space-y-4">
                {notifyError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{notifyError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                    Recipient Client
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedLeadForNotify.name} • ${selectedLeadForNotify.email}`}
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2.5 text-xs text-[#6B7280] cursor-not-allowed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                    Alert Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={notifyTitle}
                    onChange={(e) => setNotifyTitle(e.target.value)}
                    placeholder="e.g. Viewing confirmation, off-plan allocation, pricing update"
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                    Notification Category
                  </label>
                  <select
                    value={notifyType}
                    onChange={(e) => setNotifyType(e.target.value)}
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none"
                  >
                    <option value="STATUS_CHANGE">Pipeline Status Update</option>
                    <option value="VIEWING_SCHEDULED">Viewing Itinerary & Slot</option>
                    <option value="BROKER_ASSIGNED">Broker Mandate Introduction</option>
                    <option value="GENERAL">Confidential Property Advisory Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                    Client Notification Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={notifyMessage}
                    onChange={(e) => setNotifyMessage(e.target.value)}
                    placeholder="Enter message text that will display in the client's notification bell and personal dashboard..."
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#E9E1D4]">
                  <button
                    type="button"
                    onClick={() => setSelectedLeadForNotify(null)}
                    className="px-4 py-2 border border-[#E9E1D4] text-xs uppercase text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingNotify}
                    className="px-5 py-2 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-[#B08D57]" />
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
