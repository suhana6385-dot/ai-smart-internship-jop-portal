# Campus Placement Backend

Node.js + Express + TypeScript + MongoDB backend for a Student / Company Job & Internship Placement Platform.

## Tech Stack
- Node.js, Express.js
- MongoDB + Mongoose
- JWT (access + refresh tokens)
- Multer (resume / profile image / company logo uploads)
- Nodemailer (email notifications)
- Socket.IO (real-time notifications)
- Zod (request validation)
- Winston (logging)

## 1. Install dependencies

```bash
cd backend
npm install
```

## 2. Configure environment

A `.env` file is already included with sane defaults. Update at least:

- `MONGO_URI` — your MongoDB connection string (local or Atlas)
- `JWT_SECRET` / `JWT_REFRESH_SECRET` — change these to long random strings
- `SMTP_USER` / `SMTP_PASS` — needed only if you want email sending to actually work
  (app runs fine without valid SMTP creds, it just logs a warning)

## 3. Run MongoDB

Make sure MongoDB is running locally, e.g.:

```bash
mongod
```

Or use a free MongoDB Atlas cluster and paste the connection string into `MONGO_URI`.

## 4. Run the server (development)

```bash
npm run dev
```

Server starts on `http://localhost:5000` (or whatever `PORT` you set).
Health check: `GET http://localhost:5000/health`

## 5. Build & run in production

```bash
npm run build
npm start
```

## Folder Structure

```
backend/
├── server.ts            # entry point (http server, socket.io, db connect)
├── app.ts                # express app (middlewares, routes, error handling)
├── config/                # db, jwt, multer, mail, cloudinary config
├── models/                # mongoose schemas (User, Student, Company, Job, ...)
├── controllers/           # route handlers / business logic
├── routes/                # express routers, mounted under /api/v1
├── middlewares/           # auth, role guard, validation, error handling
├── services/               # email, notification, analytics helpers
├── validators/             # zod schemas per module
├── utils/                  # ApiError, ApiResponse, catchAsync, logger
├── sockets/                 # socket.io init + auth
├── uploads/                 # resumes/ profile/ company/ (multer disk storage)
└── logs/                    # winston log files
```

## API Overview (all prefixed with `/api/v1`)

| Module | Base route | Notes |
|---|---|---|
| Auth | `/auth` | register, login, refresh-token, logout, me, change-password |
| Students | `/students` | profile, skills, resumes, certifications |
| Companies | `/companies` | profile, logo, approval (admin) |
| Jobs | `/jobs` | CRUD (company), public listing/search |
| Internships | `/internships` | CRUD (company), public listing/search |
| Applications | `/applications` | apply, withdraw, company review, status update |
| Interviews | `/interviews` | schedule, update, list (student/company) |
| Notifications | `/notifications` | list, mark read, delete — pushed live via Socket.IO |
| Admin | `/admin` | user management, company approval, dashboard |
| Analytics | `/analytics` | placement stats, department stats, trends (admin only) |

## Auth flow

1. `POST /api/v1/auth/register` — creates `User` + matching `Student`/`Company` profile skeleton.
2. `POST /api/v1/auth/login` — returns `accessToken` + `refreshToken` (also set as httpOnly cookies).
3. Send `Authorization: Bearer <accessToken>` on protected routes.
4. `POST /api/v1/auth/refresh-token` when the access token expires.

## Socket.IO

Connect with the access token:

```js
import { io } from "socket.io-client";
const socket = io("http://localhost:5000", { auth: { token: accessToken } });
socket.on("notification:new", (notification) => console.log(notification));
```

Each authenticated user auto-joins room `user:<userId>` and receives real-time
notifications (new job posted, application status change, interview scheduled, etc).

## Notes
- File uploads are served statically from `/uploads/...`.
- Every list endpoint that returns many records supports `page` & `limit` query params.
- Zod validators reject bad payloads with a clear `errors[]` array before hitting the DB.
- Swap `config/multer.ts` disk storage for `config/cloud.ts` (Cloudinary) if you'd rather store files in the cloud instead of the local `uploads/` folder — the config is already scaffolded.
