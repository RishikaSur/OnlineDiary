import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthSuccess from "./pages/OAuthSuccess";
import Dashboard from "./pages/Dashboard";
import NewEntry from "./pages/NewEntry";
import OldEntries from "./pages/OldEntries";
import DiaryView from "./pages/DiaryView";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On mount, check if token exists and set user
    const token = localStorage.getItem("token");
    if (token) {
      // Here you can decode token or simply mark user as logged in
      setUser({ token }); // Simplified, you might want to store user info
    }
  }, []);

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={<Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={<Register setUser={setUser} />}
        />
        <Route path="/oauth-success" element={<OAuthSuccess setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/new-entry" element={user ? <NewEntry /> : <Navigate to="/login" />} />
        <Route path="/old-entries" element={user ? <OldEntries /> : <Navigate to="/login" />} />
        <Route path="/entry/:id" element={user ? <DiaryView /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

