// =================================================================
// CarePoint Health System — Editorial Healthcare Footer
// Solid Surfaces · Clinical Accreditation · Emergency Desk
// =================================================================

import React from 'react';
import {
  HeartPulse,
  ShieldCheck,
  Award,
  Clock,
  PhoneCall,
  MapPin,
  Mail,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { NavigationView } from '../../types';

interface FooterProps {
  onNavigate: (view: NavigationView) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <footer
      style={{
        backgroundColor: '#164A41',
        color: '#FFFFFF',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: '80px',
        paddingTop: '64px',
        paddingBottom: '32px'
      }}
    >
      <div className="app-container-wide">
        {/* ── Top Accreditation Banner ────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '18px',
            padding: '24px 28px',
            marginBottom: '56px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(232, 121, 91, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Award size={22} color="#E8795B" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>JCI Gold Seal</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                International Quality Accreditation
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(47, 125, 109, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={22} color="#449B89" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>HIPAA & GDPR</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                End-to-end Encrypted Clinical Data
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(232, 121, 91, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Clock size={22} color="#E8795B" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>24/7 Rapid Response</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Zero-wait Emergency Triage Desk
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Footer Columns ─────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '56px'
          }}
        >
          {/* Col 1: Brand & Philosophy */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <HeartPulse size={22} color="#164A41" />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                CarePoint<span style={{ color: '#E8795B' }}>.</span>
              </span>
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.75)',
                marginBottom: '20px'
              }}
            >
              A next-generation healthcare institution dedicated to proactive biometric medicine, surgical precision, and compassionate patient care.
            </p>
            <button onClick={onOpenBooking} className="btn btn-accent btn-sm">
              <span>Book a Consultation</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Col 2: Clinical Specialties */}
          <div>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#E8795B',
                marginBottom: '18px'
              }}
            >
              Clinical Departments
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button
                  onClick={() => onNavigate('treatments')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Cardiology & Vascular Sciences
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('treatments')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Neurology & Brain Sciences
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('treatments')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Orthopedics & Joint Replacement
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('treatments')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Pediatrics & Neonatal Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('treatments')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  General Internal Medicine
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Patient Services */}
          <div>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#E8795B',
                marginBottom: '18px'
              }}
            >
              Patient Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button
                  onClick={() => onNavigate('doctors')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Find a Specialist Doctor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('appointments')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Online & In-Clinic Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('assessment')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Interactive Health Assessment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tracker')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Personal Vitals Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pharmacy')}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
                >
                  Digital Pharmacy & Dispenser
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus & Emergency Contact */}
          <div>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#E8795B',
                marginBottom: '18px'
              }}
            >
              Main Campus & Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="#E8795B" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>450 Healthcare Boulevard, Medical District, Suite 100</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PhoneCall size={18} color="#E8795B" style={{ flexShrink: 0 }} />
                <span>Emergency: +1 (800) 452-CARE</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#E8795B" style={{ flexShrink: 0 }} />
                <span>care@carepoint.health</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Copyright & Medical Disclaimer ──────────────── */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.78rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}
        >
          <div>
            © {new Date().getFullYear()} CarePoint Health System Inc. All clinical rights reserved.
          </div>
          <div style={{ maxWidth: '600px', textAlign: 'right' }}>
            Medical Notice: The information provided on this platform is for healthcare coordination and diagnostic triage assistance. Always consult with a licensed physician for acute medical conditions.
          </div>
        </div>
      </div>
    </footer>
  );
};
