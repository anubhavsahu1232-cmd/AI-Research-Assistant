import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AIResearchWriter from "./pages/AIResearchWriter";
import MyDrafts from "./pages/MyDrafts";
import ResearchPapers from "./pages/ResearchPapers";
import Bookmarks from "./pages/Bookmarks";
import PersonalNotes from "./pages/PersonalNotes";
import ReadingHistory from "./pages/ReadingHistory";
import CategoriesTopics from "./pages/CategoriesTopics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import "./App.css";
import "./pages/auth.css";
import "./pages/AIResearchWriter.css";
import "./pages/management.css";
import "./pages/settings.css";
import "./pages/live-dashboard.css";
import "./pages/draft-management.css";
import "./pages/research-papers.css";
import "./layouts/global-search.css";
import "./layouts/notifications.css";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="ai-writer" element={<AIResearchWriter />} />
        <Route path="research-papers" element={<ResearchPapers />} />
        <Route path="bookmarks" element={<Bookmarks />} />
        <Route path="notes" element={<PersonalNotes />} />
          <Route path="reading-history" element={<ReadingHistory />} />
          <Route path="categories-topics" element={<CategoriesTopics />} />
        <Route path="drafts" element={<MyDrafts />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}



