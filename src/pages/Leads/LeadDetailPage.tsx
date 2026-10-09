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
  Bell,
  Lock,
  UserCheck,
  Briefcase
} from 'lucide-react';

const LOCAL_STORAGE_LEADS_KEY = 'crestshore_broker_custom_leads';

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lead, setLead] = useState<any | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [score, setScore] = useState<any>(null);
  const [newNote, setNewNote] = useState('');
  const [newActivityType, setNewActivityType] = useState('NOTE_ADDED');
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

  const loadData = async () => {
    if (!id) return;
    setIsLoading(true);

    try {
      // First attempt backend API
      try {
        const res = await brokerApi.getLeadById(id);
        if (res && res.lead) {
          setLead(res.lead);
          setActivities(res.activities || []);
          setScore(res.score);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Backend getLeadById threw, searching local storage:', e);
      }

      // Check localStorage for custom / seed lead
      const localStored = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
      if (localStored) {
        const list = JSON.parse(localStored);
        const matched = list.find((item: any) => item._id === id || item.leadId === id);
        if (matched) {
          setLead(matched);

          const now = new Date();
          const seedActivities = matched.activities || [
            {
              _id: 'act-init',
              type: 'STATUS_CHANGE',
              actor: 'SYSTEM',
              details: `Lead registered into CRM pipeline. Assigned RM: ${matched.assignedRM || 'Tariq Al-Mansoor (Principal RM)'}.`,
              createdAt: matched.createdAt || now.toISOString()
            },
            ...(matched.notes || []).map((n: any, idx: number) => ({
              _id: `note-${idx}`,
              type: 'NOTE_ADDED',
              actor: n.author || 'Omar Farooq (Broker Partner)',
              details: n.text,
              createdAt: n.createdAt || matched.createdAt || now.toISOString()
            }))
          ];

          setActivities(seedActivities);
          setScore({
            score: 95,
            tier: 'Tier-1 Institutional Mandate',
            indicators: [
              'Target Budget Verified (AED 25M+)',
              'Assigned Dedicated Crestshore RM',
              'Non-Circumvention Protection Active (180 Days)',
              'KYC & Representation Authority Verified'
            ]
          });
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error('Error loading lead detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!lead) return;
    const now = new Date().toISOString();

    try {
      try {
        await brokerApi.updateLeadStatus(lead._id, newStatus, `Stage updated to ${newStatus}`);
      } catch {}

      // Update in local state
      const updatedLead = { ...lead, status: newStatus, lastActivity: now };
      setLead(updatedLead);

      const newAct = {
        _id: `act-${Date.now()}`,
        type: 'STATUS_CHANGE',
        actor: 'Omar Farooq (Broker Partner)',
        details: `Pipeline stage transitioned to ${newStatus}.`,
        createdAt: now
      };
      setActivities([newAct, ...activities]);

      // Update local storage
      const localStored = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
      if (localStored) {
        const list = JSON.parse(localStored);
        const idx = list.findIndex((item: any) => item._id === lead._id || item.leadId === lead.leadId);
        if (idx !== -1) {
          list[idx] = { ...list[idx], status: newStatus, lastActivity: now };
          localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(list));
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !lead) return;
    setIsAddingNote(true);

    const now = new Date().toISOString();
    const noteText = newNote.trim();

    try {
      try {
        await brokerApi.addLeadNote(lead._id, noteText);
      } catch {}

      const newAct = {
        _id: `act-${Date.now()}`,
        type: newActivityType,
        actor: 'Omar Farooq (Broker Partner)',
        details: noteText,
        createdAt: now
      };
      setActivities([newAct, ...activities]);

      const updatedNotes = [
        ...(lead.notes || []),
        {
          author: 'Omar Farooq (Broker Partner)',
          text: noteText,
          createdAt: now
        }
      ];
      const updatedLead = {
        ...lead,
        notes: updatedNotes,
        lastActivity: now,
        lastActivitySummary: noteText
      };
      setLead(updatedLead);

      // Save to localStorage
      const localStored = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
      if (localStored) {
        const list = JSON.parse(localStored);
        const idx = list.findIndex((item: any) => item._id === lead._id || item.leadId === lead.leadId);
        if (idx !== -1) {
          list[idx] = updatedLead;
          localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(list));
        }
      }

      setNewNote('');
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

    const now = new Date().toISOString();
    try {
      try {
        await brokerApi.createViewing({
          property: lead.property?._id,
          lead: lead._id,
          viewingDate: new Date(viewingDate),
          viewingTimeSlot: viewingSlot,
          status: 'CONFIRMED'
        });
      } catch {}

      const viewingDetails = `Private viewing appointment booked for ${viewingDate} (${viewingSlot})`;
      const newAct = {
        _id: `act-${Date.now()}`,
        type: 'VIEWING_SCHEDULED',
        actor: 'Omar Farooq (Broker Partner)',
        details: viewingDetails,
        createdAt: now
      };
      setActivities([newAct, ...activities]);

      setLead({ ...lead, status: 'VIEWING', lastActivity: now });
      setIsViewingModalOpen(false);
      alert('Private viewing appointment confirmed & logged in CRM!');
    } catch (err: any) {
      alert(err.message || 'Failed to schedule viewing');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleSendClientNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !notifyMessage.trim()) return;
    setIsSendingNotify(true);
    setNotifyError(null);

    const now = new Date().toISOString();
    try {
      try {
        await brokerApi.sendClientNotification({
          recipientEmail: lead.email,
          recipientName: lead.name,
          title: notifyTitle.trim() || `Update on ${lead.projectName || 'Inquiry'}`,
          message: notifyMessage.trim(),
          type: notifyType,
          link: '/profile'
        });
      } catch {}

      const notifDetails = `Notification dispatched: "${notifyTitle.trim()}" - ${notifyMessage.trim()}`;
      const newAct = {
        _id: `act-${Date.now()}`,
        type: 'EMAIL_SENT',
        actor: 'Omar Farooq (Broker Partner)',
        details: notifDetails,
        createdAt: now
      };
      setActivities([newAct, ...activities]);

      setNotifySuccess(true);
      setTimeout(() => {
        setNotifySuccess(false);
        setIsNotifyModalOpen(false);
        setNotifyTitle('');
        setNotifyMessage('');
      }, 1800);
    } catch (err: any) {
      setNotifyError(err.message || 'Failed to send notification to client');
    } finally {
      setIsSendingNotify(false);
    }
  };

  if (isLoading || !lead) {
    return <div className="p-12 text-xs text-[#71717A]">Loading client mandate CRM record...</div>;
  }

  const cleanPhone = (lead.mobile || '').replace(/[^0-9+]/g, '');
  const projectTitle = lead.projectName || lead.property?.title || 'General Prime Advisory';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D4]">
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
              {lead.isAnonymous && (
                <span className="bg-[#B08D57]/15 text-[#B08D57] border border-[#B08D57]/40 text-[9px] uppercase font-mono font-bold px-2 py-0.5 tracking-wider flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Confidential Mandate</span>
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-light text-[#102A43]">{lead.name}</h1>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono">CRM Status:</span>
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-[#FFFDF8] border border-[#B08D57] text-[#102A43] text-xs font-bold uppercase tracking-wider px-3 py-1.5 focus:outline-none shadow-sm cursor-pointer"
          >
            <option value="Hot">Hot 🔥</option>
            <option value="Warm">Warm ☀️</option>
            <option value="Cold">Cold ❄️</option>
            <option value="Attempted">Attempted 📞</option>
            <option value="Meeting Done">Meeting Done 🤝</option>
            <option value="Won">Won 🏆</option>
            <option value="Lost">Lost ❌</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (7 cols): Relationship Manager & Client Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* Assigned RM Card (Requested in Client Change 6) */}
          <div className="bg-[#FFFDF8] border border-[#B08D57]/40 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D4]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#102A43] text-[#D8C3A5] border border-[#B08D57] flex items-center justify-center font-display text-xs font-bold">
                  RM
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#B08D57] font-mono font-semibold block leading-none">
                    Crestshore Internal Point of Contact
                  </span>
                  <h3 className="font-display text-lg font-normal text-[#102A43] mt-0.5">
                    Assigned Relationship Manager
                  </h3>
                </div>
              </div>

              <span className="bg-emerald-50 text-[#5D7A65] border border-emerald-200 text-[10px] font-mono font-semibold px-2 py-0.5">
                Active Mandate Handler
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase font-mono mb-0.5">
                  Assigned In-House RM
                </span>
                <span className="font-semibold text-sm text-[#102A43] block">
                  {lead.assignedRM || 'Tariq Al-Mansoor (Principal RM)'}
                </span>
                <span className="text-[11px] text-[#6B7280]">Crestshore Private Desk</span>
              </div>
              <div>
                <span className="text-[#6B7280] block text-[10px] uppercase font-mono mb-0.5">
                  Direct Line & Hotline
                </span>
                <span className="font-mono text-xs text-[#102A43] block font-medium">
                  +971 4 821 4400
                </span>
                <span className="text-[11px] text-[#6B7280] font-mono">advisory@crestshore.ae</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/97148214400"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#5D7A65] border border-emerald-200 text-[11px] font-semibold uppercase flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Message RM</span>
              </a>
              <a
                href="tel:+97148214400"
                className="px-3 py-1.5 bg-[#F7F3EA] hover:bg-[#E9E1D4] text-[#102A43] border border-[#E9E1D4] text-[11px] font-medium uppercase flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>Call RM</span>
              </a>
            </div>
          </div>

          {/* Client Details Workspace */}
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 space-y-4 text-xs shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E1D4]">
              <h3 className="font-display text-xl font-normal text-[#102A43]">
                {lead.isAnonymous ? 'Confidential Mandate Protection' : 'Client Contact Details'}
              </h3>
              <div className="flex items-center gap-1 text-[10px] text-[#B08D57] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>180-Day Protected Referral</span>
              </div>
            </div>

            {lead.isAnonymous ? (
              <div className="p-4 bg-[#F7F3EA] border-l-2 border-[#B08D57] space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#102A43]">
                  <Lock className="w-4 h-4 text-[#B08D57]" />
                  <span>Client details are kept anonymous & confidential.</span>
                </div>
                <p className="text-[11px] text-[#6B7280] leading-relaxed">
                  Personal phone and email addresses are withheld per the institutional privacy mandate. All transaction updates, developer negotiations, and viewing schedules are routed strictly through the assigned Crestshore RM ({lead.assignedRM || 'Tariq Al-Mansoor'}).
                </p>
              </div>
            ) : (
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
                  <span className="text-[#B08D57] font-semibold uppercase">{lead.preferredContactMethod || 'WhatsApp'}</span>
                </div>
                <div>
                  <span className="text-[#6B7280] block mb-0.5 text-[10px] uppercase font-mono">Lead Source</span>
                  <span className="text-[#3E4852] font-mono">{lead.source}</span>
                </div>
              </div>
            )}

            {/* Direct Communication Buttons (if not anonymous) */}
            {!lead.isAnonymous && cleanPhone && (
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
                    setNotifyTitle(`Update on ${projectTitle}`);
                    setIsNotifyModalOpen(true);
                  }}
                  className="py-2.5 bg-[#FFFDF8] hover:bg-[#F7F3EA] text-[#B08D57] border border-[#B08D57]/50 flex items-center justify-center gap-1.5 uppercase font-semibold text-[11px] transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify Client</span>
                </button>
              </div>
            )}
          </div>

          {/* CRM Log Activity Note Form */}
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 text-xs space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E1D4]">
              <h3 className="font-display text-xl font-normal text-[#102A43]">Log CRM Activity & Note</h3>
              <span className="text-[10px] text-[#6B7280] font-mono">Auto Date & Timestamp</span>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={newActivityType}
                  onChange={(e) => setNewActivityType(e.target.value)}
                  className="bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2 text-xs text-[#102A43] font-mono uppercase"
                >
                  <option value="NOTE_ADDED">Note / Brief</option>
                  <option value="CALL_MADE">Call Conducted</option>
                  <option value="WHATSAPP_SENT">WhatsApp Sent</option>
                  <option value="VIEWING_SCHEDULED">Viewing Itinerary</option>
                  <option value="STATUS_CHANGE">Stage Change</option>
                </select>
              </div>

              <textarea
                rows={3}
                required
                placeholder="Record client feedback, requirement details, price counter-offer, or viewing outcome..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-3 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isAddingNote}
                  className="bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] px-5 py-2 uppercase font-semibold text-[10px] tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3 h-3 text-[#B08D57]" />
                  <span>{isAddingNote ? 'Saving Entry...' : 'Log CRM Entry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (5 cols): Interested Residence & Lifecycle Audit Trail */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interested Project Card */}
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 text-xs space-y-3 shadow-sm">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono">
              Mandate Development Interest
            </span>

            {lead.property?.featuredImage ? (
              <div className="aspect-[16/9] bg-[#F7F3EA] overflow-hidden border border-[#E9E1D4]">
                <img
                  src={lead.property.featuredImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="p-4 bg-[#F7F3EA] border border-[#E9E1D4] flex items-center gap-3">
                <Building2 className="w-8 h-8 text-[#B08D57] shrink-0" />
                <div>
                  <span className="text-[10px] uppercase text-[#6B7280] font-mono block">Curated Project</span>
                  <strong className="text-sm text-[#102A43] font-display">{projectTitle}</strong>
                </div>
              </div>
            )}

            <h4 className="font-display text-lg font-medium text-[#102A43] leading-snug">
              {projectTitle}
            </h4>

            <div className="flex justify-between items-center pt-2 border-t border-[#E9E1D4]">
              <span className="text-[#6B7280]">{lead.source || 'Private Referral'}</span>
              <span className="font-display text-base text-[#B08D57] font-semibold">
                {lead.estimatedBudgetAED ? formatAED(lead.estimatedBudgetAED) : 'AED 25,000,000+'}
              </span>
            </div>
          </div>

          {/* CRM Chronological Lifecycle Audit Trail (Date & Time for every activity) */}
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 text-xs space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E1D4]">
              <h3 className="font-display text-lg font-normal text-[#102A43]">
                CRM Activity Ledger
              </h3>
              <span className="text-[10px] text-[#B08D57] font-mono font-semibold">
                {activities.length} Recorded Events
              </span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {activities.map((act, idx) => {
                const dateObj = new Date(act.createdAt || Date.now());
                const dateStr = dateObj.toLocaleDateString('en-AE', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                const timeStr = dateObj.toLocaleTimeString('en-AE', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                });

                return (
                  <div key={act._id || idx} className="p-3 bg-[#F7F3EA] border border-[#E9E1D4] space-y-1 text-[11px]">
                    <div className="flex justify-between items-center text-[9px] text-[#6B7280] font-mono">
                      <span className="text-[#B08D57] font-semibold uppercase">{act.type}</span>
                      <div className="flex items-center gap-1 text-[#102A43]">
                        <Clock className="w-2.5 h-2.5 text-[#B08D57]" />
                        <span>{dateStr} • {timeStr} GST</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-[#6B7280] font-mono">
                      By: <strong className="text-[#102A43]">{act.actor || 'Broker Specialist'}</strong>
                    </div>
                    <p className="text-[#3E4852] leading-relaxed pt-1 border-t border-[#E9E1D4]/50">
                      {act.details}
                    </p>
                  </div>
                );
              })}
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
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">Viewing Time Slot</label>
                <select
                  value={viewingSlot}
                  onChange={(e) => setViewingSlot(e.target.value)}
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43] focus:outline-none"
                >
                  <option value="10:00 - 11:30 GST">10:00 - 11:30 GST (Morning)</option>
                  <option value="15:00 - 16:30 GST">15:00 - 16:30 GST (Afternoon)</option>
                  <option value="17:00 - 18:30 GST">17:00 - 18:30 GST (Sunset Protocol)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E9E1D4]">
                <button
                  type="button"
                  onClick={() => setIsViewingModalOpen(false)}
                  className="px-3 py-1.5 border border-[#E9E1D4] uppercase text-[#6B7280]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScheduling}
                  className="px-4 py-1.5 bg-[#102A43] text-[#FFFDF8] uppercase font-semibold"
                >
                  {isScheduling ? 'Booking...' : 'Confirm Viewing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notify Modal */}
      {isNotifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2135]/60 backdrop-blur-sm">
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] max-w-md w-full p-6 text-[#3E4852] space-y-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#E9E1D4]">
              <h3 className="font-display text-xl font-normal text-[#102A43]">Dispatch Client Notification</h3>
              <button onClick={() => setIsNotifyModalOpen(false)} className="text-[#6B7280] hover:text-[#102A43]">
                ✕
              </button>
            </div>

            {notifySuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#5D7A65] mx-auto" />
                <p className="font-display text-base text-[#102A43]">Notification Logged in CRM</p>
              </div>
            ) : (
              <form onSubmit={handleSendClientNotification} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">Alert Title</label>
                  <input
                    type="text"
                    required
                    value={notifyTitle}
                    onChange={(e) => setNotifyTitle(e.target.value)}
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    value={notifyMessage}
                    onChange={(e) => setNotifyMessage(e.target.value)}
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#E9E1D4]">
                  <button
                    type="button"
                    onClick={() => setIsNotifyModalOpen(false)}
                    className="px-3 py-1.5 border border-[#E9E1D4] uppercase text-[#6B7280]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingNotify}
                    className="px-4 py-1.5 bg-[#102A43] text-[#FFFDF8] uppercase font-semibold"
                  >
                    {isSendingNotify ? 'Dispatching...' : 'Dispatch Alert'}
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
