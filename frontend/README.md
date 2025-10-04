# Medviz Frontend (React + Vite)

This is a simple authenticated React application built with Vite and React Router. It uses plain CSS (no Tailwind) and an in-memory mock authentication.

## Features
- Protected routes with redirect to `/login` when not authenticated
- In-memory mock auth: any non-empty credentials succeed
- Sticky, responsive header with active link highlight and Logout
- Pages: Home, New Leads, Existing Leads, Project Deadline, Budget, Payslips, Login
- Accessible semantic HTML and focus styles

## Tech stack
- React (Vite)
- React Router
- Plain CSS

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
3. Open the URL shown in your terminal (usually http://localhost:5173).

## Usage
- Visit `/login` and use any non-empty email/username and password to log in.
- After login, you will be redirected to the Home page.
- Use the header navigation to move between pages.
- Click Logout (far right in the header) to clear auth and return to `/login`.

## Backend (optional)
No backend is required for this task; authentication is mocked in-memory. If you later want to connect a Python backend (e.g., FastAPI or Flask), set your API base URL in an environment variable (e.g., `VITE_API_BASE_URL`) and replace the mock auth in `src/contexts/AuthContext.jsx` with real API calls.

## Project structure (relevant parts)
```
src/
  components/
    Header.jsx
    Header.css
    PrivateRoute.jsx
  contexts/
    AuthContext.jsx
  pages/
    Login.jsx
    Home.jsx
    NewLeads.jsx
    ExistingLeads.jsx
    ProjectDeadline.jsx
    Budget.jsx
    Payslips.jsx
  assets/
    logo.svg
  main.jsx
  index.css
```
