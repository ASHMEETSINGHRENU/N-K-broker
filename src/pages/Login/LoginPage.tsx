import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrokerAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('omar.farooq@nestandkey.com');
  const [password, setPassword] = useState('Broker@123456');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useBrokerAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(email, password);
      navigate('/broker/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Verify your broker credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Broker@123456');
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center p-6 text-[#F7F5F0]">
      <div className="w-full max-w-md bg-[#18181A] border border-[#2A2A2D] p-8 shadow-2xl">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-full border border-[#C5A880] flex items-center justify-center text-[#C5A880] mx-auto mb-3">
            <span className="font-serif font-bold text-sm">NK</span>
          </div>
          <h1 className="font-serif text-2xl tracking-[0.16em] uppercase text-[#F7F5F0]">
            NESTANDKEY
          </h1>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-medium block mt-1">
            BROKER OPERATIONAL PORTAL
          </span>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-950/50 border border-red-800 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A3A3A8] mb-1 font-medium">
              Broker Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121214] border border-[#2A2A2D] pl-9 pr-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A3A3A8] mb-1 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#121214] border border-[#2A2A2D] pl-9 pr-3 py-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#C5A880] hover:bg-[#B8976C] text-[#18181A] py-3 text-xs uppercase tracking-[0.18em] font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'Verifying Credentials...' : 'Authenticate & Enter'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-8 pt-6 border-t border-[#2A2A2D] space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-[#71717A] block font-mono">
            Demo Broker Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('omar.farooq@nestandkey.com')}
              className="p-2 bg-[#121214] hover:bg-[#262629] border border-[#2A2A2D] text-left text-[11px] text-[#C5A880] transition-colors"
            >
              <span className="font-semibold block">Omar Farooq</span>
              <span className="text-[9px] text-[#71717A]">Dir. Palm Jumeirah</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('elena.rostova@nestandkey.com')}
              className="p-2 bg-[#121214] hover:bg-[#262629] border border-[#2A2A2D] text-left text-[11px] text-[#C5A880] transition-colors"
            >
              <span className="font-semibold block">Elena Rostova</span>
              <span className="text-[9px] text-[#71717A]">Penthouses & Branded</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
