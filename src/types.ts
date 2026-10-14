export type TransportMode = 'sea' | 'air' | 'land';

export type ShipmentStatus = 'received' | 'processing' | 'in_transit' | 'customs' | 'delivered';

export type QuoteStatus = 'new' | 'contacted' | 'approved' | 'closed';

export type UserRole = 'admin' | 'staff';

export interface ShipmentEvent {
  id: string;
  message: string;
  location: string;
  occurredAt: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  mode: TransportMode;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  cargo: string;
  eta: string;
  customerName: string;
  customerPhone: string;
  events: ShipmentEvent[];
  internalNotes?: string;
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  reference: string;
  mode: TransportMode;
  origin: string;
  destination: string;
  quantity: number;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  estimatedAmount: number | null;
  status: QuoteStatus;
  internalNotes?: string;
  createdAt: string;
}

export interface RateItem {
  mode: TransportMode;
  price: number;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
