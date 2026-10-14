import React, { useState, useEffect } from 'react';
import { SectionAssignment, PropertyContact, SectionDef, PRESET_POSITIONS } from '../types';
import { usePropertyContact } from '../context/PropertyContactContext';
import { X, Briefcase, Check, ShieldAlert } from 'lucide-react';

interface EditSectionPositionModalProps {
  assignment: SectionAssignment | null;
  contact: PropertyContact | null;
  section: SectionDef;
  isOpen: boolean;
  onClose: () => void;
}

export const EditSectionPositionModal: React.FC<EditSectionPositionModalProps> = ({
  assignment,
  contact,
  section,
  isOpen,
  onClose
}) => {
  const { updateSectionPosition } = usePropertyContact();

  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customPosition, setCustomPosition] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (assignment) {
      const isPreset = (PRESET_POSITIONS as readonly string[]).includes(assignment.position);
      if (isPreset) {
        setSelectedPreset(assignment.position);
        setCustomPosition('');
        setIsCustomMode(false);
      } else {
        setSelectedPreset(PRESET_POSITIONS[0]);
        setCustomPosition(assignment.position);
        setIsCustomMode(true);
      }
    }
    setError('');
  }, [assignment, isOpen]);

  if (!isOpen || !assignment || !contact) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPosition = isCustomMode ? customPosition.trim() : selectedPreset;

    if (!finalPosition) {
      setError('Harap isi atau pilih posisi baru.');
      return;
    }

    updateSectionPosition(assignment.id, finalPosition);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Ubah Posisi pada Seksi</h3>
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <p className="text-xs text-slate-500">Kontak Terkait</p>
            <p className="text-sm font-bold text-slate-900">{contact.name}</p>
            <p className="text-xs text-slate-600 mt-1">
              Posisi saat ini di {section.title}: <span className="font-semibold text-blue-800">{assignment.position}</span>
            </p>
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Independensi Posisi Antar Seksi</p>
              <p className="text-blue-700 mt-0.5">
                Perubahan ini <strong>hanya berlaku untuk seksi {section.title}</strong>. Posisi {contact.name} pada seksi lain tidak akan ikut terpengaruh atau tertimpa.
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="space-y-3 pt-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Posisi Baru untuk Seksi Ini
            </label>

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
                Pilihan Preset
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
                Kustom Teks
              </button>
            </div>

            {!isCustomMode ? (
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
            ) : (
              <input
                type="text"
                placeholder="Contoh: Hotel Operational"
                value={customPosition}
                onChange={(e) => {
                  setCustomPosition(e.target.value);
                  setError('');
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                autoFocus
              />
            )}

            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Posisi Seksi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
