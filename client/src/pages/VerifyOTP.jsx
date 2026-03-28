import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { verifyOTP } from "../services/api"; // Your existing backend service
import { ShieldCheck, ArrowRight, Gavel, Mail } from "lucide-react";

export default function VerifyOTP() {
  // ── Existing Backend State & Logic ──
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem("verifyEmail"); //

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyOTP(email, otp); //
      alert("Email verified successfully!");
      navigate("/login"); //
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-2 border border-gray-100">

        {/* ── Left Side: Identity Verification Branding ── */}
        <div className="relative bg-stone-900 p-12 text-white flex flex-col justify-between overflow-hidden min-h-[400px] md:min-h-[600px]">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200"
              alt="Justice Scales"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="bg-[#e9671c] p-1.5 rounded-md">
                <Gavel size={20} className="text-white" />
              </div>
              <h1 className="font-serif text-xl font-bold tracking-tight">CivicArch <span className="text-[#e9671c]">AI</span></h1>
            </div>

            <div className="space-y-6">
              <h2 className="text-5xl font-serif font-bold leading-tight">
                Identity <br />
                <span className="text-[#e9671c] italic">Verification</span>
              </h2>
              <p className="text-stone-300 text-lg leading-relaxed max-w-sm">
                We've sent a 6-digit verification code to your registered email address. This ensures only you can access your account.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="bg-[#e9671c]/20 p-2 rounded-full">
                <ShieldCheck className="text-[#e9671c]" size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Secure Access</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Two-Factor Authentication</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Side: OTP Input Form ── */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h3 className="font-serif text-3xl font-bold text-stone-900 mb-2">Enter OTP</h3>
            <p className="text-stone-500 text-sm">
              Code sent to <span className="text-stone-900 font-bold">{email || "your email"}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center">
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-6">
                Verification Code
              </label>

              {/* Single formatted input for the 6-digit code */}
              <input
                type="text"
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-stone-50 border border-stone-100 text-3xl font-mono text-center tracking-[0.5em] py-5 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-[#e9671c]/20 focus:border-[#e9671c] transition-all"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100 text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e9671c] hover:bg-[#D35400] text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-[#e9671c]/20 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify Code"} <ArrowRight size={18} />
              </button>


            </div>
          </form>

          <div className="mt-12 text-center">
            <Link to="/signup" className="text-sm font-bold text-stone-400 hover:text-[#e9671c] flex items-center justify-center gap-2 uppercase tracking-widest transition-colors">
              <ArrowRight size={14} className="rotate-180" /> Edit Email Address
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}