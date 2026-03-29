import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api"; // Your existing backend service
import { Landmark, KeyRound, ArrowRight, Gavel, ShieldCheck } from "lucide-react";

export default function ForgotPassword() {
  // ── Existing Backend State & Logic ──
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess("OTP sent to your email. Please continue to reset password.");
      localStorage.setItem("resetEmail", email);
      navigate("/reset-password");
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Error sending OTP. Please verify your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:grid md:grid-cols-2 border border-gray-100">

        {/* ── Left Side: Account Recovery Branding ── */}
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
                Account <br />
                <span className="text-[#e9671c] italic">Recovery</span>
              </h2>
              <p className="text-stone-300 text-lg leading-relaxed max-w-sm">
                Don't worry, it happens to the best of us. We'll help you get back into your portal securely.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="bg-[#e9671c]/20 p-2 rounded-full">
                <ShieldCheck className="text-[#e9671c]" size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Secure Recovery</p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">Encrypted Link Verification</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Side: Forgot Password Form ── */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h3 className="font-serif text-3xl font-bold text-stone-900 mb-2">Forgot Password?</h3>
            <p className="text-stone-500 text-sm">Enter your email to receive a password reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-100 text-sm px-4 py-4 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#e9671c]/20 focus:border-[#e9671c] transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-600 text-xs font-bold bg-green-50 p-3 rounded-lg border border-green-100">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e9671c] hover:bg-[#D35400] text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-[#e9671c]/20 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send Reset Link"} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link to="/login" className="text-sm font-bold text-stone-400 hover:text-[#e9671c] flex items-center justify-center gap-2 uppercase tracking-widest transition-colors">
              <ArrowRight size={14} className="rotate-180" /> Back to Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}