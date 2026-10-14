import React from 'react';
import { PropertyContact, SectionAssignment, SectionDef } from '../types';
import { usePropertyContact } from '../context/PropertyContactContext';
import { AlertTriangle, Trash2, Unlink, X } from 'lucide-react';

export type DeleteModalMode =
  | { type: 'delete-contact'; contact: PropertyContact }
  | { type: 'unlink-section'; assignment: SectionAssignment; contact: PropertyContact; section: SectionDef };

interface ConfirmDeleteModalProps {
  modalData: DeleteModalMode | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  modalData,
  isOpen,
  onClose
}) => {
  const { deleteContact, unlinkContactFromSection, getContactPositionsMap } = usePropertyContact();

  if (!isOpen || !modalData) return null;

  const isCascadeDelete = modalData.type === 'delete-contact';

  const linkedPositions = isCascadeDelete ? getContactPositionsMap(modalData.contact.id) : [];

  const handleConfirm = () => {
    if (modalData.type === 'delete-contact') {
      deleteContact(modalData.contact.id);
    } else {
      unlinkContactFromSection(modalData.assignment.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isCascadeDelete ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isCascadeDelete ? <Trash2 className="w-5 h-5" /> : <Unlink className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isCascadeDelete ? 'Hapus Kontak dari Properti' : 'Lepas dari Seksi'}
              </h3>
              <p className="text-xs text-slate-500">Konfirmasi Tindakan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isCascadeDelete ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-700 leading-relaxed">
                Apakah Anda yakin ingin menghapus data kontak{' '}
                <strong className="text-slate-900">{modalData.contact.name}</strong> secara permanen dari daftar Kontak Tersedia?
              </p>

              {linkedPositions.length > 0 ? (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-rose-800">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Perhatian: Penanganan Relasi Seksi Otomatis</span>
                  </div>
                  <p className="leading-relaxed">
                    Kontak ini saat ini terhubung pada <strong>{linkedPositions.length} seksi</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-rose-800 font-medium">
                    {linkedPositions.map((pos) => (
                      <li key={pos.sectionId}>
                        {pos.sectionTitle}: <em>{pos.position}</em>
                      </li>
                    ))}
                  </ul>
                  <p className="pt-1 text-rose-700">
                    Sistem akan secara otomatis mencopot seluruh penugasan seksi di atas agar tidak meninggalkan relasi yang tidak valid.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600">
                  Kontak ini saat ini belum terhubung ke seksi manapun. Data akan dihapus dengan aman.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-700 leading-relaxed">
                Lepas kontak <strong className="text-slate-900">{modalData.contact.name}</strong> dari seksi{' '}
                <strong className="text-slate-900">{modalData.section.title}</strong>?
              </p>

              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1.5">
                <p className="font-semibold text-blue-950">Kontak Tetap Tersimpan di Kontak Tersedia</p>
                <p className="leading-relaxed text-blue-800">
                  Tindakan ini <strong>hanya melepas (unlink)</strong> kontak dari seksi ini. Data profil kontak dan posisi pada seksi lain (jika ada) tetap aman tersimpan.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-xs transition-colors ${
                isCascadeDelete
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {isCascadeDelete ? 'Ya, Hapus Kontak & Relasi' : 'Ya, Lepas dari Seksi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
