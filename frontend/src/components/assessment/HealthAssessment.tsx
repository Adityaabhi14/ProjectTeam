// =================================================================
// CarePoint Health System — Health Assessment & Diagnostic Support
// Solid Opaque Split Box Layout: 100% Text & Heading Readability
// All questionnaire steps & triage results strictly inside solid card
// 3D BTS DNA Helix rendered purely in dedicated empty space
// =================================================================

import React, { useState } from 'react';
import {
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Stethoscope,
  Activity,
  Heart,
  HelpCircle,
  Calendar,
  Sparkles,
  ArrowLeftRight,
  RotateCcw,
  Dna
} from 'lucide-react';
import { Doctor, AssessmentResult } from '../../types';

interface HealthAssessmentProps {
  doctors: Doctor[];
  onOpenBookingWithDoctor: (doctorId: number) => void;
  boxSide?: 'left' | 'right';
  onToggleBoxSide?: () => void;
}

export const HealthAssessment: React.FC<HealthAssessmentProps> = ({
  doctors,
  onOpenBookingWithDoctor,
  boxSide = 'left',
  onToggleBoxSide
}) => {
  const [step, setStep] = useState<number>(1);
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [chiefComplaint, setChiefComplaint] = useState('Cardiovascular / Chest Discomfort');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [durationDays, setDurationDays] = useState<number>(3);
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [stressLevel, setStressLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const symptomOptions = [
    'Mild chest tightness',
    'Palpitations / irregular heartbeat',
    'Shortness of breath on exertion',
    'Frequent tension headaches',
    'Dizziness or lightheadedness',
    'Joint pain or morning stiffness',
    'Fatigue / low stamina',
    'Acid reflux / heartburn',
    'Skin rash or itching',
    'Sleep disruption / insomnia'
  ];

  const chronicOptions = [
    'Hypertension / High BP',
    'Type 2 Diabetes',
    'Asthma / Respiratory issue',
    'High Cholesterol',
    'Thyroid disorder',
    'None of the above'
  ];

  const handleToggleSymptom = (sym: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const handleToggleChronic = (con: string) => {
    if (con === 'None of the above') {
      setChronicConditions(['None of the above']);
      return;
    }
    setChronicConditions(prev => {
      const filtered = prev.filter(c => c !== 'None of the above');
      return filtered.includes(con) ? filtered.filter(c => c !== con) : [...filtered, con];
    });
  };

  const handleGenerateAssessment = () => {
    setIsCalculating(true);

    setTimeout(() => {
      // Calculate clinical triage considerations
      let urgency: 'routine' | 'recommended' | 'urgent' = 'routine';
      let dept = 'General Medicine & Triage';
      let suggestedDocId = 6; // Dr. Marcus Sterling

      if (
        selectedSymptoms.includes('Mild chest tightness') ||
        selectedSymptoms.includes('Palpitations / irregular heartbeat') ||
        selectedSymptoms.includes('Shortness of breath on exertion')
      ) {
        dept = 'Cardiology & Heart Care';
        suggestedDocId = 1; // Dr. Ananya Rao
        urgency = severity === 'severe' ? 'urgent' : 'recommended';
      } else if (
        selectedSymptoms.includes('Frequent tension headaches') ||
        selectedSymptoms.includes('Dizziness or lightheadedness')
      ) {
        dept = 'Neurology & Brain Sciences';
        suggestedDocId = 2; // Dr. Julian Vance
        urgency = 'recommended';
      } else if (selectedSymptoms.includes('Joint pain or morning stiffness')) {
        dept = 'Orthopedics & Joint Care';
        suggestedDocId = 3; // Dr. Manish Reddy
        urgency = 'routine';
      }

      const evalResult: AssessmentResult = {
        urgencyLevel: urgency,
        suggestedDepartment: dept,
        suggestedDoctorId: suggestedDocId,
        considerations: [
          'Symptoms may indicate early hemodynamic or lifestyle-related variance rather than acute failure.',
          'Underlying stress levels and sleep duration can exacerbate cardiovascular and autonomic reactivity.',
          'Comprehensive 12-lead ECG and basic metabolic panel are recommended for definitive clearance.'
        ],
        recommendedActions: [
          `Schedule a structured consultation with a specialist in ${dept}.`,
          'Monitor blood pressure and resting heart rate twice daily.',
          'Avoid heavy stimulants, excessive caffeine, or sudden strenuous exercise until evaluated.'
        ],
        selfCareTips: [
          'Maintain 7-8 hours of uninterrupted sleep.',
          'Hydrate with at least 2.5L of water daily.',
          'Practice 10 minutes of controlled diaphragmatic breathing.'
        ],
        clinicalDisclaimer:
          'This clinical assessment tool is designed for preliminary triage support and health optimization guidance. It does not replace a physician’s formal diagnostic examination. If you experience severe chest pain, severe breathlessness, or neurological deficits, seek emergency medical services immediately.'
      };

      setResult(evalResult);
      setIsCalculating(false);
      setStep(5);
    }, 800);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setChronicConditions([]);
    setResult(null);
  };

  return (
    <div style={{ paddingTop: '24px', paddingBottom: '72px', position: 'relative' }}>
      <div className="app-container-wide">
        {/* ── Split Grid Layout: Solid Opaque Box + Open 3D DNA Space ── */}
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
              100% SOLID OPAQUE HEALTH ASSESSMENT CONTAINER BOX
              Zero transparency: All headings & forms completely isolated
              ══════════════════════════════════════════════════════════ */}
          <div
            style={{
              order: boxSide === 'left' ? 1 : 2,
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #DCD7CD',
              boxShadow: '0 16px 48px rgba(22, 74, 65, 0.12), 0 2px 8px rgba(22, 74, 65, 0.04)',
              padding: 'clamp(20px, 3.2vw, 36px)',
              position: 'relative',
              zIndex: 30
            }}
          >
            {/* ── Box Header Inside Solid Container ───────────────── */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '10px'
                }}
              >
                <span
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
                  Clinical Triage & Health Guidance
                </span>

                {onToggleBoxSide && (
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
                    title={`Move box to the ${boxSide === 'left' ? 'right' : 'left'} and shift the DNA animation to the ${boxSide === 'left' ? 'left' : 'right'}`}
                  >
                    <ArrowLeftRight size={13} />
                    <span>Dock {boxSide === 'left' ? 'Right →' : '← Left'}</span>
                  </button>
                )}
              </div>

              <h1
                style={{
                  fontSize: 'clamp(1.7rem, 2.6vw, 2.2rem)',
                  color: '#164A41',
                  margin: '0 0 6px 0',
                  lineHeight: 1.15
                }}
              >
                Interactive Health Assessment
              </h1>
              <p style={{ fontSize: '0.86rem', color: '#5F6E68', margin: 0, lineHeight: 1.5 }}>
                Complete this step-by-step clinical questionnaire to receive structured medical considerations and doctor matching.
              </p>
            </div>

            {/* ── Progress Tracker Bar ─────────────────────────────── */}
            {step < 5 && (
              <div style={{ marginBottom: '28px', backgroundColor: '#FAF8F4', padding: '12px 16px', borderRadius: '12px', border: '1px solid #EFECE6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#164A41' }}>
                  <span>Step {step} of 4: {['Basic Information', 'Symptoms & Severity', 'Lifestyle Metrics', 'Health History'][step - 1]}</span>
                  <span>{step * 25}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#E5E0D6', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${step * 25}%`,
                      height: '100%',
                      backgroundColor: '#164A41',
                      borderRadius: '9999px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            )}

            {/* ── STEP 1: Basic Information ──────────────────────────── */}
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#17201D', marginBottom: '18px', fontWeight: 800 }}>
                  1. General Profile & Primary Concern
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                  <div className="form-group">
                    <label className="form-label">Age (Years):</label>
                    <input
                      type="number"
                      min="1"
                      max="110"
                      value={age}
                      onChange={e => setAge(parseInt(e.target.value) || 30)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Biological Gender:</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as any)}
                      className="form-select"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other / Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Primary Health Concern:</label>
                  <select
                    value={chiefComplaint}
                    onChange={e => setChiefComplaint(e.target.value)}
                    className="form-select"
                  >
                    <option value="Cardiovascular / Chest Discomfort">Cardiovascular / Chest Discomfort</option>
                    <option value="Headaches / Cognitive Fatigue">Headaches / Cognitive Fatigue</option>
                    <option value="Joint / Bone / Musculoskeletal">Joint / Bone / Musculoskeletal</option>
                    <option value="Metabolic / Energy / General Wellness">Metabolic / Energy / General Wellness</option>
                    <option value="Respiratory / Seasonal Allergies">Respiratory / Seasonal Allergies</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: '1px solid #EFECE6' }}>
                  <button onClick={() => setStep(2)} className="btn btn-primary">
                    <span>Continue to Symptoms</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Symptoms & Severity ────────────────────────── */}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#17201D', marginBottom: '16px', fontWeight: 800 }}>
                  2. Select Active Symptoms & Severity
                </h3>

                <p style={{ fontSize: '0.84rem', color: '#5F6E68', marginBottom: '14px' }}>
                  Select all symptoms you have experienced over the past 14 days:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', marginBottom: '22px' }}>
                  {symptomOptions.map(sym => {
                    const isSelected = selectedSymptoms.includes(sym);
                    return (
                      <div
                        key={sym}
                        onClick={() => handleToggleSymptom(sym)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #164A41' : '1px solid #DCD7CD',
                          backgroundColor: isSelected ? '#E7F3F0' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#164A41' : '#323F3B',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: isSelected ? '2px solid #164A41' : '1px solid #8A9993',
                            backgroundColor: isSelected ? '#164A41' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {isSelected && <CheckCircle2 size={13} color="#FFFFFF" />}
                        </div>
                        <span>{sym}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Severity Selector */}
                <div style={{ marginBottom: '22px', backgroundColor: '#FAF8F4', padding: '14px', borderRadius: '12px', border: '1px solid #E5E0D6' }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>Overall Symptom Intensity:</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['mild', 'moderate', 'severe'] as const).map(sev => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: severity === sev ? '2px solid #164A41' : '1px solid #DCD7CD',
                          backgroundColor: severity === sev ? '#164A41' : '#FFFFFF',
                          color: severity === sev ? '#FFFFFF' : '#323F3B',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #EFECE6' }}>
                  <button onClick={() => setStep(1)} className="btn btn-outline">
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button onClick={() => setStep(3)} className="btn btn-primary">
                    <span>Next: Lifestyle Metrics</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Lifestyle Metrics ──────────────────────────── */}
            {step === 3 && (
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#17201D', marginBottom: '18px', fontWeight: 800 }}>
                  3. Lifestyle & Biological Habits
                </h3>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label">Average Nightly Sleep (Hours): {sleepHours}h</label>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    value={sleepHours}
                    onChange={e => setSleepHours(parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#164A41' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#8A9993' }}>
                    <span>3h (Deprived)</span>
                    <span>7-8h (Optimal)</span>
                    <span>12h</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
                  <div className="form-group">
                    <label className="form-label">Perceived Daily Stress:</label>
                    <select
                      value={stressLevel}
                      onChange={e => setStressLevel(e.target.value as any)}
                      className="form-select"
                    >
                      <option value="low">Low (Relaxed)</option>
                      <option value="medium">Medium (Manageable)</option>
                      <option value="high">High (Overwhelmed)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Physical Activity:</label>
                    <select
                      value={activityLevel}
                      onChange={e => setActivityLevel(e.target.value as any)}
                      className="form-select"
                    >
                      <option value="sedentary">Sedentary (Desk bound)</option>
                      <option value="moderate">Moderate (2-3x/week)</option>
                      <option value="active">Active (Daily workouts)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #EFECE6' }}>
                  <button onClick={() => setStep(2)} className="btn btn-outline">
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button onClick={() => setStep(4)} className="btn btn-primary">
                    <span>Next: Health History</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Medical History & Finalization ──────────────── */}
            {step === 4 && (
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#17201D', marginBottom: '16px', fontWeight: 800 }}>
                  4. Existing Chronic Conditions
                </h3>

                <p style={{ fontSize: '0.84rem', color: '#5F6E68', marginBottom: '14px' }}>
                  Select existing diagnosed conditions to refine specialist matching:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', marginBottom: '24px' }}>
                  {chronicOptions.map(con => {
                    const isSelected = chronicConditions.includes(con);
                    return (
                      <div
                        key={con}
                        onClick={() => handleToggleChronic(con)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #164A41' : '1px solid #DCD7CD',
                          backgroundColor: isSelected ? '#E7F3F0' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '0.82rem',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#164A41' : '#323F3B',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: isSelected ? '2px solid #164A41' : '1px solid #8A9993',
                            backgroundColor: isSelected ? '#164A41' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {isSelected && <CheckCircle2 size={13} color="#FFFFFF" />}
                        </div>
                        <span>{con}</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid #EFECE6' }}>
                  <button onClick={() => setStep(3)} className="btn btn-outline">
                    <ChevronLeft size={16} />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleGenerateAssessment}
                    disabled={isCalculating}
                    className="btn btn-accent btn-lg"
                    style={{ padding: '10px 24px' }}
                  >
                    {isCalculating ? (
                      <span>Synthesizing Health Assessment...</span>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Generate Diagnostic Assessment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 5: Comprehensive Clinical Result ──────────────── */}
            {step === 5 && result && (
              <div>
                {/* Result Header Badge */}
                <div
                  style={{
                    backgroundColor:
                      result.urgencyLevel === 'urgent'
                        ? '#FFF1F0'
                        : result.urgencyLevel === 'recommended'
                        ? '#FFF7F5'
                        : '#EBF6F0',
                    border: `1px solid ${
                      result.urgencyLevel === 'urgent'
                        ? 'rgba(199, 0, 57, 0.25)'
                        : result.urgencyLevel === 'recommended'
                        ? 'rgba(232, 121, 91, 0.25)'
                        : 'rgba(46, 125, 82, 0.25)'
                    }`,
                    borderRadius: '16px',
                    padding: '18px 20px',
                    marginBottom: '22px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <ShieldCheck
                      size={20}
                      color={
                        result.urgencyLevel === 'urgent'
                          ? '#C70039'
                          : result.urgencyLevel === 'recommended'
                          ? '#E8795B'
                          : '#2E7D52'
                      }
                    />
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '0.92rem',
                        color:
                          result.urgencyLevel === 'urgent'
                            ? '#C70039'
                            : result.urgencyLevel === 'recommended'
                            ? '#E8795B'
                            : '#2E7D52',
                        textTransform: 'uppercase'
                      }}
                    >
                      Triage Recommendation: {result.urgencyLevel.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#164A41', marginBottom: '4px' }}>
                    Recommended Specialty: {result.suggestedDepartment}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#5F6E68' }}>
                    Based on your reported {selectedSymptoms.length} symptom(s) and {stressLevel} stress metrics.
                  </div>
                </div>

                {/* Structured Considerations */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#164A41', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Clinical Considerations
                  </h4>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.86rem', color: '#323F3B', lineHeight: 1.6 }}>
                    {result.considerations.map((c, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Actions */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#164A41', textTransform: 'uppercase', marginBottom: '10px' }}>
                    Recommended Next Actions
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.recommendedActions.map((act, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: '#FAF8F4',
                          border: '1px solid #EFECE6',
                          borderRadius: '10px',
                          padding: '10px 14px',
                          fontSize: '0.84rem',
                          color: '#17201D',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <CheckCircle2 size={16} color="#2E7D52" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions & Restart */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    paddingTop: '18px',
                    borderTop: '1px solid #EFECE6'
                  }}
                >
                  <button onClick={handleReset} className="btn btn-outline btn-sm">
                    <RotateCcw size={14} />
                    <span>Retake Assessment</span>
                  </button>

                  <button
                    onClick={() => onOpenBookingWithDoctor(result.suggestedDoctorId)}
                    className="btn btn-accent"
                    style={{ padding: '9px 18px' }}
                  >
                    <Calendar size={16} />
                    <span>Book Specialist Appointment</span>
                  </button>
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
              pointerEvents: 'none'
            }}
          >
            {/* Dedicated open empty canvas where the shifted 3D BTS DNA freely spins */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAssessment;
