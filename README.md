# Project-Management-Backend

> A beginner-friendly Project Management API built with Node.js, Express, and MongoDB.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## Table of Contents

- [About](#about)
- 🚀 [Features](#features)
- 🛠️ [Tech Stack](#tech-stack)
- 📁 [Project Structure](#project-structure)
- 🔧 [Installation & Setup](#installation--setup)
- 🔐 [Environment Variables](#environment-variables)
- ▶️ [Running the Server](#running-the-server)
- 📬 [API Endpoints](#api-endpoints)
- 🧪 [Testing](#testing)
- 🤝 [Contributing](#contributing)
- 📄 [License](#license)

## About

**Project-Management-Backend** is the backend service for a project management application. It provides user authentication (registration, login, email verification, password reset), JWT-based session management with access & refresh tokens, and full project management with member roles.

## 🚀 Features

### Authentication
- User registration with email verification
- Login with JWT access & refresh tokens (httpOnly cookies)
- Logout (clears cookies)
- Refresh access token
- Forgot password & password reset via email
- Change password (authenticated)
- Get current user profile
- Resend email verification

### Project Management
- Create, read, update, delete projects
- Add members to a project by email
- List project members with their roles
- Update a member's role
- Remove a member from a project

### Security & Utilities
- Password hashing with bcrypt
- Request validation with express-validator
- CORS with credentials support
- Centralized error & response handling (ApiError / ApiResponse)
- Async route handler wrapper
- Email sending via Nodemailer + Mailgen

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js (ESM / `"type": "module"`) |
| Web Framework | Express 5 |
| Database | MongoDB with Mongoose 8 |
| Auth | JSON Web Tokens (access + refresh) |
| Password Hashing | bcrypt |
| Validation | express-validator |
| Email | Nodemailer + Mailgen |
| Cookie parsing | cookie-parser |
| CORS | cors |
| Dev tooling | nodemon, prettier |

## 📁 Project Structure

```
Project-Management-Backend/
├── public/
│   └── images/
├── src/
│   ├── app.js                 # Express app setup & middleware
│   ├── index.js               # Entry point (connects DB, starts server)
│   ├── controllers/
│   │   ├── auth.controller.js         # Auth logic (register, login, password, etc.)
│   │   ├── healthcheck.controller.js  # Server health check
│   │   └── project.controller.js      # Project & member CRUD
│   ├── db/
│   │   └── index.js                   # MongoDB connection
│   ├── middlewares/
│   │   ├── auth.middleware.js         # JWT verification
│   │   └── validator.middleware.js    # Request validation handler
│   ├── models/
│   │   ├── user.model.js
│   │   ├── projects.model.js
│   │   ├── projectMember.model.js
│   │   ├── task.model.js
│   │   ├── subTask.model.js
│   │   └── node.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── healthcheck.routes.js
│   ├── utils/
│   │   ├── api-response.js
│   │   ├── api-error.js
│   │   ├── async-handler.js
│   │   ├── constants.js
│   │   └── mail.js
│   └── validators/
│       └── index.js
├── .env
├── .gitignore
├── .prettierrc
├── .prettierignore
├── package.json
├── package-lock.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas cluster)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/MahidharBoppana/Project-Management-Backend.git
   cd Project-Management-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example below into a `.env` file in the project root and fill in your values:

   ```env
   PORT=3000

   # MongoDB
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

   # CORS
   CORS_ORIGIN=http://localhost:5173

   # JWT
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d

   # Password reset frontend URL
   FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password

   # Email (Nodemailer / Mailgen)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_email_password
   FROM_EMAIL=your_email@example.com
   ```

4. **Start the server**

   Development (with auto-reload via nodemon):
   ```bash
   npm run dev
   ```

   Production:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000` (or the `PORT` you set).

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default `3000`) |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | No (default `http://localhost:5173`) |
| `ACCESS_TOKEN_SECRET` | Secret for signing access tokens | Yes |
| `ACCESS_TOKEN_EXPIRY` | Access token expiry (e.g. `1d`) | No |
| `REFRESH_TOKEN_SECRET` | Secret for signing refresh tokens | Yes |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiry (e.g. `10d`) | No |
| `FORGOT_PASSWORD_REDIRECT_URL` | Frontend URL for password reset | No |
| `SMTP_HOST` / `SMTP_PORT` | Outgoing mail server | No (for email features) |
| `SMTP_USER` / `SMTP_PASS` | SMTP credentials | No |
| `FROM_EMAIL` | Sender email address | No |

## ▶️ Running the Server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

## 📬 API Endpoints

Base URL: `http://localhost:3000/api/v1`

All responses follow the `ApiResponse` format:
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
| GET | `/healthecheck` | Server health check | ❌ |

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register a new user (sends verification email) | ❌ |
| POST | `/auth/login` | Login & receive access/refresh cookies | ❌ |
| GET | `/auth/verify-email/:verificationToken` | Verify email address | ❌ |
| POST | `/auth/refresh-token` | Refresh access token | ❌ |
| POST | `/auth/forgot-password` | Send password reset email | ❌ |
| POST | `/auth/reset-password/:resetToken` | Reset password with token | ❌ |
| POST | `/auth/logout` | Logout (clear cookies) | ✅ |
| POST | `/auth/current-user` | Get authenticated user profile | ✅ |
| POST | `/auth/change-password` | Change password (old + new) | ✅ |
| POST | `/auth/resend-email-verification` | Resend verification email | ✅ |

### Project Management

> The project controllers exist under `src/controllers/project.controller.js`. Routes are not yet mounted in `src/app.js` — mount them under `/api/v1/projects` before use.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/projects` | List projects for current user | ✅ |
| GET | `/projects/:projectId` | Get a single project | ✅ |
| POST | `/projects` | Create a project | ✅ |
| PUT/PATCH | `/projects/:projectId` | Update a project | ✅ |
| DELETE | `/projects/:projectId` | Delete a project | ✅ |
| POST | `/projects/:projectId/members` | Add a member to a project | ✅ |
| GET | `/projects/:projectId/members` | List project members | ✅ |
| PUT/PATCH | `/projects/:projectId/members/:userId` | Update a member's role | ✅ |
| DELETE | `/projects/:projectId/members/:userId` | Remove a member | ✅ |

### Example: Register

**Request**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "member"
}
```

**Response**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "user registered successfully and verification has been sent on your email",
  "data": {
    "user": { "_id": "...", "username": "johndoe", "email": "john@example.com", ... }
  }
}
```

## 🧪 Testing

There is no test suite configured yet. You can test the API manually with [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/), or `curl`.

Example with curl:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"securePassword123"}'
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

Built by [Mahidhar Boppana](https://github.com/MahidharBoppana)