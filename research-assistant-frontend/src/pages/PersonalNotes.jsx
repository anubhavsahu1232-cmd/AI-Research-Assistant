import { useEffect, useState } from "react";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaStickyNote,
  FaSync,
  FaTimes,
  FaSearch,
  FaSave
} from "react-icons/fa";

import {
  getNotes,
  saveNote,
  updateNote,
  deleteNote
} from "../services/noteService";

import { getResearchPapers } from "../services/researchPaperService";

export default function PersonalNotes() {
  const [notes, setNotes] = useState([]);
  const [papers, setPapers] = useState([]);

  const [selectedPaperId, setSelectedPaperId] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getPaperId = (note) =>
    note.paperId ?? note.paper?.id ?? "";

  const getPaperTitle = (note) =>
    note.paperTitle ?? note.paper?.title ?? "Research Paper";

  const getNoteContent = (note) =>
    note.content ?? note.noteContent ?? "";

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [notesResponse, papersResponse] = await Promise.all([
        getNotes(),
        getResearchPapers()
      ]);

      setNotes(Array.isArray(notesResponse) ? notesResponse : []);
      setPapers(Array.isArray(papersResponse) ? papersResponse : []);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load personal notes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddForm = () => {
    setSelectedPaperId("");
    setContent("");
    setEditingId(null);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const openEditForm = (note) => {
    setSelectedPaperId(String(getPaperId(note)));
    setContent(getNoteContent(note));
    setEditingId(note.id);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Please enter your note.");
      return;
    }

    try {
      setError("");
      setMessage("");

      if (editingId !== null) {
        await updateNote(editingId, content.trim());
        setMessage("Note updated successfully.");
      } else {
        if (!selectedPaperId) {
          setError("Please select a research paper.");
          return;
        }

        await saveNote(Number(selectedPaperId), content.trim());
        setMessage("Note saved successfully.");
      }

      setShowForm(false);
      setContent("");
      setSelectedPaperId("");
      setEditingId(null);

      await loadData();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save note."
      );
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteNote(noteId);

      setNotes((previous) =>
        previous.filter((note) => note.id !== noteId)
      );

      setMessage("Note deleted successfully.");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to delete note."
      );
    }
  };

  const filteredNotes = notes.filter((note) => {
    const searchText = [
      getNoteContent(note),
      getPaperTitle(note)
    ].join(" ").toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  return (
    <div className="management-page">

      <div className="management-heading">
        <div>
          <span>YOUR RESEARCH WORKSPACE</span>
          <h1>Personal Notes</h1>
          <p>Save and manage your notes for research papers.</p>
        </div>

        <div className="management-actions">
          <button
            className="management-secondary"
            onClick={loadData}
          >
            <FaSync /> Refresh
          </button>

          <button
            className="management-primary"
            onClick={openAddForm}
          >
            <FaPlus /> Add Note
          </button>
        </div>
      </div>

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

      <div className="management-toolbar">
        <div className="management-search">
          <FaSearch />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes or paper titles..."
          />
        </div>

        <span>{filteredNotes.length} Notes</span>
      </div>

      {loading ? (
        <div className="management-empty">
          Loading personal notes...
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="management-empty">
          <FaStickyNote />

          <h3>No personal notes found</h3>

          <p>
            {search
              ? "Try another search term."
              : "Create your first note for a research paper."}
          </p>

          {!search && (
            <button
              className="management-primary"
              onClick={openAddForm}
            >
              <FaPlus /> Create Note
            </button>
          )}
        </div>
      ) : (
        <div className="paper-grid">

          {filteredNotes.map((note) => (
            <div className="paper-card" key={note.id}>

              <div className="paper-card-icon">
                <FaStickyNote />
              </div>

              <h3>{getPaperTitle(note)}</h3>

              <p>{getNoteContent(note)}</p>

              <div className="paper-card-actions">

                <button
                  title="Edit Note"
                  onClick={() => openEditForm(note)}
                >
                  <FaEdit />
                </button>

                <button
                  title="Delete Note"
                  onClick={() => handleDelete(note.id)}
                >
                  <FaTrash />
                </button>

              </div>
            </div>
          ))}

        </div>
      )}

      {showForm && (
        <div className="paper-modal-overlay">

          <div className="paper-modal">

            <div className="paper-modal-heading">
              <h2>
                {editingId !== null ? "Edit Note" : "Create Personal Note"}
              </h2>

              <button onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <label>Select Research Paper *</label>

              <select
                required
                value={selectedPaperId}
                disabled={editingId !== null}
                onChange={(e) => setSelectedPaperId(e.target.value)}
              >
                <option value="">Choose a research paper</option>

                {papers.map((paper) => (
                  <option key={paper.id} value={paper.id}>
                    {paper.title}
                  </option>
                ))}
              </select>

              <label>Your Note *</label>

              <textarea
                required
                rows="8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your research notes here..."
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
                  <FaSave />
                  {editingId !== null ? "Update Note" : "Save Note"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
