import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ProcessingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [progress, setProgress] = useState(0);

    // Grab the data passed from ComplaintPage
    const complaintData = location.state;

    useEffect(() => {
        // Guard: If no data exists, redirect back to form
        if (!complaintData) {
            navigate("/complaint");
            return;
        }

        // Fast progress from 0 to 100
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 30); // 3 seconds total for smooth loading

        return () => clearInterval(interval);
    }, [complaintData, navigate]);

    // Separate effect for the navigation trigger once 100 is reached
    useEffect(() => {
        if (progress === 100) {
            const timeout = setTimeout(() => {
                navigate("/result", { state: complaintData });
            }, 600);
            return () => clearTimeout(timeout);
        }
    }, [progress, navigate, complaintData]);

    return (
        <div className="bg-[#fdfbf9] min-h-screen font-['Inter'] text-slate-900 antialiased flex flex-col">
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <style>{`
                .progress-ring-circle {
                    transition: stroke-dashoffset 0.1s linear;
                    transform: rotate(-90deg);
                    transform-origin: 50% 50%;
                }
            `}</style>

            <header className="flex items-center justify-between border-b border-[#e9671c]/10 px-6 md:px-20 py-4 bg-[#fdfbf9]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-[#e9671c] rounded-lg text-white">
                        <span className="material-symbols-outlined">account_balance</span>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight font-serif">
                        CivicArch <span className="text-[#e9671c]">AI</span>
                    </h2>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-4xl mx-auto w-full">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl text-slate-900 mb-4">Processing Your Request</h1>
                    <p className="text-[#99694d] text-lg max-w-lg mx-auto leading-relaxed">
                        Our Gemini engine is synthesizing your legal documentation with institutional precision.
                    </p>
                </div>

                <div className="relative flex items-center justify-center mb-16">
                    <div className="absolute w-72 h-72 rounded-full border border-[#e9671c]/5 animate-pulse"></div>
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle className="text-[#e9671c]/10 stroke-current" cx="50" cy="50" fill="transparent" r="45" strokeWidth="4"></circle>
                            <circle
                                className="text-[#e9671c] stroke-current progress-ring-circle"
                                cx="50" cy="50" fill="transparent" r="45" strokeLinecap="round" strokeWidth="4"
                                style={{
                                    strokeDasharray: '282.7',
                                    strokeDashoffset: (282.7 - (282.7 * progress) / 100)
                                }}
                            ></circle>
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center text-center">
                            <span className="text-6xl font-bold text-slate-900 tracking-tighter">
                                {progress}<span className="text-3xl text-[#e9671c]">%</span>
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#99694d] mt-2">Synthesizing</span>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-[#e9671c]/5 overflow-hidden">
                    <div className="p-4 border-b border-[#e9671c]/5 bg-[#e9671c]/5 flex justify-between items-center">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Live Synthesis Pipeline</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#e9671c]">LIVE ENGINE ACTIVE</span>
                        </div>
                    </div>

                    <div className="divide-y divide-[#e9671c]/5">
                        <div className="flex items-center gap-4 px-6 py-6 bg-emerald-50/30">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <span className="material-symbols-outlined text-xl">check_circle</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-900 font-bold">Normalizing Input</p>
                                <p className="text-slate-600 text-xs mt-0.5">Structural linguistics applied</p>
                            </div>
                        </div>

                        <div className={`flex items-center gap-4 px-6 py-6 transition-colors ${progress > 40 ? 'bg-emerald-50/30' : 'bg-white'}`}>
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${progress > 40 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                <span className="material-symbols-outlined text-xl">{progress > 40 ? 'check_circle' : 'hourglass_empty'}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-900 font-bold">Identifying Department</p>
                                <p className="text-slate-600 text-xs mt-0.5">RAG Engine: Mapping departmental vectors</p>
                            </div>
                        </div>

                        <div className={`flex items-center gap-4 px-6 py-6 transition-colors ${progress === 100 ? 'bg-emerald-50/30' : 'bg-white ring-1 ring-[#e9671c]/20'}`}>
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${progress === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-[#e9671c]/10 text-[#e9671c] animate-spin'}`}>
                                <span className="material-symbols-outlined text-xl">{progress === 100 ? 'check_circle' : 'progress_activity'}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-900 font-bold">Drafting Final Documentation</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProcessingPage;