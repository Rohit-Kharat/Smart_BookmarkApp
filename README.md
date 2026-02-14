# 🚀 Smart Bookmark App

A full-stack real-time bookmark manager built using **Next.js (App Router)** and **Supabase (Auth, Database, Realtime)**.

This application satisfies all challenge requirements including Google OAuth login, private per-user bookmarks, real-time updates across tabs, and deployment on Vercel.

---

## 🌐 Live Demo

**Vercel URL:**  
https://your-vercel-url.vercel.app

(Test using your own Google account.)

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS  
- **Backend:** Supabase  
  - Google OAuth Authentication  
  - PostgreSQL Database  
  - Row Level Security (RLS)  
  - Realtime Subscriptions (WebSockets)  
- **Deployment:** Vercel  

---

## ✅ Features Implemented

### 1️⃣ Google Authentication
- Users can sign up and log in using **Google OAuth only**
- No email/password authentication
- Session handled securely via Supabase

---

### 2️⃣ Add Bookmark
- Logged-in users can add:
  - Title
  - URL
- URLs are normalized (automatically adds `https://` if missing)

---

### 3️⃣ Private Per User (RLS Secured)

Bookmarks are protected using **Row Level Security (RLS)**.

```sql
using (auth.uid() = user_id)
```

Users:
- Can only view their own bookmarks
- Cannot access other users’ data
- Cannot manipulate `user_id` from the frontend

Security is enforced at the **database level**, not just frontend filtering.

---

### 4️⃣ Real-Time Updates

Bookmarks update instantly across multiple tabs without page refresh.

Implemented using Supabase Realtime:

```ts
.on("postgres_changes", {
  event: "*",
  schema: "public",
  table: "bookmarks",
  filter: `user_id=eq.${userId}`
})
```

Realtime authentication handled using:

```ts
supabase.realtime.setAuth(session.access_token)
```

If:
- A bookmark is added in Tab A → it appears in Tab B  
- A bookmark is deleted in Tab A → it disappears in Tab B  

---

### 5️⃣ Delete Bookmark
- Users can delete their own bookmarks
- RLS ensures users cannot delete others' bookmarks
- Real-time sync keeps all tabs updated

---

## 🏗 Database Schema

```sql
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  created_at timestamptz default now()
);
```

---

## 🔐 RLS Policies

```sql
alter table public.bookmarks enable row level security;

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
```

---

## ⚡ Challenges Faced & Solutions

### 1️⃣ OAuth Redirect URI Mismatch
**Issue:** `redirect_uri_mismatch` error  
**Solution:** Added Supabase callback URL  
```
https://PROJECT_REF.supabase.co/auth/v1/callback
```
to Google Cloud Console.

---

### 2️⃣ Session Not Persisting Across Tabs
**Issue:** User redirected back to login page after authentication  
**Solution:** Proper cookie handling inside `/auth/callback` route and middleware session refresh.

---

### 3️⃣ Realtime Not Working with RLS
**Issue:** Subscription connected but no events received  
**Solution:** Explicitly authenticated Realtime:

```ts
supabase.realtime.setAuth(session.access_token)
```

---

### 4️⃣ RLS Blocking Delete
**Issue:** Delete silently failing  
**Solution:** Verified policies and ensured `auth.uid()` matched `user_id`.

---

## 📦 Local Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-bookmark.git
cd smart-bookmark
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🚀 Deployment

Deployed using **Vercel**:

1. Push project to GitHub  
2. Import project into Vercel  
3. Add environment variables  
4. Deploy  

---

## 🔐 Security Considerations

- Backend-level security using RLS
- No service role keys exposed
- Supabase handles JWT authentication
- Realtime respects RLS policies

---

## 🧠 Architecture Overview

```
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
```

---

## 🏁 Conclusion

This project demonstrates:

- Secure full-stack implementation  
- Proper use of Row Level Security  
- Real-time data synchronization  
- OAuth integration  
- Clean deployment workflow  

All challenge requirements have been successfully implemented.
