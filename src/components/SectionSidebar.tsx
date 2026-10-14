import React from 'react';
import { usePropertyContact } from '../context/PropertyContactContext';

export const SectionSidebar: React.FC = () => {
  const {
    sections,
    activeSectionId,
    setActiveSectionId,
    activePropertyContacts,
    activeProperty
  } = usePropertyContact();

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs">
        <div className="px-3 pt-2 pb-3 border-b border-slate-100 mb-2">
          <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">
            Daftar Seksi Properti
          </p>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Pilih seksi untuk mengelola kontak PIC
          </p>
        </div>

        <nav className="space-y-2">
          {sections.map((section) => {
            const isActive = section.id === activeSectionId;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-between gap-2 ${
                  isActive
                    ? 'bg-[#25325b] text-white shadow-xs font-bold'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <span className="truncate">{section.title}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Informative footer widget */}
        <div className="mt-4 pt-3 border-t border-slate-100 px-3 text-xs text-slate-500">
          <p className="leading-relaxed">
            Kontak yang di-link ke suatu seksi memiliki posisi yang <strong>independen</strong> dan tidak mengubah posisinya di seksi lain.
          </p>
        </div>
      </div>
    </aside>
  );
};
