import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaGraduationCap, FaSave } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [university, setUniversity] = useState(
    localStorage.getItem("university") || ""
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const saveProfile = () => {
    const updatedUser = {
      ...user,
      name,
      email
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("university", university);
    setMessage("Profile updated successfully.");
  };

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <span>ACCOUNT MANAGEMENT</span>
        <h1>My Profile</h1>
        <p>Manage your personal information.</p>
      </div>

      <div className="settings-card">
        <div className="profile-avatar">
          {(name || "U").charAt(0).toUpperCase()}
        </div>

        <h3>Personal Information</h3>
        <p>Your ResearchAI account details.</p>

        <label>Full Name</label>
        <div className="settings-input">
          <FaUser />
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <label>Email Address</label>
        <div className="settings-input">
          <FaEnvelope />
          <input value={email} disabled />
        </div>

        <label>University / Institution</label>
        <div className="settings-input">
          <FaGraduationCap />
          <input
            value={university}
            onChange={e => setUniversity(e.target.value)}
            placeholder="Enter institution name"
          />
        </div>

        {message && <div className="auth-success">{message}</div>}

        <button className="settings-save" onClick={saveProfile}>
          <FaSave /> Save Changes
        </button>
      </div>
    </div>
  );
}
