import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brokerApi } from '../../services/api';
import { formatAED } from '@nestandkey/utils';
import {
  DUBAI_PRIME_PROJECTS,
  CRESTSHORE_RELATIONSHIP_MANAGERS,
  CRM_STATUSES,
  LEAD_SOURCES,
  BUDGET_TIERS
} from '../../data/dubaiProjects';
import {
  Users2,
  UserPlus,
  ArrowRight,
  Search,
  Clock,
  CheckCircle2,
  Bell,
  Sparkles,
  Send,
  X,
  AlertCircle,
  Building2,
  Lock,
  RefreshCw,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Briefcase,
  Flame,
  Sun,
  Snowflake,
  PhoneCall,
  CalendarCheck,
  Trophy,
  XCircle,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

const LOCAL_STORAGE_LEADS_KEY = 'crestshore_broker_custom_leads';

// Normalize older pipeline stages to modern broker CRM statuses
const normalizeStatus = (status: string): string => {
  if (!status) return 'Hot';
  const s = status.toUpperCase();
  if (s === 'HOT' || s === 'NEW') return 'Hot';
  if (s === 'WARM' || s === 'QUALIFIED') return 'Warm';
  if (s === 'COLD') return 'Cold';
  if (s === 'ATTEMPTED' || s === 'CONTACTED') return 'Attempted';
  if (s === 'MEETING DONE' || s === 'VIEWING') return 'Meeting Done';
  if (s === 'WON' || s === 'CONVERTED') return 'Won';
  if (s === 'LOST') return 'Lost';
  return status;
};

const getStatusBadgeStyle = (status: string) => {
  const norm = normalizeStatus(status);
  switch (norm) {
    case 'Hot':
      return 'bg-rose-50 text-rose-800 border-rose-300';
    case 'Warm':
      return 'bg-amber-50 text-amber-800 border-amber-300';
    case 'Cold':
      return 'bg-blue-50 text-blue-800 border-blue-300';
    case 'Attempted':
      return 'bg-indigo-50 text-indigo-800 border-indigo-300';
    case 'Meeting Done':
      return 'bg-purple-50 text-purple-800 border-purple-300';
    case 'Won':
      return 'bg-emerald-50 text-[#5D7A65] border-emerald-300';
    case 'Lost':
      return 'bg-stone-100 text-stone-600 border-stone-300';
    default:
      return 'bg-[#F7F3EA] text-[#6B7280] border-[#E9E1D4]';
  }
};

const getStatusIcon = (status: string) => {
  const norm = normalizeStatus(status);
  switch (norm) {
    case 'Hot':
      return <Flame className="w-3 h-3 text-rose-600" />;
    case 'Warm':
      return <Sun className="w-3 h-3 text-amber-600" />;
    case 'Cold':
      return <Snowflake className="w-3 h-3 text-blue-600" />;
    case 'Attempted':
      return <PhoneCall className="w-3 h-3 text-indigo-600" />;
    case 'Meeting Done':
      return <CalendarCheck className="w-3 h-3 text-purple-600" />;
    case 'Won':
      return <Trophy className="w-3 h-3 text-[#5D7A65]" />;
    case 'Lost':
      return <XCircle className="w-3 h-3 text-stone-500" />;
    default:
      return null;
  }
};

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<number>(25); // "filter no of leads"
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Register Lead Modal state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonymousLeadId, setAnonymousLeadId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [budgetAED, setBudgetAED] = useState<number>(25000000);
  const [source, setSource] = useState(LEAD_SOURCES[0]);
  const [selectedStatus, setSelectedStatus] = useState<string>('Hot');
  const [assignedRM, setAssignedRM] = useState(CRESTSHORE_RELATIONSHIP_MANAGERS[0].name);
  const [initialNote, setInitialNote] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Quick Notify Modal state
  const [selectedLeadForNotify, setSelectedLeadForNotify] = useState<any | null>(null);
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyMessage, setNotifyMessage] = useState('');
  const [notifyType, setNotifyType] = useState('STATUS_CHANGE');
  const [isSendingNotify, setIsSendingNotify] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);

  const generateAnonymousId = () => {
    const num = Math.floor(100000 + Math.random() * 900000);
    return `CS-LEAD-${num}`;
  };

  const handleOpenRegisterModal = () => {
    const newId = generateAnonymousId();
    setAnonymousLeadId(newId);
    setIsAnonymous(false);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setSelectedProject('Bulgari Lighthouse, Jumeira Bay Island');
    setBudgetAED(25000000);
    setSource(LEAD_SOURCES[0]);
    setSelectedStatus('Hot');
    setAssignedRM(CRESTSHORE_RELATIONSHIP_MANAGERS[0].name);
    setInitialNote('');
    setRegisterSuccess(false);
    setRegisterError(null);
    setIsRegisterModalOpen(true);
  };

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      let fetchedLeads: any[] = [];
      try {
        const res = await brokerApi.getLeads();
        fetchedLeads = res.leads || [];
      } catch (e) {
        console.warn('Backend API leads offline or unreachable, using cache:', e);
      }

      // Load locally registered leads
      const localStored = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
      let localLeads: any[] = [];
      if (localStored) {
        try {
          localLeads = JSON.parse(localStored);
        } catch {}
      }

      // If empty, seed rich realistic leads covering all CRM statuses: Hot, Warm, Cold, Attempted, Meeting Done, Won, Lost
      if (fetchedLeads.length === 0 && localLeads.length === 0) {
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 3600 * 1000);
        const yesterday = new Date(now.getTime() - 24 * 3600 * 1000);
        const threeDaysAgo = new Date(now.getTime() - 72 * 3600 * 1000);
        const fiveDaysAgo = new Date(now.getTime() - 120 * 3600 * 1000);

        localLeads = [
          {
            _id: 'seed-lead-01',
            leadId: 'CS-LEAD-004891',
            name: 'Confidential Client (Anonymous Mandate)',
            isAnonymous: true,
            email: 'cs-lead-004891@crestshore-private.ae',
            mobile: '+971 4 000 0000',
            preferredContactMethod: 'WHATSAPP',
            projectName: 'Bulgari Lighthouse, Jumeira Bay Island',
            estimatedBudgetAED: 65000000,
            source: 'Private Family Office',
            status: 'Hot',
            assignedRM: 'Tariq Al-Mansoor (Principal RM)',
            lastActivity: twoHoursAgo.toISOString(),
            lastActivitySummary: 'Penthouse floorplans & customized payment plan shared. Immediate cash buyer.',
            createdAt: threeDaysAgo.toISOString()
          },
          {
            _id: 'seed-lead-02',
            leadId: 'CS-LEAD-005128',
            name: 'His Excellency Sultan Al Qasimi',
            isAnonymous: false,
            email: 'sultan.al.qasimi@holding-uae.ae',
            mobile: '+971 50 491 8820',
            preferredContactMethod: 'PHONE',
            projectName: 'Atlantis The Royal Residences, Palm Jumeirah',
            estimatedBudgetAED: 48000000,
            source: 'Direct Client Mandate',
            status: 'Meeting Done',
            assignedRM: 'Elena Rostova (Acquisitions RM)',
            lastActivity: yesterday.toISOString(),
            lastActivitySummary: 'Completed private sunset viewing of Sky Villa terrace at 16:30 GST.',
            createdAt: yesterday.toISOString()
          },
          {
            _id: 'seed-lead-03',
            leadId: 'CS-LEAD-006239',
            name: 'Lord Alistair Vance',
            isAnonymous: false,
            email: 'a.vance@vancecap.co.uk',
            mobile: '+44 7700 900142',
            preferredContactMethod: 'EMAIL',
            projectName: 'The Lana Residences (Dorchester Collection)',
            estimatedBudgetAED: 38000000,
            source: 'Wealth Manager / Private Bank',
            status: 'Won',
            assignedRM: 'Marcus Vance (Private Lending RM)',
            lastActivity: threeDaysAgo.toISOString(),
            lastActivitySummary: 'Reservation agreement executed. 50% commission split settled within 24h SLA.',
            createdAt: threeDaysAgo.toISOString()
          },
          {
            _id: 'seed-lead-04',
            leadId: 'CS-LEAD-007415',
            name: 'Confidential Mandate (European Sovereign Desk)',
            isAnonymous: true,
            email: 'cs-lead-007415@crestshore-private.ae',
            mobile: '+971 4 000 0000',
            preferredContactMethod: 'WHATSAPP',
            projectName: 'Burj Binghatti Jacob & Co Residences',
            estimatedBudgetAED: 110000000,
            source: 'Strategic Partner Network',
            status: 'Warm',
            assignedRM: 'Tariq Al-Mansoor (Principal RM)',
            lastActivity: now.toISOString(),
            lastActivitySummary: 'Comparing 2 sky mansion duplexes. Awaiting trustee investment board sign-off.',
            createdAt: now.toISOString()
          },
          {
            _id: 'seed-lead-05',
            leadId: 'CS-LEAD-008102',
            name: 'Dr. Rashid Al-Nuaimi',
            isAnonymous: false,
            email: 'r.alnuaimi@medtech.ae',
            mobile: '+971 55 819 0041',
            preferredContactMethod: 'WHATSAPP',
            projectName: 'Tilal Al Ghaf Lanai Islands',
            estimatedBudgetAED: 26000000,
            source: 'Chartered Accountant (CA) Advisory',
            status: 'Attempted',
            assignedRM: 'Soraya Haddad (Property Care RM)',
            lastActivity: yesterday.toISOString(),
            lastActivitySummary: 'Introductory WhatsApp brochure dispatched; follow-up call scheduled for tomorrow.',
            createdAt: fiveDaysAgo.toISOString()
          },
          {
            _id: 'seed-lead-06',
            leadId: 'CS-LEAD-009044',
            name: 'Marcus Sterling',
            isAnonymous: false,
            email: 'm.sterling@sterling-holdings.ch',
            mobile: '+41 79 123 4567',
            preferredContactMethod: 'EMAIL',
            projectName: 'One Za\'abeel The Residences',
            estimatedBudgetAED: 18000000,
            source: 'High-Net-Worth Peer Referral',
            status: 'Cold',
            assignedRM: 'Elena Rostova (Acquisitions RM)',
            lastActivity: fiveDaysAgo.toISOString(),
            lastActivitySummary: 'Client paused acquisition timeline until Q4 fiscal rebalancing. Keep in quarterly digest.',
            createdAt: fiveDaysAgo.toISOString()
          },
          {
            _id: 'seed-lead-07',
            leadId: 'CS-LEAD-009890',
            name: 'Aethelgard Private Office',
            isAnonymous: true,
            email: 'aethelgard@private-sweden.se',
            mobile: '+971 4 000 0000',
            preferredContactMethod: 'EMAIL',
            projectName: 'Palm Flower by Foster + Partners',
            estimatedBudgetAED: 95000000,
            source: 'Private Family Office',
            status: 'Lost',
            assignedRM: 'Tariq Al-Mansoor (Principal RM)',
            lastActivity: fiveDaysAgo.toISOString(),
            lastActivitySummary: 'Client opted for Monaco waterfront acquisition instead. Mandate archived.',
            createdAt: fiveDaysAgo.toISOString()
          }
        ];
        localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(localLeads));
      }

      // Combine API leads and local leads, normalizing status
      const combined = [...localLeads, ...fetchedLeads];
      const uniqueMap = new Map();
      combined.forEach((l) => {
        const key = l.leadId || l._id;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, { ...l, status: normalizeStatus(l.status) });
        }
      });
      const allLeads = Array.from(uniqueMap.values());
      setLeads(allLeads);
    } catch (err) {
      console.error('Failed to load broker leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  // Quick inline status change handler directly in table row
  const handleInlineStatusChange = async (lead: any, newStatus: string) => {
    const now = new Date().toISOString();
    const updatedStatus = newStatus;
    const previousStatus = lead.status;

    // Optimistically update in state
    const updatedList = leads.map((l) =>
      (l._id === lead._id || l.leadId === lead.leadId)
        ? {
            ...l,
            status: updatedStatus,
            lastActivity: now,
            lastActivitySummary: `Status changed from ${previousStatus} to ${updatedStatus}`
          }
        : l
    );
    setLeads(updatedList);

    // Save to localStorage
    const localStored = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
    if (localStored) {
      const list = JSON.parse(localStored);
      const idx = list.findIndex((l: any) => l._id === lead._id || l.leadId === lead.leadId);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          status: updatedStatus,
          lastActivity: now,
          lastActivitySummary: `Status changed from ${previousStatus} to ${updatedStatus}`
        };
        localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(list));
      }
    }

    // Attempt backend update
    try {
      await brokerApi.updateLeadStatus(lead._id, updatedStatus, `Stage updated to ${updatedStatus}`);
    } catch {}
  };

  const handleRegisterLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);
    setRegisterError(null);

    const now = new Date();
    const leadId = anonymousLeadId || generateAnonymousId();

    const finalName = isAnonymous
      ? `Confidential Client (${leadId})`
      : clientName.trim() || `Client Mandate (${leadId})`;

    const finalEmail = isAnonymous
      ? `${leadId.toLowerCase()}@crestshore-private.ae`
      : clientEmail.trim() || `${leadId.toLowerCase()}@crestshore-private.ae`;

    const finalPhone = isAnonymous
      ? '+971 4 000 0000'
      : clientPhone.trim() || '+971 4 000 0000';

    const newLeadRecord = {
      _id: `custom-${Date.now()}`,
      leadId,
      name: finalName,
      email: finalEmail,
      mobile: finalPhone,
      isAnonymous,
      preferredContactMethod: 'WHATSAPP',
      projectName: selectedProject.trim(),
      estimatedBudgetAED: Number(budgetAED) || 25000000,
      source,
      status: selectedStatus,
      assignedRM,
      notes: [
        {
          author: 'Omar Farooq (Broker Partner)',
          text: initialNote.trim() || `Mandate registered for ${selectedProject}. Status: ${selectedStatus}. Assigned RM: ${assignedRM}.`,
          createdAt: now.toISOString()
        }
      ],
      lastActivity: now.toISOString(),
      lastActivitySummary: initialNote.trim() || `Lead registered by Broker with status: ${selectedStatus}`,
      createdAt: now.toISOString()
    };

    try {
      // Save locally
      const localStored = localStorage.getItem(LOCAL_STORAGE_LEADS_KEY);
      const existing: any[] = localStored ? JSON.parse(localStored) : [];
      const updated = [newLeadRecord, ...existing];
      localStorage.setItem(LOCAL_STORAGE_LEADS_KEY, JSON.stringify(updated));

      // Attempt API
      try {
        await brokerApi.createLead({
          leadId,
          name: finalName,
          email: finalEmail,
          mobile: finalPhone,
          isAnonymous,
          projectName: selectedProject.trim(),
          estimatedBudgetAED: Number(budgetAED),
          source,
          status: selectedStatus,
          assignedRM,
          message: initialNote.trim()
        });
      } catch {}

      setRegisterSuccess(true);
      setTimeout(() => {
        setRegisterSuccess(false);
        setIsRegisterModalOpen(false);
        loadLeads();
      }, 1500);
    } catch (err: any) {
      setRegisterError(err.message || 'Failed to register client mandate');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleOpenNotifyModal = (lead: any) => {
    setSelectedLeadForNotify(lead);
    const leadProject = lead.projectName || lead.property?.title || 'Luxury Mandate';
    setNotifyTitle(`Update on ${leadProject}`);
    setNotifyMessage('');
    setNotifySuccess(false);
    setNotifyError(null);
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadForNotify || !notifyMessage.trim()) return;

    setIsSendingNotify(true);
    setNotifyError(null);
    try {
      try {
        await brokerApi.sendClientNotification({
          recipientEmail: selectedLeadForNotify.email,
          recipientName: selectedLeadForNotify.name,
          title: notifyTitle.trim() || `Update on ${selectedLeadForNotify.projectName || 'Inquiry'}`,
          message: notifyMessage.trim(),
          type: notifyType,
          link: '/profile'
        });
      } catch {}

      const now = new Date();
      selectedLeadForNotify.lastActivity = now.toISOString();
      selectedLeadForNotify.lastActivitySummary = `Live alert dispatched: "${notifyTitle.trim()}"`;

      setNotifySuccess(true);
      setTimeout(() => {
        setNotifySuccess(false);
        setSelectedLeadForNotify(null);
        setNotifyTitle('');
        setNotifyMessage('');
        loadLeads();
      }, 1800);
    } catch (err: any) {
      setNotifyError(err.message || 'Failed to dispatch notification to client');
    } finally {
      setIsSendingNotify(false);
    }
  };

  // Status Counts for Tabs
  const statusCounts = {
    total: leads.length,
    Hot: leads.filter((l) => l.status === 'Hot').length,
    Warm: leads.filter((l) => l.status === 'Warm').length,
    Cold: leads.filter((l) => l.status === 'Cold').length,
    Attempted: leads.filter((l) => l.status === 'Attempted').length,
    'Meeting Done': leads.filter((l) => l.status === 'Meeting Done').length,
    Won: leads.filter((l) => l.status === 'Won').length,
    Lost: leads.filter((l) => l.status === 'Lost').length
  };

  // Filtering by Status & Search
  const filteredLeads = leads.filter((l) => {
    const matchesStatus = !activeStatus || l.status === activeStatus;
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.leadId && l.leadId.toLowerCase().includes(q)) ||
      (l.projectName && l.projectName.toLowerCase().includes(q)) ||
      (l.property?.title && l.property.title.toLowerCase().includes(q)) ||
      (l.assignedRM && l.assignedRM.toLowerCase().includes(q)) ||
      (l.source && l.source.toLowerCase().includes(q))
    );
  });

  // "Filter no of leads" pagination/slice
  const totalFilteredCount = filteredLeads.length;
  const totalPages = Math.ceil(totalFilteredCount / pageSize) || 1;
  const paginatedLeads = pageSize === 0 ? filteredLeads : filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const statusTabItems = [
    { key: '', label: 'All Leads', count: statusCounts.total, icon: Users2, color: 'text-[#102A43]' },
    { key: 'Hot', label: 'Hot', count: statusCounts.Hot, icon: Flame, color: 'text-rose-600' },
    { key: 'Warm', label: 'Warm', count: statusCounts.Warm, icon: Sun, color: 'text-amber-600' },
    { key: 'Cold', label: 'Cold', count: statusCounts.Cold, icon: Snowflake, color: 'text-blue-600' },
    { key: 'Attempted', label: 'Attempted', count: statusCounts.Attempted, icon: PhoneCall, color: 'text-indigo-600' },
    { key: 'Meeting Done', label: 'Meeting Done', count: statusCounts['Meeting Done'], icon: CalendarCheck, color: 'text-purple-600' },
    { key: 'Won', label: 'Won', count: statusCounts.Won, icon: Trophy, color: 'text-[#5D7A65]' },
    { key: 'Lost', label: 'Lost', count: statusCounts.Lost, icon: XCircle, color: 'text-stone-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D4]">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Institutional Sales & Mandate CRM</span>
          </div>
          <h1 className="font-display text-3xl font-light tracking-tight text-[#102A43]">
            Lead Pipeline
          </h1>
          <p className="text-xs text-[#6B7280] font-light mt-1">
            Filter by lead counts and status (Hot, Warm, Cold, Attempted, Meeting Done, Won, Lost), assign RMs, and audit CRM activity.
          </p>
        </div>

        {/* Action Button: Register New Client */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenRegisterModal}
            className="px-5 py-2.5 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] text-xs uppercase tracking-wider font-bold transition-all shadow-sm flex items-center gap-2 border border-[#102A43]"
          >
            <UserPlus className="w-4 h-4 text-[#B08D57]" />
            <span>Register a Client</span>
          </button>
        </div>
      </div>

      {/* CRM Status Filter Pills (Hot, Warm, Cold, Attempted, Meeting Done, Won, Lost) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#6B7280]">
          <span className="text-[10px] uppercase tracking-wider font-mono font-semibold text-[#102A43]">
            Select CRM Status Filter:
          </span>
          <span className="font-mono text-[11px]">
            {totalFilteredCount} matching leads
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {statusTabItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeStatus === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveStatus(tab.key);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 uppercase tracking-wider border transition-all text-[11px] flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#102A43] border-[#102A43] text-[#FFFDF8] font-bold shadow-sm'
                    : 'border-[#E9E1D4] bg-[#FFFDF8] text-[#3E4852] hover:text-[#102A43] hover:border-[#B08D57]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B08D57]' : tab.color}`} />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-[#B08D57] text-[#102A43]'
                      : 'bg-[#F7F3EA] text-[#6B7280] border border-[#E9E1D4]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Bar: Filter No. of Leads + Search Filter */}
      <div className="p-4 bg-[#FFFDF8] border border-[#E9E1D4] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Lead ID, Client, Project, or RM..."
            className="w-full pl-9 pr-3 py-2 bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] text-xs text-[#102A43] focus:outline-none"
          />
        </div>

        {/* "Filter no of leads" Selector */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B08D57]" />
            <span className="text-[10px] uppercase font-mono text-[#6B7280] font-semibold">
              Filter No. of Leads:
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] px-2.5 py-1.5 text-xs text-[#102A43] font-mono font-semibold focus:outline-none"
            >
              <option value={10}>Show 10 Leads</option>
              <option value={25}>Show 25 Leads</option>
              <option value={50}>Show 50 Leads</option>
              <option value={0}>Show All ({totalFilteredCount})</option>
            </select>
          </div>

          <span className="text-[#6B7280] font-mono text-[11px] hidden sm:inline">
            Showing {paginatedLeads.length} of {totalFilteredCount} leads
          </span>
        </div>
      </div>

      {/* CRM Leads Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-[#FFFDF8] border border-[#E9E1D4] animate-pulse" />
          ))}
        </div>
      ) : paginatedLeads.length === 0 ? (
        <div className="text-center py-20 bg-[#FFFDF8] border border-[#E9E1D4] p-8 text-xs text-[#6B7280] space-y-3 shadow-sm">
          <Users2 className="w-10 h-10 mx-auto text-[#B08D57] opacity-40" />
          <p className="font-display text-lg text-[#102A43]">No leads found for status &ldquo;{activeStatus || 'All'}&rdquo;.</p>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
            Try switching status tabs above or register a new mandate.
          </p>
          <button
            onClick={handleOpenRegisterModal}
            className="mt-2 px-4 py-2 bg-[#102A43] text-[#FFFDF8] text-xs uppercase font-semibold inline-flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#B08D57]" />
            <span>Register a Client</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#FFFDF8] border border-[#E9E1D4] shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F3EA] border-b border-[#E9E1D4] text-[#6B7280] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Lead ID & Client</th>
                <th className="p-4">Interested Project</th>
                <th className="p-4">Budget & Source</th>
                <th className="p-4">
                  <span>Select Status (CRM)</span>
                </th>
                <th className="p-4">Assigned RM (Crestshore)</th>
                <th className="p-4">Last CRM Activity (Date & Time)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E1D4]">
              {paginatedLeads.map((lead) => {
                const leadProject = lead.projectName || lead.property?.title || 'General Prime Advisory';
                const activityDate = lead.lastActivity ? new Date(lead.lastActivity) : new Date(lead.createdAt || Date.now());
                const formattedDate = activityDate.toLocaleDateString('en-AE', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                const formattedTime = activityDate.toLocaleTimeString('en-AE', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });

                return (
                  <tr key={lead._id || lead.leadId} className="hover:bg-[#F7F3EA]/60 transition-colors">
                    {/* Lead ID & Client */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-display text-xs font-semibold shrink-0 border ${
                            lead.isAnonymous
                              ? 'bg-[#0B2135] text-[#D8C3A5] border-[#B08D57]'
                              : 'bg-[#102A43] text-[#FFFDF8] border-[#102A43]'
                          }`}
                        >
                          {lead.isAnonymous ? (
                            <Lock className="w-4 h-4 text-[#B08D57]" />
                          ) : (
                            lead.name?.slice(0, 2).toUpperCase() || 'CL'
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm font-medium text-[#102A43]">
                              {lead.name}
                            </span>
                            {lead.isAnonymous && (
                              <span className="px-1.5 py-0.5 bg-[#B08D57]/15 text-[#B08D57] border border-[#B08D57]/40 text-[9px] uppercase font-mono font-bold tracking-wider">
                                Anonymous
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#B08D57] font-mono block mt-0.5">
                            {lead.leadId} {lead.isAnonymous ? '• Encrypted Mandate' : `• ${lead.mobile}`}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Interested Project */}
                    <td className="p-4">
                      <div className="max-w-xs">
                        <span className="text-[#102A43] font-medium block truncate">
                          {leadProject}
                        </span>
                        <span className="text-[10px] text-[#6B7280]">
                          Dubai Prime Portfolio
                        </span>
                      </div>
                    </td>

                    {/* Target Budget & Source */}
                    <td className="p-4">
                      <div>
                        <span className="font-display text-sm text-[#102A43] block">
                          {lead.estimatedBudgetAED ? formatAED(lead.estimatedBudgetAED) : 'AED 25,000,000+'}
                        </span>
                        <span className="text-[10px] text-[#6B7280] font-mono">
                          {lead.source || 'Referral'}
                        </span>
                      </div>
                    </td>

                    {/* Select Status (Interactive CRM dropdown inside table row) */}
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5">
                        {getStatusIcon(lead.status)}
                        <select
                          value={normalizeStatus(lead.status)}
                          onChange={(e) => handleInlineStatusChange(lead, e.target.value)}
                          className={`text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-1 border cursor-pointer focus:outline-none shadow-sm transition-all ${getStatusBadgeStyle(
                            lead.status
                          )}`}
                          title="Click to update status instantly"
                        >
                          <option value="Hot">Hot 🔥</option>
                          <option value="Warm">Warm ☀️</option>
                          <option value="Cold">Cold ❄️</option>
                          <option value="Attempted">Attempted 📞</option>
                          <option value="Meeting Done">Meeting Done 🤝</option>
                          <option value="Won">Won 🏆</option>
                          <option value="Lost">Lost ❌</option>
                        </select>
                      </div>
                    </td>

                    {/* Assigned RM (in our company) */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#102A43] text-[#D8C3A5] border border-[#B08D57] flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                          RM
                        </div>
                        <div>
                          <span className="text-[#102A43] font-medium block text-xs">
                            {lead.assignedRM || 'Tariq Al-Mansoor (Principal RM)'}
                          </span>
                          <span className="text-[9px] text-[#6B7280] font-mono">
                            Crestshore Private Advisory
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Last CRM Activity (Date & Time) */}
                    <td className="p-4 font-mono text-[11px]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[#102A43] font-medium">
                          <Clock className="w-3 h-3 text-[#B08D57]" />
                          <span>{formattedDate} • {formattedTime} GST</span>
                        </div>
                        <p className="text-[10px] text-[#6B7280] truncate max-w-xs font-sans">
                          {lead.lastActivitySummary || 'Inquiry registered into CRM pipeline.'}
                        </p>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenNotifyModal(lead)}
                          className="px-2.5 py-1.5 border border-[#E9E1D4] hover:border-[#B08D57] text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8] text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors"
                          title="Transmit direct alert to client"
                        >
                          <Bell className="w-3 h-3 text-[#B08D57]" />
                          <span>Notify</span>
                        </button>

                        <Link
                          to={`/broker/leads/${lead._id || lead.leadId}`}
                          className="px-3 py-1.5 bg-[#102A43] hover:bg-[#1E3A5F] text-xs uppercase tracking-wider text-[#FFFDF8] border border-[#102A43] inline-flex items-center gap-1 font-semibold transition-all shadow-sm"
                        >
                          <span>CRM Details</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#B08D57]" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table Pagination Controls */}
          {pageSize > 0 && totalPages > 1 && (
            <div className="p-4 bg-[#F7F3EA] border-t border-[#E9E1D4] flex items-center justify-between text-xs">
              <span className="text-[#6B7280] font-mono text-[11px]">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 border border-[#E9E1D4] bg-[#FFFDF8] text-[#102A43] disabled:opacity-40 uppercase text-[10px] font-semibold"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 text-xs font-mono font-bold border ${
                      currentPage === pg
                        ? 'bg-[#102A43] text-[#FFFDF8] border-[#102A43]'
                        : 'bg-[#FFFDF8] text-[#6B7280] border-[#E9E1D4]'
                    }`}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 border border-[#E9E1D4] bg-[#FFFDF8] text-[#102A43] disabled:opacity-40 uppercase text-[10px] font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Register a Client */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2135]/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[92vh] bg-[#FFFDF8] border border-[#E9E1D4] shadow-2xl flex flex-col text-[#3E4852]">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E9E1D4] flex items-center justify-between bg-[#F7F3EA]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-mono font-semibold block">
                  Institutional Client Mandate Intake
                </span>
                <h3 className="font-display text-2xl font-light text-[#102A43]">
                  Register a Client / Referral
                </h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 text-[#6B7280] hover:text-[#102A43]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs">
              {registerSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="w-14 h-14 text-[#5D7A65] mx-auto animate-bounce" />
                  <h4 className="font-display text-2xl font-normal text-[#102A43]">
                    Mandate Registered Successfully
                  </h4>
                  <p className="text-xs text-[#6B7280] max-w-md mx-auto">
                    Reference <strong className="font-mono text-[#B08D57]">{anonymousLeadId}</strong> recorded with status <strong>{selectedStatus}</strong> and assigned to{' '}
                    <strong>{assignedRM}</strong>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterLeadSubmit} className="space-y-6">
                  {registerError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{registerError}</span>
                    </div>
                  )}

                  {/* Anonymous / Confidential Mandate Option Toggle */}
                  <div className="p-4 bg-[#F7F3EA] border border-[#E9E1D4] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Lock className="w-4 h-4 text-[#B08D57]" />
                        <label
                          htmlFor="anonymous-toggle"
                          className="font-medium text-xs text-[#102A43] cursor-pointer"
                        >
                          Keep Details Anonymous (System Auto-Generates Lead ID)
                        </label>
                      </div>
                      <input
                        id="anonymous-toggle"
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="w-4 h-4 accent-[#B08D57] cursor-pointer"
                      />
                    </div>

                    <p className="text-[11px] text-[#6B7280] leading-relaxed">
                      Enable this option if your high-net-worth client or family office requires total confidentiality. The system will track all progress under the generated reference number without recording contact details.
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E9E1D4]/60">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#102A43]">
                        <span className="text-[#6B7280]">System Lead ID:</span>
                        <strong className="text-[#B08D57] font-bold">{anonymousLeadId}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAnonymousLeadId(generateAnonymousId())}
                        className="text-[10px] font-mono text-[#6B7280] hover:text-[#102A43] flex items-center gap-1 uppercase tracking-wider"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Regenerate ID</span>
                      </button>
                    </div>
                  </div>

                  {/* Client Identification Fields */}
                  {!isAnonymous && (
                    <div className="space-y-4">
                      <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#102A43] pb-1 border-b border-[#E9E1D4]">
                        Client Identification Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                            Client Full Name
                          </label>
                          <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="e.g. Sheikh Mohammed Al-Fassi"
                            className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={clientEmail}
                            onChange={(e) => setClientEmail(e.target.value)}
                            placeholder="e.g. client@privatewealth.ae"
                            className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                            Mobile / WhatsApp No.
                          </label>
                          <input
                            type="tel"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            placeholder="e.g. +971 50 123 4567"
                            className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Project Selection with 70+ Prime Dubai Developments Autocomplete */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-[#E9E1D4]">
                      <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-[#102A43]">
                        Project of Interest (50–100 Curated Dubai Developments)
                      </h4>
                      <span className="text-[10px] text-[#B08D57] font-mono">
                        Select from list or type custom name
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                        Search / Select Dubai Development or Enter Custom Project *
                      </label>
                      <input
                        list="dubai-projects-datalist"
                        type="text"
                        required
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        placeholder="Type to search e.g. Bulgari Lighthouse, Atlantis The Royal, Burj Binghatti..."
                        className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none"
                      />
                      <datalist id="dubai-projects-datalist">
                        {DUBAI_PRIME_PROJECTS.map((proj, idx) => (
                          <option key={idx} value={`${proj.name} (${proj.location})`}>
                            {proj.developer ? `By ${proj.developer} • ${proj.location}` : proj.location}
                          </option>
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Select Status, Budget, Source & RM */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Select Status (Client requirement: Hot, Warm, Cold, Attempted, Meeting Done, Won, Lost) */}
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                        Select CRM Status *
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none font-bold"
                      >
                        <option value="Hot">🔥 Hot (Active offer / immediate buyer)</option>
                        <option value="Warm">☀️ Warm (Qualified / comparing)</option>
                        <option value="Cold">❄️ Cold (Long horizon / paused)</option>
                        <option value="Attempted">📞 Attempted (Outreach sent)</option>
                        <option value="Meeting Done">🤝 Meeting Done (Viewing complete)</option>
                        <option value="Won">🏆 Won (Deal closed & settled)</option>
                        <option value="Lost">❌ Lost (Mandate dropped)</option>
                      </select>
                    </div>

                    {/* Target Budget */}
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                        Target Budget (AED)
                      </label>
                      <select
                        value={budgetAED}
                        onChange={(e) => setBudgetAED(Number(e.target.value))}
                        className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none"
                      >
                        {BUDGET_TIERS.map((tier) => (
                          <option key={tier.value} value={tier.value}>
                            {tier.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Source */}
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                        Referral / Mandate Source
                      </label>
                      <select
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none"
                      >
                        {LEAD_SOURCES.map((src) => (
                          <option key={src} value={src}>
                            {src}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Assigned RM */}
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                        Assigned RM (Crestshore) *
                      </label>
                      <select
                        value={assignedRM}
                        onChange={(e) => setAssignedRM(e.target.value)}
                        className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none font-medium"
                      >
                        {CRESTSHORE_RELATIONSHIP_MANAGERS.map((rm) => (
                          <option key={rm.id} value={`${rm.name} (${rm.role.split('&')[0].trim()})`}>
                            {rm.name} — {rm.role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Initial Note */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                      Initial CRM Activity & Briefing Memo
                    </label>
                    <textarea
                      rows={3}
                      value={initialNote}
                      onChange={(e) => setInitialNote(e.target.value)}
                      placeholder="Add confidential notes on client preferences, timeline, investment mandate, or private viewing requests..."
                      className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none"
                    />
                  </div>

                  {/* Form Submission Actions */}
                  <div className="pt-4 flex items-center justify-between border-t border-[#E9E1D4]">
                    <div className="flex items-center gap-2 text-xs text-[#6B7280] font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5D7A65]" />
                      <span>Protected by 180-day non-circumvention guarantee</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsRegisterModalOpen(false)}
                        className="px-4 py-2 border border-[#E9E1D4] text-xs uppercase text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="px-6 py-2.5 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider disabled:opacity-50 flex items-center gap-2 shadow-sm"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#B08D57]" />
                        <span>{isSubmittingLead ? 'Registering...' : 'Register Mandate'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Dispatch Client Notification */}
      {selectedLeadForNotify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2135]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#FFFDF8] border border-[#E9E1D4] shadow-2xl p-6 sm:p-8 relative text-[#3E4852]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E9E1D4] mb-6">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#B08D57]" />
                <h3 className="font-display text-xl font-normal text-[#102A43]">
                  Dispatch Client Notification
                </h3>
              </div>
              <button
                onClick={() => setSelectedLeadForNotify(null)}
                className="text-[#6B7280] hover:text-[#102A43] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {notifySuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#5D7A65] mx-auto animate-bounce" />
                <h4 className="font-display text-xl font-normal text-[#102A43]">
                  Notification Dispatched
                </h4>
                <p className="text-xs text-[#6B7280] max-w-sm mx-auto leading-relaxed">
                  Real-time alert recorded in CRM ledger for {selectedLeadForNotify.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendNotification} className="space-y-4">
                {notifyError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{notifyError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                    Recipient Mandate
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedLeadForNotify.name} • ${selectedLeadForNotify.leadId}`}
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] p-2.5 text-xs text-[#6B7280] cursor-not-allowed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                    Alert Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={notifyTitle}
                    onChange={(e) => setNotifyTitle(e.target.value)}
                    placeholder="e.g. Viewing confirmation, pricing update, allocation notice"
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                    Notification Category
                  </label>
                  <select
                    value={notifyType}
                    onChange={(e) => setNotifyType(e.target.value)}
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none"
                  >
                    <option value="STATUS_CHANGE">Pipeline Status Update</option>
                    <option value="VIEWING_SCHEDULED">Viewing Itinerary & Slot</option>
                    <option value="BROKER_ASSIGNED">Broker Mandate Introduction</option>
                    <option value="GENERAL">Confidential Property Advisory Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#6B7280] mb-1">
                    Client Notification Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={notifyMessage}
                    onChange={(e) => setNotifyMessage(e.target.value)}
                    placeholder="Enter message text that will display in the client's notification bell and personal dashboard..."
                    className="w-full bg-[#F7F3EA] border border-[#E9E1D4] focus:border-[#B08D57] p-2.5 text-xs text-[#102A43] focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-[#E9E1D4]">
                  <button
                    type="button"
                    onClick={() => setSelectedLeadForNotify(null)}
                    className="px-4 py-2 border border-[#E9E1D4] text-xs uppercase text-[#6B7280] hover:text-[#102A43] bg-[#FFFDF8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingNotify}
                    className="px-5 py-2 bg-[#102A43] hover:bg-[#1E3A5F] text-[#FFFDF8] font-bold text-xs uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-[#B08D57]" />
                    <span>{isSendingNotify ? 'Transmitting...' : 'Send Live Alert'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
