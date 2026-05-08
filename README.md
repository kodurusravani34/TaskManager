# ProjectPilot 🚀

A production-ready **Project Management Web Application** built with React, Node.js, PostgreSQL, and Prisma ORM. Manage projects, tasks, and teams with powerful analytics — all in a beautiful dark-themed UI.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)

---

## ✨ Features

- **Authentication** — JWT-based signup/login with bcrypt password hashing
- **Role-Based Access Control** — Admin and Member roles with granular permissions
- **Project Management** — Create, update, delete, and track projects
- **Task Management** — Full CRUD with priority, status, due dates, and assignees
- **Team Management** — Add/remove project members, view team directory
- **Dashboard Analytics** — Interactive charts (Recharts), stats cards, overdue alerts
- **Filters & Search** — Filter tasks by status, priority, overdue; search by title
- **Responsive Design** — Works beautifully on desktop, tablet, and mobile
- **Railway Deployable** — Production-ready with deployment configuration

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router DOM v6 | Routing |
| Axios | HTTP Client |
| React Hook Form | Form Management |
| Zod | Validation |
| Recharts | Charts |
| Lucide React | Icons |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server |
| Prisma ORM | Database ORM |
| PostgreSQL | Database |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Helmet | Security Headers |
| Morgan | Logging |
| Zod | Validation |

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/projectpilot?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000
```

### 3. Setup Database

```bash
cd server

# Push schema to database
npx prisma db push

# Seed demo data
node prisma/seed.js
```

### 4. Run Development Servers

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

Visit **http://localhost:5173**

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@projectpilot.com | password123 |
| Member | jane@projectpilot.com | password123 |
| Member | bob@projectpilot.com | password123 |

---

## 📡 API Documentation

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Projects
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/projects` | List projects | Yes | Any |
| POST | `/api/projects` | Create project | Yes | Admin |
| GET | `/api/projects/:id` | Get project details | Yes | Any |
| PUT | `/api/projects/:id` | Update project | Yes | Admin |
| DELETE | `/api/projects/:id` | Delete project | Yes | Admin |

### Tasks
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/tasks` | List tasks (with filters) | Yes | Any |
| POST | `/api/tasks` | Create task | Yes | Admin |
| GET | `/api/tasks/:id` | Get task | Yes | Any |
| PUT | `/api/tasks/:id` | Update task | Yes | Admin (full) / Member (status only) |
| DELETE | `/api/tasks/:id` | Delete task | Yes | Admin |

### Team
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/users` | List all users | Yes | Any |
| POST | `/api/projects/:id/members` | Add member | Yes | Admin |
| DELETE | `/api/projects/:id/members/:userId` | Remove member | Yes | Admin |

### Dashboard
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard/stats` | Get dashboard stats | Yes |
| GET | `/api/dashboard/overdue` | Get overdue tasks | Yes |

---

## 🚀 Railway Deployment

1. Push code to GitHub
2. Create a new Railway project
3. Add PostgreSQL service
4. Deploy backend:
   - Root directory: `server`
   - Build: `npm install`
   - Start: `npm start`
   - Add env vars: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CLIENT_URL`
5. Deploy frontend:
   - Root directory: `client`
   - Build: `npm run build`
   - Start: `npx serve dist -s`
   - Add env var: `VITE_API_URL`
6. Run `npx prisma db push` and seed data

---

## 📁 Project Structure

```
├── client/                 # React Frontend
│   ├── src/
│   │   ├── context/       # Auth context
│   │   ├── layouts/       # Dashboard layout
│   │   ├── pages/         # All pages
│   │   ├── services/      # API services
│   │   ├── App.jsx        # Routes
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                 # Node.js Backend
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.js        # Seed data
│   ├── config/            # JWT & DB config
│   ├── controllers/       # Route handlers
│   ├── middleware/         # Auth, RBAC, validation
│   ├── routes/            # API routes
│   ├── utils/             # Error handling
│   ├── app.js             # Express setup
│   └── server.js          # Entry point
│
└── README.md
```

---

## 📄 License

MIT License — feel free to use this project for any purpose.
"# TaskManager" 
"# TaskManager" 
