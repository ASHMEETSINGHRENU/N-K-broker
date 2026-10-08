import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrokerAuth } from '../../context/AuthContext';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('omar.farooq@crestshore.com');
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
    <div className="min-h-screen bg-[#F7F3EA] flex items-center justify-center p-6 text-[#3E4852] font-ui">
      <div className="w-full max-w-md bg-[#FFFDF8] border border-[#E9E1D4] p-8 shadow-xl">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-full border border-[#B08D57] bg-[#102A43] flex items-center justify-center text-[#D8C3A5] mx-auto mb-3 shadow-sm">
            <span className="font-display font-bold text-sm">CS</span>
          </div>
          <h1 className="font-display text-2xl tracking-[0.16em] uppercase text-[#102A43]">
            CRESTSHORE
          </h1>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-medium block mt-1 font-mono">
            BROKER OPERATIONAL PORTAL
          </span>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1 font-medium">
              Broker Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B08D57]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F3EA] border border-[#E9E1D4] pl-9 pr-3 py-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#6B7280] font-mono mb-1 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B08D57]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F3EA] border border-[#E9E1D4] pl-9 pr-3 py-2.5 text-xs text-[#102A43] focus:outline-none focus:border-[#B08D57]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] py-3 text-xs uppercase tracking-[0.18em] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{isSubmitting ? 'Verifying Credentials...' : 'Authenticate & Enter'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B08D57]" />
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-8 pt-6 border-t border-[#E9E1D4] space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-[#6B7280] block font-mono">
            Demo Broker Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('omar.farooq@crestshore.com')}
              className="p-2.5 bg-[#F7F3EA] hover:bg-[#E9E1D4] border border-[#E9E1D4] text-left text-[11px] transition-colors"
            >
              <span className="font-semibold block text-[#102A43]">Omar Farooq</span>
              <span className="text-[9px] text-[#6B7280]">Dir. Palm Jumeirah</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('elena.rostova@crestshore.com')}
              className="p-2.5 bg-[#F7F3EA] hover:bg-[#E9E1D4] border border-[#E9E1D4] text-left text-[11px] transition-colors"
            >
              <span className="font-semibold block text-[#102A43]">Elena Rostova</span>
              <span className="text-[9px] text-[#6B7280]">Penthouses & Branded</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
