import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api"; // axios instance for backend calls

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleDeleteAccount = async () => {
  if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

  try {
    await api.delete("/auth/delete-account");

    // Clear all auth/session data
    localStorage.removeItem("token");
    sessionStorage.clear();
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    alert("Account deleted successfully.");
    navigate("/");
  } catch (error) {
    alert("Failed to delete account.");
  }
};


  // Hide navbar entirely on these pages
  const hideNavbarOnPages = ["/", "/login", "/register"];
  if (hideNavbarOnPages.includes(location.pathname)) {
    return null;
  }

return (
  <nav className="nav">
    <div className="brand">
      <Link to="/dashboard">Dashboard</Link>
    </div>
    {user && (
      <div className="nav-right">
        <button onClick={handleDeleteAccount} style={{ backgroundColor : "red", color : "white" }}>
          Delete Account
        </button>
        <button onClick={handleLogout} style={{ border: "2px solid white", color : "white" }}>Logout</button>
      </div>
    )}
  </nav>
);
}