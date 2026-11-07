import { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTags,
  FaBook,
  FaSync,
  FaSearch,
  FaTimes,
  FaSave
} from "react-icons/fa";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../services/categoryService";

import {
  getTopics,
  createTopic,
  updateTopic,
  deleteTopic
} from "../services/topicService";

export default function CategoriesTopics() {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isCategory = activeTab === "categories";
  const records = isCategory ? categories : topics;

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [categoryData, topicData] = await Promise.all([
        getCategories(),
        getTopics()
      ]);

      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setTopics(Array.isArray(topicData) ? topicData : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load categories and topics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddForm = () => {
    setName("");
    setDescription("");
    setEditingId(null);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setName(item.name || "");
    setDescription(item.description || "");
    setEditingId(item.id);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const data = {
      name: name.trim(),
      description: description.trim()
    };

    try {
      setError("");
      setMessage("");

      if (isCategory) {
        if (editingId !== null) {
          await updateCategory(editingId, data);
          setMessage("Category updated successfully.");
        } else {
          await createCategory(data);
          setMessage("Category created successfully.");
        }
      } else {
        if (editingId !== null) {
          await updateTopic(editingId, data);
          setMessage("Topic updated successfully.");
        } else {
          await createTopic(data);
          setMessage("Topic created successfully.");
        }
      }

      setShowForm(false);
      setName("");
      setDescription("");
      setEditingId(null);

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        `Unable to save ${isCategory ? "category" : "topic"}.`
      );
    }
  };

  const handleDelete = async (id) => {
    const type = isCategory ? "category" : "topic";

    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      setError("");
      setMessage("");

      if (isCategory) {
        await deleteCategory(id);
      } else {
        await deleteTopic(id);
      }

      setMessage(`${type} deleted successfully.`);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        `Unable to delete ${type}.`
      );
    }
  };

  const filteredRecords = records.filter((item) =>
    `${item.name || ""} ${item.description || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setShowForm(false);
    setError("");
    setMessage("");
  };

  return (
    <div className="management-page">

      <div className="management-heading">
        <div>
          <span>RESEARCH MANAGEMENT</span>
          <h1>Categories & Topics</h1>
          <p>Organize research categories and topics.</p>
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
            <FaPlus /> Add {isCategory ? "Category" : "Topic"}
          </button>
        </div>
      </div>

      {message && (
        <div className="management-success">{message}</div>
      )}

      {error && (
        <div className="management-error">{error}</div>
      )}

      <div className="management-toolbar">
        <div className="management-actions">
          <button
            className={isCategory ? "management-primary" : "management-secondary"}
            onClick={() => switchTab("categories")}
          >
            <FaTags /> Categories ({categories.length})
          </button>

          <button
            className={!isCategory ? "management-primary" : "management-secondary"}
            onClick={() => switchTab("topics")}
          >
            <FaBook /> Topics ({topics.length})
          </button>
        </div>
      </div>

      <div className="management-toolbar">
        <div className="management-search">
          <FaSearch />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${isCategory ? "categories" : "topics"}...`}
          />
        </div>

        <span>{filteredRecords.length} Records</span>
      </div>

      {loading ? (
        <div className="management-empty">
          Loading {isCategory ? "categories" : "topics"}...
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="management-empty">
          {isCategory ? <FaTags /> : <FaBook />}
          <h3>No {isCategory ? "categories" : "topics"} found</h3>
          <p>
            {search
              ? "Try another search term."
              : `Add your first ${isCategory ? "category" : "topic"}.`}
          </p>
        </div>
      ) : (
        <div className="paper-grid">
          {filteredRecords.map((item) => (
            <div className="paper-card" key={item.id}>
              <div className="paper-card-icon">
                {isCategory ? <FaTags /> : <FaBook />}
              </div>

              <h3>{item.name}</h3>
              <p>{item.description || "No description available."}</p>

              <div className="paper-card-actions">
                <button
                  title="Edit"
                  onClick={() => openEditForm(item)}
                >
                  <FaEdit />
                </button>

                <button
                  title="Delete"
                  onClick={() => handleDelete(item.id)}
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
                {editingId !== null ? "Edit" : "Add"}{" "}
                {isCategory ? "Category" : "Topic"}
              </h2>

              <button onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Name *</label>

              <input
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`Enter ${isCategory ? "category" : "topic"} name`}
              />

              <label>Description</label>

              <textarea
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description..."
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
                  {editingId !== null ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
