import React, { useState } from 'react';
import { usePropertyContact } from '../context/PropertyContactContext';
import { ArrowLeft, Building2, ChevronDown, RotateCcw, Check, Sparkles } from 'lucide-react';

export const TopNav: React.FC = () => {
  const {
    properties,
    activeProperty,
    setActivePropertyId,
    resetToDefaultData
  } = usePropertyContact();

  const [isPropertyMenuOpen, setIsPropertyMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200/90 shadow-2xs sticky top-0 z-30">
      {/* Breadcrumb & Global Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="hover:text-slate-800 transition-colors cursor-pointer">Dashboard Mitra</span>
          <span className="text-slate-400">/</span>
          <span className="hover:text-slate-800 transition-colors cursor-pointer">Properti Terdaftar</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-semibold">Kontak</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Property Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPropertyMenuOpen(!isPropertyMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-medium transition-colors"
              title="Ganti Properti untuk melihat isolasi data kontak"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span className="font-semibold text-slate-900">{activeProperty.name}</span>
              <span className="font-mono text-xs text-slate-500">({activeProperty.code})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {isPropertyMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsPropertyMenuOpen(false)}
                />
                <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-1.5 divide-y divide-slate-100">
                  <div className="px-3 py-2 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Pilih Properti Aktif
                  </div>
                  <div className="py-1 space-y-0.5">
                    {properties.map((prop) => {
                      const isCurrent = prop.id === activeProperty.id;
                      return (
                        <button
                          key={prop.id}
                          onClick={() => {
                            setActivePropertyId(prop.id);
                            setIsPropertyMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-start justify-between gap-2 transition-colors ${
                            isCurrent
                              ? 'bg-blue-50/80 text-blue-900 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{prop.name}</p>
                            <p className="text-slate-500 font-mono text-2xs">{prop.code} · {prop.city}</p>
                          </div>
                          {isCurrent && <Check className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={resetToDefaultData}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Reset data ke simulasi awal"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Title & Action Bar matching screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Kontak {activeProperty.name}
          </h1>
          <p className="text-sm font-semibold font-mono tracking-wider text-slate-500 mt-1">
            {activeProperty.code}
          </p>
        </div>

        <button
          onClick={() => {
            alert('Kembali ke menu Properti Terdaftar.');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 rounded-xl shadow-2xs transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Kembali</span>
        </button>
      </div>
    </header>
  );
};
