// =================================================================
// CarePoint DNA Loading State
// Scientific loading indicator with helical spinner
// =================================================================

import React from 'react';
import { Dna } from 'lucide-react';

export const DNALoader: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F172A',
        zIndex: 10,
        gap: '14px'
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          border: '2px solid rgba(14, 165, 233, 0.2)',
          borderTopColor: '#0EA5E9',
          animation: 'spin 1s linear infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Dna size={24} color="#F59E0B" />
      </div>
      <div style={{ fontSize: '0.84rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em' }}>
        Initializing 3D Molecular Simulation...
      </div>
    </div>
  );
};
