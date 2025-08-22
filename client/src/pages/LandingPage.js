import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="centered">
      <h1 className="title">Ink and Quills</h1>
      <p className="subtitle">Your private paper — online.</p>

      <div style={{ marginTop: 20 }}>
        <Link to="/login" className="primary-btn">Login</Link>{" "}
        <Link to="/register" className="secondary-btn">Register</Link>
      </div>
    </div>
  );
}
