import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await forgotPassword(email);
      localStorage.setItem("resetEmail", email);
      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.detail || "Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#F8F9FA] overflow-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&family=Playfair+Display:wght@700;800;900&family=JetBrains+Mono:wght@500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');

        .grid-bg {
          background-size: 40px 40px;
          background-image: radial-gradient(circle, #0000000A 1px, transparent 1px);
        }
        
        .brand-heading-font {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          letter-spacing: -0.02em;
        }
      `}</style>

      {/* --- HEADER --- */}
      {/* 1. Header size now defined by h-16 (64px), as inferred from 'image_0.png'. px-6 and gap-2.5 create the specific spacing. */}
      <header className="w-full h-16 shrink-0 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-6 sticky top-0">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: '#EF5F1E' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <polygon points="10,2 19,8 1,8" fill="white" />
              <rect x="1" y="15" width="18" height="2.5" rx="0.5" fill="white" />
              <rect x="3" y="8.5" width="2.2" height="6.2" rx="0.4" fill="white" />
              <rect x="6.8" y="8.5" width="2.2" height="6.2" rx="0.4" fill="white" />
              <rect x="10.6" y="8.5" width="2.2" height="6.2" rx="0.4" fill="white" />
              <rect x="14.4" y="8.5" width="2.2" height="6.2" rx="0.4" fill="white" />
            </svg>
          </div>

          <span className="brand-heading-font text-xl text-slate-900 leading-none pt-0.5">
            CivicArch <span className="ml-1.5" style={{ color: '#EF5F1E' }}>AI</span>
          </span>
        </Link>

        {/* 2. Badge size and spacing updated to match the smaller header. gap-2, text-xs. */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span className="material-symbols-outlined text-base">verified_user</span>
          <span className="mt-0.5">Secure Government Portal</span>
        </div>
      </header>

      {/* --- MAIN SECTION --- */}
      <main className="flex-grow flex flex-col items-center justify-center relative grid-bg px-4 py-16">

        <div className="w-full max-w-[440px] bg-white rounded-[28px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden relative z-10">

          <div className="p-10 text-center flex flex-col items-center">

            <div className="flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: '#EF5F1E10', color: '#EF5F1E' }}>
              <span className="material-symbols-outlined text-4xl">lock_reset</span>
            </div>

            <h1 className="brand-heading-font text-[34px] text-slate-900 mb-3 tracking-tight leading-tight">
              Recover Access
            </h1>

            <p className="text-[14px] text-gray-500 mb-10 leading-relaxed max-w-[320px]">
              Provide your institutional email address to receive a secure 6-digit verification code.
            </p>

            <form className="w-full space-y-5 text-left" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <span className="material-symbols-outlined text-xl">mail</span>
                  </div>
                  <input
                    className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 text-slate-900 focus:ring-2 focus:ring-[#EF5F1E] focus:border-transparent outline-none text-[15px] transition-all"
                    type="email"
                    placeholder="name@gov.agency"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-[12px] font-bold p-4 rounded-xl border border-red-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">error</span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] h-14"
                style={{ backgroundColor: '#EF5F1E', boxShadow: '0 10px 20px -5px rgba(239, 95, 30, 0.4)' }}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <>
                    <span className="text-base uppercase tracking-wide">Send Verification OTP</span>
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <Link to="/login" className="mt-8 inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#EF5F1E] transition-colors gap-2 no-underline">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to Login
            </Link>

            <div className="w-full mt-10 pt-8 border-t border-gray-100 flex justify-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                <span>Having trouble? <a href="#" className="font-bold underline" style={{ color: '#EF5F1E' }}>Contact Support</a></span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50/80 px-10 py-5 flex justify-between items-center border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-gray-400">lock</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[10px] font-bold text-gray-400 tracking-tighter uppercase">AES-256</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-gray-400">shield</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-[10px] font-bold text-gray-400 tracking-tighter uppercase">GOV-GRADE</span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center px-4 shrink-0">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] leading-loose font-bold">
            Authorized government access only. Recovery attempts are monitored.
          </p>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full h-16 shrink-0 flex items-center justify-center border-t border-gray-200 bg-white">
        <p className="text-[11px] text-gray-400 uppercase tracking-[0.3em] font-bold">
          © 2026 CivicArch AI Infrastructure.
        </p>
      </footer>
    </div>
  );
};

export default ForgotPassword;