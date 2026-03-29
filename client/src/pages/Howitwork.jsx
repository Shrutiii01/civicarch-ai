import React from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Mic,
    FileText,
    Send,
    Landmark,
    Share2,
    Globe
} from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            id: "01",
            title: "Intelligent Search",
            description: "Describe your issue in plain English. Our AI detects your intent and routes you to the correct module—RTI, Grievance, or Complaint.",
            icon: <Search className="w-8 h-8 text-[#e9671c]" />,
        },
        {
            id: "02",
            title: "Multi-Modal Input",
            description: "Provide details your way. Type it out, upload a photo of the issue, attach a PDF, or simply speak to our AI assistant.",
            icon: <Mic className="w-8 h-8 text-[#e9671c]" />,
        },
        {
            id: "03",
            title: "AI Document Generation",
            description: "Our engine processes your input and generates a perfectly structured, legally compliant document based on official government templates.",
            icon: <FileText className="w-8 h-8 text-[#e9671c]" />,
        },
        {
            id: "04",
            title: "Verify & Submit",
            description: "Review the generated document, save it as a draft, download it as a PDF, or submit it directly to the concerned authority.",
            icon: <Send className="w-8 h-8 text-[#e9671c]" />,
        }
    ];

    return (
        <section className="bg-stone-50 font-sans min-h-screen">
            {/* NAVIGATION BAR */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-10 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#e9671c] p-1.5 rounded-sm text-white">
                            <Landmark size={24} />
                        </div>
                        <h1 className="font-serif text-xl font-bold leading-none text-stone-900">JanSahaay</h1>
                    </div>

                    <div className="hidden lg:flex items-center gap-10">
                        <Link to="/" className="text-sm font-semibold hover:text-[#e9671c] transition-colors">Home</Link>
                        <Link to="/aboutus" className="text-sm font-semibold hover:text-[#e9671c] transition-colors">About us</Link>
                        <Link to="/howitwork" className="text-sm font-semibold text-[#e9671c]" >How It Works</Link>
                        <Link to="/heatmap" className="text-sm font-semibold hover:text-[#e9671c] transition-colors">Heatmap</Link>
                    </div>

                    <Link to="/login" className="bg-[#e9671c] hover:bg-[#C0392B] text-white px-6 py-2.5 rounded-sm font-bold text-sm tracking-wide transition-all shadow-md">
                        LOGIN / START FILING
                    </Link>
                </div>
            </nav>

            {/* Header Section - More substantial height and visual depth */}
            <div className="relative bg-[#111] text-white py-32 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e9671c 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6">How It Works</h2>
                    <p className="text-stone-400 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed font-light">
                        The seamless journey from a civic problem to a structured administrative solution.
                        Democratizing justice through intelligent automation.
                    </p>
                </div>
            </div>

            {/* Steps Section - Switched to a Grid to fill space */}
            <div className="max-w-7xl mx-auto py-24 px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {steps.map((step) => (
                        <div key={step.id} className="group bg-white p-10 rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-start">
                            <div className="flex justify-between items-start w-full mb-8">
                                <div className="w-16 h-16 bg-stone-50 rounded-xl flex items-center justify-center border border-stone-100 group-hover:scale-110 group-hover:bg-[#e9671c]/5 transition-transform duration-300">
                                    {step.icon}
                                </div>
                                <span className="text-4xl font-serif font-black text-stone-100 group-hover:text-[#e9671c]/10 transition-colors">{step.id}</span>
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">{step.title}</h3>
                            <p className="text-stone-600 leading-relaxed text-base">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section - Full Width Visual Impact */}
            <div className="max-w-7xl mx-auto px-10 pb-24">
                <div className="relative bg-[#fb711f] rounded-[2.5rem] p-16 text-center text-white shadow-2xl overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-serif font-bold mb-6">Ready to take action?</h2>
                        <p className="text-orange-50 mb-10 max-w-2xl mx-auto opacity-90 text-lg">
                            Join thousands of citizens who are using JanSahaay to improve their communities.
                            Start your application today and track it in real-time.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-[#fb711f] px-12 py-4 rounded-xl font-bold text-lg hover:bg-stone-100 transition-colors shadow-lg">
                                <Link to="/login" >
                                    Get Started Now
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-[#1A1A1A] text-white pt-24 pb-12 border-t-4 border-[#e9671c]">
                <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#e9671c] p-1.5 rounded-sm"><Landmark size={20} /></div>
                            <h1 className="font-serif text-2xl font-bold">JanSahaay</h1>
                        </div>
                        <p className="text-stone-400 text-base leading-relaxed font-light">
                            Architecting the future of administrative justice in India. Powered by verified AI models and institutional expertise.
                        </p>
                        <div className="flex gap-6">
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#e9671c] transition-colors cursor-pointer"><Share2 size={18} /></div>
                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#e9671c] transition-colors cursor-pointer"><Globe size={18} /></div>
                        </div>
                    </div>
                    <div>
                        <h5 className="font-bold text-sm uppercase tracking-[0.2em] mb-10 text-[#e9671c]">Resources</h5>
                        <ul className="space-y-5 text-stone-400 text-base font-medium">
                            <li><a className="hover:text-white transition-colors" href="#guidelines">Filing Guidelines</a></li>
                            <li><a className="hover:text-white transition-colors" href="#index">Department Index</a></li>
                            <li><a className="hover:text-white transition-colors" href="#reports">Transparency Reports</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-sm uppercase tracking-[0.2em] mb-10 text-[#e9671c]">Organization</h5>
                        <ul className="space-y-5 text-stone-400 text-base font-medium">
                            <li><Link className="hover:text-white transition-colors" to="/aboutus">About Us</Link></li>
                            <li><a className="hover:text-white transition-colors" href="#access">Institutional Access</a></li>
                            <li><a className="hover:text-white transition-colors" href="#press">Press Center</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-sm uppercase tracking-[0.2em] mb-10 text-[#e9671c]">Support Portal</h5>
                        <p className="text-stone-500 text-sm mb-6">Subscribe to institutional updates.</p>
                        <div className="flex bg-white/5 border border-white/10 p-1 rounded-lg">
                            <input className="bg-transparent px-4 py-3 w-full text-sm outline-none placeholder:text-stone-600" placeholder="Gov. Email" type="email" />
                            <button className="bg-[#e9671c] px-4 py-2 rounded-md hover:bg-[#C0392B] transition-colors"><Send size={18} /></button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-10 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] uppercase font-bold tracking-[0.2em] text-stone-500">
                    <div>© 2026 JanSahaay AI. An Institutional Digital Initiative.</div>
                    <div className="flex gap-10">
                        <a className="hover:text-white" href="#privacy">Privacy Protocol</a>
                        <a className="hover:text-white" href="#terms">Terms of Governance</a>
                    </div>
                </div>
            </footer>
        </section>
    );
};

export default HowItWorks;