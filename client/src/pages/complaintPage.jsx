import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitComplaint, processImage } from "../services/api";

function ComplaintPage() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [pincode, setPincode] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle image selection (Kept from existing logic)
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));

    try {
      setLoading(true);
      const response = await processImage(file);

      // Smartly update text: Append if user already typed, otherwise set new
      if (response.data.extracted_text) {
        setText((prevText) => {
          if (prevText.trim() !== "") {
            return `${prevText}\n\n[Image Context]: ${response.data.extracted_text}`;
          }
          return response.data.extracted_text;
        });
      }
    } catch (err) {
      console.error("Image processing failed", err);
      alert("Failed to analyze image. You can still type your request manually.");
    } finally {
      setLoading(false);
    }
  };

  // Submit complaint (Kept from existing logic)
  const handleSubmit = async () => {
    if (!text || text.trim().length < 5 || !location || !pincode) {
      alert("Please provide a proper description or wait for the image AI to finish reading.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("text", text);
      formData.append("location", location);
      formData.append("pincode", pincode);
      formData.append("category", category);

      if (image) {
        formData.append("image", image); // 🔥 IMPORTANT
      }

      const response = await submitComplaint(formData);

      // Navigate to result page and pass the API response data
      navigate("/processing", { state: response.data });
    } catch (error) {
      console.error("Complaint submission failed", error);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout Logic (Kept from existing logic)
  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔥 remove token
    navigate("/", { replace: true }); // 🔥 redirect to landing page
  };

  const displayText = text.replace(/\[Image Context\]:.*/gs, "");

  return (
    <div className="bg-[#f8f7f6] min-h-screen font-['Inter'] text-slate-900">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="flex items-center justify-between border-b border-orange-500/10 px-6 py-4 lg:px-20 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 bg-[#e9671c] rounded-lg text-white">
            <span className="material-symbols-outlined">account_balance</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight font-serif">
            CivicArch <span className="text-[#e9671c]">AI</span>
          </h2>
        </div>

        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <button className="text-sm font-semibold text-slate-900 border-b-2 border-[#e9671c] pb-1">AI Architect</button>
          <button className="text-sm font-medium text-slate-500 hover:text-[#e9671c]">Dashboard</button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center overflow-hidden border border-orange-500/30">
            <img className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=User&background=e9671c&color=fff" alt="User" />
          </div>
          {/* 🔥 Logout Button added to the header */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-semibold text-sm rounded-lg hover:bg-red-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col lg:flex-row gap-8 px-6 py-8 lg:px-20 max-w-[1600px] mx-auto w-full">
        <section className="flex-1 flex flex-col gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-serif">Lodge a Grievance</h1>
            <p className="text-slate-500">Our AI Architect will analyze your complaint for legal compliance and departmental routing.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Complaint / Request</label>
              <textarea
                className="w-full min-h-[280px] p-5 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#e9671c] focus:border-transparent text-lg resize-none outline-none transition-all"
                placeholder="Describe your issue or information request..."
                value={displayText}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Location</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#e9671c] outline-none"
                    placeholder="Enter area / street"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Pincode</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">pin_drop</span>
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#e9671c] outline-none"
                    placeholder="Enter pincode"
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Category (Optional)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">category</span>
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#e9671c] outline-none"
                  placeholder="Road / Water / Electricity etc."
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Upload Evidence (Optional)</label>
              <div
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer overflow-hidden"
                onClick={() => document.getElementById('hiddenFileInput').click()}
              >
                {preview ? (
                  <img src={preview} className="h-full w-full object-contain p-2" alt="Preview" />
                ) : (
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[#e9671c] text-3xl mb-1">upload_file</span>
                    <p className="text-sm font-semibold">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400">JPG, PNG (Max 10MB)</p>
                  </div>
                )}
                <input id="hiddenFileInput" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all ${
                loading 
                  ? "bg-slate-400 cursor-not-allowed shadow-none" 
                  : "bg-[#e9671c] hover:bg-[#d15616] shadow-orange-500/20"
              }`}
            >
              <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                {loading ? 'sync' : 'send'}
              </span>
              {loading ? "Processing Image / Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </section>

        {/* Right Sidebar - Insight Panel */}
        <aside className="w-full lg:w-[400px] pt-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e9671c]"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#e9671c]">Live Analysis in Progress</span>
          </div>

          <h2 className="text-xl font-bold font-serif flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-[#e9671c]">auto_awesome</span>
            Analysis Insight
          </h2>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-transform hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#e9671c] text-xl">gavel</span>
                <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500">Legal Sections Applied</h3>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium p-3 bg-slate-50 rounded border border-slate-100">Section 14-B: Urban Maintenance Code</div>
              </div>
            </div>

            <div className="bg-[#fff7ed] p-5 rounded-xl border border-orange-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[#e9671c] text-xl">psychology</span>
                <h3 className="font-semibold text-xs uppercase tracking-wider text-[#e9671c]">AI Reasoning</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                {loading ? "AI is analyzing your input..." : "Based on your description, the system identified a breach of public safety. Priority ranking has been set to Critical."}
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default ComplaintPage;