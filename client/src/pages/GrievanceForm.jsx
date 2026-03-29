import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { submitComplaint, processImage } from "../services/api";
import { Landmark } from "lucide-react"; // 🔥 FIX: Imported the missing Landmark icon!

function GrievanceForm() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [pincode, setPincode] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data && res.data.name) {
          setUserName(res.data.name);
        }
      } catch (err) {
        console.error("Failed to fetch user data for profile image", err);
      }
    };
    fetchUser();
  }, []);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop()); 
        await handleAudioUpload(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access denied. Please allow microphone permissions in your browser.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (audioBlob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio_file", audioBlob, "voice_note.webm");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/complaints/upload-audio", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload audio");
      }

      const data = await response.json();

      if (data.text) {
        setText((prevText) => {
          if (prevText.trim() !== "") {
            return `${prevText}\n[Voice Note]: ${data.text}`;
          }
          return data.text;
        });
      }
    } catch (err) {
      console.error("Audio processing failed", err);
      alert("Failed to process your voice note.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));

    try {
      setLoading(true);
      const response = await processImage(file);

      if (response.data.extracted_text) {
        setText((prevText) => {
          if (prevText.trim() !== "") {
            return `${prevText}\n\n[Image Context]: ${response.data.extracted_text}`;
          }
          return response.data.extracted_text;
        });
      }
    } catch (err) {
      const exactError = err.response?.data?.detail || err.message;
      console.error("🔥 EXACT AI ERROR:", exactError);
      alert(`Server Error: ${exactError}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!text || text.trim().length < 5 || !location || !pincode) {
      alert("Please provide a description, location, and pincode.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      // 🔥 AI Hint: Forces the backend to process this specifically as a Grievance
      formData.append("text", `[USER INTENT: PUBLIC GRIEVANCE / SERVICE DELAY]\n${text}`);
      formData.append("location", location);
      formData.append("pincode", pincode);
      formData.append("category", category || "grievance"); // Fallback to grievance if empty

      if (image) {
        formData.append("image", image);
      }

      const response = await submitComplaint(formData);
      navigate("/processing", { state: response.data });
    } catch (error) {
      console.error("Complaint submission failed", error);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const displayText = text.replace(/\[Image Context\]:.*/gs, "");

  return (
    <div className="bg-[#f8f7f6] min-h-screen font-['Inter'] text-slate-900">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

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
                    <Link to="/dashboard" className="text-[#e9671c]">Dashboard</Link>
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

      {/* ── Black Hero Section ── */}
      <section className="bg-[#111] text-white py-16 text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Public Grievance</h1>
        <p className="text-stone-400 text-sm max-w-2xl mx-auto font-light">
          Report local issues and civic problems directly to the concerned administrative departments.
        </p>
      </section>

      {/* ── Main Content Area ── */}
      <main className="flex flex-1 flex-col lg:flex-row gap-8 px-6 py-8 lg:px-20 max-w-[1600px] mx-auto w-full">
        
        {/* Left Side: Form */}
        <section className="flex-1 flex flex-col gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-serif">Lodge a Grievance</h1>
            <p className="text-slate-500">Our AI Architect will analyze your complaint for legal compliance and departmental routing.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6">
            
            {/* 🔥 Non-Clickable AI Feature Indicator Cards */}
            <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs font-semibold uppercase tracking-wider cursor-default select-none shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-blue-500">description</span> Text 
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs font-semibold uppercase tracking-wider cursor-default select-none shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-green-500">image</span> Vision Extraction
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs font-semibold uppercase tracking-wider cursor-default select-none shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-red-500">picture_as_pdf</span> PDF Parsing
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs font-semibold uppercase tracking-wider cursor-default select-none shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-[#e9671c]">mic</span> Voice Translation
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Complaint / Request</label>

                {/* Textarea Wrapper with Absolute Positioned Mic Button */}
                <div className="relative">
                  <textarea
                    className="w-full min-h-[280px] p-5 pb-20 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#e9671c] focus:border-transparent text-lg resize-none outline-none transition-all"
                    placeholder="Describe your issue or click the mic to speak in any language..."
                    value={displayText}
                    onChange={(e) => setText(e.target.value)}
                  />

                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    type="button"
                    disabled={loading && !isRecording}
                    className={`absolute bottom-5 right-5 flex items-center justify-center h-14 w-14 rounded-full shadow-lg transition-all ${isRecording
                        ? "bg-red-500 hover:bg-red-600 animate-pulse text-white shadow-red-500/40"
                        : "bg-white border-2 border-slate-200 text-slate-600 hover:text-[#e9671c] hover:border-[#e9671c] shadow-sm"
                      }`}
                    title={isRecording ? "Stop Recording" : "Start Recording"}
                  >
                    <span className="material-symbols-outlined text-3xl">
                      {isRecording ? "stop" : "mic"}
                    </span>
                  </button>
                </div>
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
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer overflow-hidden relative"
                  onClick={() => document.getElementById('hiddenFileInput').click()}
                >
                  {preview ? (
                    <img src={preview} className="h-full w-full object-contain p-2 absolute inset-0" alt="Preview" />
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
                className={`w-full py-4 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all ${loading
                    ? "bg-slate-400 cursor-not-allowed shadow-none"
                    : "bg-[#e9671c] hover:bg-[#d15616] shadow-orange-500/20"
                  }`}
              >
                <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                  {loading ? 'sync' : 'send'}
                </span>
                {loading ? "Processing Input / Submitting..." : "Generate Structured Grievance"}
              </button>
            </div>
          </div>
        </section>

        {/* ── Right Sidebar - Info Cards (Screenshot Matched) ── */}
        <aside className="w-full lg:w-[380px] space-y-6 pt-6 lg:pt-14">
          
          {/* Card 1: What is a Grievance? */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-stone-50 to-white pointer-events-none"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center h-6 w-6 rounded-full border border-[#e9671c] text-[#e9671c]">
                  <span className="material-symbols-outlined text-[16px]">info</span>
                </div>
                What is a Grievance?
              </h3>
              <p className="text-sm text-stone-500 mb-6 leading-relaxed">
                A grievance is a formal complaint about a public service or local infrastructure issue that requires administrative intervention.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-stone-600 font-medium">
                  <span className="material-symbols-outlined text-emerald-500 text-[20px]">check_circle</span>
                  <span className="leading-snug">Covers civic issues like roads, water, and sanitation.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-stone-600 font-medium">
                  <span className="material-symbols-outlined text-emerald-500 text-[20px]">check_circle</span>
                  <span className="leading-snug">Routed to District Magistrates or Department Heads.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Common Issues */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 p-6">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-[#e9671c] text-[24px]">warning</span>
              Common Issues
            </h3>
            <ul className="space-y-3 pt-1">
              {[
                "Garbage accumulation on streets",
                "Potholes and broken roads",
                "Irregular water supply",
                "Street light malfunctions",
                "Illegal encroachments"
              ].map((issue, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-stone-600">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#e9671c]/60"></div>
                  {issue}
                </li>
              ))}
            </ul>
          </div>

        </aside>
      </main>
    </div>
  );
}

export default GrievanceForm;