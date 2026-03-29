import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
    User, Mail, Phone, MapPin, Hash, ShieldCheck,
    FileText, AlertCircle, Trash2, Download, Edit3,
    Camera, Lock, Clock, CheckCircle, Landmark, Save, X
} from 'lucide-react';
import { toast } from 'sonner';

const CitizenProfile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        pincode: "",
        location: ""
    });
    const [counts, setCounts] = useState({ rti: 0, grievances: 0, complaints: 0 });
    const [loading, setLoading] = useState(true);
    
    // 🔥 NEW: State to track if the user is editing their profile
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // ── Data Fetching ──
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // 1. Fetch User Details
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

    // 🔥 NEW: Handle Input Changes during Edit Mode
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 🔥 NEW: Save Updated Data to Backend
    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            // NOTE: Ensure your FastAPI backend has a PUT route for /auth/me or similar to handle this update
            await api.put("/auth/me", {
                name: userData.name,
                phone: userData.phone,
                pincode: userData.pincode,
                location: userData.location
                // Email is usually not editable, or requires separate verification
            });
            
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Could not save changes. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    const activitySummary = [
        { label: "RTI FILED", count: counts.rti, icon: <FileText size={18} className="text-[#e9671c]" /> },
        { label: "GRIEVANCES", count: counts.grievances, icon: <ShieldCheck size={18} className="text-blue-600" /> },
        { label: "COMPLAINTS", count: counts.complaints, icon: <AlertCircle size={18} className="text-red-600" /> },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f7f6] font-['Inter']">
            <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-[#e9671c]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8f7f6] font-['Inter'] text-slate-900 pb-20">
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

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
                    <Link to="/dashboard" className="hover:text-[#e9671c] transition-colors">Dashboard</Link>
                    <Link to="/history" className="hover:text-[#e9671c] transition-colors">History</Link>
                    <Link to="/heatmap" className="hover:text-[#e9671c] transition-colors">Heatmap</Link>
                    <Link to="/profile" className="text-[#e9671c]">Profile</Link>
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

            <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2 tracking-tight">Citizen Profile</h1>
                        <p className="text-slate-500 text-sm md:text-base font-medium">Manage your secure identity and data preferences.</p>
                    </div>
                    
                    {/* 🔥 NEW: Toggle Edit/Save/Cancel Buttons */}
                    <div className="flex gap-3 w-full md:w-auto">
                        {isEditing ? (
                            <>
                                <button 
                                    onClick={() => setIsEditing(false)} 
                                    disabled={isSaving}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all text-slate-500"
                                >
                                    <X size={16} /> Cancel
                                </button>
                                <button 
                                    onClick={handleSaveProfile} 
                                    disabled={isSaving}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#e9671c] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-md hover:bg-[#d15616] transition-all disabled:opacity-50"
                                >
                                    {isSaving ? <span className="animate-spin material-symbols-outlined text-[16px]">sync</span> : <Save size={16} />}
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:border-[#e9671c] hover:text-[#e9671c] transition-all w-full md:w-auto"
                            >
                                <Edit3 size={16} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Top Info Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 bg-slate-50 rounded-full border-2 border-slate-200 flex items-center justify-center">
                            <User size={40} className="text-slate-400" />
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-[#e9671c] text-white rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform">
                            <Camera size={14} />
                        </button>
                    </div>
                    <div className="flex-1 text-center md:text-left w-full">
                        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                            <h2 className="text-2xl font-serif font-bold text-slate-900">{userData?.name || "Citizen User"}</h2>
                            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200">
                                <CheckCircle size={12} /> Verified Citizen
                            </span>
                        </div>
                        <p className="text-slate-600 text-sm mb-5 flex items-center justify-center md:justify-start gap-2 font-medium">
                            <Mail size={16} className="text-[#e9671c]" /> {userData?.email}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="bg-slate-50 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200 uppercase tracking-widest">
                                User ID: {userData?.id?.slice(0, 8).toUpperCase() || "CA-PENDING"}
                            </span>
                            <span className="bg-slate-50 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                                <Clock size={12} /> Joined March 2024
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-8">
                        {/* Personal Information Form */}
                        <div className={`bg-white rounded-3xl p-8 shadow-sm border ${isEditing ? 'border-[#e9671c]/50 ring-4 ring-[#e9671c]/5' : 'border-slate-100'} transition-all`}>
                            <h3 className="text-xl font-serif font-bold flex items-center gap-3 mb-8 text-slate-900">
                                <div className="p-2 bg-orange-50 rounded-lg text-[#e9671c] border border-orange-100">
                                    <User size={18} />
                                </div>
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField 
                                    label="Full Name" 
                                    name="name"
                                    value={userData?.name} 
                                    isEditing={isEditing} 
                                    onChange={handleInputChange} 
                                />
                                <InputField 
                                    label="Email Address" 
                                    name="email"
                                    value={userData?.email} 
                                    isEditing={false} // Typically, emails cannot be changed freely
                                    onChange={handleInputChange} 
                                />
                                <InputField 
                                    label="Phone Number" 
                                    name="phone"
                                    value={userData?.phone} 
                                    isEditing={isEditing} 
                                    onChange={handleInputChange} 
                                />
                                <InputField 
                                    label="Pincode" 
                                    name="pincode"
                                    value={userData?.pincode} 
                                    isEditing={isEditing} 
                                    onChange={handleInputChange} 
                                />
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2 block">Residential Address</label>
                                    <textarea
                                        readOnly={!isEditing}
                                        name="location"
                                        value={userData?.location || ""}
                                        onChange={handleInputChange}
                                        placeholder={isEditing ? "Enter your full address..." : "Not provided"}
                                        className={`w-full rounded-xl p-4 h-24 text-sm font-semibold outline-none resize-none transition-all ${
                                            isEditing 
                                                ? "bg-white border-2 border-[#e9671c]/30 text-slate-900 focus:border-[#e9671c] shadow-inner" 
                                                : "bg-slate-50 border border-slate-200 text-slate-700"
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Data Protection */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h3 className="text-xl font-serif font-bold flex items-center gap-3 mb-8 text-slate-900">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 border border-blue-100">
                                    <ShieldCheck size={18} />
                                </div>
                                Data Protection & Privacy
                            </h3>

                            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4 mb-8">
                                <Lock size={20} className="text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-xs leading-relaxed text-slate-700 font-medium">
                                    <span className="font-bold text-blue-700 uppercase tracking-tight mr-1">Legal Compliance:</span>
                                    Your data is handled in strict compliance with the <span className="font-semibold text-slate-900">Digital Personal Data Protection Act (DPDP Act, 2023)</span> and the <span className="font-semibold text-blue-700">Right to Privacy (Article 21)</span>.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <ToggleItem title="Draft Storage" desc="Allow secure storage of your document drafts for later editing." />
                                <ToggleItem title="AI Processing" desc="Allow AI to process your inputs to generate structured legal formats." />
                                <ToggleItem title="Usage Analytics" desc="Help us improve the platform by sharing anonymized usage patterns." />
                            </div>

                            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-[#e9671c] transition-colors w-full sm:w-auto justify-center">
                                    <Download size={14} /> Download My Data (JSON)
                                </button>
                                <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors w-full sm:w-auto justify-center">
                                    <Trash2 size={14} /> Delete My Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h3 className="text-xl font-serif font-bold flex items-center gap-3 mb-6 text-slate-900">
                                <FileText size={20} className="text-[#e9671c]" /> Activity Summary
                            </h3>
                            <div className="space-y-4">
                                {activitySummary.map((item, idx) => (
                                    <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-[#e9671c]/30 transition-all">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-500 block mb-1 tracking-[0.15em] uppercase">{item.label}</span>
                                            <span className="text-2xl font-serif font-bold text-slate-900">{item.count}</span>
                                        </div>
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                            {item.icon}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center bg-slate-50/50">
                            <p className="text-[11px] leading-relaxed text-slate-500 font-semibold uppercase tracking-wide">
                                Your data is encrypted and securely stored. JanSahaay ensures complete confidentiality.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// 🔥 UPDATED: InputField now supports editing based on the isEditing flag
const InputField = ({ label, name, value, isEditing, onChange }) => (
    <div>
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-2 block">
            {label} {isEditing && name !== 'email' && <span className="text-red-400">*</span>}
        </label>
        <input
            type="text"
            name={name}
            readOnly={!isEditing}
            value={value || ""}
            onChange={onChange}
            placeholder={isEditing ? `Enter ${label.toLowerCase()}` : "Not provided"}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-all ${
                isEditing 
                    ? "bg-white border-2 border-[#e9671c]/30 text-slate-900 focus:border-[#e9671c] shadow-inner" 
                    : "bg-slate-50 border border-slate-200 text-slate-700"
            } ${!isEditing && !value ? 'italic text-slate-400' : ''}`}
        />
    </div>
);

const ToggleItem = ({ title, desc }) => (
    <div className="flex justify-between items-center group gap-4">
        <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-800 mb-1">{title}</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
        <div className="relative inline-block w-10 h-5 shrink-0 cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-[#e9671c] transition-all duration-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 shadow-inner"></div>
        </div>
    </div>
);

export default CitizenProfile;