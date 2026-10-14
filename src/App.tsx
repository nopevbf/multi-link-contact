import React, { useState } from 'react';
import { PropertyContactProvider, usePropertyContact } from './context/PropertyContactContext';
import { PropertyContact, SectionAssignment } from './types';
import { TopNav } from './components/TopNav';
import { SectionSidebar } from './components/SectionSidebar';
import { SectionContactsTable } from './components/SectionContactsTable';
import { AvailableContactsTable } from './components/AvailableContactsTable';
import { LinkContactModal } from './components/LinkContactModal';
import { AddEditContactModal } from './components/AddEditContactModal';
import { EditSectionPositionModal } from './components/EditSectionPositionModal';
import { ConfirmDeleteModal, DeleteModalMode } from './components/ConfirmDeleteModal';
import { ViewContactDetailModal } from './components/ViewContactDetailModal';
import { FeatureVerificationGuide } from './components/FeatureVerificationGuide';
import { ToastContainer } from './components/Toast';

const DashboardMitraContent: React.FC = () => {
  const { activeSection, showToast } = usePropertyContact();

  // Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<PropertyContact | null>(null);

  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [contactToLink, setContactToLink] = useState<PropertyContact | null>(null);

  const [isEditPositionOpen, setIsEditPositionOpen] = useState(false);
  const [assignmentToEdit, setAssignmentToEdit] = useState<SectionAssignment | null>(null);
  const [contactForPositionEdit, setContactForPositionEdit] = useState<PropertyContact | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteModalData, setDeleteModalData] = useState<DeleteModalMode | null>(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [contactToView, setContactToView] = useState<PropertyContact | null>(null);

  // Handlers for Add/Edit Contact (Kontak Tersedia)
  const handleAddNewContact = () => {
    setContactToEdit(null);
    setIsAddEditOpen(true);
  };

  const handleEditContact = (contact: PropertyContact) => {
    setContactToEdit(contact);
    setIsAddEditOpen(true);
  };

  // Handler for Link Contact to Active Section (Validasi verifikasi email)
  const handleOpenLinkModal = (contact: PropertyContact) => {
    if (!contact.isEmailVerified) {
      showToast(
        `Kontak "${contact.name}" tidak dapat ditautkan karena email belum diverifikasi. Harap verifikasi email terlebih dahulu melalui Edit Kontak.`,
        'warning',
        'Email Belum Terverifikasi'
      );
      return;
    }
    setContactToLink(contact);
    setIsLinkOpen(true);
  };

  // Handler for Editing Position on a Section
  const handleOpenEditPositionModal = (assignment: SectionAssignment, contact: PropertyContact) => {
    setAssignmentToEdit(assignment);
    setContactForPositionEdit(contact);
    setIsEditPositionOpen(true);
  };

  // Handler for Unlinking from Section
  const handleOpenUnlinkModal = (assignment: SectionAssignment, contact: PropertyContact) => {
    setDeleteModalData({
      type: 'unlink-section',
      assignment,
      contact,
      section: activeSection
    });
    setIsDeleteOpen(true);
  };

  // Handler for Deleting Contact from Kontak Tersedia (Cascade)
  const handleOpenDeleteContactModal = (contact: PropertyContact) => {
    setDeleteModalData({
      type: 'delete-contact',
      contact
    });
    setIsDeleteOpen(true);
  };

  // Handler for Viewing Contact Details
  const handleOpenViewModal = (contact: PropertyContact) => {
    setContactToView(contact);
    setIsViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <TopNav />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column: Sections Navigation */}
          <SectionSidebar />

          {/* Right Column: Active Section Contacts & Available Contacts */}
          <div className="flex-1 w-full space-y-6">
            {/* Top Table: Kontak pada Seksi Terpilih */}
            <SectionContactsTable
              onEditPosition={handleOpenEditPositionModal}
              onUnlink={handleOpenUnlinkModal}
            />

            {/* Bottom Table: Kontak Tersedia pada Properti */}
            <AvailableContactsTable
              onAddNewContact={handleAddNewContact}
              onEditContact={handleEditContact}
              onDeleteContact={handleOpenDeleteContactModal}
              onViewContact={handleOpenViewModal}
              onLinkContact={handleOpenLinkModal}
            />

            {/* Verification & Demonstration Assistant */}
            <FeatureVerificationGuide />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Dashboard Mitra Properti · Modul Kontak & Pengelolaan Posisi Multi-Seksi</p>
        </div>
      </footer>

      {/* Modals */}
      <AddEditContactModal
        isOpen={isAddEditOpen}
        contactToEdit={contactToEdit}
        onClose={() => {
          setIsAddEditOpen(false);
          setContactToEdit(null);
        }}
      />

      <LinkContactModal
        isOpen={isLinkOpen}
        contact={contactToLink}
        section={activeSection}
        onClose={() => {
          setIsLinkOpen(false);
          setContactToLink(null);
        }}
      />

      <EditSectionPositionModal
        isOpen={isEditPositionOpen}
        assignment={assignmentToEdit}
        contact={contactForPositionEdit}
        section={activeSection}
        onClose={() => {
          setIsEditPositionOpen(false);
          setAssignmentToEdit(null);
          setContactForPositionEdit(null);
        }}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        modalData={deleteModalData}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteModalData(null);
        }}
      />

      <ViewContactDetailModal
        isOpen={isViewOpen}
        contact={contactToView}
        onClose={() => {
          setIsViewOpen(false);
          setContactToView(null);
        }}
        onEdit={(contact) => {
          handleEditContact(contact);
        }}
        onLinkToActiveSection={(contact) => {
          handleOpenLinkModal(contact);
        }}
        onDelete={(contact) => {
          handleOpenDeleteContactModal(contact);
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <PropertyContactProvider>
      <DashboardMitraContent />
    </PropertyContactProvider>
  );
}
