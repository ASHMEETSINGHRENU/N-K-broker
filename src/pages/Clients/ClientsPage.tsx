import React, { useState, useEffect } from 'react';
import { brokerApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import { UserCheck, Plus, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Client Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [budgetMax, setBudgetMax] = useState('50000000');
  const [intent, setIntent] = useState<'BUY' | 'RENT' | 'INVEST' | 'OFF_PLAN'>('BUY');
  const [notes, setNotes] = useState('');

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const res = await brokerApi.getClients();
      setClients(res.clients || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await brokerApi.createClient({
        name,
        email,
        mobile,
        buyingIntent: intent,
        budgetMaxAED: Number(budgetMax),
        notes
      });
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setMobile('');
      setNotes('');
      await loadClients();
    } catch (err: any) {
      alert(err.message || 'Failed to create client');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-[#E9E1D4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold">
            Confidential Client Directory
          </span>
          <h1 className="font-display text-3xl font-light text-[#102A43]">
            Private Client Portfolio
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#B08D57]" />
          <span>New Private Client</span>
        </button>
      </div>

      <div className="flex items-center gap-2 p-3 bg-[#FFFDF8] border border-[#B08D57]/40 text-xs text-[#B08D57] shadow-sm">
        <ShieldCheck className="w-4 h-4 shrink-0 text-[#B08D57]" />
        <span>
          Private Client Protection Directive: All client portfolios, contact details, and acquisition budgets are strictly confidential and encrypted.
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#FFFDF8] border border-[#E9E1D4] animate-pulse" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-24 bg-[#FFFDF8] border border-[#E9E1D4] p-8 text-xs text-[#6B7280] shadow-sm">
          No private clients registered under your portfolio yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clients.map((c) => (
            <div key={c._id} className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 space-y-4 text-xs shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-xl text-[#102A43] font-medium">{c.name}</h3>
                  <span className="text-[10px] text-[#B08D57] font-mono uppercase">
                    Intent: {c.buyingIntent} • Budget: {formatAED(c.budgetMaxAED)}
                  </span>
                </div>
                <span className="bg-[#F7F3EA] text-[#6B7280] border border-[#E9E1D4] text-[9px] px-2 py-0.5 uppercase font-mono">
                  {c.residenceCountry || 'UAE'}
                </span>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#E9E1D4] text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#B08D57]" />
                  <span className="text-[#3E4852] font-mono">{c.mobile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#B08D57]" />
                  <span className="text-[#3E4852] font-mono">{c.email}</span>
                </div>
              </div>

              {c.notes && (
                <div className="pt-3 border-t border-[#E9E1D4]">
                  <span className="text-[10px] uppercase text-[#6B7280] block mb-1 font-mono">Confidential Notes</span>
                  <p className="text-[#3E4852] italic bg-[#F7F3EA] p-2.5 border border-[#E9E1D4]">
                    {c.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: New Client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2135]/60 backdrop-blur-sm">
          <div className="bg-[#FFFDF8] border border-[#E9E1D4] max-w-md w-full p-6 text-[#3E4852] space-y-4 text-xs shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#E9E1D4]">
              <h3 className="font-display text-xl font-normal text-[#102A43]">Register Confidential Client</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#6B7280] hover:text-[#102A43]">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43] focus:border-[#B08D57] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43] focus:border-[#B08D57] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43] focus:border-[#B08D57] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">Intent</label>
                  <select
                    value={intent}
                    onChange={(e: any) => setIntent(e.target.value)}
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43] focus:border-[#B08D57] focus:outline-none"
                  >
                    <option value="BUY">Buy</option>
                    <option value="RENT">Rent</option>
                    <option value="INVEST">Invest</option>
                    <option value="OFF_PLAN">Off-Plan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">Max Budget (AED)</label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43] focus:border-[#B08D57] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#6B7280] font-mono mb-1">Mandate Requirements</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2 text-xs text-[#102A43] focus:border-[#B08D57] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E9E1D4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E9E1D4] text-xs uppercase text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] font-semibold text-xs uppercase tracking-wider shadow-sm"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
