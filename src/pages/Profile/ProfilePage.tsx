import React, { useState, useEffect } from 'react';
import { brokerApi } from '../../services/api';
import { ShieldCheck, Award, Globe, Phone, Mail, Building } from 'lucide-react';
import { formatAED } from '@nestandkey/utils';

export const ProfilePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await brokerApi.getProfile();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading || !data) {
    return <div className="p-12 text-xs text-[#71717A]">Loading profile credentials...</div>;
  }

  const b = data.broker || {};
  const u = b.user || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="pb-6 border-b border-[#2A2A2D]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
          Licensed Practitioner Record
        </span>
        <h1 className="font-serif text-3xl font-light text-[#F7F5F0]">Broker Profile & Credentials</h1>
      </div>

      <div className="bg-[#18181A] border border-[#2A2A2D] p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-[#2A2A2D]">
          <img
            src={b.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'}
            alt=""
            className="w-24 h-24 rounded-full object-cover border-2 border-[#C5A880]"
          />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="font-serif text-2xl text-[#F7F5F0] font-normal">{u.name || 'Omar Farooq'}</h2>
            <p className="text-xs text-[#C5A880] font-medium">{b.title}</p>
            <p className="text-xs text-[#A3A3A8]">{b.agencyName}</p>

            <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
              <span className="bg-[#262629] text-[10px] font-mono text-[#C5A880] px-2.5 py-1 border border-[#C5A880]/30">
                {b.reraNumber}
              </span>
              <span className="bg-[#262629] text-[10px] font-mono text-[#A3A3A8] px-2.5 py-1 border border-[#2A2A2D]">
                {b.brn}
              </span>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono px-2.5 py-1 border border-emerald-800">
                RERA Verified Active
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 text-xs text-[#A3A3A8]">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase text-[#71717A] block">Experience</span>
              <span className="text-[#F7F5F0] font-medium">{b.experienceYears} Years Dubai Prime Market</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#71717A] block">Languages</span>
              <span className="text-[#F7F5F0] font-medium">{b.languages?.join(', ')}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#71717A] block">Specializations</span>
              <span className="text-[#F7F5F0] font-medium">{b.specializations?.join(', ')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase text-[#71717A] block">Commission Agreement Split</span>
              <span className="text-[#C5A880] font-mono font-bold text-base">{b.commissionSplitPct}% Broker / {100 - b.commissionSplitPct}% Agency</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#71717A] block">Lifetime Sales Volume</span>
              <span className="text-[#F7F5F0] font-serif text-lg">{formatAED(b.totalSalesVolumeAED || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
