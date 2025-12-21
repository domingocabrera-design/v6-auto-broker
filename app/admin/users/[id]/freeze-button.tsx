"use client";

import { useState } from "react";

export default function FreezeButton({
  userId,
  isFrozen,
}: {
  userId: string;
  isFrozen: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function toggleFreeze() {
    setLoading(true);

    await fetch("/api/admin/freeze-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        freeze: !isFrozen,
      }),
    });

    window.location.reload();
  }

  return (
    <button
      onClick={toggleFreeze}
      disabled={loading}
      className={`px-6 py-3 rounded-xl font-bold ${
        isFrozen
          ? "bg-green-600 hover:bg-green-500"
          : "bg-red-600 hover:bg-red-500"
      } text-black`}
    >
      {loading
        ? "Updating..."
        : isFrozen
        ? "Unfreeze User"
        : "Freeze User"}
    </button>
  );
}
