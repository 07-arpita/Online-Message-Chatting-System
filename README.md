# 💬 Online Message Chatting System

<div align="center">

## 🚀 Real-Time Online Chatting Application

A modern full-stack messaging application built with **MERN Stack + Socket.IO**

<br>

![MERN](https://img.shields.io/badge/MERN-Stack-61DAFB?style=for-the-badge)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white)

</div>

---

## ✨ About The Project

**Online Message Chatting System** is a full-stack real-time chatting application created using the **MERN Stack** and **Socket.IO**.

The application allows users to communicate in real time, share images, manage profiles, customize chats, and control different account and privacy settings.

The main purpose of this project is to understand how a complete **frontend + backend + database + real-time communication** application works.

---

# 🌟 Features

## 💬 Real-Time Messaging

- ⚡ Real-time message delivery
- 🟢 Online / Offline user status
- ⌨️ Typing indicator
- ✓ Message status
- ✓✓ Read receipts
- 🔢 Unread message count
- 🕒 Last message display
- 🕐 Message time
- 🔍 Search users
- ↵ Enter to Send
- 🗑️ Delete individual messages
- 🧹 Clear complete chat

---

## 🖼️ Image & Profile Features

- 📷 Upload profile picture
- 🗑️ Remove profile picture
- 🖼️ Send images in chat
- 👤 Profile page
- ✏️ Edit profile name
- 🔐 Change password
- 🗑️ Delete account

---

## 🎨 Chat Customization

- 🌙 Dark Mode
- ☀️ Light Mode
- 🖼️ Custom Chat Wallpaper
- 🔤 Small Font Size
- 🔤 Medium Font Size
- 🔤 Large Font Size
- 🔔 Notifications setting
- 🔒 Privacy setting
- ✓✓ Read Receipts setting
- ⌨️ Typing Indicator setting
- 💬 Chat Settings

---

## 🔐 Account Features

- 📝 User Registration
- 🔑 User Login
- 🚪 Logout
- 👤 Profile Management
- ✏️ Update Name
- 🔐 Change Password
- 🗑️ Delete Account

---

# 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| ⚛️ React.js | Frontend |
| 🟢 Node.js | Backend Runtime |
| 🚂 Express.js | REST API |
| 🍃 MongoDB | Database |
| 🔌 Socket.IO | Real-Time Communication |
| 📦 Mongoose | MongoDB ODM |
| 📁 Multer | Image Upload |
| 🎨 CSS | Styling |
| ⚡ Vite | Frontend Development |
| 🛠️ VS Code | Development |

---

# 🏗️ Project Structure

```text
Online Message Chatting/
│
├── Backend/
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── messageRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── Chat.jsx
│   │   ├── Profile.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# 🔄 Application Architecture

```text
                    👤 USER
                       │
                       ▼
              ┌─────────────────┐
              │ React Frontend  │
              │     Vite        │
              └────────┬────────┘
                       │
                 REST API
                       │
                       ▼
              ┌─────────────────┐
              │ Node + Express  │
              │    Backend      │
              └───────┬─────────┘
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
      ┌─────────────┐   ┌─────────────┐
      │   MongoDB   │   │  Socket.IO  │
      │  Database   │   │  Real-Time  │
      └─────────────┘   └──────┬──────┘
                               │
                               ▼
                       👤 OTHER USER
```

---

# ⚡ Socket.IO Real-Time Events

The application uses Socket.IO for real-time communication.

Important events include:

```text
userOnline
onlineUsers
receiveMessage
userTyping
userStoppedTyping
messageRead
messageDeleted
chatCleared
```

These events help users receive updates instantly without refreshing the page.

---

# 🖼️ Image Upload System

The project uses **Multer** for handling image uploads.

Users can:

```text
📷 Upload Profile Photo
        ↓
🗄️ Save Image Path
        ↓
🍃 MongoDB
        ↓
👤 Display Profile Photo
```

Users can also remove their profile photo.

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/07-arpita/Online-Message-Chatting-System.git
```

## 2. Open Project

```bash
cd Online-Message-Chatting-System
```

---

# 🟢 Backend Setup

Go to Backend folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start backend:

```bash
node server.js
```

Backend will run on:

```text
http://localhost:5000
```

---

# ⚛️ Frontend Setup

Open another terminal.

Go to Frontend:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start React application:

```bash
npm run dev
```

Frontend will normally run on:

```text
http://localhost:5173
```

---

# 🔌 API Routes

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

## Users

```text
GET    /api/users
PUT    /api/users/update/:id

PUT    /api/users/profile-image/:id
DELETE /api/users/profile-image/:id

PUT    /api/users/change-password/:id
DELETE /api/users/:id
```

## Messages

```text
POST   /api/messages/send
GET    /api/messages
PUT    /api/messages/read

DELETE /api/messages/clear
DELETE /api/messages/:id
```

---

# 🔒 Security

The project uses `.gitignore` to keep sensitive and unnecessary files away from GitHub.

```text
node_modules/
.env
uploads/
dist/
```

⚠️ Never upload your real MongoDB credentials or other secret information to GitHub.

---

# 🎯 Project Objectives

The main objectives of this project are:

- Learn MERN Stack development
- Understand React components
- Build REST APIs
- Work with MongoDB
- Implement Socket.IO
- Understand real-time communication
- Handle image uploads
- Practice frontend-backend integration
- Build a complete portfolio project
- Understand CRUD operations

---

# 🚀 Future Improvements

Some possible future improvements:

- 🔐 JWT Authentication
- 🔒 Password Hashing
- 👥 Group Chat
- 🎙️ Voice Messages
- 📹 Video Calling
- 🔔 Push Notifications
- 📱 Better Mobile Responsiveness
- ☁️ Cloud Image Storage
- 🚀 Online Deployment
- 🔎 Message Search
- 👤 Advanced Privacy Controls

---

# 📸 Screenshots

You can add your project screenshots here.

Example:

```markdown
![Login Page](screenshots/login.png)

![Chat Page](screenshots/chat.png)

![Profile Page](screenshots/profile.png)

![Settings](screenshots/settings.png)
```

---

# 👩‍💻 Developer

## Arpita Mishra

**B.Tech CSE Student | MERN Stack Learner**

### Skills

- 💻 Java
- 🧠 DSA
- ⚛️ React
- 🟢 Node.js
- 🚂 Express.js
- 🍃 MongoDB
- 🌐 HTML
- 🎨 CSS
- 🐍 Python
- 🔧 Git & GitHub

---

# ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub.

---

<div align="center">

## 💬 Online Message Chatting System

### Built with ❤️ using MERN + Socket.IO

### 🚀 Happy Coding!

</div>
