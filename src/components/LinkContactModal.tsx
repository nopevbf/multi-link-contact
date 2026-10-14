import React, { useState } from 'react';
import { PropertyContact, SectionDef, PRESET_POSITIONS } from '../types';
import { usePropertyContact } from '../context/PropertyContactContext';
import { X, UserCheck, ShieldCheck, Briefcase, Plus, Check } from 'lucide-react';

interface LinkContactModalProps {
  contact: PropertyContact | null;
  section: SectionDef;
  isOpen: boolean;
  onClose: () => void;
}

export const LinkContactModal: React.FC<LinkContactModalProps> = ({
  contact,
  section,
  isOpen,
  onClose
}) => {
  const { linkContactToSection, isContactLinkedToSection } = usePropertyContact();

  const [selectedPreset, setSelectedPreset] = useState<string>('Finance Manager');
  const [customPosition, setCustomPosition] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  React.useEffect(() => {
    if (contact) {
      const defaultPos = contact.basePosition || 'Finance Manager';
      const isPreset = (PRESET_POSITIONS as readonly string[]).includes(defaultPos);
      if (isPreset) {
        setSelectedPreset(defaultPos);
        setIsCustomMode(false);
      } else if (defaultPos) {
        setIsCustomMode(true);
        setCustomPosition(defaultPos);
      }
    }
  }, [contact, isOpen]);

  if (!isOpen || !contact) return null;

  const alreadyLinked = isContactLinkedToSection(contact.id, section.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPosition = isCustomMode ? customPosition.trim() : selectedPreset;

    if (!finalPosition) {
      setError('Harap tentukan posisi/jabatan kontak untuk seksi ini.');
      return;
    }

    linkContactToSection(contact.id, section.id, finalPosition);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-semibold">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {alreadyLinked ? 'Perbarui Posisi pada Seksi' : 'Tentukan Posisi untuk Seksi'}
              </h3>
              <p className="text-xs text-slate-500">
                Seksi: <span className="font-semibold text-slate-700">{section.title}</span>
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Contact summary */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{contact.name}</p>
              <p className="text-xs text-slate-500 truncate">{contact.email}</p>
              <p className="text-xs text-slate-500 font-mono">{contact.phone}</p>
            </div>
            {alreadyLinked && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                Sudah Terhubung
              </span>
            )}
          </div>

          {/* Section explanation */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Posisi Bersifat Spesifik per Seksi</p>
              <p className="text-blue-700 mt-0.5">
                Posisi yang Anda pilih di sini hanya akan berlaku untuk seksi{' '}
                <strong>{section.title}</strong> dan tidak akan mempengaruhi posisi kontak ini di seksi lainnya.
              </p>
            </div>
          </div>

          {/* Position Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Pilih Jabatan / Posisi pada Seksi Ini
            </label>

            {/* Mode switcher tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(false);
                  setError('');
                }}
                className={`flex-1 py-1.5 px-3 rounded-md transition-colors ${
                  !isCustomMode
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pilihan Preset Jabatan
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(true);
                  setError('');
                }}
                className={`flex-1 py-1.5 px-3 rounded-md transition-colors ${
                  isCustomMode
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tulis Jabatan Kustom
              </button>
            </div>

            {!isCustomMode ? (
              <div className="space-y-2">
                <select
                  value={selectedPreset}
                  onChange={(e) => {
                    setSelectedPreset(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                >
                  {PRESET_POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>

                {/* Quick chip recommendations */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Finance Manager', 'Hotel Operational', 'Hotel Receptionist', 'Reservation Specialist'].map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSelectedPreset(p)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                          selectedPreset === p
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Contoh: Duty Manager / Head of Concierge"
                  value={customPosition}
                  onChange={(e) => {
                    setCustomPosition(e.target.value);
                    setError('');
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  autoFocus
                />
                <p className="text-xs text-slate-400">
                  Ketik nama jabatan khusus sesuai struktur tim internal hotel Anda.
                </p>
              </div>
            )}

            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
          </div>

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
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{alreadyLinked ? 'Simpan Perubahan Posisi' : 'Tautkan ke Seksi Ini'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
