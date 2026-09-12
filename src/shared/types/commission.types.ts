export type CommissionStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'DISPUTED';

export interface ICommission {
  _id: string;
  transactionId: string;
  property: any;
  broker: any;
  client?: any;
  salePriceAED: number;
  grossCommissionPct: number;    // e.g. 2% standard Dubai brokerage fee
  grossCommissionAED: number;    // salePrice * grossCommissionPct
  brokerSplitPct: number;        // e.g. 50% or 60%
  netBrokerCommissionAED: number;
  companyCommissionAED: number;
  status: CommissionStatus;
  closedDate: Date;
  paidDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
