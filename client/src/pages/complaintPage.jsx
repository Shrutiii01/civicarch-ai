import { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import api, { submitComplaint, processImage } from "../services/api";

function ComplaintPage() {
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

  // 🔥 NEW: Audio Recording States and Refs
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // 🔥 NEW: Start Recording Function
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
        stream.getTracks().forEach((track) => track.stop()); // Turn off mic indicator
        await handleAudioUpload(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Microphone access denied. Please allow microphone permissions in your browser.");
    }
  };

  // 🔥 NEW: Stop Recording Function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 🔥 NEW: Upload Audio to Backend
  const handleAudioUpload = async (audioBlob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio_file", audioBlob, "voice_note.webm");

      const token = localStorage.getItem("token");

      // Sending audio to your FastAPI Whisper route
      const response = await fetch("http://localhost:8000/complaints/upload-audio", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` // Included in case you lock down the route later
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload audio");
      }

      const data = await response.json();

      // Smartly append the transcribed text to the textbox
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

  // Handle image selection
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
      // 🔥 NEW: Grab the exact secret error message sent by FastAPI
      const exactError = err.response?.data?.detail || err.message;

      console.error("🔥 EXACT AI ERROR:", exactError);
      alert(`Server Error: ${exactError}`);

    } finally {
      setLoading(false);
    }
  };

  // Submit complaint
  const handleSubmit = async () => {
    if (!text || text.trim().length < 5 || !location || !pincode) {
      alert("Please provide a proper description or wait for the AI to finish reading.");
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

      {/* Header */}
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

              {/* 🔥 NEW: Textarea Wrapper with Absolute Positioned Mic Button */}
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
              className={`w-full py-4 text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all ${loading
                ? "bg-slate-400 cursor-not-allowed shadow-none"
                : "bg-[#e9671c] hover:bg-[#d15616] shadow-orange-500/20"
                }`}
            >
              <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>
                {loading ? 'sync' : 'send'}
              </span>
              {loading ? "Processing Input / Submitting..." : "Submit Complaint"}
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