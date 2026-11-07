import { useState, useEffect } from "react";
import {
  FaBell, FaShieldAlt, FaPalette, FaSave
} from "react-icons/fa";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [privacy, setPrivacy] = useState(true);
  const [theme, setTheme] = useState("Light");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("appSettings") || "{}"
    );

    setNotifications(saved.notifications ?? true);
    setPrivacy(saved.privacy ?? true);
    setTheme(saved.theme || "Light");
  }, []);

  const saveSettings = () => {
    const settings = {
      notifications,
      privacy,
      theme
    };

    localStorage.setItem("appSettings", JSON.stringify(settings));

    document.documentElement.setAttribute(
      "data-theme",
      theme.toLowerCase()
    );

    setMessage("Settings saved successfully.");
  };

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <span>PREFERENCES</span>
        <h1>Application Settings</h1>
        <p>Customize your ResearchAI workspace.</p>
      </div>

      <div className="settings-card">

        <div className="setting-row">
          <div className="setting-icon"><FaBell /></div>
          <div className="setting-info">
            <h4>Notifications</h4>
            <p>Enable application notifications preference.</p>
          </div>
          <input
            type="checkbox"
            checked={notifications}
            onChange={e => setNotifications(e.target.checked)}
          />
        </div>

        <div className="setting-row">
          <div className="setting-icon"><FaPalette /></div>
          <div className="setting-info">
            <h4>Appearance</h4>
            <p>Select your workspace theme.</p>
          </div>
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </select>
        </div>

        <div className="setting-row">
          <div className="setting-icon"><FaShieldAlt /></div>
          <div className="setting-info">
            <h4>Privacy Preference</h4>
            <p>Save your preferred privacy setting.</p>
          </div>
          <input
            type="checkbox"
            checked={privacy}
            onChange={e => setPrivacy(e.target.checked)}
          />
        </div>

        {message && <div className="auth-success">{message}</div>}

        <button className="settings-save" onClick={saveSettings}>
          <FaSave /> Save Settings
        </button>

      </div>
    </div>
  );
}
