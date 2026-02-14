🚀 Smart Bookmark App

A full-stack real-time bookmark manager built with Next.js (App Router) and Supabase (Auth + Postgres + Realtime).

This project satisfies all requirements of the challenge:

Google OAuth only authentication

Private per-user bookmarks (RLS enforced)

Add & delete bookmarks

Real-time updates across tabs

Deployed on Vercel

🌐 Live Demo

👉 Live URL:
https://your-vercel-url.vercel.app

(Test using your own Google account)

🛠 Tech Stack

Frontend: Next.js (App Router), Tailwind CSS

Backend: Supabase

Authentication (Google OAuth)

PostgreSQL Database

Row Level Security (RLS)

Realtime subscriptions (WebSockets)

Deployment: Vercel

✅ Features Implemented
1️⃣ Google Authentication

Sign up & login using Google OAuth

No email/password authentication

Session handled securely via Supabase

2️⃣ Add Bookmark

Logged-in users can add:

Title

URL

URL normalization handled (auto-adds https:// if missing)

3️⃣ Private Per User (RLS Secured)

Bookmarks are protected using Row Level Security (RLS):

using (auth.uid() = user_id)


Users:

Can only view their own bookmarks

Cannot access other users’ data

Cannot manipulate user_id from frontend

Security is enforced at database level, not just frontend filtering.

4️⃣ Real-Time Updates

Bookmarks update instantly across multiple tabs using:

.on("postgres_changes", {
  event: "*",
  schema: "public",
  table: "bookmarks",
  filter: `user_id=eq.${userId}`
})


Realtime authentication is handled via:

supabase.realtime.setAuth(session.access_token)


If a bookmark is:

Added in Tab A → appears in Tab B

Deleted in Tab A → removed in Tab B

No page refresh required.

5️⃣ Delete Bookmark

Users can delete their own bookmarks.

Deletion is:

RLS protected

Synced in real-time across tabs

🏗 Database Schema
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  created_at timestamptz default now()
);

RLS Policies
create policy "read own bookmarks"
on public.bookmarks
for select
using (auth.uid() = user_id);

create policy "insert own bookmarks"
on public.bookmarks
for insert
with check (auth.uid() = user_id);

create policy "delete own bookmarks"
on public.bookmarks
for delete
using (auth.uid() = user_id);

⚡ Challenges Faced & Solutions
1️⃣ Google OAuth Redirect URI Mismatch

Issue: redirect_uri_mismatch error
Solution: Added Supabase callback URL:

https://PROJECT_REF.supabase.co/auth/v1/callback


to Google Cloud Console.

2️⃣ Session Not Persisting Across Tabs

Issue: Login succeeded but user redirected back to login page
Solution: Properly handled cookie setting inside /auth/callback route and added middleware for session refresh.

3️⃣ Realtime Not Working with RLS

Issue: Realtime subscription connected but no events received
Solution: Explicitly authenticated Realtime using:

supabase.realtime.setAuth(session.access_token)


and ensured subscription only starts after token is available.

4️⃣ RLS Blocking Deletes

Issue: Delete operation silently failed
Solution: Verified RLS policies and ensured auth.uid() matched user_id.

📦 Local Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/YOUR_USERNAME/smart-bookmark.git
cd smart-bookmark

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create .env.local:

NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

4️⃣ Run Development Server
npm run dev


Open:

http://localhost:3000

🚀 Deployment

Deployed using Vercel:

Push project to GitHub

Import into Vercel

Add environment variables

Deploy

🔐 Security Considerations

RLS ensures backend-level protection

No service role keys exposed

Supabase handles JWT-based authentication

Realtime respects RLS policies

📈 Improvements (Future Enhancements)

Edit bookmark feature

Search/filter functionality

Pagination for large datasets

Bookmark categories

Drag-and-drop sorting

🧠 Architecture Overview
User
  ↓
Next.js Frontend
  ↓
Supabase Auth (Google OAuth)
  ↓
Supabase Postgres (RLS enforced)
  ↓
Supabase Realtime (WebSocket)
  ↓
UI updates instantly
