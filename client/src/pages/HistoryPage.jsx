import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const HistoryPage = () => {
  const [submitted, setSubmitted] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/complaints/history');
        setSubmitted(response.data.submitted_complaints || []);
        setDrafts(response.data.draft_complaints || []);
      } catch (error) {
        console.error("Failed to load history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // 🔥 THE FIX: Instead of calling a missing backend route, 
  // we just pass the 'item' directly to the ResultPage!
  const handleViewDocument = (item) => {
    navigate("/result", { state: item });
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold mt-10">Loading your history...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold border-b pb-4 mb-8 text-slate-800">My Case Vault</h1>

      {/* Drafts Section */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-[#ec5b13] mb-4 flex items-center gap-2">
          📝 Saved Drafts
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {drafts.length === 0 ? (
            <p className="text-slate-500 italic p-4 bg-slate-50 border border-dashed rounded">No pending drafts.</p>
          ) : (
            drafts.map((item) => (
              <div key={item.id} className="p-5 border border-orange-200 rounded-xl bg-orange-50/50 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-2">
                    {item.original_text || item.text || "Document/Audio Upload"}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-white border border-orange-200 text-orange-700 text-xs font-bold rounded uppercase">
                      {item.request_type || "Complaint"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-4 line-clamp-2">{item.complaint_draft || "Draft generated..."}</p>
                </div>
                
                <button 
                  onClick={() => handleViewDocument(item)}
                  className="w-full mt-6 px-4 py-2 bg-[#ec5b13] text-white font-bold rounded-lg hover:bg-[#c04a0e] transition"
                >
                  View / Edit Draft
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Submitted Section */}
      <section>
        <h2 className="text-xl font-bold text-emerald-700 mb-4 flex items-center gap-2">
          ✅ Official Submissions
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {submitted.length === 0 ? (
            <p className="text-slate-500 italic p-4 bg-slate-50 border border-dashed rounded">No submitted items found.</p>
          ) : (
            submitted.map((item) => (
              <div key={item.id} className="p-5 border border-emerald-200 rounded-xl bg-emerald-50/50 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-2">
                    {item.original_text || item.text || "Document/Audio Upload"}
                  </h3>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-white border border-emerald-200 text-emerald-700 text-xs font-bold rounded uppercase">
                      {item.request_type || "Complaint"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-4 line-clamp-2">{item.complaint_draft || "Draft generated..."}</p>
                </div>
                
                <button 
                  onClick={() => handleViewDocument(item)}
                  className="w-full mt-6 px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition"
                >
                  View Document
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;