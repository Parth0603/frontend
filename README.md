# Syntra - Full Stack Web Application with WebRTC

A complete full-stack web application with React frontend and Node.js backend, featuring real-time video communication, screen sharing, and interactive teaching tools.

## Features

- **Frontend**: React + Vite with modern UI components
- **Backend**: Node.js + Express REST API with Socket.IO
- **WebRTC**: Real-time video, audio, and screen sharing
- **Teaching Tools**: Interactive whiteboard, chat, attendance, and assessments
- **Storage**: In-memory user storage
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Security**: CORS, input validation, and protected routes

## Quick Start

### Prerequisites
- Node.js (v16 or higher)

### Easy Setup (Windows)
1. Run `start-webrtc-dev.bat` - This will install all dependencies and start both servers with WebRTC support
2. Alternative: Run `start-dev.bat` for basic setup without WebRTC enhancements

### Manual Setup
1. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```

4. **Start Frontend Server** (in new terminal):
   ```bash
   npm run dev
   ```

## Application URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Teaching Zone Features

### For Teachers
- **HD Video & Audio**: Real-time communication with students
- **Screen Sharing**: Share your screen seamlessly with WebRTC
- **Interactive Whiteboard**: Draw and annotate in real-time
- **Student Management**: Control audio/video, view raised hands
- **Live Chat**: Communicate via text messages
- **Attendance Tracking**: Automatic attendance marking
- **Assessment Tools**: Create and manage quizzes
- **File Sharing**: Upload and share notes/documents
- **Session Recording**: Record teaching sessions

### For Students
- **Join with Meeting ID**: Easy access to teaching sessions
- **Video Participation**: Enable camera and microphone
- **Screen Viewing**: See teacher's screen share in real-time
- **Raise Hand**: Digital hand raising for questions
- **Interactive Chat**: Participate in class discussions
- **Auto Attendance**: Automatic attendance marking
- **Download Notes**: Access shared materials
- **Whiteboard Access**: View and interact with whiteboard

## Authentication
- Register new accounts or login with existing credentials
- JWT tokens are stored in localStorage
- Protected routes require authentication
- Test mode available for quick access

## Project Structure
```
├── src/                 # Frontend React app
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API integration
│   └── styles/         # CSS files
├── backend/            # Backend Node.js app
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Auth & validation
│   ├── models/         # In-memory storage
│   └── routes/         # API routes
└── public/             # Static assets
```
