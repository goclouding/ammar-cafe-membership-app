# Ammar Cafe VIP Membership — React + Tailwind + Supabase

Rewritten from PHP. No more cPanel, no more 403s.

## Stack

- **React 18** (Vite)
- **TailwindCSS** for styling
- **Supabase** for Postgres DB + admin Auth + Row Level Security
- **React Router** for routing

## 1. Install

```bash
cd ammarcafe-membership-react
npm install
```

## 2. Create a Supabase project

1. Go to https://supabase.com → **New Project** (free tier is fine)
2. Set a strong database password (save it)
3. Wait for the project to provision (~2 min)

### Run the schema

1. In Supabase dashboard → **SQL Editor** → **New query**
2. Paste the entire contents of [supabase/schema.sql](supabase/schema.sql)
3. Click **Run**

This creates the `membership_applications` table, indexes, an `updated_at` trigger, and Row Level Security policies:
- **anonymous** users can only `INSERT` new applications
- **authenticated** admins can `SELECT` and `UPDATE`

### Create the admin user

1. Supabase dashboard → **Authentication** → **Users** → **Add user** → **Create new user**
2. Enter admin email + strong password
3. Check **Auto Confirm User**
4. Click **Create user**

To disable public signups (so nobody else can become an admin):
- Authentication → **Providers** → **Email** → turn OFF **Enable Sign-up**

### Grab your keys

1. Supabase dashboard → **Project Settings** → **API**
2. Copy **Project URL** and **anon / public key**

## 3. Configure the app

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## 4. Run locally

```bash
npm run dev
```

Open http://localhost:5173

- Public form: `/`
- Admin login: `/admin/login`
- Admin dashboard: `/admin`

## 5. Deploy (Vercel — easiest)

1. Push this folder to a GitHub repo
2. Go to https://vercel.com → **Add New Project** → import the repo
3. Framework preset: **Vite** (auto-detected)
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

Point your `membership.ammar.cafe` DNS to Vercel (they provide a CNAME). The WordPress install at your main domain stays untouched.

### Alternative: Netlify

Same flow — connect repo, add the two env vars, deploy. Build command: `npm run build`, publish dir: `dist`.

### Alternative: Static hosting on cPanel

```bash
npm run build
```

Upload the contents of `dist/` to `public_html/membership/` (outside WordPress). Add a `.htaccess` with SPA fallback:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Project structure

```
ammarcafe-membership-react/
├── public/
│   └── ammarcafe-logo.png
├── src/
│   ├── App.jsx                 # routes + auth session
│   ├── main.jsx
│   ├── index.css               # Tailwind + component classes
│   ├── lib/supabase.js         # Supabase client
│   ├── components/Logo.jsx
│   └── pages/
│       ├── MembershipForm.jsx  # public form (/)
│       ├── Success.jsx         # thank you page (/success)
│       ├── AdminLogin.jsx      # admin login (/admin/login)
│       └── AdminDashboard.jsx  # dashboard w/ tabs + modal (/admin)
├── supabase/
│   └── schema.sql              # run once in Supabase SQL editor
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## What changed vs. PHP version

| PHP | React + Supabase |
|-----|------------------|
| CSRF tokens | JWT (handled by Supabase) |
| Session flash / old input | React state |
| Plaintext admin password in `.env` | Supabase Auth user (bcrypt-hashed by Supabase) |
| PDO prepared statements | Supabase JS client (parameterized) |
| File-based logs | Supabase Logs dashboard |
| cPanel MySQL | Supabase Postgres (managed) |
| Apache .htaccess routing | React Router |

## Data migration (optional)

If you have existing rows in your MySQL `membership_applications` table:

1. Export from phpMyAdmin as CSV
2. Supabase → Table Editor → `membership_applications` → **Insert** → **Import data from CSV**
3. Match columns (note: `invited_by_member` becomes `true`/`false` in Postgres, not `0`/`1`)

## Troubleshooting

**"Missing VITE_SUPABASE_URL"** — you didn't create `.env` or didn't restart `npm run dev` after editing it.

**Form submit fails silently** — check browser console. Usually an RLS policy issue; re-run `schema.sql`.

**Admin login says "invalid credentials"** — make sure you created the user in Supabase Authentication (not just in the database).

**Admin dashboard shows 0 rows but data exists** — you're logged out, or RLS is misconfigured. Re-run `schema.sql`.
