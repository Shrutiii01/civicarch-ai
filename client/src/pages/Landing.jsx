import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Your backend API instance
import {
    Search, Network, FileText, DoorOpen, BarChart3, Scale,
    TrendingUp, ShieldCheck, Languages, FileSearch,
    Play, ChevronDown, Send, Share2, Globe, Landmark, Waypoints,
    ArrowRight, MoreVertical, Mic, Cpu, CheckSquare
} from 'lucide-react';

const Landing = () => {
    // ── Backend Connection State ──
    const [message, setMessage] = useState("Connecting to server...");

    // ── UI State ──
    const [openFaq, setOpenFaq] = useState(null);
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const phrases = ["Administrative Justice", "Citizen Empowerment", "Legal Transparency"];

    // ── Backend Fetch Effect ──
    useEffect(() => {
        api.get("/")
            .then((res) => {
                setMessage(res.data.message);
            })
            .catch((err) => {
                console.error("Failed to fetch message:", err);
                setMessage("Server connection failed");
            });
    }, []);

    // ── Typewriter Logic Effect ──
    useEffect(() => {
        const handleType = () => {
            const i = loopNum % phrases.length;
            const fullText = phrases[i];

            setText(isDeleting
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1)
            );

            setTypingSpeed(isDeleting ? 30 : 150);

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed]);

    // ── Static Data ──
    const steps = [
        {
            icon: Search,
            title: 'Identify Issue',
            desc: 'Select the specific civic or administrative problem you are facing.'
        },
        {
            icon: Mic,
            title: 'Multi-Modal Input',
            desc: 'Provide evidence and details via text, voice, or document uploads.'
        },
        {
            icon: Cpu,
            title: 'AI Structuring',
            desc: 'Our engine transforms your raw data into legally fortified formats.'
        },
        {
            icon: CheckSquare,
            title: 'Verification',
            desc: 'Review, edit, and sign your generated application for compliance.'
        }];

    const capabilities = [
        {
            icon: Mic,
            title: 'Voice-to-Draft AI',
            desc: 'Speak your civic issue naturally. Our audio processing AI transcribes, translates, and structures your voice note into a formal legal document.'
        }, {
            icon: Waypoints,
            title: 'Intelligent Routing',
            desc: 'The AI automatically classifies your input into the correct legal framework (RTI, Grievance, or Complaint) and identifies the exact target department.'
        }, { icon: Languages, title: 'Multilingual Support', desc: 'AI-powered translation into 22 official Indian languages for inclusive governance access.' },
        { icon: FileSearch, title: 'Smart Summaries', desc: 'Condensing long government responses into actionable executive insights.' },
    ];

        const faqs = [
        {
            q: 'Are AI-generated drafts legally valid for submission?',
            a: 'Yes. Government departments focus on the substance and format of the request, not the tool used to write it. JanSahaay ensures your drafts strictly follow the statutory formatting required by Indian administrative laws.'
        },
        {
            q: 'Can I explain my issue using my voice or in my regional language?',
            a: 'Absolutely! JanSahaay allows you to record voice notes in natural language. Our AI automatically translates, transcribes, and structures your spoken words into a formal, professional legal document.'
        },
        {
            q: 'How do I know which department to send my grievance to?',
            a: 'You don’t need to know! JanSahaay’s intelligent routing automatically analyzes your text or voice input to identify the exact government department or municipal body responsible for resolving your specific issue.'
        },
        {
            q: 'How long does an RTI or Grievance response usually take?',
            a: 'Under the RTI Act, authorities are legally mandated to respond within 30 days. For public grievances, resolution timelines vary by state under the Citizen’s Charter, but usually range from 15 to 30 days.'
        }
    ];
    const heroImg = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80';
    const mapImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdrJn7M0Bw-p7AMqQCuogkMTgu1c99wrVhfA-KytyiCITXjQ1Gc8ZkB9HVmNz8byuYJJfgjUo-pWeCqtKIx5vp0dGHB_G-FAPG_tX5OjiAU82EhQzaObw5L9Dx_pe89raw6atuM1zQZtMMfQQBb6CYpNYMqymOOWBVIU8aT-qFtn3EKil2SPzc4e0qCRwBuWuBG8-u6JxwiUaWP1uEaRZIvXWL9le0k3fDLWlf5q8SBYnRDbTd2J7DFcB9h3wRX4ePzrGCkczBgg';
    const videoImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgMjGevM9tiF_rsVTtEmro6PopLGNxH-eYERISTtceSYMk-meMkqe1x8L8MZ-OorKlPpqiBIDj0hbUmtK1mjIBVFcPK5tYsp4vus6NfjgkYXBbrDhACaPKFcEbQB5JjGhllSaGEhZ-InC914bk8nrNTYWvi9imotYI9w-GPzJKzKKQCq61Y8jOFwRt0VJb-vHMN5AJy4EcqnhVj1QstpRKqzQ4lf7ZVh20ENFjKur_q8DJB_b89jK4k6taeUtOL9Z1qMLQsiaLEg';

    return (
        <div className="bg-[#f8f7f6] font-sans text-[#1A1A1A] antialiased page-transition">


            {/* ── Navbar ── */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
                {/* Changed max-w-7xl to max-w-full and increased horizontal padding (px-10) */}
                <div className="max-w-full mx-auto px-10 h-20 flex items-center justify-between">

                    {/* Left Side: Logo */}
                    <div className="flex items-center gap-3">
                        <div className="bg-[#e9671c] p-1.5 rounded-sm text-white">
                            <Landmark size={24} />
                        </div>
                        <div>
                            <h1 className="font-serif text-xl font-bold leading-none">JanSahaay</h1>
                        </div>
                    </div>

                    {/* Center: Links (Will naturally stay centered-ish between the ends) */}
                    <div className="hidden lg:flex items-center gap-10">
                        <Link to="/" className="text-sm font-semibold hover:text-[#e9671c] transition-colors">Home</Link>
                        <Link to="/aboutus" className="text-sm font-semibold hover:text-[#e9671c] transition-colors">About us</Link>
                        <Link to="/howitwork" className="text-sm font-semibold hover:text-[#e9671c] transition-colors">How It Works</Link>
                        <Link to="/heatmap" className="text-sm font-semibold hover:text-[#e9671c] transition-colors">Heatmap</Link>
                    </div>

                    {/* Right Side: Button */}
                    <Link to="/login" className="bg-[#e9671c] hover:bg-[#C0392B] text-white px-6 py-2.5 rounded-sm font-bold text-sm tracking-wide transition-all shadow-md">
                        LOGIN / START FILING
                    </Link>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <section className="relative h-[650px] flex items-stretch overflow-hidden bg-[#FDF6ED]">
                <div className="w-full lg:w-7/12 bg-gradient-to-br from-[#e9671c] via-[#e9671c] to-[#C0392B] relative z-10 flex items-center px-12 lg:px-24 hero-diagonal">
                    <div className="max-w-xl text-white">

                        {/* Status Indicators */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 text-white/90 text-xs font-bold tracking-widest uppercase">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                National Compliance Active
                            </div>


                        </div>

                        <h2 className="font-serif text-5xl lg:text-7xl leading-[1.1] mb-6 font-black tracking-tight min-h-[160px]">
                            Digitize <br />
                            <span className="text-white">
                                {text}
                            </span>
                        </h2>
                        <p className="text-white/80 text-lg mb-10 max-w-md leading-relaxed font-light">
                            Empowering citizens with secure, AI-driven transparency and professional grade legal infrastructure for the digital age.
                        </p>
                    </div>
                </div>
                <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full z-0">
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${heroImg}')` }}></div>
                    <div className="absolute inset-0 bg-[#1A1A1A]/20"></div>


                </div>
            </section>

            {/* ── Framework ── */}
            <section className="py-24 bg-white border-b border-stone-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h3 className="text-stone-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">Framework</h3>
                        <h2 className="font-serif text-4xl text-[#1A1A1A] font-bold">The Golden Path to Justice</h2>
                        <div className="w-24 h-1 bg-[#e9671c] mx-auto mt-4"></div>
                    </div>

                    {/* 🔥 UPDATED: Changed to lg:grid-cols-4 for perfect 4-column spacing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">

                        {/* 🔥 UPDATED: Adjusted the line width and position so it connects the centers perfectly */}
                        <div className="hidden lg:block absolute top-10 left-[12.5%] w-[75%] h-px bg-stone-200 z-0"></div>

                        {steps.map((step, idx) => (
                            <div key={idx} className="relative z-10 group text-center">
                                <div className="w-20 h-20 rounded-full bg-[#FDF6ED] border border-orange-500/20 flex items-center justify-center mx-auto mb-6 group-hover:bg-[#e9671c] group-hover:text-white transition-all duration-300 text-[#e9671c] shadow-sm">
                                    <step.icon size={28} />
                                </div>
                                <h4 className="font-bold text-sm mb-2">{step.title}</h4>
                                <p className="text-xs text-stone-500 leading-relaxed px-2 font-medium">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Capabilities ── */}
            <section className="py-24 bg-[#FDF6ED]/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                        <div className="max-w-xl">
                            <h3 className="text-stone-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">Core Infrastructure</h3>
                            <h2 className="font-serif text-4xl font-bold">Platform Capabilities</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {capabilities.map((cap, idx) => (
                            <div key={idx} className="bg-white p-8 rounded shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-stone-100 group">
                                <cap.icon className="text-[#C0392B] mb-6" size={40} />
                                <h4 className="font-bold text-lg mb-3">{cap.title}</h4>
                                <p className="text-stone-500 text-sm leading-relaxed mb-6 font-medium">{cap.desc}</p>
                                <a className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:text-[#e9671c] transition-colors" href="#explore">
                                    Explore <ArrowRight size={14} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Heatmap Section ── */}
            <section className="bg-[#1A1A1A] py-24 text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_70%_50%,_rgba(233,103,28,0.4)_0%,_transparent_70%)]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="w-full lg:w-1/3">
                            <h3 className="text-[#e9671c] text-xs font-bold uppercase tracking-[0.3em] mb-4">Intelligence</h3>
                            <h2 className="font-serif text-5xl mb-8 leading-tight font-bold">Civic Pulse Heatmap</h2>
                            <p className="text-stone-400 leading-relaxed mb-10 font-light">
                                Monitor real-time transparency levels across the nation. Our AI analyzes submission density and response latency to visualize administrative efficiency.
                            </p>
                            <div className="space-y-6 mb-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-sm font-semibold">High Compliance (60+ Departments)</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                                    <span className="text-sm font-semibold">Moderate Delay Areas</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                    <span className="text-sm font-semibold">Critical Attention Required</span>
                                </div>
                            </div>
                            <Link to="/heatmap" className="bg-[#e9671c] text-white px-8 py-4 font-bold text-sm tracking-widest hover:bg-[#C0392B] transition-colors uppercase w-full shadow-lg shadow-orange-500/10 text-center inline-block">
                                View Live Data Stream
                            </Link>
                        </div>
                        <div className="w-full lg:w-2/3">
                            <div className="aspect-video rounded border border-white/5 bg-black/40 overflow-hidden relative group shadow-2xl">
                                <div className="w-full h-full bg-cover bg-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700"
                                    style={{ backgroundImage: `url('${mapImg}')` }}></div>

                                {/* Pulse Nodes */}
                                <div className="absolute top-[35%] left-[45%] flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-orange-500/20 animate-ping absolute"></div>
                                    <div className="w-4 h-4 rounded-full bg-[#e9671c] border-2 border-white shadow-lg relative"></div>
                                </div>
                                <div className="absolute top-[60%] left-[55%] flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-orange-500/10 animate-ping absolute" style={{ animationDelay: '0.5s' }}></div>
                                    <div className="w-4 h-4 rounded-full bg-[#e9671c] border-2 border-white shadow-lg relative"></div>
                                </div>

                                <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-md border border-white/10 p-5 rounded min-w-[200px] shadow-2xl">
                                    <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                                        <span className="text-stone-400 text-[10px] uppercase font-bold tracking-widest">Total Filings</span><span className="font-mono text-[#e9671c] font-bold text-sm">1,42,892</span>
                                        <span className="text-stone-400 text-[10px] uppercase font-bold tracking-widest">Avg Response</span><span className="font-mono text-[#e9671c] font-bold text-sm">18.4 Days</span>
                                        <span className="text-stone-400 text-[10px] uppercase font-bold tracking-widest">Success Rate</span><span className="font-mono text-[#e9671c] font-bold text-sm">84.2%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Institutional Resources (FAQ Only) ── */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-stone-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">Support Center</h3>
                        <h2 className="font-serif text-4xl text-[#1A1A1A] font-bold">Frequently Asked Queries</h2>
                    </div>

                    {/* Centered FAQ List */}
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-stone-100 bg-[#FDF6ED]/30 rounded overflow-hidden hover:border-[#e9671c] transition-all"
                            >
                                {/* Question Header */}
                                <div
                                    className="p-5 cursor-pointer flex justify-between items-center group"
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                >
                                    <span className="font-bold text-sm group-hover:text-[#e9671c] transition-colors">{faq.q}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`text-stone-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}
                                    />
                                </div>

                                {/* Smooth Expanding Answer Section */}
                                <div
                                    className={`transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-[200px] opacity-100 pb-5 px-5' : 'max-h-0 opacity-0 overflow-hidden px-5'
                                        }`}
                                >
                                    <p className="text-sm text-stone-500 leading-relaxed border-t border-stone-200/50 pt-3">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Partners ── */}
            <div className="bg-stone-50 py-12 border-y border-stone-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-30 grayscale contrast-125">
                    <span className="font-serif text-2xl font-black italic tracking-tighter">india.gov.in</span>
                    <span className="font-sans text-2xl font-extrabold tracking-tighter">NIC</span>
                    <span className="font-sans text-2xl font-light tracking-widest">Digital India</span>
                    <span className="font-serif text-2xl font-bold tracking-tight">MeitY</span>
                </div>
            </div>

            {/* ── Footer ── */}
            <footer className="bg-[#1A1A1A] text-white pt-20 pb-10 border-t-4 border-[#e9671c]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="bg-[#e9671c] p-1.5 rounded-sm text-white">
                                <Landmark size={24} />
                            </div>
                            <div>
                                <h1 className="font-serif text-xl font-bold leading-none">JanSahaay</h1>
                            </div>
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
                <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase font-bold tracking-[0.2em] text-stone-500">
                    <div>© 2024 CivicArch AI. An Institutional Digital Initiative.</div>
                    <div className="flex gap-8">
                        <a className="hover:text-white" href="#privacy">Privacy Protocol</a>
                        <a className="hover:text-white" href="#terms">Terms of Governance</a>
                        <a className="hover:text-white" href="#legal">Legal Notice</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;