# 🚍 BusBook - Online Bus Ticket Booking Platform

BusBook is a full-stack web application that allows users to browse, book, and manage bus tickets online. Admins and operators can manage schedules and view bookings in real-time.

---

## 🌟 Features

- User and Admin Authentication (JWT-based)
- Browse all available bus schedules
- Book bus tickets with confirmation page
- View your bookings under "My Bookings"
- Admin dashboard to:
  - Create / update / delete bus schedules
  - Assign buses and view all bookings
- Responsive and clean UI
- Real-time updates with modern UX

---

## 🔧 Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- React Router

**Backend:**
- Node.js
- Express.js
- MongoDB (via MongoDB Atlas)
- Mongoose
- JWT Authentication

---

## ⚙️ Installation Instructions

### 🔹 1. Clone the repository

git clone https://github.com/your-username/BusBook.git
cd BusBook

Setup Backend-
cd backend
npm install
npm nodemon server.js

create .env in backend-
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000


Setup Frontend
cd frontend/busbook
npm install
npm run dev
