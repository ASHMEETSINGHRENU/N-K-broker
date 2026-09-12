import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brokerApi } from '../../services/api';
import { formatAED, formatSqFt } from '@nestandkey/utils';
import { Building2, Plus, ArrowUpRight, Search, Clock, CheckCircle2 } from 'lucide-react';

export const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    async function loadProperties() {
      setIsLoading(true);
      try {
        const res = await brokerApi.getProperties(filterStatus ? { status: filterStatus } : {});
        setProperties(res.properties || []);
      } catch (err) {
        console.error('Failed to load listings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProperties();
  }, [filterStatus]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2A2A2D]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            Inventory & Mandates
          </span>
          <h1 className="font-serif text-3xl font-light tracking-tight text-[#F7F5F0]">
            Listing Management
          </h1>
        </div>

        <Link
          to="/broker/properties/new"
          className="bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {['', 'ACTIVE', 'PENDING_APPROVAL', 'DRAFT', 'SOLD', 'RENTED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-1.5 uppercase tracking-wider border transition-all ${
              filterStatus === st
                ? 'bg-[#262629] border-[#C5A880] text-[#C5A880] font-semibold'
                : 'border-[#2A2A2D] text-[#A3A3A8] hover:text-[#F7F5F0]'
            }`}
          >
            {st ? st.replace('_', ' ') : 'All Inventory'}
          </button>
        ))}
      </div>

      {/* Table / Grid */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#18181A] border border-[#2A2A2D] animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-24 bg-[#18181A] border border-[#2A2A2D] p-8 text-xs text-[#71717A]">
          No listings found under this status filter.
        </div>
      ) : (
        <div className="bg-[#18181A] border border-[#2A2A2D] overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121214] border-b border-[#2A2A2D] text-[#71717A] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Community</th>
                <th className="p-4">Asking Price</th>
                <th className="p-4">Specs</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2D]">
              {properties.map((p) => (
                <tr key={p._id} className="hover:bg-[#262629]/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.featuredImage}
                        alt=""
                        className="w-14 h-11 object-cover bg-[#121214] border border-[#2A2A2D]"
                      />
                      <div>
                        <span className="font-serif text-sm font-medium text-[#F7F5F0] block">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-[#C5A880] font-mono">
                          {p.referenceNumber} • {p.propertyType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#A3A3A8]">{p.community}</td>
                  <td className="p-4 font-serif text-sm text-[#F7F5F0] font-medium">
                    {formatAED(p.priceAED)}
                  </td>
                  <td className="p-4 text-[#A3A3A8]">
                    {p.bedrooms} Beds • {p.bathrooms} Baths • {formatSqFt(p.builtUpAreaSqFt)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 font-mono font-semibold ${
                        p.status === 'ACTIVE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : p.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/broker/properties/${p._id}`}
                      className="text-xs uppercase tracking-wider text-[#C5A880] hover:underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
