// =================================================================
// CarePoint Health System — Treatment Categories Section
// Solid Opaque Design · 100% Heading & Text Readability
// All headings, filters & cards encased in solid opaque surfaces
// =================================================================

import React, { useState, useMemo } from 'react';
import {
  HeartPulse,
  Brain,
  Bone,
  Baby,
  Sparkles,
  Stethoscope,
  Eye,
  Smile,
  ArrowRight,
  UserCheck,
  Search,
  Calendar,
  X
} from 'lucide-react';
import { Department, Doctor } from '../../types';

interface TreatmentCategoriesProps {
  departments: Department[];
  doctors: Doctor[];
  onSelectDepartment: (deptName: string) => void;
  onOpenBookingWithDept: (deptId: number) => void;
}

export const TreatmentCategories: React.FC<TreatmentCategoriesProps> = ({
  departments,
  doctors,
  onSelectDepartment,
  onOpenBookingWithDept
}) => {
  const [activeModalDept, setActiveModalDept] = useState<Department | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Department icon resolver
  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('cardio') || lower.includes('heart')) return <HeartPulse size={26} color="#164A41" />;
    if (lower.includes('neuro') || lower.includes('brain')) return <Brain size={26} color="#2F7D6D" />;
    if (lower.includes('ortho') || lower.includes('joint') || lower.includes('bone')) return <Bone size={26} color="#164A41" />;
    if (lower.includes('pediatric') || lower.includes('child') || lower.includes('baby')) return <Baby size={26} color="#E8795B" />;
    if (lower.includes('derma') || lower.includes('skin')) return <Sparkles size={26} color="#2F7D6D" />;
    if (lower.includes('eye') || lower.includes('ophthalm')) return <Eye size={26} color="#164A41" />;
    if (lower.includes('mental') || lower.includes('psycho')) return <Smile size={26} color="#E8795B" />;
    return <Stethoscope size={26} color="#164A41" />;
  };

  const getDeptDoctors = (deptId?: number) => {
    if (!deptId) return [];
    return doctors.filter(d => d.DepartmentID === deptId);
  };

  const filteredDepts = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return departments;
    return departments.filter(
      d =>
        d.DepartmentName.toLowerCase().includes(query) ||
        (d.Description && d.Description.toLowerCase().includes(query)) ||
        (d.Location && d.Location.toLowerCase().includes(query))
    );
  }, [departments, searchTerm]);

  return (
    <section style={{ padding: '40px 0 80px', position: 'relative', zIndex: 20 }}>
      <div className="app-container-wide">
        {/* ── 100% Solid Opaque Header & Search Banner Box ────────── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #DCD7CD',
            boxShadow: '0 12px 36px rgba(22, 74, 65, 0.09), 0 2px 8px rgba(22, 74, 65, 0.03)',
            padding: 'clamp(24px, 3.5vw, 36px)',
            marginBottom: '36px',
            position: 'relative',
            zIndex: 30
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '24px',
              marginBottom: '20px'
            }}
          >
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#E7F3F0',
                  color: '#164A41',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '10px'
                }}
              >
                ● Centers of Clinical Excellence
              </span>
              <h1
                style={{
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                  color: '#164A41',
                  margin: '0 0 8px 0',
                  lineHeight: 1.15
                }}
              >
                Clinical Specialties & Treatments
              </h1>
              <p style={{ maxWidth: '640px', color: '#5F6E68', fontSize: '0.94rem', margin: 0, lineHeight: 1.55 }}>
                Our integrated medical departments deliver multidisciplinary clinical care with cutting-edge diagnostics, advanced robotic surgeries, and board-certified medical faculty.
              </p>
            </div>

            {/* Quick Search Input */}
            <div style={{ position: 'relative', minWidth: '260px', flex: '1 1 260px', maxWidth: '340px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A9993' }}
              />
              <input
                type="text"
                placeholder="Search specialties or treatments..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  fontSize: '0.88rem',
                  backgroundColor: '#FAF8F4',
                  border: '1px solid #D1C9BC',
                  borderRadius: '12px',
                  outline: 'none',
                  color: '#17201D'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
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
          </div>

          {/* Quick Stats Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #EFECE6',
              fontSize: '0.82rem',
              color: '#5F6E68'
            }}
          >
            <span>
              Showing <strong style={{ color: '#164A41' }}>{filteredDepts.length}</strong> Medical Departments
            </span>
            <span>•</span>
            <span>
              <strong style={{ color: '#164A41' }}>{doctors.length}</strong> Registered Medical Faculty
            </span>
            <span>•</span>
            <span style={{ color: '#2E7D52', fontWeight: 700 }}>
              ✓ 24/7 Emergency & In-Patient Surgical Units Available
            </span>
          </div>
        </div>

        {/* ── Treatment Cards Grid (100% Solid Opaque Cards) ────────── */}
        <div className="grid-cols-4">
          {filteredDepts.map(dept => {
            const deptDoctors = getDeptDoctors(dept.DepartmentID);
            const docCount = deptDoctors.length || dept.DoctorCount || 2;

            return (
              <div
                key={dept.DepartmentID}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #DCD7CD',
                  boxShadow: '0 8px 24px rgba(22, 74, 65, 0.07)',
                  padding: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '290px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  position: 'relative',
                  zIndex: 25
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 14px 32px rgba(22, 74, 65, 0.13)';
                  e.currentTarget.style.borderColor = '#164A41';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(22, 74, 65, 0.07)';
                  e.currentTarget.style.borderColor = '#DCD7CD';
                }}
                onClick={() => setActiveModalDept(dept)}
              >
                <div>
                  {/* Top Icon & Doctor count badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '18px'
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '14px',
                        backgroundColor: '#FAF8F4',
                        border: '1px solid #E5E0D6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {getIcon(dept.DepartmentName)}
                    </div>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#F0F7F5',
                        color: '#164A41',
                        border: '1px solid rgba(22, 74, 65, 0.15)',
                        padding: '3px 9px',
                        borderRadius: '9999px',
                        fontSize: '0.74rem',
                        fontWeight: 700
                      }}
                    >
                      <UserCheck size={12} />
                      {docCount} {docCount === 1 ? 'Specialist' : 'Specialists'}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.2rem',
                      color: '#17201D',
                      marginBottom: '10px',
                      lineHeight: 1.3,
                      fontWeight: 800
                    }}
                  >
                    {dept.DepartmentName}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: '#5F6E68',
                      lineHeight: 1.55,
                      marginBottom: '18px'
                    }}
                  >
                    {dept.Description || 'Full-spectrum diagnostic evaluations, therapeutic treatments, and post-procedure recovery support.'}
                  </p>
                </div>

                {/* Card Bottom: Location & Action */}
                <div
                  style={{
                    paddingTop: '16px',
                    borderTop: '1px solid #EFECE6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: '#8A9993', fontWeight: 600 }}>
                    {dept.Location || 'Main Pavilion'}
                  </span>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#164A41'
                    }}
                  >
                    Details <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Treatment Department Detail Modal ────────────────────── */}
        {activeModalDept && (
          <div className="modal-backdrop" onClick={() => setActiveModalDept(null)}>
            <div
              className="modal-dialog modal-dialog-wide"
              style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', zIndex: 1000 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="modal-header" style={{ borderBottom: '1px solid #EFECE6', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: '#E7F3F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getIcon(activeModalDept.DepartmentName)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', color: '#164A41', margin: 0 }}>
                      {activeModalDept.DepartmentName}
                    </h3>
                    <span style={{ fontSize: '0.82rem', color: '#5F6E68' }}>
                      {activeModalDept.Location} · {activeModalDept.PhoneNo || 'Extension #104'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModalDept(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#5F6E68',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="modal-body" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#17201D', marginBottom: '8px' }}>
                    Clinical Department Overview
                  </h4>
                  <p style={{ color: '#323F3B', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {activeModalDept.Description}
                  </p>
                </div>

                {/* Available Doctors in Department */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#17201D', marginBottom: '14px' }}>
                    Board-Certified Department Specialists
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                    {getDeptDoctors(activeModalDept.DepartmentID).map(doc => (
                      <div
                        key={doc.DoctorID}
                        style={{
                          backgroundColor: '#FAF8F4',
                          border: '1px solid #E5E0D6',
                          borderRadius: '14px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#164A41' }}>
                            Dr. {doc.FirstName} {doc.LastName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#2F7D6D', fontWeight: 600, marginBottom: '6px' }}>
                            {doc.Specialization}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#5F6E68', marginBottom: '10px' }}>
                            {doc.Qualification} · {doc.ExperienceYears || 10}+ Yrs Experience
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #EFECE6' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#17201D' }}>
                            ${doc.ConsultationFee || 70} fee
                          </span>
                          <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                            Accepting Patients
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer" style={{ borderTop: '1px solid #EFECE6', padding: '20px 24px' }}>
                <button
                  onClick={() => {
                    const deptName = activeModalDept.DepartmentName;
                    setActiveModalDept(null);
                    onSelectDepartment(deptName);
                  }}
                  className="btn btn-outline"
                >
                  <UserCheck size={16} />
                  <span>View All Specialists</span>
                </button>

                <button
                  onClick={() => {
                    const deptId = activeModalDept.DepartmentID || 1;
                    setActiveModalDept(null);
                    onOpenBookingWithDept(deptId);
                  }}
                  className="btn btn-accent"
                >
                  <Calendar size={16} />
                  <span>Schedule Appointment Here</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TreatmentCategories;
