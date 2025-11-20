# Customer Feedback — Frontend (React + Vite)

This frontend is a React + Vite application designed to work with the Feedback System backend (Spring Boot) you provided.

Features

- User register & login (user)
- Admin login
- JWT token management (stored in localStorage)
- Submit feedback, view my feedback, add additional feedback when allowed
- Admin dashboard, pending feedbacks, replied feedbacks and reply action
- Tailwind + Bootstrap integration for fast, responsive, and modern UI

Quick start

1. Install Node.js (v18+) and npm
2. From a terminal in this folder run:

```powershell
cd D:\customer_feedbackfrontend
npm install
npm run dev
```

The app runs on http://localhost:3000 and proxies `/api` to `http://localhost:8080` (see `vite.config.js`). Ensure your backend is running on port 8080.

Environment

- The dev server proxies `/api` to `http://localhost:8080`. If your backend port differs, update `vite.config.js` or the `api.baseURL` in `src/services/api.js`.

Notes & next steps

- You must run `npm install` to fetch dependencies.
- The UI uses both Tailwind and Bootstrap. Tailwind utilities are available via `index.css`.
- This scaffold focuses on functionality and a clean professional look. You can extend visuals (animations, illustrations) and add unit tests.

Known limitations

- There is minimal client-side validation. Add form validators for production.
- Role checks are done on the server—frontend shows/hides sections based on saved role but server will enforce authorization.

If you want, I can:

- Run `npm install` and start the dev server here (if you allow running commands)
- Add more refined styles or custom graphics
- Create a small test suite for critical flows
