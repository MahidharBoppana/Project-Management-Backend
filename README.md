# 📋 Project Management Backend

> A beginner-friendly RESTful API for collaborative project management, built with **Node.js**, **Express 5**, and **MongoDB**.  
> Features user authentication, role-based access control, projects, tasks with subtasks, project notes, file attachments, and email notifications.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE)

---

## 📖 Table of Contents

- [About](#about)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🔐 Environment Variables](#-environment-variables)
- [▶️ Running the Server](#️-running-the-server)
- [📬 API Endpoints](#-api-endpoints)
- [🧪 Try It (cURL Examples)](#-try-it-curl-examples)
- [🔑 Roles & Permissions](#-roles--permissions)
- [📦 Response & Error Format](#-response--error-format)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👤 Author](#-author)

---

## About

**Project Management Backend** is the server-side API for a team collaboration platform. It lets users register and verify their email, authenticate with JWT access & refresh tokens (stored in httpOnly cookies), reset passwords, and manage projects, members, tasks, subtasks, and notes with role-based permissions.

<details>
<summary><b>What the API can do</b></summary>

- **Auth:** register, login, logout, email verification, forgot/reset password, change password, refresh tokens, get current user, resend verification
- **Projects:** CRUD projects, add/list/update/remove members with roles
- **Tasks:** CRUD tasks, file attachments, status tracking (todo / in-progress / done), assignees
- **Subtasks:** create, update, delete, mark complete
- **Notes:** CRUD project notes (admin-only writes)
- **System:** health-check endpoint
</details>

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with email verification
- Login with JWT access + refresh tokens (httpOnly cookies)
- Logout (clears cookies)
- Refresh access token
- Forgot password & password reset via email
- Change password (authenticated users)
- Get current user profile
- Resend email verification
- Role-Based Access Control: `admin`, `project_admin`, `member`

### 📁 Project Management
- Create, read, update, delete projects
- Invite members by email
- List project members with roles
- Update or remove a member's role

### 📝 Tasks, Subtasks & Notes
- Create tasks with title, description, assignee, and status
- Track status: `todo` → `in_progress` → `done`
- Multiple file attachments per task (stored in `public/images/`)
- Subtasks with completion tracking
- Project notes (admin-only create/update/delete)

### 🛡️ Security & Utilities
- Password hashing with bcrypt
- Request validation with express-validator
- CORS with credentials support
- Centralized `ApiResponse` / `ApiError` handling
- Async route wrapper (`asyncHandler`)
- Email sending via Nodemailer + Mailgen (Mailtrap)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 18+ (ESM / `"type": "module"`) |
| Web Framework | Express 5 |
| Database | MongoDB with Mongoose 8 |
| Authentication | JWT (access + refresh tokens) |
| Password Hashing | bcrypt |
| Validation | express-validator |
| Email | Nodemailer + Mailgen |
| Cookies | cookie-parser |
| CORS | cors |
| File Uploads | multer |
| Dev Tooling | nodemon, prettier |

---

## 📁 Project Structure

```text
Project-Management-Backend/
├── public/
│   └── images/                # User-uploaded task attachments (gitignored)
├── src/
│   ├── app.js                 # Express app + middleware setup
│   ├── index.js               # Entry point (dotenv, DB connect, listen)
│   ├── controllers/
│   │   ├── auth.controller.js         # Register, login, password, email verify, etc.
│   │   ├── healthcheck.controller.js  # System health check
│   │   ├── project.controller.js      # Project CRUD + member management
│   │   ├── task.controller.js         # Tasks, subtasks, attachments
│   │   └── projectNote.controller.js  # Project notes
│   ├── db/
│   │   └── index.js                   # MongoDB (Mongoose) connection
│   ├── middlewares/
│   │   ├── auth.middleware.js         # JWT verification
│   │   └── validator.middleware.js    # express-validator error handler
│   ├── models/
│   │   ├── user.model.js
│   │   ├── projects.model.js
│   │   ├── projectMember.model.js
│   │   ├── task.model.js
│   │   ├── subTask.model.js
│   │   └── node.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── healthcheck.routes.js
│   │   ├── project.routes.js
│   │   ├── task.routes.js
│   │   └── projectNote.routes.js
│   ├── utils/
│   │   ├── api-response.js
│   │   ├── api-error.js
│   │   ├── async-handler.js
│   │   ├── constants.js               # User roles & task statuses
│   │   └── mail.js                    # Nodemailer + Mailgen sender
│   └── validators/
│       └── index.js                   # Request validation schemas
├── .env                           # Local secrets (gitignored)
├── .example.env                   # Copy me → .env and fill in values
├── .gitignore
├── .prettierrc
├── .prettierignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Quick Start

Get the server running in under a minute:

<details>
<summary><b>1️⃣ Clone the repository</b></summary>

```bash
git clone https://github.com/MahidharBoppana/Project-Management-Backend.git
cd Project-Management-Backend
```
</details>

<details>
<summary><b>2️⃣ Install dependencies</b></summary>

```bash
npm install
```
</details>

<details>
<summary><b>3️⃣ Configure environment variables</b></summary>

Copy the example env file and edit it with your values:

```bash
cp .example.env .env
```

Then open `.env` and fill in at minimum:

- `MONGO_URI` — your MongoDB connection string (required)
- `ACCESS_TOKEN_SECRET` & `REFRESH_TOKEN_SECRET` — random strings (required)
- `MAILTRAP_*` — Mailtrap credentials (required for email features)

<details>
<summary><b>💡 Generate strong JWT secrets</b></summary>

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Run twice — once for `ACCESS_TOKEN_SECRET`, once for `REFRESH_TOKEN_SECRET`.
</details>
</details>

<details>
<summary><b>4️⃣ Start the server</b></summary>

Development (auto-restarts on file changes via nodemon):

```bash
npm run dev
```

Production:

```bash
npm start
```

The server starts on `http://localhost:3000` (or your `PORT`).  
Base API path: `http://localhost:3000/api/v1`
</details>

---

## 🔐 Environment Variables

Copy `.example.env` → `.env` and set these values:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `3000` |
| `SERVER_URL` | Public URL used for attachment links | No | `http://localhost:3000` |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | No | `http://localhost:5173` |
| `MONGO_URI` | MongoDB connection string | **Yes** | `mongodb+srv://...` |
| `ACCESS_TOKEN_SECRET` | Secret to sign access tokens | **Yes** | random string |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime | No | `5m` |
| `REFRESH_TOKEN_SECRET` | Secret to sign refresh tokens | **Yes** | random string |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime | No | `1d` |
| `FORGOT_PASSWORD_REDIRECT_URL` | Frontend URL for password reset links | No | `http://localhost:3000/reset-password` |
| `MAILTRAP_SMTP_HOST` | Outgoing mail host | No (email features) | `sandbox.smtp.mailtrap.io` |
| `MAILTRAP_SMTP_PORT` | SMTP port | No | `2525` |
| `MAILTRAP_SMTP_USER` | SMTP username | No | `...` |
| `MAILTRAP_SMTP_PASS` | SMTP password | No | `...` |
| `FROM_EMAIL` | Sender email address | No | `mail.taskmanager@example.com` |

> 🔒 `.env` is gitignored. Never commit real credentials. Use `.example.env` as the template for teammates.

---

## ▶️ Running the Server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Console output:
```
Connected to MongoDB
Example app listing on port http://localhost:3000
```

Visit `http://localhost:3000` to see the welcome message, or  
`http://localhost:3000/api/v1/healthecheck` for the health check.

---

## 📬 API Endpoints

Base URL: `http://localhost:3000/api/v1`

All successful responses follow the `ApiResponse` format:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": { ... }
}
```

### Health Check

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/healthecheck` | Server health status | ❌ |

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register user + send verification email | ❌ |
| POST | `/login` | Login, set access & refresh cookies | ❌ |
| GET | `/verify-email/:verificationToken` | Verify email address | ❌ |
| POST | `/refresh-token` | Issue a new access token | ❌ |
| POST | `/forgot-password` | Send password-reset email | ❌ |
| POST | `/reset-password/:resetToken` | Reset password with token | ❌ |
| POST | `/logout` | Clear auth cookies | ✅ |
| POST | `/current-user` | Get authenticated user profile | ✅ |
| POST | `/change-password` | Change password (old + new) | ✅ |
| POST | `/resend-email-verification` | Resend verification email | ✅ |

### Projects (`/api/v1/projects`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | List projects for current user | ✅ |
| POST | `/` | Create a project | ✅ |
| GET | `/:projectId` | Get a single project | ✅ |
| PUT/PATCH | `/:projectId` | Update a project (Admin) | ✅ |
| DELETE | `/:projectId` | Delete a project (Admin) | ✅ |
| POST | `/:projectId/members` | Add a member to a project (Admin) | ✅ |
| GET | `/:projectId/members` | List project members | ✅ |
| PUT/PATCH | `/:projectId/members/:userId` | Update a member's role (Admin) | ✅ |
| DELETE | `/:projectId/members/:userId` | Remove a member (Admin) | ✅ |

### Tasks (`/api/v1/tasks`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/:projectId` | List tasks in a project | ✅ |
| POST | `/:projectId` | Create a task (Admin / Project Admin) | ✅ |
| GET | `/:projectId/t/:taskId` | Get task details | ✅ |
| PUT/PATCH | `/:projectId/t/:taskId` | Update a task (Admin / Project Admin) | ✅ |
| DELETE | `/:projectId/t/:taskId` | Delete a task (Admin / Project Admin) | ✅ |
| POST | `/:projectId/t/:taskId/subtasks` | Create a subtask (Admin / Project Admin) | ✅ |
| PUT/PATCH | `/:projectId/st/:subTaskId` | Update a subtask | ✅ |
| DELETE | `/:projectId/st/:subTaskId` | Delete a subtask (Admin / Project Admin) | ✅ |

### Notes (`/api/v1/notes`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/:projectId` | List project notes | ✅ |
| POST | `/:projectId` | Create a note (Admin) | ✅ |
| GET | `/:projectId/n/:noteId` | Get note details | ✅ |
| PUT/PATCH | `/:projectId/n/:noteId` | Update a note (Admin) | ✅ |
| DELETE | `/:projectId/n/:noteId` | Delete a note (Admin) | ✅ |

---

## 🧪 Try It (cURL Examples)

<details>
<summary><b>Register a new user</b></summary>

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "member"
  }'
```
</details>

<details>
<summary><b>Login (returns access + refresh cookies)</b></summary>

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"john@example.com","password":"securePassword123"}'
```

Use `-c cookies.txt` to save cookies and `-b cookies.txt` to send them on secured requests.
</details>

<details>
<summary><b>Get current user (secured route)</b></summary>

```bash
curl -X GET http://localhost:3000/api/v1/auth/current-user \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -b cookies.txt
```
</details>

<details>
<summary><b>Create a project</b></summary>

```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -b cookies.txt \
  -d '{"name":"Website Redesign","description":"Q3 company website rebuild"}'
```
</details>

---

## 🔑 Roles & Permissions

Three-tier role system (`src/utils/constants.js`):

| Feature | Admin | Project Admin | Member |
|---------|-------|---------------|--------|
| Create / update / delete project | ✅ | ❌ | ❌ |
| Manage project members | ✅ | ❌ | ❌ |
| Create / update / delete tasks | ✅ | ✅ | ❌ |
| View tasks | ✅ | ✅ | ✅ |
| Create / delete subtasks | ✅ | ✅ | ❌ |
| Update subtask status | ✅ | ✅ | ✅ |
| Create / update / delete notes | ✅ | ❌ | ❌ |
| View notes | ✅ | ✅ | ✅ |

Task statuses: `todo` → `in_progress` → `done`

---

## 📦 Response & Error Format

**Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "user registered successfully",
  "data": { "user": { ... } }
}
```

**Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error",
  "errors": [ ... ]
}
```
---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

## 👤 Author

Built by [Mahidhar Boppana](https://github.com/MahidharBoppana)

---

<details>
<summary><b>📌 Notes for maintainers</b></summary>

- Routes are mounted in `src/app.js` under `/api/v1`. The health-check route is mounted at `/api/v1/healthecheck` (note the spelling as it appears in `app.js`).
- Task attachments are stored in `public/images/` and referenced via `SERVER_URL` — this folder is gitignored except for `.gitkeep`.
- Email features require Mailtrap SMTP credentials; without them emails fail silently (see `src/utils/mail.js`).
</details>
