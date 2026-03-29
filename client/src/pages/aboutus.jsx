import React from 'react';
import { Link } from 'react-router-dom';
import {
    Target,
    Eye,
    ShieldCheck,
    Scale,
    Landmark,
    Share2,
    Globe,
    Send
} from 'lucide-react';

const AboutUs = () => {
    const values = [
        {
            title: "Precision",
            desc: "Accurate formatting for every department.",
            icon: <Target className="w-8 h-8 text-[#e9671c]" />
        },
        {
            title: "Transparency",
            desc: "Making governance visible to all.",
            icon: <Eye className="w-8 h-8 text-[#e9671c]" />
        },
        {
            title: "Integrity",
            desc: "Upholding the spirit of the RTI Act.",
            icon: <ShieldCheck className="w-8 h-8 text-[#e9671c]" />
        },
        {
            title: "Justice",
            desc: "Empowering the common citizen.",
            icon: <Scale className="w-8 h-8 text-[#e9671c]" />
        }
    ];

    return (
        <section className="bg-stone-50 font-sans min-h-screen">
            {/* NAVIGATION BAR - Consistent max-w-7xl */}
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
                        <Link to="/aboutus" className="text-sm font-semibold text-[#e9671c]">About us</Link>
                        <Link to="/howitwork" className="text-sm font-semibold hover:text-[#e9671c] transition-colors">How It Works</Link>
                        <Link to="/heatmap" className="text-sm font-semibold hover:text-[#e9671c] transition-colors">Heatmap</Link>
                    </div>

                    <Link to="/login" className="bg-[#e9671c] hover:bg-[#C0392B] text-white px-6 py-2.5 rounded-sm font-bold text-sm tracking-wide transition-all shadow-md">
                        LOGIN / START FILING
                    </Link>
                </div>
            </nav>

            {/* Header Section */}
            <header className="bg-[#111] text-white py-24 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About JanSahaaya</h1>
                <p className="text-stone-400 italic max-w-2xl mx-auto text-sm md:text-base leading-relaxed border-t border-white/10 pt-6">
                    "Bridging the gap between citizens and administration through intelligent technology."
                </p>
            </header>

            {/* Mission Section - Aligned with Nav/Footer */}
            <section className="max-w-7xl mx-auto py-24 px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Our Mission</h2>
                        <div className="space-y-6 text-stone-600 leading-relaxed text-base">
                            <p>
                                JanSahaaya was founded with a single goal: to democratize access to administrative justice in India.
                                We believe that the complexity of legal paperwork should never be a barrier to transparency and accountability.
                            </p>
                            <p>
                                By leveraging advanced AI, we help citizens structure their thoughts into legally compliant and
                                professionally formatted documents, ensuring their voices are heard by the right authorities.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {values.map((val, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                <div className="mb-4">{val.icon}</div>
                                <h4 className="font-serif font-bold text-stone-900 mb-2">{val.title}</h4>
                                <p className="text-stone-400 text-xs leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Core Framework Info Card ── */}
            <section className="max-w-7xl mx-auto px-10 pb-24">
                <div className="bg-[#111] rounded-[2rem] p-16 text-center text-white shadow-2xl">
                    <h2 className="text-3xl font-serif font-bold mb-10">The Three Pillars of Civic Action</h2>
                    
                    <div className="max-w-4xl mx-auto space-y-6 text-stone-400 text-sm md:text-base leading-relaxed">
                        <p>
                            JanSahaay empowers citizens by perfectly categorizing and formatting civic issues into three distinct, legally recognized frameworks: <strong>Right to Information (RTI)</strong>, <strong>Public Grievances</strong>, and <strong>Formal Complaints</strong>.
                        </p>
                        <p>
                            Whether you are demanding official government records under the RTI Act of 2005, reporting administrative delays governed by the Citizen's Charter, or highlighting municipal violations like broken infrastructure, our AI ensures your voice is structurally sound, legally precise, and directed to the exact department responsible.
                        </p>
                    </div>

                    {/* 3-Column Highlights */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-12 mt-12 border-t border-white/10 pt-12">
                        
                        {/* Pillar 1 */}
                        <div className="text-center w-48">
                            <div className="text-[#e9671c] text-4xl font-serif font-bold mb-2">RTI</div>
                            <div className="text-xs uppercase tracking-widest font-bold text-white mb-1">Transparency</div>
                            <div className="text-[10px] text-stone-500 uppercase tracking-wider">Data & Records</div>
                        </div>

                        <div className="hidden md:block w-[1px] h-16 bg-white/10"></div>
                        
                        {/* Pillar 2 */}
                        <div className="text-center w-48">
                            <div className="text-[#e9671c] text-4xl font-serif font-bold mb-2">Grievance</div>
                            <div className="text-xs uppercase tracking-widest font-bold text-white mb-1">Accountability</div>
                            <div className="text-[10px] text-stone-500 uppercase tracking-wider">Service Delays</div>
                        </div>

                        <div className="hidden md:block w-[1px] h-16 bg-white/10"></div>
                        
                        {/* Pillar 3 */}
                        <div className="text-center w-48">
                            <div className="text-[#e9671c] text-4xl font-serif font-bold mb-2">Complaint</div>
                            <div className="text-xs uppercase tracking-widest font-bold text-white mb-1">Resolution</div>
                            <div className="text-[10px] text-stone-500 uppercase tracking-wider">Physical Issues</div>
                        </div>

                    </div>
                </div>
                
                <div className="hidden md:block w-[1px] h-12 bg-white/20"></div>
                
                <div className="text-center group">
                    <div className="text-[#e9671c] text-4xl font-bold mb-1 drop-shadow-md">₹10</div>
                    <div className="text-white/80 text-xs uppercase tracking-widest font-bold">Application Fee</div>
                </div>
            </div>
        </div>
    </div>
</section>

            {/* FOOTER - Consistent max-w-7xl */}
            <footer className="bg-[#1A1A1A] text-white pt-20 pb-10 border-t-4 border-[#e9671c]">
                <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-[#e9671c] p-1.5 rounded-sm"><Landmark size={20} /></div>
                            <h1 className="font-serif text-lg font-bold">JanSahaay</h1>
                        </div>
                        <p className="text-stone-400 text-sm leading-relaxed mb-8 font-light">
                            Architecting the future of administrative justice in India. Powered by verified AI models and institutional expertise.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#e9671c] transition-colors cursor-pointer"><Share2 size={14} /></div>
                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#e9671c] transition-colors cursor-pointer"><Globe size={14} /></div>
                        </div>
                    </div>
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-[#e9671c]">Resources</h5>
                        <ul className="space-y-4 text-stone-400 text-sm font-medium">
                            <li><a className="hover:text-white transition-colors" href="#guidelines">Filing Guidelines</a></li>
                            <li><a className="hover:text-white transition-colors" href="#index">Department Index</a></li>
                            <li><a className="hover:text-white transition-colors" href="#reports">Transparency Reports</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-[#e9671c]">Organization</h5>
                        <ul className="space-y-4 text-stone-400 text-sm font-medium">
                            <li><a className="hover:text-white transition-colors" href="#about">About Us</a></li>
                            <li><a className="hover:text-white transition-colors" href="#access">Institutional Access</a></li>
                            <li><a className="hover:text-white transition-colors" href="#press">Press Center</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-xs uppercase tracking-[0.2em] mb-8 text-[#e9671c]">Support Portal</h5>
                        <div className="flex bg-white/5 border border-white/10 p-1 rounded-sm mt-4">
                            <input className="bg-transparent px-4 py-3 w-full text-sm outline-none placeholder:text-stone-600" placeholder="Gov. Email" type="email" />
                            <button className="bg-[#e9671c] px-4 py-2 hover:bg-[#C0392B] transition-colors shadow-lg"><Send size={16} /></button>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-10 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase font-bold tracking-[0.2em] text-stone-500">
                    <div>© 2026 JanSahaay AI. An Institutional Digital Initiative.</div>
                    <div className="flex gap-8">
                        <a className="hover:text-white" href="#privacy">Privacy Protocol</a>
                        <a className="hover:text-white" href="#terms">Terms of Governance</a>
                        <a className="hover:text-white" href="#legal">Legal Notice</a>
                    </div>
                </div>
            </footer>
        </section>
    );
};

export default AboutUs;