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
      <div className="pb-6 border-b border-[#E9E1D4]">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold">
          Licensed Practitioner Record
        </span>
        <h1 className="font-display text-3xl font-light text-[#102A43]">Broker Profile & Credentials</h1>
      </div>

      <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-[#E9E1D4]">
          <img
            src={b.photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'}
            alt=""
            className="w-24 h-24 rounded-full object-cover border-2 border-[#B08D57]"
          />
          <div className="text-center sm:text-left space-y-1">
            <h2 className="font-display text-2xl text-[#102A43] font-normal">{u.name || 'Omar Farooq'}</h2>
            <p className="text-xs text-[#B08D57] font-medium">{b.title}</p>
            <p className="text-xs text-[#6B7280]">{b.agencyName}</p>

            <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
              <span className="bg-[#F7F3EA] text-[10px] font-mono text-[#B08D57] px-2.5 py-1 border border-[#B08D57]">
                {b.reraNumber}
              </span>
              <span className="bg-[#F7F3EA] text-[10px] font-mono text-[#6B7280] px-2.5 py-1 border border-[#E9E1D4]">
                {b.brn}
              </span>
              <span className="bg-emerald-50 text-[#5D7A65] text-[10px] font-mono px-2.5 py-1 border border-emerald-200 font-semibold">
                RERA Verified Active
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 text-xs text-[#6B7280]">
          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase text-[#6B7280] block font-mono">Experience</span>
              <span className="text-[#102A43] font-medium">{b.experienceYears} Years Dubai Prime Market</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#6B7280] block font-mono">Languages</span>
              <span className="text-[#102A43] font-medium">{b.languages?.join(', ')}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#6B7280] block font-mono">Specializations</span>
              <span className="text-[#102A43] font-medium">{b.specializations?.join(', ')}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] uppercase text-[#6B7280] block font-mono">Commission Agreement Split</span>
              <span className="text-[#B08D57] font-mono font-bold text-base">{b.commissionSplitPct}% Broker / {100 - b.commissionSplitPct}% Agency</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-[#6B7280] block font-mono">Lifetime Sales Volume</span>
              <span className="text-[#102A43] font-display text-lg">{formatAED(b.totalSalesVolumeAED || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
