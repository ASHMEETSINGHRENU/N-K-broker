import React, { useState, useEffect } from 'react';
import { brokerApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import { Calendar, Clock, MapPin, CheckCircle2, XCircle } from 'lucide-react';

export const ViewingsPage: React.FC = () => {
  const [viewings, setViewings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadViewings = async () => {
    setIsLoading(true);
    try {
      const res = await brokerApi.getViewings();
      setViewings(res.viewings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadViewings();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await brokerApi.updateViewingStatus(id, status);
      await loadViewings();
    } catch (err: any) {
      alert(err.message || 'Failed to update viewing status');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            On-Site VIP Operations
          </span>
          <h1 className="font-serif text-3xl font-light text-[#F7F5F0]">
            Private Viewings Calendar
          </h1>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#18181A] border border-[#2A2A2D] animate-pulse" />
          ))}
        </div>
      ) : viewings.length === 0 ? (
        <div className="text-center py-24 bg-[#18181A] border border-[#2A2A2D] p-8 text-xs text-[#71717A]">
          No private viewing appointments registered.
        </div>
      ) : (
        <div className="space-y-4">
          {viewings.map((v) => (
            <div
              key={v._id}
              className="bg-[#18181A] border border-[#2A2A2D] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#C5A880] bg-[#C5A880]/10 px-2 py-0.5 border border-[#C5A880]/30">
                    {new Date(v.viewingDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs text-[#F7F5F0] font-medium">{v.viewingTimeSlot}</span>
                  <span className="bg-[#262629] text-[9px] uppercase px-2 py-0.5 text-[#A3A3A8]">
                    {v.status}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-medium text-[#F7F5F0]">
                  {v.property?.title || 'Private Residence'}
                </h3>

                <div className="flex items-center gap-4 text-[#71717A] text-[11px]">
                  <span>Client / Lead: <span className="text-[#F7F5F0]">{v.lead?.name || 'Private VIP'}</span></span>
                  <span>Meeting: <span className="text-[#F7F5F0]">{v.meetingPoint || 'Concierge Desk'}</span></span>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2">
                {v.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleUpdateStatus(v._id, 'COMPLETED')}
                    className="px-3 py-1.5 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 uppercase text-[10px] tracking-wider font-semibold"
                  >
                    Mark Completed
                  </button>
                )}
                {v.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleUpdateStatus(v._id, 'CANCELLED')}
                    className="px-3 py-1.5 bg-zinc-900 text-zinc-400 hover:text-red-400 border border-zinc-800 uppercase text-[10px] tracking-wider"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
