import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { PropertyContact } from '../types';
import { usePropertyContact } from '../context/PropertyContactContext';
import {
  UserPlus,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Mail,
  Users,
  Loader2
} from 'lucide-react';

interface AvailableContactsTableProps {
  onAddNewContact: () => void;
  onEditContact: (contact: PropertyContact) => void;
  onDeleteContact: (contact: PropertyContact) => void;
  onViewContact: (contact: PropertyContact) => void;
  onLinkContact: (contact: PropertyContact) => void;
}

export const AvailableContactsTable: React.FC<AvailableContactsTableProps> = ({
  onAddNewContact,
  onEditContact,
  onDeleteContact,
  onViewContact,
  onLinkContact
}) => {
  const {
    activePropertyContacts,
    activeProperty,
    activeSection,
    getContactPositionsMap,
    isContactLinkedToSection
  } = usePropertyContact();

  const [searchTerm, setSearchTerm] = useState('');
  // Hanya menampilkan 5 kontak pertama, lalu lazy loading saat di-scroll
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null);

  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return activePropertyContacts;
    const term = searchTerm.toLowerCase();
    return activePropertyContacts.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.toLowerCase().includes(term)
    );
  }, [activePropertyContacts, searchTerm]);

  // Reset pagination ke 5 ketika search term atau properti berganti
  useEffect(() => {
    setVisibleCount(5);
    setIsLoadingMore(false);
  }, [searchTerm, activeProperty.id]);

  const hasMore = visibleCount < filteredContacts.length;
  const displayedContacts = useMemo(() => {
    return filteredContacts.slice(0, visibleCount);
  }, [filteredContacts, visibleCount]);

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 5, filteredContacts.length));
      setIsLoadingMore(false);
    }, 400);
  }, [isLoadingMore, hasMore, filteredContacts.length]);

  // Handle onScroll event pada container tabel
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50 && hasMore && !isLoadingMore) {
      handleLoadMore();
    }
  };

  // IntersectionObserver untuk lazy loading yang responsif dan mulus
  useEffect(() => {
    const currentTarget = observerTargetRef.current;
    if (!currentTarget || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          handleLoadMore();
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
        rootMargin: '20px'
      }
    );

    observer.observe(currentTarget);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, handleLoadMore]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Header bar matching screenshot */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Kontak Tersedia
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-semibold">
              {activePropertyContacts.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar seluruh kontak yang terdaftar pada properti {activeProperty.name}. Kontak baru belum memiliki posisi sampai di-link ke seksi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari kontak..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 w-44 sm:w-56"
            />
          </div>

          {/* "+ Tambah Kontak" Button */}
          <button
            type="button"
            onClick={onAddNewContact}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl shadow-2xs transition-colors shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-900" />
            <span>+ Tambah Kontak</span>
          </button>
        </div>
      </div>

      {/* Table content with scrollable lazy loading */}
      <div className="p-4 sm:p-6 space-y-3">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="max-h-[380px] overflow-y-auto overflow-x-auto rounded-xl border border-slate-200/80 shadow-2xs relative"
        >
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-100 border-b border-slate-200 shadow-2xs">
              <tr className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                <th scope="col" className="py-3 px-4 w-12 text-center bg-slate-100">NO</th>
                <th scope="col" className="py-3 px-4 min-w-[150px] bg-slate-100">NAMA</th>
                <th scope="col" className="py-3 px-4 min-w-[180px] bg-slate-100">POSISI</th>
                <th scope="col" className="py-3 px-4 min-w-[200px] bg-slate-100">EMAIL</th>
                <th scope="col" className="py-3 px-4 text-center min-w-[220px] bg-slate-100">AKSI</th>
              </tr>
            </thead>

            {filteredContacts.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={5} className="py-12 px-4 text-center">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 font-medium">
                      {searchTerm ? 'Tidak ada kontak yang cocok dengan pencarian.' : 'Belum ada kontak terdaftar pada properti ini.'}
                    </p>
                    <button
                      type="button"
                      onClick={onAddNewContact}
                      className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Kontak Baru</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {displayedContacts.map((contact, index) => {
                  const positions = getContactPositionsMap(contact.id);
                  const isLinkedToActive = isContactLinkedToSection(contact.id, activeSection.id);

                  return (
                    <tr key={contact.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* NO */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                        {index + 1}
                      </td>

                      {/* NAMA */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="block truncate">{contact.name}</span>
                            <span className="block text-2xs text-slate-400 font-mono sm:hidden">{contact.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* POSISI */}
                      <td className="py-3.5 px-4">
                        {positions.length === 0 ? (
                          contact.basePosition ? (
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200/70"
                              title="Posisi dasar profil kontak (belum di-link ke seksi)"
                            >
                              {contact.basePosition}
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-slate-400 bg-slate-100"
                              title="Kontak ini belum ditautkan ke seksi manapun"
                            >
                              -
                            </span>
                          )
                        ) : (
                          <div className="flex flex-col gap-1 items-start max-w-[220px]">
                            {positions.map((pos) => (
                              <span
                                key={pos.sectionId}
                                className={`text-2xs px-2 py-0.5 rounded-md font-semibold truncate max-w-full ${
                                  pos.sectionId === activeSection.id
                                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                                title={`${pos.position} pada seksi ${pos.sectionTitle}`}
                              >
                                {pos.position}
                                <span className="opacity-75 font-normal ml-1">({pos.sectionTitle})</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* EMAIL */}
                      <td className="py-3.5 px-4 text-slate-600 font-normal">
                        <a
                          href={`mailto:${contact.email}`}
                          className="hover:text-blue-700 hover:underline flex items-center gap-1.5 truncate max-w-[200px]"
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{contact.email}</span>
                        </a>
                      </td>

                      {/* AKSI */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 justify-center">
                          {/* "Link Kontak Ini" Button */}
                          <button
                            type="button"
                            onClick={() => onLinkContact(contact)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                              isLinkedToActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                            title={
                              isLinkedToActive
                                ? `Kontak sudah terhubung ke ${activeSection.title}. Klik untuk ubah posisi.`
                                : `Tautkan kontak ke ${activeSection.title}`
                            }
                          >
                            {isLinkedToActive ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Terhubung</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 text-slate-600" />
                                <span>Link Kontak Ini</span>
                              </>
                            )}
                          </button>

                          {/* Detail (Eye icon matching screenshot) */}
                          <button
                            type="button"
                            onClick={() => onViewContact(contact)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200/90 transition-colors"
                            title="Lihat Detail Kontak"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Contact Button */}
                          <button
                            type="button"
                            onClick={() => onEditContact(contact)}
                            className="p-1.5 text-slate-500 hover:text-blue-800 hover:bg-blue-50 rounded-lg border border-slate-200/90 transition-colors"
                            title="Edit Data Kontak (Nama, Email, Telepon)"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Contact Button */}
                          <button
                            type="button"
                            onClick={() => onDeleteContact(contact)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200/90 transition-colors"
                            title="Hapus Kontak (akan menghapus relasi di seluruh seksi)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Loading state indicator saat lazy loading */}
                {isLoadingMore && (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center bg-slate-50/80">
                      <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-900">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
                        <span>Memuat 5 kontak berikutnya...</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>

          {/* Sentinel observer element for scroll detection */}
          {hasMore && !isLoadingMore && (
            <div ref={observerTargetRef} className="h-4 w-full pointer-events-none" />
          )}
        </div>

        {/* Footer info: lazy loading status & indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>
              Menampilkan <strong className="font-mono text-slate-700">{displayedContacts.length}</strong> dari{' '}
              <strong className="font-mono text-slate-700">{filteredContacts.length}</strong> kontak
            </span>
            {hasMore ? (
              <span className="text-blue-700 font-medium hidden sm:inline">
                · Scroll tabel ke bawah untuk memuat lebih banyak
              </span>
            ) : (
              <span className="text-emerald-700 font-medium hidden sm:inline">
                · Semua kontak telah dimuat
              </span>
            )}
          </div>

          {hasMore && (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-900 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memuat...</span>
                </>
              ) : (
                <span>Muat Lebih Banyak ({filteredContacts.length - displayedContacts.length} tersisa)</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
