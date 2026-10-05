// =================================================================
// CarePoint Health System — Multi-Step Appointment Booking System
// Online Telehealth & In-Clinic · Interactive Slots · Digital Pass
// =================================================================

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Download,
  Share2
} from 'lucide-react';
import { Doctor, Department } from '../../types';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import { MedicalNetworkBackground } from '../common/MedicalNetworkBackground';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  departments: Department[];
  preselectedDoctor?: Doctor | null;
  onSuccessAppointment?: (appointmentId: number) => void;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  doctors,
  departments,
  preselectedDoctor,
  onSuccessAppointment
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(
    preselectedDoctor?.DoctorID || (doctors.length > 0 ? doctors[0].DoctorID! : 1)
  );
  const [consultationMode, setConsultationMode] = useState<'online' | 'offline'>('online');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [visitReason, setVisitReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedId, setConfirmedId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Update selected doctor if preselectedDoctor changes
  React.useEffect(() => {
    if (preselectedDoctor?.DoctorID) {
      setSelectedDoctorId(preselectedDoctor.DoctorID);
    }
  }, [preselectedDoctor]);

  if (!isOpen) return null;

  const currentDoctor = doctors.find(d => d.DoctorID === selectedDoctorId) || doctors[0];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:15 AM', '11:45 AM', '02:00 PM', '02:30 PM',
    '03:15 PM', '04:00 PM', '04:30 PM', '05:15 PM'
  ];

  const handleNextStep = () => {
    if (step === 3) {
      if (!patientName.trim()) {
        setErrorMessage('Please enter the patient full name.');
        return;
      }
      if (!patientPhone.trim()) {
        setErrorMessage('Please enter a valid contact phone number.');
        return;
      }
    }
    setErrorMessage('');
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setErrorMessage('');
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await api.bookAppointmentPublic({
        name: patientName,
        phone: patientPhone,
        doctorId: selectedDoctorId,
        date: selectedDate,
        time: selectedTimeSlot,
        mode: consultationMode,
        reason: visitReason || 'Scheduled Clinical Consultation'
      });

      if (res.success && res.appointmentId) {
        setConfirmedId(res.appointmentId);
        setStep(4);
        if (onSuccessAppointment) onSuccessAppointment(res.appointmentId);
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {}
      } else {
        setErrorMessage(res.message || 'Booking submission failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-wide"
        onClick={e => e.stopPropagation()}
        style={{ minHeight: '520px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}
      >
        {/* Subtle reactive medical network inside modal */}
        <MedicalNetworkBackground
          variant="subtle"
          density="low"
          opacity={0.12}
          interactive={false}
          style={{ zIndex: 0 }}
        />
        {/* ── Modal Header & Multi-Step Progress Tracker ─────────── */}
        <div className="modal-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '16px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-teal" style={{ marginBottom: '4px' }}>
                CarePoint Clinical Scheduling
              </span>
              <h3 style={{ fontSize: '1.35rem', color: '#164A41' }}>
                {step === 4 ? 'Appointment Confirmed' : 'Book a Doctor Consultation'}
              </h3>
            </div>

            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#5F6E68', cursor: 'pointer', padding: '6px' }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          {step < 4 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {[
                { s: 1, label: 'Doctor & Mode' },
                { s: 2, label: 'Date & Time' },
                { s: 3, label: 'Patient Details' }
              ].map(item => {
                const isActive = step === item.s;
                const isCompleted = step > item.s;

                return (
                  <div
                    key={item.s}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? '#E7F3F0' : isCompleted ? '#FAF8F4' : '#F8F6F0',
                      border: '1px solid',
                      borderColor: isActive ? '#164A41' : '#E5E0D6'
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: isCompleted ? '#2E7D52' : isActive ? '#164A41' : '#D1C9BC',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={12} /> : item.s}
                    </div>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#164A41' : '#5F6E68',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Modal Body: Step Content ────────────────────────────── */}
        <div className="modal-body" style={{ flex: 1 }}>
          {errorMessage && (
            <div
              style={{
                backgroundColor: '#FDF0F0',
                border: '1px solid rgba(192, 67, 67, 0.3)',
                color: '#C04343',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <X size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ── STEP 1: Doctor & Mode Selection ──────────────────── */}
          {step === 1 && (
            <div>
              {/* Mode Selection */}
              <div style={{ marginBottom: '22px' }}>
                <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
                  Select Consultation Format:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div
                    onClick={() => setConsultationMode('online')}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: consultationMode === 'online' ? '#E7F3F0' : '#FFFFFF',
                      border: '2px solid',
                      borderColor: consultationMode === 'online' ? '#164A41' : '#E5E0D6',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#164A41',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Video size={16} color="#FFFFFF" />
                      </div>
                      <strong style={{ color: '#164A41' }}>Online Telehealth</strong>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#5F6E68' }}>
                      Secure encrypted video call with instant digital prescription.
                    </p>
                  </div>

                  <div
                    onClick={() => setConsultationMode('offline')}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      backgroundColor: consultationMode === 'offline' ? '#E7F3F0' : '#FFFFFF',
                      border: '2px solid',
                      borderColor: consultationMode === 'offline' ? '#164A41' : '#E5E0D6',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: '#2F7D6D',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <MapPin size={16} color="#FFFFFF" />
                      </div>
                      <strong style={{ color: '#164A41' }}>In-Clinic Visit</strong>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#5F6E68' }}>
                      Face-to-face evaluation at CarePoint Medical Center.
                    </p>
                  </div>
                </div>
              </div>

              {/* Doctor Selector */}
              <div>
                <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
                  Choose Specialist Doctor:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                  {doctors.map(doc => {
                    const isSelected = doc.DoctorID === selectedDoctorId;
                    return (
                      <div
                        key={doc.DoctorID}
                        onClick={() => setSelectedDoctorId(doc.DoctorID!)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? '#FAF8F4' : '#FFFFFF',
                          border: '1.5px solid',
                          borderColor: isSelected ? '#164A41' : '#E5E0D6',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '10px',
                              backgroundColor: '#164A41',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.9rem'
                            }}
                          >
                            {doc.FirstName.charAt(0)}{doc.LastName.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#17201D' }}>
                              Dr. {doc.FirstName} {doc.LastName}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#2F7D6D' }}>
                              {doc.Specialization} · {doc.DepartmentName}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: '#164A41', fontSize: '0.95rem' }}>
                            ₹{doc.ConsultationFee || 600}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#8A9993' }}>fee</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Date & Time Slot Selection ───────────────── */}
          {step === 2 && (
            <div>
              {/* Doctor Summary Banner */}
              <div
                style={{
                  backgroundColor: '#FAF8F4',
                  border: '1px solid #E5E0D6',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#8A9993', textTransform: 'uppercase', fontWeight: 700 }}>
                    Selected Specialist
                  </div>
                  <div style={{ fontWeight: 700, color: '#164A41' }}>
                    Dr. {currentDoctor?.FirstName} {currentDoctor?.LastName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#5F6E68' }}>
                    {currentDoctor?.Specialization} · {consultationMode === 'online' ? 'Online Telehealth' : 'In-Clinic'}
                  </div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#164A41' }}>
                  ₹{currentDoctor?.ConsultationFee || 600}
                </div>
              </div>

              {/* Date Input */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">
                  Select Consultation Date: <span className="req">*</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="form-input"
                />
              </div>

              {/* Time Slots Grid */}
              <div>
                <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>
                  Available Time Slots:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                  {timeSlots.map(slot => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        style={{
                          padding: '10px 6px',
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: isSelected ? '#164A41' : '#E5E0D6',
                          backgroundColor: isSelected ? '#164A41' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#17201D',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Patient Information ───────────────────────── */}
          {step === 3 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">
                    Patient Full Name: <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. David Harrison"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phone / Mobile Number: <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 (555) 839-2041"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email Address (for appointment pass & video link):
                </label>
                <input
                  type="email"
                  placeholder="e.g. patient@example.com"
                  value={patientEmail}
                  onChange={e => setPatientEmail(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Reason for Visit / Symptoms:
                </label>
                <textarea
                  placeholder="Describe your primary medical concern, symptoms duration, or if this is a routine follow-up..."
                  value={visitReason}
                  onChange={e => setVisitReason(e.target.value)}
                  className="form-textarea"
                />
              </div>
            </div>
          )}

          {/* ── STEP 4: Digital Confirmation Pass ─────────────────── */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#EBF6F0',
                  color: '#2E7D52',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '1.5rem', color: '#164A41', marginBottom: '6px' }}>
                Consultation Confirmed!
              </h3>
              <p style={{ color: '#5F6E68', fontSize: '0.9rem', marginBottom: '24px' }}>
                Your appointment ID is <strong style={{ color: '#17201D' }}>#{confirmedId}</strong>. A confirmation SMS and digital pass have been dispatched.
              </p>

              {/* Digital Pass Card */}
              <div
                style={{
                  backgroundColor: '#FAF8F4',
                  border: '1.5px dashed #D1C9BC',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  maxWidth: '480px',
                  margin: '0 auto 24px auto',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #EFECE6', paddingBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                      Patient Name
                    </div>
                    <div style={{ fontWeight: 700, color: '#17201D' }}>{patientName || 'Patient'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                      Format
                    </div>
                    <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                      {consultationMode === 'online' ? 'Online Telehealth' : 'In-Clinic'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                      Specialist Physician
                    </div>
                    <div style={{ fontWeight: 700, color: '#164A41' }}>
                      Dr. {currentDoctor?.FirstName} {currentDoctor?.LastName}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#5F6E68' }}>{currentDoctor?.Specialization}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                      Date & Time
                    </div>
                    <div style={{ fontWeight: 700, color: '#17201D' }}>{selectedDate}</div>
                    <div style={{ fontSize: '0.76rem', color: '#5F6E68' }}>{selectedTimeSlot}</div>
                  </div>
                </div>

                {consultationMode === 'online' && (
                  <div style={{ backgroundColor: '#E7F3F0', padding: '8px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#164A41', marginTop: '10px' }}>
                    Video Meeting Room: <strong>https://telehealth.carepoint.health/room/cp-{confirmedId}</strong>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Modal Footer Controls ───────────────────────────────── */}
        <div className="modal-footer">
          {step > 1 && step < 4 && (
            <button type="button" onClick={handlePrevStep} className="btn btn-outline">
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          )}

          {step < 3 && (
            <button type="button" onClick={handleNextStep} className="btn btn-primary">
              <span>Continue</span>
              <ChevronRight size={16} />
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={handleConfirmBooking}
              disabled={isSubmitting}
              className="btn btn-accent"
            >
              {isSubmitting ? (
                <span>Confirming Booking...</span>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Confirm Appointment (₹{currentDoctor?.ConsultationFee || 600})</span>
                </>
              )}
            </button>
          )}

          {step === 4 && (
            <button type="button" onClick={onClose} className="btn btn-primary">
              <span>Done & Close</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
