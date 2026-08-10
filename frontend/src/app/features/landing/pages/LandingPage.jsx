import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleCTA = () => {
    navigate('/login')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111111', // Very dark grey, matching the Squarespace vibe
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Header removed as requested */}

      {/* ── MAIN CONTENT ── */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        padding: '20px'
      }}>
        


        {/* Central Typography */}
        <div className="landing-main" style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%', maxWidth: 1000 }}>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="landing-title"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <span>EVERYTHING</span>
            
            <span className="landing-title-row" style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 24px)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span>TO</span>
              {/* Inline Pill */}
              <span 
                className="landing-pill"
                onClick={handleCTA}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#d4d4d4', // Gray pill
                  color: '#000000',
                  padding: 'clamp(10px, 2vw, 16px) clamp(20px, 3vw, 32px)',
                  borderRadius: 100,
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  cursor: 'pointer',
                  transform: 'translateY(-4px)', // Optical alignment
                  transition: 'transform 0.2s',
                  pointerEvents: 'auto'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-4px) scale(1)'}
              >
                Wear Confidence
              </span>
              <span>EXPRESS</span>
            </span>
            
            <span>YOURSELF</span>
          </motion.h1>



        </div>
      </main>

      {/* Footer removed as requested */}

    </div>
  )
}

export default LandingPage
