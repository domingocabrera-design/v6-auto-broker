"use client";

import { useState } from "react";

export default function FreezeButton({
  userId,
  frozen,
}: {
  userId: string;
  frozen: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function toggleFreeze() {
    setLoading(true);

    await fetch(`/api/admin/users/${userId}/freeze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ freeze: !frozen }),
    });

    window.location.reload();
  }

  return (
    <button
      disabled={loading}
      onClick={toggleFreeze}
      className={`px-3 py-1 rounded text-sm font-semibold ${
        frozen
          ? "bg-green-600 hover:bg-green-500"
          : "bg-red-600 hover:bg-red-500"
      }`}
    >
      {loading
        ? "Updating..."
        : frozen
        ? "Unfreeze"
        : "Freeze"}
    </button>
  );
}
