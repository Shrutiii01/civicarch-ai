import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Landmark } from "lucide-react"; // 🔥 NEW: Imported Landmark for the navbar

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const documentId = data?.id || data?.complaint_id;

  const [draft, setDraft] = useState(
    data?.draft_text || data?.draft || data?.generated_draft || data?.complaint_draft || ""
  );

  const [isDownloading, setIsDownloading] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const textareaRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!data) {
      console.error("No data passed to ResultPage. Please navigate from the dashboard.");
    }
  }, [data]);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; 
      textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [draft, isEditing]);

  const copyDraft = () => {
    navigator.clipboard.writeText(draft);
    toast.success("Draft copied to clipboard!");
  };

  const handleSaveDraft = async () => {
    if (!documentId) {
      toast.error("Cannot save: Missing Document ID");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token"); 
      
      const response = await fetch(`http://localhost:8000/complaints/${documentId}/update-draft`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ draft_text: draft }),
      });

      if (!response.ok) {
        throw new Error("Failed to save draft to database.");
      }

      toast.success("Draft successfully updated and saved!");
      setIsEditing(false); 

    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!documentId) {
      toast.error("Error: Complaint ID is missing. Cannot generate PDF.");
      return;
    }

    setIsDownloading(true);
    try {
      const response = await fetch(`http://localhost:8000/generate-pdf?complaint_id=${documentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ draft_text: draft }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `CivicArch_Draft_${String(documentId).substring(0, 8)}.pdf`; 
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Download Error:", error);
      toast.error(`Could not download PDF. Ensure the backend is running.`);
    } finally {
      setIsDownloading(false);
    }
  };

  // 🔥 NEW: Added handleLogout to support the new navbar
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f6f6]">
        <div className="p-10 bg-white rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-slate-800">No result available</h2>
          <p className="text-slate-500 mt-2">Please return to the dashboard and try again.</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-[#ec5b13] text-white rounded-lg font-bold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f6f6] min-h-screen font-['Public_Sans',sans-serif] text-slate-900 selection:bg-[#ec5b13]/20 pb-20">
      
      {/* 🔥 NEW: Replaced old header with the consistent JanSahaay Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="bg-[#e9671c] p-1.5 rounded-sm text-white">
                  <Landmark size={24} />
              </div>
              <div>
                  <h1 className="font-serif text-xl font-bold leading-none">JanSahaay</h1>
              </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-stone-500 uppercase tracking-widest">
              <Link to="/dashboard" className="hover:text-[#e9671c] transition-colors">Dashboard</Link>
              <Link to="/history" className="hover:text-[#e9671c] transition-colors">History</Link>
              <Link to="/heatmap" className="hover:text-[#e9671c] transition-colors">Heatmap</Link>
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

      <main className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
           
            <h2 className="text-3xl font-bold text-slate-900">Document Intelligence Preview</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex justify-center bg-slate-200/30 rounded-2xl p-4 md:p-10 border border-slate-200 shadow-inner">
            
            <div className="bg-white text-slate-900 w-full max-w-[800px] min-h-[1050px] h-fit flex flex-col p-12 md:p-16 shadow-[0_10px_50px_-12px_rgba(0,0,0,0.15)] relative border border-slate-100 group">
              
              <div className="absolute top-8 right-8 transition-opacity">
                {isEditing ? (
                  <button 
                    onClick={handleSaveDraft} 
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded shadow-lg hover:bg-green-700 font-bold text-sm transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isSaving ? "sync" : "save"}
                    </span>
                    {isSaving ? "Saving..." : "Save Draft"}
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-slate-100 text-slate-700 border border-slate-200 px-5 py-2.5 rounded shadow-sm hover:bg-slate-200 font-bold text-sm transition-all active:scale-95 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Edit Draft
                  </button>
                )}
              </div>

              <div className="text-center mb-10">
                <h3 className="font-bold text-xl uppercase underline underline-offset-8 decoration-2 tracking-widest">OFFICIAL DRAFT</h3>
                <p className="text-sm mt-3 italic text-slate-500 font-medium">(Generated via CivicArch AI Engine)</p>
              </div>

              <textarea
                ref={textareaRef}
                readOnly={!isEditing}
                className={`w-full border-none focus:ring-0 text-[16px] leading-relaxed font-serif resize-none p-4 overflow-hidden transition-colors rounded-lg ${
                  isEditing ? "bg-amber-50/50 outline-dashed outline-2 outline-amber-400/60 text-slate-900" : "bg-transparent text-slate-800"
                }`}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                spellCheck="false"
              />

              <div className="mt-auto pt-16 flex justify-between items-end border-t border-slate-100">
                <div className="text-xs text-slate-400 space-y-1 font-medium">
                  <p>Status: AI Verified</p>
                  <p>Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-center w-40 border-t border-slate-900 pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider">Authorized Signature</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Action Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6 pt-4 lg:pt-0">
            
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-100">
                    <span className="material-symbols-outlined text-green-500 text-3xl">task_alt</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Draft Ready</h3>
                <p className="text-sm text-slate-500 font-medium">Your document is ready for download or manual editing.</p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                disabled={isDownloading}
                onClick={handleDownloadPDF}
                className={`w-full py-4 bg-[#ec5b13] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#ec5b13]/20 transition-all active:scale-[0.98] ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
              >
                <span className="material-symbols-outlined">
                  {isDownloading ? 'sync' : 'picture_as_pdf'}
                </span>
                {isDownloading ? 'Generating PDF...' : 'Download / Print PDF'}
              </button>
              
              <button
                onClick={copyDraft}
                className="w-full py-4 bg-[#ec5b13]/10 text-[#ec5b13] border border-[#ec5b13]/20 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#ec5b13]/20 transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined">content_copy</span>
                Copy to Clipboard
              </button>
            </div>

            <div className="p-6 mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-900 mb-3 opacity-60">
                <span className="material-symbols-outlined text-sm">history</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Document Meta</span>
              </div>
              <div className="space-y-2">
                  <p className="text-[11px] text-slate-600 font-medium flex justify-between">
                    <span className="text-slate-400">Source:</span> 
                    <span className="font-bold">{data.extracted_text ? "OCR Extracted" : "Manual Input"}</span>
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium flex justify-between">
                    <span className="text-slate-400">Backend ID:</span> 
                    <span className="font-mono font-bold bg-slate-200/50 px-1 rounded">{documentId || "N/A"}</span>
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium flex justify-between">
                    <span className="text-slate-400">Verification:</span> 
                    <span className="text-green-600 font-bold">SUCCESS</span>
                  </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResultPage;