# 🚀 Personal Portfolio Website

A full-stack, CMS-powered personal portfolio website built with **Next.js** and **FastAPI**, backed by **MongoDB** — fully containerised and deployed via Docker with Nginx as a reverse proxy.

---

## 📸 Overview

This portfolio showcases projects, skills, work experience, academic background, and contact information through a dynamic, admin-managed interface. All content is editable through a built-in admin dashboard without touching code.

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (App Router) — React framework with SSR/SSG
- **TypeScript** — Type-safe components
- **CSS Modules** — Component-scoped styling
- **Lucide React** — Icon library
- **Leaflet.js** — Interactive map on contact page
- **skillicons.dev** — Tech stack icon rendering

### Backend
- **FastAPI** — High-performance async Python web framework
- **Motor** — Async MongoDB driver
- **MongoDB** — NoSQL document database
- **Pydantic / pydantic-settings** — Data validation and settings management
- **JWT (python-jose)** — Token-based authentication
- **Cloudinary** — Cloud image storage and delivery

### Infrastructure
- **Docker** — Multi-stage containerised build
- **Nginx** — Reverse proxy routing `/api` to FastAPI and `/` to Next.js
- **Node.js 20** — Frontend runtime
- **Python 3.12** — Backend runtime

---

## 📁 Project Structure

```
portfolio_website_main/
├── frontend/                  # Next.js application
│   ├── app/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Hero.tsx       # Animated hero with live stats
│   │   │   ├── About.tsx      # About section with dynamic image
│   │   │   ├── TechStack.tsx  # Paginated skills grid
│   │   │   ├── Projects.tsx   # Project cards
│   │   │   ├── Experience.tsx # Work timeline
│   │   │   ├── Education.tsx  # Academic timeline
│   │   │   ├── Navbar.tsx     # Sticky navigation
│   │   │   ├── Footer.tsx     # Footer with social links
│   │   │   └── ...
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── login/         # PIN-based login
│   │   │   ├── components/    # Panel components per section
│   │   │   │   ├── projects/
│   │   │   │   ├── skills/
│   │   │   │   ├── experience/
│   │   │   │   ├── academic/
│   │   │   │   ├── analytics/
│   │   │   │   ├── resumes/
│   │   │   │   ├── messages/
│   │   │   │   ├── settings/
│   │   │   │   ├── about/
│   │   │   │   └── users/
│   │   ├── contact/           # Contact form page
│   │   ├── projects/          # Projects listing + detail pages
│   │   └── style/             # Global CSS per section
│   └── public/
│
├── backend/                   # FastAPI application
│   └── app/
│       ├── api/v1/            # REST API endpoints
│       │   ├── auth.py
│       │   ├── projects.py
│       │   ├── skills.py
│       │   ├── experiences.py
│       │   ├── academics.py
│       │   ├── resumes.py
│       │   ├── contacts.py
│       │   ├── settings.py
│       │   └── analytics.py
│       ├── core/
│       │   ├── config.py      # Environment config via pydantic-settings
│       │   ├── database.py    # Async MongoDB connection (Motor)
│       │   └── auth.py        # JWT token creation/verification
│       ├── models/            # Domain model classes
│       ├── repositories/      # MongoDB CRUD layer
│       ├── schemas/           # Pydantic request/response schemas
│       ├── services/          # Business logic layer
│       └── main.py            # FastAPI app entry point
│
├── Dockerfile                 # Multi-stage production build
├── nginx.conf                 # Nginx reverse proxy config
└── start.sh                   # Container startup script
```

---

## ✨ Features

### Public Portfolio
- **Animated Hero** — Live-counting stats (projects, experience, commits, satisfaction rate) fetched from the backend
- **About** — Dynamic profile image managed through the admin panel
- **Tech Stack** — Paginated, animated skill cards loaded from the database
- **Projects** — Filterable project cards with detailed view pages (tech stack, features, GitHub/live links, image galleries)
- **Experience & Education** — Timeline-style sections
- **Contact Form** — Messages stored in the database and viewable in the admin panel
- **Resume Download** — Downloadable resumes managed through admin
- **Intersection Observer animations** — Sections animate into view on scroll

### Admin Dashboard (`/admin`)
- PIN-based authentication with JWT session tokens
- **Superadmin** account configured via environment variable; supports multiple sub-admin accounts with granular page-level access control
- Manage all portfolio content without touching code:
  - Projects (CRUD with Cloudinary image upload)
  - Skills / Tech Stack
  - Work Experience
  - Academic / Education entries
  - Resumes (PDF upload)
  - Hero stats and social links (Settings)
  - About section image
  - Inbox (contact form messages)
  - Analytics dashboard
  - User management (create/deactivate/delete admin accounts)

---

## 🔌 API Endpoints

The FastAPI backend exposes a versioned REST API at `/api/v1/` (with compatibility aliases at `/api/`):

| Resource | Prefix |
|---|---|
| Auth | `/api/v1/auth` |
| Projects | `/api/v1/projects` |
| Skills | `/api/v1/skills` |
| Experiences | `/api/v1/experiences` |
| Academics | `/api/v1/academics` |
| Resumes | `/api/v1/resumes` |
| Contacts | `/api/v1/contacts` |
| Settings | `/api/v1/settings` |
| Analytics | `/api/v1/analytics` |

Interactive API docs available at `/docs` (Swagger UI) when the backend is running.

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/portfolio
PORT=8080
ADMIN_PINCODE=your_secure_pin
JWT_SECRET=your_jwt_secret_key
```

Cloudinary credentials (for image uploads) should also be configured — see `backend/app/services/cloudinary_service.py`.

---

## 🐳 Running with Docker

The project ships as a single Docker image that runs Nginx, the Next.js frontend, and the FastAPI backend together.

```bash
# Build the image
docker build -t portfolio-website .

# Run the container
docker run -p 10000:10000 \
  -e MONGODB_URI="your_mongodb_uri" \
  -e ADMIN_PINCODE="your_pin" \
  -e JWT_SECRET="your_secret" \
  portfolio-website
```

Nginx listens on the port defined by the `PORT` environment variable (default: `10000`) and proxies:
- `/api/*` → FastAPI on port `8081`
- `/*` → Next.js on port `3000`

---

## 🛠️ Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8080
# Runs on http://localhost:8080
# API docs: http://localhost:8080/docs
```

---

## 🔐 Authentication

- The **Superadmin** login uses the `ADMIN_PINCODE` from the environment variable.
- Sub-admin accounts are stored in MongoDB with a 6-digit numeric PIN, role, status, and configurable page-level access.
- Login returns a **JWT bearer token** used to authenticate subsequent admin API requests.
- The Superadmin cannot be deleted or deactivated.

---

## 📄 License

This project is for personal portfolio use. Feel free to use it as a reference or template for your own portfolio.
