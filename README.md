# 🔗 URL Shortener – Backend

Backend service for a production-grade URL shortener built with
Node.js, Express.js, MongoDB, and JWT authentication.

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

Client (Next.js)
|
|-- REST APIs
|-- JWT Authentication
|
Backend (Express.js)
|
|-- Auth Service
|-- URL Service
|-- Analytics Service
|
Database (MongoDB)
