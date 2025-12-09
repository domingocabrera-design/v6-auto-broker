"use client";

import { useState } from "react";

export default function AddLotForm() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/lots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) {
      const data = await res.json();
      setMessage(data.error || "Error saving lot");
      return;
    }

    const data = await res.json();
    setMessage(`Saved lot ${data.lotId}`);
    setUrl("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <label className="block text-sm font-medium">
        Copart URL
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.copart.com/lot/58046565"
          className="mt-1 w-full rounded-md border px-3 py-2"
          required
        />
      </label>
      <button
        type="submit"
        className="rounded-md px-4 py-2 font-semibold border"
      >
        Save Lot
      </button>
      {message && <p className="text-sm">{message}</p>}
    </form>
  );
}
