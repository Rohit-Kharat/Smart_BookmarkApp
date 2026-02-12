import LoginButton from "@/components/LoginButton";
import BookmarksClient from "@/components/BookmarksClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold">Smart Bookmark App</h1>
        <p className="mt-2 text-gray-600">Login with Google to continue.</p>
        <div className="mt-4">
          <LoginButton />
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
