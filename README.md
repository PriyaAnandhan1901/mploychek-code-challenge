# MPloyChek Code Challenge: Role-Based SPA

Angular SPA with a Node.js + TypeScript (Express) API.

## Features
- Login with User ID, Password and Role (General User / Admin), JWT auth
- Dashboard: user details and a records table filtered by access level
- Admin: user management (add, edit, delete) stored in a JSON file
- Async demo: every API accepts `?delay=<ms>`, and the UI shows loading spinners
- Lazy-loaded modules, route guards (auth and admin), HTTP interceptor, reactive forms

## Tech
Angular 22 (NgModules), RxJS, Signals, SCSS, Express, TypeScript, JWT, bcrypt

## Run locally

Backend (port 3000):
```
cd backend
npm install
npm run dev
```

Frontend (port 4200):
```
cd frontend
npm install
ng serve
```

Open http://localhost:4200

## Demo accounts
| Role | User ID | Password |
|---|---|---|
| Admin | admin | Admin@123 |
| General User | priya | User@123 |

## Architecture
```
frontend/src/app
  core/    AuthService, UserService, interceptor, guards, models
  auth/    login (lazy-loaded)
  dashboard/  profile + records (lazy-loaded, auth guard)
  admin/   user management (lazy-loaded, admin guard)
backend/src
  server.ts  routes, middleware.ts  JWT/role/delay, store.ts  JSON storage
```

## API
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/login | public |
| GET | /api/me | logged in |
| GET | /api/records | logged in (filtered by role) |
| GET/POST | /api/users | admin |
| PUT/DELETE | /api/users/:id | admin |

Add `?delay=2000` to any endpoint to simulate a slow response.