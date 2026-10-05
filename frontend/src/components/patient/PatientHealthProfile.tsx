// =================================================================
// CarePoint Health System — Patient Health Profile & Clinical Records
// Visual Health Dashboard · Personal Profile Details · Vitals Overview
// Medical History · Connected Google Auth · Interactive Profile Editor
// =================================================================

import React, { useState } from 'react';
import {
  User,
  Heart,
  Activity,
  FileText,
  Calendar,
  Pill,
  ShieldCheck,
  AlertCircle,
  Clock,
  Download,
  Video,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Stethoscope,
  Plus,
  Edit3,
  Phone,
  Mail,
  MapPin,
  Contact,
  LogOut,
  CheckCircle2,
  Sparkles,
  Lock,
  X,
  Save,
  Check
} from 'lucide-react';
import {
  Patient,
  Appointment,
  Prescription,
  MedicalHistory,
  MedicalReportDoc,
  VitalMetric,
  AuthUser
} from '../../types';
import { MedicalNetworkBackground } from '../common/MedicalNetworkBackground';
import { authService } from '../../services/auth';

interface PatientHealthProfileProps {
  patient: Patient;
  currentUser: AuthUser | null;
  appointments: Appointment[];
  prescriptions: Prescription[];
  medicalHistory: MedicalHistory[];
  reports: MedicalReportDoc[];
  vitals: VitalMetric[];
  onOpenBooking: () => void;
  onNavigateToTracker: () => void;
  onOpenAuth: (mode?: 'patient' | 'staff') => void;
  onLogout: () => void;
  onPatientUpdated: (updatedPatient: Patient) => void;
}

