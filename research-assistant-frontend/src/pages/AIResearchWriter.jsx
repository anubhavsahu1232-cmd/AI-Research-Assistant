import { useState } from "react";
import {
  FaRobot, FaDownload, FaCopy, FaSpinner,
  FaCheckCircle, FaBook, FaSave
} from "react-icons/fa";

import { generateResearchPaper } from "../services/aiService";
import { addNotification } from "../services/notificationService";
import { jsPDF } from "jspdf";
import { saveResearchPaper } from "../services/researchPaperService";

export default function AIResearchWriter() {
  const [topic, setTopic] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const generate = async () => {
    if (!topic.trim()) {
      setError("Please enter your research topic.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setSaved(false);
    setResult(null);

    try {
      const response = await generateResearchPaper(topic, instructions);
      setResult(response);
      addNotification("Your AI research paper has been generated and saved as a draft.", "draft");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Research paper generation failed. Check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const content = result?.content || "";
  const title = result?.title || topic || "Generated Research Paper";

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setSuccess("Research paper copied successfully!");
    } catch {
      setError("Unable to copy content.");
    }
  };

  const downloadContent = () => {
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };


  const downloadPdf = () => {
    if (!content.trim()) return;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    let y = 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);

    const titleLines = doc.splitTextToSize(title, maxWidth);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 9 + 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(content, maxWidth);
    const lineHeight = 6;

    lines.forEach((line) => {
      if (y + lineHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }

      doc.text(line, margin, y);
      y += lineHeight;
    });

    doc.save(`${title.replace(/[^a-z0-9]/gi, "_")}.pdf`);
  };
  const saveToLibrary = async () => {
    if (!result || !content.trim()) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveResearchPaper({
        title,
        authors: "AI Generated",
        journal: "AI Research Assistant",
        publicationYear: String(new Date().getFullYear()),
        doi: "",
        abstractText: content,
        fileUrl: ""
      });

      setSaved(true);
      addNotification("Research paper added to your library.", "paper");
      setSuccess("Research paper successfully saved to your Research Papers library!");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save paper to Research Papers."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="writer-container">

      <div className="writer-header">
        <span className="writer-label">AI POWERED RESEARCH</span>
        <h1>AI Research Paper Generator</h1>
        <p>Transform your ideas into structured academic research.</p>
      </div>

      <div className="writer-form-card">

        <div className="writer-card-heading">
          <FaRobot />
          <div>
            <h3>Create Complete Research Paper</h3>
            <p>Enter your research topic and instructions.</p>
          </div>
        </div>

        <label>Research Topic *</label>

        <textarea
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Example: Impact of Artificial Intelligence in Healthcare..."
          disabled={loading}
        />

        <label className="instructions-label">
          Additional Instructions (Optional)
        </label>

        <textarea
          className="instructions-area"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          placeholder="Enter additional requirements for your research paper..."
          disabled={loading}
        />

        <div className="writer-tip">
          <FaRobot />
          AI will generate Title, Abstract, Keywords, Introduction,
          Literature Review, Methodology and Conclusion.
        </div>

        {error && <div className="management-error">{error}</div>}

        <button
          className="writer-generate-btn"
          onClick={generate}
          disabled={loading}
        >
          {loading
            ? <><FaSpinner className="spin" /> Generating Research Paper...</>
            : <><FaRobot /> Generate Complete Research Paper</>
          }
        </button>

      </div>

      {loading && (
        <div className="generation-loading">
          <FaSpinner className="spin" />
          <h3>AI is generating your research paper...</h3>
          <p>Please wait. This may take some time.</p>
        </div>
      )}

      {result && (
        <div className="result-card">

          <div className="result-header">
            <div>
              <span className="writer-label">
                <FaCheckCircle /> GENERATED & SAVED AS DRAFT
              </span>

              <h3>{title}</h3>
              <p>Draft ID: {result.draftId}</p>
              <p>{result.message}</p>
            </div>

            <div className="result-actions">

              <button onClick={copyContent}>
                <FaCopy /> Copy
              </button>

              <button onClick={downloadContent}>
                <FaDownload /> Download
              </button>

              <button onClick={downloadPdf}>
                <FaDownload /> Download PDF
              </button>
              <button
                onClick={saveToLibrary}
                disabled={saving || saved}
              >
                {saving
                  ? <><FaSpinner className="spin" /> Saving...</>
                  : saved
                    ? <><FaCheckCircle /> Saved to Library</>
                    : <><FaBook /> Save to Research Papers</>
                }
              </button>

            </div>
          </div>

          {success && (
            <div className="management-success">{success}</div>
          )}

          {error && (
            <div className="management-error">{error}</div>
          )}

          <pre className="result-content">{content}</pre>

        </div>
      )}

    </div>
  );
}
