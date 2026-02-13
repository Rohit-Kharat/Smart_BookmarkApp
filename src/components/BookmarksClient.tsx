"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Bookmark = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  created_at: string;
};

export default function BookmarksClient({
  initialBookmarks,
  userId,
}: {
  initialBookmarks: Bookmark[];
  userId: string;
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [rtReady, setRtReady] = useState(false);

  // 1) Ensure realtime has auth token BEFORE subscribing
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) console.error("getSession error:", error);

      const token = data.session?.access_token;
      if (token) {
        supabase.realtime.setAuth(token);
        setRtReady(true);
      } else {
        setRtReady(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const token = session?.access_token ?? "";
        supabase.realtime.setAuth(token);
        setRtReady(!!token);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  // 2) Subscribe only when realtime is ready (token set)
  useEffect(() => {
    if (!rtReady) return;

    const channel = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("realtime payload:", payload);

          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new as Bookmark, ...prev]);
          }

          if (payload.eventType === "DELETE") {
            const oldId = (payload.old as any)?.id;
            setBookmarks((prev) => prev.filter((b) => b.id !== oldId));
          }
        }
      )
      .subscribe((status) => console.log("realtime status:", status));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, rtReady]);

  const addBookmark = async () => {
    if (!title.trim() || !url.trim()) return;
    setLoading(true);

    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;

    const { error } = await supabase.from("bookmarks").insert({
      user_id: userId,
      title: title.trim(),
      url: normalizedUrl.trim(),
    });

    setLoading(false);

    if (error) {
      console.error("insert error:", error);
      alert(error.message);
      return;
    }

    setTitle("");
    setUrl("");
  };

  const deleteBookmark = async (id: string) => {
  // Optimistic update (instant UI change)
  setBookmarks((prev) => prev.filter((b) => b.id !== id));

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("delete error:", error);
    alert(error.message);

    // If delete failed, reload from DB (rollback)
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data ?? []);
  }
};

  return (
    <div className="mt-10  px-4">
    <div className="w-full max-w-3xl  bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-6">
        <input
          className="border rounded px-3 py-2 flex-1 "
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={addBookmark}
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-black/80 text-white hover:bg-black hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <div className="mt-6">
        {bookmarks.length === 0 ? (
          <p className="text-white-600">No bookmarks yet.</p>
        ) : (
          <ul className="space-y-3">
            {bookmarks.map((b) => (
              <li
                key={b.id}
                className="border rounded p-3 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-medium break-words">{b.title}</div>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-green-400 underline break-words"
                  >
                    {b.url}
                  </a>
                </div>
                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
