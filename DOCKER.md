# 🐳 Docker Setup Guide — CarePoint Hospital Management System

This guide outlines how to build, run, and manage the full-stack **CarePoint Hospital Management System** using Docker and Docker Compose.

---

## 🏗️ Architecture Overview

The multi-container Docker environment consists of three interconnected services:

```
                      ┌─────────────────────────────────────────┐
                      │             carepoint_frontend          │
                      │  (React + Vite + Nginx Alpine)          │
                      │  Ports: 80 / 5173                       │
                      └────────────────────┬────────────────────┘
                                           │
                         Proxy /api/ ──────┤
                                           │
                      ┌────────────────────▼────────────────────┐
                      │             carepoint_backend           │
                      │  (Node.js 20 Express REST API)          │
                      │  Port: 5000                             │
                      └────────────────────┬────────────────────┘
                                           │
                        TCP Connection ────┤
                                           │
                      ┌────────────────────▼────────────────────┐
                      │               carepoint_db              │
                      │  (MySQL 8.0 Engine)                     │
                      │  Auto-runs schema.sql & seed.sql        │
                      │  Port: 3306 | Persistent Volume         │
                      └─────────────────────────────────────────┘
```

---

## 🚀 Quick Start (Production Stack)

### 1. Start the entire application stack:
```bash
docker compose up -d --build
```
*Or using npm shortcut:*
```bash
npm run docker:up
```

### 2. Access the services:
- 🌐 **Frontend Hospital Portal**: [http://localhost](http://localhost) or [http://localhost:5173](http://localhost:5173)
- 🔌 **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
- 🩺 **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- 🗄️ **MySQL Database**: `localhost:3306` (User: `root`, Password: `rootpassword`, Database: `hospital_management_db`)

---

## 💻 Interactive Development Mode (Hot-Reload)

To run with live file-watching and hot-reloading for both backend and frontend:

```bash
docker compose -f docker-compose.dev.yml up --build
```
*Or using npm shortcut:*
```bash
npm run docker:dev
```

---

## 📜 Useful Commands

| Action | Command | npm Shortcut |
|---|---|---|
| **Build images** | `docker compose build` | `npm run docker:build` |
| **Start stack (detached)** | `docker compose up -d` | `npm run docker:up` |
| **Stop stack** | `docker compose down` | `npm run docker:down` |
| **View live logs** | `docker compose logs -f` | `npm run docker:logs` |
| **Stop & reset database data** | `docker compose down -v` | — |
| **Inspect database container** | `docker compose exec db mysql -u root -prootpassword hospital_management_db` | — |
| **Run manual DB re-seed** | `docker compose exec backend npm run init-db` | — |

---

## ⚙️ Environment Variables Configuration

Default configuration is in [`.env.docker`](file:///c:/projectteam/.env.docker). You can customize these values by setting them in your environment or passing a `.env` file:

| Variable | Default Value | Description |
|---|---|---|
| `DB_HOST` | `db` | MySQL host name in Docker network |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | Database admin user |
| `DB_PASSWORD` | `rootpassword` | Database root password |
| `DB_NAME` | `hospital_management_db` | Main database name |
| `BACKEND_PORT` | `5000` | Express server port |
| `FRONTEND_PORT` | `80` | Production HTTP port |
| `FRONTEND_DEV_PORT`| `5173` | Alternate port mapping |
| `JWT_SECRET` | *(Default 2026 key)* | Secret for JWT authentication |
| `GEMINI_API_KEY` | *(Optional)* | Google Gemini API key for AI assistant |

---

## 🩺 Health Checks & Auto-Healing

- **Database**: Validates connectivity every 10 seconds with `mysqladmin ping`.
- **Backend**: Waits for database health, then reports service health via `/api/health`.
- **Frontend**: Nginx verifies response status and proxies all `/api/*` traffic transparently to the backend.
