// =================================================================
// CarePoint Health System — Biometric Patient Health Tracker
// Interactive Biometric Charts · Heart Rate Pulse Curve · Vitals Logger
// =================================================================

import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Droplet,
  Scale,
  Wind,
  Plus,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { VitalMetric, VitalLogEntry } from '../../types';
import { MedicalDNA } from '../DNA';
import { MedicalNetworkBackground } from '../common/MedicalNetworkBackground';

interface PatientHealthTrackerProps {
  vitals: VitalMetric[];
  vitalLogs: VitalLogEntry[];
  onAddVitalLog: (entry: VitalLogEntry) => void;
}

export const PatientHealthTracker: React.FC<PatientHealthTrackerProps> = ({
  vitals,
  vitalLogs,
  onAddVitalLog
}) => {
  const [activeMetricId, setActiveMetricId] = useState<string>('hr');
  const [showLogModal, setShowLogModal] = useState(false);

  // New Log Entry State
  const [newHR, setNewHR] = useState(72);
  const [newSys, setNewSys] = useState(120);
  const [newDia, setNewDia] = useState(80);
  const [newGlucose, setNewGlucose] = useState(95);
  const [newO2, setNewO2] = useState(99);
  const [newWeight, setNewWeight] = useState(74.5);
  const [newNotes, setNewNotes] = useState('');

  const activeVital = vitals.find(v => v.id === activeMetricId) || vitals[0];

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: VitalLogEntry = {
      id: `vlog-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      heartRate: newHR,
      systolicBP: newSys,
      diastolicBP: newDia,
      bloodGlucose: newGlucose,
      oxygenSaturation: newO2,
      weightKg: newWeight,
      notes: newNotes || 'Routine manual reading.'
    };
    onAddVitalLog(entry);
    setShowLogModal(false);
  };

  return (
    <section style={{ padding: '48px 0 80px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Living Biometric Health Ecosystem Background */}
      <MedicalNetworkBackground
        variant="tracker"
        density="medium"
        opacity={0.28}
        interactive={true}
        style={{ zIndex: 0 }}
      />

      <div className="app-container-wide" style={{ position: 'relative', zIndex: 10 }}>
        {/* ── Section Header (Solid Opaque Banner Box) ────────────────── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid #DCD7CD',
            boxShadow: '0 12px 36px rgba(22, 74, 65, 0.09), 0 2px 8px rgba(22, 74, 65, 0.03)',
            padding: 'clamp(24px, 3.5vw, 36px)',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px',
            position: 'relative',
            zIndex: 30
          }}
        >
          <div>
            <span className="badge badge-forest" style={{ marginBottom: '10px' }}>
              Biometric Telemetry & Continuous Vitals
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#164A41', lineHeight: 1.15, margin: '0 0 6px 0' }}>
              Patient Health Tracker
            </h1>
            <p style={{ color: '#5F6E68', fontSize: '0.96rem', margin: 0 }}>
              Track cardiovascular rhythm, hemodynamics, blood glucose levels, and body composition in real time.
            </p>
          </div>

          <button onClick={() => setShowLogModal(true)} className="btn btn-accent">
            <Plus size={16} />
            <span>Record New Vitals</span>
          </button>
        </div>

        {/* ── Vital Metric Selection Cards ─────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          {vitals.map(v => {
            const isSelected = activeMetricId === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setActiveMetricId(v.id)}
                className="solid-card"
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  borderColor: isSelected ? '#164A41' : '#E5E0D6',
                  backgroundColor: isSelected ? '#FAF8F4' : '#FFFFFF',
                  boxShadow: isSelected ? '0 8px 24px -4px rgba(22, 74, 65, 0.12)' : 'var(--shadow-sm)',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#8A9993', fontWeight: 700, textTransform: 'uppercase' }}>
                    {v.name}
                  </span>
                  <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                    {v.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#164A41' }}>
                    {v.value}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#5F6E68', fontWeight: 600 }}>
                    {v.unit}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#5F6E68' }}>
                  Target: {v.normalRange}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Primary Interactive Telemetry Visualization ─────────── */}
        <div
          className="solid-card"
          style={{ padding: '32px', marginBottom: '36px' }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '28px',
              borderBottom: '1px solid #EFECE6',
              paddingBottom: '18px'
            }}
          >
            <div>
              <span className="badge badge-teal" style={{ marginBottom: '6px' }}>
                Telemetry Graph
              </span>
              <h3 style={{ fontSize: '1.4rem', color: '#164A41' }}>
                {activeVital.name} Trend Analysis
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '0.85rem', color: '#5F6E68' }}>
                Current Status: <strong style={{ color: '#2E7D52' }}>Optimal Clinical Bracket</strong>
              </span>
            </div>
          </div>

          {/* Dual Telemetry & 3D Molecular Showcase */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              alignItems: 'center'
            }}
          >
            {/* Left: SVG Telemetry Curve */}
            <div
              style={{
                backgroundColor: '#FAF8F4',
                border: '1px solid #E5E0D6',
                borderRadius: '16px',
                padding: '28px 20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#164A41' }}>
                  24-Hour Waveform Analysis
                </span>
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                  Continuous Sync
                </span>
              </div>

              <svg
                viewBox="0 0 700 180"
                style={{ width: '100%', height: 'auto', overflow: 'visible' }}
              >
                {/* Grid Lines */}
                <line x1="0" y1="30" x2="700" y2="30" stroke="#E5E0D6" strokeDasharray="4 4" />
                <line x1="0" y1="80" x2="700" y2="80" stroke="#E5E0D6" strokeDasharray="4 4" />
                <line x1="0" y1="130" x2="700" y2="130" stroke="#E5E0D6" strokeDasharray="4 4" />

                {/* Shaded Area */}
                <polygon
                  points="50,130 50,110 180,85 320,95 460,70 600,80 600,160 50,160"
                  fill="rgba(47, 125, 109, 0.12)"
                />

                {/* Main Line Curve */}
                <polyline
                  points="50,110 180,85 320,95 460,70 600,80"
                  fill="none"
                  stroke="#164A41"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {[
                  { x: 50, y: 110, val: '68' },
                  { x: 180, y: 85, val: '74' },
                  { x: 320, y: 95, val: '78' },
                  { x: 460, y: 70, val: '71' },
                  { x: 600, y: 80, val: '72' }
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="6" fill="#E8795B" stroke="#FFFFFF" strokeWidth="2.5" />
                    <text x={pt.x} y={pt.y - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#164A41">
                      {pt.val}
                    </text>
                  </g>
                ))}
              </svg>

              {/* X-axis labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 30px', marginTop: '12px', fontSize: '0.78rem', color: '#8A9993', fontWeight: 600 }}>
                <span>08:00 AM</span>
                <span>11:00 AM</span>
                <span>02:00 PM</span>
                <span>05:00 PM</span>
                <span>08:00 PM</span>
              </div>
            </div>

            {/* Right: 3D Biomarker Molecular DNA Visualizer */}
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                height: '280px',
                position: 'relative'
              }}
            >
              <MedicalDNA
                variant="tracker"
                interactive={true}
                quality="auto"
                showControls={false}
                showLegend={false}
                style={{ height: '100%', minHeight: '280px' }}
              />
            </div>
          </div>
        </div>

        {/* ── Vital Logs History Table ─────────────────────────────── */}
        <div className="solid-card" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#164A41', marginBottom: '20px' }}>
            Biometric Log History
          </h3>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Heart Rate</th>
                  <th>Blood Pressure</th>
                  <th>Blood Glucose</th>
                  <th>SpO2</th>
                  <th>Weight</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {vitalLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {log.date} · {log.time}
                    </td>
                    <td style={{ fontWeight: 700, color: '#164A41' }}>
                      {log.heartRate} BPM
                    </td>
                    <td style={{ fontWeight: 700, color: '#2F7D6D' }}>
                      {log.systolicBP}/{log.diastolicBP} mmHg
                    </td>
                    <td>{log.bloodGlucose} mg/dL</td>
                    <td>
                      <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                        {log.oxygenSaturation}%
                      </span>
                    </td>
                    <td>{log.weightKg} kg</td>
                    <td style={{ color: '#5F6E68', fontSize: '0.82rem' }}>
                      {log.notes || 'Routine check'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Log New Vitals Modal ─────────────────────────────────── */}
        {showLogModal && (
          <div className="modal-backdrop" onClick={() => setShowLogModal(false)}>
            <div
              className="modal-dialog"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="badge badge-forest" style={{ marginBottom: '4px' }}>
                    New Entry
                  </span>
                  <h3 style={{ fontSize: '1.35rem', color: '#164A41' }}>
                    Record Biometric Readings
                  </h3>
                </div>
                <button
                  onClick={() => setShowLogModal(false)}
                  style={{ background: 'none', border: 'none', color: '#5F6E68', cursor: 'pointer', padding: '6px' }}
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSaveLog}>
                <div className="modal-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Heart Rate (BPM):</label>
                      <input
                        type="number"
                        value={newHR}
                        onChange={e => setNewHR(parseInt(e.target.value) || 72)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Oxygen Saturation (%):</label>
                      <input
                        type="number"
                        value={newO2}
                        onChange={e => setNewO2(parseInt(e.target.value) || 99)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Systolic BP (mmHg):</label>
                      <input
                        type="number"
                        value={newSys}
                        onChange={e => setNewSys(parseInt(e.target.value) || 120)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Diastolic BP (mmHg):</label>
                      <input
                        type="number"
                        value={newDia}
                        onChange={e => setNewDia(parseInt(e.target.value) || 80)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Blood Glucose (mg/dL):</label>
                      <input
                        type="number"
                        value={newGlucose}
                        onChange={e => setNewGlucose(parseInt(e.target.value) || 95)}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Weight (kg):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newWeight}
                        onChange={e => setNewWeight(parseFloat(e.target.value) || 70)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Observation Notes:</label>
                    <textarea
                      placeholder="e.g. Measured after morning rest. Feeling well."
                      value={newNotes}
                      onChange={e => setNewNotes(e.target.value)}
                      className="form-textarea"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => setShowLogModal(false)} className="btn btn-outline">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <CheckCircle2 size={16} />
                    <span>Save Vitals Entry</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
