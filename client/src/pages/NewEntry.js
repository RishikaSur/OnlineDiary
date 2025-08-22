import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function NewEntry() {
  const navigate = useNavigate();
  const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const [content, setContent] = useState("Dear Diary, \n");
  const [saving, setSaving] = useState(false);

  // auth guard
  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  async function handleSave() {
    setSaving(true);
    try {
      await API.post("/diary", { date: todayISO, content });
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to save entry");
      setSaving(false);
    }
  }

  return (
    <div className="diary-page">
      <div className="date-left">{new Date().toLocaleDateString()}</div>
      <textarea
        className="diary-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div style={{ marginTop: 12 }}>
        <button className="primary-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>{" "}
        <button className="secondary-btn" onClick={() => navigate("/dashboard")}>Cancel</button>
      </div>
    </div>
  );
}
