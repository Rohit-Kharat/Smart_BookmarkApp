import LoginButton from "@/components/LoginButton";
import BookmarksClient from "@/components/BookmarksClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import VantaBackground from "@/components/VantaBackground";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  
  if (!user) {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-4">
        <VantaBackground />

        <div className="w-full max-w-md rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-white/40 p-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Smart Bookmark App
          </h1>
          <p className="mt-2 text-gray-700">
            Save links securely and access them anywhere.
          </p>

          <div className="mt-6">
            <LoginButton />
          </div>

          <p className="mt-4 text-xs text-gray-600">
            Google login only • Your bookmarks are private (RLS secured)
          </p>
        </div>
      </main>
    );
  }


  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-600">Error loading bookmarks: {error.message}</p>
      </main>
    );
  }


  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">Smart Bookmark App</h1>
      <p className="mt-2 text-gray-700">
        Logged in as: <b>{user.email}</b>
      </p>

      <BookmarksClient initialBookmarks={bookmarks ?? []} userId={user.id} />
    </main>
  );
}
