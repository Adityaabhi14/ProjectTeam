// =================================================================
// CarePoint Health System — Editorial Hero Section
// Editorial Typography · Master 3D DNA Integration · Live Clinical Hub
// =================================================================

import React from 'react';
import {
  Calendar,
  Stethoscope,
  Activity,
  ArrowRight,
  ShieldCheck,
  Video,
  Clock,
  ClipboardList,
  Pill,
  Users,
  CheckCircle2,
  Heart,
  Dna,
  Sparkles
} from 'lucide-react';
import { NavigationView } from '../../types';

interface HeroSectionProps {
  onNavigate: (view: NavigationView) => void;
  onOpenBooking: () => void;
  doctorCount: number;
  departmentCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onOpenBooking,
  doctorCount,
  departmentCount
}) => {
  return (
    <section style={{ paddingTop: 'clamp(28px, 5vw, 64px)', paddingBottom: '48px', position: 'relative' }}>
      <div className="app-container-wide" style={{ position: 'relative', zIndex: 10 }}>
        {/* ── Main Editorial Hero Grid ────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(24px, 5vw, 60px)',
            alignItems: 'center',
            marginBottom: '64px'
          }}
        >
          {/* Left Column: Editorial Headline & Actions */}
          <div>
            {/* Trust Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #E5E0D6',
                borderRadius: '9999px',
                padding: '6px 14px',
                marginBottom: '24px',
                boxShadow: '0 1px 4px rgba(22, 74, 65, 0.04)'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#2E7D52',
                  display: 'inline-block'
                }}
              />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#164A41' }}>
                Next-Generation Healthcare Platform
              </span>
              <span style={{ fontSize: '0.82rem', color: '#8A9993' }}>·</span>
              <span style={{ fontSize: '0.82rem', color: '#5F6E68' }}>ISO Certified</span>
            </div>

            {/* Editorial Title */}
            <h1
              className="display-title"
              style={{
                fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)',
                marginBottom: '20px',
                lineHeight: 1.06
              }}
            >
              Healthcare, <br />
              <em>designed around you.</em>
            </h1>

            {/* Supporting Copy */}
            <p
              style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
                color: '#5F6E68',
                lineHeight: 1.6,
                maxWidth: '540px',
                marginBottom: '36px'
              }}
            >
              Connect with world-class specialists, understand your personal biometric health, schedule seamless online or in-clinic visits, and manage your medical records in one trusted environment.
            </p>

            {/* Main Action CTAs */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '40px'
              }}
            >
              <button
                onClick={onOpenBooking}
                className="btn btn-accent btn-lg"
                style={{
                  boxShadow: '0 4px 18px rgba(232, 121, 91, 0.35)'
                }}
              >
                <Calendar size={18} />
                <span>Book an Appointment</span>
              </button>

              <button
                onClick={() => onNavigate('doctors')}
                className="btn btn-outline btn-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
              >
                <Stethoscope size={18} color="#164A41" />
                <span>Find a Doctor</span>
              </button>

              <button
                onClick={() => onNavigate('assessment')}
                className="btn btn-secondary btn-lg"
              >
                <ClipboardList size={18} />
                <span>Health Triage</span>
              </button>
            </div>

            {/* Feature Checkpoints */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(229, 224, 214, 0.8)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#323F3B' }}>
                <CheckCircle2 size={16} color="#164A41" />
                <span>Online & Offline Care</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#323F3B' }}>
                <CheckCircle2 size={16} color="#164A41" />
                <span>Verified Specialist MDs</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: '#323F3B' }}>
                <CheckCircle2 size={16} color="#164A41" />
                <span>Instant Digital Prescriptions</span>
              </div>
            </div>
          </div>

          {/* Right Column: Open visual space for the Large Background 3D DNA */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '420px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* ── Key Operational Metrics Ribbon ──────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '64px'
          }}
        >
          <div
            className="solid-card"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#8A9993', letterSpacing: '0.05em' }}>
              Specialist Physicians
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#164A41', lineHeight: 1 }}>
              {doctorCount || 45}+
            </div>
            <div style={{ fontSize: '0.82rem', color: '#5F6E68' }}>
              Board-certified practitioners across 15+ subspecialties
            </div>
          </div>

          <div
            className="solid-card"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#8A9993', letterSpacing: '0.05em' }}>
              Clinical Departments
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#164A41', lineHeight: 1 }}>
              {departmentCount || 15}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#5F6E68' }}>
              From Cardiology & Neurology to Pediatric ICU
            </div>
          </div>

          <div
            className="solid-card"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#8A9993', letterSpacing: '0.05em' }}>
              Clinical Satisfaction
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#164A41', lineHeight: 1 }}>
              99.4%
            </div>
            <div style={{ fontSize: '0.82rem', color: '#5F6E68' }}>
              Rated by over 12,000 verified treated patients
            </div>
          </div>

          <div
            className="solid-card"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#8A9993', letterSpacing: '0.05em' }}>
              Telehealth Ready
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#E8795B', lineHeight: 1 }}>
              24/7
            </div>
            <div style={{ fontSize: '0.82rem', color: '#5F6E68' }}>
              Encrypted HD video consults with digital prescriptions
            </div>
          </div>
        </div>

        {/* ── Key Healthcare Pillars ───────────────────────────────── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
            <span className="badge badge-teal" style={{ marginBottom: '10px' }}>
              Integrated Patient Care
            </span>
            <h2 style={{ fontSize: '2.1rem', color: '#164A41', marginBottom: '12px' }}>
              A connected continuum of clinical care
            </h2>
            <p style={{ color: '#5F6E68', fontSize: '0.95rem' }}>
              Experience frictionless healthcare with unified patient records, instant consultations, and continuous biomarker monitoring.
            </p>
          </div>

          <div className="grid-cols-4">
            {/* Card 1 */}
            <div
              className="solid-card-interactive"
              style={{ padding: '28px' }}
              onClick={() => onNavigate('appointments')}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: '#E7F3F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Video size={24} color="#164A41" />
              </div>
              <h3 style={{ fontSize: '1.18rem', marginBottom: '8px', color: '#17201D' }}>
                Online & In-Clinic Booking
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#5F6E68', lineHeight: 1.5, marginBottom: '16px' }}>
                Select your preferred doctor, time slot, and consultation mode with real-time slot synchronization.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#164A41' }}>
                <span>Schedule Visit</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 2 */}
            <div
              className="solid-card-interactive"
              style={{ padding: '28px' }}
              onClick={() => onNavigate('assessment')}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: '#FDF1EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <ClipboardList size={24} color="#E8795B" />
              </div>
              <h3 style={{ fontSize: '1.18rem', marginBottom: '8px', color: '#17201D' }}>
                Health Assessment
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#5F6E68', lineHeight: 1.5, marginBottom: '16px' }}>
                Answer clinically structured symptom questions to receive structured next-step guidance and specialist matching.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#E8795B' }}>
                <span>Start Assessment</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 3 */}
            <div
              className="solid-card-interactive"
              style={{ padding: '28px' }}
              onClick={() => onNavigate('tracker')}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: '#E8F5F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Activity size={24} color="#2F7D6D" />
              </div>
              <h3 style={{ fontSize: '1.18rem', marginBottom: '8px', color: '#17201D' }}>
                Biometric Health Tracker
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#5F6E68', lineHeight: 1.5, marginBottom: '16px' }}>
                Visualize heart rate curves, blood pressure trends, glucose logs, and oxygen saturation over time.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#2F7D6D' }}>
                <span>View Health Metrics</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Card 4 */}
            <div
              className="solid-card-interactive"
              style={{ padding: '28px' }}
              onClick={() => onNavigate('pharmacy')}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  backgroundColor: '#FAF8F4',
                  border: '1px solid #E5E0D6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Pill size={24} color="#164A41" />
              </div>
              <h3 style={{ fontSize: '1.18rem', marginBottom: '8px', color: '#17201D' }}>
                Digital Pharmacy & Rx
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#5F6E68', lineHeight: 1.5, marginBottom: '16px' }}>
                Access doctor-prescribed therapeutics, stock availability, dosage guidelines, and express doorstep delivery.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#164A41' }}>
                <span>Explore Medicines</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
