import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Search, Gavel, FileText, AlertCircle, ShieldAlert, LogOut,
    ChevronRight, ArrowRight, Landmark, Share2, Globe, Send, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { classifyIssue } from '../services/api'; 

// 🔥 Import your uploaded background images here (adjust the path if needed)
import rti1 from '../assets/rti1.jpeg';
import rti2 from '../assets/rti2.jpeg';
import rti3 from '../assets/rti3.jpeg';

export default function Dashboard() {
    const [query, setQuery] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false); 
    const navigate = useNavigate();

    // 🔥 NEW: State for tracking the current background image index
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const backgroundImages = [rti1, rti2, rti3];

    // 🔥 NEW: Effect to cycle through the background images every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 4000); 
        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    // ── AI Classification Search Logic (UNTOUCHED) ──
    const handleSearch = async (e) => {
        if (e) e.preventDefault(); 

        if (!query || query.trim().length < 5) {
            toast.error("Please provide a more descriptive issue for AI analysis.");
            return;
        }

        setIsAnalyzing(true); 

        try {
            const response = await classifyIssue(query);
            const category = response.data.category; 

            toast.success(`AI identified this as a ${category.replace('_', ' ').toUpperCase()}`);

            // 4. Structural Routing with a tiny delay so the toast is visible
            setTimeout(() => {
                // Force lowercase to ensure safe matching
                const safeCategory = category.toLowerCase();

                // Use .includes() so "grievance." or "information_request " still match perfectly
                if (safeCategory.includes("information") || safeCategory.includes("rti")) {
                    navigate('/rti-form', { state: { initialText: query } });
                } else if (safeCategory.includes("grievance")) {
                    navigate('/grievance-form', { state: { initialText: query } });
                } else {
                    // Default fallback
                    navigate('/complaint-form', { state: { initialText: query } });
                }
            }, 1000);

        } catch (error) {
            console.error("AI Classification failed", error);
            toast.error("AI Service is temporarily unavailable. Please select a category manually.");
        } finally {
            setIsAnalyzing(false); 
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#1A1A1A]">
            {/* ── Navbar ── */}
            <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="bg-[#e9671c] p-1.5 rounded-sm text-white">
                        <Landmark size={24} />
                    </div>
                    <div>
                        <h1 className="font-serif text-xl font-bold leading-none">JanSahaay</h1>
                    </div>
                </div>

                <div className="flex items-center gap-6 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                    <Link to="/dashboard" className="text-[#e9671c]">Dashboard</Link>
                    <Link to="/history" className="hover:text-[#e9671c] transition-colors">History</Link>
                    <Link to="/heatmap" className="hover:text-[#e9671c] transition-colors">Heatmap</Link>
                    <Link to="/profile" className="hover:text-[#e9671c] transition-colors">Profile</Link>
                    <div className="flex items-center gap-3 pl-5 border-l border-stone-200">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-semibold text-sm rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">logout</span>
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Refined Hero Section ── */}
            <section className="bg-[#0a0a0a] pt-20 pb-40 px-4 text-center relative overflow-hidden">
                
                {/* 🔥 NEW: Background Slideshow Layer */}
                {backgroundImages.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                            idx === currentBgIndex ? "opacity-25" : "opacity-0"
                        }`}
                    >
                        {/* Using object-cover to ensure it fills the div, and grayscale to make it look highly professional/institutional */}
                        <img 
                            src={img} 
                            alt="Background" 
                            className="w-full h-full object-cover grayscale mix-blend-overlay" 
                        />
                    </div>
                ))}

                {/* Existing Orange Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#e9671c]/10 blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 space-y-3">
                    <h2 className="text-4xl font-serif font-bold text-white tracking-tight">
                        Welcome back, <span className="text-[#e9671c] italic">Citizen</span>
                    </h2>
                    <p className="text-stone-400 text-sm font-light tracking-wide">Select a service or search your issue below</p>
                </div>

                {/* ── Search Bar ── */}
                <div className="max-w-2xl mx-auto mt-10 relative z-20">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            {isAnalyzing ? <Sparkles className="text-[#e9671c] animate-pulse" size={18} /> : <Search className="text-stone-500" size={18} />}
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={isAnalyzing ? "Classifying with Llama-3.1..." : "Search issue (e.g., 'broken lights')..."}
                            className="w-full bg-white text-stone-900 pl-12 pr-36 py-4 rounded-2xl outline-none shadow-xl text-sm transition-all border-2 border-transparent focus:border-[#e9671c]/30"
                            disabled={isAnalyzing}
                        />
                        <button
                            type="submit"
                            disabled={isAnalyzing || !query.trim()}
                            className="absolute right-2 top-2 bottom-2 bg-[#e9671c] hover:bg-[#D35400] text-white px-6 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isAnalyzing ? "Processing..." : "Search"}
                        </button>
                    </form>
                </div>
            </section>

            {/* ── Refined Institutional Cards ── */}
            <section className="max-w-6xl mx-auto px-6 -mt-20 relative z-30 grid grid-cols-1 md:grid-cols-3 gap-6 pb-24">
                {[
                    { title: "Grievance", icon: AlertCircle, color: "blue", desc: "Report issues like water or roads to local authorities.", route: "/grievance-form" },
                    { title: "Right to Information", icon: FileText, color: "orange", desc: "Request official data or check status of projects.", route: "/rti-form", highlight: true },
                    { title: "Complaint", icon: ShieldAlert, color: "red", desc: "File formal complaints for legal violations.", route: "/complaint-form" }
                ].map((card, i) => (
                    <div
                        key={i}
                        className={`bg-white p-8 rounded-[32px] shadow-xl border border-stone-100 flex flex-col items-center text-center transition-all hover:-translate-y-2 ${card.highlight ? 'ring-2 ring-[#e9671c]/10' : ''}`}
                    >
                        <div className={`p-4 rounded-2xl text-white mb-6 ${card.color === 'blue' ? 'bg-blue-500' : card.color === 'orange' ? 'bg-[#e9671c]' : 'bg-red-500'}`}>
                            <card.icon size={28} />
                        </div>
                        <h4 className="text-lg font-serif font-bold mb-3">{card.title}</h4>
                        <p className="text-stone-500 text-xs leading-relaxed mb-6 px-2">{card.desc}</p>
                        <Link to={card.route} className="text-[#e9671c] font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                            Initialize <ChevronRight size={14} />
                        </Link>
                    </div>
                ))}
            </section>

            {/* ── Compact Footer ── */}
            <footer className="bg-[#0a0a0a] text-white py-12 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-[11px] uppercase font-bold tracking-widest text-stone-500">
                    <div className="normal-case font-medium text-xs space-y-4">
                        <div className="flex items-center gap-2 text-white font-serif text-base font-bold">
                            <Landmark size={18} className="text-[#e9671c]" /> JanSahaay
                        </div>
                        <p className="leading-relaxed">Institutional digital governance infrastructure for the modern citizen.</p>
                    </div>
                    <div className="space-y-3">
                        <h5 className="text-[#e9671c] mb-4">Resources</h5>
                        <Link to="/guidelines" className="block hover:text-white">RTI Guidelines</Link>
                        <Link to="/charter" className="block hover:text-white">Citizen Charter</Link>
                    </div>
                    <div className="space-y-3">
                        <h5 className="text-[#e9671c] mb-4">Organization</h5>
                        <Link to="/about" className="block hover:text-white">About Us</Link>
                        <Link to="/legal" className="block hover:text-white">Legal Notice</Link>
                    </div>
                    <div className="normal-case">
                        <h5 className="text-[#e9671c] uppercase tracking-widest mb-4">Updates</h5>
                        <div className="flex bg-white/5 rounded-lg overflow-hidden border border-white/10">
                            <input className="bg-transparent px-3 py-2 w-full outline-none" placeholder="Email" />
                            <button className="bg-[#e9671c] px-3"><Send size={14} className="text-white" /></button>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}