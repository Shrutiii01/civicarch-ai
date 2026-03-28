import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/api'; // Official Backend Service
import { useAuth } from '../context/AuthContext'; // Institutional Auth Context
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Gavel, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export const LoginPage = () => {
  // ── UI and Navigation State ──
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth(); // Global Auth State

  // ── Form State ──
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Structural Validation
    if (!email || !password) {
      toast.error('Please fill in all official credentials');
      return;
    }

    setLoading(true);

    try {
      // 2. Official Backend Call to FastAPI/Supabase
      const res = await apiLogin({ email, password });

      // 3. Persistent Token Management
      const token = res.data.token;
      localStorage.setItem("token", token);

      // 4. Update Global Auth Context
      // This ensures ProtectedRoute in App.jsx grants access
      contextLogin(email, 'Citizen User');

      // 5. Success Feedback and Navigation
      toast.success('Authentication Successful: Welcome back!');

      // Navigates to the protected complaint filing portal
      navigate('/complaint');

    } catch (err) {
      console.error("Backend Auth Error:", err);
      // Provides direct feedback for database connection issues or invalid credentials
      toast.error(err.response?.data?.message || "Authentication failed: Please verify your credentials or network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans text-[#1A1A1A] px-4 py-20">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100">

        {/* ── Left Column: Institutional Branding ── */}
        <div className="bg-[#1A1A1A] p-12 text-white flex flex-col justify-between relative overflow-hidden min-h-[500px]">
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200"
              alt="Justice and Human Rights"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/40 to-transparent"></div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e9671c]/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-2">
              <div className="bg-[#e9671c] p-2 rounded-lg shadow-lg">
                <Gavel className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight">
                CivicArch <span className="text-[#e9671c]">AI</span>
              </span>
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-serif font-bold leading-tight">
                Upholding <br />
                <span className="text-[#e9671c] italic">Human Rights</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Your gateway to administrative transparency and legal empowerment. We ensure every citizen's right to justice is protected through technology.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="bg-[#e9671c]/20 p-2 rounded-full">
                <ShieldCheck className="text-[#e9671c]" size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Constitutional Safeguards</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Verified Digital Identity</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Form ── */}
        <div className="p-8 lg:p-14 flex flex-col justify-center space-y-8 bg-white">
          <div className="space-y-2 text-left">
            <h3 className="text-3xl font-serif font-bold text-[#1A1A1A]">Sign In</h3>
            <p className="text-stone-500 text-sm">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">Official Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-xl focus:bg-white focus:border-[#e9671c] outline-none text-sm transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[10px] font-bold text-[#e9671c] uppercase tracking-widest hover:underline">
                  ForgotPassword?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-stone-50 border border-stone-100 rounded-xl focus:bg-white focus:border-[#e9671c] outline-none text-sm transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e9671c] hover:bg-[#D35400] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/10 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? 'Authenticating...' : 'Login to Portal'}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-stone-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#e9671c] font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};