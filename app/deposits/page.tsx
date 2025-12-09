"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DepositsPage() {
  const supabase = createClientComponentClient();
  const [deposit, setDeposit] = useState<any>(null);

  useEffect(() => {
    loadDeposit();
  }, []);

  async function loadDeposit() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // ❌ Fix: user may be null
    if (userError || !user) {
      console.error("User not logged in");
      return;
    }

    const { data, error } = await supabase
      .from("deposits")
      .select("*")
      .eq("user_id", user.id) // ✅ safe now
      .single();

    if (error) {
      console.error("Deposit fetch error:", error.message);
      return;
    }

    setDeposit(data);
  }

  async function addDeposit() {
    if (!deposit) return;

    const amount = prompt("Amount:");
    if (!amount) return;

    const newAmount = Number(amount);

    await supabase
      .from("deposits")
      .update({
        total_amount: deposit.total_amount + newAmount,
        available_amount: deposit.available_amount + newAmount,
      })
      .eq("id", deposit.id);

    alert("Added!");
    loadDeposit();
  }

  return (
    <div className="p-10 ml-64 text-white">
      <h1 className="text-3xl font-bold mb-6">My Deposits</h1>

      {!deposit ? (
        <p>No deposit record found.</p>
      ) : (
        <div className="bg-[#1d1d1d] p-6 rounded-xl space-y-2">
          <p>Total: ${deposit.total_amount}</p>
          <p>Available: ${deposit.available_amount}</p>
          <p>Locked: ${deposit.locked_amount}</p>

          <button
            onClick={addDeposit}
            className="mt-4 px-6 py-3 bg-green-600 rounded-xl"
          >
            Add Deposit
          </button>
        </div>
      )}
    </div>
  );
}
