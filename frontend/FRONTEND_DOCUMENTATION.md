# Frontend Documentation

This document describes the Next.js frontend for the FastAPI Blog project. It is the single source of truth for understanding how the frontend is structured, configured, and integrated with the backend API.

---

## Project Overview

The frontend is a **Next.js 16 App Router** application written in **TypeScript** and styled with **Tailwind CSS v4**. It features a modern, premium, dark-themed, developer-focused UI for:

- Browsing blog posts (home, listing, detail)
- User authentication (register, login, logout, password reset)
- Author dashboards (create, edit, delete posts)
- Account management (profile, password, profile picture)

The frontend communicates with the existing **FastAPI backend** over HTTP. The backend is the source of truth for all data, validation, and authorization.

### Architecture

```text
Browser
   │
   ▼
Next.js Frontend (frontend/)
   │  - Server Components fetch public data
   │  - Client Components handle auth + mutations
   │
   │  HTTP/HTTPS (REST API)
   ▼
FastAPI Backend (backend/)
   │  - /api/users
   │  - /api/posts
   │
   ▼
Database (SQLite) + Cloudinary (profile images)
```

### Backend API Summary

The frontend only uses endpoints that exist in the FastAPI backend:

| Area | Endpoints |
|------|-----------|
| Health | `GET /health` |
| Posts | `GET /api/posts`, `GET /api/posts/{id}`, `POST /api/posts`, `PUT/PATCH /api/posts/{id}`, `DELETE /api/posts/{id}` |
| Users | `POST /api/users`, `POST /api/users/token`, `GET /api/users/me`, `GET /api/users/{id}`, `PATCH /api/users/{id}`, `DELETE /api/users/{id}` |
| User posts | `GET /api/users/{id}/posts` |
| Password | `POST /api/users/forgot-password`, `POST /api/users/reset-password`, `PATCH /api/users/me/password` |
| Profile picture | `PATCH /api/users/{id}/picture`, `DELETE /api/users/{id}/picture` |

**Not supported by the backend** (therefore not implemented in the frontend):

- Categories, tags, comments
- Search or filtering beyond pagination (`skip` / `limit`)
- Post slugs or featured images
- Publish/unpublish draft states

---

## Project Structure

```text
frontend/
├── .env.example                 # Documented environment variables
├── FRONTEND_DOCUMENTATION.md    # This file
├── next.config.ts               # Next.js config (image domains, env)
├── package.json
├── src/
│   ├── app/                     # App Router pages and layouts
│   │   ├── layout.tsx           # Root layout (Navbar, Footer, AuthProvider)
│   │   ├── page.tsx             # Home page
│   │   ├── blog/                # Blog listing + post detail
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── forgot-password/     # Forgot password
│   │   ├── reset-password/      # Reset password (token query param)
│   │   ├── account/             # Account settings
│   │   ├── dashboard/           # Authenticated post management
│   │   └── users/[id]/posts/    # Public author post listing
│   ├── components/
│   │   ├── auth/                # AuthGuard, GuestGuard
│   │   ├── blog/                # BlogCard, BlogList, PostContent, Pagination
│   │   ├── forms/               # Login, Register, Post, Profile forms
│   │   ├── layout/              # Navbar, Footer, PageContainer
│   │   └── ui/                  # Reusable UI primitives
│   ├── config/
│   │   ├── env.ts               # Required env validation
│   │   ├── site.ts              # Site name, description, author info
│   │   ├── navigation.ts        # Nav links, social links
│   │   ├── pagination.ts        # Default page sizes
│   │   ├── auth.ts              # Token storage key
│   │   └── seo.ts               # Metadata helpers
│   ├── lib/
│   │   ├── api/                 # Centralized API functions
│   │   │   ├── client.ts        # Base HTTP client + error parsing
│   │   │   ├── auth.ts          # Login, register, password APIs
│   │   │   ├── posts.ts         # Post CRUD + listing
│   │   │   └── users.ts         # User profile APIs
│   │   ├── auth/
│   │   │   └── storage.ts       # localStorage token helpers
│   │   └── utils/               # dates, images, errors, cn
│   ├── providers/
│   │   └── AuthProvider.tsx     # Global auth state
│   └── types/
│       ├── auth.ts              # Auth request/response types
│       ├── blog.ts              # Post types
│       └── user.ts                # User types
```

