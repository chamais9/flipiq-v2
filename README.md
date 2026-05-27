# FlipIQ v2 — Flashcard Learning App

A full-stack flashcard learning app for university students. Built with React, Node.js/Express and MySQL.

## Problem

Students struggle to retain large amounts of study material. FlipIQ solves this with active recall through flashcards, quizzes, progress tracking and deck sharing between classmates.

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React 18 + Vite               |
| Routing  | React Router v6               |
| HTTP     | Axios                         |
| Charts   | Recharts                      |
| Backend  | Node.js + Express             |
| Auth     | JWT + bcryptjs                |
| Database | MySQL 8 via mysql2            |

## How to Run

### Setup Database
```bash
mysql -u root -p
CREATE DATABASE flipiq;
EXIT;
```

### Backend
```bash
cd backend
copy .env.example .env
# Set DB_PASSWORD in .env
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Default Login
- Admin: admin@flipiq.com / admin123

## Features

- Register and login with JWT authentication
- Create, read, update, delete flashcards
- 3D card flip animation to reveal answers
- Study mode with progress bar
- Quiz mode with score tracking
- Bar chart showing quiz history
- Daily study goal tracker
- Daily motivational quote
- Share card decks with other students via code
- Full profile page with bio and university
- Admin dashboard to manage users and view activity
- Live search and filter by category and difficulty
- Mobile responsive design
- Error handling throughout

## Folder Structure

```
flipiq-v2/
├── backend/
│   ├── config/db.js           - MySQL connection pool
│   ├── middleware/auth.js     - JWT verification middleware
│   ├── models/
│   │   ├── User.js            - User database queries
│   │   ├── Flashcard.js       - Flashcard database queries
│   │   ├── ViewHistory.js     - Quiz and reveal tracking
│   │   └── Share.js           - Deck sharing queries
│   ├── routes/
│   │   ├── auth.js            - Register, login, profile
│   │   ├── flashcards.js      - CRUD for flashcards
│   │   ├── quiz.js            - Quiz scores and history
│   │   ├── share.js           - Deck sharing
│   │   └── admin.js           - Admin user management
│   └── server.js              - Express entry point
├── frontend/
│   └── src/
│       ├── components/        - Reusable UI components
│       ├── pages/             - Full page views
│       ├── hooks/             - Custom React hooks
│       ├── services/          - Axios API service
│       ├── context/           - Auth context
│       └── utils/             - Helper functions
└── data/
    └── flipiq_seed.sql        - Database schema and seed data
```

## Individual Contribution

This assignment was completed individually. All files were written by the student.

## Challenges

Migrating from vanilla JS to React required rethinking state management using useState, useMemo and custom hooks instead of direct DOM manipulation. Implementing JWT end-to-end required coordinating the Axios interceptor, Express middleware and React Context to share auth state globally. Building deck sharing required a secure import flow where cards are copied rather than referenced to prevent issues if the original is deleted. The daily goal widget required a separate API call using MySQL's CURDATE() function to count today's reveals. Keeping a clean folder structure with single-responsibility files required careful planning but significantly improved code quality and readability.
