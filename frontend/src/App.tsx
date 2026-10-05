// =================================================================
// CarePoint Health Management System — Main Application Root
// Completely Redesigned Visual Identity · Warm Palette · Zero Glassmorphism
// BTS DNA Visual Engine Integration · Dynamic View-Aware Helix Shift
// =================================================================

import React, { useState, useEffect } from 'react';
import { NavigationView, Doctor, Department, VitalLogEntry } from './types';
import { getStoredData, saveStoredData, StorageData } from './services/storage';
import { api } from './services/api';
import { GlobalDna3DCanvas } from './components/common/GlobalDna3DCanvas';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Page Views & Sections
import { HeroSection } from './components/hero/HeroSection';
import { TreatmentCategories } from './components/treatments/TreatmentCategories';
import { DoctorDiscovery } from './components/doctors/DoctorDiscovery';
import { AppointmentsView } from './components/appointments/AppointmentsView';
import { AppointmentBookingModal } from './components/appointments/AppointmentBookingModal';
import { PatientHealthProfile } from './components/patient/PatientHealthProfile';
import { HealthAssessment } from './components/assessment/HealthAssessment';
import { PatientHealthTracker } from './components/tracker/PatientHealthTracker';
import { PharmacyCatalog } from './components/pharmacy/PharmacyCatalog';
import { StaffPortal } from './components/staff/StaffPortal';
import { StaffAuthModal } from './components/staff/StaffAuthModal';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<NavigationView>('home');
  const [data, setData] = useState<StorageData>(() => getStoredData());
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isStaffAuthOpen, setIsStaffAuthOpen] = useState(false);
  const [preselectedDoctor, setPreselectedDoctor] = useState<Doctor | null>(null);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [appointmentsBoxSide, setAppointmentsBoxSide] = useState<'left' | 'right'>('left');

  // Load & sync backend data
  const refreshData = async () => {
    try {
      const isOnline = await api.checkHealth();
      if (isOnline) {
        // Fetch entities from backend if online
        const [patients, doctors, departments, appointments, medicines] = await Promise.all([
          api.getEntities('patient'),
          api.getEntities('doctor'),
          api.getEntities('department'),
          api.getEntities('appointment'),
          api.getEntities('medicine')
        ]);
        const current = getStoredData();
        if (patients?.length) current.patient = patients;
        if (doctors?.length) current.doctor = doctors;
        if (departments?.length) current.department = departments;
        if (appointments?.length) current.appointment = appointments;
        if (medicines?.length) current.medicine = medicines;
        setData({ ...current });
      } else {
        setData(getStoredData());
      }
    } catch {
      setData(getStoredData());
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers for cross-component interactions
  const handleNavigate = (view: NavigationView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (doc?: Doctor | null) => {
    setPreselectedDoctor(doc || null);
    setIsBookingModalOpen(true);
  };

  const handleSelectDepartment = (deptName: string) => {
    setSelectedDeptFilter(deptName);
    setCurrentView('doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBookingWithDept = (deptId: number) => {
    const doc = data.doctor.find(d => d.DepartmentID === deptId) || data.doctor[0];
    setPreselectedDoctor(doc);
    setIsBookingModalOpen(true);
  };

  const handleAddVitalLog = (entry: VitalLogEntry) => {
    const updated = { ...data };
    updated.vitalLogs.unshift(entry);
    saveStoredData(updated);
    setData(updated);
  };

  const activePatient = data.patient[0] || {
    FirstName: 'David',
    LastName: 'Harrison',
    DOB: '1984-06-18',
    Gender: 'Male',
    BloodGroup: 'O+',
    Phone: '+1 (555) 839-2041',
    Email: 'david.harrison@email.com',
    Address: '428 Meadowbrook Lane, Suite 4, Springfield'
  };

  // If in Staff Operations Center mode, show dedicated ERP view
  if (currentView === 'staff') {
    return (
      <StaffPortal
        data={data}
        onRefreshData={refreshData}
        onExitStaffPortal={() => handleNavigate('home')}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F6F0', position: 'relative' }}>
      {/* ── Master 3D DNA Background Layer (BTS Palette · View-Aware Shift) ── */}
      <GlobalDna3DCanvas
        opacity={0.92}
        currentView={currentView}
        boxSide={appointmentsBoxSide}
      />

      {/* ── Sticky Top Navbar (Layer 4) ─────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 900 }}>
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenBooking={() => handleOpenBooking(null)}
          onOpenStaffAuth={() => setIsStaffAuthOpen(true)}
        />
      </div>

      {/* ── Main View Switcher (Layer 3) ────────────────────────── */}
      <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        {currentView === 'home' && (
          <>
            <HeroSection
              onNavigate={handleNavigate}
              onOpenBooking={() => handleOpenBooking(null)}
              doctorCount={data.doctor.length}
              departmentCount={data.department.length}
            />
            <TreatmentCategories
              departments={data.department}
              doctors={data.doctor}
              onSelectDepartment={handleSelectDepartment}
              onOpenBookingWithDept={handleOpenBookingWithDept}
            />
          </>
        )}

        {currentView === 'treatments' && (
          <TreatmentCategories
            departments={data.department}
            doctors={data.doctor}
            onSelectDepartment={handleSelectDepartment}
            onOpenBookingWithDept={handleOpenBookingWithDept}
          />
        )}

        {currentView === 'doctors' && (
          <DoctorDiscovery
            doctors={data.doctor}
            departments={data.department}
            selectedDepartmentFilter={selectedDeptFilter}
            onClearDeptFilter={() => setSelectedDeptFilter('all')}
            onBookDoctor={handleOpenBooking}
          />
        )}

        {currentView === 'appointments' && (
          <AppointmentsView
            appointments={data.appointment}
            doctors={data.doctor}
            departments={data.department}
            onOpenBooking={handleOpenBooking}
            onNavigate={handleNavigate}
            boxSide={appointmentsBoxSide}
            onToggleBoxSide={() => setAppointmentsBoxSide(prev => (prev === 'left' ? 'right' : 'left'))}
          />
        )}

        {currentView === 'patient-profile' && (
          <PatientHealthProfile
            patient={activePatient}
            appointments={data.appointment}
            prescriptions={data.prescription}
            medicalHistory={data.medhistory}
            reports={data.reports}
            vitals={data.vitals}
            onOpenBooking={() => handleOpenBooking(null)}
            onNavigateToTracker={() => handleNavigate('tracker')}
          />
        )}

        {currentView === 'assessment' && (
          <HealthAssessment
            doctors={data.doctor}
            onOpenBookingWithDoctor={doctorId => {
              const doc = data.doctor.find(d => d.DoctorID === doctorId) || data.doctor[0];
              handleOpenBooking(doc);
            }}
            boxSide={appointmentsBoxSide}
            onToggleBoxSide={() => setAppointmentsBoxSide(prev => (prev === 'left' ? 'right' : 'left'))}
          />
        )}

        {currentView === 'tracker' && (
          <PatientHealthTracker
            vitals={data.vitals}
            vitalLogs={data.vitalLogs}
            onAddVitalLog={handleAddVitalLog}
          />
        )}

        {currentView === 'pharmacy' && (
          <PharmacyCatalog
            medicines={data.medicine}
          />
        )}
      </main>

      {/* ── Editorial Footer (Layer 5 - 100% Solid, Excludes DNA) ── */}
      <div style={{ position: 'relative', zIndex: 60, backgroundColor: '#164A41' }}>
        <Footer
          onNavigate={handleNavigate}
          onOpenBooking={() => handleOpenBooking(null)}
        />
      </div>

      {/* ── Appointment Booking Modal ────────────────────────────── */}
      <AppointmentBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        doctors={data.doctor}
        departments={data.department}
        preselectedDoctor={preselectedDoctor}
        onSuccessAppointment={() => {
          refreshData();
        }}
      />

      {/* ── Staff Operations Auth Modal ──────────────────────────── */}
      <StaffAuthModal
        isOpen={isStaffAuthOpen}
        onClose={() => setIsStaffAuthOpen(false)}
        onLoginSuccess={() => {
          handleNavigate('staff');
        }}
      />
    </div>
  );
};

export default App;