### Directory Responsibilities

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Routes, page-level layouts, metadata, server-side data fetching |
| `src/components/` | Reusable UI organized by domain |
| `src/config/` | Single source of truth for site settings and env validation |
| `src/lib/api/` | All HTTP calls to the FastAPI backend |
| `src/types/` | TypeScript types matching backend Pydantic schemas |
| `src/providers/` | React context providers (authentication) |

---

## API Integration

### API Client

All HTTP requests go through `src/lib/api/client.ts`:

- Base URL from `env.apiUrl` (`NEXT_PUBLIC_API_URL`)
- JSON request/response handling
- FormData support (profile picture upload)
- OAuth2 form-urlencoded login
- Bearer token injection via `token` option
- Consistent error parsing via `ApiError`

### Example: Fetching Posts (Server Component)

```typescript
import { getPosts } from "@/lib/api/posts";

const data = await getPosts({ skip: 0, limit: 10 });
// data.posts, data.total, data.has_more
```

### Example: Creating a Post (Client Component)

```typescript
import { createPost } from "@/lib/api/posts";
import { useAuth } from "@/providers/AuthProvider";

const { token } = useAuth();
await createPost({ title: "Hello", content: "World" }, token!);
```

### Authentication

The backend uses **JWT Bearer tokens** via OAuth2 password flow:

1. User logs in with **email** + password at `POST /api/users/token`
2. Backend returns `{ access_token, token_type: "bearer" }`
3. Frontend stores the token in `localStorage` (key: `inkwell_access_token`)
4. Authenticated requests include `Authorization: Bearer <token>`
5. On app load, if a token exists, `GET /api/users/me` validates it

**Important:** The login form sends the email as the `username` field (OAuth2 convention used by FastAPI).

### Error Handling

- `ApiError` class in `src/lib/utils/errors.ts` captures status + detail
- `getErrorMessage()` provides user-friendly messages for UI
- Server pages use helper loaders that return `{ data, error }` instead of try/catch around JSX
- Client forms display errors via `<Alert variant="error">`

### Adding a New API Endpoint

1. **Add/update TypeScript type** in `src/types/`
2. **Add API function** in `src/lib/api/` using `apiRequest()` or `serverApiRequest()`
3. **Use the function** from a page or component
4. **Add loading/error states** in the UI
5. **Test** against the running FastAPI backend

---

## Environment Variables

| Variable | Purpose | Example | Required |
|----------|---------|---------|----------|
| `NEXT_PUBLIC_API_URL` | FastAPI backend base URL | `http://localhost:8000` | Yes |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for SEO/Open Graph | `http://localhost:3000` | No |

Copy the example file and configure locally:

```bash
cd frontend
cp .env.example .env.local
```

If `NEXT_PUBLIC_API_URL` is missing, the app throws a clear error at startup via `src/config/env.ts`.

**Never commit** `.env.local` or secrets.

---

## What Do I Edit If I Want To Change X?

| I want to change... | Edit this file |
|---------------------|----------------|
| API URL | `.env.local` → `NEXT_PUBLIC_API_URL` |
| Site name | `src/config/site.ts` |
| Site description | `src/config/site.ts` |
| Author bio on homepage | `src/config/site.ts` → `author` |
| Navigation links | `src/config/navigation.ts` |
| Social links (footer) | `src/config/navigation.ts` → `socialLinks` |
| Pagination defaults | `src/config/pagination.ts` |
| Token storage key | `src/config/auth.ts` |
| SEO defaults | `src/config/seo.ts` |
| Blog API calls | `src/lib/api/posts.ts` |
| User API calls | `src/lib/api/users.ts` |
| Auth API calls | `src/lib/api/auth.ts` |
| Post/user TypeScript types | `src/types/blog.ts`, `src/types/user.ts` |
| Navbar design | `src/components/layout/Navbar.tsx` |
| Footer | `src/components/layout/Footer.tsx` |
| Homepage layout/content | `src/app/page.tsx` |
| Blog card design | `src/components/blog/BlogCard.tsx` |
| Blog post page | `src/app/blog/[id]/page.tsx` + `PostContent.tsx` |
| Login/register forms | `src/components/forms/` |
| Dashboard | `src/app/dashboard/` |
| Global styles / brand colors | `src/app/globals.css` |
| Remote image domains | `next.config.ts` → `images.remotePatterns` |

---

## How to Run Locally

### Prerequisites

- Node.js 18+
- FastAPI backend running (default: `http://localhost:8000`)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local if your backend URL differs
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Backend Setup (separate terminal)

