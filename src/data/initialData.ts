import { Property, PropertyContact, SectionAssignment, SectionDef } from '../types';

export const INITIAL_SECTIONS: SectionDef[] = [
  {
    id: 'customer-support',
    title: 'Customer & Hotel Support',
    description: 'Pusat eskalasi operasional harian, keluhan tamu hotel, dan koordinasi cepat tim support.'
  },
  {
    id: 'reservation',
    title: 'Reservation',
    description: 'Penanganan alokasi kamar, perubahan jadwal check-in/out, dan konfirmasi reservasi mendesak.'
  },
  {
    id: 'invoice-payment',
    title: 'Invoice & Payment',
    description: 'Korespondensi rekonsiliasi pembayaran, penagihan invoice, deposit, dan pencairan dana.'
  },
  {
    id: 'contract-partnership',
    title: 'Contract & Partnership',
    description: 'Pengelolaan kontrak kerjasama properti, addendum, komisi OTA, dan legalitas kemitraan.'
  },
  {
    id: 'campaign-promotion',
    title: 'Campaign & Promotion',
    description: 'Koordinasi program promosi flash sale, voucher diskon, dan seasonal marketing campaign.'
  },
  {
    id: 'general-announcement',
    title: 'General Announcement',
    description: 'Penerima informasi regulasi umum sistem, pembaruan kebijakan platform, dan agenda penting.'
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-noorbyte',
    name: 'NOORBYTE',
    code: 'PRP-PF5PUMMI',
    city: 'Jakarta Pusat',
    address: 'Jl. Jenderal Sudirman Kav. 21, Gelora, Tanah Abang'
  },
  {
    id: 'prop-grandaston',
    name: 'GRAND ASTON RESORT',
    code: 'PRP-GA8762',
    city: 'Bali',
    address: 'Jl. Pantai Kuta No. 88, Badung, Bali'
  },
  {
    id: 'prop-heritage',
    name: 'THE HERITAGE HOTEL',
    code: 'PRP-TH1099',
    city: 'Yogyakarta',
    address: 'Jl. Malioboro No. 12, Danurejan, DI Yogyakarta'
  }
];

