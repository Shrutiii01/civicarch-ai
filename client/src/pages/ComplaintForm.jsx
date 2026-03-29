import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveDraftComplaint } from '../services/api';
import { toast } from 'sonner';
import { ShieldAlert, MapPin, Hash, Sparkles, ArrowLeft } from 'lucide-react';

export default function ComplaintForm() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [text, setText] = useState(location.state?.initialText || "");
    const [issueLocation, setIssueLocation] = useState("");
    const [pincode, setPincode] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text || !issueLocation || !pincode) return toast.error("All fields are required.");

        setIsGenerating(true);
        try {
            const formData = new FormData();
            // 🔥 Hidden AI Hint: Forces the backend to use the Complaint Prompt
            formData.append("text", `[USER INTENT: FORMAL CIVIC COMPLAINT]\n${text}`);
            formData.append("location", issueLocation);
            formData.append("pincode", pincode);
            formData.append("category", "complaint");

            const response = await saveDraftComplaint(formData);
            toast.success("Complaint Draft Generated!");
            navigate('/result', { state: response.data });
        } catch (error) {
            toast.error("Failed to generate draft. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f7f6] p-8 font-sans text-stone-900">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-stone-500 hover:text-red-600 mb-8 font-bold text-sm uppercase tracking-wider transition-colors">
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-red-500/20">
                <div className="flex items-center gap-4 mb-8 border-b border-stone-100 pb-6">
                    <div className="bg-red-600 p-3 rounded-2xl text-white shadow-lg shadow-red-500/30">
                        <ShieldAlert size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold">Formal Complaint</h1>
                        <p className="text-stone-500 text-sm">Report physical issues like potholes, waste, or broken infrastructure.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Description of Violation/Issue</label>
                        <textarea 
                            value={text} onChange={(e) => setText(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 min-h-[150px] outline-none focus:border-red-600 focus:ring-2 focus:ring-red-500/20 transition-all"
                            placeholder="Describe the physical issue in detail..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 flex items-center gap-1"><MapPin size={14}/> Exact Location</label>
                            <input type="text" value={issueLocation} onChange={(e) => setIssueLocation(e.target.value)}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:border-red-600" placeholder="Street name or landmark" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 flex items-center gap-1"><Hash size={14}/> Pincode</label>
                            <input type="number" value={pincode} onChange={(e) => setPincode(e.target.value)}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:border-red-600" placeholder="e.g. 400001" />
                        </div>
                    </div>
                    <button type="submit" disabled={isGenerating}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                        {isGenerating ? <><Sparkles className="animate-pulse" size={18} /> Generating Legal Draft...</> : "Generate Complaint Draft"}
                    </button>
                </form>
            </div>
        </div>
    );
}