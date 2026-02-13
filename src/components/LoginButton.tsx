"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginButton() {
  const supabase = createSupabaseBrowserClient();

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="w-full px-4 py-3 rounded-lg bg-black text-white font-medium hover:bg-red-700 hover:scale-105 transition-all duration-300 transition"
    >
      Continue with Google
    </button>
  );
}
