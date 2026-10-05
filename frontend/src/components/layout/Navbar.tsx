// =================================================================
// CarePoint Health Management System — Editorial Navigation Bar
// Multi-User Auth · Google Identity Integration · Responsive Drawer
// =================================================================

import React, { useState } from 'react';
import {
  HeartPulse,
  Calendar,
  UserCheck,
  Stethoscope,
  Activity,
  Menu,
  X,
  PhoneCall,
  Pill,
  ClipboardList,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  MessageCircle,
  User,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { NavigationView, AuthUser } from '../../types';

interface NavbarProps {
  currentView: NavigationView;
  currentUser: AuthUser | null;
  onNavigate: (view: NavigationView) => void;
  onOpenBooking: () => void;
  onOpenAuth: (mode?: 'patient' | 'staff') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  currentUser,
  onNavigate,
  onOpenBooking,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { id: NavigationView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <HeartPulse size={16} /> },
    { id: 'treatments', label: 'Treatments', icon: <Stethoscope size={16} /> },
    { id: 'doctors', label: 'Doctors', icon: <UserCheck size={16} /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={16} /> },
    { id: 'assessment', label: 'Health Assessment', icon: <ClipboardList size={16} /> },
    { id: 'tracker', label: 'Health Tracker', icon: <Activity size={16} /> },
    { id: 'pharmacy', label: 'Pharmacy', icon: <Pill size={16} /> },
    { id: 'chatbot', label: 'CareGuide', icon: <MessageCircle size={16} /> },
    { id: 'patient-profile', label: 'Patient Portal', icon: <UserCheck size={16} /> }
  ];

  const handleNavClick = (view: NavigationView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Top Announcement & Emergency Triage Strip ────────────── */}
      <div
        style={{
          backgroundColor: '#164A41',
          color: '#FFFFFF',
          fontSize: '0.8rem',
          fontWeight: 500,
          padding: '7px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <div
          className="app-container-wide"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(232, 121, 91, 0.25)',
                color: '#F29379',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
            >
              24/7 Clinical Emergency
            </span>
            <span style={{ opacity: 0.9 }}>Emergency Triage & Trauma Desk:</span>
            <a
              href="tel:18004523200"
              style={{
                color: '#FFFFFF',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <PhoneCall size={12} color="#E8795B" /> +1 (800) 452-CARE
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ opacity: 0.85, fontSize: '0.75rem' }}>
              Telehealth Consultations & In-Clinic Open
            </span>
            <button
              onClick={() => onOpenAuth('staff')}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '2px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Staff Portal Access →
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Sticky Header ───────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 900,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E0D6',
          boxShadow: '0 2px 12px rgba(22, 74, 65, 0.04)'
        }}
      >
        <div
          className="app-container-wide"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px',
            gap: '16px'
          }}
        >
          {/* Logo / Brand */}
          <div
            onClick={() => handleNavClick('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#164A41',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(22, 74, 65, 0.25)'
              }}
            >
              <HeartPulse size={24} color="#FFFFFF" strokeWidth={2.2} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.28rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#164A41',
                  lineHeight: 1.1
                }}
              >
                CarePoint<span style={{ color: '#E8795B' }}>.</span>
              </div>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#5F6E68'
                }}
              >
                Health System
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#FAF8F4',
              padding: '4px 6px',
              borderRadius: '9999px',
              border: '1px solid #E5E0D6'
            }}
            className="desktop-nav"
          >
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#164A41' : '#5F6E68',
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    border: isActive ? '1px solid #E5E0D6' : '1px solid transparent',
                    boxShadow: isActive ? '0 2px 6px rgba(22,74,65,0.06)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease'
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs & Auth Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onOpenBooking}
              className="btn btn-accent"
              style={{ display: 'none' }}
              id="desktop-book-btn"
            >
              <Calendar size={16} />
              <span>Book Appointment</span>
            </button>

            {/* Authenticated User Pill vs. Sign In Button */}
            {currentUser ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#FAF8F4',
                    border: '1px solid #164A41',
                    borderRadius: '9999px',
                    padding: '4px 12px 4px 6px',
                    cursor: 'pointer'
                  }}
                  id="desktop-user-btn"
                >
                  {currentUser.picture ? (
                    <img
                      src={currentUser.picture}
                      alt={currentUser.name || 'User'}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#164A41',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.78rem',
                        fontWeight: 800
                      }}
                    >
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}

                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#164A41', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.name?.split(' ')[0] || 'My Profile'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '115%',
                      right: 0,
                      width: '240px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E5E0D6',
                      boxShadow: '0 12px 32px rgba(22, 74, 65, 0.12)',
                      padding: '8px',
                      zIndex: 1000
                    }}
                  >
                    <div style={{ padding: '10px 12px', borderBottom: '1px solid #EFECE6' }}>
                      <div style={{ fontWeight: 800, color: '#164A41', fontSize: '0.88rem' }}>
                        {currentUser.name || currentUser.Username}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#5F6E68', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentUser.Email}
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavClick('patient-profile')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'transparent',
                        borderRadius: '10px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: '#164A41',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAF8F4')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <User size={15} />
                      <span>View Health Profile</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('appointments')}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        border: 'none',
                        background: 'transparent',
                        borderRadius: '10px',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        color: '#164A41',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAF8F4')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Calendar size={15} />
                      <span>My Appointments</span>
                    </button>

                    {currentUser.Role === 'Admin' || currentUser.Role === 'Staff' || currentUser.Role === 'Doctor' ? (
                      <button
                        onClick={() => handleNavClick('staff')}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          border: 'none',
                          background: 'transparent',
                          borderRadius: '10px',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          color: '#2F7D6D',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FAF8F4')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <ShieldCheck size={15} />
                        <span>Operations Center</span>
                      </button>
                    ) : null}

                    <div style={{ borderTop: '1px solid #EFECE6', marginTop: '4px', paddingTop: '4px' }}>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 12px',
                          border: 'none',
                          background: 'transparent',
                          borderRadius: '10px',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          color: '#C0392B',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('patient')}
                className="btn btn-outline btn-sm"
                style={{ display: 'none' }}
                id="desktop-signin-btn"
              >
                <User size={15} />
                <span>Sign In / Google</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#FAF8F4',
                border: '1px solid #E5E0D6',
                color: '#164A41',
                cursor: 'pointer'
              }}
              className="mobile-hamburger"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Slide-Out Drawer Navigation ──────────────────── */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(23, 32, 29, 0.6)',
            display: 'flex',
            justifyContent: 'flex-end',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '85%',
              maxWidth: '360px',
              height: '100%',
              backgroundColor: '#FFFFFF',
              borderLeft: '1px solid #E5E0D6',
              boxShadow: '-8px 0 32px rgba(22, 74, 65, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '18px',
                  borderBottom: '1px solid #EFECE6',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: '#164A41',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <HeartPulse size={20} color="#FFFFFF" />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#164A41' }}>
                    CarePoint
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#5F6E68',
                    cursor: 'pointer',
                    padding: '6px'
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Logged in User Summary in Drawer */}
              {currentUser ? (
                <div
                  style={{
                    backgroundColor: '#FAF8F4',
                    border: '1px solid #E5E0D6',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: '#164A41',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                        fontWeight: 800
                      }}
                    >
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#164A41' }}>
                        {currentUser.name || currentUser.Username}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#5F6E68' }}>
                        {currentUser.Email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    style={{ background: 'none', border: 'none', color: '#C0392B', cursor: 'pointer' }}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('patient');
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', marginBottom: '16px' }}
                >
                  <User size={15} />
                  <span>Sign In / Continue with Google</span>
                </button>
              )}

              {/* Navigation Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {navItems.map(item => {
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        fontSize: '0.95rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#164A41' : '#323F3B',
                        backgroundColor: isActive ? '#E7F3F0' : 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: isActive ? '#164A41' : '#5F6E68' }}>{item.icon}</span>
                        {item.label}
                      </span>
                      {isActive && <ArrowRight size={16} color="#164A41" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div
              style={{
                borderTop: '1px solid #EFECE6',
                paddingTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="btn btn-accent"
                style={{ width: '100%' }}
              >
                <Calendar size={16} />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('staff');
                }}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                <span>Hospital Staff Operations →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for responsive breakpoint toggles */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          #desktop-book-btn { display: inline-flex !important; }
          #desktop-signin-btn { display: inline-flex !important; }
          #desktop-user-btn { display: inline-flex !important; }
          .mobile-hamburger { display: none !important; }
        }
      `}</style>
    </>
  );
};
