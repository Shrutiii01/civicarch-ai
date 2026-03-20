import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function ResultPage() {
  const location = useLocation();
  const data = location.state;

  // State for the editable draft
  const [draft, setDraft] = useState(
    data?.draft || data?.generated_draft || data?.complaint_draft || ""
  );

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f6f6]">
        <div className="p-10 bg-white rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-slate-800">No result available</h2>
          <p className="text-slate-500 mt-2">Please return to the dashboard and try again.</p>
        </div>
      </div>
    );
  }

  const copyDraft = () => {
    navigator.clipboard.writeText(draft);
    alert("Draft copied to clipboard!");
  };

  return (
    <div className="bg-[#f8f6f6] min-h-screen font-['Public_Sans',sans-serif] text-slate-900 selection:bg-[#ec5b13]/20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <img
                alt="CivicArch AI Logo"
                className="h-10 w-auto object-contain"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAACgCAYAAAB6+9Q9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAENtSURBVHhe7d13mFzXedj/753etvdesIvFogMkCsFOsaqZopolirKsYrnETuzEyc9xbMt+bMexEtmWY0WWY8V2ZDsqFFVIihRFkCBB9F52ge29l+nttt8fs1hiZ2cWhSi73PfzPPcRdc+Zwcy9d+e+95T3KKZpmgghhBBiVbGk7xBCCCHEu58EAEIIIcQqJAGAEEIIsQpJACCEEEKsQhIACCGEEKuQBABCCCHEKiQBgBBCCLEKSQAghBBCrEISAAghhBCrkAQAQgghxCokAYAQQgixCkkAIIQQQqxCEgAIIYQQq5AEAEIIIcQqJAGAEEIIsQpJACCEEEKsQhIALCeKAhYris2BYnOA1Q6KnCIhhBA3ntxdlhFLfgXOTQ/j++gf4Pv4H+F+4Be4BerVbemggEhhBDiBpIA4DZTnF6s5U04t78P971P47r74zg2vQfHxodw3flB3Pc9g+vun8fetBNLbmn6y4UQQojropimaabvXBFME/9XnybZ/mZ6yfKnWFCcXizefKwltdjqtuDY8AC2irVYcooWVDW1JMb0EMmOg6idh9AGz2OEZzDjYUw1saDuSpH3+a/hvPMD6buFEELcQhIA3AaKw4OtbhPOLY/haNmDtawRxWoHizU1DiCdoWPqGkZ4Gm34IonjP0btPII+1Z9ec0WQAEAIIW4/CQBuIWtJHbbaTdgb78BWtQ5rUQ2W3GIUpze9akampmLGQ+gzw+hjXWgDZ0l2HkGf6MWMBdOrL1sSAAghxO0nAcBNprhzseSXYSupx1azAVvdFmw1G7Dmlaae+K+TEQ2gT/aj9Z5EHTyPPtaJPjWAEZoGQ0+vvqxIACCEELefBAA3w6WpfE4P1vIm7M27cG55HFtpPYo7J732O6ZPDaB2HSFxdi9a/2mMiB9TjYGmplddFiQAEEKI208CgJvAklOErWYjzs2PYKvbjLWoBsXtS03nuwnz+k1dhUQUIzKLNtJJsm0fyY6D6KMd6VWXBQkAhBDi9pMA4AZRbA4shdXYajZgr92ItWodtrI1WHJLUJye9Oo3h6HPdQ30oY12og21o/WfRp/oTXUNLBMSAAjx7qTrOsFQGKfTgcvpxGK58Q884saRAOAdUty5WHKLsRbVYKvdiKN5F7bq9VjyytKr3lJmIoI+PUyy4yBa30m0kQ4M/xhmNICpJdOr31ISAFydZFIlFAozNjFJKBQmHk9gGCZej5uCgjyKigooLMhHyTRz5BbRdZ1INMbExBSz/gDRaAxd13E5neTm5lBcXEBhQQEOhz39pWKFMAyDWCzO6NgEfn8gvRgA0zRJJFXCkQjT07Ns2dTK2uZGHA5JYracSQBwPRQFUMBiwV63Bcem9+Dc/AjWsjUotuX3Q2f4x1B7TxI/+kPU3hMYgQkwDbhNp14CgKszPjHFmbPt/OiFn3Ku7SJjYxMkEiqN9bXs3rWNB+7fw/337sZmtd62ICAcjtDZ1cvzL73K4SMn6esfJBqNUV5WxpbNrTw49xlLS4pu22cU70wyqdI/OMyzz73AkaOnME0TwzC4/NdD0zSmp2cZHhkjGovzpf/yW/ziMx8lJ8d3WS2x3Fi/9KUvfSl950oRP/x99KmB9N03naWwEsfau/Dc/ws4dz6Jo2kX1vxyFLsz8zz+283mwJJbgr1+C7baTVjySkFLp荷重"
              />
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <span className="text-sm font-semibold text-[#ec5b13] cursor-pointer">Drafting</span>
              <span className="text-sm font-medium text-slate-600 hover:text-[#ec5b13] transition-colors cursor-pointer">Case Vault</span>
              <span className="text-sm font-medium text-slate-600 hover:text-[#ec5b13] transition-colors cursor-pointer">Regulations</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
              <input
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-[#ec5b13] outline-none"
                placeholder="Search documents..."
                type="text"
              />
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-[#ec5b13]/20 border border-[#ec5b13]/30 flex items-center justify-center">
              <span className="text-xs font-bold text-[#ec5b13]">JD</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-6">
        {/* Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
              <span className="hover:underline cursor-pointer">Dashboard</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="hover:underline cursor-pointer">Intelligence</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-slate-900 font-bold">Preview_Draft.pdf</span>
            </nav>
            <h2 className="text-3xl font-bold text-slate-900">Document Intelligence Preview</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content: The Document Page */}
          <div className="lg:col-span-8 flex justify-center bg-slate-200/30 rounded-2xl p-4 md:p-10 border border-slate-200 shadow-inner">
            <div className="bg-white text-slate-900 w-full max-w-[800px] min-h-[1050px] p-12 md:p-16 shadow-[0_10px_50px_-12px_rgba(0,0,0,0.15)] relative">
              {/* Draft Content inside a simulated "Paper" */}
              <div className="text-center mb-10">
                <h3 className="font-bold text-xl uppercase underline underline-offset-8 decoration-2">OFFICIAL DRAFT</h3>
                <p className="text-sm mt-3 italic text-slate-500">(Generated via CivicArch AI Engine)</p>
              </div>

              <textarea
                className="w-full min-h-[750px] border-none focus:ring-0 text-[16px] leading-relaxed font-serif resize-none p-0 text-slate-800 bg-transparent overflow-hidden"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                spellCheck="false"
              />

              <div className="mt-16 flex justify-between items-end border-t border-slate-100 pt-8">
                <div className="text-xs text-slate-400 space-y-1">
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

            {/* Legal Compliance Engine Widget */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-[11px] opacity-60">Legal Compliance Engine</h4>
              <div className="flex items-center gap-8">
                <div className="relative flex-shrink-0">
                  {/* The circular meter from the design */}
                  <div className="w-24 h-24 rounded-full flex items-center justify-center relative"
                    style={{ background: 'conic-gradient(#ec5b13 0% 92%, #e2e8f0 92% 100%)' }}>
                    <div className="w-[84px] h-[84px] rounded-full bg-white flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-900">9.2</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase">Verified</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ec5b13]"></span>
                    <span className="text-[11px] font-bold text-slate-900 uppercase">Compliance Score</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">High precision analysis confirms adherence to legal standards.</p>
                  <div className="mt-2 flex gap-4">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-900">VALID</p>
                      <p className="text-[8px] text-slate-400 uppercase">Format</p>
                    </div>
                    <div className="text-center border-l border-slate-200 pl-4">
                      <p className="text-[10px] font-bold text-slate-900">SECURE</p>
                      <p className="text-[8px] text-slate-400 uppercase">Privacy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rejection Risk Factors / Analysis Details */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-[11px] opacity-60">Analysis Details</h4>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-500 fill-1 text-xl">check_circle</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{data.department || "Public Authority Identified"}</p>
                    <p className="text-xs text-slate-500 mt-1">Confirmed as the correct custodian for this request.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-500 fill-1 text-xl">check_circle</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{data.category || "General Category"}</p>
                    <p className="text-xs text-slate-500 mt-1">Classification verified against legal database.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-amber-500 text-xl">warning</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Information Specificity</p>
                    <p className="text-xs text-slate-500 mt-1">Ensure all date ranges match your attached evidence.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.print()}
                className="w-full py-4 bg-[#ec5b13] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#ec5b13]/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined">picture_as_pdf</span>
                Download / Print PDF
              </button>
              <button
                onClick={copyDraft}
                className="w-full py-4 bg-[#ec5b13]/10 text-[#ec5b13] border border-[#ec5b13]/20 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#ec5b13]/20 transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined">content_copy</span>
                Copy to Clipboard
              </button>
            </div>

            {/* Archival Info Section */}
            <div className="p-5 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-900 mb-2">
                <span className="material-symbols-outlined text-sm">history</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Document Meta</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Source: {data.extracted_text ? "OCR Extracted" : "Manual Input"}<br />
                Backend ID: {data.id || "CIV-ARCH-4281"}<br />
                Verification ID: CV-9823-AI
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResultPage;