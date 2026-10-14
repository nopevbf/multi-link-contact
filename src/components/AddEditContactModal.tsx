import React, { useState, useEffect } from 'react';
import { PropertyContact, PRESET_POSITIONS, OperationalHoursType } from '../types';
import { usePropertyContact } from '../context/PropertyContactContext';
import { X, Check } from 'lucide-react';

interface AddEditContactModalProps {
  contactToEdit?: PropertyContact | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AddEditContactModal: React.FC<AddEditContactModalProps> = ({
  contactToEdit,
  isOpen,
  onClose
}) => {
  const { addContact, updateContact } = usePropertyContact();

  const isEdit = Boolean(contactToEdit);

  // 1. Nama Kontak *
  const [name, setName] = useState('');
  // 2. Posisi *
  const [basePosition, setBasePosition] = useState('Hotel Receptionist');
  const [customPosition, setCustomPosition] = useState('');
  const [isCustomPosition, setIsCustomPosition] = useState(false);
  // 3. Email *
  const [email, setEmail] = useState('');
  // 4. Email sekunder (jika ada)
  const [secondaryEmail, setSecondaryEmail] = useState('');
  // 5. Nomor Telepon *
  const [phone, setPhone] = useState('');
  // 6. Fax (jika ada)
  const [fax, setFax] = useState('');
  // 7. Jam Operasional (hanya bisa pilih satu)
  const [operationalHours, setOperationalHours] = useState<OperationalHoursType>('24/7');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (contactToEdit) {
      setName(contactToEdit.name || '');
      const pos = contactToEdit.basePosition || 'Hotel Receptionist';
      const isPreset = (PRESET_POSITIONS as readonly string[]).includes(pos);
      if (isPreset) {
        setBasePosition(pos);
        setIsCustomPosition(false);
        setCustomPosition('');
      } else {
        setBasePosition('Other');
        setIsCustomPosition(true);
        setCustomPosition(pos);
      }
      setEmail(contactToEdit.email || '');
      setSecondaryEmail(contactToEdit.secondaryEmail || '');
      setPhone(contactToEdit.phone || '');
      setFax(contactToEdit.fax || '');
      setOperationalHours(contactToEdit.operationalHours || '24/7');
    } else {
      setName('');
      setBasePosition('Hotel Receptionist');
      setIsCustomPosition(false);
      setCustomPosition('');
      setEmail('');
      setSecondaryEmail('');
      setPhone('');
      setFax('');
      setOperationalHours('24/7');
    }
    setErrors({});
  }, [contactToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) {
      errs.name = 'Nama kontak wajib diisi.';
    }

    const effectivePosition = isCustomPosition ? customPosition.trim() : basePosition;
    if (!effectivePosition) {
      errs.basePosition = 'Posisi kontak wajib dipilih.';
    }

    if (!email.trim()) {
      errs.email = 'Email kontak wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Format email tidak valid.';
    }

    if (secondaryEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(secondaryEmail.trim())) {
      errs.secondaryEmail = 'Format email sekunder tidak valid.';
    }

