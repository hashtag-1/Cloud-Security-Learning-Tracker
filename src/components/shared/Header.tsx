"use client";

import { useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b bg-card px-6 py-3 sticky top-0 z-10">
      {session?.user?.name || "User"}
    </header>
  );
}