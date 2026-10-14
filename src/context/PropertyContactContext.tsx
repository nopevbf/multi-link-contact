import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Property, PropertyContact, SectionAssignment, SectionDef, ToastMessage, ToastType } from '../types';
import { INITIAL_PROPERTIES, INITIAL_SECTIONS, INITIAL_CONTACTS, INITIAL_ASSIGNMENTS } from '../data/initialData';

interface PropertyContactContextType {
  // Navigation & Active State
  properties: Property[];
  sections: SectionDef[];
  activePropertyId: string;
  activeSectionId: string;
  activeProperty: Property;
  activeSection: SectionDef;
  setActivePropertyId: (id: string) => void;
  setActiveSectionId: (id: string) => void;

  // Filtered Data for Active Property
  activePropertyContacts: PropertyContact[];
  activeSectionLinkedContacts: Array<{
    assignment: SectionAssignment;
    contact: PropertyContact;
  }>;

  // Helpers
  getContactPositionsMap: (contactId: string) => Array<{ sectionTitle: string; position: string; sectionId: string }>;
  isContactLinkedToSection: (contactId: string, sectionId: string) => boolean;

  // Actions
  addContact: (data: {
    name: string;
    basePosition?: string;
    email: string;
    secondaryEmail?: string;
    phone: string;
    fax?: string;
    operationalHours?: import('../types').OperationalHoursType;
    notes?: string;
  }) => PropertyContact;
  updateContact: (
    id: string,
    data: {
      name: string;
      basePosition?: string;
      email: string;
      secondaryEmail?: string;
      phone: string;
      fax?: string;
      operationalHours?: import('../types').OperationalHoursType;
      notes?: string;
    }
  ) => void;
  deleteContact: (id: string) => { deletedName: string; unlinkedSectionCount: number };
  linkContactToSection: (contactId: string, sectionId: string, position: string) => void;
  unlinkContactFromSection: (assignmentId: string) => void;
  updateSectionPosition: (assignmentId: string, newPosition: string) => void;
  resetToDefaultData: () => void;

  // Toast System
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType, title?: string) => void;
  dismissToast: (id: string) => void;
}

const STORAGE_KEYS = {
  ACTIVE_PROP: 'noorbyte_mitra_active_property_v1',
  ACTIVE_SECTION: 'noorbyte_mitra_active_section_v1',
  CONTACTS: 'noorbyte_mitra_contacts_v3',
  ASSIGNMENTS: 'noorbyte_mitra_assignments_v1'
};

const PropertyContactContext = createContext<PropertyContactContextType | undefined>(undefined);

