"use client";

import Image from "next/image";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login() {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen bg-[#0d0d0f] flex items-center justify-center px-6 relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] -top-32 -left-32"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px] bottom-0 right-0"></div>
      </div>

      {/* GOLD BOT FLOATING */}
      <div className="absolute top-10 right-10 opacity-70 hover:opacity-100 transition">
        <Image src="/goldv6.png" alt="V6 Bot" width={110} height={110} />
      </div>

      {/* LOGIN CARD */}
      <div className="bg-black/60 border border-gray-700 shadow-2xl backdrop-blur-xl p-10 rounded-3xl w-full max-w-md z-10">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/v6-logo.png"
            width={120}
            height={120}
            alt="V6 Logo"
            className="drop-shadow-[0_0_15px_rgba(0,122,255,0.7)]"
          />
          <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">Log in to your V6 Auto Broker account</p>
        </div>

        {/* FORM */}
        <div className="space-y-5">

          <div>
            <label className="text-gray-300 text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-2 w-full p-3 bg-black border border-gray-600 rounded-xl text-white focus:border-blue-500 outline-none"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium">Password</label>
            <input
              type="password"
              className="mt-2 w-full p-3 bg-black border border-gray-600 rounded-xl text-white focus:border-blue-500 outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
          )}

          <button
            onClick={login}
            disabled={loading}
            className="
              w-full py-3 rounded-xl font-bold 
              bg-blue-600 hover:bg-blue-700 
              text-white shadow-lg shadow-blue-600/40 
              transition mt-4
            "
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Don’t have an account?
            <a href="/signup" className="text-blue-400 hover:underline ml-1">
              Sign up
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
