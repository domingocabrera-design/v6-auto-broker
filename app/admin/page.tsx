"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ================= TYPES =================

type Lot = {
  id: string;
  url: string;
  createdAt: string;
};

type RequestLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  carRequest: string;
  budget: string;
  zip: string;
  createdAt: string;
};

// ================= MAIN ADMIN PAGE =================

export default function AdminPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);

  const [lots, setLots] = useState<Lot[]>([]);
  const [loadingLots, setLoadingLots] = useState(true);

  const [requests, setRequests] = useState<RequestLead[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // ---------------- ADMIN AUTH CHECK ----------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loggedIn = localStorage.getItem("v6-logged-in");
    const userRaw = localStorage.getItem("v6-user");

    if (!loggedIn || !userRaw) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userRaw) as { email?: string };

      if (user.email !== "v6autobroker@yahoo.com") {
        router.push("/lots"); // normal user → redirect to public lots
        return;
      }
    } catch {
      router.push("/login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  // ---------------- LOAD ADMIN DATA ----------------
  useEffect(() => {
    if (checkingAuth) return;

    async function loadAdminData() {
      try {
        const [lotsRes, reqRes] = await Promise.all([
          fetch("/api/lots", { cache: "no-store" }),
          fetch("/api/requests", { cache: "no-store" }),
        ]);

        const lotsJson = await lotsRes.json();
        const reqJson = await reqRes.json();

        setLots(lotsJson.lots || []);
        setRequests(reqJson.requests || []);
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoadingLots(false);
        setLoadingRequests(false);
      }
    }

    loadAdminData();
  }, [checkingAuth]);

  if (checkingAuth) {
    return <div className="p-6 text-sm">Checking admin access…</div>;
  }

  // ================= RENDER ADMIN DASHBOARD =================

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">V6 Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Internal view for V6 Auto Broker.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push("/lots")}
            className="rounded-md border px-4 py-2 text-xs font-semibold hover:bg-gray-100"
          >
            Client View
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("v6-logged-in");
              localStorage.removeItem("v6-user");
              window.location.href = "/login";
            }}
            className="rounded-md border px-4 py-2 text-xs font-semibold hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-3">

        <div className="border rounded-xl p-4 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-400">Total Saved Lots</p>
          <p className="mt-2 text-3xl font-bold">{lots.length}</p>
        </div>

        <div className="border rounded-xl p-4 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-400">Requests</p>
          <p className="mt-2 text-3xl font-bold">{requests.length}</p>
        </div>

        <div className="border rounded-xl p-4 bg-white shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-400">Revenue (coming soon)</p>
          <p className="mt-2 text-lg text-gray-400">–</p>
        </div>

      </div>

      {/* SAVED LOTS TABLE */}
      <section className="border rounded-xl p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">All Saved Lots</h2>
          {loadingLots && <p className="text-xs text-gray-500">Loading lots…</p>}
        </div>

        {!loadingLots && lots.length === 0 && (
          <p className="text-sm text-gray-500">
            No lots added yet. When customers paste Copart URLs, they appear here.
          </p>
        )}

        {lots.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-gray-500">
                  <th className="py-2 pr-4">Lot ID</th>
                  <th className="py-2 pr-4">URL</th>
                  <th className="py-2 pr-4">Added</th>
                  <th className="py-2 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-mono text-xs">#{lot.id}</td>
                    <td className="py-2 pr-4 max-w-xs truncate">
                      <a
                        href={lot.url}
                        target="_blank"
                        className="underline"
                        rel="noreferrer"
                      >
                        {lot.url}
                      </a>
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-500">
                      {new Date(lot.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-0 text-right">
                      <a
                        href={lot.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-md border px-3 py-1 text-xs font-semibold hover:bg-gray-100"
                      >
                        Open on Copart
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* BUY REQUESTS TABLE */}
      <section className="border rounded-xl p-4 bg-white shadow-sm mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Buy Requests</h2>
          {loadingRequests && <p className="text-xs text-gray-500">Loading requests…</p>}
        </div>

        {!loadingRequests && requests.length === 0 && (
          <p className="text-sm text-gray-500">
            No requests yet. When customers submit “Request Buy” forms, they show here.
          </p>
        )}

        {requests.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-gray-500">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Contact</th>
                  <th className="py-2 pr-4">Budget / ZIP</th>
                  <th className="py-2 pr-4">Car Request</th>
                  <th className="py-2 pr-4">Created</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 align-top">
                    <td className="py-2 pr-4">
                      <div className="font-semibold text-sm">{r.name}</div>
                    </td>
                    <td className="py-2 pr-4 text-xs">
                      <div>{r.phone}</div>
                      <div className="text-gray-500">{r.email}</div>
                    </td>
                    <td className="py-2 pr-4 text-xs">
                      <div>{r.budget ? `$${r.budget}` : "-"}</div>
                      <div className="text-gray-500">{r.zip || "-"}</div>
                    </td>
                    <td className="py-2 pr-4 text-xs max-w-xs whitespace-pre-wrap">
                      {r.carRequest}
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}
