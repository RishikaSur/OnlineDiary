import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function DiaryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntry() {
      try {
        const res = await API.get(`/diary/${id}`);
        setEntry(res.data);
        setContent(res.data.content);
      } catch (err) {
        alert("Entry not found");
        navigate("/old-entries");
      } finally {
        setLoading(false);
      }
    }
    fetchEntry();
  }, [id, navigate]);

  async function handleSave() {
    try {
      const res = await API.patch(`/diary/${id}`, { content });
      setEntry(res.data);
      alert("Entry updated!");
      navigate("/old-entries");
    } catch (err) {
      alert("Failed to update entry");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="diary-page">
      <div className="date-left">
        {new Date(entry.date).toLocaleDateString()}
      </div>
      <textarea
        className="diary-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div style={{ marginTop: 12 }}>
        <button className="primary-btn" onClick={handleSave}>
          Save Changes
        </button>{" "}
        <button className="secondary-btn" onClick={() => navigate("/old-entries")}>
          Cancel
        </button>
      </div>
    </div>
  );
}

