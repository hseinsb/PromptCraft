"use client";

import { useAuth } from "@/contexts/AuthContext";
import Login from "@/components/Login";
import Secret from "@/components/Secret";

export default function SecretPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-[#14142B] py-12 px-4">
      {isAuthenticated ? <Secret /> : <Login />}
    </main>
  );
}
