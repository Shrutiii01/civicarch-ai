import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/api";
import { Landmark, User, Shield, Eye, EyeOff, ArrowRight } from "lucide-react";

function Signup() {
  // ── Existing Backend State ──
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ── New UI State ──
  const [role, setRole] = useState("citizen");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ── Existing Backend Logic ──
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await signup({
      name,
      email,
      password,
    });

    console.log(res.data);

    alert("OTP sent to your email. Please verify your account.");

    // store email for OTP verification page
    localStorage.setItem("verifyEmail", email);

    // redirect to OTP page
    navigate("/verify-otp");

  } catch (err) {
    console.error(err);

    if (err.response?.data?.detail) {
      setError(err.response.data.detail);
    } else {
      setError("Failed to create account. Please try again.");
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
          
          {/* ── Left Column: Signup Form ── */}
          <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center">
            <h2 className="font-serif text-3xl font-bold mb-2">Join the Architecture</h2>
            <p className="text-stone-500 text-sm mb-8 leading-relaxed">
              Empowering citizens through AI-driven civic participation.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-sm px-4 py-3.5 rounded-lg outline-none focus:border-[#e9671c] focus:ring-1 focus:ring-[#e9671c] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
                  Official Email
                </label>
                <input
                  type="email"
                  placeholder="name@domain.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 text-sm px-4 py-3.5 rounded-lg outline-none focus:border-[#e9671c] focus:ring-1 focus:ring-[#e9671c] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">
                  Password
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
                className="w-full bg-[#e9671c] hover:bg-[#D35400] text-white font-bold py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2"
              >
                Create Account <ArrowRight size={18} />
              </button>
            </form>

            {/* ── Redirect to Login Section ── */}
            <div className="mt-8 flex items-center justify-between">
              <span className="w-1/4 border-b border-stone-200"></span>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center px-2">Already registered?</span>
              <span className="w-1/4 border-b border-stone-200"></span>
            </div>

            <div className="mt-6">
              <Link 
                to="/login"
                className="w-full border-2 border-stone-200 hover:border-[#e9671c] hover:bg-[#FDF6ED] text-stone-600 hover:text-[#e9671c] font-bold py-3.5 rounded-lg transition-all flex justify-center items-center gap-2"
              >
                Go to Login
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
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
              </div>

              <div className="p-10 flex flex-col justify-end h-1/2 text-white z-10">
                <span className="bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 backdrop-blur-sm border border-white/10">
                  Institutional Platform
                </span>
                <h3 className="font-serif text-4xl font-bold mb-3">Empowering Digital India</h3>
                <p className="text-white/80 text-sm leading-relaxed max-w-sm mb-8">
                  Unified portal for intelligent governance and administrative transparency.
                </p>
                
                <div className="flex gap-8">
                  <div>
                    <div className="font-bold text-xl">1.2B+</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/70 font-bold mt-1">Citizens</div>
                  </div>
                  <div>
                    <div className="font-bold text-xl">750+</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/70 font-bold mt-1">Districts</div>
                  </div>
                  <div>
                    <div className="font-bold text-xl">AI</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/70 font-bold mt-1">Powered</div>
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

export default Signup;