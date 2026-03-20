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

  // Handle image selection
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

  // Submit complaint
  const handleSubmit = async () => {
    // PREVENT JUNK TEXT (like a single dot)
    if (!text || text.trim().length < 5 || !location || !pincode) {
      alert("Please provide a proper description or wait for the image AI to finish reading.");
      return;
    }

    try {
      setLoading(true);

      const response = await submitComplaint({
        text,
        location,
        pincode,
        category
      });

      navigate("/result", { state: response.data });

    } catch (error) {
      console.error("Complaint submission failed", error);
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔥 remove token
    navigate("/", { replace: true }); // 🔥 redirect to landing page
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "auto" }}>

      <h2>Submit Complaint / Request</h2>

      {/* Complaint Text */}
      <div style={{ marginTop: "20px" }}>
        <label>Complaint / Request</label>
        <textarea
          rows="5"
          placeholder="Describe your issue or information request..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      {/* Location */}
      <div style={{ marginTop: "20px" }}>
        <label>Location</label>
        <input
          type="text"
          placeholder="Enter area / street"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      {/* Pincode */}
      <div style={{ marginTop: "20px" }}>
        <label>Pincode</label>
        <input
          type="text"
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      {/* Category */}
      <div style={{ marginTop: "20px" }}>
        <label>Category (Optional)</label>
        <input
          type="text"
          placeholder="Road / Water / Electricity etc."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        />
      </div>

      {/* Image Upload */}
      <div style={{ marginTop: "20px" }}>
        <label>Upload Image (Optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {/* Image Preview */}
      {preview && (
        <div style={{ marginTop: "20px" }}>
          <img
            src={preview}
            alt="preview"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading} // 🔴 Prevents clicking while image is processing
        style={{
          marginTop: "30px",
          padding: "12px 20px",
          background: loading ? "#9ca3af" : "#2563eb", // 🔴 Turns gray when loading
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Processing Image..." : "Submit Complaint"}
      </button>

       {/* 🔴 Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 14px",
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

    </div>
  );
}

export default ComplaintPage;