    if (!phone.trim()) {
      errs.phone = 'Nomor telepon wajib diisi.';
    } else if (phone.trim().length < 8) {
      errs.phone = 'Nomor telepon minimal 8 digit.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalPosition = isCustomPosition ? customPosition.trim() : basePosition;

    if (isEdit && contactToEdit) {
      updateContact(contactToEdit.id, {
        name: name.trim(),
        basePosition: finalPosition,
        email: email.trim(),
        secondaryEmail: secondaryEmail.trim(),
        phone: phone.trim(),
        fax: fax.trim(),
        operationalHours
      });
    } else {
      addContact({
        name: name.trim(),
        basePosition: finalPosition,
        email: email.trim(),
        secondaryEmail: secondaryEmail.trim(),
        phone: phone.trim(),
        fax: fax.trim(),
        operationalHours
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <h3 className="text-base font-bold text-slate-900">
            {isEdit ? 'Ubah Data Kontak' : 'Tambah Kontak'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body matching user's images */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* 1. Nama Kontak * */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                Nama Kontak <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nama lengkap"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                  errors.name ? 'border-rose-400' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-600">{errors.name}</p>}
            </div>

            {/* 2. Posisi * */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                Posisi <span className="text-rose-500">*</span>
              </label>
              {!isCustomPosition ? (
                <div className="relative">
                  <select
                    value={basePosition}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomPosition(true);
                      } else {
                        setBasePosition(e.target.value);
                      }
                      if (errors.basePosition) setErrors(prev => ({ ...prev, basePosition: '' }));
                    }}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600/20 pr-10 ${
                      errors.basePosition ? 'border-rose-400' : 'border-slate-200 focus:border-blue-600'
                    }`}
                  >
                    {PRESET_POSITIONS.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                    <option value="__custom__">+ Tulis Posisi Lainnya...</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ketik nama posisi"
                      value={customPosition}
                      onChange={(e) => {
                        setCustomPosition(e.target.value);
                        if (errors.basePosition) setErrors(prev => ({ ...prev, basePosition: '' }));
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomPosition(false)}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors shrink-0"
                    >
                      Pilih List
                    </button>
                  </div>
                </div>
              )}
              {errors.basePosition && <p className="text-xs text-rose-600">{errors.basePosition}</p>}
            </div>

            {/* 3. Email * */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Contoh: receptionist@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                  errors.email ? 'border-rose-400' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.email && <p className="text-xs text-rose-600">{errors.email}</p>}
            </div>

            {/* 4. Email sekunder (jika ada) */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                Email sekunder (jika ada)
              </label>
              <input
                type="email"
                placeholder="Contoh: receptionist2@gmail.com"
                value={secondaryEmail}
                onChange={(e) => {
                  setSecondaryEmail(e.target.value);
                  if (errors.secondaryEmail) setErrors(prev => ({ ...prev, secondaryEmail: '' }));
                }}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                  errors.secondaryEmail ? 'border-rose-400' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.secondaryEmail && <p className="text-xs text-rose-600">{errors.secondaryEmail}</p>}
            </div>

            {/* 5. Nomor Telepon * */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                Nomor Telepon <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Contoh: 0812-3456-7890"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/20 ${
                  errors.phone ? 'border-rose-400' : 'border-slate-200 focus:border-blue-600'
                }`}
              />
              {errors.phone && <p className="text-xs text-rose-600">{errors.phone}</p>}
            </div>

            {/* 6. Fax (jika ada) */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                Fax (jika ada)
              </label>
              <input
                type="text"
                placeholder="Contoh: (021) 555-1234"
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* 7. Jam Operasional (hanya bisa piliha satu) matching image 2 */}
          <div className="pt-2 space-y-2.5">
            <label className="block text-sm font-semibold text-slate-800">
              Jam Operasional (hanya bisa piliha satu)
            </label>

            {/* Horizontal checkboxes (single choice) */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-1">
              {/* Option 1: Available 24/7 */}
              <label
                onClick={() => setOperationalHours('24/7')}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    operationalHours === '24/7'
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-400 bg-white group-hover:border-slate-600'
                  }`}
                >
                  {operationalHours === '24/7' && (
                    <Check className="w-3 h-3 stroke-[3]" />
                  )}
                </div>
                <span className="text-sm text-slate-800">Available 24/7</span>
              </label>

              {/* Option 2: Working Hours (9 AM-5 PM) */}
              <label
                onClick={() => setOperationalHours('working_hours')}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    operationalHours === 'working_hours'
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-400 bg-white group-hover:border-slate-600'
                  }`}
                >
                  {operationalHours === 'working_hours' && (
                    <Check className="w-3 h-3 stroke-[3]" />
                  )}
                </div>
                <span className="text-sm text-slate-800">Working Hours (9 AM-5 PM)</span>
              </label>

              {/* Option 3: Hide Operational Hours */}
              <label
                onClick={() => setOperationalHours('hidden')}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    operationalHours === 'hidden'
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-400 bg-white group-hover:border-slate-600'
                  }`}
                >
                  {operationalHours === 'hidden' && (
                    <Check className="w-3 h-3 stroke-[3]" />
                  )}
                </div>
                <span className="text-sm text-slate-800">Hide Operational Hours</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-xl shadow-xs transition-colors"
            >
              {isEdit ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
