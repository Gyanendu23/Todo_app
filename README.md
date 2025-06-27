# 📝 Todo App — Full Stack (Node.js + MongoDB + HTML/JS)

A responsive, full-featured Todo application with user authentication and CRUD operations — built using **Node.js**, **Express**, **MongoDB**, and vanilla **HTML/CSS/JS frontend**.

---

## ✨ Features

- 🔐 User Signup & Login (JWT authentication)
- ➕ Add Todos
- ✅ Toggle Completed / Not Completed
- ❌ Delete Todos
- 💾 User-specific Todo list
- 🎨 Responsive and visually modern frontend
- 🔒 Password validation and hashing
- 📡 Frontend-backend communication with Axios

---

## 🛠 Tech Stack

### 🧠 Frontend
- HTML5, CSS3, Vanilla JavaScript
- Axios (for HTTP requests)

### ⚙️ Backend
- Node.js
- Express.js
- MongoDB Atlas (with Mongoose)
- JSON Web Tokens (JWT)
- Bcrypt (Password hashing)
- Zod (Request validation)

---

## 📁 Folder Structure

/todo-app/
│
├── backend/
│ ├── index.js # Express backend
│ ├── db.js # Mongoose schemas
│
├── frontend/
│ ├── index.html # Frontend UI
│
└── README.md


---

## 🚀 Getting Started Locally

### ✅ 1. Clone the repository

git clone https://github.com/yourusername/todo-app.git
cd todo-app


### ✅ 2. Backend Setup
Navigate into the backend directory and install dependencies:
cd backend
npm install

Update your .env or use inline values in code:
JWT_SECRET=gyanenduKumarJha
MONGO_URI=your_mongodb_atlas_url

### ✅ 3.Start the backend server:
node index.js

### ✅ 4. Frontend Setup
Open the frontend/index.html file directly in your browser:

#### You can just double-click it to open locally

#### Or serve it using a live server extension (like in VS Code)
