import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveDraftComplaint } from '../services/api';
import { toast } from 'sonner';
import { FileText, MapPin, Hash, Sparkles, ArrowLeft } from 'lucide-react';

export default function RtiForm() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Pre-fill the text if they came from the Dashboard AI search
    const [text, setText] = useState(location.state?.initialText || "");
    const [issueLocation, setIssueLocation] = useState("");
    const [pincode, setPincode] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text || !issueLocation || !pincode) {
            toast.error("Please fill in all fields to generate a valid RTI.");
            return;
        }

        setIsGenerating(true);
        try {
            const formData = new FormData();
            // 🔥 Hidden AI Hint: Forces the backend to use the RTI Prompt
            formData.append("text", `[USER INTENT: RIGHT TO INFORMATION REQUEST]\n${text}`);
            formData.append("location", issueLocation);
            formData.append("pincode", pincode);
            formData.append("category", "information_request");

            const response = await saveDraftComplaint(formData);
            toast.success("RTI Draft Generated Successfully!");
            
            // Send data to the Result Page
            navigate('/result', { state: response.data });
        } catch (error) {
            console.error("Draft Generation Error:", error);
            toast.error("Failed to generate draft. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f7f6] p-8 font-sans text-stone-900">
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-stone-500 hover:text-[#e9671c] mb-8 font-bold text-sm uppercase tracking-wider transition-colors">
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-orange-500/20">
                <div className="flex items-center gap-4 mb-8 border-b border-stone-100 pb-6">
                    <div className="bg-[#e9671c] p-3 rounded-2xl text-white shadow-lg shadow-orange-500/30">
                        <FileText size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold">Right to Information (RTI)</h1>
                        <p className="text-stone-500 text-sm">Request official government documents and data.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Information Required</label>
                        <textarea 
                            value={text} onChange={(e) => setText(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-4 min-h-[150px] outline-none focus:border-[#e9671c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                            placeholder="What specific information, document, or record are you seeking?"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 flex items-center gap-1"><MapPin size={14}/> Target Location</label>
                            <input type="text" value={issueLocation} onChange={(e) => setIssueLocation(e.target.value)}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:border-[#e9671c]" placeholder="City or District" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 flex items-center gap-1"><Hash size={14}/> Pincode</label>
                            <input type="number" value={pincode} onChange={(e) => setPincode(e.target.value)}
                                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 outline-none focus:border-[#e9671c]" placeholder="e.g. 400001" />
                        </div>
                    </div>
                    <button type="submit" disabled={isGenerating}
                        className="w-full bg-[#e9671c] hover:bg-[#C0392B] text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                        {isGenerating ? <><Sparkles className="animate-pulse" size={18} /> Generating Legal Draft...</> : "Generate RTI Draft"}
                    </button>
                </form>
            </div>
        </div>
    );
}