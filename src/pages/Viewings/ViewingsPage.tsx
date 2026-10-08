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
      <div className="flex items-center justify-between pb-6 border-b border-[#E9E1D4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold">
            On-Site VIP Operations
          </span>
          <h1 className="font-display text-3xl font-light text-[#102A43]">
            Private Viewings Calendar
          </h1>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#FFFDF8] border border-[#E9E1D4] animate-pulse" />
          ))}
        </div>
      ) : viewings.length === 0 ? (
        <div className="text-center py-24 bg-[#FFFDF8] border border-[#E9E1D4] p-8 text-xs text-[#6B7280] shadow-sm">
          No private viewing appointments registered.
        </div>
      ) : (
        <div className="space-y-4">
          {viewings.map((v) => (
            <div
              key={v._id}
              className="bg-[#FFFDF8] border border-[#E9E1D4] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#B08D57] bg-[#F7F3EA] px-2 py-0.5 border border-[#B08D57]">
                    {new Date(v.viewingDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs text-[#102A43] font-medium">{v.viewingTimeSlot}</span>
                  <span className="bg-[#F7F3EA] border border-[#E9E1D4] text-[9px] uppercase px-2 py-0.5 text-[#6B7280] font-mono">
                    {v.status}
                  </span>
                </div>

                <h3 className="font-display text-xl font-medium text-[#102A43]">
                  {v.property?.title || 'Private Residence'}
                </h3>

                <div className="flex items-center gap-4 text-[#6B7280] text-[11px]">
                  <span>Client / Lead: <span className="text-[#102A43] font-medium">{v.lead?.name || 'Private VIP'}</span></span>
                  <span>Meeting: <span className="text-[#102A43] font-medium">{v.meetingPoint || 'Concierge Desk'}</span></span>
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex items-center gap-2">
                {v.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleUpdateStatus(v._id, 'COMPLETED')}
                    className="px-3 py-1.5 bg-emerald-50 text-[#5D7A65] hover:bg-emerald-100 border border-emerald-200 uppercase text-[10px] tracking-wider font-semibold transition-colors"
                  >
                    Mark Completed
                  </button>
                )}
                {v.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleUpdateStatus(v._id, 'CANCELLED')}
                    className="px-3 py-1.5 bg-[#FFFDF8] text-[#6B7280] hover:text-red-600 border border-[#E9E1D4] uppercase text-[10px] tracking-wider transition-colors"
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
