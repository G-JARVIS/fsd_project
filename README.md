# 🚀 RecruitXchange: Career Readiness Platform

## Project Overview

RecruitXchange is a **comprehensive, full-stack MERN (MongoDB, Express, React, Node.js) application** designed to revolutionize student career readiness and placement. It offers a structured and personalized approach, integrating **AI-powered guidance**, **interactive learning**, and **application management** to prepare students for the professional world.

### Key Features ✨

* **🎓 Role Exploration & Career Pathing:** Detailed **Role Explorer** to investigate job roles, with data-driven insights and skill requirements.
* **📚 Learning Hub:** Access to curated courses and resources with progress tracking and quizzes.
* **🎮 Practice Hub:** Interactive environment for skill reinforcement and mock scenarios.
* **💼 Drive and Application Management:** Centralized system to view company drives, manage applications, and track status.
* **🗓️ Event & Calendar Management:** Built-in **Calendar** for scheduling and managing important events, sessions, and deadlines.
* **🤝 Counseling & Mentorship:** Dedicated feature for booking and managing counseling sessions.
* **🛡️ Robust User Management:** Separate access control for students and administrators, including a dedicated **Admin Dashboard** for managing drives, quizzes, roles, and students.
* **🤖 AI-Powered Tools:** Integration for profile analysis and resume building.
* **🎨 Customization:** User-friendly **Settings** panel for theme and UI preferences.

---

## 🏗️ Technical Stack

RecruitXchange is built on the robust and popular MERN stack.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React** (with Vite), **Tailwind CSS**, **Shadcn/ui** | A modern, responsive, and highly customizable user interface. |
| **Backend** | **Node.js** & **Express** | Fast, scalable server-side application with well-defined routes and middleware. |
| **Database** | **MongoDB** (via Mongoose) | Flexible NoSQL database for efficient data management. |
| **Authentication** | **JWT (JSON Web Tokens)** & **Google OAuth** | Secure, token-based authentication and authorization. |

---

## ⚙️ Local Setup and Installation

Follow these steps to get a copy of the project running on your local machine for development and testing.

### Prerequisites

* Node.js (LTS recommended)
* npm (or yarn/bun)
* MongoDB instance (local or cloud-hosted)
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/G-JARVIS/fsd_project.git
```
### 2. Configure Environment Variables
Create a file named .env inside the backend directory and populate it with your  configuration details:
```bash
# Server Configuration
NODE_ENV=development
PORT=5001

# MongoDB Connection
MONGODB_URI=<your-mongodb-connection-string>

# JWT for Authentication
JWT_SECRET=<a-long-random-string-for-jwt-signing>
JWT_EXPIRE=30d 

# Optional: For Google OAuth (if implemented)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies

Install the required packages for both the backend and frontend.
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Start the Application
Run both the backend server and the frontend development server concurrently.

```bash
# Start the backend server (from /backend directory)
npm run dev

# Start the frontend development server (from /frontend directory)
# Open a new terminal window or tab
cd ../frontend 
npm run dev
```
