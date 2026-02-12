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
      className="px-4 py-2 rounded bg-black text-white"
    >
      Continue with Google
    </button>
  );
}
