/**
 * LoginHeader
 * Displays the eyebrow tag, heading, and subtitle for the Login page.
 */
const LoginHeader = () => {
  return (
    <div style={{ marginBottom: "2.5rem" }}>

      {/* Eyebrow tag */}
      <div
        className="login-header-eyebrow"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.25rem",
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
            fontSize: "0.68rem",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-text-muted)",
          }}
        >
          Welcome Back
        </span>
      </div>

      {/* Main heading */}
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 4vw, 2.75rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          color: "var(--color-text-primary)",
          marginBottom: "0.875rem",
          overflow: "hidden",
        }}
      >
        <span className="login-heading-word" style={{ display: "inline-block" }}>
          Sign&nbsp;
        </span>
        <span className="login-heading-word" style={{ display: "inline-block" }}>
          In.
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="login-header-subtitle"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          fontWeight: 400,
          color: "var(--color-text-muted)",
          lineHeight: 1.7,
          maxWidth: "32ch",
        }}
      >
        Enter your credentials to access your Velora account and workspace.
      </p>
    </div>
  )
}

export default LoginHeader
