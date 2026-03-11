# 🕉️ All About Shiva

A full-featured Node.js web application dedicated to Lord Shiva — featuring sacred names, mantras, Vedas, Stotras, divine ornaments, upcoming events, and a complete admin panel with CRUD management.

---

## ✨ Features

### Public Site
- **Landing Page** — SVG Shiva idol in meditative pose, featured names, upcoming events
- **Names** — Browse & search 1,000+ names of Shiva with meaning and story
- **Mantras** — Sanskrit text, transliteration, meaning, source, and history
- **Vedas** — All 4 Vedas with description, timeline, incidents, and famous stories
- **Stotras** — Full stotra text, meaning, author, and backstory
- **Ornaments** — Every symbol/ornament on Shiva's body with meaning and story
- **Static Pages** — About Us, Contact, 108 Names, Significance of Shiva

### Admin Panel (`/admin`)
- Secure login with bcrypt-hashed passwords
- Dashboard with content counts
- Full CRUD for: Names, Mantras, Stotras, Events, Ornaments, Pages
- Veda management (edit content + add/remove incidents & stories)
- Featured toggle for homepage highlights
- Event management with muhurat (auspicious time) tracking

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Runtime     | Node.js                             |
| Framework   | Express.js                          |
| Template    | **Nunjucks** (Jinja2-style)         |
| Database    | **MySQL** (normalized schema)       |
| Auth        | bcryptjs + express-session          |
| Styling     | Custom CSS (no frameworks)          |

---

## 📁 Project Structure

```
shiva-app/
├── src/
│   ├── app.js                  # Entry point
│   ├── routes/
│   │   ├── public.js           # All public routes
│   │   └── admin.js            # Admin CRUD routes
│   ├── models/                 # DB queries (MySQL pool)
│   │   ├── Name.js
│   │   ├── Mantra.js
│   │   ├── Veda.js
│   │   ├── Stotra.js
│   │   ├── Event.js
│   │   ├── Ornament.js
│   │   └── Admin.js
│   ├── middleware/
│   │   └── auth.js             # Session-based auth guard
│   └── views/
│       ├── public/             # Public Nunjucks templates
│       └── admin/              # Admin Nunjucks templates
├── public/
│   ├── css/style.css           # Public styles
│   ├── css/admin.css           # Admin styles
│   └── js/                    # Client-side JS
├── config/
│   └── db.js                  # MySQL pool
├── scripts/
│   ├── setup-db.js             # Create tables
│   └── seed.js                 # Seed initial data
├── .env.example
└── package.json
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- MySQL 8.0+

### 2. Install
```bash
cd shiva-app
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
```
Edit `.env` with your MySQL credentials:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=shiva_db
SESSION_SECRET=change-this-to-a-long-random-string
ADMIN_EMAIL=admin@allaboutshiva.com
ADMIN_PASSWORD=Admin@123
```

### 4. Set Up Database
```bash
npm run setup-db   # Creates tables
npm run seed       # Populates with initial content
```

### 5. Start
```bash
npm start          # Production
npm run dev        # Development (auto-reload with nodemon)
```

Visit: http://localhost:3000  
Admin: http://localhost:3000/admin

---

## 🗄️ Database Schema

### Normalized Tables

| Table            | Purpose                                  |
|------------------|------------------------------------------|
| `admin_users`    | Admin login credentials                  |
| `names`          | Shiva's names with meaning & story       |
| `mantras`        | Sanskrit + English mantras               |
| `vedas`          | 4 Vedas (static)                         |
| `veda_incidents` | Incidents & stories per Veda (FK)        |
| `stotras`        | Sacred hymns                             |
| `events`         | Upcoming festivals/events with muhurat   |
| `ornaments`      | Items/symbols on Shiva's body            |
| `pages`          | Static CMS pages                         |

### Key Relationships
- `veda_incidents.veda_id` → `vedas.id` (CASCADE DELETE)

---

## 🔐 Admin Credentials (Default)
```
Email:    admin@allaboutshiva.com
Password: Admin@123
```
Change these in your `.env` before going to production!

---

## 🌐 Public Routes

| Route                | Page                        |
|---------------------|-----------------------------|
| `/`                 | Home with idol & events     |
| `/names`            | All names (searchable)      |
| `/names/:id`        | Name detail                 |
| `/mantras`          | All mantras                 |
| `/mantras/:id`      | Mantra detail               |
| `/vedas`            | All 4 Vedas                 |
| `/vedas/:name`      | Veda detail                 |
| `/stotras`          | All stotras                 |
| `/stotras/:id`      | Stotra detail               |
| `/ornaments`        | All ornaments               |
| `/ornaments/:id`    | Ornament detail             |
| `/page/:slug`       | Static CMS pages            |

## 🔒 Admin Routes

| Route                    | Action               |
|--------------------------|----------------------|
| `/admin`                 | Dashboard            |
| `/admin/login`           | Login                |
| `/admin/names`           | List names           |
| `/admin/names/new`       | Create name          |
| `/admin/names/:id/edit`  | Edit name            |
| (same pattern for all)   | mantras, stotras...  |
| `/admin/vedas`           | Manage Vedas         |
| `/admin/events`          | Manage events        |
| `/admin/ornaments`       | Manage ornaments     |
| `/admin/pages`           | Manage static pages  |
