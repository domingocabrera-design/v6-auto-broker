"use client";
import { useState } from "react";

export default function UploadCSV() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(e: any) {
    setLoading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-csv", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setMessage(`Uploaded ${data.inserted} lots successfully!`);
    } else {
      setMessage("Error uploading CSV.");
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Upload Copart CSV</h1>

      <input type="file" accept=".csv" onChange={upload} />

      {loading && <p>Uploading…</p>}
      {message && <p>{message}</p>}
    </div>
  );
}
