import { useEffect, useState } from "react";
import {
  FaBookOpen, FaFileAlt, FaUsers, FaRobot,
  FaPlus, FaArrowRight, FaSync
} from "react-icons/fa";
import { getDashboardStats } from "../services/dashboardService";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResearchPapers: 0,
    totalDrafts: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadStats = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError("Unable to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers />,
      color: "blue"
    },
    {
      title: "Research Papers",
      value: stats.totalResearchPapers,
      icon: <FaBookOpen />,
      color: "purple"
    },
    {
      title: "Saved Drafts",
      value: stats.totalDrafts,
      icon: <FaFileAlt />,
      color: "green"
    },
    {
      title: "AI Research Assistant",
      value: "AI",
      icon: <FaRobot />,
      color: "orange"
    }
  ];

  return (
    <div className="live-dashboard">

      <div className="live-dashboard-heading">
        <div>
          <span>YOUR ACADEMIC WORKSPACE</span>
          <h1>Welcome to ResearchAI ??</h1>
          <p>Manage your research papers and academic drafts.</p>
        </div>

        <button onClick={loadStats} className="refresh-btn">
          <FaSync /> Refresh
        </button>
      </div>

      {error && <div className="management-error">{error}</div>}

      <div className="live-stats-grid">
        {cards.map(card => (
          <div className="live-stat-card" key={card.title}>
            <div className={`live-stat-icon ${card.color}`}>
              {card.icon}
            </div>

            <p>{card.title}</p>

            <h2>
              {loading ? "..." : card.value}
            </h2>
          </div>
        ))}
      </div>

      <div className="live-dashboard-panel">
        <div>
          <FaRobot />
          <h2>AI Research Paper Generator</h2>
          <p>
            Generate complete academic research papers
            with AI assistance.
          </p>
          <button onClick={() => navigate("/ai-writer")}>
            Generate New Paper <FaArrowRight />
          </button>
        </div>
      </div>

      <div className="live-dashboard-actions">
        <button onClick={() => navigate("/drafts")}>
          <FaFileAlt /> View My Drafts
        </button>

        <button onClick={() => navigate("/research-papers")}>
          <FaBookOpen /> Research Papers
        </button>
      </div>

    </div>
  );
}
