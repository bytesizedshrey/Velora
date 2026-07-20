import { useState } from "react"
import SellerCheckbox from "./SellerCheckbox"
import LiquidMetalButton from "@/components/ui/liquid-metal"
import useAudio from "@/shared/hooks/useAudio"

/**
 * FormField
 * Individual input field with label and focus-glow effect.
 */
const FormField = ({ id, label, type = "text", placeholder, value, onChange }) => {
  const [focused, setFocused] = useState(false)
  const { focus } = useAudio()

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
          padding: "0.875rem 1rem",
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
  const { focus } = useAudio()

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
          onFocus={() => {
            setFocused(true)
            focus()
          }}
          onBlur={() => setFocused(false)}
          autoComplete="new-password"
          style={{
            width: "100%",
            padding: "0.875rem 3rem 0.875rem 1rem",
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
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
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
 * UI only — no API, no Redux integration.
 */
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    email: "",
    password: "",
    isSeller: false,
  })

  const update = (field) => (value) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const { click } = useAudio()

  const handleSubmit = (e) => {
    e.preventDefault()
    click()
    // API integration will be added when auth service is implemented
    console.log("[RegisterForm] form data:", formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
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

      {/* Submit */}
      <div
        className="form-field"
        style={{ paddingTop: "0.5rem", marginLeft: "8rem" }}
      >
        <LiquidMetalButton
          type="submit"
          size="xl"
          borderWidth={3}
          className="w-full justify-center"
          metalConfig={{
            colorBack: "#1a1a1a",
            colorTint: "#d4d4d4",
            speed: 1,
            distortion: 2,
          }}
          style={{ width: "50%" }}
        >
          Create Account
        </LiquidMetalButton>
      </div>

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
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          Sign in
        </a>
      </p>
    </form>
  )
}

export default RegisterForm
