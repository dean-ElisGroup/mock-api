# Firebase-Backed Express API - Mock API's for Elis Services Mobile Application

This is a lightweight Node.js + Express backend API that connects to Firebase Realtime Database and supports basic authentication and article management. It is designed for integration with a Kotlin Android client (or any frontend) and deployed on [Railway](https://railway.app) or similar platforms.

---

## 📦 Features

- 🔐 **Login** with Firebase-stored users  
- 📄 **Retrieve articles** by `articleId`  
- 📍 **Find article by location barcode**  
- ✏️ **Update article stock quantities**  
- 🔥 **Firebase Realtime Database** integration

---

## 📁 Project Structure
├── index.js # Main Express server
├── firebase.js # Firebase config (admin SDK)
├── package.json
└── README.md
---

## 🚀 API Endpoints

### POST `/login`

Authenticates a user and returns a session key and profile info.

**Request Body**:

```json
{
  "username": "testuser",
  "password": "password123"
}
{
  "message": "Login successful",
  "sessionKey": "randomSessionKey",
  "firstname": "John",
  "surname": "Doe",
  "email": "john.doe@example.com"
}



