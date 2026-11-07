import {
  FaHome,
  FaRobot,
  FaBook,
  FaFileAlt,
  FaUser,
  FaCog,
  FaGraduationCap,
  FaSignOutAlt,
  FaBookmark,
  FaStickyNote,
  FaHistory,
  FaTags
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function Sidebar({ onLogout }) {
  const menu = [
    ["/", "Dashboard", <FaHome />],
    ["/ai-writer", "AI Research Writer", <FaRobot />],
    ["/research-papers", "Research Papers", <FaBook />],
    ["/bookmarks", "Bookmarks", <FaBookmark />],
    ["/notes", "Personal Notes", <FaStickyNote />],
    ["/reading-history", "Reading History", <FaHistory />],
    ["/categories-topics", "Categories & Topics", <FaTags />],
    ["/drafts", "My Drafts", <FaFileAlt />],
    ["/profile", "Profile", <FaUser />],
    ["/settings", "Settings", <FaCog />]
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <FaGraduationCap />
        <div>
          <h4>ResearchAI</h4>
          <small>Academic Workspace</small>
        </div>
      </div>

      <p className="menu-label">WORKSPACE</p>

      {menu.map(([path, name, icon]) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/"}
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
        >
          {icon}
          {name}
        </NavLink>
      ))}

      <button className="menu-item" onClick={onLogout}>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}


