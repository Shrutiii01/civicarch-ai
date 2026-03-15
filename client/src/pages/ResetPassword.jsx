import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api";
import { Landmark, ShieldCheck, Eye, EyeOff, ArrowRight, Lock } from "lucide-react";

export default function ResetPassword() {
  // ── Existing Backend State & Logic ──
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await resetPassword(email, otp, password);
      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Reset failed");
      }
    }
  };

  // ── New UI State ──
  const [showPassword, setShowPassword] = useState(false);

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
          
          {/* ── Left Column: Reset Form ── */}
          <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center">
            
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <Lock className="text-[#e9671c]" size={24} />
            </div>

            <h2 className="font-serif text-3xl font-bold mb-2">Create New Password</h2>
            <p className="text-stone-500 text-sm mb-8 leading-relaxed">
              Enter the verification code sent to <span className="font-semibold text-stone-700">{email || "your email"}</span> and establish your new secure password.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
                  Verification Code (OTP)
                </label>
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full bg-stone-50 border border-stone-200 text-lg font-mono tracking-widest px-4 py-3.5 rounded-lg outline-none focus:border-[#e9671c] focus:ring-1 focus:ring-[#e9671c] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-sm px-4 py-3.5 rounded-lg outline-none focus:border-[#e9671c] focus:ring-1 focus:ring-[#e9671c] transition-all pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="bg-red-50 text-red-500 text-xs font-semibold p-3 rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#e9671c] hover:bg-[#D35400] text-white font-bold py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2 shadow-lg shadow-orange-500/20"
              >
                Reset Password <ArrowRight size={18} />
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-8 text-center">
              <Link to="/login" className="text-xs font-bold text-stone-500 hover:text-[#e9671c] transition-colors">
                ← Back to Login
              </Link>
            </div>
            
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