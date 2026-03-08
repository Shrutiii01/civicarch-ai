import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { verifyOTP } from "../services/api";
import { Landmark, ShieldCheck, ArrowRight, Mail } from "lucide-react";

export default function VerifyOTP() {
  // ── Existing Backend State & Logic ──
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const email = localStorage.getItem("verifyEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await verifyOTP(email, otp);
      alert("Email verified successfully!");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Invalid OTP");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6ED] flex flex-col font-sans text-[#1A1A1A] page-transition">
      
      {/* ── Header ── */}
      <header className="w-full p-6 lg:px-12 flex justify-start items-center">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-[#e9671c] p-1.5 rounded-sm text-white">
            <Landmark size={20} />
          </div>
          <h1 className="font-serif text-xl font-bold">CivicArch AI</h1>
        </Link>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden border border-stone-100">
          
          {/* ── Left Column: OTP Form ── */}
          <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center">
            
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="text-[#e9671c]" size={24} />
            </div>

            <h2 className="font-serif text-3xl font-bold mb-2">Identity Verification</h2>
            <p className="text-stone-500 text-sm mb-8 leading-relaxed">
              For your security, we've sent a One-Time Password to your official email address.
            </p>

            {/* Email Display Banner */}
            {email && (
              <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 p-4 rounded-lg mb-8">
                <Mail className="text-stone-400" size={18} />
                <span className="text-sm font-semibold text-stone-600">{email}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full bg-stone-50 border border-stone-200 text-2xl font-mono text-center tracking-[1em] px-4 py-4 rounded-lg outline-none focus:border-[#e9671c] focus:ring-1 focus:ring-[#e9671c] transition-all"
                  required
                />
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="bg-red-50 text-red-500 text-xs font-semibold p-3 rounded-lg border border-red-100 text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#e9671c] hover:bg-[#D35400] text-white font-bold py-4 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2"
              >
                Verify Identity <ArrowRight size={18} />
              </button>
            </form>
            
          </div>

          {/* ── Right Column: Info Graphic ── */}
          <div className="hidden lg:block w-1/2 p-4">
            <div className="w-full h-full bg-[#e9671c] rounded-xl overflow-hidden flex flex-col relative">
              
              <div className="h-1/2 w-full p-6 pb-0 z-10">
                <img 
                  src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80" 
                  alt="Taj Mahal" 
                  className="w-full h-full object-cover rounded-xl shadow-lg grayscale-[20%]"
                />
              </div>

              <div className="p-10 flex flex-col justify-end h-1/2 text-white z-10">
                <span className="bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 backdrop-blur-sm border border-white/10">
                  Secure Protocol
                </span>
                <h3 className="font-serif text-4xl font-bold mb-3">Verified Access Only</h3>
                <p className="text-white/80 text-sm leading-relaxed max-w-sm mb-8">
                  Ensuring absolute data integrity and citizen privacy through multi-layered institutional security.
                </p>
                
                <div className="flex gap-8">
                  <div>
                    <div className="font-bold text-xl">256-bit</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/70 font-bold mt-1">Encryption</div>
                  </div>
                  <div>
                    <div className="font-bold text-xl">Zero</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/70 font-bold mt-1">Breaches</div>
                  </div>
                </div>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full p-6 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-stone-400 uppercase tracking-widest">
        <div className="flex gap-6">
          <a href="#privacy" className="hover:text-[#e9671c] transition-colors">Privacy</a>
          <a href="#terms" className="hover:text-[#e9671c] transition-colors">Terms</a>
        </div>
        <div>© 2024 CivicArch AI</div>
      </footer>
    </div>
  );
}