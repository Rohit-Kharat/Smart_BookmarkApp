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
      className="w-full px-4 py-3 rounded-lg bg-black text-white font-medium hover:opacity-90 transition"
    >
      Continue with Google
    </button>
  );
}
