# System Architecture

## Architecture Style

Monolithic Web Application

Future migration to microservices is optional.

---

# Frontend

Technology:

* Next.js
* TypeScript
* Tailwind CSS

Responsibilities:

* Dashboard UI
* Progress tracking
* Analytics visualization
* Forms

---

# Backend

Technology:

* Next.js API Routes

Responsibilities:

* Authentication
* CRUD operations
* Analytics calculations

---

# Database

Technology:

* PostgreSQL

Tables:

* users
* roadmap_phases
* roadmap_topics
* study_sessions
* labs
* projects
* notes
* certifications

---

# Authentication

Technology:

* NextAuth

Roles:

* Owner

---

# Storage

Store:

* Notes
* Project links
* Resources

---

# Deployment

Development:

* Docker

Production:

* Vercel
* PostgreSQL

---

# Future Integrations

* GitHub API
* AWS Certification API
* Notion Sync
* Google Calendar
