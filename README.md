# 💬 Online Message Chatting System

<div align="center">

# 🚀 Online Message Chatting System

### A Modern Real-Time Messaging Application

**Connect • Chat • Share • Customize • Stay Connected**

<br>

![MERN](https://img.shields.io/badge/MERN-Stack-61DAFB?style=for-the-badge)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?style=for-the-badge&logo=socket.io&logoColor=white)

</div>

---

## ✨ About The Project

**Online Message Chatting System** is a full-stack real-time messaging application developed using the **MERN Stack** and **Socket.IO**.

The application allows users to create accounts, log in, recover their password, communicate with other users in real time, send text and image messages, manage their profile, and customize their chatting experience.

The project focuses on understanding complete **frontend + backend + database + real-time communication** architecture.

---

# 🌟 Features

## 🔐 Authentication

- 📝 User Signup / Registration
- 🔑 User Login
- 🔐 Forgot Password
- 🔄 Reset Password
- 🚪 Logout
- 👤 Account Management

---

## 💬 Real-Time Chat

- ⚡ Real-time messaging using Socket.IO
- 🟢 Online / Offline status
- ⌨️ Typing Indicator
- ✓ Message status
- ✓✓ Read Receipts
- 🔢 Unread Message Count
- 🕒 Last Message Display
- 🕐 Message Time
- 🔍 Search Users
- ↵ Enter to Send
- 🗑️ Delete Individual Message
- 🧹 Clear Complete Chat

---

## 🖼️ Image & Profile Features

- 📷 Upload Profile Picture
- 🗑️ Remove Profile Picture
- 🖼️ Send Images in Chat
- 👤 Profile Page
- ✏️ Edit Profile Name
- 🔐 Change Password
- 🗑️ Delete Account

---

## 🎨 Chat Customization

- 🌙 Dark Mode
- ☀️ Light Mode
- 🖼️ Custom Chat Wallpaper
- 🔤 Small Font Size
- 🔤 Medium Font Size
- 🔤 Large Font Size
- 🔔 Notification Settings
- 🔒 Privacy Settings
- ✓✓ Read Receipt Settings
- ⌨️ Typing Indicator Settings
- 💬 Chat Settings

---

# 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| ⚛️ React.js | Frontend User Interface |
| ⚡ Vite | Frontend Development |
| 🟢 Node.js | Backend Runtime |
| 🚂 Express.js | Backend REST API |
| 🍃 MongoDB | Database |
| 📦 Mongoose | MongoDB ODM |
| 🔌 Socket.IO | Real-Time Communication |
| 📁 Multer | Image Upload |
| 🎨 CSS | Styling |
| 🛠️ VS Code | Development |
| 🔧 Git & GitHub | Version Control |

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
                  │      Vite       │
                  └────────┬────────┘
                           │
                    REST API / HTTP
                           │
                           ▼
                  ┌─────────────────┐
                  │ Node + Express  │
                  │     Backend     │
                  └───────┬─────────┘
                          │
                 ┌────────┴────────┐
                 │                 │
                 ▼                 ▼
          ┌─────────────┐   ┌─────────────┐
          │   MongoDB   │   │  Socket.IO  │
          │   Database  │   │ Real-Time   │
          └─────────────┘   └──────┬──────┘
                                   │
                                   ▼
                            👤 OTHER USER
```

---

# ⚡ Real-Time Communication

The application uses **Socket.IO** to provide real-time communication between connected users.

Important Socket.IO events include:

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

This allows messages, typing status, online status, read receipts, and chat changes to be reflected without manually refreshing the page.

---

# 🔐 Authentication Flow

```text
                ┌───────────────┐
                │    Signup     │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │     Login     │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │     Chat      │
                └───────────────┘


       If Password Is Forgotten

                ┌──────────────────┐
                │  Forgot Password │
                └─────────┬────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  Reset Password  │
                └─────────┬────────┘
                          │
                          ▼
                ┌──────────────────┐
                │      Login       │
                └──────────────────┘
```

---

# 💬 Chat Flow

```text
User selects another user
          │
          ▼
    Open Chat Window
          │
          ▼
    Type a Message
          │
          ▼
      Send Message
          │
          ▼
     Express API
          │
          ▼
       MongoDB
          │
          ▼
      Socket.IO
          │
          ▼
Other User receives message
```

---

# 🖼️ Image Upload System

The application uses **Multer** for handling image uploads.

### Profile Image Flow

```text
📷 Select Profile Photo
          │
          ▼
     FormData Upload
          │
          ▼
       Express API
          │
          ▼
        Multer
          │
          ▼
       uploads/
          │
          ▼
        MongoDB
          │
          ▼
     Profile Picture
```

Users can:

- 📷 Upload a profile picture
- 👤 View their profile picture
- 🔄 Update profile picture
- 🗑️ Remove profile picture

---

# 🎨 Chat Settings

The application provides several customization options.

### Appearance

```text
🌙 Dark Mode
☀️ Light Mode
```

### Font Size

```text
🔤 Small
🔤 Medium
🔤 Large
```

### Chat Customization

```text
🖼️ Chat Wallpaper
↵ Enter to Send
🔔 Chat Notifications
🗑️ Clear Chat
```

### Privacy

```text
🔒 Privacy
✓✓ Read Receipts
⌨️ Typing Indicator
```

---

# 🧹 Clear Chat

Users can clear the complete conversation with another user.

```text
Profile
   ↓
Chat Settings
   ↓
Clear Chat
   ↓
Confirmation
   ↓
Messages Deleted
   ↓
Chat Updated in Real-Time
```

---

# ✓✓ Read Receipts

Read receipts allow the application to update the status of messages when the receiver opens the conversation.

Example:

```text
✓   Sent

✓✓  Read
```

---

# ⌨️ Typing Indicator

When a user starts typing, the other user can see a typing indicator.

```text
User is typing...
```

This is implemented using Socket.IO events.

---

# 🔍 User Search

Users can search for other registered users using the search bar.

```text
Search User
     ↓
Filter Users
     ↓
Select User
     ↓
Open Chat
```

---

# 🔌 API Routes

## 🔐 Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

> Add your Forgot Password / Reset Password endpoints here if they are implemented in your current backend.

---

## 👤 Users

```text
GET    /api/users

PUT    /api/users/update/:id

PUT    /api/users/profile-image/:id

DELETE /api/users/profile-image/:id

PUT    /api/users/change-password/:id

DELETE /api/users/:id
```

---

## 💬 Messages

```text
POST   /api/messages/send

GET    /api/messages

PUT    /api/messages/read

DELETE /api/messages/clear

DELETE /api/messages/:id
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/07-arpita/Online-Message-Chatting-System.git
```

## 2️⃣ Open Project

```bash
cd Online-Message-Chatting-System
```

---

# 🟢 Backend Setup

Go to the Backend folder:

```bash
cd Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the Backend folder:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start the backend:

```bash
node server.js
```

Backend:

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

Start the frontend:

```bash
npm run dev
```

Frontend will normally run on:

```text
http://localhost:5173
```

---

# 🔒 Security & Git

The following files/folders are excluded using `.gitignore`:

```text
node_modules/
.env
uploads/
dist/
```

⚠️ Never upload your actual MongoDB connection string, passwords, API keys, or other private credentials to GitHub.

---

# 🎯 Project Objectives

The main objectives of this project are:

- 💻 Learn full-stack web development
- ⚛️ Understand React development
- 🟢 Learn Node.js and Express.js
- 🍃 Work with MongoDB
- 🔌 Implement real-time communication using Socket.IO
- 🔗 Understand REST API integration
- 📁 Handle image uploads
- 🔐 Build authentication features
- 🧩 Practice CRUD operations
- 🎨 Create a modern user interface
- 🚀 Build a complete portfolio project

---

# 📸 Screenshots

You can add screenshots of the project here.

### 🔐 Login

```markdown
![Login Page](screenshots/login.png)
```

### 📝 Signup

```markdown
![Signup Page](screenshots/signup.png)
```

### 💬 Chat

```markdown
![Chat Page](screenshots/chat.png)
```

### 👤 Profile

```markdown
![Profile Page](screenshots/profile.png)
```

### ⚙️ Settings

```markdown
![Settings](screenshots/settings.png)
```

---

# 🚀 Future Improvements

Possible future improvements include:

- 🔐 JWT Authentication
- 🔒 Password Hashing
- 👥 Group Chat
- 🎙️ Voice Messages
- 📹 Video Calling
- 🔔 Browser Push Notifications
- 📱 Improved Mobile Responsiveness
- ☁️ Cloud Image Storage
- 🚀 Production Deployment
- 🔎 Advanced Message Search
- 👤 Advanced Privacy Controls
- 🟢 Last Seen Feature

---

# 👩‍💻 Developer

## Arpita Mishra

**MERN Stack Learner**

### Skills

```text
HTML
CSS
React
Node.js
Express.js
MongoDB
Socket.IO
Git
GitHub
```

---

# ⭐ Support

If you like this project, please consider giving the repository a ⭐ on GitHub.

---

<div align="center">

# 💬 Online Message Chatting System

### Built with ❤️ using MERN + Socket.IO

### 🚀 Happy Coding!

</div>
