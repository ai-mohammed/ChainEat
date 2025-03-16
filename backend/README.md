# 🍽️ ChainEat Backend

This backend application is built using **Node.js**, **Express**, **MongoDB**, and provides a robust REST API for managing users, restaurants, reservations, and authentication in the ChainEat platform.

## 🚀 Features

- **User Authentication:** Register, Login, Logout with secure sessions.
- **Restaurant Management:** Admins can add, update, and delete restaurants.
- **Reservation System:** Customers can make reservations, admins manage them.
- **Input Validation:** Ensures correct data entry using express-validator.
- **Secure Routing:** Protected routes accessible based on user roles (customer, admin).

## 🛠 Technologies

- **Express.js**
- **MongoDB (with Mongoose)**
- **bcryptjs** for password hashing
- **express-session** for session handling
- **express-validator** for data validation
- **cors** for handling Cross-Origin requests

## 📂 Project Structure

```
├── controllers
│   ├── authController.js
|   ├── reservationController.js
|   ├── restaurantController.js
│   └── userController.js
├── models
│   ├── User.js
│   ├── Restaurant.js
│   └── Reservation.js
├── routes
│   ├── authRoutes.js
│   ├── restaurantRoutes.js
│   └── reservationRoutes.js
├── middlewares
│   └── authMiddleware.js
├── db.js
├── .env
└── server.js
```

## ⚙️ Installation

```bash
git clone 'https://github.com/ai-mohammed/ChainEat'
cd backend
npm install
```

## 🚦 Run the Server

```bash
npm start
```

Server runs at: [http://localhost:5000](http://localhost:5000)

## 📌 API Endpoints

| Method | Endpoint            | Description             | Access              |
| ------ | ------------------- | ----------------------- | ------------------- |
| POST   | `/auth/register`    | Register a new user     | Public              |
| POST   | `/auth/login`       | User login              | Public              |
| GET    | `/auth/logout`      | Logout user             | Authenticated       |
| POST   | `/restaurants/add`  | Add new restaurant      | Admin only          |
| POST   | `/reservations`     | Create new reservation  | Authenticated users |
| GET    | `/reservations/my`  | Get user's reservations | Authenticated users |
| GET    | `/reservations`     | Get all reservations    | Admin only          |
| PUT    | `/reservations/:id` | Update reservation      | Admin only          |
| DELETE | `/reservations/:id` | Delete reservation      | Admin only          |

## 🔐 Authentication

- Authentication handled via HTTP-only cookies.
- Routes protected using middleware: `isAuthenticated`, `isAdmin`.

## 🔑 Testing with PowerShell / Postman

Example PowerShell login request:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/auth/login" `
    -Method Post `
    -Headers @{ "Content-Type" = "application/json" } `
    -Body '{"email":"user@example.com", "password":"password"}' `
    -SessionVariable session
```

## 🛡️ Security

- Passwords hashed using `bcryptjs`.
- Sessions managed securely with HTTP-only cookies.
- CORS restricted to specific frontend domain.
