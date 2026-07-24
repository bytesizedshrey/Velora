import React, { useState } from 'react'

const SkeuoButton = ({
  onClick,
  children,
  height = 36,
  padding = '0 16px',
  fontSize = '0.8rem',
  primary = false
}) => {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        height,
        padding,
        borderRadius: 10,
        cursor: 'pointer',
        fontFamily: 'Geist, system-ui',
        fontSize,
        fontWeight: 600,
        color: primary ? '#ffffff' : 'rgba(255,255,255,0.85)',
        background: pressed ? '#080808' : primary ? '#1a1a1a' : '#141414',
        borderTop: pressed ? '1px solid #080808' : primary ? '1px solid #333333' : '1px solid #2a2a2a',
        borderLeft: pressed ? '1px solid #080808' : primary ? '1px solid #333333' : '1px solid #2a2a2a',
        borderRight: pressed ? '1px solid #2a2a2a' : '1px solid #080808',
        borderBottom: pressed ? '1px solid #2a2a2a' : '1px solid #080808',
        boxShadow: pressed
          ? 'inset 0 3px 8px rgba(0,0,0,0.7)'
          : '0 4px 12px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4)',
        transform: pressed ? 'translateY(1px)' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        outline: 'none',
        transition: 'all 0.1s',
      }}
    >
      {children}
    </button>
  )
}

export default SkeuoButton
