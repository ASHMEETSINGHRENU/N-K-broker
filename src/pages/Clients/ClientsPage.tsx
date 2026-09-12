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
      <div className="flex items-center justify-between pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Confidential Client Directory
          </span>
          <h1 className="font-serif text-3xl font-light text-[#F7F5F0]">
            Private Client Portfolio
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Private Client</span>
        </button>
      </div>

      <div className="flex items-center gap-2 p-3 bg-[#18181A] border border-[#2A2A2D] text-xs text-[#C5A880]">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>
          Private Client Protection Directive: All client portfolios, contact details, and acquisition budgets are strictly confidential and encrypted.
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#18181A] border border-[#2A2A2D] animate-pulse" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-24 bg-[#18181A] border border-[#2A2A2D] p-8 text-xs text-[#71717A]">
          No private clients registered under your portfolio yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clients.map((c) => (
            <div key={c._id} className="bg-[#18181A] border border-[#2A2A2D] p-6 space-y-4 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-xl text-[#F7F5F0] font-medium">{c.name}</h3>
                  <span className="text-[10px] text-[#C5A880] font-mono uppercase">
                    Intent: {c.buyingIntent} • Budget: {formatAED(c.budgetMaxAED)}
                  </span>
                </div>
                <span className="bg-[#262629] text-[#A3A3A8] text-[9px] px-2 py-0.5 uppercase">
                  {c.residenceCountry || 'UAE'}
                </span>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#2A2A2D] text-[#A3A3A8]">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{c.mobile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{c.email}</span>
                </div>
              </div>

              {c.notes && (
                <div className="pt-3 border-t border-[#2A2A2D]">
                  <span className="text-[10px] uppercase text-[#71717A] block mb-1">Confidential Notes</span>
                  <p className="text-[#D5CFC5] italic bg-[#121214] p-2.5 border border-[#2A2A2D]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0C]/80 backdrop-blur-sm">
          <div className="bg-[#18181A] border border-[#2A2A2D] max-w-md w-full p-6 text-[#F7F5F0] space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2D]">
              <h3 className="font-serif text-xl font-light">Register Confidential Client</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#71717A] hover:text-[#F7F5F0]">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3">
              <div>
                <label className="block text-[11px] uppercase text-[#A3A3A8] mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#121214] border border-[#2A2A2D] p-2 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#A3A3A8] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#121214] border border-[#2A2A2D] p-2 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#A3A3A8] mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full bg-[#121214] border border-[#2A2A2D] p-2 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase text-[#A3A3A8] mb-1">Intent</label>
                  <select
                    value={intent}
                    onChange={(e: any) => setIntent(e.target.value)}
                    className="w-full bg-[#121214] border border-[#2A2A2D] p-2 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
                  >
                    <option value="BUY">Buy</option>
                    <option value="RENT">Rent</option>
                    <option value="INVEST">Invest</option>
                    <option value="OFF_PLAN">Off-Plan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase text-[#A3A3A8] mb-1">Max Budget (AED)</label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full bg-[#121214] border border-[#2A2A2D] p-2 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase text-[#A3A3A8] mb-1">Mandate Requirements</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#121214] border border-[#2A2A2D] p-2 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#2A2A2D] text-xs uppercase text-[#A3A3A8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C5A880] text-[#18181A] font-semibold text-xs uppercase"
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
