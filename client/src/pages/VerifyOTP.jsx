import { useState, useRef, useEffect } from "react";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Backend connection state
  const [errorMessage, setErrorMessage] = useState(""); // Backend error handling
  const inputRefs = useRef([]);

  // Mock User ID - In production, retrieve this from your login state/localStorage
  const userId = "user_4821";

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrorMessage("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex(v => !v);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  // ─── CONNECT TO BACKEND ───
  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp: otpString }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Success! Identity Verified.");
        // window.location.href = "/dashboard";
      } else {
        setErrorMessage(data.message || "Invalid code.");
      }
    } catch (err) {
      setErrorMessage("Server connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsLoading(true);
    try {
      await fetch("http://localhost:5000/api/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setTimer(59);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Failed to resend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { height: 100%; }
        body {
          font-family: 'Inter', sans-serif;
          background: #f8f6f6;
          color: #0f172a;
        }

        .ms {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
          -webkit-font-smoothing: antialiased;
        }

        .dot-bg {
          background-color: #f8f6f6;
          background-image: radial-gradient(circle, rgba(0,0,0,0.065) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .otp-input {
          width: 100%;
          height: 62px;
          text-align: center;
          font-size: 22px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          background: transparent;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s ease;
          caret-color: #ec5b13;
        }
        .otp-input:focus { border-color: #ec5b13; }
        .otp-input.filled { border-color: #ec5b13; }

        .verify-btn {
          width: 100%;
          padding: 15px 20px;
          background: #ec5b13;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.01em;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(236,91,19,0.28);
          transition: background 0.2s ease, transform 0.1s ease;
        }
        .verify-btn:hover { background: #d44e0e; }
        .verify-btn:active { transform: scale(0.99); }
        .verify-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .resend-btn {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          color: #ec5b13;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: opacity 0.2s;
        }
        .resend-btn:disabled { opacity: 0.65; cursor: default; }

        .footer-link {
          color: #94a3b8;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #ec5b13; }

        .help-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 44px;
          height: 44px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
          color: #64748b;
          transition: color 0.2s;
        }
        .help-fab:hover { color: #ec5b13; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        <header style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid #e2e8f0",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}>
          <div style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>

            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                width: 36,
                height: 36,
                background: "#ec5b13",
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="10,2 19,8 1,8" fill="white" />
                  <rect x="1" y="15" width="18" height="2.5" rx="0.5" fill="white" />
                  <rect x="3" y="8.5" width="2.2" height="6.2" rx="0.4" fill="white" />
                  <rect x="6.8" y="8.5" width="2.2" height="6.2" rx="0.4" fill="white" />
                  <rect x="10.6" y="8.5" width="2.2" height="6.2" rx="0.4" fill="white" />
                  <rect x="14.4" y="8.5" width="2.2" height="6.2" rx="0.4" fill="white" />
                </svg>
              </div>

              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: "-0.025em",
                lineHeight: 1,
                color: "#0f172a",
              }}>
                CivicArch{" "}
                <span style={{ color: "#ec5b13" }}>AI</span>
              </span>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#475569",
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
            }}>
              <span className="ms" style={{ fontSize: 17 }}>verified_user</span>
              Secure Portal
            </div>
          </div>
        </header>

        <main className="dot-bg" style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 16px",
        }}>

          <div style={{
            width: "100%",
            maxWidth: 492,
            background: "white",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            boxShadow: "0 20px 60px rgba(0,0,0,0.09), 0 4px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}>

            <div style={{
              background: "#f8fafc",
              padding: "36px 44px 30px",
              textAlign: "center",
              borderBottom: "1px solid #f1f5f9",
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(236,91,19,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <span className="ms" style={{ fontSize: 36, color: "#ec5b13" }}>domain_verification</span>
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: 29,
                color: "#0f172a",
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
                marginBottom: 11,
              }}>
                Two-Step Verification
              </h1>

              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: "#64748b",
                lineHeight: 1.65,
                maxWidth: 330,
                margin: "0 auto",
              }}>
                For your security, we've sent a 6-digit verification
                code to your registered mobile device ending in{" "}
                <strong style={{ fontWeight: 700, color: "#0f172a" }}>•••• 4821</strong>.
              </p>
            </div>

            <div style={{ padding: "30px 44px 28px" }}>
              {/* Error Message Display */}
              {errorMessage && (
                <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center", marginBottom: 15, fontWeight: 500 }}>
                  {errorMessage}
                </p>
              )}

              <div
                style={{ display: "flex", gap: 9, marginBottom: 22 }}
                onPaste={handlePaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    className={`otp-input${digit ? " filled" : ""}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    autoFocus={i === 0}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                  />
                ))}
              </div>

              <button
                className="verify-btn"
                onClick={handleVerify}
                disabled={isLoading || otp.includes("")}
              >
                <span>{isLoading ? "Verifying..." : "Verify Identity"}</span>
                {!isLoading && <span style={{ fontSize: 17, lineHeight: 1, fontFamily: "inherit" }}>→</span>}
              </button>

              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                marginTop: 18,
                paddingTop: 6,
              }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: "#94a3b8",
                }}>
                  Didn't receive the code?
                </p>
                <button
                  className="resend-btn"
                  onClick={handleResend}
                  disabled={!canResend || isLoading}
                >
                  <span className="ms" style={{ fontSize: 14 }}>refresh</span>
                  {canResend
                    ? "Resend code"
                    : `Resend code in ${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`
                  }
                </button>
              </div>
            </div>

            <div style={{
              padding: "13px 44px",
              background: "rgba(248,250,252,0.7)",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 32,
            }}>
              {[
                { icon: "security", label: "RSA ENCRYPTED" },
                { icon: "gpp_good", label: "ISO 27001" },
              ].map(b => (
                <div key={b.label} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  opacity: 0.45,
                }}>
                  <span className="ms" style={{ fontSize: 14 }}>{b.icon}</span>
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#0f172a",
                  }}>
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <footer style={{
            marginTop: 26,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: "#94a3b8",
            }}>
              © 2026 CivicArch AI Infrastructure Group. All rights reserved.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
              {["Privacy Policy", "Terms of Service", "Contact Support"].map(l => (
                <a key={l} href="#" className="footer-link">{l}</a>
              ))}
            </div>
          </footer>
        </main>
      </div>

      <button className="help-fab">
        <span className="ms" style={{ fontSize: 20 }}>help_center</span>
      </button>
    </>
  );
}