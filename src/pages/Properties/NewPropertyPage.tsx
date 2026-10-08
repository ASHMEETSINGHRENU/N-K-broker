import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { brokerApi } from '../../services/api';
import { PROPERTY_TYPES, DUBAI_COMMUNITIES, DUBAI_DEVELOPERS, LUXURY_AMENITIES } from '@nestandkey/constants';
import { Building2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const NewPropertyPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('BUY');
  const [propertyType, setPropertyType] = useState('Villa');
  const [priceAED, setPriceAED] = useState('');
  const [bedrooms, setBedrooms] = useState('4');
  const [bathrooms, setBathrooms] = useState('5');
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState('');
  const [plotAreaSqFt, setPlotAreaSqFt] = useState('');
  const [community, setCommunity] = useState('Palm Jumeirah');
  const [developer, setDeveloper] = useState('Nakheel');
  const [furnishing, setFurnishing] = useState('DESIGNER_FURNISHED');
  const [completionStatus, setCompletionStatus] = useState('READY');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85'
  );
  const [amenities, setAmenities] = useState<string[]>([
    'Private Infinity Pool',
    'Private Beach Access'
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !priceAED || !builtUpAreaSqFt) {
      setError('Please provide title, description, asking price, and built-up area.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await brokerApi.createProperty({
        title,
        description,
        purpose,
        propertyType,
        priceAED: Number(priceAED),
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        builtUpAreaSqFt: Number(builtUpAreaSqFt),
        plotAreaSqFt: plotAreaSqFt ? Number(plotAreaSqFt) : undefined,
        community,
        developer,
        furnishing,
        completionStatus,
        featuredImage,
        images: [featuredImage],
        amenities
      });

      alert('Listing created successfully! It has been submitted for Admin approval.');
      navigate('/broker/properties');
    } catch (err: any) {
      setError(err.message || 'Failed to create listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4 pb-6 border-b border-[#E9E1D4]">
        <button
          onClick={() => navigate('/broker/properties')}
          className="p-2 border border-[#E9E1D4] text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold">
            Inventory Onboarding
          </span>
          <h1 className="font-display text-3xl font-light text-[#102A43]">Create New Listing</h1>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#FFFDF8] border border-[#E9E1D4] p-8 space-y-6 text-xs shadow-sm">
        {/* Title */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1.5 font-medium">
            Listing Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. The Palm Serenity Beachfront Mansion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-3 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
          />
        </div>

        {/* Purpose, Type, Community, Developer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1.5 font-medium">
              Purpose
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
            >
              <option value="BUY">For Sale</option>
              <option value="RENT">For Lease</option>
              <option value="OFF_PLAN">Off-Plan</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1.5 font-medium">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1.5 font-medium">
              Community
            </label>
            <select
              value={community}
              onChange={(e) => setCommunity(e.target.value)}
              className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
            >
              {DUBAI_COMMUNITIES.map((c) => (
                <option key={c.slug} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1.5 font-medium">
              Developer
            </label>
            <select
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
            >
              {DUBAI_DEVELOPERS.map((d) => (
                <option key={d.slug} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Dimensions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1.5 font-medium">
              Price in AED *
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 45000000"
              value={priceAED}
              onChange={(e) => setPriceAED(e.target.value)}
              className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1.5 font-medium">
              Bedrooms
            </label>
            <input
              type="number"
              required
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1.5 font-medium">
              Bathrooms
            </label>
            <input
              type="number"
              required
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1.5 font-medium">
              Built-Up Area (sq.ft) *
            </label>
            <input
              type="number"
              required
              placeholder="e.g. 12500"
              value={builtUpAreaSqFt}
              onChange={(e) => setBuiltUpAreaSqFt(e.target.value)}
              className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1.5 font-medium">
            Featured Photography URL *
          </label>
          <input
            type="url"
            required
            value={featuredImage}
            onChange={(e) => setFeaturedImage(e.target.value)}
            className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1.5 font-medium">
            Architectural Narrative & Description *
          </label>
          <textarea
            rows={5}
            required
            placeholder="Describe luxury features, panoramic vistas, imported finishes, and exclusivity..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-3 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
          />
        </div>

        {/* Amenities Selection */}
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-2 font-medium">
            Select Verified Amenities
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-[#E9E1D4] bg-[#F7F3EA]">
            {LUXURY_AMENITIES.map((a) => {
              const checked = amenities.includes(a);
              return (
                <label key={a} className="flex items-center gap-2 text-[11px] text-[#3E4852] cursor-pointer hover:text-[#102A43]">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      setAmenities(checked ? amenities.filter((item) => item !== a) : [...amenities, a]);
                    }}
                    className="rounded border-[#E9E1D4] text-[#102A43] focus:ring-0"
                  />
                  <span>{a}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-[#E9E1D4]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] py-3.5 text-xs uppercase tracking-[0.18em] font-semibold transition-all disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? 'Registering Property...' : 'Submit Listing For Moderation'}
          </button>
        </div>
      </form>
    </div>
  );
};
