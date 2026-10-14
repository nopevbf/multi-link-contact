import React, { useState } from 'react';
import { usePropertyContact } from '../context/PropertyContactContext';
import { CheckCircle2, ChevronDown, ChevronUp, Sparkles, Building2, UserPlus, Link2, ShieldCheck } from 'lucide-react';

export const FeatureVerificationGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setActivePropertyId, setActiveSectionId, linkContactToSection, activePropertyContacts } = usePropertyContact();

  const handleSimulateScenario = () => {
    // 1. Switch to NOORBYTE
    setActivePropertyId('prop-noorbyte');
    // 2. Set active section to Customer & Hotel Support
    setActiveSectionId('customer-support');

    const eggel = activePropertyContacts.find(c => c.name.toLowerCase().includes('eggel'));
    if (eggel) {
      // Link Eggel as Finance Manager on Customer & Hotel Support
      linkContactToSection(eggel.id, 'customer-support', 'Finance Manager');
      // Link Eggel as Hotel Operational on Reservation
      linkContactToSection(eggel.id, 'reservation', 'Hotel Operational');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Panduan Pengujian Fitur & Verifikasi Kebutuhan
            </h3>
            <p className="text-xs text-slate-500">
              Klik untuk melihat skenario pengujian posisi independen per seksi dan isolasi properti
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
          <span>{isOpen ? 'Sembunyikan' : 'Buka Panduan'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4 text-xs text-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Box 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>1. Multi-Posisi Independen</span>
              </div>
              <p className="leading-relaxed">
                Uji kontak yang sama (misal <strong>Eggel</strong>) di seksi <strong>Customer & Hotel Support</strong> dengan posisi <em>Finance Manager</em>, lalu buka seksi <strong>Reservation</strong> dengan posisi <em>Hotel Operational</em>. Posisi tidak saling menimpa.
              </p>
              <button
                type="button"
                onClick={handleSimulateScenario}
                className="mt-1 px-3 py-1.5 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Simulasikan Contoh Brief</span>
              </button>
            </div>

            {/* Box 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>2. Isolasi Antar Properti</span>
              </div>
              <p className="leading-relaxed">
                Gunakan menu dropdown pemilih properti di pojok kanan atas untuk beralih antara <strong>NOORBYTE</strong>, <strong>GRAND ASTON RESORT</strong>, atau <strong>THE HERITAGE HOTEL</strong>. Kontak masing-masing properti terisolasi rapi.
              </p>
            </div>

            {/* Box 3 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <UserPlus className="w-4 h-4 text-amber-600" />
                <span>3. Tambah Kontak & 7 Field</span>
              </div>
              <p className="leading-relaxed">
                Formulir kontak mencakup 7 field lengkap (Nama, Posisi, Email, Email Sekunder, Telepon, Fax, dan Jam Operasional). Posisi dapat disesuaikan per seksi secara independen.
              </p>
            </div>

            {/* Box 4 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 md:col-span-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>4. Simulasi Verifikasi Email & Validasi Penautan Seksi</span>
              </div>
              <p className="leading-relaxed">
                Uji menambah kontak baru tanpa menekan tombol "Verifikasi Email". Saat klik <strong>Link Kontak Ini</strong>, sistem akan memblokir dan menampilkan peringatan validasi. Setelah diverifikasi (dengan countdown 120 detik berganti "Kirim Ulang"), kontak dapat di-link dan label email pada detail kontak akan berhias ikon ceklis hijau <em>circle</em>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
