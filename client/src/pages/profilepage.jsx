import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Integrated with your backend instance
import {
    User, Mail, Phone, MapPin, Hash, ShieldCheck,
    FileText, AlertCircle, Trash2, Download, Edit3,
    Camera, Lock, Clock, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

const CitizenProfile = () => {
    const [userData, setUserData] = useState(null);
    const [counts, setCounts] = useState({ rti: 0, grievances: 0, complaints: 0 });
    const [loading, setLoading] = useState(true);

    // ── Data Fetching ──
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // 1. Fetch User Details (using your existing auth logic)
                const userRes = await api.get("/auth/me");
                setUserData(userRes.data);

                // 2. Fetch History to calculate summary counts
                const historyRes = await api.get("/complaints/history");
                const submitted = historyRes.data.submitted_complaints || [];

                setCounts({
                    rti: submitted.filter(i => i.request_type === 'information_request').length,
                    grievances: submitted.filter(i => i.request_type === 'grievance').length,
                    complaints: submitted.filter(i => i.request_type === 'complaint').length,
                });
            } catch (error) {
                console.error("Profile load failed:", error);
                toast.error("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const activitySummary = [
        { label: "RTI FILED", count: counts.rti, icon: <FileText size={20} className="text-[#e9671c]" /> },
        { label: "GRIEVANCES", count: counts.grievances, icon: <ShieldCheck size={20} className="text-blue-600" /> },
        { label: "COMPLAINTS", count: counts.complaints, icon: <AlertCircle size={20} className="text-red-600" /> },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#e9671c]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-slate-900 pb-20">
            <div className="max-w-7xl mx-auto px-10 py-16">

                {/* Page Header - High Contrast */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-5xl font-serif font-bold text-slate-900 mb-3 tracking-tight">Citizen Profile</h1>
                        <p className="text-slate-600 text-lg font-medium opacity-90">Manage your secure identity and data preferences.</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-black uppercase tracking-widest shadow-md hover:border-[#e9671c] transition-all">
                        <Edit3 size={18} /> Edit Profile
                    </button>
                </div>

                {/* Top Info Card - Deepened Shadows & Borders */}
                <div className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/60 border-2 border-slate-100 flex flex-col md:flex-row items-center gap-10 mb-10">
                    <div className="relative">
                        <div className="w-32 h-32 bg-slate-100 rounded-full border-2 border-slate-200 flex items-center justify-center shadow-inner">
                            <User size={64} className="text-slate-400" />
                        </div>
                        <button className="absolute bottom-1 right-1 p-2.5 bg-[#e9671c] text-white rounded-full border-4 border-white shadow-lg hover:scale-110 transition-transform">
                            <Camera size={16} />
                        </button>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                            <h2 className="text-4xl font-serif font-bold text-slate-900">{userData?.name || "Citizen User"}</h2>
                            <span className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 text-xs font-black uppercase tracking-widest rounded-full border-2 border-green-200">
                                <CheckCircle size={14} /> Verified Citizen
                            </span>
                        </div>
                        <p className="text-slate-700 text-base mb-6 flex items-center justify-center md:justify-start gap-2 font-bold">
                            <Mail size={18} className="text-[#e9671c]" /> {userData?.email}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <span className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-black text-slate-500 border-2 border-slate-100 uppercase tracking-widest">
                                User ID: {userData?.id?.slice(0, 8).toUpperCase() || "CA-PENDING"}
                            </span>
                            <span className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-black text-slate-500 border-2 border-slate-100 uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} /> Joined March 2024
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    <div className="lg:col-span-2 space-y-10">
                        {/* Personal Information - High Visibility Form */}
                        <div className="bg-white rounded-[40px] p-12 shadow-lg border-2 border-slate-100">
                            <h3 className="text-2xl font-serif font-bold flex items-center gap-4 mb-10 text-slate-900">
                                <div className="p-3 bg-orange-50 rounded-2xl text-[#e9671c] border border-orange-100">
                                    <User size={24} />
                                </div>
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputField label="Full Name" value={userData?.name} />
                                <InputField label="Email Address" value={userData?.email} />
                                <InputField label="Phone Number" value={userData?.phone || "+91 XXXXX XXXXX"} />
                                <InputField label="Pincode" value={userData?.pincode || "XXXXXX"} />
                                <div className="md:col-span-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">Residential Address</label>
                                    <textarea
                                        readOnly
                                        value={userData?.location || "No address provided."}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] p-5 h-32 text-sm font-bold text-slate-700 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Data Protection - Strengthened UI */}
                        <div className="bg-white rounded-[40px] p-12 shadow-lg border-2 border-slate-100">
                            <h3 className="text-2xl font-serif font-bold flex items-center gap-4 mb-10 text-slate-900">
                                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100">
                                    <ShieldCheck size={24} />
                                </div>
                                Data Protection & Privacy
                            </h3>

                            <div className="bg-blue-50 border-2 border-blue-100 p-8 rounded-3xl flex items-start gap-5 mb-12">
                                <Lock size={24} className="text-blue-600 shrink-0 mt-1" />
                                <p className="text-sm leading-relaxed text-slate-700 font-medium">
                                    <span className="font-black text-blue-700 uppercase tracking-tighter mr-2">Legal Compliance:</span>
                                    Your data is handled in strict compliance with the <span className="font-bold text-slate-900">Digital Personal Data Protection Act (DPDP Act, 2023)</span> and the <span className="font-bold text-blue-700 underline decoration-2 underline-offset-4">Right to Privacy (Article 21)</span> of the Constitution of India.
                                </p>
                            </div>

                            <div className="space-y-12">
                                <ToggleItem title="Draft Storage" desc="Allow secure storage of your document drafts for later editing." />
                                <ToggleItem title="AI Processing" desc="Allow AI to process your inputs to generate structured legal formats." />
                                <ToggleItem title="Usage Analytics" desc="Help us improve the platform by sharing anonymized usage patterns." />
                            </div>

                            <div className="mt-16 pt-10 border-t-2 border-slate-50 flex justify-between items-center">
                                <button className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-[#e9671c] transition-colors">
                                    <Download size={18} /> Download My Data (JSON)
                                </button>
                                <button className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors">
                                    <Trash2 size={18} /> Delete My Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Sharp contrast */}
                    <div className="space-y-10">
                        <div className="bg-white rounded-[40px] p-10 shadow-lg border-2 border-slate-100">
                            <h3 className="text-2xl font-serif font-bold flex items-center gap-4 mb-10 text-slate-900">
                                <FileText size={24} className="text-[#e9671c]" /> Activity Summary
                            </h3>
                            <div className="space-y-5">
                                {activitySummary.map((item, idx) => (
                                    <div key={idx} className="p-6 bg-slate-50 border-2 border-slate-50 rounded-[28px] flex items-center justify-between group hover:border-[#e9671c]/20 transition-all">
                                        <div>
                                            <span className="text-[11px] font-black text-slate-400 block mb-2 tracking-[0.2em] uppercase">{item.label}</span>
                                            <span className="text-4xl font-serif font-bold text-slate-900">{item.count}</span>
                                        </div>
                                        <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-100">
                                            {item.icon}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-4 border-dashed border-slate-200 rounded-[40px] p-10 text-center bg-white/50 shadow-inner">
                            <p className="text-xs leading-relaxed text-slate-500 font-bold uppercase tracking-wide">
                                Your data is encrypted and securely stored. CivicArch AI ensures complete confidentiality and adheres to national data protection standards.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Sub-components with increased contrast
const InputField = ({ label, value }) => (
    <div>
        <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">{label}</label>
        <input
            type="text"
            readOnly
            value={value || "Not provided"}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:border-[#e9671c]"
        />
    </div>
);

const ToggleItem = ({ title, desc }) => (
    <div className="flex justify-between items-center group">
        <div className="max-w-[75%]">
            <h4 className="text-base font-black text-slate-800 mb-1.5 uppercase tracking-tight">{title}</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
        <div className="relative inline-block w-12 h-7">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:bg-[#e9671c] transition-all duration-300 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 shadow-inner border border-slate-300 peer-checked:border-[#d15616]"></div>
        </div>
    </div>
);

export default CitizenProfile;