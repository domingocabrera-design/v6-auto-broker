"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddLotForm from "./AddLotForm";

export default function AddLotPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loggedIn = localStorage.getItem("v6-logged-in");
    if (!loggedIn) {
      router.push("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return <div className="p-6 text-sm">Checking login…</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Copart Lot</h1>
      <AddLotForm />
    </div>
  );
}
