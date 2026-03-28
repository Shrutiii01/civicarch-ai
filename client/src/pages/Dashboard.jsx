import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Search, Gavel, FileText, AlertCircle, ShieldAlert, LogOut,
    ChevronRight, ArrowRight, Landmark, Share2, Globe, Send, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function Dashboard() {
    const [query, setQuery] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false); // Used for both UI and state
    const navigate = useNavigate();

    // ── AI Classification Search Logic ──
    const handleSearch = async (e) => {
        if (e) e.preventDefault(); // Prevents page reload on form submit

        // 1. Validation
        if (!query || query.trim().length < 5) {
            toast.error("Please provide a more descriptive issue for AI analysis.");
            return;
        }

        setIsAnalyzing(true); // Replaces the undefined 'setLoading'

        try {
            // 2. Backend API Call
            const response = await axios.post('http://localhost:8000/ai/classify', {
                text: query
            });

            const category = response.data.category; // Expected: 'complaint', 'information_request', or 'grievance'

            // 3. Feedback
            toast.success(`AI identified this as a ${category.replace('_', ' ')}`);

            // 4. Structural Routing based on category
            if (category === "information_request") {
                navigate('/rti-form', { state: { initialText: query } });
            } else if (category === "grievance") {
                navigate('/grievance-form', { state: { initialText: query } });
            } else {
                navigate('/complaint-form', { state: { initialText: query } });
            }

        } catch (error) {
            console.error("AI Classification failed", error);
            toast.error("AI Service is temporarily unavailable. Please select a category manually.");
        } finally {
            setIsAnalyzing(false); // Ensures the button re-enables
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
                <div className="flex items-center gap-2">
                    <div className="bg-[#e9671c] p-1 rounded text-white shadow-md">
                        <Gavel size={16} />
                    </div>
                    <h1 className="font-serif text-lg font-bold italic tracking-tight">
                        CivicArch <span className="text-[#e9671c] not-italic">AI</span>
                    </h1>
                </div>

                <div className="flex items-center gap-6 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                    <Link to="/" className="hover:text-[#e9671c] transition-colors">Home</Link>
                    <Link to="/rti" className="hover:text-[#e9671c] transition-colors">File RTI</Link>
                    <Link to="/heatmap" className="hover:text-[#e9671c] transition-colors">Heatmap</Link>
                    <Link to="/dashboard" className="text-[#e9671c]">Dashboard</Link>
                    <div className="flex items-center gap-3 pl-5 border-l border-stone-200">
                        <span className="text-stone-400 normal-case font-medium italic">Citizen User</span>
                        <button onClick={handleLogout} className="hover:text-red-500 transition-colors">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Refined Hero Section ── */}
            <section className="bg-[#0a0a0a] pt-20 pb-40 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#e9671c]/5 blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 space-y-3">
                    <h2 className="text-4xl font-serif font-bold text-white tracking-tight">
                        Welcome back, <span className="text-[#e9671c] italic">Citizen</span>
                    </h2>
                    <p className="text-stone-500 text-sm font-light tracking-wide">Select a service or search your issue below</p>
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
                            <Landmark size={18} className="text-[#e9671c]" /> CivicArch AI
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