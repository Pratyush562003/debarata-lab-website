# Lab Website — React

A complete research lab website with admin dashboard.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Admin Access

Go to http://localhost:5173/admin/login

Default credentials (CHANGE THESE!):
- Username: `admin`
- Password: `lab2025`

Change in `src/context/AuthContext.jsx`

## Customize Your Lab

Edit `src/data/labData.js` to update:
- Lab name, university, department
- PI info (name, bio, education, awards)
- Team members
- Research areas
- Publications
- News items
- Contact details

## File Structure

```
src/
├── components/
│   ├── Navbar.jsx          ← top navigation
│   └── Footer.jsx          ← footer
├── pages/
│   ├── Home.jsx            ← landing page
│   ├── About.jsx           ← PI + lab mission
│   ├── Research.jsx        ← research themes
│   ├── Publications.jsx    ← filterable paper list
│   ├── Members.jsx         ← team cards
│   └── Contact.jsx         ← contact form
├── admin/
│   ├── AdminLogin.jsx      ← login page
│   └── Dashboard.jsx       ← full admin panel
├── context/
│   └── AuthContext.jsx     ← auth state
├── routes/
│   └── ProtectedRoute.jsx  ← admin guard
├── data/
│   └── labData.js          ← ALL your lab data ← start here
└── App.jsx                 ← routing
```

## Production Backend (Recommended)

For a real deployment, add a Node.js + Express backend:

1. Create `/server` folder with Express + MongoDB
2. Add REST endpoints: GET/POST/PUT/DELETE for publications, members, news
3. Add JWT auth endpoint: POST /auth/login
4. Replace frontend mock data with API calls using `fetch()` or `axios`
5. Deploy frontend to Vercel, backend to Railway/Render

## Deployment

```bash
npm run build      # creates /dist folder
# deploy /dist to Vercel, Netlify, or GitHub Pages
```

## Tech Stack

- React 18 + Vite
- React Router v6
- CSS Variables (no Tailwind needed)
- Lucide React (icons)
- localStorage for auth (frontend-only, replace for production)
