// =================================================================
// CarePoint DNA Fallback Component
// Accessible fallback with BTS DNA Color Palette
// =================================================================

import React from 'react';
import { Dna, ShieldCheck, Activity } from 'lucide-react';

export interface DNAFallbackProps {
  reason?: 'no-webgl' | 'reduced-motion' | 'error';
}

export const DNAFallback: React.FC<DNAFallbackProps> = ({ reason = 'no-webgl' }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '380px',
        backgroundColor: '#1E0D1B',
        borderRadius: '24px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid rgba(199, 0, 57, 0.25)',
        color: '#F8FAFC',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Graphic */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 87, 51, 0.2) 0%, rgba(199, 0, 57, 0.1) 40%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 87, 51, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Dna size={22} color="#FF5733" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#F8FAFC' }}>
              CarePoint Genomic Engine
            </div>
            <div style={{ fontSize: '0.75rem', color: '#FFC300', textTransform: 'uppercase', fontWeight: 700 }}>
              BTS Palette Telemetry Mode
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#E2D9D2', lineHeight: 1.6, maxWidth: '420px' }}>
          {reason === 'reduced-motion'
            ? 'Accessible static telemetry view active to respect your reduced-motion preferences.'
            : '2D High-precision molecular sequence active for your device configuration.'}
        </p>
      </div>

      <div
        style={{
          backgroundColor: 'rgba(88, 24, 69, 0.45)',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid rgba(255, 195, 0, 0.2)'
        }}
      >
        <div style={{ fontSize: '0.75rem', color: '#FFC300', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
          Active BTS Nucleotide Spectrum:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#C70039' }} />
            <span>Ruby Red (#C70039)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FFC300' }} />
            <span>Sunflower Gold (#FFC300)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#FF5733' }} />
            <span>Vibrant Coral (#FF5733)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#900C3E' }} />
            <span>Wine Crimson (#900C3E)</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#C2B5B0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#FFC300" />
          <span>Biometric Encryption 256-Bit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} color="#FF5733" />
          <span>Telemetry Active</span>
        </div>
      </div>
    </div>
  );
};
