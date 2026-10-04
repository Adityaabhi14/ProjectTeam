// =================================================================
// CarePoint Health System — Patient Health Profile & Clinical Records
// Visual Health Dashboard · Vitals Overview · Medical History · Lab Reports
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
  Plus
} from 'lucide-react';
import {
  Patient,
  Appointment,
  Prescription,
  MedicalHistory,
  MedicalReportDoc,
  VitalMetric
} from '../../types';
import { MedicalNetworkBackground } from '../common/MedicalNetworkBackground';

interface PatientHealthProfileProps {
  patient: Patient;
  appointments: Appointment[];
  prescriptions: Prescription[];
  medicalHistory: MedicalHistory[];
  reports: MedicalReportDoc[];
  vitals: VitalMetric[];
  onOpenBooking: () => void;
  onNavigateToTracker: () => void;
}

export const PatientHealthProfile: React.FC<PatientHealthProfileProps> = ({
  patient,
  appointments,
  prescriptions,
  medicalHistory,
  reports,
  vitals,
  onOpenBooking,
  onNavigateToTracker
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'history' | 'appointments' | 'prescriptions' | 'reports'
  >('overview');

  const history = medicalHistory.find(h => h.PatientID === patient.PatientID) || medicalHistory[0];

  return (
    <section style={{ padding: '48px 0 80px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Living Patient Bio-Ecosystem Background */}
      <MedicalNetworkBackground
        variant="subtle"
        density="low"
        opacity={0.16}
        style={{ zIndex: 0 }}
      />

      <div className="app-container-wide" style={{ position: 'relative', zIndex: 10 }}>
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
            <div
              style={{
                width: '72px',
                height: '72px',
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
              {patient.FirstName.charAt(0)}{patient.LastName ? patient.LastName.charAt(0) : ''}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '1.6rem', color: '#17201D', lineHeight: 1.2 }}>
                  {patient.FirstName} {patient.LastName}
                </h1>
                <span className="badge badge-forest" style={{ fontSize: '0.72rem' }}>
                  Patient ID #{patient.PatientID || 1}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: '#5F6E68' }}>
                <span><strong>DOB:</strong> {patient.DOB || '1984-06-18'}</span>
                <span>•</span>
                <span><strong>Gender:</strong> {patient.Gender || 'Male'}</span>
                <span>•</span>
                <span><strong>Blood Group:</strong> <strong style={{ color: '#E8795B' }}>{patient.BloodGroup || 'O+'}</strong></span>
                <span>•</span>
                <span><strong>Aadhaar / ID:</strong> {patient.AadhaarNo || '4829-1029-3841'}</span>
              </div>
            </div>
          </div>

          {/* Quick Profile Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={onNavigateToTracker} className="btn btn-outline btn-sm">
              <Activity size={16} />
              <span>Biometric Tracker</span>
            </button>
            <button onClick={onOpenBooking} className="btn btn-accent btn-sm">
              <Calendar size={16} />
              <span>New Appointment</span>
            </button>
          </div>
        </div>

        {/* ── Visual Biometrics Highlights Bar ─────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '16px',
            marginBottom: '36px'
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
        <div className="tabs-nav" style={{ marginBottom: '28px', maxWidth: '720px' }}>
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <User size={15} /> Overview
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
            <Calendar size={15} /> Appointments ({appointments.length})
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
            <FileCheck2 size={15} /> Diagnostic Reports ({reports.length})
          </button>
        </div>

        {/* ── TAB 1: Patient Overview ──────────────────────────────── */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* Contact & Emergency Details */}
            <div className="solid-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#164A41', marginBottom: '18px' }}>
                Contact & Emergency Information
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                    Primary Phone
                  </div>
                  <div style={{ fontWeight: 600, color: '#17201D' }}>{patient.Phone}</div>
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

            {/* Clinical Highlights & Active Directives */}
            <div className="solid-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#164A41', marginBottom: '18px' }}>
                Active Clinical Directives
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ backgroundColor: '#FAF8F4', padding: '14px', borderRadius: '12px', border: '1px solid #E5E0D6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <ShieldCheck size={16} color="#164A41" />
                    <strong style={{ fontSize: '0.9rem', color: '#164A41' }}>Cardiovascular Maintenance Protocol</strong>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#5F6E68' }}>
                    Follow-up teleconsultation with Dr. Ananya Rao scheduled. Daily blood pressure tracking active.
                  </p>
                </div>

                <div style={{ backgroundColor: '#FDF0F0', padding: '14px', borderRadius: '12px', border: '1px solid rgba(192, 67, 67, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <AlertCircle size={16} color="#C04343" />
                    <strong style={{ fontSize: '0.9rem', color: '#C04343' }}>Known Allergy Alert</strong>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#323F3B' }}>
                    <strong>Penicillin:</strong> Cutaneous rash reaction. Substitute with Macrolides or Quinolones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: Medical History ───────────────────────────────── */}
        {activeTab === 'history' && (
          <div className="solid-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#164A41', marginBottom: '24px' }}>
              Comprehensive Patient Medical History
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div style={{ backgroundColor: '#FAF8F4', padding: '20px', borderRadius: '14px', border: '1px solid #E5E0D6' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#164A41', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Chronic Conditions
                </h4>
                <p style={{ color: '#323F3B', fontSize: '0.9rem', lineHeight: 1.55 }}>
                  {history?.ChronicConditions || 'Mild Essential Hypertension (Stage 1 controlled with daily medication)'}
                </p>
              </div>

              <div style={{ backgroundColor: '#FAF8F4', padding: '20px', borderRadius: '14px', border: '1px solid #E5E0D6' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#164A41', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Past Surgeries & Procedures
                </h4>
                <p style={{ color: '#323F3B', fontSize: '0.9rem', lineHeight: 1.55 }}>
                  {history?.PastSurgeries || 'Laparoscopic Appendectomy (2015, uneventful recovery)'}
                </p>
              </div>

              <div style={{ backgroundColor: '#FAF8F4', padding: '20px', borderRadius: '14px', border: '1px solid #E5E0D6' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#164A41', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Family Health History
                </h4>
                <p style={{ color: '#323F3B', fontSize: '0.9rem', lineHeight: 1.55 }}>
                  {history?.FamilyHistory || 'Maternal history of Type 2 Diabetes; Paternal history of Coronary Artery Disease'}
                </p>
              </div>

              <div style={{ backgroundColor: '#FAF8F4', padding: '20px', borderRadius: '14px', border: '1px solid #E5E0D6' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#164A41', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Clinical Lifestyle Notes
                </h4>
                <p style={{ color: '#323F3B', fontSize: '0.9rem', lineHeight: 1.55 }}>
                  {history?.Notes || 'Exercises 3 times weekly. Non-smoker. Adherent to low-sodium Mediterranean diet.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: Appointments Timeline ────────────────────────── */}
        {activeTab === 'appointments' && (
          <div className="solid-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#164A41' }}>
                Consultation & Visit Timeline
              </h3>
              <button onClick={onOpenBooking} className="btn btn-accent btn-sm">
                <Plus size={14} />
                <span>Book New Visit</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {appointments.map(apt => (
                <div
                  key={apt.AppointmentID}
                  style={{
                    backgroundColor: '#FAF8F4',
                    border: '1px solid #E5E0D6',
                    borderRadius: '14px',
                    padding: '20px 24px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: apt.Type?.includes('Online') ? '#E7F3F0' : '#FAF8F4',
                        border: '1px solid #E5E0D6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {apt.Type?.includes('Online') ? <Video size={20} color="#164A41" /> : <Stethoscope size={20} color="#2F7D6D" />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#17201D' }}>
                          {apt.DoctorName || 'Specialist Doctor'}
                        </span>
                        <span className={`badge ${apt.Status === 'Scheduled' ? 'badge-teal' : 'badge-neutral'}`} style={{ fontSize: '0.68rem' }}>
                          {apt.Status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#5F6E68' }}>
                        {apt.DepartmentName} · {apt.Reason}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#164A41', fontSize: '0.92rem' }}>
                        {apt.AppointmentDate}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#8A9993' }}>
                        {apt.StartTime}
                      </div>
                    </div>

                    {apt.MeetLink && (
                      <a
                        href={apt.MeetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        <Video size={14} />
                        <span>Join Telehealth</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: Prescriptions ────────────────────────────────── */}
        {activeTab === 'prescriptions' && (
          <div className="solid-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#164A41', marginBottom: '24px' }}>
              Active Doctor Prescriptions & Regimens
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {prescriptions.map(rx => (
                <div
                  key={rx.PrescriptionID}
                  style={{
                    backgroundColor: '#FAF8F4',
                    border: '1px solid #E5E0D6',
                    borderRadius: '16px',
                    padding: '24px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #EFECE6', paddingBottom: '12px' }}>
                    <div>
                      <span className="badge badge-forest" style={{ marginBottom: '4px' }}>
                        Prescription #{rx.PrescriptionID}
                      </span>
                      <h4 style={{ fontSize: '1.1rem', color: '#164A41' }}>
                        {rx.Description || 'Clinical Maintenance Protocol'}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: '#5F6E68' }}>
                        Prescribed by {rx.DoctorName || 'Dr. Ananya Rao'} on {rx.CreatedAt || '2026-09-10'}
                      </div>
                    </div>

                    <button className="btn btn-outline btn-sm">
                      <Download size={14} />
                      <span>Download Rx PDF</span>
                    </button>
                  </div>

                  {/* Medication Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    {(rx.Items || []).map(item => (
                      <div
                        key={item.PrescriptionItemID}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E5E0D6',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: '#17201D', fontSize: '0.95rem' }}>
                            {item.MedicineName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#5F6E68' }}>
                            {item.Instructions}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
                            {item.Dose}
                          </span>
                          <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                            {item.Frequency}
                          </span>
                          <span className="badge badge-forest" style={{ fontSize: '0.72rem' }}>
                            {item.Duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {rx.Notes && (
                    <div style={{ fontSize: '0.84rem', color: '#5F6E68', backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '8px', border: '1px solid #EFECE6' }}>
                      <strong>Doctor's Notes:</strong> {rx.Notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: Diagnostic Reports ───────────────────────────── */}
        {activeTab === 'reports' && (
          <div className="solid-card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#164A41', marginBottom: '24px' }}>
              Diagnostic Reports & Laboratory Panels
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reports.map(rep => (
                <div
                  key={rep.id}
                  style={{
                    backgroundColor: '#FAF8F4',
                    border: '1px solid #E5E0D6',
                    borderRadius: '16px',
                    padding: '24px'
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px', borderBottom: '1px solid #EFECE6', paddingBottom: '12px' }}>
                    <div>
                      <span className="badge badge-forest" style={{ marginBottom: '4px' }}>
                        {rep.category}
                      </span>
                      <h4 style={{ fontSize: '1.12rem', color: '#17201D' }}>
                        {rep.title}
                      </h4>
                      <div style={{ fontSize: '0.82rem', color: '#5F6E68' }}>
                        {rep.doctorName} · {rep.department} · {rep.date}
                      </div>
                    </div>

                    <button className="btn btn-outline btn-sm">
                      <Download size={14} />
                      <span>Download Certified Report</span>
                    </button>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#323F3B', lineHeight: 1.5, marginBottom: '18px' }}>
                    <strong>Clinical Summary:</strong> {rep.summary}
                  </p>

                  {/* Parameter Measurements Table */}
                  <div className="table-wrapper" style={{ marginBottom: '14px' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Biomarker / Test Parameter</th>
                          <th>Measured Value</th>
                          <th>Reference Range</th>
                          <th>Clinical Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rep.parameters.map((p, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 600 }}>{p.name}</td>
                            <td style={{ fontWeight: 700, color: '#164A41' }}>
                              {p.value} {p.unit}
                            </td>
                            <td style={{ color: '#5F6E68' }}>{p.referenceRange}</td>
                            <td>
                              <span className={`badge ${p.isAbnormal ? 'badge-danger' : 'badge-success'}`} style={{ fontSize: '0.68rem' }}>
                                {p.isAbnormal ? 'Abnormal' : 'Optimal'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#8A9993' }}>
                    * Verified by CarePoint Clinical Pathology Laboratory. Signed electronically.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
