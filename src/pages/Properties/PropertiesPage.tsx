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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D4]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold">
            Inventory & Mandates
          </span>
          <h1 className="font-display text-3xl font-light tracking-tight text-[#102A43]">
            Listing Management
          </h1>
        </div>

        <Link
          to="/broker/properties/new"
          className="bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 self-start shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#B08D57]" />
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
                ? 'bg-[#102A43] border-[#102A43] text-[#FFFDF8] font-semibold shadow-sm'
                : 'border-[#E9E1D4] text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8]'
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
            <div key={i} className="h-20 bg-[#FFFDF8] border border-[#E9E1D4] animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-24 bg-[#FFFDF8] border border-[#E9E1D4] p-8 text-xs text-[#6B7280] shadow-sm">
          No listings found under this status filter.
        </div>
      ) : (
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F3EA] border-b border-[#E9E1D4] text-[#6B7280] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Community</th>
                <th className="p-4">Asking Price</th>
                <th className="p-4">Specs</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1D4]">
              {properties.map((p) => (
                <tr key={p._id} className="hover:bg-[#F7F3EA]/60 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.featuredImage}
                        alt=""
                        className="w-14 h-11 object-cover bg-[#F7F3EA] border border-[#E9E1D4]"
                      />
                      <div>
                        <span className="font-display text-sm font-medium text-[#102A43] block">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-[#B08D57] font-mono">
                          {p.referenceNumber} • {p.propertyType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#6B7280]">{p.community}</td>
                  <td className="p-4 font-display text-sm text-[#102A43] font-medium">
                    {formatAED(p.priceAED)}
                  </td>
                  <td className="p-4 text-[#6B7280]">
                    {p.bedrooms} Beds • {p.bathrooms} Baths • {formatSqFt(p.builtUpAreaSqFt)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 font-mono font-semibold ${
                        p.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-[#5D7A65] border border-emerald-200'
                          : p.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-[#F7F3EA] text-[#6B7280] border border-[#E9E1D4]'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/broker/properties/${p._id}`}
                      className="text-xs uppercase tracking-wider text-[#B08D57] hover:underline font-semibold"
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
