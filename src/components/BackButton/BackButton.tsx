import { useState } from 'react';

interface BackButtonProps {
  readonly onClick: () => void;
  readonly disabled?: boolean;
}

// Wireframe clone: copied verbatim from the source. Self-contained inline-styled
// back affordance used by the post-creation wizard between steps.
export function BackButton({ onClick, disabled }: Readonly<BackButtonProps>) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={
        {
          background: 'none',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: 500,
          color: isHovered && !disabled ? '#f7f7f7' : '#94979c',
          padding: '0 0 12px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: disabled ? 0.5 : 1,
          transition: 'color 0.15s',
          marginBottom: '8px',
        } as React.CSSProperties
      }
      aria-label="Go back"
    >
      <span style={{ fontSize: '18px', lineHeight: 1 }}>‹</span>
      <span>Back</span>
    </button>
  );
}
