import React from "react"

/**
 * RegisterHeader
 * Displays the brand, eyebrow tag, heading, tagline, and subtitle.
 */
const RegisterHeader = () => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {/* Brand logo & tagline display */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.6rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: "#ffffff",
            margin: "0 0 2px 0",
            textTransform: "uppercase",
          }}
        >
          Velora
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.78rem",
            fontStyle: "italic",
            color: "rgba(255, 255, 255, 0.5)",
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          Wear Confidence.
        </p>
      </div>

      {/* Eyebrow tag */}
      <div
        className="register-header-eyebrow"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--color-accent)",
            display: "inline-block",
            boxShadow: "0 0 6px var(--color-accent)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.65rem",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-text-muted)",
          }}
        >
          New Account
        </span>
      </div>

      {/* Main heading */}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.75rem, 3.2vw, 2.25rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "var(--color-text-primary)",
          marginBottom: "0.35rem",
          overflow: "hidden",
        }}
      >
        <span className="register-heading-word" style={{ display: "inline-block" }}>
          Join&nbsp;
        </span>
        <span className="register-heading-word" style={{ display: "inline-block" }}>
          Velora.
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="register-header-subtitle"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.8rem",
          fontWeight: 400,
          color: "var(--color-text-muted)",
          lineHeight: 1.5,
          maxWidth: "34ch",
        }}
      >
        Step into luxury high fashion designed to wear confidence.
      </p>
    </div>
  )
}

export default RegisterHeader
