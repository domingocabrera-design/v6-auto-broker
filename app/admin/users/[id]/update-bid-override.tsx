"use client";

import { useTransition } from "react";
import { updateBidOverride } from "../actions";

export default function UpdateBidOverride({
  userId,
  value,
}: {
  userId: string;
  value: number | null;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <input
      type="number"
      min={0}
      defaultValue={value ?? ""}
      disabled={pending}
      onBlur={(e) => {
        const v = e.target.value === "" ? null : Number(e.target.value);
        startTransition(() => updateBidOverride(userId, v));
      }}
      className="w-20 bg-black border border-gray-700 rounded px-2 py-1 text-center"
    />
  );
}
