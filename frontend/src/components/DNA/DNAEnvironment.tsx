// =================================================================
// CarePoint DNA Environment Container
// Provides atmospheric gradient depth, vignette, and particle backdrop
// =================================================================

import React from 'react';

export interface DNAEnvironmentProps {
  children?: React.ReactNode;
  theme?: 'cinematic-dark' | 'clinical-light';
  className?: string;
  style?: React.CSSProperties;
}

export const DNAEnvironment: React.FC<DNAEnvironmentProps> = ({
  children,
  theme = 'cinematic-dark',
  className = '',
  style = {}
}) => {
  const isDark = theme === 'cinematic-dark';

  return (
    <div
      className={`dna-environment-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '380px',
        borderRadius: '24px',
        overflow: 'hidden',
        background: isDark
          ? 'radial-gradient(ellipse at 50% 45%, #0F172A 0%, #070B14 70%, #020617 100%)'
          : 'radial-gradient(ellipse at 50% 50%, #FAF8F4 0%, #F3EFE6 100%)',
        boxShadow: isDark
          ? '0 20px 50px -10px rgba(2, 6, 23, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 12px 36px -8px rgba(22, 74, 65, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        border: isDark
          ? '1px solid rgba(255, 255, 255, 0.12)'
          : '1px solid #E5E0D6',
        ...style
      }}
    >
      {/* Ambient glow halos behind the 3D canvas */}
      {isDark && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '15%',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(14, 165, 233, 0) 70%)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20%',
              right: '15%',
              width: '360px',
              height: '360px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0) 70%)',
              filter: 'blur(45px)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        </>
      )}

      {children}
    </div>
  );
};
