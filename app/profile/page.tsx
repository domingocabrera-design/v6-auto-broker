"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ProfilePage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function updateName() {
    const newName = prompt("Enter new name:");
    if (!newName) return;

    await supabase.from("profiles").update({ full_name: newName }).eq("id", user.id);
    alert("Updated!");
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-10 ml-64 text-white">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-[#1d1d1d] p-6 rounded-xl">
        <p>Email: {user.email}</p>
        <p>User ID: {user.id}</p>

        <button
          onClick={updateName}
          className="mt-4 px-6 py-3 bg-blue-600 rounded-xl"
        >
          Update Name
        </button>
      </div>
    </div>
  );
}
