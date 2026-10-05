// =================================================================
// CarePoint Health Management System — Authentication Service
// Multi-Provider Auth · Google OAuth 2.0 · Patient & Staff Sessions
// =================================================================

import { AuthUser, Patient } from '../types';
import { getStoredData, saveStoredData } from './storage';

const USER_STORAGE_KEY = 'carepoint_auth_user';
const TOKEN_STORAGE_KEY = 'carepoint_auth_token';
const API_BASE = '/api';

export const authService = {
  // Get current logged-in user from localStorage
  getCurrentUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  },

  // Save auth session
  saveSession(user: AuthUser, token?: string): void {
    try {
      if (token) {
        user.token = token;
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save auth session:', e);
    }
  },

  // Clear session / Log out
  logout(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    try {
      fetch(`${API_BASE}/auth/logout`, { method: 'POST' }).catch(() => {});
    } catch {}
  },

  // Initiate Google OAuth redirect
  loginWithGoogle(): void {
    window.location.href = `${API_BASE}/auth/google`;
  },

  // Patient / User login with Email & Password
  async loginWithEmail(email: string, password: string): Promise<{ success: boolean; message?: string; user?: AuthUser }> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Backend API
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: cleanEmail, Password: password })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.user) {
          const authUser: AuthUser = {
            ...json.user,
            token: json.token,
            provider: 'local'
          };
          this.saveSession(authUser, json.token);
          return { success: true, user: authUser };
        }
      }
    } catch (err) {
      console.warn('Backend login unavailable, checking offline demo accounts:', err);
    }

    // 2. Demo / Fallback logic
    if (cleanEmail === 'david.harrison@email.com' || cleanEmail === 'patient' || cleanEmail === 'demo') {
      const demoUser: AuthUser = this.getDemoPatientUser();
      this.saveSession(demoUser, 'demo-patient-token');
      return { success: true, user: demoUser };
    }

    if (cleanEmail === 'admin' && password === 'admin123') {
      const adminUser: AuthUser = {
        UserID: 1,
        Username: 'admin',
        Email: 'admin@carepoint.health',
        Role: 'Admin',
        name: 'Clinical Operations Admin',
        provider: 'local',
        token: 'demo-admin-token'
      };
      this.saveSession(adminUser, 'demo-admin-token');
      return { success: true, user: adminUser };
    }

    return {
      success: false,
      message: 'Invalid credentials. Please verify your email and password or use Google Sign-in.'
    };
  },

  // Patient Registration
  async registerPatient(formData: {
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
    Phone?: string;
    DOB?: string;
    Gender?: 'Male' | 'Female' | 'Other';
    BloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    Address?: string;
  }): Promise<{ success: boolean; message?: string; user?: AuthUser }> {
    const cleanEmail = formData.Email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          Username: cleanEmail,
          Email: cleanEmail,
          Role: 'Patient'
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.user) {
          const authUser: AuthUser = {
            ...json.user,
            token: json.token,
            provider: 'local'
          };
          this.saveSession(authUser, json.token);
          return { success: true, user: authUser };
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        return { success: false, message: errJson.message || 'Registration failed.' };
      }
    } catch (err) {
      console.warn('Backend register offline, creating local profile:', err);
    }

    // Local storage fallback for registration
    const data = getStoredData();
    const newPatient: Patient = {
      PatientID: data.patient.length + 1,
      FirstName: formData.FirstName,
      LastName: formData.LastName,
      Email: cleanEmail,
      Phone: formData.Phone || '+91 9876543210',
      DOB: formData.DOB || '1995-01-01',
      Gender: formData.Gender || 'Other',
      BloodGroup: formData.BloodGroup || 'O+',
      Address: formData.Address || '',
      RegistrationDate: new Date().toISOString().slice(0, 10)
    };
    data.patient.unshift(newPatient);
    saveStoredData(data);

    const localUser: AuthUser = {
      UserID: 100 + newPatient.PatientID,
      Username: cleanEmail,
      Email: cleanEmail,
      Role: 'Patient',
      PatientID: newPatient.PatientID,
      name: `${formData.FirstName} ${formData.LastName}`.trim(),
      provider: 'local',
      token: 'local-token',
      patientDetails: newPatient
    };

    this.saveSession(localUser, 'local-token');
    return { success: true, user: localUser };
  },

  // Demo Patient Access
  loginDemoPatient(): AuthUser {
    const user = this.getDemoPatientUser();
    this.saveSession(user, 'demo-patient-token');
    return user;
  },

  getDemoPatientUser(): AuthUser {
    const data = getStoredData();
    const patient = data.patient[0] || {
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

    return {
      UserID: 101,
      Username: patient.Email || 'david.harrison@email.com',
      Email: patient.Email || 'david.harrison@email.com',
      Role: 'Patient',
      PatientID: patient.PatientID || 1,
      name: `${patient.FirstName} ${patient.LastName || ''}`.trim(),
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      provider: 'demo',
      patientDetails: patient,
      token: 'demo-patient-token'
    };
  },

  // Update Profile
  async updateProfile(updates: Partial<Patient>): Promise<{ success: boolean; updatedPatient?: Patient; message?: string }> {
    const currentUser = this.getCurrentUser();
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    // 1. Try Backend update
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updates)
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            if (currentUser) {
              currentUser.patientDetails = json.data;
              currentUser.name = `${json.data.FirstName} ${json.data.LastName || ''}`.trim();
              this.saveSession(currentUser);
            }
            return { success: true, updatedPatient: json.data };
          }
        }
      } catch (e) {
        console.warn('Backend updateProfile failed, updating local storage:', e);
      }
    }

    // 2. Local storage update
    const data = getStoredData();
    const pIdx = data.patient.findIndex(p => p.PatientID === currentUser?.PatientID);
    if (pIdx >= 0) {
      data.patient[pIdx] = { ...data.patient[pIdx], ...updates };
      saveStoredData(data);
      if (currentUser) {
        currentUser.patientDetails = data.patient[pIdx];
        currentUser.name = `${data.patient[pIdx].FirstName} ${data.patient[pIdx].LastName || ''}`.trim();
        this.saveSession(currentUser);
      }
      return { success: true, updatedPatient: data.patient[pIdx] };
    }

    return { success: true };
  },

  // Parse Google OAuth redirect URL params
  handleOAuthRedirect(): { authenticated: boolean; user?: AuthUser; error?: string } {
    if (typeof window === 'undefined') return { authenticated: false };

    const params = new URLSearchParams(window.location.search);
    const token = params.get('auth_token');
    const userJson = params.get('auth_user');
    const authError = params.get('auth_error');

    if (authError) {
      // Clean query params from URL
      window.history.replaceState({}, document.title, window.location.pathname + (window.location.hash || ''));
      return { authenticated: false, error: authError };
    }

    if (token && userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson)) as AuthUser;
        this.saveSession(user, token);

        // Clean query params from URL
        window.history.replaceState({}, document.title, window.location.pathname + (window.location.hash || ''));
        return { authenticated: true, user };
      } catch (err) {
        console.error('Failed to parse OAuth redirect payload:', err);
      }
    }

    return { authenticated: false };
  }
};
