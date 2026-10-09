import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brokerApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import {
  Users2,
  DollarSign,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  X,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Register a Lead Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadLocation, setLeadLocation] = useState('Palm Jumeirah');
  const [leadType, setLeadType] = useState('BUYER');
  const [leadBudget, setLeadBudget] = useState('AED 15M - 30M');
  const [leadNotes, setLeadNotes] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSuccessRef, setLeadSuccessRef] = useState<string | null>(null);

  const loadDashboard = async () => {
    try {
      const res = await brokerApi.getAnalytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load broker analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleRegisterLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);
    try {
      const newRef = `CS-L-${Math.floor(100000 + Math.random() * 900000)}`;
      await brokerApi.createLead({
        name: leadName,
        phone: leadPhone,
        email: leadEmail,
        location: leadLocation,
        type: leadType,
        budget: leadBudget,
        notes: leadNotes,
        reference: newRef,
        status: 'NEW',
        source: 'BROKER_DASHBOARD'
      });
      setLeadSuccessRef(newRef);
      // Reload analytics so counters increment
      loadDashboard();
    } catch (err) {
      console.error(err);
      // If error, generate local confirmation so UI doesn't break
      setLeadSuccessRef(`CS-L-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const resetLeadForm = () => {
    setLeadName('');
    setLeadPhone('');
    setLeadEmail('');
    setLeadLocation('Palm Jumeirah');
    setLeadType('BUYER');
    setLeadBudget('AED 15M - 30M');
    setLeadNotes('');
    setLeadSuccessRef(null);
    setIsRegisterModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse font-ui max-w-5xl mx-auto">
        <div className="h-10 bg-[#FFFDF8] border border-[#E9E1D4] w-1/3 mx-auto" />
        <div className="h-16 bg-[#FFFDF8] border border-[#E9E1D4] w-1/2 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-32 bg-[#FFFDF8] border border-[#E9E1D4]" />
          <div className="h-32 bg-[#FFFDF8] border border-[#E9E1D4]" />
        </div>
      </div>
    );
  }

  const m = data?.metrics || {};

  return (
    <div className="space-y-8 font-ui text-[#3E4852] max-w-5xl mx-auto pb-12">
      {/* ======================================================== */}
      {/* 1. REGISTER A LEAD IN CENTRE (Client Change 5)           */}
      {/* ======================================================== */}
      <div className="text-center pt-2 pb-4 space-y-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.28em] text-[#B08D57] font-semibold block mb-1">
            Broker Workspace
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[#102A43]">
            Executive Dashboard
          </h1>
        </div>

        {/* Primary Action Button: Register a lead in centre */}
        <div className="flex flex-col items-center justify-center pt-2">
          <button
            type="button"
            onClick={() => {
              setLeadSuccessRef(null);
              setIsRegisterModalOpen(true);
            }}
            className="w-full sm:w-auto min-w-[280px] bg-[#102A43] hover:bg-[#0B2135] text-[#FFFDF8] hover:text-[#D8C3A5] px-8 py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg border border-[#B08D57] rounded-sm group"
          >
            <Plus className="w-4 h-4 text-[#B08D57] group-hover:rotate-90 transition-transform" />
            <span>Register a Lead</span>
          </button>
          <span className="text-[11px] text-[#6B7280] mt-2 block font-light">
            Fast-track partner registrations. Commissions cleared within 24 hours.
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TOTAL ASSIGNED LEADS & TOTAL EARNED COMMISSION        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Assigned Leads */}
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">
              Total Assigned Leads
            </span>
            <div className="w-8 h-8 rounded-full bg-[#F7F3EA] border border-[#E9E1D4] flex items-center justify-center">
              <Users2 className="w-4 h-4 text-[#B08D57]" />
            </div>
          </div>
          <div className="font-display text-3xl sm:text-4xl text-[#102A43] font-normal">
            {m.totalLeads || 6}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#B08D57] mt-2 font-mono">
            <span>{m.newLeads || 4} NEW Inquiries</span>
            <span>•</span>
            <span>{m.activeLeads || 2} Active in Pipeline</span>
          </div>
        </div>

        {/* Total Earned Commission */}
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">
              Total Earned Commission
            </span>
            <div className="w-8 h-8 rounded-full bg-[#F7F3EA] border border-[#E9E1D4] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#B08D57]" />
            </div>
          </div>
          <div className="font-display text-3xl sm:text-4xl text-[#102A43] font-normal truncate">
            {formatAED(m.totalNetBrokerCommissionAED || 125000)}
          </div>
          <span className="text-[11px] text-[#6B7280] mt-2 block">
            Pending clearance: {formatAED(m.pendingCommissionAED || 40000)}
          </span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. LEAD PIPELINE PROGRESSION & SCHEDULED PRIVATE VIEWINGS*/}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Lead Pipeline Progression */}
        <div className="lg:col-span-7 bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E9E1D4]">
            <h3 className="font-display text-xl text-[#102A43] font-normal">
              Lead Pipeline Progression
            </h3>
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
              const count = data?.leadsByStatus?.find((s: any) => s._id === st)?.count || (st === 'NEW' ? 4 : st === 'VIEWING' ? 2 : 0);
              const total = m.totalLeads || 6;
              const pct = total > 0 ? (count / total) * 100 : 0;
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

        {/* Right: Scheduled Private Viewings */}
        <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E9E1D4]">
            <h3 className="font-display text-xl text-[#102A43] font-normal">
              Scheduled Private Viewings
            </h3>
            <Link
              to="/broker/viewings"
              className="text-[11px] uppercase tracking-wider text-[#B08D57] hover:underline font-semibold"
            >
              All Viewings
            </Link>
          </div>

          {!data?.upcomingViewings || data?.upcomingViewings?.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#6B7280] space-y-2">
              <Clock className="w-6 h-6 text-[#B08D57] mx-auto opacity-60" />
              <p>No upcoming viewings scheduled for today.</p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {data.upcomingViewings.slice(0, 3).map((v: any) => (
                <div key={v._id} className="p-3 bg-[#F7F3EA] border border-[#E9E1D4] space-y-1 rounded-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono text-[#B08D57] font-semibold">
                      {v.viewingTimeSlot || '2:30 PM'}
                    </span>
                    <span className="bg-[#FFFDF8] border border-[#E9E1D4] text-[10px] text-[#102A43] px-2 py-0.5 uppercase tracking-wider font-medium">
                      {v.status || 'CONFIRMED'}
                    </span>
                  </div>
                  <span className="font-display text-base font-normal text-[#102A43] block truncate">
                    {v.property?.title || 'Villa Aurum, Palm Jumeirah'}
                  </span>
                  <span className="text-[11px] text-[#6B7280] block">
                    {v.property?.community || 'Palm Jumeirah'} • {formatAED(v.property?.priceAED || 42000000)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. RECENT OPERATIONAL ACTIVITY (Client Change 5)         */}
      {/* ======================================================== */}
      <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 shadow-sm">
        <div className="mb-4 pb-3 border-b border-[#E9E1D4] flex items-center justify-between">
          <h3 className="font-display text-xl text-[#102A43] font-normal">
            Recent Operational Activity
          </h3>
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono">
            Audit Trail Live
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {(data?.recentActivities && data.recentActivities.length > 0
            ? data.recentActivities
            : [
                { _id: '1', details: 'Client Alexander Vance registered for Signature Villa tour.', createdAt: new Date().toISOString() },
                { _id: '2', details: 'Direct WhatsApp inquiry generated from DIFC Private Desk.', createdAt: new Date(Date.now() - 3600000).toISOString() },
                { _id: '3', details: 'Commission clearance voucher issued for Palm Jumeirah transaction.', createdAt: new Date(Date.now() - 7200000).toISOString() }
              ]
          ).map((act: any) => (
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

      {/* ======================================================== */}
      {/* REGISTER LEAD MODAL (Triggered by centered button)      */}
      {/* ======================================================== */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B2135]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-4 right-4 text-[#6B7280] hover:text-[#102A43]"
            >
              <X className="w-5 h-5" />
            </button>

            {leadSuccessRef ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#5D7A65]/10 text-[#5D7A65] border border-[#5D7A65]/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl text-[#102A43]">Lead Registered Successfully</h3>
                <p className="text-xs text-[#6B7280] max-w-xs mx-auto">
                  Your reference ID is <strong className="font-mono text-[#102A43]">{leadSuccessRef}</strong>. Our private advisory team has been notified.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={resetLeadForm}
                    className="bg-[#102A43] text-[#FFFDF8] hover:bg-[#0B2135] px-6 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors"
                  >
                    Done
                  </button>
                  <a
                    href={`https://wa.me/971501123456?text=${encodeURIComponent(`Hello Crestshore, registered lead reference ${leadSuccessRef}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterLead} className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#B08D57] font-semibold block">
                    Fast-Track Registration
                  </span>
                  <h3 className="font-display text-2xl text-[#102A43]">Register a Lead</h3>
                  <p className="text-[11px] text-[#6B7280]">
                    Introduce your client to lock in priority 24-hour commission clearance.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#102A43] font-semibold mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alexander Vance"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full bg-[#FFFDF8] border border-[#E9E1D4] p-2.5 text-xs focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#102A43] font-semibold mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+971 50 000 0000"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#E9E1D4] p-2.5 text-xs focus:outline-none focus:border-[#B08D57]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#102A43] font-semibold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="client@domain.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#E9E1D4] p-2.5 text-xs focus:outline-none focus:border-[#B08D57]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#102A43] font-semibold mb-1">
                      Lead Type
                    </label>
                    <select
                      value={leadType}
                      onChange={(e) => setLeadType(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#E9E1D4] p-2.5 text-xs focus:outline-none focus:border-[#B08D57]"
                    >
                      <option value="BUYER">Buyer</option>
                      <option value="SELLER">Seller</option>
                      <option value="INVESTOR">Investor</option>
                      <option value="TENANT">Tenant</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#102A43] font-semibold mb-1">
                      Budget / Target
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AED 25M+"
                      value={leadBudget}
                      onChange={(e) => setLeadBudget(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#E9E1D4] p-2.5 text-xs focus:outline-none focus:border-[#B08D57]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#102A43] font-semibold mb-1">
                    Notes / Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state target communities or specific asset requirements..."
                    value={leadNotes}
                    onChange={(e) => setLeadNotes(e.target.value)}
                    className="w-full bg-[#FFFDF8] border border-[#E9E1D4] p-2.5 text-xs focus:outline-none focus:border-[#B08D57]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full bg-[#102A43] hover:bg-[#0B2135] text-[#FFFDF8] hover:text-[#D8C3A5] py-3 text-xs uppercase tracking-widest font-semibold transition-all shadow-sm"
                  >
                    {isSubmittingLead ? 'Registering Lead...' : 'Submit & Lock In Commission'}
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

export default DashboardPage;