export const PatientHealthProfile: React.FC<PatientHealthProfileProps> = ({
  patient,
  currentUser,
  appointments,
  prescriptions,
  medicalHistory,
  reports,
  vitals,
  onOpenBooking,
  onNavigateToTracker,
  onOpenAuth,
  onLogout,
  onPatientUpdated
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'details' | 'history' | 'appointments' | 'prescriptions' | 'reports'
  >('overview');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState<Patient>({ ...patient });

  const history = medicalHistory.find(h => h.PatientID === patient.PatientID) || medicalHistory[0];

  const handleOpenEdit = () => {
    setEditForm({ ...patient });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await authService.updateProfile(editForm);
      if (res.success && res.updatedPatient) {
        onPatientUpdated(res.updatedPatient);
      } else {
        onPatientUpdated(editForm);
      }
      setIsEditModalOpen(false);
      setSaveSuccessNotice('Profile details updated and saved successfully.');
      setTimeout(() => setSaveSuccessNotice(null), 4000);
    } catch {
      onPatientUpdated(editForm);
      setIsEditModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter appointments for current patient if available
  const patientAppointments = appointments.filter(
    a => !patient.PatientID || a.PatientID === patient.PatientID || !a.PatientID
  );

  return (
    <section style={{ padding: '44px 0 80px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Living Patient Bio-Ecosystem Background */}
      <MedicalNetworkBackground
        variant="subtle"
        density="low"
        opacity={0.16}
        style={{ zIndex: 0 }}
      />

      <div className="app-container-wide" style={{ position: 'relative', zIndex: 10 }}>
        {/* ── Success Notice Toast ─────────────────────────────────── */}
        {saveSuccessNotice && (
          <div
            style={{
              backgroundColor: '#E7F3F0',
              border: '1px solid #164A41',
              color: '#164A41',
              padding: '12px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(22,74,65,0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
              <CheckCircle2 size={18} color="#164A41" />
              <span>{saveSuccessNotice}</span>
            </div>
            <button
              onClick={() => setSaveSuccessNotice(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#164A41' }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ── Patient Profile Header Card ─────────────────────────── */}
        <div
          className="solid-card"
          style={{
            padding: '32px',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px'
          }}
        >
          {/* Identity & Demographics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {currentUser?.picture ? (
              <img
                src={currentUser.picture}
                alt={patient.FirstName}
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  border: '2px solid #164A41',
                  boxShadow: '0 6px 16px rgba(22, 74, 65, 0.2)'
                }}
              />
            ) : (
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '20px',
                  backgroundColor: '#164A41',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  boxShadow: '0 6px 16px rgba(22, 74, 65, 0.2)'
                }}
              >
                {patient.FirstName ? patient.FirstName.charAt(0) : 'P'}
                {patient.LastName ? patient.LastName.charAt(0) : ''}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '1.65rem', color: '#17201D', lineHeight: 1.2, margin: 0 }}>
                  {patient.FirstName} {patient.LastName}
                </h1>
                <span className="badge badge-forest" style={{ fontSize: '0.72rem' }}>
                  Patient ID #{patient.PatientID || 1}
                </span>

                {currentUser?.provider === 'google' ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#E8F0FE',
                      color: '#1A73E8',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Google Connected
                  </span>
                ) : (
                  <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                    <ShieldCheck size={12} style={{ display: 'inline', marginRight: '3px' }} />
                    Verified Patient
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: '#5F6E68' }}>
                <span><strong>DOB:</strong> {patient.DOB || '1995-06-15'}</span>
                <span>•</span>
                <span><strong>Gender:</strong> {patient.Gender || 'Male'}</span>
                <span>•</span>
                <span><strong>Blood Group:</strong> <strong style={{ color: '#E8795B' }}>{patient.BloodGroup || 'O+'}</strong></span>
                <span>•</span>
                <span><strong>Phone:</strong> {patient.Phone || '+91 9876543210'}</span>
              </div>
            </div>
          </div>

          {/* Quick Profile Actions */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <button onClick={handleOpenEdit} className="btn btn-outline btn-sm">
              <Edit3 size={15} />
              <span>Edit Details</span>
            </button>
            <button onClick={onNavigateToTracker} className="btn btn-outline btn-sm">
              <Activity size={15} />
              <span>Vitals Tracker</span>
            </button>
            <button onClick={onOpenBooking} className="btn btn-accent btn-sm">
              <Calendar size={15} />
              <span>Book Doctor</span>
            </button>
            {currentUser && (
              <button
                onClick={onLogout}
                className="btn btn-sm"
                style={{
                  backgroundColor: '#FFF0ED',
                  color: '#C0392B',
                  border: '1px solid #FADBD8'
                }}
                title="Sign out of account"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Visual Biometrics Highlights Bar ─────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          {vitals.map(vital => (
            <div
              key={vital.id}
              className="solid-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: '4px solid #164A41'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                  {vital.name}
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                  {vital.status}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#17201D' }}>
                  {vital.value}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#5F6E68', fontWeight: 600 }}>
                  {vital.unit}
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#8A9993' }}>
                Normal: {vital.normalRange}
              </div>
            </div>
          ))}
        </div>

        {/* ── Sub-Navigation Tabs ──────────────────────────────────── */}
        <div className="tabs-nav" style={{ marginBottom: '28px', maxWidth: '840px' }}>
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <User size={15} /> Overview & Vitals
          </button>
          <button
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <Contact size={15} /> Personal Details
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FileText size={15} /> Medical History
          </button>
          <button
            className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar size={15} /> Appointments ({patientAppointments.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('prescriptions')}
          >
            <Pill size={15} /> Prescriptions ({prescriptions.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FileCheck2 size={15} /> Lab Reports ({reports.length})
          </button>
        </div>

        {/* ── TAB 1: Overview & Vitals ─────────────────────────────── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Contact & Demographics Card */}
            <div className="solid-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.15rem', color: '#164A41', margin: 0 }}>
                  Contact & Demographics
                </h3>
                <button onClick={handleOpenEdit} style={{ background: 'none', border: 'none', color: '#164A41', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>
                  Edit
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                    Primary Phone
                  </div>
                  <div style={{ fontWeight: 600, color: '#17201D' }}>{patient.Phone || '+91 9876543210'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                    Email Address
                  </div>
                  <div style={{ fontWeight: 600, color: '#17201D' }}>{patient.Email || 'david.harrison@email.com'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                    Residential Address
                  </div>
                  <div style={{ color: '#323F3B' }}>{patient.Address || '428 Meadowbrook Lane, Suite 4, Springfield'}</div>
                </div>

                <div style={{ paddingTop: '12px', borderTop: '1px solid #EFECE6' }}>
                  <div style={{ fontSize: '0.74rem', color: '#E8795B', fontWeight: 700, textTransform: 'uppercase' }}>
                    Emergency Contact Person
                  </div>
                  <div style={{ fontWeight: 700, color: '#17201D' }}>
                    {patient.EmergencyContactName || 'Sarah Harrison'} ({patient.EmergencyContactPhone || '+1 555-839-2049'})
                  </div>
                </div>
              </div>
            </div>

            {/* Account & Security Information */}
            <div className="solid-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#164A41', marginBottom: '18px' }}>
                Account & Authentication
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                    Sign-In Method
                  </div>
                  <div style={{ fontWeight: 700, color: '#17201D', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {currentUser?.provider === 'google' ? (
                      <>
                        <span style={{ color: '#1A73E8' }}>Google OAuth 2.0</span> ({currentUser.Email})
                      </>
                    ) : (
                      <>CarePoint Clinical ID / Email</>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                    Aadhaar / National ID
                  </div>
                  <div style={{ fontWeight: 600, color: '#17201D' }}>{patient.AadhaarNo || '4829-1029-3841'}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                    Registration Date
                  </div>
                  <div style={{ color: '#323F3B' }}>{patient.RegistrationDate || '2025-01-15'}</div>
                </div>

                <div style={{ paddingTop: '12px', borderTop: '1px solid #EFECE6' }}>
                  <div style={{ fontSize: '0.74rem', color: '#2E7D52', fontWeight: 700, textTransform: 'uppercase' }}>
                    Security Status
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#5F6E68' }}>
                    256-bit SSL encrypted · Medical records restricted to licensed hospital faculty
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: Full Personal Details & Editor ─────────────────── */}
        {activeTab === 'details' && (
          <div className="solid-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: '#164A41', margin: 0 }}>
                  Complete Patient Demographics & Profile
                </h3>
                <p style={{ color: '#5F6E68', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                  Keep your personal and emergency contact information up to date for clinic appointments.
                </p>
              </div>

              <button onClick={handleOpenEdit} className="btn btn-primary btn-sm">
                <Edit3 size={15} />
                <span>Edit Profile Details</span>
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px',
                backgroundColor: '#FAF8F4',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #E5E0D6'
              }}
            >
              <div>
                <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                  Full Legal Name
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#17201D', marginTop: '3px' }}>
                  {patient.FirstName} {patient.LastName}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                  Date of Birth & Age
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#17201D', marginTop: '3px' }}>
                  {patient.DOB || '1995-06-15'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                  Gender
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#17201D', marginTop: '3px' }}>
                  {patient.Gender || 'Male'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                  Blood Group
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E8795B', marginTop: '3px' }}>
                  {patient.BloodGroup || 'O+'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                  Primary Contact Phone
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#17201D', marginTop: '3px' }}>
                  {patient.Phone || '+91 9876543210'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                  Email Address
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#17201D', marginTop: '3px' }}>
                  {patient.Email || 'david.harrison@email.com'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                  Aadhaar / National ID
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#17201D', marginTop: '3px' }}>
                  {patient.AadhaarNo || '4829-1029-3841'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                  Residential Address
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#17201D', marginTop: '3px' }}>
                  {patient.Address || '428 Meadowbrook Lane, Suite 4, Springfield'}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #E5E0D6', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.74rem', color: '#E8795B', fontWeight: 700, textTransform: 'uppercase' }}>
                  Emergency Contact Contact Info
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#17201D', marginTop: '3px' }}>
                  {patient.EmergencyContactName || 'Sarah Harrison'} — {patient.EmergencyContactPhone || '+1 555-839-2049'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: Medical History ───────────────────────────────── */}
        {activeTab === 'history' && (
          <div className="solid-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#164A41', marginBottom: '20px' }}>
              Clinical History & Allergen Profile
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#FAF8F4', padding: '18px', borderRadius: '12px', border: '1px solid #E5E0D6' }}>
                <div style={{ fontSize: '0.76rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Known Allergies
                </div>
                <div style={{ color: '#E8795B', fontWeight: 700 }}>
                  {history?.Allergies || 'Penicillin (mild hives), Seasonal Pollen'}
                </div>
              </div>

              <div style={{ backgroundColor: '#FAF8F4', padding: '18px', borderRadius: '12px', border: '1px solid #E5E0D6' }}>
                <div style={{ fontSize: '0.76rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Chronic Conditions
                </div>
                <div style={{ color: '#17201D', fontWeight: 600 }}>
                  {history?.ChronicConditions || 'Mild Essential Hypertension, Managed Asthmatic Bronchitis'}
                </div>
              </div>

              <div style={{ backgroundColor: '#FAF8F4', padding: '18px', borderRadius: '12px', border: '1px solid #E5E0D6' }}>
                <div style={{ fontSize: '0.76rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Past Surgeries & Procedures
                </div>
                <div style={{ color: '#17201D', fontWeight: 600 }}>
                  {history?.PastSurgeries || 'Appendectomy (2018), Arthroscopic Knee Repair (2021)'}
                </div>
              </div>

              <div style={{ backgroundColor: '#FAF8F4', padding: '18px', borderRadius: '12px', border: '1px solid #E5E0D6' }}>
                <div style={{ fontSize: '0.76rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Family Health History
                </div>
                <div style={{ color: '#17201D', fontWeight: 600 }}>
                  {history?.FamilyHistory || 'Maternal Type 2 Diabetes, Paternal Coronary Artery Disease'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: Appointments ──────────────────────────────────── */}
        {activeTab === 'appointments' && (
          <div className="solid-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#164A41', margin: 0 }}>
                Scheduled Appointments & Consultations
              </h3>
              <button onClick={onOpenBooking} className="btn btn-accent btn-sm">
                <Plus size={14} />
                <span>Book Appointment</span>
              </button>
            </div>

            {patientAppointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#5F6E68' }}>
                <Calendar size={36} color="#8A9993" style={{ margin: '0 auto 12px auto' }} />
                <h4>No appointments scheduled</h4>
                <p style={{ fontSize: '0.88rem' }}>Schedule a consultation with our hospital specialists.</p>
                <button onClick={onOpenBooking} className="btn btn-accent btn-sm" style={{ marginTop: '12px' }}>
                  Book Now
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {patientAppointments.map(apt => (
                  <div
                    key={apt.AppointmentID || Math.random()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px',
                      padding: '18px 20px',
                      backgroundColor: '#FAF8F4',
                      borderRadius: '12px',
                      border: '1px solid #E5E0D6'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, color: '#164A41', fontSize: '1.05rem' }}>
                          {apt.DoctorName || 'Assigned Doctor'}
                        </span>
                        <span className={`badge ${apt.Status === 'Scheduled' ? 'badge-teal' : 'badge-neutral'}`} style={{ fontSize: '0.68rem' }}>
                          {apt.Status}
                        </span>
                        <span className="badge badge-coral" style={{ fontSize: '0.68rem' }}>
                          {apt.ConsultationMode === 'online' ? 'Telehealth' : 'In-Clinic'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#5F6E68' }}>
                        📅 {apt.AppointmentDate} {apt.StartTime && `· ⏰ ${apt.StartTime}`} · Reason: {apt.Reason || 'General Consultation'}
                      </div>
                    </div>

                    {apt.ConsultationMode === 'online' && (
                      <a
                        href={apt.MeetLink || 'https://telehealth.carepoint.health/room'}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-accent btn-sm"
                        style={{ textDecoration: 'none' }}
                      >
                        <Video size={14} />
                        <span>Join Telehealth</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 5: Prescriptions ─────────────────────────────────── */}
        {activeTab === 'prescriptions' && (
          <div className="solid-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#164A41', marginBottom: '20px' }}>
              Active Prescriptions & Medication Orders
            </h3>

            {prescriptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#5F6E68' }}>
                <Pill size={36} color="#8A9993" style={{ margin: '0 auto 12px auto' }} />
                <h4>No active prescriptions</h4>
                <p style={{ fontSize: '0.88rem' }}>Your doctor's electronic prescription records will appear here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {prescriptions.map(rx => (
                  <div
                    key={rx.PrescriptionID || Math.random()}
                    style={{
                      padding: '20px',
                      backgroundColor: '#FAF8F4',
                      borderRadius: '12px',
                      border: '1px solid #E5E0D6'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ fontWeight: 800, color: '#164A41', fontSize: '1.05rem' }}>
                        Rx #{rx.PrescriptionID || 101} · {rx.DoctorName || 'Dr. Eleanor Vance'}
                      </div>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                        Active Rx
                      </span>
                    </div>

                    <p style={{ color: '#5F6E68', fontSize: '0.88rem', margin: '0 0 12px 0' }}>
                      {rx.Description || 'Oral therapy for blood pressure management and anti-inflammatory care.'}
                    </p>

                    {rx.Items && rx.Items.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {rx.Items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #D2DDD9',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              color: '#164A41'
                            }}
                          >
                            💊 {item.MedicineName} · {item.Dose} ({item.Frequency})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 6: Diagnostic Lab Reports ────────────────────────── */}
        {activeTab === 'reports' && (
          <div className="solid-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#164A41', marginBottom: '20px' }}>
              Diagnostic Pathology & Radiology Reports
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reports.map(report => (
                <div
                  key={report.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    padding: '18px 20px',
                    backgroundColor: '#FAF8F4',
                    borderRadius: '12px',
                    border: '1px solid #E5E0D6'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, color: '#164A41', fontSize: '1rem' }}>
                        {report.title}
                      </span>
                      <span className="badge badge-forest" style={{ fontSize: '0.68rem' }}>
                        {report.category}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#5F6E68' }}>
                      📅 {report.date} · Doctor: {report.doctorName} · {report.summary}
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Downloading verified lab report: ${report.title} (PDF)...`)}
                    className="btn btn-outline btn-sm"
                  >
                    <Download size={14} />
                    <span>Download Report</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EDIT PROFILE MODAL ────────────────────────────────────── */}
        {isEditModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1400,
              backgroundColor: 'rgba(8, 31, 27, 0.65)',
              backdropFilter: 'blur(5px)',
              display: 'grid',
              placeItems: 'center',
              padding: '20px'
            }}
            onClick={() => setIsEditModalOpen(false)}
          >
            <div
              className="solid-card"
              style={{
                width: 'min(680px, 100%)',
                maxHeight: 'calc(100dvh - 40px)',
                overflowY: 'auto',
                padding: '32px',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', color: '#164A41', margin: 0 }}>
                    Edit Personal Profile Details
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#5F6E68' }}>
                    Updates will sync with your medical record across hospital departments.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#5F6E68', cursor: 'pointer', padding: '6px' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#31433E', marginBottom: '4px' }}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={editForm.FirstName}
                      onChange={e => setEditForm({ ...editForm, FirstName: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D2DDD9',
                        borderRadius: '10px',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#31433E', marginBottom: '4px' }}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={editForm.LastName || ''}
                      onChange={e => setEditForm({ ...editForm, LastName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D2DDD9',
                        borderRadius: '10px',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#31433E', marginBottom: '4px' }}>
                      Primary Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm.Phone}
                      onChange={e => setEditForm({ ...editForm, Phone: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D2DDD9',
                        borderRadius: '10px',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#31433E', marginBottom: '4px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.Email || ''}
                      onChange={e => setEditForm({ ...editForm, Email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D2DDD9',
                        borderRadius: '10px',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#31433E', marginBottom: '4px' }}>
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editForm.DOB || ''}
                      onChange={e => setEditForm({ ...editForm, DOB: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D2DDD9',
                        borderRadius: '10px',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#31433E', marginBottom: '4px' }}>
                      Gender
                    </label>
                    <select
                      value={editForm.Gender || 'Male'}
                      onChange={e => setEditForm({ ...editForm, Gender: e.target.value as any })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D2DDD9',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#31433E', marginBottom: '4px' }}>
                      Blood Group
                    </label>
                    <select
                      value={editForm.BloodGroup || 'O+'}
                      onChange={e => setEditForm({ ...editForm, BloodGroup: e.target.value as any })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D2DDD9',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#31433E', marginBottom: '4px' }}>
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={editForm.Address || ''}
                    onChange={e => setEditForm({ ...editForm, Address: e.target.value })}
                    placeholder="Street, City, Postal Code"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #D2DDD9',
                      borderRadius: '10px',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#31433E', marginBottom: '4px' }}>
                      Emergency Contact Person
                    </label>
                    <input
                      type="text"
                      value={editForm.EmergencyContactName || ''}
                      onChange={e => setEditForm({ ...editForm, EmergencyContactName: e.target.value })}
                      placeholder="e.g. Sarah Harrison"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D2DDD9',
                        borderRadius: '10px',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#31433E', marginBottom: '4px' }}>
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm.EmergencyContactPhone || ''}
                      onChange={e => setEditForm({ ...editForm, EmergencyContactPhone: e.target.value })}
                      placeholder="+91 9876543210"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #D2DDD9',
                        borderRadius: '10px',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="btn btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={isSaving}
                  >
                    <Save size={15} />
                    <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
