// =================================================================
// CarePoint Health System — Dedicated Appointments & Clinical View
// Solid Opaque Box Layout: 100% Text Readability
// All text, filters, sorts & details strictly inside solid opaque card box
// 3D BTS DNA Helix rendered purely in dedicated empty space (zero overlap)
// =================================================================

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Search,
  ArrowUpDown,
  Plus,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Dna,
  ArrowLeftRight,
  User,
  Stethoscope,
  ExternalLink
} from 'lucide-react';
import { Appointment, Doctor, Department, NavigationView } from '../../types';

interface AppointmentsViewProps {
  appointments: Appointment[];
  doctors: Doctor[];
  departments: Department[];
  onOpenBooking: (doctor?: Doctor | null) => void;
  onNavigate: (view: NavigationView) => void;
  boxSide: 'left' | 'right';
  onToggleBoxSide: () => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  doctors,
  departments,
  onOpenBooking,
  onNavigate,
  boxSide,
  onToggleBoxSide
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Scheduled' | 'Completed' | 'online' | 'offline'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'doctor-asc' | 'dept-asc' | 'status'>('date-asc');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(() => {
    return appointments.length > 0 ? (appointments[0].AppointmentID ?? null) : null;
  });
  const [copiedMeetId, setCopiedMeetId] = useState<number | null>(null);

  // Filter & Sort Pipeline
  const filteredAndSortedAppointments = useMemo(() => {
    return appointments
      .filter(apt => {
        // Search Filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          (apt.DoctorName && apt.DoctorName.toLowerCase().includes(query)) ||
          (apt.DepartmentName && apt.DepartmentName.toLowerCase().includes(query)) ||
          (apt.PatientName && apt.PatientName.toLowerCase().includes(query)) ||
          (apt.Reason && apt.Reason.toLowerCase().includes(query));

        // Status / Mode Filter
        let matchesStatus = true;
        if (statusFilter === 'online') {
          matchesStatus = apt.ConsultationMode === 'online' || (apt.Type && (apt.Type.toLowerCase().includes('telehealth') || apt.Type.toLowerCase().includes('online'))) === true;
        } else if (statusFilter === 'offline') {
          matchesStatus = apt.ConsultationMode === 'offline' || (apt.Type && (apt.Type.toLowerCase().includes('in-clinic') || apt.Type.toLowerCase().includes('clinic'))) === true;
        } else if (statusFilter !== 'all') {
          matchesStatus = apt.Status.toLowerCase() === statusFilter.toLowerCase();
        }

        // Department Filter
        const matchesDept =
          selectedDept === 'all' ||
          (apt.DepartmentName && apt.DepartmentName.toLowerCase() === selectedDept.toLowerCase());

        return matchesSearch && matchesStatus && matchesDept;
      })
      .sort((a, b) => {
        if (sortBy === 'date-asc') {
          return new Date(a.AppointmentDate).getTime() - new Date(b.AppointmentDate).getTime();
        }
        if (sortBy === 'date-desc') {
          return new Date(b.AppointmentDate).getTime() - new Date(a.AppointmentDate).getTime();
        }
        if (sortBy === 'doctor-asc') {
          return (a.DoctorName || '').localeCompare(b.DoctorName || '');
        }
        if (sortBy === 'dept-asc') {
          return (a.DepartmentName || '').localeCompare(b.DepartmentName || '');
        }
        if (sortBy === 'status') {
          return a.Status.localeCompare(b.Status);
        }
        return 0;
      });
  }, [appointments, searchQuery, statusFilter, selectedDept, sortBy]);

  // Active selected appointment object
  const activeSelected = useMemo(() => {
    if (!selectedAppointmentId) return filteredAndSortedAppointments[0] || null;
    return (
      appointments.find(a => a.AppointmentID === selectedAppointmentId) ||
      filteredAndSortedAppointments[0] ||
      null
    );
  }, [selectedAppointmentId, appointments, filteredAndSortedAppointments]);

  // Statistics counters
  const totalCount = appointments.length;
  const scheduledCount = appointments.filter(a => a.Status === 'Scheduled' || (a.Status as string) === 'Confirmed').length;
  const onlineCount = appointments.filter(a => a.ConsultationMode === 'online' || (a.Type && a.Type.toLowerCase().includes('telehealth'))).length;
  const inClinicCount = appointments.filter(a => a.ConsultationMode === 'offline' || (a.Type && a.Type.toLowerCase().includes('clinic'))).length;

  const handleCopyLink = (aptId: number, link: string) => {
    navigator.clipboard.writeText(link || `https://telehealth.carepoint.health/room/cp-${aptId}`);
    setCopiedMeetId(aptId);
    setTimeout(() => setCopiedMeetId(null), 2500);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSelectedDept('all');
    setSortBy('date-asc');
  };

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || selectedDept !== 'all' || sortBy !== 'date-asc';

  return (
    <div style={{ paddingTop: '24px', paddingBottom: '72px', position: 'relative' }}>
      <div className="app-container-wide">
        {/* ── Split Grid Layout ─────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              boxSide === 'left'
                ? 'minmax(340px, 680px) 1fr'
                : '1fr minmax(340px, 680px)',
            gap: '40px',
            alignItems: 'start'
          }}
        >
          {/* ══════════════════════════════════════════════════════════
              100% SOLID OPAQUE DETAILS, SORTS & APPOINTMENTS BOX
              Zero transparency: Completely isolates all text from DNA
              ══════════════════════════════════════════════════════════ */}
          <div
            style={{
              order: boxSide === 'left' ? 1 : 2,
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #DCD7CD',
              boxShadow: '0 16px 48px rgba(22, 74, 65, 0.12), 0 2px 8px rgba(22, 74, 65, 0.04)',
              padding: 'clamp(20px, 3.2vw, 32px)',
              position: 'relative',
              zIndex: 30
            }}
          >
            {/* ── Top Header Strip Inside Box ──────────────────────── */}
            <div style={{ marginBottom: '22px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '10px'
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#FFF1F0',
                    color: '#C70039',
                    border: '1px solid rgba(199, 0, 57, 0.25)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  <Dna size={13} color="#C70039" />
                  BTS Spectrum Telemetry Mode
                </div>

                {/* Switch Side Toggle Button */}
                <button
                  onClick={onToggleBoxSide}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#F8F6F0',
                    border: '1px solid #D1C9BC',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#164A41',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title={`Move this box to the ${boxSide === 'left' ? 'right' : 'left'} and shift the DNA animation to the ${boxSide === 'left' ? 'left' : 'right'}`}
                >
                  <ArrowLeftRight size={13} />
                  <span>Dock {boxSide === 'left' ? 'Right →' : '← Left'}</span>
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div>
                  <h1
                    style={{
                      fontSize: 'clamp(1.7rem, 2.6vw, 2.2rem)',
                      color: '#164A41',
                      margin: '0 0 4px 0',
                      lineHeight: 1.15
                    }}
                  >
                    Appointments Console
                  </h1>
                  <p style={{ fontSize: '0.86rem', color: '#5F6E68', margin: 0 }}>
                    Manage consultations, telehealth meetings & doctor calendars.
                  </p>
                </div>

                <button
                  onClick={() => onOpenBooking(null)}
                  className="btn btn-accent"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    fontSize: '0.86rem',
                    boxShadow: '0 4px 14px rgba(232, 121, 91, 0.35)'
                  }}
                >
                  <Plus size={15} />
                  <span>+ Book Appointment</span>
                </button>
              </div>
            </div>

            {/* ── Summary Metrics Bar ──────────────────────────────── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginBottom: '20px'
              }}
            >
              <div
                style={{
                  backgroundColor: '#FAF8F4',
                  border: '1px solid #EFECE6',
                  borderRadius: '12px',
                  padding: '10px 8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#164A41' }}>{totalCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#5F6E68', fontWeight: 600 }}>Total Booked</div>
              </div>

              <div
                style={{
                  backgroundColor: '#EBF6F0',
                  border: '1px solid rgba(46, 125, 82, 0.25)',
                  borderRadius: '12px',
                  padding: '10px 8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2E7D52' }}>{scheduledCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#2E7D52', fontWeight: 600 }}>Confirmed</div>
              </div>

              <div
                style={{
                  backgroundColor: '#FFF7F5',
                  border: '1px solid rgba(232, 121, 91, 0.25)',
                  borderRadius: '12px',
                  padding: '10px 8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#E8795B' }}>{onlineCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#E8795B', fontWeight: 600 }}>Telehealth</div>
              </div>

              <div
                style={{
                  backgroundColor: '#E8F5F2',
                  border: '1px solid rgba(47, 125, 109, 0.25)',
                  borderRadius: '12px',
                  padding: '10px 8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2F7D6D' }}>{inClinicCount}</div>
                <div style={{ fontSize: '0.7rem', color: '#2F7D6D', fontWeight: 600 }}>In-Clinic</div>
              </div>
            </div>

            {/* ── Search, Sorts & Filter Console Box ───────────────── */}
            <div
              style={{
                backgroundColor: '#FAF8F4',
                borderRadius: '16px',
                border: '1px solid #E5E0D6',
                padding: '16px',
                marginBottom: '20px'
              }}
            >
              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#8A9993'
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by doctor, department, or reason..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    fontSize: '0.88rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D1C9BC',
                    borderRadius: '10px',
                    outline: 'none',
                    color: '#17201D'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#8A9993',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filter Tab Pills */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                  marginBottom: '12px'
                }}
              >
                {[
                  { id: 'all', label: 'All' },
                  { id: 'Scheduled', label: 'Confirmed' },
                  { id: 'online', label: '📹 Telehealth' },
                  { id: 'offline', label: '🏥 In-Clinic' },
                  { id: 'Completed', label: 'Completed' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id as any)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      border: '1px solid',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      backgroundColor: statusFilter === tab.id ? '#164A41' : '#FFFFFF',
                      color: statusFilter === tab.id ? '#FFFFFF' : '#323F3B',
                      borderColor: statusFilter === tab.id ? '#164A41' : '#D1C9BC'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Department & Sort Controls Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '10px'
                }}
              >
                {/* Department Dropdown */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#5F6E68',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}
                  >
                    Department
                  </label>
                  <select
                    value={selectedDept}
                    onChange={e => setSelectedDept(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      fontSize: '0.82rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1C9BC',
                      borderRadius: '8px',
                      outline: 'none',
                      color: '#17201D'
                    }}
                  >
                    <option value="all">All Departments</option>
                    {departments.map(d => (
                      <option key={d.DepartmentID} value={d.DepartmentName}>
                        {d.DepartmentName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By Dropdown */}
                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#5F6E68',
                      textTransform: 'uppercase',
                      marginBottom: '4px'
                    }}
                  >
                    <ArrowUpDown size={11} />
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      fontSize: '0.82rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1C9BC',
                      borderRadius: '8px',
                      outline: 'none',
                      color: '#17201D'
                    }}
                  >
                    <option value="date-asc">📅 Date: Soonest First</option>
                    <option value="date-desc">📅 Date: Furthest First</option>
                    <option value="doctor-asc">👤 Doctor: A to Z</option>
                    <option value="dept-asc">🩺 Department: A to Z</option>
                    <option value="status">⚡ Status Order</option>
                  </select>
                </div>
              </div>

              {/* Reset filter pill */}
              {hasActiveFilters && (
                <div
                  style={{
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    color: '#C70039'
                  }}
                >
                  <span>Active filters applied</span>
                  <button
                    onClick={handleResetFilters}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#C70039',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RotateCcw size={12} />
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* ── Appointments List ────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredAndSortedAppointments.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#FAF8F4',
                    borderRadius: '16px',
                    border: '1px dashed #D1C9BC',
                    padding: '32px 20px',
                    textAlign: 'center'
                  }}
                >
                  <Calendar size={32} color="#8A9993" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontWeight: 700, color: '#164A41', marginBottom: '4px' }}>
                    No matching appointments found
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#5F6E68', maxWidth: '340px', margin: '0 auto 16px' }}>
                    Try modifying your search keywords or clear filters to view appointments.
                  </p>
                  <button
                    onClick={() => onOpenBooking(null)}
                    className="btn btn-accent btn-sm"
                  >
                    + Book New Appointment
                  </button>
                </div>
              ) : (
                filteredAndSortedAppointments.map(apt => {
                  const isSelected = activeSelected?.AppointmentID === apt.AppointmentID;
                  const isOnline = apt.ConsultationMode === 'online' || (apt.Type && apt.Type.toLowerCase().includes('telehealth'));

                  return (
                    <div
                      key={apt.AppointmentID}
                      onClick={() => setSelectedAppointmentId(apt.AppointmentID ?? null)}
                      style={{
                        backgroundColor: isSelected ? '#F0F7F5' : '#FFFFFF',
                        border: isSelected ? '2px solid #164A41' : '1px solid #E5E0D6',
                        borderRadius: '16px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        boxShadow: isSelected ? '0 4px 16px rgba(22, 74, 65, 0.09)' : 'none'
                      }}
                    >
                      {/* Top Row: Doctor Info & Status */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '12px',
                          marginBottom: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '12px',
                              backgroundColor: isOnline ? '#FFF7F5' : '#E8F5F2',
                              color: isOnline ? '#E8795B' : '#2F7D6D',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.95rem'
                            }}
                          >
                            {(apt.DoctorName || 'DR').replace(/^Dr\.\s*/, '').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#164A41', fontSize: '0.98rem' }}>
                              {apt.DoctorName}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#5F6E68' }}>
                              {apt.DepartmentName}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            backgroundColor:
                              apt.Status === 'Scheduled'
                                ? '#EBF6F0'
                                : '#FAF8F4',
                            color:
                              apt.Status === 'Scheduled'
                                ? '#2E7D52'
                                : '#5F6E68',
                            border: `1px solid ${
                              apt.Status === 'Scheduled'
                                ? 'rgba(46, 125, 82, 0.25)'
                                : '#D1C9BC'
                            }`
                          }}
                        >
                          ● {apt.Status}
                        </span>
                      </div>

                      {/* Middle Row: Date, Time & Visit Mode */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '0.82rem',
                          color: '#323F3B',
                          marginBottom: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={14} color="#164A41" />
                          <span style={{ fontWeight: 600 }}>{apt.AppointmentDate}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={14} color="#5F6E68" />
                          <span>{apt.StartTime} - {apt.EndTime}</span>
                        </div>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: isOnline ? '#FFF1EE' : '#F2EFEB',
                            color: isOnline ? '#C70039' : '#164A41',
                            fontWeight: 700,
                            fontSize: '0.75rem'
                          }}
                        >
                          {isOnline ? <Video size={12} /> : <MapPin size={12} />}
                          {isOnline ? 'Telehealth' : 'In-Clinic'}
                        </div>
                      </div>

                      {/* Reason Description */}
                      <p
                        style={{
                          fontSize: '0.82rem',
                          color: '#5F6E68',
                          lineHeight: 1.4,
                          margin: 0,
                          marginBottom: isSelected ? '14px' : '0'
                        }}
                      >
                        <strong style={{ color: '#17201D' }}>Reason:</strong> {apt.Reason}
                      </p>

                      {/* Expanded Details when selected */}
                      {isSelected && (
                        <div
                          style={{
                            marginTop: '14px',
                            paddingTop: '14px',
                            borderTop: '1px solid #D1C9BC',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px'
                          }}
                        >
                          <div style={{ fontSize: '0.78rem', color: '#5F6E68' }}>
                            Ref Token: <strong>#CP-APT-{(apt.AppointmentID ?? 1).toString().padStart(4, '0')}</strong>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isOnline && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  handleCopyLink(apt.AppointmentID ?? 1, apt.MeetLink || '');
                                }}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  padding: '5px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                  backgroundColor: copiedMeetId === apt.AppointmentID ? '#EBF6F0' : '#FFF7F5',
                                  color: copiedMeetId === apt.AppointmentID ? '#2E7D52' : '#C70039',
                                  border: '1px solid rgba(199, 0, 57, 0.2)',
                                  cursor: 'pointer'
                                }}
                              >
                                {copiedMeetId === apt.AppointmentID ? <Check size={12} /> : <Copy size={12} />}
                                {copiedMeetId === apt.AppointmentID ? 'Link Copied!' : 'Copy Video Link'}
                              </button>
                            )}

                            <button
                              onClick={e => {
                                e.stopPropagation();
                                const doc = doctors.find(d => d.DoctorID === apt.DoctorID) || doctors[0];
                                onOpenBooking(doc);
                              }}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '5px 12px', fontSize: '0.76rem' }}
                            >
                              Reschedule
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* ── Selected Appointment Clinical Snapshot Card ─────── */}
            {activeSelected && (
              <div
                style={{
                  marginTop: '24px',
                  backgroundColor: '#FAF8F4',
                  borderRadius: '16px',
                  border: '1px solid #E5E0D6',
                  padding: '18px 20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <ShieldCheck size={16} color="#2E7D52" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#164A41', textTransform: 'uppercase' }}>
                    Consultation Clinical Notes
                  </span>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#323F3B', marginBottom: '8px' }}>
                  <strong>Doctor:</strong> {activeSelected.DoctorName} ({activeSelected.DepartmentName})
                </div>
                <div style={{ fontSize: '0.8rem', color: '#5F6E68', lineHeight: 1.45 }}>
                  Please arrive 10 minutes early for check-in or test your camera/mic beforehand for telehealth appointments.
                </div>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════
              DEDICATED 100% EMPTY SPACE FOR 3D BTS DNA HELIX
              Zero text, zero overlapping cards, pure visual clarity
              ══════════════════════════════════════════════════════════ */}
          <div
            style={{
              order: boxSide === 'left' ? 2 : 1,
              minHeight: '620px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              pointerEvents: 'none'
            }}
          >
            {/* Pure Empty Showcase Area where the shifted 3D BTS DNA freely spins */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsView;
