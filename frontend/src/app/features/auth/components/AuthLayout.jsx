/**
 * AuthLayout
 * Fullscreen split-screen container for all auth pages.
 *
 * Left panel: Large ambient typographic branding + floating orbs.
 * Right panel: Form content slot.
 *
 * NOTE: Elements do NOT have opacity:0 inline — GSAP sets initial
 * states at runtime so content is always accessible as a fallback.
 */
const AuthLayout = ({ children, leftPanelRef, rightPanelRef, ambientRef }) => {
  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        display: "grid",
        gridTemplateColumns: "2fr",
        background: "var(--color-bg)",
        position: "relative",
        overflow: "hidden",
      }}
      className="auth-layout"
    >
      {/* ── LEFT PANEL ── */}
      <div
        ref={leftPanelRef}
        className="auth-layout__left"
        style={{
          display: "none",
          position: "relative",
          overflow: "hidden",
          background: "#070707",
          borderRight: "1px solid var(--color-border)",
        }}
      >
        {/* Ambient grid lines */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            zIndex: 0,
          }}
        />

        {/* Glowing orbs — animated by GSAP in Register.jsx */}

        {/* Large wordmark + content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
            gap: "1.5rem",
            padding: "3rem",
          }}
        >
          {/* Giant display text */}
          <div
            className="auth-layout__display-text"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(5rem, 10vw, 9rem)",
              fontWeight: 700,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              color: "transparent",
              backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            VE<br />LO<br />RA
          </div>

          {/* Divider */}
          <div
            className="auth-layout__divider"
            style={{
              width: 1,
              height: 40,
              background: "linear-gradient(to bottom, transparent, var(--color-border), transparent)",
            }}
          />

          {/* Tagline */}
          <p
            className="auth-layout__tagline"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.68rem",
              fontWeight: 400,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
              textAlign: "center",
            }}
          >
            Premium C2C Marketplace
          </p>
        </div>

        {/* Bottom vignette */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "30%",
            background: "linear-gradient(to top, #070707, transparent)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        ref={rightPanelRef}
        className="auth-layout__right"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(2rem, 6vw, 4rem) clamp(1.5rem, 5vw, 3.5rem)",
          minHeight: "100dvh",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {children}
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        @media (min-width: 900px) {
          .auth-layout {
            grid-template-columns: 1fr 1fr !important;
          }
          .auth-layout__left {
            display: flex !important;
          }
        }
        @media (min-width: 1200px) {
          .auth-layout {
            grid-template-columns: 55% 45% !important;
          }
        }

        .auth-layout__left::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px 200px;
          opacity: 0.35;
          pointer-events: none;
          z-index: 4;
        }
      `}</style>
    </div>
  )
}

export default AuthLayout
