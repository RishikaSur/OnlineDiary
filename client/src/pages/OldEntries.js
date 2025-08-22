import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function OldEntries() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    async function fetchList() {
      try {
        const res = await API.get("/diary");
        setEntries(res.data || []);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchList();
  }, [navigate]);

  if (loading) return <div className="centered">Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Your Entries</h2>
      {entries.length === 0 && <p>No entries yet.</p>}
      {entries.map((e) => (
        <div key={e.id} className="entry-card">
          <div className="entry-date">{new Date(e.date).toLocaleDateString()}</div>
          <div className="entry-snippet">{(e.content || "").slice(0, 200)}</div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => navigate(`/entry/${e.id}`)}>Open</button>
            <button
            style={{ marginLeft: 10, backgroundColor: "red", color: "white" }}
            onClick={async () => {
              if (window.confirm("Delete this entry?")) {
                await API.delete(`/diary/${e.id}`);
                setEntries(entries.filter((x) => x.id !== e.id));
              }
            }}
          >
            Delete
          </button>
          </div>
        </div>
      ))}
    </div>
  );
}