```bash
cd backend
uv sync
# Ensure .env is configured (SECRET_KEY, DATABASE_URL, etc.)
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### CORS

The backend `allowed_origins` in `backend/src/config.py` defaults to `["http://localhost:3000"]`. If you change the frontend port, update the backend `.env` / config accordingly.

---

## How to Build for Production

```bash
cd frontend
npm run build
npm run start
```

Required production environment variables:

- `NEXT_PUBLIC_API_URL` — your production FastAPI URL (HTTPS)
- `NEXT_PUBLIC_SITE_URL` — your production frontend URL (for SEO metadata)

---

## How to Change the Backend URL

**Do not change source code.** Update environment variables only:

| Environment | File | Variable |
|-------------|------|----------|
| Local development | `frontend/.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:8000` |
| Production (Vercel, etc.) | Hosting provider env settings | `NEXT_PUBLIC_API_URL=https://api.yourdomain.com` |

Restart the dev server or redeploy after changing env vars.

---

## How Authentication Works

### Login Flow

1. User submits email + password on `/login`
2. `LoginForm` calls `login()` from `AuthProvider`
3. `authApi.login()` POSTs form data to `/api/users/token`
4. Token saved to `localStorage`
5. `GET /api/users/me` fetches user profile
6. User redirected to `/dashboard`

### Registration Flow

1. User submits username, email, password on `/register`
2. `POST /api/users` creates the account
3. User redirected to `/login?registered=1`

### Logout

- Clears `localStorage` token
- Resets auth state in `AuthProvider`
- Navbar "Log out" button triggers this

### Protected Routes

- `AuthGuard` wraps `/account`, `/dashboard/*`
- Redirects unauthenticated users to `/login`
- `GuestGuard` wraps `/login`, `/register` — redirects authenticated users to `/dashboard`

### Token Expiry

When the JWT expires, API calls return `401`. The auth provider clears invalid tokens on bootstrap. Users must log in again.

### Password Reset

1. `/forgot-password` → `POST /api/users/forgot-password`
2. Email contains link to `/reset-password?token=...`
3. `/reset-password` → `POST /api/users/reset-password`

---

## How to Modify the UI

| UI Area | Location |
|---------|----------|
| Navbar | `src/components/layout/Navbar.tsx` |
| Footer | `src/components/layout/Footer.tsx` |
| Homepage hero + recent posts | `src/app/page.tsx` |
| Blog listing | `src/app/blog/page.tsx` |
| Blog post detail | `src/components/blog/PostContent.tsx` |
| Blog cards | `src/components/blog/BlogCard.tsx` |
| Forms (shared inputs) | `src/components/ui/Input.tsx`, `Textarea.tsx`, `Button.tsx` |
| Dashboard layout tabs | `src/app/dashboard/layout.tsx` |
| Global typography/colors | `src/app/globals.css` |
| Responsive breakpoints | Tailwind utility classes in components |

---

## Deployment

### Frontend

Deploy to any Node.js host (Vercel, Netlify, Docker, etc.):

1. Set `NEXT_PUBLIC_API_URL` to your production API URL
2. Set `NEXT_PUBLIC_SITE_URL` to your frontend URL
3. Run `npm run build` && `npm run start`

### Backend URL & CORS

- Use **HTTPS** in production for both frontend and API
- Add your production frontend origin to the backend `ALLOWED_ORIGINS` config
- Ensure Cloudinary and database env vars are set on the backend

### Security Notes

- The frontend is **not** a security boundary
- All authorization is enforced by FastAPI (`CurrentUser` dependency)
- Never expose backend secrets in `NEXT_PUBLIC_*` variables
- JWT tokens in `localStorage` are accessible to JavaScript — use HTTPS in production

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build + type check |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Pages Reference

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Homepage with hero + recent posts | Public |
| `/blog` | Paginated blog listing | Public |
| `/blog/[id]` | Post detail | Public |
| `/users/[id]/posts` | Author's posts | Public |
| `/login` | Login | Guest only |
| `/register` | Registration | Guest only |
| `/forgot-password` | Request password reset | Public |
| `/reset-password` | Reset password with token | Public |
| `/account` | Profile, password, picture | Required |
| `/dashboard` | Dashboard overview | Required |
| `/dashboard/posts` | Manage own posts | Required |
| `/dashboard/create` | Create new post | Required |
| `/dashboard/edit/[id]` | Edit post | Required (owner) |
