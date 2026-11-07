
import { useEffect, useState } from "react";
import { FaBookmark, FaTrash, FaSync, FaBook } from "react-icons/fa";
import { getBookmarks, removeBookmark } from "../services/bookmarkService";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBookmarks();
      setBookmarks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load bookmarks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleRemove = async (paperId) => {
    if (!window.confirm("Remove this paper from bookmarks?")) {
      return;
    }

    try {
      await removeBookmark(paperId);

      setBookmarks((previous) =>
        previous.filter((item) => item.paperId !== paperId)
      );

      setMessage("Bookmark removed successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to remove bookmark."
      );
    }
  };

  return (
    <div className="management-page">

      <div className="management-heading">
        <div>
          <span>ACADEMIC LIBRARY</span>
          <h1>My Bookmarks</h1>
          <p>Access your saved research papers in one place.</p>
        </div>

        <button
          className="management-secondary"
          onClick={loadBookmarks}
        >
          <FaSync /> Refresh
        </button>
      </div>

      {message && (
        <div className="management-success">{message}</div>
      )}

      {error && (
        <div className="management-error">{error}</div>
      )}

      <div className="management-toolbar">
        <span>{bookmarks.length} Bookmarked Papers</span>
      </div>

      {loading ? (
        <div className="management-empty">
          Loading bookmarks...
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="management-empty">
          <FaBookmark />
          <h3>No bookmarks yet</h3>
          <p>Save research papers to access them quickly later.</p>
        </div>
      ) : (
        <div className="paper-grid">
          {bookmarks.map((item) => (
            <div className="paper-card" key={item.id}>

              <div className="paper-card-icon">
                <FaBook />
              </div>

              <h3>{item.paperTitle || "Untitled Paper"}</h3>

              <p>
                Saved on:{" "}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "Date unavailable"}
              </p>

              <div className="paper-card-actions">
                <button
                  onClick={() => handleRemove(item.paperId)}
                  title="Remove Bookmark"
                >
                  <FaTrash />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
