"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function InboxPage() {
  const supabase = createClientComponentClient();

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setMessages(data || []);
  }

  async function sendMessage() {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user || !text) return;

    await supabase.from("messages").insert({
      user_id: user.id,
      sender: "Customer",
      message: text,
    });

    setText("");
    loadMessages();
  }

  return (
    <div className="p-10 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>

      <div className="space-y-4 mb-10">
        {messages.map((msg: any, i) => (
          <div key={i} className="bg-[#1b1c1f] p-4 rounded-xl border border-gray-700">
            <p className="text-blue-400">{msg.sender}</p>
            <p>{msg.message}</p>
            <p className="text-gray-500 text-sm">{new Date(msg.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* MESSAGE BOX */}
      <div className="flex gap-4">
        <input
          className="flex-1 p-3 rounded-xl bg-[#111214] border border-gray-700 text-white"
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 font-bold"
        >
          Send
        </button>
      </div>
    </div>
  );
}
