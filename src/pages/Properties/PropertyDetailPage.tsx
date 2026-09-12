import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { brokerApi } from '../../services/api';
import { formatAED, formatSqFt } from '@nestandkey/utils';
import { ArrowLeft, Building2, Eye, ShieldCheck, Check } from 'lucide-react';

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any | null>(null);
  const [status, setStatus] = useState('');
  const [priceAED, setPriceAED] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await brokerApi.getProperties();
        const p = res.properties?.find((item: any) => item._id === id);
        if (p) {
          setProperty(p);
          setStatus(p.status);
          setPriceAED(p.priceAED.toString());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSave = async () => {
    if (!property) return;
    setIsSaving(true);
    try {
      await brokerApi.updateProperty(property._id, {
        status,
        priceAED: Number(priceAED)
      });
      alert('Property updated successfully.');
      navigate('/broker/properties');
    } catch (err: any) {
      alert(err.message || 'Failed to update property');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !property) {
    return <div className="p-12 text-xs text-[#71717A]">Loading property specs...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 pb-6 border-b border-[#2A2A2D]">
        <button
          onClick={() => navigate('/broker/properties')}
          className="p-2 border border-[#2A2A2D] text-[#A3A3A8] hover:text-[#F7F5F0]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold">
            {property.referenceNumber}
          </span>
          <h1 className="font-serif text-3xl font-light text-[#F7F5F0]">{property.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="aspect-[16/9] bg-[#18181A] overflow-hidden border border-[#2A2A2D]">
            <img src={property.featuredImage} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="bg-[#18181A] border border-[#2A2A2D] p-6 space-y-4 text-xs">
            <h3 className="font-serif text-xl font-light text-[#F7F5F0]">Residence Information</h3>
            <p className="text-[#A3A3A8] leading-relaxed">{property.description}</p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#2A2A2D] text-[#A3A3A8]">
              <div>Community: <span className="text-[#F7F5F0] font-medium">{property.community}</span></div>
              <div>Bedrooms: <span className="text-[#F7F5F0] font-medium">{property.bedrooms} Beds</span></div>
              <div>Bathrooms: <span className="text-[#F7F5F0] font-medium">{property.bathrooms} Baths</span></div>
              <div>Area: <span className="text-[#F7F5F0] font-medium">{formatSqFt(property.builtUpAreaSqFt)}</span></div>
            </div>
          </div>
        </div>

        {/* Status & Modification */}
        <div className="space-y-6">
          <div className="bg-[#18181A] border border-[#2A2A2D] p-6 space-y-4 text-xs">
            <h3 className="font-serif text-xl font-light text-[#F7F5F0]">Listing Controls</h3>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1 font-medium">
                Asking Price (AED)
              </label>
              <input
                type="number"
                value={priceAED}
                onChange={(e) => setPriceAED(e.target.value)}
                className="w-full bg-[#121214] border border-[#2A2A2D] p-2.5 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#A3A3A8] mb-1 font-medium">
                Listing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#121214] border border-[#2A2A2D] p-2.5 text-xs text-[#F7F5F0] focus:border-[#C5A880]"
              >
                <option value="ACTIVE">ACTIVE (Published)</option>
                <option value="PENDING_APPROVAL">PENDING_APPROVAL</option>
                <option value="DRAFT">DRAFT</option>
                <option value="SOLD">SOLD</option>
                <option value="RENTED">RENTED</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] py-2.5 text-xs uppercase tracking-wider font-semibold transition-all"
            >
              {isSaving ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