export const INITIAL_CONTACTS: PropertyContact[] = [
  // Kontak Properti NOORBYTE
  {
    id: 'cnt-1',
    propertyId: 'prop-noorbyte',
    name: 'Eggel',
    basePosition: 'Finance Manager',
    email: 'eggel.finance@gmail.com',
    secondaryEmail: 'eggel.work@gmail.com',
    phone: '0812-3456-7890',
    fax: '(021) 5790-1234',
    operationalHours: '24/7',
    createdAt: '2025-01-15T08:30:00Z'
  },
  {
    id: 'cnt-2',
    propertyId: 'prop-noorbyte',
    name: 'Nigel Kaufman',
    basePosition: 'Finance Manager',
    email: 'fyxe@mailinator.com',
    secondaryEmail: 'nigel.k@mailinator.com',
    phone: '0813-8899-1122',
    fax: '(021) 5790-5678',
    operationalHours: 'working_hours',
    createdAt: '2025-01-16T09:15:00Z'
  },
  {
    id: 'cnt-3',
    propertyId: 'prop-noorbyte',
    name: 'Maggie Goff',
    basePosition: 'Hotel Receptionist',
    email: 'wehoguquk@mailinator.com',
    secondaryEmail: 'maggie.reception@gmail.com',
    phone: '0821-4455-6677',
    fax: '(021) 5790-9900',
    operationalHours: '24/7',
    createdAt: '2025-01-18T10:00:00Z'
  },
  {
    id: 'cnt-4',
    propertyId: 'prop-noorbyte',
    name: 'Macon Leach',
    basePosition: 'Other Hotel Roles',
    email: 'hebipakok@mailinator.com',
    phone: '0857-1234-5678',
    fax: '(021) 5790-4422',
    operationalHours: 'working_hours',
    createdAt: '2025-01-20T11:45:00Z'
  },
  {
    id: 'cnt-5',
    propertyId: 'prop-noorbyte',
    name: 'Clare Miles',
    basePosition: 'Hotel Receptionist',
    email: 'dipy@mailinator.com',
    secondaryEmail: 'clare.miles@hotel.com',
    phone: '0819-9988-7766',
    operationalHours: '24/7',
    createdAt: '2025-01-22T14:20:00Z'
  },
  {
    id: 'cnt-6',
    propertyId: 'prop-noorbyte',
    name: 'Raditya Pratama',
    basePosition: 'Hotel Operational',
    email: 'raditya.pratama@gmail.com',
    phone: '0812-7711-2233',
    operationalHours: 'working_hours',
    createdAt: '2025-01-23T08:00:00Z'
  },
  {
    id: 'cnt-7',
    propertyId: 'prop-noorbyte',
    name: 'Sarah Jenkins',
    basePosition: 'Customer Care Lead',
    email: 'sarah.jenkins@hotelpartner.com',
    secondaryEmail: 'sarah.hotelcare@gmail.com',
    phone: '0813-4455-9988',
    operationalHours: '24/7',
    createdAt: '2025-01-24T09:10:00Z'
  },
  {
    id: 'cnt-8',
    propertyId: 'prop-noorbyte',
    name: 'Denny Kurniawan',
    basePosition: 'Hotel Operational',
    email: 'denny.kurniawan@gmail.com',
    phone: '0856-3322-1100',
    fax: '(021) 5790-3322',
    operationalHours: 'hidden',
    createdAt: '2025-01-25T10:30:00Z'
  },
  {
    id: 'cnt-9',
    propertyId: 'prop-noorbyte',
    name: 'Anisa Rahmawati',
    basePosition: 'Sales & Marketing Manager',
    email: 'anisa.rahma@yahoo.com',
    secondaryEmail: 'sales.anisa@hotel.com',
    phone: '0877-6655-4433',
    operationalHours: 'working_hours',
    createdAt: '2025-01-26T11:00:00Z'
  },
  {
    id: 'cnt-10',
    propertyId: 'prop-noorbyte',
    name: 'Hendra Wijaya',
    basePosition: 'IT & System Support',
    email: 'hendra.wijaya@outlook.com',
    phone: '0818-5544-3322',
    operationalHours: '24/7',
    createdAt: '2025-01-27T13:15:00Z'
  },
  {
    id: 'cnt-11',
    propertyId: 'prop-noorbyte',
    name: 'Jessica Tan',
    basePosition: 'Hotel Operational',
    email: 'jessica.tan@mailinator.com',
    phone: '0811-9988-7744',
    operationalHours: 'working_hours',
    createdAt: '2025-01-28T14:40:00Z'
  },
  {
    id: 'cnt-12',
    propertyId: 'prop-noorbyte',
    name: 'Rizky Ramadhan',
    basePosition: 'Front Office Manager',
    email: 'rizky.ramadhan@gmail.com',
    phone: '0819-2233-4455',
    operationalHours: '24/7',
    createdAt: '2025-01-29T15:20:00Z'
  },
  {
    id: 'cnt-13',
    propertyId: 'prop-noorbyte',
    name: 'Maya Putri',
    basePosition: 'Other Hotel Roles',
    email: 'maya.putri@partnerhotel.id',
    phone: '0852-6677-8899',
    operationalHours: 'working_hours',
    createdAt: '2025-01-30T16:00:00Z'
  },
  {
    id: 'cnt-14',
    propertyId: 'prop-noorbyte',
    name: 'Fajar Nugroho',
    basePosition: 'Other Hotel Roles',
    email: 'fajar.nugroho@hotelops.id',
    phone: '0813-1122-3344',
    operationalHours: '24/7',
    createdAt: '2025-02-01T07:45:00Z'
  },
  {
    id: 'cnt-15',
    propertyId: 'prop-noorbyte',
    name: 'Cindy Claudia',
    basePosition: 'Sales & Marketing Manager',
    email: 'cindy.claudia@gmail.com',
    phone: '0812-9900-1122',
    operationalHours: 'working_hours',
    createdAt: '2025-02-02T08:30:00Z'
  },

  // Kontak Properti GRAND ASTON RESORT (Membuktikan isolasi data properti)
  {
    id: 'cnt-ga-1',
    propertyId: 'prop-grandaston',
    name: 'Bima Satria',
    basePosition: 'General Manager',
    email: 'bima.satria@grandastonbali.com',
    phone: '0811-2345-6789',
    operationalHours: '24/7',
    createdAt: '2025-02-01T08:00:00Z'
  },
  {
    id: 'cnt-ga-2',
    propertyId: 'prop-grandaston',
    name: 'Dewi Lestari',
    basePosition: 'Finance Manager',
    email: 'dewi.finance@grandastonbali.com',
    secondaryEmail: 'finance.aston@bali.com',
    phone: '0812-9876-5432',
    operationalHours: 'working_hours',
    createdAt: '2025-02-02T09:30:00Z'
  },

  // Kontak Properti THE HERITAGE HOTEL
  {
    id: 'cnt-th-1',
    propertyId: 'prop-heritage',
    name: 'Raden Mas Suryo',
    basePosition: 'General Manager',
    email: 'suryo@heritagehoteljogja.com',
    phone: '0818-0987-6543',
    operationalHours: 'working_hours',
    createdAt: '2025-02-10T10:15:00Z'
  }
];

export const INITIAL_ASSIGNMENTS: SectionAssignment[] = [
  // Contoh penugasan di NOORBYTE:
  // Catatan: Sesuai gambar mockup, seksi 'customer-support' awalnya kosong.
  // Seksi 'reservation' memiliki Eggel sebagai Hotel Operational
  {
    id: 'asg-1',
    propertyId: 'prop-noorbyte',
    sectionId: 'reservation',
    contactId: 'cnt-1',
    position: 'Hotel Operational',
    linkedAt: '2025-01-25T11:00:00Z'
  },
  // Seksi 'invoice-payment' memiliki Eggel sebagai Finance Manager (membuktikan multi-posisi independen!)
  {
    id: 'asg-2',
    propertyId: 'prop-noorbyte',
    sectionId: 'invoice-payment',
    contactId: 'cnt-1',
    position: 'Finance Manager',
    linkedAt: '2025-01-26T14:30:00Z'
  },
  // Nigel Kaufman di invoice-payment sebagai Accounting Staff
  {
    id: 'asg-3',
    propertyId: 'prop-noorbyte',
    sectionId: 'invoice-payment',
    contactId: 'cnt-2',
    position: 'Finance Manager',
    linkedAt: '2025-01-27T09:00:00Z'
  },

  // Grand Aston penugasan:
  {
    id: 'asg-ga-1',
    propertyId: 'prop-grandaston',
    sectionId: 'customer-support',
    contactId: 'cnt-ga-1',
    position: 'General Manager',
    linkedAt: '2025-02-05T10:00:00Z'
  }
];
