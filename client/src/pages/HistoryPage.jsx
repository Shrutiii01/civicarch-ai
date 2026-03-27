import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getComplaintHistory, getComplaintById } from '../services/api'; // Adjust path as needed

const HistoryPage = () => {
  const [submitted, setSubmitted] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getComplaintHistory();
        // Matching the structure you defined:
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

  const handleResume = async (id) => {
    try {
      const response = await getComplaintById(id);
      // Navigate to the complaint form/review page and pass the data
      navigate("/complaint", { state: { complaintData: response.data } });
    } catch (error) {
      console.error("Failed to load draft details:", error);
      alert("Could not load the draft. Please try again.");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your history...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold border-b pb-4 text-gray-800">My Complaints</h1>

      {/* Submitted Section */}
      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center gap-2">
          ✅ Submitted Complaints
        </h2>
        <div className="grid gap-4">
          {submitted.length === 0 ? (
            <p className="text-gray-500 italic">No submitted complaints found.</p>
          ) : (
            submitted.map((complaint) => (
              <div key={complaint.id} className="p-4 border border-green-200 rounded-lg bg-green-50 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{complaint.category}</h3>
                    <p className="text-sm text-gray-600 mt-1">📍 {complaint.location}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full">
                    {complaint.status}
                  </span>
                </div>
                <p className="text-gray-700 mt-3 line-clamp-2">{complaint.complaint_draft}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Drafts Section */}
      <section>
        <h2 className="text-xl font-semibold text-orange-600 mb-4 flex items-center gap-2">
          📝 Draft Complaints (Action Required)
        </h2>
        <div className="grid gap-4">
          {drafts.length === 0 ? (
            <p className="text-gray-500 italic">No pending drafts.</p>
          ) : (
            drafts.map((draft) => (
              <div key={draft.id} className="p-4 border border-orange-200 rounded-lg bg-orange-50 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{draft.category || "Uncategorized"}</h3>
                  <p className="text-sm text-gray-600 mt-1">📍 {draft.location || "Location pending"}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{draft.complaint_draft || "Draft generated..."}</p>
                </div>
                <button 
                  onClick={() => handleResume(draft.id)}
                  className="w-full sm:w-auto px-5 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition shadow-sm"
                >
                  Resume Draft
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