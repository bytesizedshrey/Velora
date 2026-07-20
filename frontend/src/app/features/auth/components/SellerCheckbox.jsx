import useAudio from "@/shared/hooks/useAudio"

/**
 * SellerCheckbox
 * Premium styled checkbox for "Register as Seller" option.
 * Controlled component: checked/onChange come from parent.
 */
const SellerCheckbox = ({ checked, onChange }) => {
  const { tick, hover } = useAudio()
  return (
    <label
      htmlFor="isSeller"
      onMouseEnter={hover}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.875rem",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Custom checkbox visual */}
      <div style={{ position: "relative", flexShrink: 0, marginTop: "2px" }}>
        <input
          id="isSeller"
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            onChange(e.target.checked)
            tick()
          }}
          style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        />
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            border: checked
              ? "1.5px solid rgba(212, 212, 212, 0.6)"
              : "1.5px solid var(--color-border)",
            background: checked ? "rgba(255,255,255,0.06)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s var(--ease-premium)",
            boxShadow: checked ? "0 0 10px rgba(212,212,212,0.08)" : "none",
          }}
        >
          {checked && (
            <svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: "block" }}
            >
              <path
                d="M1 3.5L3.8 6.5L9 1.5"
                stroke="rgba(212,212,212,0.9)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Label text */}
      <div>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "var(--color-text-primary)",
            lineHeight: 1.4,
            display: "block",
          }}
        >
          Register as Seller
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            color: "var(--color-text-muted)",
            marginTop: "0.2rem",
            display: "block",
          }}
        >
          List your items and reach thousands of buyers
        </span>
      </div>
    </label>
  )
}

export default SellerCheckbox
