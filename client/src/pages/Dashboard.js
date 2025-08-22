import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { getUser } from "../services/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [hasEntries, setHasEntries] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    async function fetchEntries() {
      try {
        const res = await API.get("/diary");
        setHasEntries(res.data && res.data.length > 0);
      } catch (err) {
        // if unauthorized -> send to login
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [navigate]);

  if (loading) return <div className="centered">Loading...</div>;

  return (
    <div className="centered">
      <h2 style={{fontSize : "120px"}}>Welcome{user ? `, ${user.username}` : ""}!</h2>

      <div style={{ marginTop: 20 }}>
        <button className="primary-btn" onClick={() => navigate("/new-entry")}>Start New Entry</button>
        {hasEntries && (
          <button className="secondary-btn" onClick={() => navigate("/old-entries")}>View Old Entries</button>
        )}
      </div>
    </div>
  );
}
