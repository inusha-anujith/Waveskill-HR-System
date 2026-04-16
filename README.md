# Waveskill HR System — Frontend

Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 frontend for the Waveskill HR Management System. Talks to the Express/MongoDB backend in the sister repo `Waveskill-Backend`.

## Tech stack

- **Framework:** Next.js 16 (App Router) with Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** lucide-react
- **Auth:** JWT stored in `localStorage`
- **State:** React hooks + a small Toast context

## Prerequisites

- Node.js 18.18+ (Node 20 recommended)
- npm 10+
- The backend running at `http://localhost:5001` — see `Waveskill-Backend/README.md`

## Getting started

```bash
# from the project root
npm install
npm run dev
```

Open <http://localhost:3000/login> and sign in with the seeded credentials (see backend README for `npm run seed:all`).

| Role | Email | Password |
|---|---|---|
| Admin | `admin@waveskill.com` | `Admin@123` |
| Manager | `manager@waveskill.com` | `Manager@123` |
| Employee | `john@waveskill.com` (and others) | `Demo@1234` |

After login the user is redirected based on role:

- **Admin** → `/Admin/Analytics`
- **Manager** → `/Manager/Analytics`
- **Employee** → `/Employee/Attendance`

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | Lint via `eslint-config-next` |

## Backend connection

API base URL is centralised in `src/lib/api.ts` (`API_BASE = "http://localhost:5001"`). Change it there if the backend runs elsewhere. The same module exports:

- `getToken()`, `getStoredRole()`, `getStoredName()` — read auth state from `localStorage`
- `authHeaders()` — produces the `Authorization: Bearer …` headers used by every fetch
- `clearAuth()` — used by every Logout button
- `formatDate(value)`, `formatTime(value)` — display helpers

## Project structure

```
src/
├── app/
│   ├── login/page.tsx                  Role-based redirect after login
│   ├── Admin/
│   │   ├── Analytics/page.tsx          Admin dashboard (4 stats + 4 charts + availability)
│   │   ├── EmployeeManage/page.tsx     Employee CRUD (Admin only)
│   │   ├── Leave/page.tsx              Approve / reject leave requests
│   │   ├── Attendance/page.tsx         Company-wide attendance reports
│   │   ├── Project/page.tsx            (out of scope — teammate)
│   │   └── Announcement/page.tsx       (out of scope — teammate)
│   ├── Manager/
│   │   ├── Analytics/page.tsx          Same dashboard as Admin (read-only on user mgmt)
│   │   ├── Leave/page.tsx              Approve / reject leave requests
│   │   ├── Project/page.tsx            (out of scope)
│   │   └── Announcement/page.tsx       (out of scope)
│   └── Employee/                       Employee-side pages (teammate's scope)
├── components/
│   ├── AdminNavi/, ManagerNavi/, EmployeeNavi/   Top bar + tab strips
│   ├── Modals/
│   │   ├── EmployeeModal.tsx           Add / Edit employee (POST + PATCH)
│   │   ├── AdminEmployeeDetailsModal.tsx
│   │   ├── AdminLeaveActionModal.tsx
│   │   ├── LeaveActionModal.tsx        Used by Manager
│   │   └── ConfirmModal.tsx            Reusable confirmation modal
│   └── Toast/
│       └── ToastProvider.tsx           Context + UI for success/error toasts
└── lib/
    └── api.ts                          API base + helpers
```

## Implemented features

### Admin/Manager Dashboard — `Analytics` tab
- Active Employees, Today's Attendance Rate, Pending Leaves cards (live)
- Attendance Overview donut and Leave Requests bar chart (live)
- Employee Availability list — every non-Admin user with their current check-in status
- *Active Projects, Department Distribution, Project Status* cards remain with placeholder data — owned by another teammate

### Leave Management — `Leaves` tab (Admin + Manager)
- Lists all leave requests with employee name, type, duration, days, applied date, status
- Pencil opens a review modal with full details
- **Approve** flips status to Approved and shows a success toast
- **Reject** opens a confirmation modal first (reject is irreversible), then flips status and shows a toast
- Bottom cards (Pending / Approved / Rejected) recompute live

### Attendance Reports — `Attendance` tab (Admin only)
- Filter by date, status, and search by employee name
- Pagination via `?page=&limit=` parameters
- Bottom stats (Total / Present / Late / Absences) recompute from the visible result set
- **Export Report** downloads a CSV of the current view

### User Management — `Employees` tab (Admin only)
- Add Employee/Manager — modal posts to `POST /api/admin/users` (only `Employee` and `Manager` roles allowed; Admin creation is blocked at the backend)
- Edit — pencil opens the same modal pre-filled, sends `PATCH /api/admin/users/:id`
- Delete — opens a styled confirmation modal, then `DELETE /api/admin/users/:id` (last Admin and self-delete blocked by backend)
- Row click opens a read-only details modal with **Reset Password** (prompts for a new password and PATCHes the user)

### Cross-cutting
- **Login redirect** — based on role returned in the login response
- **Role guards** — every protected fetch redirects to `/login` only on `401` (no token); `403` is handled inline so a Manager hitting an Admin-only write doesn't get bounced out
- **Manager nav** — Employees and Attendance tabs are hidden from the Manager nav (Admin-only features)
- **Reusable Toast** — `useToast()` exposes `success(msg)` / `error(msg)`. Toasts stack top-right and auto-dismiss after 4s
- **Reusable ConfirmModal** — used for delete and reject; supports `danger` / `primary` variants and a busy state

## Out of scope (left untouched)

These pages exist in the repo but were built / are owned by other teammates:

- `Admin/Project`, `Manager/Project`
- `Admin/Announcement`, `Manager/Announcement`
- `Employee/*` (Attendance, Leave, Profile, Project, Announcement)
- `Manager/Attendance`, `Manager/EmployeeManage` — kept on disk, hidden from Manager nav

## Smoke testing the integration

After the backend is running and seeded:

```bash
# 1. Hit the public pages — should be 200
curl -o /dev/null -w "%{http_code}\n" http://localhost:3000/login
curl -o /dev/null -w "%{http_code}\n" http://localhost:3000/Admin/Analytics
```

Open the browser, log in as Admin, walk through Analytics → Leaves → Attendance → Employees. Then log in as Manager — should land on Manager Analytics with no redirect loop and only see four tabs.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| "Server is not responding. Is the backend running?" on login | Backend not started — see `Waveskill-Backend/README.md` |
| Pages load but show zeroes | DB has no seed data — run `npm run seed:all` in the backend repo |
| Manager redirected to `/login` after login | Old code — pull latest, the analytics pages now redirect only on 401 |
| `EADDRINUSE` on `npm run dev` | Port 3000 in use — `netstat -ano | grep :3000` then `taskkill /F /PID <pid>` |