export const PropertyContactProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [sections] = useState<SectionDef[]>(INITIAL_SECTIONS);

  // Active Property
  const [activePropertyId, setActivePropertyIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROP);
      return saved && INITIAL_PROPERTIES.some(p => p.id === saved) ? saved : INITIAL_PROPERTIES[0].id;
    } catch {
      return INITIAL_PROPERTIES[0].id;
    }
  });

  // Active Section
  const [activeSectionId, setActiveSectionIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_SECTION);
      return saved && INITIAL_SECTIONS.some(s => s.id === saved) ? saved : INITIAL_SECTIONS[0].id;
    } catch {
      return INITIAL_SECTIONS[0].id;
    }
  });

  // All Contacts (loads v3 with full schema)
  const [contacts, setContacts] = useState<PropertyContact[]>(() => {
    try {
      const savedV3 = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (savedV3) {
        return JSON.parse(savedV3);
      }
      return INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });

  // All Section Assignments (Linking)
  const [assignments, setAssignments] = useState<SectionAssignment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PROP, activePropertyId);
    } catch { /* ignore */ }
  }, [activePropertyId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SECTION, activeSectionId);
    } catch { /* ignore */ }
  }, [activeSectionId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    } catch { /* ignore */ }
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    } catch { /* ignore */ }
  }, [assignments]);

  const showToast = (message: string, type: ToastType = 'success', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setActivePropertyId = (id: string) => {
    setActivePropertyIdState(id);
    const prop = properties.find(p => p.id === id);
    if (prop) {
      showToast(`Beralih ke properti ${prop.name} (${prop.code})`, 'info');
    }
  };

  const setActiveSectionId = (id: string) => {
    setActiveSectionIdState(id);
  };

  const activeProperty = useMemo(() => {
    return properties.find(p => p.id === activePropertyId) || properties[0];
  }, [properties, activePropertyId]);

  const activeSection = useMemo(() => {
    return sections.find(s => s.id === activeSectionId) || sections[0];
  }, [sections, activeSectionId]);

  // Contacts specific to active property
  const activePropertyContacts = useMemo(() => {
    return contacts.filter(c => c.propertyId === activePropertyId);
  }, [contacts, activePropertyId]);

  // Linked contacts in active section and property
  const activeSectionLinkedContacts = useMemo(() => {
    const sectionAsgs = assignments.filter(
      a => a.propertyId === activePropertyId && a.sectionId === activeSectionId
    );

    const result: Array<{ assignment: SectionAssignment; contact: PropertyContact }> = [];
    for (const asg of sectionAsgs) {
      const contact = contacts.find(c => c.id === asg.contactId);
      if (contact) {
        result.push({ assignment: asg, contact });
      }
    }
    return result;
  }, [assignments, contacts, activePropertyId, activeSectionId]);

  // Helper to get all positions assigned to a contact across sections in current property
  const getContactPositionsMap = (contactId: string) => {
    const contactAsgs = assignments.filter(
      a => a.contactId === contactId && a.propertyId === activePropertyId
    );
    return contactAsgs.map(a => {
      const s = sections.find(sec => sec.id === a.sectionId);
      return {
        sectionId: a.sectionId,
        sectionTitle: s ? s.title : a.sectionId,
        position: a.position
      };
    });
  };

  const isContactLinkedToSection = (contactId: string, sectionId: string) => {
    return assignments.some(
      a => a.propertyId === activePropertyId && a.sectionId === sectionId && a.contactId === contactId
    );
  };

  // Add Contact to Kontak Tersedia
  const addContact = (data: {
    name: string;
    basePosition?: string;
    email: string;
    secondaryEmail?: string;
    phone: string;
    fax?: string;
    operationalHours?: import('../types').OperationalHoursType;
    notes?: string;
  }) => {
    const newContact: PropertyContact = {
      id: `cnt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      propertyId: activePropertyId,
      name: data.name.trim(),
      basePosition: data.basePosition?.trim() || '',
      email: data.email.trim(),
      secondaryEmail: data.secondaryEmail?.trim() || '',
      phone: data.phone.trim(),
      fax: data.fax?.trim() || '',
      operationalHours: data.operationalHours || '24/7',
      notes: data.notes?.trim() || '',
      createdAt: new Date().toISOString()
    };

    setContacts(prev => [newContact, ...prev]);
    showToast(`Kontak "${newContact.name}" berhasil ditambahkan ke Kontak Tersedia`, 'success');
    return newContact;
  };

  // Edit Contact in Kontak Tersedia
  const updateContact = (
    id: string,
    data: {
      name: string;
      basePosition?: string;
      email: string;
      secondaryEmail?: string;
      phone: string;
      fax?: string;
      operationalHours?: import('../types').OperationalHoursType;
      notes?: string;
    }
  ) => {
    setContacts(prev =>
      prev.map(c => (c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c))
    );
    showToast(`Data kontak "${data.name}" berhasil diperbarui`, 'success');
  };

  // Delete Contact from Kontak Tersedia
  // CRITICAL REQUIREMENT: "Jika user menghapus kontak dari Kontak Tersedia, sistem harus memastikan relasi kontak pada seksi-seksi terkait ikut ditangani agar tidak meninggalkan data relasi yang tidak valid."
  const deleteContact = (id: string) => {
    const contactToDelete = contacts.find(c => c.id === id);
    const contactName = contactToDelete ? contactToDelete.name : 'Kontak';

    // Count how many section assignments will be removed
    const relatedAssignments = assignments.filter(a => a.contactId === id);
    const count = relatedAssignments.length;

    // Remove contact
    setContacts(prev => prev.filter(c => c.id !== id));
    // Cascade remove all assignments
    setAssignments(prev => prev.filter(a => a.contactId !== id));

    if (count > 0) {
      showToast(
        `Kontak "${contactName}" dan ${count} relasi seksi terkait berhasil dihapus bersih`,
        'warning',
        'Kontak Dihapus'
      );
    } else {
      showToast(`Kontak "${contactName}" berhasil dihapus dari Kontak Tersedia`, 'info');
    }

    return { deletedName: contactName, unlinkedSectionCount: count };
  };

  // Link Contact to Section
  // CRITICAL REQUIREMENT: "Saat user klik Link Kontak Ini, sistem meminta user menentukan posisi kontak untuk seksi yang sedang aktif. Satu kontak dapat memiliki posisi yang berbeda pada setiap seksi."
  const linkContactToSection = (contactId: string, sectionId: string, position: string) => {
    const contact = contacts.find(c => c.id === contactId);
    const targetSection = sections.find(s => s.id === sectionId);

    // Check if already linked to this section
    const existingIndex = assignments.findIndex(
      a => a.propertyId === activePropertyId && a.sectionId === sectionId && a.contactId === contactId
    );

    if (existingIndex >= 0) {
      // Update position for this section
      setAssignments(prev =>
        prev.map((a, idx) => (idx === existingIndex ? { ...a, position, linkedAt: new Date().toISOString() } : a))
      );
      showToast(
        `Posisi "${contact?.name}" di seksi ${targetSection?.title} diperbarui menjadi "${position}"`,
        'success'
      );
    } else {
      // Add new assignment
      const newAssignment: SectionAssignment = {
        id: `asg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        propertyId: activePropertyId,
        sectionId,
        contactId,
        position: position.trim() || 'Staff',
        linkedAt: new Date().toISOString()
      };
      setAssignments(prev => [...prev, newAssignment]);
      showToast(
        `"${contact?.name}" berhasil ditautkan ke ${targetSection?.title} dengan posisi "${position}"`,
        'success'
      );
    }
  };

  // Unlink Contact from Section
  // CRITICAL REQUIREMENT: "Jika kontak dihapus dari salah satu seksi, kontak tersebut hanya di-unlink dari seksi tersebut dan tetap tersedia pada Kontak Tersedia, kecuali user memilih menghapus data kontak secara keseluruhan."
  const unlinkContactFromSection = (assignmentId: string) => {
    const asg = assignments.find(a => a.id === assignmentId);
    const contact = asg ? contacts.find(c => c.id === asg.contactId) : null;
    const targetSection = asg ? sections.find(s => s.id === asg.sectionId) : null;

    setAssignments(prev => prev.filter(a => a.id !== assignmentId));

    showToast(
      `"${contact?.name || 'Kontak'}" telah dilepas (unlinked) dari seksi ${targetSection?.title || 'terkait'}. Kontak tetap ada di Kontak Tersedia.`,
      'info',
      'Kontak Dilepas dari Seksi'
    );
  };

  // Update Section Position specifically
  // CRITICAL REQUIREMENT: "Posisi yang dipilih pada satu seksi tidak boleh otomatis mengubah posisi kontak tersebut pada seksi lain."
  const updateSectionPosition = (assignmentId: string, newPosition: string) => {
    const asg = assignments.find(a => a.id === assignmentId);
    const contact = asg ? contacts.find(c => c.id === asg.contactId) : null;
    const targetSection = asg ? sections.find(s => s.id === asg.sectionId) : null;

    setAssignments(prev =>
      prev.map(a => (a.id === assignmentId ? { ...a, position: newPosition.trim() } : a))
    );

    showToast(
      `Posisi "${contact?.name}" di ${targetSection?.title} telah diubah menjadi "${newPosition}"`,
      'success'
    );
  };

  // Reset demo data
  const resetToDefaultData = () => {
    setContacts(INITIAL_CONTACTS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setActivePropertyIdState(INITIAL_PROPERTIES[0].id);
    setActiveSectionIdState(INITIAL_SECTIONS[0].id);
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_PROP);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SECTION);
      localStorage.removeItem(STORAGE_KEYS.CONTACTS);
      localStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS);
    } catch { /* ignore */ }
    showToast('Data demo berhasil di-reset ke setelan awal pabrikan', 'info');
  };

  const value = {
    properties,
    sections,
    activePropertyId,
    activeSectionId,
    activeProperty,
    activeSection,
    setActivePropertyId,
    setActiveSectionId,
    activePropertyContacts,
    activeSectionLinkedContacts,
    getContactPositionsMap,
    isContactLinkedToSection,
    addContact,
    updateContact,
    deleteContact,
    linkContactToSection,
    unlinkContactFromSection,
    updateSectionPosition,
    resetToDefaultData,
    toasts,
    showToast,
    dismissToast
  };

  return (
    <PropertyContactContext.Provider value={value}>
      {children}
    </PropertyContactContext.Provider>
  );
};

export const usePropertyContact = (): PropertyContactContextType => {
  const context = useContext(PropertyContactContext);
  if (!context) {
    throw new Error('usePropertyContact must be used within a PropertyContactProvider');
  }
  return context;
};
