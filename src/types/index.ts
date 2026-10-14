export interface Property {
  id: string;
  name: string;
  code: string;
  city: string;
  address?: string;
}

export type OperationalHoursType = '24/7' | 'working_hours' | 'hidden';

export interface PropertyContact {
  id: string;
  propertyId: string;
  name: string;
  basePosition?: string;
  email: string;
  secondaryEmail?: string;
  phone: string;
  fax?: string;
  operationalHours?: OperationalHoursType;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SectionAssignment {
  id: string;
  propertyId: string;
  sectionId: string;
  contactId: string;
  position: string;
  linkedAt: string;
}

export interface SectionDef {
  id: string;
  title: string;
  description: string;
  badge?: string;
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

export const PRESET_POSITIONS = [
  'Finance Manager',
  'Hotel Operational',
  'Hotel Receptionist',
  'General Manager',
  'Assistant General Manager',
  'Reservation Specialist',
  'Front Office Manager',
  'Sales & Marketing Manager',
  'Revenue Manager',
  'IT & System Support',
  'Legal & Contract Officer',
  'Customer Care Lead',
  'Other Hotel Roles'
] as const;
