import React from 'react';
import { SectionAssignment, PropertyContact } from '../types';
import { usePropertyContact } from '../context/PropertyContactContext';
import { Edit3, Unlink, Phone, Mail, UserCheck } from 'lucide-react';

interface SectionContactsTableProps {
  onEditPosition: (assignment: SectionAssignment, contact: PropertyContact) => void;
  onUnlink: (assignment: SectionAssignment, contact: PropertyContact) => void;
}

export const SectionContactsTable: React.FC<SectionContactsTableProps> = ({
  onEditPosition,
  onUnlink
}) => {
  const { activeSection, activeSectionLinkedContacts, activeProperty } = usePropertyContact();

  const isEmpty = activeSectionLinkedContacts.length === 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Card Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Kontak {activeSection.title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar penanggung jawab operasional aktif untuk seksi ini di properti {activeProperty.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold font-mono">
            {activeSectionLinkedContacts.length} Kontak Terhubung
          </span>
        </div>
      </div>

      {/* Table container */}
      <div className="p-4 sm:p-6">
        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th scope="col" className="py-3 px-4 w-12 text-center">NO</th>
                <th scope="col" className="py-3 px-4 min-w-[140px]">NAMA</th>
                <th scope="col" className="py-3 px-4 min-w-[160px]">POSISI</th>
                <th scope="col" className="py-3 px-4 min-w-[180px]">EMAIL</th>
                <th scope="col" className="py-3 px-4 min-w-[140px]">NOMOR TELEPON</th>
                <th scope="col" className="py-3 px-4 text-center min-w-[130px]">AKSI</th>
              </tr>
            </thead>

            {isEmpty ? (
              <tbody>
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <p className="text-sm text-slate-500 font-medium">
                      Kontak {activeSection.title} kosong, tambahkan melalui tabel dibawah
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Gunakan tombol <strong>Link Kontak Ini</strong> pada daftar Kontak Tersedia di bawah untuk menugaskan PIC.
                    </p>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {activeSectionLinkedContacts.map((item, index) => (
                  <tr key={item.assignment.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* NO */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                      {index + 1}
                    </td>

                    {/* NAMA */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {item.contact.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate">{item.contact.name}</span>
                      </div>
                    </td>

                    {/* POSISI (Spesifik untuk seksi ini!) */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200/70 font-semibold text-xs">
                        {item.assignment.position}
                      </span>
                    </td>

                    {/* EMAIL */}
                    <td className="py-3.5 px-4 text-slate-600 font-normal">
                      <a
                        href={`mailto:${item.contact.email}`}
                        className="hover:text-blue-700 hover:underline flex items-center gap-1.5 truncate max-w-[220px]"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.contact.email}</span>
                      </a>
                    </td>

                    {/* NOMOR TELEPON */}
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      <a
                        href={`tel:${item.contact.phone}`}
                        className="hover:text-blue-700 flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.contact.phone}</span>
                      </a>
                    </td>

                    {/* AKSI */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 justify-center">
                        <button
                          type="button"
                          onClick={() => onEditPosition(item.assignment, item.contact)}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/60 transition-colors inline-flex items-center gap-1"
                          title="Ubah posisi khusus untuk seksi ini"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Ubah Posisi</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onUnlink(item.assignment, item.contact)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Lepas dari seksi ini (kontak tetap tersimpan di Kontak Tersedia)"
                        >
                          <Unlink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
