import React from 'react';
import { PropertyContact } from '../types';
import { usePropertyContact } from '../context/PropertyContactContext';
import { X, Mail, Phone, Calendar, User, Briefcase, Plus, Edit2, Trash2 } from 'lucide-react';

interface ViewContactDetailModalProps {
  contact: PropertyContact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contact: PropertyContact) => void;
  onLinkToActiveSection: (contact: PropertyContact) => void;
  onDelete: (contact: PropertyContact) => void;
}

export const ViewContactDetailModal: React.FC<ViewContactDetailModalProps> = ({
  contact,
  isOpen,
  onClose,
  onEdit,
  onLinkToActiveSection,
  onDelete
}) => {
  const { activeProperty, activeSection, getContactPositionsMap, isContactLinkedToSection } = usePropertyContact();

  if (!isOpen || !contact) return null;

  const positions = getContactPositionsMap(contact.id);
  const isLinkedToCurrent = isContactLinkedToSection(contact.id, activeSection.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{contact.name}</h3>
              <p className="text-xs text-slate-500">
                Kontak Properti {activeProperty.name} ({activeProperty.code})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Contact Details (disesuaikan dengan form tambah kontak yang baru) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. Nama Kontak */}
              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Nama Kontak
                </span>
                <p className="font-semibold text-slate-900">{contact.name}</p>
              </div>

              {/* 2. Posisi */}
              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  Posisi
                </span>
                <p className="font-semibold text-slate-900">{contact.basePosition || '-'}</p>
              </div>

              {/* 3. Email */}
              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email
                </span>
                <p className="font-semibold text-slate-900 break-all">{contact.email}</p>
              </div>

              {/* 4. Email sekunder (jika ada) */}
              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email sekunder (jika ada)
                </span>
                <p className="font-semibold text-slate-900 break-all">
                  {contact.secondaryEmail || '-'}
                </p>
              </div>

              {/* 5. Nomor Telepon */}
              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Nomor Telepon
                </span>
                <p className="font-semibold font-mono text-slate-900">{contact.phone}</p>
              </div>

              {/* 6. Fax (jika ada) */}
              <div className="space-y-1">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  Fax (jika ada)
                </span>
                <p className="font-semibold font-mono text-slate-900">{contact.fax || '-'}</p>
              </div>
            </div>

            {/* 7. Jam Operasional (tidak ditampilkan bila dipilih Hide Operational Hours) */}
            {contact.operationalHours !== 'hidden' && (
              <div className="pt-2.5 border-t border-slate-200/60">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium mb-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Jam Operasional
                </span>
                <p className="font-semibold text-slate-900">
                  {contact.operationalHours === '24/7'
                    ? 'Available 24/7'
                    : contact.operationalHours === 'working_hours'
                    ? 'Working Hours (9 AM-5 PM)'
                    : '-'}
                </p>
              </div>
            )}
          </div>

          {/* Section Assignments breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-700" />
                Penugasan Seksi & Posisi Saat Ini
              </h4>
              <span className="text-xs text-slate-500 font-medium font-mono">
                {positions.length} seksi aktif
              </span>
            </div>

            {positions.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
                <p className="font-medium text-slate-700 mb-1">Belum Memiliki Posisi di Seksi Manapun</p>
                <p>
                  Sesuai ketentuan, kontak baru belum memiliki posisi sampai Anda menautkannya ke salah satu seksi.
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {positions.map((item) => (
                  <div
                    key={item.sectionId}
                    className="flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-50/80 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{item.sectionTitle}</p>
                      <p className="text-slate-500">Seksi Properti Terdaftar</p>
                    </div>
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200/60 font-semibold rounded-lg">
                      {item.position}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(contact);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profil
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(contact);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            </div>

            {!isLinkedToCurrent && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLinkToActiveSection(contact);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Link ke {activeSection.title}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
