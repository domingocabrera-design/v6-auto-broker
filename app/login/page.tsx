"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function LoginPage() {
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    if (data?.user) {
      // SAVE USER ID
      localStorage.setItem("user_id", data.user.id);

      // GO TO DASHBOARD
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl p-10 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            className="w-full p-3 border rounded-lg"
            placeholder="Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full p-3 border rounded-lg"
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMsg && <p className="text-red-600">{errorMsg}</p>}

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}
