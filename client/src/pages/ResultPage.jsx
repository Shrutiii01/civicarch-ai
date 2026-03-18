import { useLocation } from "react-router-dom";
import { useState } from "react";

function ResultPage() {

  const location = useLocation();
  const data = location.state;
    console.log("Result Page Data:", data);
  const [draft, setDraft] = useState(
  data?.draft || data?.generated_draft || data?.complaint_draft || ""
);
  if (!data) {
    return <div style={{ padding: "40px" }}>No result available</div>;
  }

  const copyDraft = () => {
    navigator.clipboard.writeText(draft);
    alert("Draft copied to clipboard");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>

      <h2>AI Generated Complaint Draft</h2>

      {/* Generated Draft */}
      <div style={{ marginTop: "25px" }}>
        <label><b>Generated Draft</b></label>

        <textarea
          rows="12"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>

        <button
          onClick={copyDraft}
          style={{
            padding: "10px 18px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Copy Draft
        </button>

        <button
          onClick={() => window.print()}
          style={{
            padding: "10px 18px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Print Draft
        </button>

      </div>

      {/* AI Analysis Section */}
      <div style={{ marginTop: "40px" }}>

        <h3>AI Analysis</h3>

        {data.category && (
          <p>
            <b>Detected Category:</b> {data.category}
          </p>
        )}

        {data.department && (
          <p>
            <b>Responsible Department:</b> {data.department}
          </p>
        )}

      </div>

      {/* OCR Extracted Text */}
      {data.extracted_text && (
        <div style={{ marginTop: "30px" }}>

          <h3>Text Extracted From Image</h3>

          <div
            style={{
              background: "#f3f4f6",
              padding: "15px",
              borderRadius: "8px"
            }}
          >
            {data.extracted_text}
          </div>

        </div>
      )}

      {/* Original Complaint */}
      {data.original_text && (
        <div style={{ marginTop: "30px" }}>

          <h3>Original Complaint</h3>

          <div
            style={{
              background: "#f9fafb",
              padding: "15px",
              borderRadius: "8px"
            }}
          >
            {data.original_text}
          </div>

        </div>
      )}

    </div>
  );
}

export default ResultPage;