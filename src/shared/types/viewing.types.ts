export type ViewingStatus = 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

export interface IViewing {
  _id: string;
  property: any;
  lead?: any;
  client?: any;
  broker: any;
  viewingDate: Date;
  viewingTimeSlot: string; // e.g. "14:00 - 15:00"
  status: ViewingStatus;
  meetingPoint?: string;
  attendeesCount?: number;
  clientFeedback?: string;
  brokerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
