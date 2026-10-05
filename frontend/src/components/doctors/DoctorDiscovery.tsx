// =================================================================
// CarePoint Health System — Premium Doctor Discovery & Profile View
// Search & Filter · Online / In-Clinic Modes · Professional Medical Profiles
// =================================================================

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Star,
  Video,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  User,
  X,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { Doctor, Department } from '../../types';
import { MedicalNetworkBackground } from '../common/MedicalNetworkBackground';

interface DoctorDiscoveryProps {
  doctors: Doctor[];
  departments: Department[];
  selectedDepartmentFilter?: string;
  onClearDeptFilter?: () => void;
  onBookDoctor: (doctor: Doctor) => void;
}

export const DoctorDiscovery: React.FC<DoctorDiscoveryProps> = ({
  doctors,
  departments,
  selectedDepartmentFilter = 'all',
  onClearDeptFilter,
  onBookDoctor
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDept, setActiveDept] = useState(selectedDepartmentFilter);
  const [modeFilter, setModeFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Sync prop changes
  React.useEffect(() => {
    if (selectedDepartmentFilter) {
      setActiveDept(selectedDepartmentFilter);
    }
  }, [selectedDepartmentFilter]);

  // Filtered Doctors list
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      // Search term
      const matchesSearch =
        `${doc.FirstName} ${doc.LastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.Specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.DepartmentName && doc.DepartmentName.toLowerCase().includes(searchQuery.toLowerCase()));

      // Department filter
      const matchesDept =
        activeDept === 'all' ||
        (doc.DepartmentName && doc.DepartmentName.toLowerCase().includes(activeDept.toLowerCase())) ||
        (doc.DepartmentID && departments.find(d => d.DepartmentID === doc.DepartmentID)?.DepartmentName.toLowerCase().includes(activeDept.toLowerCase()));

      // Mode filter
      const modes = doc.ConsultationModes || ['online', 'offline'];
      const matchesMode =
        modeFilter === 'all' ||
        (modeFilter === 'online' && modes.includes('online')) ||
        (modeFilter === 'offline' && modes.includes('offline'));

      return matchesSearch && matchesDept && matchesMode;
    });
  }, [doctors, searchQuery, activeDept, modeFilter, departments]);

  return (
    <section style={{ padding: '48px 0 80px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle Medical Network Layer */}
      <MedicalNetworkBackground
        variant="subtle"
        density="low"
        opacity={0.16}
        style={{ zIndex: 0 }}
      />

      <div className="app-container-wide" style={{ position: 'relative', zIndex: 10 }}>
        {/* ── Page Header (Solid Opaque Banner Box) ────────────────── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #DCD7CD',
            boxShadow: '0 12px 36px rgba(22, 74, 65, 0.09), 0 2px 8px rgba(22, 74, 65, 0.03)',
            padding: 'clamp(24px, 3.5vw, 36px)',
            marginBottom: '32px',
            position: 'relative',
            zIndex: 30
          }}
        >
          <span className="badge badge-forest" style={{ marginBottom: '10px' }}>
            Medical Faculty & Consultants
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#164A41', marginBottom: '10px', lineHeight: 1.15 }}>
            Consult with world-class specialists
          </h1>
          <p style={{ color: '#5F6E68', fontSize: '0.96rem', lineHeight: 1.55, margin: 0, maxWidth: '720px' }}>
            Every physician at CarePoint is vetted through rigorous clinical governance, offering specialized telehealth evaluations and precision in-clinic procedures.
          </p>
        </div>

        {/* ── Search & Filter Controls Ribbon ─────────────────────── */}
        <div
          className="solid-card"
          style={{
            padding: '20px 24px',
            marginBottom: '36px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 300px', minWidth: '260px' }}>
            <Search
              size={18}
              color="#8A9993"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, or condition..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '42px' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#8A9993',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Consultation Mode Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#5F6E68' }}>
              Mode:
            </span>
            <div className="tabs-nav" style={{ padding: '3px' }}>
              <button
                className={`tab-btn ${modeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setModeFilter('all')}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                All Modes
              </button>
              <button
                className={`tab-btn ${modeFilter === 'online' ? 'active' : ''}`}
                onClick={() => setModeFilter('online')}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <Video size={13} /> Online Telehealth
              </button>
              <button
                className={`tab-btn ${modeFilter === 'offline' ? 'active' : ''}`}
                onClick={() => setModeFilter('offline')}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                In-Clinic
              </button>
            </div>
          </div>
        </div>

        {/* ── Department Quick Filter Pills ────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '32px',
            scrollbarWidth: 'none'
          }}
        >
          <button
            onClick={() => setActiveDept('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '0.84rem',
              fontWeight: activeDept === 'all' ? 700 : 500,
              backgroundColor: activeDept === 'all' ? '#164A41' : '#FFFFFF',
              color: activeDept === 'all' ? '#FFFFFF' : '#323F3B',
              border: '1px solid',
              borderColor: activeDept === 'all' ? '#164A41' : '#E5E0D6',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeDept === 'all' ? '0 2px 8px rgba(22,74,65,0.2)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            All Departments ({doctors.length})
          </button>

          {departments.map(dept => {
            const isSelected = activeDept.toLowerCase() === dept.DepartmentName.toLowerCase();
            return (
              <button
                key={dept.DepartmentID}
                onClick={() => setActiveDept(dept.DepartmentName)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? '#164A41' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#323F3B',
                  border: '1px solid',
                  borderColor: isSelected ? '#164A41' : '#E5E0D6',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 2px 8px rgba(22,74,65,0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {dept.DepartmentName}
              </button>
            );
          })}
        </div>

        {/* ── Doctor Cards Grid ────────────────────────────────────── */}
        {filteredDoctors.length === 0 ? (
          <div
            className="solid-card"
            style={{ padding: '56px 24px', textAlign: 'center', backgroundColor: '#FAF8F4' }}
          >
            <User size={48} color="#8A9993" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#164A41', marginBottom: '8px' }}>
              No specialist doctors matched your query
            </h3>
            <p style={{ color: '#5F6E68', fontSize: '0.9rem', marginBottom: '20px' }}>
              Try broadening your search term or clearing active department filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveDept('all');
                setModeFilter('all');
              }}
              className="btn btn-outline btn-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid-cols-3">
            {filteredDoctors.map(doctor => {
              const modes = doctor.ConsultationModes || ['online', 'offline'];
              const isOnline = modes.includes('online');
              const isOffline = modes.includes('offline');

              return (
                <div
                  key={doctor.DoctorID}
                  className="solid-card-interactive"
                  style={{
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '380px'
                  }}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div>
                    {/* Top Row: Department Badge & Rating */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '18px'
                      }}
                    >
                      <span className="badge badge-forest" style={{ fontSize: '0.72rem' }}>
                        {doctor.DepartmentName || 'Clinical Care'}
                      </span>

                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: '#FFF7F5',
                          border: '1px solid rgba(232, 121, 91, 0.25)',
                          borderRadius: '9999px',
                          padding: '3px 8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#E8795B'
                        }}
                      >
                        <Star size={12} fill="#E8795B" color="#E8795B" />
                        <span>{doctor.Rating || 4.9}</span>
                        <span style={{ color: '#8A9993', fontWeight: 500 }}>
                          ({doctor.ReviewCount || 95})
                        </span>
                      </div>
                    </div>

                    {/* Doctor Avatar / Initial & Identity */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '16px',
                          backgroundColor: '#164A41',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(22, 74, 65, 0.2)'
                        }}
                      >
                        {doctor.FirstName.charAt(0)}{doctor.LastName.charAt(0)}
                      </div>

                      <div>
                        <h3 style={{ fontSize: '1.22rem', color: '#17201D', lineHeight: 1.25 }}>
                          Dr. {doctor.FirstName} {doctor.LastName}
                        </h3>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2F7D6D', marginTop: '2px' }}>
                          {doctor.Specialization}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#8A9993', marginTop: '2px' }}>
                          {doctor.Qualification}
                        </div>
                      </div>
                    </div>

                    {/* Doctor Bio Snippet */}
                    <p
                      style={{
                        fontSize: '0.86rem',
                        color: '#5F6E68',
                        lineHeight: 1.5,
                        marginBottom: '18px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {doctor.Bio || 'Specialist clinician committed to patient-first diagnosis, personalized therapeutic plans, and continuous care monitoring.'}
                    </p>

                    {/* Consultation Modes Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                      {isOnline && (
                        <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                          <Video size={11} /> Telehealth Video
                        </span>
                      )}
                      {isOffline && (
                        <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                          <MapPin size={11} /> In-Clinic Visit
                        </span>
                      )}
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        {doctor.ExperienceYears || 10}+ Yrs Exp
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom: Fee & Action Buttons */}
                  <div
                    style={{
                      paddingTop: '16px',
                      borderTop: '1px solid #EFECE6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#8A9993', textTransform: 'uppercase', fontWeight: 700 }}>
                        Consultation
                      </div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#164A41' }}>
                        ₹{doctor.ConsultationFee || 600}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedDoctor(doctor);
                        }}
                        className="btn btn-outline btn-sm"
                      >
                        Profile
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onBookDoctor(doctor);
                        }}
                        className="btn btn-accent btn-sm"
                      >
                        <Calendar size={14} />
                        <span>Book</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Doctor Full Profile Modal ────────────────────────────── */}
        {selectedDoctor && (
          <div className="modal-backdrop" onClick={() => setSelectedDoctor(null)}>
            <div
              className="modal-dialog modal-dialog-wide"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      backgroundColor: '#164A41',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.35rem',
                      fontWeight: 700
                    }}
                  >
                    {selectedDoctor.FirstName.charAt(0)}{selectedDoctor.LastName.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', color: '#164A41' }}>
                      Dr. {selectedDoctor.FirstName} {selectedDoctor.LastName}
                    </h3>
                    <span style={{ fontSize: '0.86rem', color: '#2F7D6D', fontWeight: 600 }}>
                      {selectedDoctor.Specialization} · {selectedDoctor.DepartmentName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDoctor(null)}
                  style={{ background: 'none', border: 'none', color: '#5F6E68', cursor: 'pointer', padding: '6px' }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Body */}
              <div className="modal-body">
                {/* Credentials Banner */}
                <div
                  style={{
                    backgroundColor: '#FAF8F4',
                    border: '1px solid #E5E0D6',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                      Experience
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#164A41' }}>
                      {selectedDoctor.ExperienceYears || 12}+ Years
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                      Patient Rating
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#E8795B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} fill="#E8795B" /> {selectedDoctor.Rating || 4.9} / 5.0
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                      Consultation Fee
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#164A41' }}>
                      ₹{selectedDoctor.ConsultationFee || 600}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.74rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                      Consultation Modes
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#2F7D6D' }}>
                      Online HD Video & Clinic
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div style={{ marginBottom: '22px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#17201D', marginBottom: '8px' }}>
                    Clinical Bio & Background
                  </h4>
                  <p style={{ color: '#323F3B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {selectedDoctor.Bio || 'Dr. ' + selectedDoctor.LastName + ' is a certified medical authority with extensive clinical research and direct patient advisory history. Known for precision diagnostics, empathetic patient communication, and comprehensive treatment plans.'}
                  </p>
                </div>

                {/* Qualifications & Certifications */}
                <div style={{ marginBottom: '22px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#17201D', marginBottom: '8px' }}>
                    Qualifications & Credentials
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#323F3B', fontSize: '0.9rem' }}>
                    <Award size={16} color="#164A41" />
                    <span>{selectedDoctor.Qualification || 'MD, Board Certified Physician'}</span>
                  </div>
                </div>

                {/* Available Schedule Days */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#17201D', marginBottom: '8px' }}>
                    Weekly Clinical Schedule
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(selectedDoctor.AvailableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']).map(day => (
                      <span
                        key={day}
                        className="badge badge-forest"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        {day} (09:00 AM - 05:00 PM)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button onClick={() => setSelectedDoctor(null)} className="btn btn-outline">
                  Close
                </button>
                <button
                  onClick={() => {
                    const doc = selectedDoctor;
                    setSelectedDoctor(null);
                    onBookDoctor(doc);
                  }}
                  className="btn btn-accent"
                >
                  <Calendar size={16} />
                  <span>Book Appointment with Dr. {selectedDoctor.LastName}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
