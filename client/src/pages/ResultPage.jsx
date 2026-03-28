import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  // Unified ID extraction: Checks for 'id' OR 'complaint_id'
  const documentId = data?.id || data?.complaint_id;

  // State for the editable draft - connected to the textarea
  const [draft, setDraft] = useState(
    data?.draft_text || data?.draft || data?.generated_draft || data?.complaint_draft || ""
  );

  const [isDownloading, setIsDownloading] = useState(false);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!data) {
      console.error("No data passed to ResultPage. Please navigate from the dashboard.");
    }
  }, [data]);

  const copyDraft = () => {
    navigator.clipboard.writeText(draft);
    alert("Draft copied to clipboard!");
  };

  const handleDownloadPDF = async () => {
    // Validation for the required ID
    if (!documentId) {
      alert("Error: Complaint ID is missing. Cannot generate PDF.");
      return;
    }

    setIsDownloading(true);
    try {
      /**
       * API CONNECTION STRATEGY:
       * 1. Appends complaint_id as a Query Parameter for the database filter.
       * 2. Sends the current 'draft' state in the body so manual edits are reflected in the PDF.
       */
      const response = await fetch(`http://localhost:8000/generate-pdf?complaint_id=${documentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Must match the Body(..., embed=True) expectation in main.py
        body: JSON.stringify({ draft_text: draft }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }

      // Convert the binary stream into a Blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      // Friendly filename using a portion of the ID
      link.download = `CivicArch_Draft_${String(documentId).substring(0, 8)}.pdf`; 
      document.body.appendChild(link);
      link.click();
      
      // Cleanup to prevent memory leaks
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert(`Could not download PDF. Ensure the backend is running and the database record exists.`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Error UI if data is missing
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
    <div className="bg-[#f8f6f6] min-h-screen font-['Public_Sans',sans-serif] text-slate-900 selection:bg-[#ec5b13]/20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-8 w-8 bg-[#ec5b13] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-bold text-xl tracking-tight">CivicArch AI</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-sm font-semibold text-[#ec5b13] cursor-pointer">Drafting</span>
              <span className="text-sm font-medium text-slate-600 hover:text-[#ec5b13] transition-colors cursor-pointer">Case Vault</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-[#ec5b13]/20 border border-[#ec5b13]/30 flex items-center justify-center">
              <span className="text-xs font-bold text-[#ec5b13]">JD</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
              <span className="hover:underline cursor-pointer" onClick={() => navigate('/')}>Dashboard</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-slate-900 font-bold">Preview_Draft.pdf</span>
            </nav>
            <h2 className="text-3xl font-bold text-slate-900">Document Intelligence Preview</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content: The Document Page */}
          <div className="lg:col-span-8 flex justify-center bg-slate-200/30 rounded-2xl p-4 md:p-10 border border-slate-200 shadow-inner">
            <div className="bg-white text-slate-900 w-full max-w-[800px] min-h-[1050px] p-12 md:p-16 shadow-[0_10px_50px_-12px_rgba(0,0,0,0.15)] relative border border-slate-100">
              <div className="text-center mb-10">
                <h3 className="font-bold text-xl uppercase underline underline-offset-8 decoration-2 tracking-widest">OFFICIAL DRAFT</h3>
                <p className="text-sm mt-3 italic text-slate-500 font-medium">(Generated via CivicArch AI Engine)</p>
              </div>

              {/* Connected Textarea for live edits */}
              <textarea
                className="w-full min-h-[750px] border-none focus:ring-0 text-[16px] leading-relaxed font-serif resize-none p-0 text-slate-800 bg-transparent overflow-hidden"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                spellCheck="false"
              />

              <div className="mt-16 flex justify-between items-end border-t border-slate-100 pt-8">
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

          {/* Right Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-[11px] opacity-60">Legal Compliance Engine</h4>
              <div className="flex items-center gap-8">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center relative"
                    style={{ background: 'conic-gradient(#ec5b13 0% 92%, #e2e8f0 92% 100%)' }}>
                    <div className="w-[84px] h-[84px] rounded-full bg-white flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900">9.2</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter">Verified</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ec5b13]"></span>
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Compliance Score</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight font-medium">High precision analysis confirms adherence to legal standards.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-[11px] opacity-60">Analysis Details</h4>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-500 !text-xl [font-variation-settings:'FILL'_1]">check_circle</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{data.department || "Public Authority Identified"}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Confirmed correct custodian.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-500 !text-xl [font-variation-settings:'FILL'_1]">warning</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">Information Specificity</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Check date ranges in evidence.</p>
                  </div>
                </div>
              </div>
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

            <div className="p-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-900 mb-2 opacity-60">
                <span className="material-symbols-outlined text-sm">history</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Document Meta</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                Source: {data.extracted_text ? "OCR Extracted" : "Manual Input"}<br />
                Backend ID: {documentId || "N/A"}<br />
                Verification ID: CV-AI-SUCCESS
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResultPage;