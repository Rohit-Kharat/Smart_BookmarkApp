"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // refresh server component
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
    >
      Logout
    </button>
  );
}
