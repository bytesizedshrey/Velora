import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleCTA = () => {
    if (user) {
      navigate('/marketplace')
    } else {
      navigate('/register')
    }
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
      
      {/* ── HEADER ── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 40px',
        position: 'relative',
        zIndex: 20
      }}>
        {/* Left: Logo */}
        <div 
          onClick={() => navigate('/')}
          style={{ 
            fontFamily: "'Cormorant Garamond', serif", 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          {/* Faux logo icon */}
          <div style={{ width: 24, height: 24, border: '2px solid #fff', borderRadius: '50%', display: 'grid', placeItems: 'center' }}>
            <div style={{ width: 10, height: 10, backgroundColor: '#fff', borderRadius: '50%' }} />
          </div>
          VELORA
        </div>

        {/* Center: Links (Hidden on small screens) */}
        <nav style={{ display: 'flex', gap: 32, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }} className="hidden md:flex">
          <span style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} className="hover:opacity-70">Collection</span>
          <span style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} className="hover:opacity-70">Atelier</span>
          <span style={{ cursor: 'pointer', transition: 'opacity 0.2s' }} className="hover:opacity-70">Journal</span>
        </nav>

        {/* Right: Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {user ? (
            <button 
              onClick={() => navigate('/marketplace')}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                background: '#ffffff',
                color: '#000000',
                padding: '12px 24px',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              className="hover:bg-gray-200"
            >
              Enter Marketplace
            </button>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                className="hover:opacity-70"
              >
                Log In
              </button>
              <button 
                onClick={() => navigate('/register')}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: '#ffffff',
                  color: '#000000',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                className="hover:bg-gray-200"
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        padding: '20px'
      }}>
        
        {/* Floating Images Container */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          
          {/* Top Left Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            style={{ position: 'absolute', top: '15%', left: '10%', width: 140, height: 180, borderRadius: 12, overflow: 'hidden' }}
            className="hidden md:block"
          >
            <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=60" alt="Fashion 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          {/* Top Right Image */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ position: 'absolute', top: '10%', right: '20%', width: 160, height: 200, borderRadius: 12, overflow: 'hidden' }}
            className="hidden lg:block"
          >
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60" alt="Fashion 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          {/* Bottom Right Image */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{ position: 'absolute', bottom: '15%', right: '12%', width: 180, height: 240, borderRadius: 12, overflow: 'hidden' }}
            className="hidden md:block"
          >
            <img src="https://images.unsplash.com/photo-1509631179647-0c739a4f6cf6?w=600&auto=format&fit=crop&q=60" alt="Fashion 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
          
        </div>

        {/* Central Typography */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%', maxWidth: 1000 }}>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
            
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 24px)', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span>TO</span>
              {/* Inline Pill */}
              <span 
                onClick={handleCTA}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#9cf89a', // Green from the reference
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

          {/* Video / Campaign Section (Bottom Left of the text area) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{
              marginTop: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              pointerEvents: 'auto',
              cursor: 'pointer'
            }}
            className="group"
          >
            <div style={{ position: 'relative', width: 140, height: 80, borderRadius: 8, overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=60" alt="Campaign" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 40, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play className="w-4 h-4 text-black fill-black" />
              </div>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }} className="group-hover:opacity-70 transition-opacity">
              WATCH THE CAMPAIGN
            </span>
          </motion.div>

        </div>
      </main>

      {/* ── FOOTER ELEMENTS ── */}
      <footer style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '24px 40px',
        position: 'relative',
        zIndex: 20
      }}>
        {/* Socials */}
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
          <a href="#" style={{ color: '#fff', textDecoration: 'none' }}><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
        </div>

        {/* Scroll Down */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 24, fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 6 }}>
          SCROLL DOWN ↓
        </div>
      </footer>

    </div>
  )
}

export default LandingPage
