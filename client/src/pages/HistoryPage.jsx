import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, PlusCircle, FileEdit,
  Clock, Gavel, Sparkles, Landmark
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';

const HistoryPage = () => {
  // ── Existing Backend States ──
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ── UI States ──
  const [activeTab, setActiveTab] = useState('HISTORY');
  const [searchTerm, setSearchTerm] = useState("");
  const tabs = ['HISTORY'];

  // ── UNTOUCHED Data Integration ──
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/complaints/history');
        setDrafts(response.data.draft_complaints || []);
      } catch (error) {
        console.error("Failed to load history:", error);
        toast.error("Could not load history from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // 🔥 UNTOUCHED TRIGGER: The exact route and trigger you provided
  const handleViewDocument = (item) => {
    navigate("/result", { state: item });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  // ── Filter Logic for the UI Search Bar ──
  const currentData = useMemo(() => {
    return drafts.filter(item =>
      (item.request_type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.original_text || item.text || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [drafts, searchTerm]);

  // ── UI Loading State ──
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f6] font-['Inter']">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#e9671c] mx-auto"></div>
        <p className="text-[#e9671c] font-black uppercase tracking-widest text-[10px]">Syncing History...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f7f6] font-['Inter'] text-slate-900 selection:bg-[#e9671c]/20 pb-20">
      
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
                          <Link to="/history" className="text-[#e9671c] ">History</Link>
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

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Header */}
        <header className="mb-14">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight">
            User <span className="text-[#e9671c] italic font-serif">History</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl font-medium opacity-80 max-w-2xl">
            Review your past civic actions and manage your generated records.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col min-h-[650px]">
              
              {/* Controls Bar */}
              <div className="px-6 md:px-10 py-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-white">
                <div className="flex gap-12 w-full md:w-auto overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-xs font-black tracking-[0.25em] pb-4 transition-all border-b-4 relative whitespace-nowrap ${
                        activeTab === tab 
                          ? 'text-[#e9671c] border-[#e9671c]' 
                          : 'text-slate-400 border-transparent hover:text-slate-600'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="SEARCH HISTORY..."
                    className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-12 pr-4 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#e9671c] transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Data List or Empty State */}
              <div className="flex-1 p-6 md:p-10 bg-white">
                {currentData.length > 0 ? (
                  <div className="space-y-6">
                    {currentData.map((item) => (
                      <div key={item.id} className="group p-6 md:p-8 border border-slate-100 bg-slate-50/50 rounded-3xl hover:border-[#e9671c]/30 hover:bg-white transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-3 flex-1 w-full">
                          <div className="flex items-center gap-4">
                            <h3 className="font-serif font-bold text-xl uppercase tracking-tight text-slate-900">
                              {item.request_type || "General Inquiry"}
                            </h3>
                            <span className="px-3 py-1 bg-white border border-slate-200 text-[#e9671c] text-[9px] font-black rounded-full uppercase tracking-widest shadow-sm">
                              RECORD
                            </span>
                          </div>
                          
                          <p className="font-bold text-sm text-slate-700 line-clamp-1">
                            {item.original_text || item.text || "Document/Audio Upload"}
                          </p>

                          <p className="text-slate-500 font-bold text-xs md:text-sm flex items-center gap-2">
                            <Clock size={14} className="text-[#e9671c]" /> {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recent"}
                          </p>
                          <p className="text-slate-400 text-xs italic line-clamp-1">"{item.complaint_draft || "Processing..."}"</p>
                        </div>
                        
                        {/* 🔥 UNTOUCHED TRIGGER: Uses handleViewDocument */}
                        <button onClick={() => handleViewDocument(item)} className="w-full md:w-auto bg-[#e9671c] text-white p-4 rounded-2xl hover:bg-[#d15616] transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex justify-center items-center">
                          <FileEdit size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <h3 className="text-[11px] uppercase tracking-[0.5em] font-black text-slate-400 mb-8 select-none">
                      NO {activeTab} RECORDS FOUND
                    </h3>
                    <Link to="/dashboard" className="group flex items-center gap-4 text-[#e9671c] font-black text-xl md:text-2xl hover:text-[#d15616] transition-all">
                      <span className="underline underline-offset-8 decoration-2">Start new application</span>
                      <PlusCircle className="transition-transform group-hover:rotate-90 group-hover:scale-110" size={28} strokeWidth={2.5} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Summary Sidebar */}
          <aside className="w-full lg:w-80 space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <h4 className="font-serif font-bold text-xl mb-8 flex items-center gap-3">
                <Sparkles className="text-[#e9671c]" size={20} />
                Insights
              </h4>
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Saved Records</span>
                  </div>
                  <p className="text-4xl font-serif font-bold text-slate-900">{drafts.length}</p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default HistoryPage;