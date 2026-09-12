export interface IAuditLog {
  _id: string;
  action: string;
  performedBy: string; // User ID or 'SYSTEM'
  userEmail?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  targetModel: string;
  targetId?: string;
  details?: Record<string, any>;
  createdAt: Date;
}
