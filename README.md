# SocialMedia App

A full-stack social media application with a modern, responsive UI, real-time notifications, and robust authentication. Built with **React**, **Redux**, **Tailwind CSS** on the frontend, and **Node.js**, **Express**, **MongoDB**, **Socket.IO** on the backend.

---

## Features

- User authentication (login, register, JWT)
- Responsive feed with posts
- Follow/unfollow users, see followed users’ posts
- Real-time notifications (Socket.IO)
- Profile pages with user info and posts
- Search users
- Dialogs for creating posts and notifications
- Global and per-page loading indicators
- Mobile-first UX: bottom navigation, popover menus, adaptive layouts

---

## Tech Stack

### Frontend

- React 19, React Router 7
- Redux Toolkit & React-Redux
- Tailwind CSS
- Socket.IO Client
- Radix UI (Popover, Dialog, Avatar)
- Vite

### Backend

- Node.js, Express
- MongoDB & Mongoose
- Redis (for pub/sub notifications)
- Socket.IO
- JWT authentication
- Cloudinary (for image uploads)
- Multer (file uploads)
- dotenv

---

## Project Structure


---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or Atlas)
- Redis server (for notifications)
- Cloudinary account (for image uploads)

---

### 1. Clone the repository

```bash
git clone <repo-url>
cd SocialMedia
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend` with the following variables:
```
PORT=8000
-MONGO_URI=your_mongodb_connection_string
-JWT_SECRET=your_jwt_secret
-FRONTEND_URL=http://localhost:5173
-CLOUDINARY_CLOUD_NAME=your_cloudinary_name
-CLOUDINARY_API_KEY=your_cloudinary_key
-CLOUDINARY_API_SECRET=your_cloudinary_secret
-REDIS_URL=redis://localhost:6379
```
Start the backend server:

```bash
npm start
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

If you need environment variables for the frontend (e.g., API base URL), create a `.env` file:
Start the frontend dev server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Usage

- Register or log in.
- Create posts.
- Follow/unfollow users.
- View notifications in real-time.
- Responsive design: try resizing or using on mobile!

---

## Deployment

- The app is ready for deployment on platforms like Vercel (frontend) and Render/Heroku (backend).
- Update environment variables for production.

---

## Scripts

### Frontend

- `npm run dev` – Start Vite dev server
- `npm run build` – Build for production
- `npm run lint` – Lint code

### Backend

- `npm start` – Start backend with nodemon

---

## License

MIT

---

## Credits

Developed by [Satyam Kumar].  
UI powered by Tailwind CSS and Radix UI.  
Real-time features by Socket.IO and Redis.
