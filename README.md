# Flask + Next.js + Supabase

A full-stack application with a **Flask** REST API backend, a **Next.js** (TypeScript) frontend, and **Supabase** as the database.

## Architecture

```
Next.js (port 3000)  →  Flask API (port 5000)  →  Supabase (PostgreSQL)
```

The frontend talks to the Flask API, which reads and writes data in Supabase. The frontend also includes a Supabase client for direct browser access when needed.

## Prerequisites

- Python 3.11+
- Node.js 18+
- A [Supabase](https://supabase.com) project

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** and run the script in [`supabase/schema.sql`](supabase/schema.sql).
3. Copy your **Project URL** and **anon public** key from **Project Settings → API**.

## 2. Backend (Flask)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Copy the example env file and fill in your Supabase credentials:

```bash
copy .env.example .env   # Windows
cp .env.example .env     # macOS/Linux
```

Edit `backend/.env`:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key
FLASK_PORT=5000
FLASK_DEBUG=true
```

Start the API:

```bash
python app.py
```

The API runs at `http://localhost:5000`.

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/items` | List all items |
| POST | `/api/items` | Create an item |
| DELETE | `/api/items/:id` | Delete an item |
| GET | `/api/tables` | List available database tables |
| GET | `/api/tables/:name` | Get all rows from a table |

## 3. Frontend (Next.js)

```bash
cd frontend
npm install
```

Copy the example env file:

```bash
copy .env.local.example .env.local   # Windows
cp .env.local.example .env.local     # macOS/Linux
```

Edit `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Frontend Routes

| Route | Description |
|-------|-------------|
| `/` | Manage items (add, list, delete) |
| `/tables` | Browse all database tables |
| `/tables/:name` | View rows from a specific table |

To expose more tables, add them to `ALLOWED_TABLES` in `backend/app.py`.

## Project Structure

```
flask-supabase-app/
├── backend/
│   ├── app.py              # Flask routes
│   ├── supabase_client.py  # Supabase connection
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── app/            # Next.js App Router pages
│       ├── components/     # React components (CSS Modules)
│       ├── lib/            # API & Supabase clients
│       └── types/
└── supabase/
    └── schema.sql          # Database schema
```

## Notes

- Styling uses **CSS Modules** — no Tailwind CSS.
- The demo RLS policies in `schema.sql` allow public read/write. Restrict them before deploying to production.
- Use the Supabase **service role** key on the backend for admin operations, or the **anon** key if your RLS policies are configured for client access.
