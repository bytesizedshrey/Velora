import React from "react";
import { useSearchParams, useNavigate } from "react-router";

const NOTCH_H = 64;
const TOP_PAD = NOTCH_H + 48;

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("order_id") || searchParams.get("orderId") || "BJ-ORDER-" + Date.now();
  const paymentId = searchParams.get("payment_id") || searchParams.get("paymentId") || null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060606",
        color: "#ffffff",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: `${TOP_PAD}px 32px 120px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          background: "linear-gradient(180deg, #121212 0%, #080808 100%)",
          borderRadius: 24,
          borderTop: "1px solid #333333",
          borderLeft: "1px solid #333333",
          borderRight: "1px solid #0a0a0a",
          borderBottom: "1px solid #0a0a0a",
          boxShadow: "0 24px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.1)",
          padding: 40,
          textAlign: "center",
        }}
      >
        {/* Checkmark Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            boxShadow: "0 8px 24px rgba(34,197,94,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg width="36" height="36" fill="none" stroke="#000000" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.8rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: "#ffffff",
            margin: "0 0 4px 0",
            textTransform: "uppercase",
          }}
        >
          BY JESSIKA
        </h2>
        <p style={{ fontSize: "0.8rem", fontStyle: "italic", color: "rgba(255,255,255,0.5)", margin: "0 0 20px 0" }}>
          For the Future She Always Imagined.
        </p>

        <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>
          PAYMENT SUCCESSFUL!
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", margin: "0 0 28px 0", lineHeight: 1.6 }}>
          Thank you for your order with By Jessika. Your payment has been verified and your order is being processed.
        </p>

        {/* Order Details Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 20,
            marginBottom: 32,
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 13,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Order Reference</span>
            <span style={{ fontWeight: 700, color: "#34d399" }}>{orderId}</span>
          </div>
          {paymentId && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>Payment ID</span>
              <span style={{ fontWeight: 600, color: "#ffffff" }}>{paymentId}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Status</span>
            <span style={{ fontWeight: 700, color: "#34d399" }}>PAID & VERIFIED</span>
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            height: 50,
            borderRadius: 14,
            background: "linear-gradient(180deg, #ffffff 0%, #d4d4d4 100%)",
            color: "#000000",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(255,255,255,0.2)",
            transition: "all 0.15s ease",
          }}
        >
          Explore Collection
        </button>
      </div>
    </div>
  );
}
