import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaTimes,
  FaBell,
  FaCheck,
  FaTrash,
  FaBars
} from "react-icons/fa";

import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";

import { getDrafts } from "../services/draftService";
import { getResearchPapers } from "../services/researchPaperService";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications
} from "../services/notificationService";

export default function MainLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState([]);
  const [papers, setPapers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const [notifications, setNotifications] = useState(getNotifications());
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const [draftData, paperData] = await Promise.all([
          getDrafts(),
          getResearchPapers()
        ]);

        setDrafts(Array.isArray(draftData) ? draftData : []);
        setPapers(Array.isArray(paperData) ? paperData : []);
      } catch (error) {
        console.error("Search loading failed:", error);
      }
    };

    loadSearchData();

    const refreshNotifications = () => {
      setNotifications(getNotifications());
    };

    window.addEventListener(
      "researchai-notifications-updated",
      refreshNotifications
    );

    return () => {
      window.removeEventListener(
        "researchai-notifications-updated",
        refreshNotifications
      );
    };
  }, []);

  const searchTerm = query.trim().toLowerCase();

  const matchingDrafts = searchTerm
    ? drafts.filter(item =>
        `${item.title || ""} ${item.topic || ""} ${item.content || ""}`
          .toLowerCase()
          .includes(searchTerm)
      )
    : [];

  const matchingPapers = searchTerm
    ? papers.filter(item =>
        `${item.title || ""} ${item.authors || ""} ${item.journal || ""} ${item.abstractText || ""}`
          .toLowerCase()
          .includes(searchTerm)
      )
    : [];

  const unreadCount = notifications.filter(item => !item.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openResult = (path) => {
    setShowResults(false);
    setQuery("");
    navigate(path);
  };

  const openNotification = (item) => {
    markNotificationRead(item.id);

    navigate(item.type === "paper" ? "/research-papers" : "/drafts");

    setShowNotifications(false);
  };

  return (
    <div className={`app ${sidebarOpen ? "sidebar-open" : ""}`}>

      <Sidebar
        onLogout={handleLogout}
        onNavigate={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="main">

        <header className="topbar">

          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          <h5>ResearchAI Workspace</h5>

          <div className="global-search-wrapper">
            <div className="global-search-box">
              <FaSearch />

              <input
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setShowResults(Boolean(e.target.value.trim()));
                }}
                onFocus={() => {
                  if (query.trim()) setShowResults(true);
                }}
                placeholder="Search papers and drafts..."
              />

              {query && (
                <button onClick={() => {
                  setQuery("");
                  setShowResults(false);
                }}>
                  <FaTimes />
                </button>
              )}
            </div>

            {showResults && searchTerm && (
              <div className="global-search-results">
                <div className="global-search-count">
                  {matchingPapers.length + matchingDrafts.length} results found
                </div>

                {matchingPapers.map(paper => (
                  <button
                    key={`paper-${paper.id}`}
                    className="global-search-result"
                    onClick={() => openResult("/research-papers")}
                  >
                    <span>
                      <strong>{paper.title}</strong>
                      <small>Research Paper</small>
                    </span>
                  </button>
                ))}

                {matchingDrafts.map(draft => (
                  <button
                    key={`draft-${draft.id}`}
                    className="global-search-result"
                    onClick={() => openResult("/drafts")}
                  >
                    <span>
                      <strong>{draft.title}</strong>
                      <small>Draft</small>
                    </span>
                  </button>
                ))}

                {matchingPapers.length + matchingDrafts.length === 0 && (
                  <div className="global-search-no-result">
                    No matching results found.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="notification-wrapper">
            <button
              className="notification-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <FaBell />

              {unreadCount > 0 && (
                <span className="notification-count">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-panel">
                <div className="notification-header">
                  <strong>Notifications</strong>

                  <button onClick={() => {
                    markAllNotificationsRead();
                    setNotifications(getNotifications());
                  }}>
                    <FaCheck /> Read all
                  </button>
                </div>

                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <p className="notification-empty">
                      No notifications yet.
                    </p>
                  ) : notifications.map(item => (
                    <button
                      key={item.id}
                      className={`notification-item ${item.read ? "read" : ""}`}
                      onClick={() => openNotification(item)}
                    >
                      <span className="notification-dot" />

                      <span>
                        <strong>{item.message}</strong>
                        <small>
                          {new Date(item.createdAt).toLocaleString()}
                        </small>
                      </span>
                    </button>
                  ))}
                </div>

                {notifications.length > 0 && (
                  <button
                    className="notification-clear"
                    onClick={() => {
                      clearNotifications();
                      setNotifications(getNotifications());
                    }}
                  >
                    <FaTrash /> Clear All
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="avatar">
            {(user?.name || "A").charAt(0).toUpperCase()}
          </div>

        </header>

        <section
          className="content"
          onClick={() => {
            setShowResults(false);
            setShowNotifications(false);
          }}
        >
          <Outlet />
        </section>

      </main>
    </div>
  );
}
