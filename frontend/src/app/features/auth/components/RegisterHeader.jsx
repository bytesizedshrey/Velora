/**
 * RegisterHeader
 * Displays the eyebrow tag, heading, and subtitle.
 * Elements start visible. GSAP sets initial opacity in Register.jsx.
 */
const RegisterHeader = () => {
  return (
    <div style={{ marginBottom: "1rem" }}>

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
        A premium C2C marketplace. Buy & sell beautifully.
      </p>
    </div>
  )
}

export default RegisterHeader
