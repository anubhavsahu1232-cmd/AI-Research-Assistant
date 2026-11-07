
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaBook,
  FaTimes,
  FaExternalLinkAlt,
  FaSync,
  FaDownload,
  FaBookmark
} from "react-icons/fa";

import {
  getResearchPapers,
  saveResearchPaper,
  updateResearchPaper,
  deleteResearchPaper
} from "../services/researchPaperService";

import {
  getBookmarks,
  addBookmark,
  removeBookmark
} from "../services/bookmarkService";

import { addNotification } from "../services/notificationService";
import { addReadingHistory } from "../services/readingHistoryService";

const emptyForm = {
  title: "",
  authors: "",
  journal: "",
  publicationYear: "",
  doi: "",
  abstractText: "",
  fileUrl: ""
};

export default function ResearchPapers() {
  const [papers, setPapers] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [selectedPaper, setSelectedPaper] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookmarkLoading, setBookmarkLoading] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load research papers
  const loadPapers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getResearchPapers();

      setPapers(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load research papers."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load user's bookmarks
  const loadBookmarks = async () => {
    try {
      const response = await getBookmarks();

      const ids = Array.isArray(response)
        ? response.map((item) => String(item.paperId))
        : [];

      setBookmarkedIds(ids);
    } catch (err) {
      console.error("Unable to load bookmarks:", err);
    }
  };

  // Load both papers and bookmarks
  const loadAllData = async () => {
    await Promise.all([
      loadPapers(),
      loadBookmarks()
    ]);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Add bookmark or remove bookmark
  const handleBookmark = async (paperId) => {
    const id = String(paperId);

    if (bookmarkLoading !== null) return;

    try {
      setBookmarkLoading(id);
      setError("");
      setMessage("");

      if (bookmarkedIds.includes(id)) {
        await removeBookmark(paperId);

        setBookmarkedIds((previous) =>
          previous.filter((item) => item !== id)
        );

        setMessage("Bookmark removed successfully.");
      } else {
        await addBookmark(paperId);

        setBookmarkedIds((previous) =>
          previous.includes(id) ? previous : [...previous, id]
        );

        setMessage("Paper bookmarked successfully.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update bookmark."
      );
    } finally {
      setBookmarkLoading(null);
    }
  };

  // Save paper access in reading history
  const handleViewPaper = async (paper) => {
    try {
      await addReadingHistory(paper.id);
    } catch (err) {
      console.error("Unable to save reading history:", err);
    }

    setSelectedPaper(paper);
  };
  // Open Add Paper Form
  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  // Open Edit Paper Form
  const openEditForm = (paper) => {
    setForm({
      title: paper.title || "",
      authors: paper.authors || "",
      journal: paper.journal || "",
      publicationYear: paper.publicationYear || "",
      doi: paper.doi || "",
      abstractText: paper.abstractText || "",
      fileUrl: paper.fileUrl || ""
    });

    setEditingId(paper.id);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  // Save or Update Paper
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const payload = {
        ...form,
        publicationYear: form.publicationYear
          ? Number(form.publicationYear)
          : null
      };

      if (editingId !== null) {
        await updateResearchPaper(editingId, payload);

        setMessage("Research paper updated successfully.");
      } else {
        await saveResearchPaper(payload);

        addNotification(
          "A new research paper was added to your library.",
          "paper"
        );

        setMessage("Research paper added successfully.");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);

      await loadPapers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save research paper."
      );
    }
  };

  // Download paper details as PDF
  const downloadPaperPdf = (paper) => {
    const doc = new jsPDF();

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;

    let y = 25;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);

    const titleLines = doc.splitTextToSize(
      paper.title || "Research Paper",
      maxWidth
    );

    doc.text(titleLines, margin, y);
    y += titleLines.length * 9 + 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const details = [
      `Authors: ${paper.authors || "N/A"}`,
      `Journal: ${paper.journal || "N/A"}`,
      `Publication Year: ${paper.publicationYear || "N/A"}`,
      `DOI: ${paper.doi || "N/A"}`,
      "",
      "ABSTRACT / PAPER CONTENT",
      "",
      paper.abstractText || "No content available."
    ].join("\n");

    const lines = doc.splitTextToSize(details, maxWidth);

    lines.forEach((line) => {
      if (y + 6 > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }

      doc.text(line, margin, y);
      y += 6;
    });

    doc.save(
      `${(paper.title || "research-paper").replace(/[^a-z0-9]/gi, "_")}.pdf`
    );
  };

  // Delete Paper
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this paper?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteResearchPaper(id);

      setMessage("Research paper deleted successfully.");
      setSelectedPaper(null);

      setBookmarkedIds((previous) =>
        previous.filter((item) => item !== String(id))
      );

      await loadPapers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete research paper."
      );
    }
  };

  // Search Papers
  const filteredPapers = papers.filter((paper) =>
    [
      paper.title,
      paper.authors,
      paper.journal,
      paper.publicationYear,
      paper.doi
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="management-page">

      {/* PAGE HEADING */}
      <div className="management-heading">
        <div>
          <span>ACADEMIC LIBRARY</span>
          <h1>Research Papers</h1>
          <p>Manage and explore your research paper collection.</p>
        </div>

        <div className="management-actions">
          <button
            className="management-secondary"
            onClick={loadAllData}
          >
            <FaSync /> Refresh
          </button>

          <button
            className="management-primary"
            onClick={openAddForm}
          >
            <FaPlus /> Add Research Paper
          </button>
        </div>
      </div>

      {/* SUCCESS AND ERROR MESSAGES */}
      {message && (
        <div className="management-success">
          {message}
        </div>
      )}

      {error && (
        <div className="management-error">
          {error}
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="management-toolbar">
        <div className="management-search">
          <FaSearch />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, author, journal..."
          />
        </div>

        <span>{filteredPapers.length} Research Papers</span>
      </div>

      {/* PAPERS LIST */}
      {loading ? (
        <div className="management-empty">
          Loading research papers...
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="management-empty">
          <FaBook />

          <h3>No research papers found</h3>

          <p>
            {search
              ? "Try another search term."
              : "Add your first research paper to your academic library."}
          </p>

          {!search && (
            <button
              className="management-primary"
              onClick={openAddForm}
            >
              <FaPlus /> Add Research Paper
            </button>
          )}
        </div>
      ) : (
        <div className="paper-grid">

          {filteredPapers.map((paper) => {
            const isBookmarked = bookmarkedIds.includes(
              String(paper.id)
            );

            return (
              <div className="paper-card" key={paper.id}>

                <div className="paper-card-icon">
                  <FaBook />
                </div>

                <h3>{paper.title}</h3>

                <p>
                  {paper.authors || "Author not specified"}
                </p>

                <div className="paper-meta">
                  <span>
                    {paper.journal || "Journal not specified"}
                  </span>

                  <span>
                    {paper.publicationYear || "Year N/A"}
                  </span>
                </div>

                {/* PAPER ACTIONS */}
                <div className="paper-card-actions">

                  <button
                    onClick={() => handleViewPaper(paper)}
                    title="View"
                  >
                    <FaEye />
                  </button>

                  <button
                    onClick={() => openEditForm(paper)}
                    title="Edit"
                  >
                    <FaEdit />
                  </button>

                  <button
                    onClick={() => downloadPaperPdf(paper)}
                    title="Download PDF"
                  >
                    <FaDownload />
                  </button>

                  <button
                    onClick={() => handleBookmark(paper.id)}
                    title={
                      isBookmarked
                        ? "Remove Bookmark"
                        : "Add Bookmark"
                    }
                    disabled={bookmarkLoading === String(paper.id)}
                    style={{
                      color: isBookmarked ? "#7568ef" : "inherit"
                    }}
                  >
                    <FaBookmark />
                  </button>

                  <button
                    onClick={() => handleDelete(paper.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </button>

                </div>
              </div>
            );
          })}

        </div>
      )}

      {/* ADD / EDIT PAPER MODAL */}
      {showForm && (
        <div className="paper-modal-overlay">

          <div className="paper-modal">

            <div className="paper-modal-heading">
              <h2>
                {editingId !== null
                  ? "Edit Research Paper"
                  : "Add Research Paper"}
              </h2>

              <button onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <label>Paper Title *</label>

              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                placeholder="Enter paper title"
              />

              <label>Authors</label>

              <input
                value={form.authors}
                onChange={(e) =>
                  setForm({ ...form, authors: e.target.value })
                }
                placeholder="Enter authors"
              />

              <label>Journal</label>

              <input
                value={form.journal}
                onChange={(e) =>
                  setForm({ ...form, journal: e.target.value })
                }
                placeholder="Enter journal name"
              />

              <label>Publication Year</label>

              <input
                type="number"
                value={form.publicationYear}
                onChange={(e) =>
                  setForm({
                    ...form,
                    publicationYear: e.target.value
                  })
                }
                placeholder="2026"
              />

              <label>DOI</label>

              <input
                value={form.doi}
                onChange={(e) =>
                  setForm({ ...form, doi: e.target.value })
                }
                placeholder="Enter DOI"
              />

              <label>Abstract</label>

              <textarea
                rows="5"
                value={form.abstractText}
                onChange={(e) =>
                  setForm({
                    ...form,
                    abstractText: e.target.value
                  })
                }
                placeholder="Enter paper abstract"
              />

              <label>File URL</label>

              <input
                type="url"
                value={form.fileUrl}
                onChange={(e) =>
                  setForm({ ...form, fileUrl: e.target.value })
                }
                placeholder="https://..."
              />

              <div className="paper-form-actions">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="management-primary"
                >
                  {editingId !== null
                    ? "Update Paper"
                    : "Save Paper"}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAPER DETAILS MODAL */}
      {selectedPaper && (
        <div className="paper-modal-overlay">

          <div className="paper-modal">

            <div className="paper-modal-heading">
              <h2>Paper Details</h2>

              <button onClick={() => setSelectedPaper(null)}>
                <FaTimes />
              </button>
            </div>

            <h3>{selectedPaper.title}</h3>

            <p>
              <strong>Authors:</strong>{" "}
              {selectedPaper.authors || "N/A"}
            </p>

            <p>
              <strong>Journal:</strong>{" "}
              {selectedPaper.journal || "N/A"}
            </p>

            <p>
              <strong>Publication Year:</strong>{" "}
              {selectedPaper.publicationYear || "N/A"}
            </p>

            <p>
              <strong>DOI:</strong>{" "}
              {selectedPaper.doi || "N/A"}
            </p>

            <p>
              <strong>Abstract:</strong>
            </p>

            <p>
              {selectedPaper.abstractText || "No abstract available."}
            </p>

            {selectedPaper.fileUrl && (
              <a
                href={selectedPaper.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open Paper <FaExternalLinkAlt />
              </a>
            )}

            <div className="paper-form-actions">

              <button onClick={() => setSelectedPaper(null)}>
                Close
              </button>

              <button
                className="management-primary"
                onClick={() => {
                  openEditForm(selectedPaper);
                  setSelectedPaper(null);
                }}
              >
                <FaEdit /> Edit Paper
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

