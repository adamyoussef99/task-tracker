# 🧾 Task Tracker

A simple full‑stack task manager that lets you create, view, complete, and delete tasks using a modern React/Vite frontend and a Python GraphQL backend — all powered by PostgreSQL and easily runnable with Docker.

---

## Tech Stack

| Layer     | Technology                                       |
|-----------|--------------------------------------------------|
| Frontend  | React with Vite, Tailwind CSS                    |
| Backend   | Python (Django) + Graphene GraphQL API  |
| Database  | PostgreSQL                                       |
| Dev Tools | Docker, docker-compose                           |

---

## Running Locally with Docker

```bash
git clone https://github.com/adamyoussef99/task-tracker.git
cd task-tracker

# Build and start the application stack
docker-compose up --build
```

- **Backend API** will be running at: `http://localhost:8000/graphql`
- **Frontend app** will be available at: `http://localhost:5173`

---

## Functionality

- Add, complete, and delete tasks
- Responsive UI with tabular layout and styled form
- GraphQL API supporting mutations for task creation and completion
- Optional batch task creation (can be added in schema)

---

## ✅ Troubleshooting

- If frontend doesn't hot‑reload: make sure `CHOKIDAR_USEPOLLING=true` (already set via compose), and polling is enabled in `vite.config.js`.
- If ports conflict, adjust host mappings in `docker-compose.yml`.
