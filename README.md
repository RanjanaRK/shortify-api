# 🔗 URL Shortener – Backend

Backend service for a production-grade URL shortener built with
Node.js, Express.js, MongoDB, and JWT authentication.

This service provides secure URL shortening with authentication,
anonymous usage limits, analytics, and on-demand QR code generation.

---

## 🚀 Features

### 🔐 Authentication & Security

- User registration & login
- JWT-based authentication
  - Access Token
  - Refresh Token
- Secure logout (refresh token invalidation)
- Account deletion
- Protected routes using middleware

### 🕵️ Anonymous User Support (Cookie-Based)

- When a user accesses the platform without authentication:
  - A temporary **anonymousUserId** is generated
  - The ID is stored securely in an HTTP-only cookie
- This ID is used to:
  - Track anonymous URL generation count
  - Enforce the free limit of **3 URL generations**
- Once the user logs in or registers:
  - The anonymous cookie is **deleted**
  - The user transitions fully to an authenticated session
- This ensures clean state management and prevents duplicate tracking

### 🔗 URL Management

- Generate short URLs
- Redirect short URLs to original URLs
- QR code generation for URLs
- Supports both anonymous and authenticated users

### 📎 QR Code Generation (On-Demand)

- QR codes are available **only for authenticated users**
- QR codes are generated using the short URL
- QR images are **not stored in the database**
- This keeps the system stateless and reduces storage overhead

### 📊 Analytics & User Activity

- Click count tracking per URL
- User activity logging
- Analytics available for authenticated users

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Access & Refresh Tokens)

---

## 🧱 System Architecture

```
Client (Next.js)
↓
Backend (Express.js) - Auth Service - URL Service - Analytics Service
↓
Database (MongoDB)
```

## 🔑 Authentication Flow

1. User logs in and receives **Access Token + Refresh Token**
2. Access Token is used for accessing protected routes
3. When Access Token expires:
   - Refresh Token generates a new Access Token
4. Logout invalidates the refresh token

---

## 📦 API Endpoints

### Auth

```
POST /auth/register
POST /auth/login
POST /auth/logout
DELETE /api/auth/delete-account
```

### User

```
GET /api/user/me
DELETE /api/user/deleteAccount
GET /api/user/users
GET /api/user/activity
```

### QRc Code

```
POST /api/qr/generate
```

### URL

```
POST /api/urlShort
GET /api/urls/analytics/:id
GET /:code
```

---

## 🗄 Database Models (High-Level)

### User

- email
- password
- createdAt

### URL

- originalUrl
- shortCode
- userId (optional for anonymous users)
- clickCount
- createdAt

### Analytics

- urlId
- timestamp
- ip / userAgent (optional)

### AnonymousUsage

- anonymousUserId
- urlCount
- createdAt

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

PORT=8000
JWT_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
MONGO_URI=your_mongodb_connection_string
BASE_URL=backend_base_url(e.g. https://api.example.com)
CLIENT_URL=frontend_url (used for CORS and redirects)
ANON_SECRET=your_anonymous_secret

---

## ▶️ Run Locally

1. Clone the repository
2. Install dependencies

```bash
npm install
```

```bash
npm run dev
```

---

### 🚦 Rate Limiting

- Separate rate limits for:
  - Anonymous users
  - Authenticated users
- Helps prevent abuse and improves API reliability

---

## 📡 API Behavior

- Returns `401 Unauthorized` when authentication is required
- Returns `429 Too Many Requests` when rate limits are exceeded
- Returns `404 Not Found` for invalid short URLs

---

## ⚡ Load & Performance Testing

- Load testing was performed locally using **Autocannon**
- Focused on high-traffic endpoints:
  - URL redirect (`GET /:code`)
- Database read operations were validated under concurrent load
- The system remained stable with no crashes during testing
- Temporary load test scripts were removed after validation to keep the repository clean

---

## 🌐 Frontend Repository

https://github.com/RanjanaRK/shortify-ui

---

## 👨‍💻 Author

**Ranjana Kumari**  
Full-Stack Developer (Next.js · Node.js · MongoDB · Express)

🔗 LinkedIn: https://www.linkedin.com/
🐙 GitHub: https://github.com/RanjanaRK
