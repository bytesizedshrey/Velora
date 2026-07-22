import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import SellerCheckbox from "./SellerCheckbox"
import LiquidMetalButton from "../../../../components/ui/liquid-metal"
import useAudio from "../../../../shared/hooks/useAudio"
import { registerUser, clearError } from "../state/auth.slice"


/**
 * FormField
 * Individual input field with label and focus-glow effect.
 */
const FormField = ({ id, label, type = "text", placeholder, value, onChange }) => {
  const [focused, setFocused] = useState(false)
  const { focus, hover } = useAudio()

  return (
    <div className="form-field" style={{ display: "flex", flexDirection: "column" }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: focused ? "var(--color-accent-dim)" : "var(--color-text-muted)",
          transition: "color 0.2s var(--ease-standard)",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setFocused(true)
          focus()
        }}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        style={{
          width: "100%",
          padding: "0.6rem 0.85rem",
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          fontWeight: 400,
          color: "var(--color-text-primary)",
          background: "var(--color-surface)",
          border: "none",
          outline: "none",
          borderRadius: "var(--radius-md)",
          boxShadow: focused
            ? "var(--shadow-input-focus)"
            : "var(--shadow-input)",
          transition: "box-shadow 0.25s var(--ease-premium), background 0.2s",
          caretColor: "#ffffff",
        }}
        onMouseEnter={(e) => {
          hover()
          if (!focused) {
            e.target.style.background = "var(--color-surface-hover)"
          }
        }}
        onMouseLeave={(e) => {
          if (!focused) {
            e.target.style.background = "var(--color-surface)"
          }
        }}
      />
    </div>
  )
}

// Placeholder for password visibility icon
const EyeIcon = ({ open }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block" }}
  >
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
)

/**
 * PasswordField
 * Password input with show/hide toggle.
 */
const PasswordField = ({ value, onChange }) => {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { focus, hover } = useAudio()

  return (
    <div className="form-field" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label
        htmlFor="password"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: focused ? "var(--color-accent-dim)" : "var(--color-text-muted)",
          transition: "color 0.2s var(--ease-standard)",
        }}
      >
        Password
      </label>
      <div style={{ position: "relative" }}>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Min. 6 characters"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onMouseEnter={hover}
          onFocus={() => {
            setFocused(true)
            focus()
          }}
          onBlur={() => setFocused(false)}
          autoComplete="new-password"
          style={{
            width: "100%",
            padding: "0.6rem 3rem 0.6rem 0.85rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            fontWeight: 400,
            color: "var(--color-text-primary)",
            background: "var(--color-surface)",
            border: "none",
            outline: "none",
            borderRadius: "var(--radius-md)",
            boxShadow: focused
              ? "var(--shadow-input-focus)"
              : "var(--shadow-input)",
            transition: "box-shadow 0.25s var(--ease-premium)",
            caretColor: "#ffffff",
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          style={{
            position: "absolute",
            right: "0.875rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            hover()
            e.currentTarget.style.color = "var(--color-text-primary)"
          }}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          <EyeIcon open={showPassword} />
        </button>
      </div>
    </div>
  )
}

/**
 * RegisterForm
 * All five fields + CTA button for the Velora register page.
 */
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    email: "",
    password: "",
    isSeller: false,
  })

  const update = (field) => (value) => {
    if (error) dispatch(clearError())
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const { click, hover } = useAudio()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  // Clear errors when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    click()

    // Map fullName to fullname (as backend expects)
    const payload = {
      fullname: formData.fullName,
      contact: formData.contact,
      email: formData.email,
      password: formData.password,
      isSeller: formData.isSeller
    }

    const resultAction = await dispatch(registerUser(payload))
    if (registerUser.fulfilled.match(resultAction)) {
      navigate("/") // Navigate to home on success
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}
    >
      {/* Full Name */}
      <FormField
        id="fullName"
        label="Full Name"
        placeholder="Your full name"
        value={formData.fullName}
        onChange={update("fullName")}
      />

      {/* Contact */}
      <FormField
        id="contact"
        label="Contact Number"
        type="tel"
        placeholder="10-digit mobile number"
        value={formData.contact}
        onChange={update("contact")}
      />

      {/* Email */}
      <FormField
        id="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={update("email")}
      />

      {/* Password */}
      <PasswordField value={formData.password} onChange={update("password")} />

      {/* Seller checkbox */}
      <div className="form-field" style={{ paddingTop: "0.25rem" }}>
        <SellerCheckbox
          checked={formData.isSeller}
          onChange={update("isSeller")}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            color: "#ff6b6b",
            fontSize: "0.85rem",
            fontFamily: "var(--font-body)",
            textAlign: "center",
            padding: "0.5rem",
            background: "rgba(255, 107, 107, 0.1)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(255, 107, 107, 0.2)"
          }}
        >
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div
        className="form-field"
        style={{ paddingTop: "0.25rem", display: "flex", justifyContent: "center" }}
      >
        <LiquidMetalButton
          type="submit"
          size="lg"
          borderWidth={3}
          disabled={loading}
          className="justify-center"
          metalConfig={{
            colorBack: "#1a1a1a",
            colorTint: "#d4d4d4",
            speed: loading ? 2 : 1,
            distortion: loading ? 3 : 2,
          }}
          onMouseEnter={hover}
          style={{ width: "70%", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </LiquidMetalButton>
      </div>

      {/* Divider OR */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          margin: "0.25rem 0",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
        <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>OR</span>
        <div style={{ flex: 1, height: "1px", background: "var(--color-border)" }} />
      </div>

      {/* Google OAuth Link */}
      <a
        href="/api/auth/google"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          width: "100%",
          padding: "0.65rem 1rem",
          borderRadius: "var(--radius-md)",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-body)",
          fontSize: "0.875rem",
          fontWeight: 500,
          textDecoration: "none",
          transition: "all 0.2s var(--ease-premium)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        }}
        onMouseEnter={(e) => {
          hover()
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)"
          e.currentTarget.style.borderColor = "rgba(212, 212, 212, 0.4)"
          e.currentTarget.style.boxShadow = "0 0 16px rgba(212, 212, 212, 0.1)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)"
          e.currentTarget.style.borderColor = "var(--color-border)"
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)"
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </a>

      {/* Login link */}
      <p
        className="form-field"
        style={{
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "0.8rem",
          color: "var(--color-text-muted)",
          paddingTop: "0.25rem",
        }}
      >
        Already have an account?{" "}
        <a
          href="/login"
          style={{
            color: "var(--color-text-muted)",
            textDecoration: "none",
            fontWeight: 500,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            hover()
            e.currentTarget.style.color = "var(--color-text-primary)"
          }}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          Sign in
        </a>
      </p>
    </form>
  )
}

export default RegisterForm
