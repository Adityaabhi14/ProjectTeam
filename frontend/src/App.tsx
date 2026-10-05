// =================================================================
// CarePoint Health Management System — Main Application Root
// Multi-User Auth · Google Identity Integration · Comprehensive Patient Profile
// BTS DNA Visual Engine Integration · Dynamic View-Aware Helix Shift
// =================================================================

import React, { useState, useEffect } from 'react';
import { NavigationView, Doctor, Department, VitalLogEntry, AuthUser, Patient } from './types';
import { getStoredData, saveStoredData, StorageData } from './services/storage';
import { api } from './services/api';
import { authService } from './services/auth';
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
import { CareGuideChat } from './components/chatbot/CareGuideChat';
import { LoginDomain } from './components/login';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<NavigationView>('home');
  const [isCareGuideOpen, setIsCareGuideOpen] = useState(() => window.location.hash === '#chatbot');
  const [data, setData] = useState<StorageData>(() => getStoredData());
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoginDomainOpen, setIsLoginDomainOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'patient' | 'staff'>('patient');
  const [preselectedDoctor, setPreselectedDoctor] = useState<Doctor | null>(null);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [appointmentsBoxSide, setAppointmentsBoxSide] = useState<'left' | 'right'>('left');

  // Check and process Google OAuth redirect on initial page load
  useEffect(() => {
    const oauthRes = authService.handleOAuthRedirect();
    if (oauthRes.authenticated && oauthRes.user) {
      setCurrentUser(oauthRes.user);
      setCurrentView('patient-profile');
    }
  }, []);

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

  // Preserve the old #chatbot link as a convenient way to open the floating assistant.
  useEffect(() => {
    const syncChatbotRoute = () => {
      setIsCareGuideOpen(window.location.hash === '#chatbot');
    };

    window.addEventListener('popstate', syncChatbotRoute);
    return () => window.removeEventListener('popstate', syncChatbotRoute);
  }, []);

  // Handlers for cross-component interactions
  const handleNavigate = (view: NavigationView) => {
    if (view === 'chatbot') {
      setIsCareGuideOpen(true);
      return;
    }
    setCurrentView(view);
    const targetHash = '';
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', `${window.location.pathname}${targetHash}`);
    }
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

  const handleOpenAuth = (mode: 'patient' | 'staff' = 'patient') => {
    setAuthModalMode(mode);
    setIsLoginDomainOpen(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setIsLoginDomainOpen(false);
    if (user.Role === 'Admin' || user.Role === 'Staff' || user.Role === 'Doctor') {
      setCurrentView('staff');
    } else {
      setCurrentView('patient-profile');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    handleNavigate('home');
  };

  const handlePatientUpdated = (updatedPatient: Patient) => {
    const current = { ...data };
    const pIdx = current.patient.findIndex(p => p.PatientID === updatedPatient.PatientID);
    if (pIdx >= 0) {
      current.patient[pIdx] = updatedPatient;
    } else {
      current.patient.unshift(updatedPatient);
    }
    saveStoredData(current);
    setData(current);

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        patientDetails: updatedPatient,
        name: `${updatedPatient.FirstName} ${updatedPatient.LastName || ''}`.trim()
      };
      authService.saveSession(updatedUser);
      setCurrentUser(updatedUser);
    }
  };

  const activePatient: Patient =
    currentUser?.patientDetails ||
    data.patient.find(p => p.PatientID === currentUser?.PatientID) ||
    data.patient[0] || {
      PatientID: 1,
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
          currentUser={currentUser}
          onNavigate={handleNavigate}
          onOpenBooking={() => handleOpenBooking(null)}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
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
            currentUser={currentUser}
            appointments={data.appointment}
            prescriptions={data.prescription}
            medicalHistory={data.medhistory}
            reports={data.reports}
            vitals={data.vitals}
            onOpenBooking={() => handleOpenBooking(null)}
            onNavigateToTracker={() => handleNavigate('tracker')}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
            onPatientUpdated={handlePatientUpdated}
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

      {/* ── Unified Authentication Modal (Google OAuth, Patient & Staff) ── */}
      <LoginDomain
        isOpen={isLoginDomainOpen}
        initialMode={authModalMode}
        onClose={() => setIsLoginDomainOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* ── Floating CareGuide (frontend-only) ─────────────────── */}
      <CareGuideChat
        isOpen={isCareGuideOpen}
        onOpen={() => setIsCareGuideOpen(true)}
        onClose={() => setIsCareGuideOpen(false)}
        onBookAppointment={() => handleOpenBooking(null)}
        onBrowseDoctors={() => handleNavigate('doctors')}
      />
    </div>
  );
};

export default App;
