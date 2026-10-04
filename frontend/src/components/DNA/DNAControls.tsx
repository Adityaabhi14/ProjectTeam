// =================================================================
// CarePoint DNA Interactive Controls & Telemetry Overlay
// Allows users to inspect 4 base pairings, toggle rotation speed, and view genomic metrics
// =================================================================

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Activity, Eye } from 'lucide-react';

export interface DNAControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onResetOrientation: () => void;
  activeBaseHighlight: string | null;
  onSelectBaseHighlight: (base: string | null) => void;
  showLegend?: boolean;
}

export const DNAControls: React.FC<DNAControlsProps> = ({
  isPaused,
  onTogglePause,
  onResetOrientation,
  activeBaseHighlight,
  onSelectBaseHighlight,
  showLegend = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        zIndex: 20,
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      {/* ── 4 Nucleotide Base Pair Legend & Filter Strip ─────────── */}
      {showLegend && (
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '14px',
            padding: '10px 14px',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 8px #10B981'
              }}
            />
            <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              4-Base Genomic Pairings:
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {/* A - T Pair */}
            <button
              onClick={() => onSelectBaseHighlight(activeBaseHighlight === 'AT' ? null : 'AT')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: activeBaseHighlight === 'AT' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                border: activeBaseHighlight === 'AT' ? '1px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.76rem',
                color: '#F8FAFC',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <span>Adenine (A) ↔ Thymine (T)</span>
            </button>

            {/* G - C Pair */}
            <button
              onClick={() => onSelectBaseHighlight(activeBaseHighlight === 'GC' ? null : 'GC')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: activeBaseHighlight === 'GC' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                border: activeBaseHighlight === 'GC' ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '0.76rem',
                color: '#F8FAFC',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>Guanine (G) ↔ Cytosine (C)</span>
            </button>
          </div>

          {/* Quick Play/Pause & Reset Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={onTogglePause}
              title={isPaused ? 'Resume Rotation' : 'Pause Rotation'}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F8FAFC',
                cursor: 'pointer'
              }}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>

            <button
              onClick={onResetOrientation}
              title="Reset View"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#F8FAFC',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
