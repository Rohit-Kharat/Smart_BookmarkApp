import LoginButton from "@/components/LoginButton";
import BookmarksClient from "@/components/BookmarksClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import VantaBackground from "@/components/VantaBackground";
import VantaBackgroundOfBookMark from "@/components/VantaBackgroundOfBookMark";
import LogoutButton from "@/components/LogoutButton";
import AuthVantaLayer from "@/components/AuthVantaLayer";



export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  
  if (!user) {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-4">
         <AuthVantaLayer isLoggedIn={!!user} />
        <VantaBackground />

        <div className="w-full max-w-md rounded-2xl bg-grey/80 backdrop-blur-md shadow-xl border border-white/40 p-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Smart Bookmark App
          </h1>
          <p className="mt-2 text-white-700">
            Save links securely and access them anywhere.
          </p>

          <div className="mt-6">
            <LoginButton />
          </div>

          <p className="mt-4 text-xs text-white-600">
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
    <>
    <main className="relative min-h-screen px-4">

    {/* ✅ ONE Vanta background always */}
    <VantaBackgroundOfBookMark />

    {/* ✅ Top Left - user email */}
    <div className="absolute top-6 left-6 z-20">
      <p className="text-white/90">
        Logged in as: <b>{user.email}</b>
      </p>
    </div>

    {/* ✅ Top Right - logout */}
    <div className="absolute top-6 right-6 z-20 ">
      <LogoutButton />
    </div>

    {/* ✅ Center Card */}
    <div className="min-h-screen  flex items-center justify-center">
      <div className="relative w-full max-w-2xl p-8 bg-white/10  backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl">
        <h1 className="text-2xl font-semibold text-white">
          Smart Bookmark App
        </h1>

        <BookmarksClient initialBookmarks={bookmarks ?? []} userId={user.id} />
      </div>
    </div>

  </main>

</>
  );
}
