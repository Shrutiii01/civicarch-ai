import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Landmark, LogOut } from 'lucide-react';
import api from '../services/api';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (token) {
            api.get("/auth/me")
                .then(res => {
                    if (res.data && res.data.name) {
                        setUserName(res.data.name);
                    }
                })
                .catch(err => console.error("Navbar failed to fetch user:", err));
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Hide Navbar on pure auth pages to keep them clean
    const hideOnRoutes = ['/login', '/signup', '/verify-otp', '/forgot-password', '/reset-password'];
    if (hideOnRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm w-full">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* Logo */}
                <Link to={token ? "/Dashboard" : "/"} className="flex items-center gap-3">
                    <div className="bg-[#e9671c] p-1.5 rounded-lg text-white shadow-md">
                        <Landmark size={22} />
                    </div>
                    <div>
                        <h1 className="font-serif text-xl font-bold leading-none text-slate-900">CivicArch AI</h1>
                    </div>
                </Link>

                {/* Links */}
                <div className="hidden md:flex items-center gap-8">
                    {!token ? (
                        <>
                            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-[#e9671c] transition-colors">Home</Link>
                            <Link to="/aboutus" className="text-sm font-semibold text-slate-600 hover:text-[#e9671c] transition-colors">About Us</Link>
                            <Link to="/howitwork" className="text-sm font-semibold text-slate-600 hover:text-[#e9671c] transition-colors">How It Works</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/Dashboard" className="text-sm font-semibold text-slate-600 hover:text-[#e9671c] transition-colors">Dashboard</Link>
                            <Link to="/complaint" className="text-sm font-semibold text-slate-600 hover:text-[#e9671c] transition-colors">File Request</Link>
                            <Link to="/history" className="text-sm font-semibold text-slate-600 hover:text-[#e9671c] transition-colors">History</Link>
                            <Link to="/profile" className="text-sm font-semibold text-slate-600 hover:text-[#e9671c] transition-colors">Profile</Link>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    {!token ? (
                        <Link to="/login" className="bg-[#e9671c] hover:bg-[#C0392B] text-white px-6 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all shadow-md">
                            LOGIN
                        </Link>
                    ) : (
                        <div className="flex items-center gap-4 pl-4 border-l border-stone-200">
                            <Link to="/profile" className="h-10 w-10 bg-orange-500/20 rounded-full flex items-center justify-center overflow-hidden border border-orange-500/30 hover:ring-2 hover:ring-[#e9671c] transition-all shadow-sm" title="Go to Profile">
                                <img className="w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "User")}&background=e9671c&color=fff`} alt={userName || "User"} />
                            </Link>
                            <button onClick={handleLogout} className="p-2.5 bg-red-50 border border-red-100 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm" title="Logout">
                                <LogOut size={16} />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
}
