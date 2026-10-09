import React, { useState, useEffect } from 'react';
import { brokerApi } from '../../services/api';
import { ShieldCheck, Award, Globe, Phone, Mail, Building, FileText, Download, Eye, CheckCircle2, Lock, X, Check } from 'lucide-react';
import { formatAED } from '@nestandkey/utils';

export const ProfilePage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    // Simulate instant download trigger
    const element = document.createElement('a');
    const file = new Blob([
      `CRESTSHORE REAL ESTATE ADVISORY - OFFICIAL BROKER AGREEMENT
Document: Master Institutional Broker & Partner Agreement (v1.2)
Signatory: ${u.name || 'Omar Farooq'} (BRN: ${b.brn || 'BRN-54891'})
Authoritative Terms: 50% Gross Broker Fee Split | 24-Hour Payout SLA
Audit Reference: CS-AGR-8849-DXB | Timestamp: 2026-10-01T09:00:00 GST
Governing Law: DIFC Courts / Dubai Land Department (RERA)`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Crestshore_Broker_Agreement_${b.brn || 'BRN-54891'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setTimeout(() => setDownloadSuccess(false), 2500);
  };

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

      {/* Main Profile Card */}
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
              <span className="bg-emerald-50 text-[#5D7A65] text-[10px] font-mono px-2.5 py-1 border border-emerald-200 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#5D7A65]" />
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

      {/* Official Broker Agreement Section (Requested in Client Change 6) */}
      <div className="bg-[#FFFDF8] border border-[#E9E1D4] p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E1D4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#102A43] border border-[#B08D57] flex items-center justify-center text-[#D8C3A5]">
              <FileText className="w-5 h-5 text-[#B08D57]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold block">
                Binding Legal Instrument
              </span>
              <h2 className="font-display text-xl font-normal text-[#102A43]">
                Master Partner & Broker Agreement
              </h2>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-[#5D7A65] text-xs font-mono font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#5D7A65]" />
            <span>Executed & Authoritative</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#F7F3EA] border border-[#E9E1D4] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block">Document Reference</span>
            <p className="font-mono text-xs font-bold text-[#102A43]">CS-AGR-8849-DXB</p>
            <p className="text-[11px] text-[#6B7280]">Version 1.2 • Digital Audit Trail</p>
          </div>

          <div className="p-4 bg-[#F7F3EA] border border-[#E9E1D4] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block">Commercial Terms</span>
            <p className="font-mono text-xs font-bold text-[#B08D57]">{b.commissionSplitPct || 50}% Broker Payout Split</p>
            <p className="text-[11px] text-[#6B7280]">Guaranteed 24h Payout on Settlement</p>
          </div>

          <div className="p-4 bg-[#F7F3EA] border border-[#E9E1D4] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-mono block">Effective Validity</span>
            <p className="font-mono text-xs font-bold text-[#102A43]">October 1, 2026 – Perpetual</p>
            <p className="text-[11px] text-[#6B7280]">180-Day Non-Circumvention Protection</p>
          </div>
        </div>

        <div className="p-4 bg-[#102A43]/5 border-l-2 border-[#B08D57] text-xs text-[#3E4852] leading-relaxed">
          <p className="font-medium text-[#102A43] mb-1">Authoritative Agreement Notice:</p>
          The authoritative terms governing all lead submissions, commission payouts, and non-circumvention rights remain the signed agreement on file. Crestshore commits to disbursing verified referral fees within 24 hours of receiving cleared institutional funds.
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E9E1D4]">
          <div className="flex items-center gap-2 text-xs text-[#6B7280] font-mono">
            <Lock className="w-3.5 h-3.5 text-[#B08D57]" />
            <span>Digitally verified via OTP & Cryptographic Hash</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAgreementModalOpen(true)}
              className="px-4 py-2 border border-[#102A43] text-xs uppercase tracking-wider font-semibold text-[#102A43] hover:bg-[#102A43] hover:text-[#FFFDF8] transition-colors flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5 text-[#B08D57]" />
              <span>View Agreement</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-[#102A43] hover:bg-[#1E3A5F] text-xs uppercase tracking-wider font-semibold text-[#FFFDF8] transition-colors flex items-center gap-2 shadow-sm"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#5D7A65]" />
                  <span>Downloaded</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#B08D57]" />
                  <span>Download Signed PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full Agreement Modal */}
      {isAgreementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2135]/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[90vh] bg-[#FFFDF8] border border-[#E9E1D4] shadow-2xl flex flex-col text-[#3E4852]">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E9E1D4] flex items-center justify-between bg-[#F7F3EA]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold block">
                  Authoritative Contract Document
                </span>
                <h3 className="font-display text-2xl font-light text-[#102A43]">
                  Crestshore Master Institutional Broker Agreement
                </h3>
                <span className="text-xs text-[#6B7280] font-mono">
                  Ref: CS-AGR-8849-DXB • Version 1.2
                </span>
              </div>
              <button
                onClick={() => setIsAgreementModalOpen(false)}
                className="p-2 text-[#6B7280] hover:text-[#102A43]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Contract Clauses */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-[#3E4852] leading-relaxed font-serif">
              <div className="p-4 bg-[#FFFDF8] border border-[#E9E1D4] font-sans text-xs space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#6B7280] block">Broker Partner:</span>
                    <strong className="text-[#102A43]">{u.name || 'Omar Farooq'}</strong> ({b.agencyName || 'Dubai Prime Advisory'})
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#6B7280] block">Regulatory Registration:</span>
                    <strong className="text-[#102A43]">{b.brn || 'BRN-54891'}</strong> • RERA {b.reraNumber || '28472'}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#6B7280] block">Authoritative Fee Split:</span>
                    <strong className="text-[#B08D57] font-mono">{b.commissionSplitPct || 50}% of Gross Received Commission</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#6B7280] block">Payout Settlement SLA:</span>
                    <strong className="text-[#5D7A65]">Within 24 Hours of Developer Funds Receipt</strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-sans font-bold text-sm text-[#102A43] uppercase tracking-wider mb-2">
                  1. Purpose & Collaborative Mandate
                </h4>
                <p>
                  This Master Broker & Partner Agreement (&ldquo;Agreement&rdquo;) establishes the terms under which the Broker will introduce prospective high-net-worth buyers, investors, or tenants to real estate opportunities curated or represented by Crestshore Real Estate Advisory FZ-LLC (&ldquo;Crestshore&rdquo;).
                </p>
              </div>

              <div>
                <h4 className="font-sans font-bold text-sm text-[#102A43] uppercase tracking-wider mb-2">
                  2. Commission Entitlement & 24-Hour Payout Guarantee
                </h4>
                <p>
                  Upon the successful closing and receipt of commission fees from the developer or seller, Crestshore guarantees the disbursement of the Broker&rsquo;s agreed split ({b.commissionSplitPct || 50}%) within twenty-four (24) business hours directly to the designated bank account on file. No arbitrary administrative deductions shall apply.
                </p>
              </div>

              <div>
                <h4 className="font-sans font-bold text-sm text-[#102A43] uppercase tracking-wider mb-2">
                  3. Non-Circumvention & Client Protection
                </h4>
                <p>
                  Crestshore explicitly covenants that any client, investor, or institutional contact registered through the Crestshore Broker Workspace by the Broker shall remain the exclusive referral of the Broker for a minimum duration of one hundred eighty (180) days. Crestshore shall not solicit, transact, or circumvent the Broker with respect to registered candidates.
                </p>
              </div>

              <div>
                <h4 className="font-sans font-bold text-sm text-[#102A43] uppercase tracking-wider mb-2">
                  4. Confidentiality & Discreet Conduct
                </h4>
                <p>
                  Both parties agree to treat all financial details, client identities, and private off-market property offerings with the utmost discretion, sharing information strictly on a need-to-know basis.
                </p>
              </div>

              {/* Digital Signature Verification Block */}
              <div className="pt-6 border-t border-[#E9E1D4] font-sans">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#B08D57] font-mono font-semibold block mb-3">
                  Digital Signature Audit Ledger
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F7F3EA] border border-[#E9E1D4]">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#6B7280] block">Signatory:</span>
                    <strong className="text-[#102A43] text-xs">{u.name || 'Omar Farooq'}</strong>
                    <p className="text-[10px] text-[#6B7280] font-mono mt-0.5">Signed via OTP: CS-VER-99214</p>
                    <p className="text-[10px] text-[#6B7280] font-mono">IP: 185.107.56.12 (Dubai, UAE)</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#6B7280] block">Crestshore Counter-Signatory:</span>
                    <strong className="text-[#102A43] text-xs">Crestshore Legal & Compliance</strong>
                    <p className="text-[10px] text-[#6B7280] font-mono mt-0.5">Cryptographic Seal: SHA256-88F4A19</p>
                    <p className="text-[10px] text-[#6B7280] font-mono">Date: October 1, 2026 09:00 GST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-[#E9E1D4] bg-[#F7F3EA] flex items-center justify-between">
              <span className="text-[11px] text-[#6B7280] font-mono">
                Authoritative terms control all transactions.
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-[#B08D57]" />
                  <span>Download Document</span>
                </button>
                <button
                  onClick={() => setIsAgreementModalOpen(false)}
                  className="px-4 py-2 border border-[#E9E1D4] text-xs uppercase text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
