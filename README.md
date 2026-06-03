# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Clinivo — Frontend

A React-based healthcare messaging platform that connects patients with their healthcare providers through real-time, secure conversations.

---

## Overview

Clinivo is a role-aware clinical communication app built with React and Vite. After authenticating, users are routed to a tailored experience based on their role — patients see their conversation with their provider, while healthcare providers manage conversations across all of their patients.

---

## Features

- **Role-based routing** — Separate views and navigation for patients and healthcare providers
- **Real-time messaging** — WebSocket-powered live chat between patients and providers
- **Protected routes** — Authentication-gated pages with session persistence via `localStorage`
- **Collapsible sidebar** — Responsive navigation that collapses to icon-only mode
- **Account settings** — Password management, 2FA toggle, and session control

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Real-time | WebSockets |
| Styling | Bootstrap 5 + Bootstrap Icons |

---

## Project Structure

```
clinivo-frontend/
├── src/
│   ├── api/
│   │   ├── api.js          # API helper functions (users, conversations, messages)
│   │   └── axios.js        # Axios instance with base URL config
│   ├── layout/
│   │   └── Sidebar.jsx     # Collapsible role-aware navigation sidebar
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── PatientMessages.jsx
│   │   ├── DoctorMessages.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   └── websocket.js    # WebSocket connection management
│   ├── App.jsx             # Root component with routing logic
│   └── main.jsx            # App entry point
├── AuthContext.jsx          # Auth state context provider
├── ProtectedRoute.jsx       # Route guard for authenticated pages
└── index.html
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the Clinivo backend (default: `http://localhost:8080`)

### Installation

```bash
git clone https://github.com/your-username/clinivo-frontend.git
cd clinivo-frontend
npm install
```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Backend Configuration

The API base URL is configured in `src/api/axios.js`:

```js
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});
```

Update this value to point to your backend environment as needed.

---

## Authentication & Roles

Users register with one of two roles:

| Role | Access |
|---|---|
| `PATIENT` | View and send messages to their assigned provider |
| `PROVIDER` | View and respond to conversations across all patients |

Session data is stored in `localStorage` and used by the sidebar and protected routes to determine navigation and access.

---

## Available Routes

| Path | Component | Auth Required |
|---|---|---|
| `/` | Login | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/patient-messages` | PatientMessages | Yes |
| `/doctor-messages` | DoctorMessages | Yes |
| `/settings` | Settings | Yes |

---

## API Reference

All requests are made to `/api` on the configured backend. Key endpoints used by the frontend:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users/login` | Authenticate a user |
| `POST` | `/users` | Register a new user |
| `POST` | `/conversations` | Create a new conversation |
| `GET` | `/conversations/patient/:id` | Get a patient's conversation |
| `GET` | `/conversations/doctor/:id` | Get all provider conversations |
| `GET` | `/messages/conversation/:id` | Fetch messages for a conversation |
| `POST` | `/messages` | Send a new message |
