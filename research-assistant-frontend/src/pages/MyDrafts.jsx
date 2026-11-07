import { useEffect, useState } from "react";
import {
  FaFileAlt, FaSearch, FaTrash, FaEye,
  FaEdit, FaSync, FaTimes, FaSave
} from "react-icons/fa";

import {
  getDrafts,
  updateDraft,
  deleteDraft
} from "../services/draftService";

export default function MyDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    topic: "",
    content: ""
  });

  const loadDrafts = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getDrafts();
      setDrafts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load drafts. Check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const openDraft = (draft, edit = false) => {
    setSelected(draft);
    setForm({
      title: draft.title || "",
      topic: draft.topic || "",
      content: draft.content || ""
    });
    setEditing(edit);
  };

  const handleUpdate = async () => {
    if (!form.title.trim() || !form.topic.trim()) {
      setError("Title and topic are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const updated = await updateDraft(selected.id, form);

      setDrafts(prev =>
        prev.map(d => d.id === selected.id ? updated : d)
      );

      setSelected(updated);
      setEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to update draft."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) {
      return;
    }

    try {
      await deleteDraft(id);
      setDrafts(prev => prev.filter(d => d.id !== id));

      if (selected?.id === id) {
        setSelected(null);
      }
    } catch (err) {
      setError("Unable to delete draft.");
    }
  };

  const filtered = drafts.filter(d =>
    [d.title, d.topic, d.content].some(value =>
      String(value || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="management-page">

      <div className="management-heading">
        <div>
          <span className="management-label">YOUR WORKSPACE</span>
          <h1>My Research Drafts</h1>
          <p>View, edit and manage your saved research papers.</p>
        </div>

        <button className="refresh-btn" onClick={loadDrafts}>
          <FaSync /> Refresh
        </button>
      </div>

      <div className="management-toolbar">
        <div className="management-search">
          <FaSearch />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search drafts by title or topic..."
          />
        </div>

        <span>{drafts.length} Saved Drafts</span>
      </div>

      {error && <div className="management-error">{error}</div>}

      {loading ? (
        <div className="management-empty">Loading drafts...</div>
      ) : filtered.length === 0 ? (
        <div className="management-empty">
          <FaFileAlt />
          <h3>No drafts found</h3>
          <p>Generate a research paper to see it here.</p>
        </div>
      ) : (
        <div className="draft-grid">
          {filtered.map(draft => (
            <div className="draft-card" key={draft.id}>

              <div className="draft-card-top">
                <FaFileAlt />
                <button onClick={() => handleDelete(draft.id)}>
                  <FaTrash />
                </button>
              </div>

              <h3>{draft.title || "Untitled Research"}</h3>

              <p className="draft-topic">
                Topic: {draft.topic || "N/A"}
              </p>

              <p>
                {draft.content?.slice(0, 160) || "No content available"}
              </p>

              <small>
                Created: {draft.createdAt
                  ? new Date(draft.createdAt).toLocaleDateString()
                  : "Date unavailable"}
              </small>

              <div className="draft-actions">
                <button onClick={() => openDraft(draft)}>
                  <FaEye /> View
                </button>

                <button onClick={() => openDraft(draft, true)}>
                  <FaEdit /> Edit
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="draft-modal-overlay">
          <div className="draft-modal">

            <div className="draft-modal-header">
              <h3>{editing ? "Edit Research Draft" : "Research Draft"}</h3>

              <button onClick={() => {
                setSelected(null);
                setEditing(false);
              }}>
                <FaTimes />
              </button>
            </div>

            <div className="draft-modal-body">

              <label>Research Title</label>
              <input
                disabled={!editing}
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
              />

              <label>Research Topic</label>
              <input
                disabled={!editing}
                value={form.topic}
                onChange={e => setForm({...form, topic: e.target.value})}
              />

              <label>Research Content</label>
              <textarea
                disabled={!editing}
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
              />

              {editing && (
                <button
                  className="settings-save"
                  onClick={handleUpdate}
                  disabled={saving}
                >
                  <FaSave /> {saving ? "Saving..." : "Save Changes"}
                </button>
              )}

              {!editing && (
                <div className="draft-modal-actions">
                  <button onClick={() => setEditing(true)}>
                    <FaEdit /> Edit Draft
                  </button>

                  <button onClick={() => handleDelete(selected.id)}>
                    <FaTrash /> Delete Draft
                  </button>

                  <button onClick={() =>
                    navigator.clipboard.writeText(selected.content || "")
                  }>
                    Copy Content
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
