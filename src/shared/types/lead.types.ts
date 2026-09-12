export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'VIEWING'
  | 'NEGOTIATION'
  | 'CONVERTED'
  | 'LOST';

export type LeadSource =
  | 'WEBSITE'
  | 'GOOGLE'
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'YOUTUBE'
  | 'REFERRAL'
  | 'DIRECT'
  | 'CAMPAIGN'
  | 'OTHER';

export type PreferredContactMethod = 'PHONE' | 'WHATSAPP' | 'EMAIL';

export interface ILead {
  _id: string;
  leadId: string;
  name: string;
  email: string;
  mobile: string;
  preferredContactMethod: PreferredContactMethod;
  property?: any;
  broker?: any;
  source: LeadSource;
  campaign?: string;
  leadType: 'INQUIRY' | 'VIEWING_REQUEST' | 'SPECIALIST_CALL' | 'CONSULTATION' | 'VALUATION';
  message: string;
  status: LeadStatus;
  estimatedBudgetAED?: number;
  notes: Array<{
    _id?: string;
    author: string;
    text: string;
    createdAt: Date;
  }>;
  followUpDate?: Date;
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadActivity {
  _id: string;
  lead: string;
  actor: string;
  type: 'STATUS_CHANGE' | 'NOTE_ADDED' | 'CALL_MADE' | 'WHATSAPP_SENT' | 'VIEWING_SCHEDULED' | 'EMAIL_SENT';
  details: string;
  previousValue?: string;
  newValue?: string;
  createdAt: Date;
}
