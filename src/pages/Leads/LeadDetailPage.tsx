import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { brokerApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  ShieldCheck,
  Send,
  Building2,
  CheckCircle2,
  AlertCircle,
  Bell
} from 'lucide-react';

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lead, setLead] = useState<any | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [score, setScore] = useState<any>(null);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Viewing scheduler state
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [viewingDate, setViewingDate] = useState('');
  const [viewingSlot, setViewingSlot] = useState('15:00 - 16:30 GST');
  const [isScheduling, setIsScheduling] = useState(false);

  // Direct Client Notification state
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');
  const [notifyType, setNotifyType] = useState('STATUS_CHANGE');
  const [isSendingNotify, setIsSendingNotify] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);

  const handleSendClientNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !notifyMessage.trim()) return;
    setIsSendingNotify(true);
    setNotifyError(null);
    try {
      await brokerApi.sendClientNotification({
        recipientEmail: lead.email,
        recipientName: lead.name,
        title: notifyTitle.trim() || `Update on ${lead.property?.title || 'your residence inquiry'}`,
        message: notifyMessage.trim(),
        type: notifyType,
        link: '/profile'
      });
      // Also log as broker activity note
      await brokerApi.addLeadNote(
        lead._id,
        `Notification sent to client: "${notifyTitle.trim() || 'Property Update'}" - ${notifyMessage.trim()}`
      );
      setNotifySuccess(true);
      setTimeout(() => {
        setNotifySuccess(false);
        setIsNotifyModalOpen(false);
        setNotifyTitle('');
        setNotifyMessage('');
      }, 2000);
      await loadData();
    } catch (err: any) {
      setNotifyError(err.message || 'Failed to send notification to client');
    } finally {
      setIsSendingNotify(false);
    }
  };

  const loadData = async () => {
    if (!id) return;
    try {
      const res = await brokerApi.getLeadById(id);
      setLead(res.lead);
      setActivities(res.activities || []);
      setScore(res.score);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!lead) return;
    try {
      await brokerApi.updateLeadStatus(lead._id, newStatus, `Stage updated to ${newStatus}`);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !lead) return;
    setIsAddingNote(true);
    try {
      await brokerApi.addLeadNote(lead._id, newNote);
      setNewNote('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleScheduleViewing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !viewingDate) return;
    setIsScheduling(true);
    try {
      await brokerApi.createViewing({
        property: lead.property?._id,
        lead: lead._id,
        viewingDate: new Date(viewingDate),
        viewingTimeSlot: viewingSlot,
        status: 'CONFIRMED'
      });
      // Automatically advance status to VIEWING
      await brokerApi.updateLeadStatus(lead._id, 'VIEWING', `Viewing scheduled for ${viewingDate} (${viewingSlot})`);
      setIsViewingModalOpen(false);
      await loadData();
      alert('Private viewing appointment confirmed!');
    } catch (err: any) {
      alert(err.message || 'Failed to schedule viewing');
    } finally {
      setIsScheduling(false);
    }
  };

  if (isLoading || !lead) {
    return <div className="p-12 text-xs text-[#71717A]">Loading client mandate...</div>;
  }

  const cleanPhone = lead.mobile.replace(/[^0-9+]/g, '');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E9E1D4]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/broker/leads')}
            className="p-2 border border-[#E9E1D4] text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold">
                {lead.leadId}
              </span>
              <span className="bg-[#F7F3EA] text-[9px] uppercase tracking-wider text-[#6B7280] border border-[#E9E1D4] px-2 py-0.5 font-medium">
                {lead.leadType}
              </span>
            </div>
            <h1 className="font-display text-3xl font-light text-[#102A43]">{lead.name}</h1>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono">Pipeline Stage:</span>
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-[#FFFDF8] border border-[#B08D57] text-[#102A43] text-xs font-semibold uppercase tracking-wider px-3 py-1.5 focus:outline-none shadow-sm"
          >
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="VIEWING">VIEWING</option>
            <option value="NEGOTIATION">NEGOTIATION</option>
            <option value="CONVERTED">CONVERTED (Closed)</option>
            <option value="LOST">LOST</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Client Information & Communications */}
        <div className="lg:col-span-7 space-y-6">
          {/* Confidential Contact Workspace */}
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 space-y-4 text-xs shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D4]">
              <h3 className="font-display text-xl font-normal text-[#102A43]">Confidential Contact Details</h3>
              <div className="flex items-center gap-1 text-[10px] text-[#B08D57] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Broker Clearance</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[#6B7280] block mb-0.5 text-[10px] uppercase font-mono">Mobile Telephone</span>
                <span className="font-mono text-sm text-[#102A43] font-medium">{lead.mobile}</span>
              </div>
              <div>
                <span className="text-[#6B7280] block mb-0.5 text-[10px] uppercase font-mono">Email Address</span>
                <span className="font-mono text-sm text-[#102A43] font-medium">{lead.email}</span>
              </div>
              <div>
                <span className="text-[#6B7280] block mb-0.5 text-[10px] uppercase font-mono">Preferred Channel</span>
                <span className="text-[#B08D57] font-semibold uppercase">{lead.preferredContactMethod}</span>
              </div>
              <div>
                <span className="text-[#6B7280] block mb-0.5 text-[10px] uppercase font-mono">Lead Source</span>
                <span className="text-[#3E4852] font-mono">{lead.source}</span>
              </div>
            </div>

            {/* Direct Communication Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E9E1D4]">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#5D7A65] border border-emerald-200 flex items-center justify-center gap-1.5 uppercase font-semibold text-[11px] transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:${cleanPhone}`}
                className="py-2.5 bg-[#FFFDF8] hover:bg-[#F7F3EA] text-[#102A43] border border-[#E9E1D4] flex items-center justify-center gap-1.5 uppercase font-medium text-[11px] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Client</span>
              </a>
              <button
                onClick={() => setIsViewingModalOpen(true)}
                className="py-2.5 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] flex items-center justify-center gap-1.5 uppercase font-semibold text-[11px] transition-colors shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-[#B08D57]" />
                <span>Book Viewing</span>
              </button>
              <button
                onClick={() => {
                  setNotifyTitle(`Update from Elena Rostova: ${lead.property?.title || 'Private Residence'}`);
                  setIsNotifyModalOpen(true);
                }}
                className="py-2.5 bg-[#FFFDF8] hover:bg-[#F7F3EA] text-[#B08D57] border border-[#B08D57]/50 flex items-center justify-center gap-1.5 uppercase font-semibold text-[11px] transition-colors"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Notify Client</span>
              </button>
            </div>
          </div>

          {/* Client Message */}
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 text-xs space-y-2 shadow-sm">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono font-medium block">
              Inquiry / Client Statement
            </span>
            <p className="text-sm text-[#3E4852] leading-relaxed italic bg-[#F7F3EA] p-4 border border-[#E9E1D4]">
              "{lead.message || 'No additional message text provided.'}"
            </p>
          </div>

          {/* Activity Notes Section */}
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 text-xs space-y-4 shadow-sm">
            <h3 className="font-display text-xl font-normal text-[#102A43]">Confidential Broker Notes</h3>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="Record client requirements, budget verification, call outcome, or viewing preferences..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-3 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingNote}
                  className="bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] px-4 py-2 uppercase font-semibold text-[10px] tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3 h-3 text-[#B08D57]" />
                  <span>{isAddingNote ? 'Saving Note...' : 'Save Activity Note'}</span>
                </button>
              </div>
            </form>

            <div className="space-y-3 pt-4 border-t border-[#E9E1D4]">
              {lead.notes?.map((n: any, idx: number) => (
                <div key={idx} className="p-3 bg-[#F7F3EA] border border-[#E9E1D4] space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-[#6B7280] font-mono">
                    <span className="text-[#B08D57] font-semibold">{n.author}</span>
                    <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-[#3E4852] leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Interested Residence & Audit Timeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interested Residence */}
          {lead.property && (
            <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 text-xs space-y-3 shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono">
                Mandate Residence
              </span>
              <div className="aspect-[16/9] bg-[#F7F3EA] overflow-hidden border border-[#E9E1D4]">
                <img
                  src={lead.property.featuredImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="font-display text-lg font-medium text-[#102A43] leading-snug">
                {lead.property.title}
              </h4>
              <div className="flex justify-between items-center pt-2 border-t border-[#E9E1D4]">
                <span className="text-[#6B7280]">{lead.property.community}</span>
                <span className="font-display text-base text-[#B08D57] font-semibold">
                  {formatAED(lead.property.priceAED)}
                </span>
              </div>
            </div>
          )}

          {/* Lead Qualification Score */}
          {score && (
            <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 text-xs space-y-3 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono">Lead Tier</span>
                <span className="text-[10px] font-mono font-bold bg-[#F7F3EA] border border-[#B08D57] text-[#B08D57] px-2 py-0.5">
                  {score.tier}
                </span>
              </div>
              <div className="font-display text-3xl text-[#102A43]">
                {score.score} <span className="text-xs text-[#6B7280] font-ui">/ 100</span>
              </div>
              <div className="space-y-1.5 pt-2 border-t border-[#E9E1D4]">
                {score.indicators?.map((ind: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#3E4852]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5D7A65] shrink-0" />
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chronological Activity Audit Trail */}
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 text-xs space-y-4 shadow-sm">
            <h3 className="font-display text-lg font-normal text-[#102A43]">Lifecycle Audit Trail</h3>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {activities.map((act) => (
                <div key={act._id} className="p-2.5 bg-[#F7F3EA] border border-[#E9E1D4] space-y-1 text-[11px]">
                  <div className="flex justify-between items-center text-[9px] text-[#6B7280] font-mono">
                    <span className="text-[#B08D57] font-semibold">{act.type}</span>
                    <span>{new Date(act.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-[#3E4852]">{act.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Viewing Modal */}
      {isViewingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2135]/60 backdrop-blur-sm">
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] max-w-md w-full p-6 text-[#3E4852] space-y-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#E9E1D4]">
              <h3 className="font-display text-xl font-normal text-[#102A43]">Schedule Private Viewing</h3>
              <button onClick={() => setIsViewingModalOpen(false)} className="text-[#6B7280] hover:text-[#102A43]">
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleViewing} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">Viewing Date</label>
                <input
                  type="date"
                  required
                  value={viewingDate}
                  onChange={(e) => setViewingDate(e.target.value)}
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43] focus:border-[#B08D57] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">Time Slot (GST)</label>
                <select
                  value={viewingSlot}
                  onChange={(e) => setViewingSlot(e.target.value)}
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43] focus:border-[#B08D57] focus:outline-none"
                >
                  <option value="10:00 - 11:30 GST">10:00 - 11:30 GST (Morning Inspection)</option>
                  <option value="12:00 - 13:30 GST">12:00 - 13:30 GST (Noon Inspection)</option>
                  <option value="15:00 - 16:30 GST">15:00 - 16:30 GST (Afternoon Inspection)</option>
                  <option value="17:00 - 18:30 GST">17:00 - 18:30 GST (Sunset Champagne Tour)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E9E1D4]">
                <button
                  type="button"
                  onClick={() => setIsViewingModalOpen(false)}
                  className="px-4 py-2 border border-[#E9E1D4] text-xs uppercase text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScheduling}
                  className="px-4 py-2 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] font-semibold text-xs uppercase tracking-wider shadow-sm"
                >
                  {isScheduling ? 'Confirming...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notify Client Modal */}
      {isNotifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2135]/60 backdrop-blur-sm">
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] max-w-md w-full p-6 text-[#3E4852] space-y-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#E9E1D4]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#B08D57]" />
                <h3 className="font-display text-xl font-normal text-[#102A43]">Send Client Notification</h3>
              </div>
              <button
                onClick={() => setIsNotifyModalOpen(false)}
                className="text-[#6B7280] hover:text-[#102A43]"
              >
                ✕
              </button>
            </div>

            {notifySuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#5D7A65] mx-auto animate-bounce" />
                <p className="font-display text-lg text-[#102A43]">Notification Transmitted</p>
                <p className="text-xs text-[#6B7280]">
                  Client {lead.name} ({lead.email}) received this property alert in real-time.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendClientNotification} className="space-y-4">
                {notifyError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{notifyError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">
                    Recipient Client
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${lead.name} (${lead.email})`}
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#6B7280] cursor-not-allowed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">
                    Alert Title / Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={notifyTitle}
                    onChange={(e) => setNotifyTitle(e.target.value)}
                    placeholder="e.g. Viewing confirmation or off-market opportunity"
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43] focus:border-[#B08D57] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">
                    Notification Category
                  </label>
                  <select
                    value={notifyType}
                    onChange={(e) => setNotifyType(e.target.value)}
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43] focus:border-[#B08D57] focus:outline-none"
                  >
                    <option value="STATUS_CHANGE">Pipeline Status Update</option>
                    <option value="VIEWING_SCHEDULED">Viewing Itinerary & Slot</option>
                    <option value="BROKER_ASSIGNED">Broker Mandate Introduction</option>
                    <option value="GENERAL">Confidential Property Advisory Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">
                    Client Notification Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={notifyMessage}
                    onChange={(e) => setNotifyMessage(e.target.value)}
                    placeholder="Enter message text that will be displayed in the client's notification bell and profile..."
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2.5 text-xs text-[#102A43] focus:border-[#B08D57] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-[#E9E1D4]">
                  <button
                    type="button"
                    onClick={() => setIsNotifyModalOpen(false)}
                    className="px-4 py-2 border border-[#E9E1D4] text-xs uppercase text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingNotify}
                    className="px-4 py-2 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] font-semibold text-xs uppercase tracking-wider disabled:opacity-50 shadow-sm"
                  >
                    {isSendingNotify ? 'Transmitting...' : 'Send Live Alert'}
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
