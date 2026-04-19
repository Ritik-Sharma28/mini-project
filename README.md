# 📚 StudyMate

**A Developer Collaboration Platform**

A full-stack social learning platform designed to help students and developers find coding partners, join groups, and explore communities for their projects. Built with the MERN stack and powered by real-time features.

**Developed by Web Crew**

---

## 🔗 Live Demo
**[http://4.186.31.157/](http://4.186.31.157/)** *(Hosted on Microsoft Azure)*

---

## 👥 Team Web Crew
* **Ritik Sharma**
* **Yash Kumar**
* **Tavishi Jain**

## ✨ Features

* **Authentication & Profiles**: Secure user login/signup using JWT and detailed, customizable developer profiles.
* **Find Partner**: Tech-stack specific filtering and match-making system to find the perfect coding buddy.
* **Community & Posts**: A dedicated feed to create project updates, share work, and comment on discussions without the distractions of general social media.
* **Real-time Chat**: Instant messaging and group chats powered by **Socket.io**.
* **Study Groups**: Create or join project-centric study groups based on interests.
* **Notifications**: Real-time updates for interactions and connections.

---

## 🛠️ Tech Stack

### Frontend
* **Framework**: React.js (Vite)
* **Styling**: Tailwind CSS for rapid UI styling
* **State/HTTP**: Axios, Context API
* **Real-time**: Socket.io Client

### Backend
* **Runtime**: Node.js & Express.js
* **Database**: MongoDB (Mongoose) for flexible NoSQL data storage
* **Authentication**: JSON Web Tokens (JWT), Bcryptjs
* **Real-time**: Socket.io
* **Utilities**: Nodemailer (Email), Multer (File Uploads), Zod (Validation)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v18+ recommended)
* MongoDB (Local or Atlas URI)

### 1. Clone the Repository
```
git clone [https://github.com/your-username/study-mate.git](https://github.com/your-username/study-mate.git)
cd study-mate
```
2. Backend Setup
Navigate to the backend folder and install dependencies:

```Bash
cd BackEnd
npm install
Create a .env file in the BackEnd directory and add the following variables:
```
Code snippet
```
PORT=5000
MONGO=mongodb+srv://<your-mongo-uri>
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secret_key
NODE_ENV=development
# Add email service credentials if needed for Nodemailer
```
Start the backend server:

```
npm run dev
```
3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:

```
cd FrontEnd
npm install
```
Create a .env.local file in the FrontEnd directory:
# If you are not using a proxy in vite.config.js, specify the API URL:
```
VITE_API_URL=http://localhost:5000
```
Start the frontend application:

Bash
npm run dev
The app should now be running at http://localhost:5173.

📂 Project Structure
```
Study_Mate/
├── BackEnd/
│   ├── config/         # DB connection
│   ├── controllers/    # Route logic (Auth, Post, User, etc.)
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   └── server.js       # Entry point
│
├── FrontEnd/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── services/   # API & Socket services
│   │   └── App.jsx     # Main application component
│   └── vite.config.js  # Vite configuration
```


📄 License
This project is licensed under the MIT License.