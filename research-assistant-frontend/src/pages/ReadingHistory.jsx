import { useEffect, useState } from "react";
import {
  FaHistory,
  FaSync,
  FaTrash,
  FaSearch
} from "react-icons/fa";

import {
  getReadingHistory,
  clearReadingHistory
} from "../services/readingHistoryService";

export default function ReadingHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getReadingHistory();
      setHistory(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load reading history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear your reading history?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await clearReadingHistory();
      setHistory([]);
      setMessage("Reading history cleared successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to clear reading history."
      );
    }
  };

  const getPaperTitle = (item) =>
    item.paperTitle ?? item.paper?.title ?? item.title ?? "Research Paper";

  const getReadDate = (item) => {
    const date = item.readAt ?? item.lastReadAt ?? item.createdAt ?? item.viewedAt;

    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "Date not available"
      : parsedDate.toLocaleString();
  };

  const filteredHistory = history.filter((item) =>
    getPaperTitle(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="management-page">
      <div className="management-heading">
        <div>
          <span>YOUR RESEARCH WORKSPACE</span>
          <h1>Reading History</h1>
          <p>View the research papers you have recently accessed.</p>
        </div>

        <div className="management-actions">
          <button className="management-secondary" onClick={loadHistory}>
            <FaSync /> Refresh
          </button>

          <button
            className="management-secondary"
            onClick={handleClear}
            disabled={history.length === 0}
          >
            <FaTrash /> Clear History
          </button>
        </div>
      </div>

      {message && <div className="management-success">{message}</div>}
      {error && <div className="management-error">{error}</div>}

      <div className="management-toolbar">
        <div className="management-search">
          <FaSearch />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reading history..."
          />
        </div>

        <span>{filteredHistory.length} Records</span>
      </div>

      {loading ? (
        <div className="management-empty">Loading reading history...</div>
      ) : filteredHistory.length === 0 ? (
        <div className="management-empty">
          <FaHistory />
          <h3>No reading history found</h3>
          <p>
            {search
              ? "Try another search term."
              : "Research papers you access will appear here."}
          </p>
        </div>
      ) : (
        <div className="paper-grid">
          {filteredHistory.map((item, index) => (
            <div
              className="paper-card"
              key={item.id ?? item.paperId ?? index}
            >
              <div className="paper-card-icon">
                <FaHistory />
              </div>

              <h3>{getPaperTitle(item)}</h3>

              <p>
                <strong>Last accessed:</strong> {getReadDate(item)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
