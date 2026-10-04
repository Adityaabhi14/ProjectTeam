// =================================================================
// CarePoint Health System — Staff Operations Center Auth Modal
// Secure Staff & Administrator Login Portal
// =================================================================

import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Key, X, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

interface StaffAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const StaffAuthModal: React.FC<StaffAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await api.login(username, password);
      if (res.success) {
        onLoginSuccess();
        onClose();
      } else {
        setErrorMsg(res.message || 'Authentication failed. Please check credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with authentication service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#164A41',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={20} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#164A41' }}>
                Operations Center
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#5F6E68' }}>
                Hospital Staff & Doctor Authentication
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#5F6E68', cursor: 'pointer', padding: '6px' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#FDF0F0',
                  border: '1px solid rgba(192, 67, 67, 0.3)',
                  color: '#C04343',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Staff Username:</label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  color="#8A9993"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="admin or staff"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Passcode / Key:</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="#8A9993"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#FAF8F4',
                border: '1px solid #E5E0D6',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '0.78rem',
                color: '#5F6E68',
                marginTop: '12px'
              }}
            >
              Demo credentials: <strong style={{ color: '#164A41' }}>admin</strong> / <strong style={{ color: '#164A41' }}>admin123</strong>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-primary">
              {isLoading ? <span>Authenticating...</span> : <span>Enter Operations Center →</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
