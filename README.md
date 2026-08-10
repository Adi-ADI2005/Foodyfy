# 🍔 Foodify

> **“Delicious Food. Delivered Simply.”**

A modern **MERN Stack food-delivery web application** for discovering food, managing a cart, placing orders, making online payments, and tracking order status in real time.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Foodify-success?style=for-the-badge)](https://foodyfyapplication.web.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Adi-ADI2005/Foodyfy)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

---

## 

## 🌐 Live Demo

<div align="center">

<a href="https://foodyfyapplication.web.app/" target="_blank">
  <img src="https://img.shields.io/badge/🚀%20Visit%20Foodyfy-Live%20Demo-ff6b35?style=for-the-badge&logo=firebase&logoColor=white" />
</a>

</div>

---

## 📌 Overview

**Foodify** is a full-stack food-delivery platform built with the **MERN Stack**.

The application brings the major parts of an online food-ordering experience into one platform:

- 🍔 Food discovery and browsing
- 🔍 Search and filtering
- 🛒 Cart management
- 💳 Online payments
- 📦 Order placement
- 🧾 Order history
- 🚚 Order tracking
- 🔔 Real-time updates and notifications
- 👤 Authentication and profiles
- 🛡️ Protected routes
- 📊 Admin management
- ☁️ Cloud-based image uploads

The project was built to gain practical experience in developing a real-world full-stack application from frontend to backend, database, payment integration, cloud storage, and real-time communication.

---

## ✨ Features

### 👤 User Features

- User registration and login
- JWT-based authentication
- Profile management
- Protected user routes
- Browse food items
- Search and filtering
- Add items to cart
- Update cart quantities
- Remove items from cart
- Checkout
- Online payment
- Order history
- Order details
- Order-status tracking
- Real-time order updates

### 🛒 Cart & Checkout

```text
Browse Food
     ↓
Select Food
     ↓
Add to Cart
     ↓
Update Quantity
     ↓
Review Cart
     ↓
Checkout
     ↓
Payment
     ↓
Order Confirmation
```

### 📦 Order Management

Users can view and monitor:

- Ordered food items
- Order total
- Payment status
- Order status
- Order history
- Real-time status changes

### 🔔 Real-Time Communication

Foodify uses **Socket.io** to support real-time communication, particularly for order-status updates and notifications.

### 👨‍💼 Admin Features

Administrators can manage:

- 🍔 Food items
- 📂 Food categories
- 📦 Orders
- 👥 Users
- 💳 Payment information/status
- 🖼️ Food images

### ☁️ Cloudinary

Cloudinary can be used for uploading and managing food images without storing large media files directly in the application server.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript/JSX, Redux Toolkit, React Router, Axios, CSS |
| Backend | Node.js, Express.js, REST APIs, JWT, Socket.io |
| Database | MongoDB, Mongoose, MongoDB Atlas |
| Media | Cloudinary |
| Payments | Stripe / Razorpay |
| Deployment | Firebase, Vercel, Render / Railway |
| Development | Git, GitHub, Postman |

---

## 🏗️ Architecture

```text
                   ┌──────────────────┐
                   │      User        │
                   └────────┬─────────┘
                            │
                            ▼
                ┌──────────────────────┐
                │ React + Vite Client  │
                │ Redux Toolkit / JSX  │
                └──────────┬───────────┘
                           │
                     REST / HTTP
                           │
                           ▼
                ┌──────────────────────┐
                │ Node + Express API   │
                └───────┬───────┬──────┘
                        │       │
             ┌──────────┘       └──────────┐
             ▼                             ▼
      ┌──────────────┐              ┌──────────────┐
      │   MongoDB    │              │   Socket.io  │
      │  Mongoose    │              │  Real-time   │
      └──────────────┘              └──────────────┘
             │
             ▼
      ┌──────────────┐
      │  Cloudinary  │
      └──────────────┘
             │
             ▼
      ┌──────────────┐
      │ Stripe /     │
      │ Razorpay     │
      └──────────────┘
```

---

## 📂 Project Structure

```text
Foodyfy/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── .env
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   │   └── socketServer.js
│   ├── services/
│   ├── utils/
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── docs/
│   └── screenshots/
│
├── .gitignore
├── LICENSE
├── README.md
└── PROJECT_OVERVIEW.md
```

> The structure above documents the intended organization based on the project reference. Keep it synchronized with the actual repository if files are added or renamed.

---

## ⚙️ Getting Started

### Prerequisites

Install the following before running Foodify:

- Node.js
- npm
- MongoDB / MongoDB Atlas account
- Git

For payment and image features, configure the required payment and Cloudinary credentials.

### 1. Clone the Repository

```bash
git clone https://github.com/Adi-ADI2005/Foodyfy.git
cd Foodyfy
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

Create/configure the frontend `.env` file according to the variables expected by the application.

Start the frontend:

```bash
npm run dev
```

### 3. Install Backend Dependencies

Open a second terminal:

```bash
cd server
npm install
```

Create/configure the backend `.env` file with the required:

- MongoDB connection string
- JWT secret
- Cloudinary credentials
- Payment gateway credentials
- Frontend/client URL
- Other application-specific secrets

Start the backend:

```bash
npm run dev
```

or:

```bash
npm start
```

---

## 🔐 Environment Variables

Do **not** commit `.env` files or secret credentials to GitHub.

Typical backend configuration may include:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

PAYMENT_SECRET_KEY=your_payment_secret
CLIENT_URL=http://localhost:5173
```

Use the exact variable names required by the implementation in your repository.

---

## 🔄 Application Flow

```text
           ┌───────────────┐
           │ Visit Foodify │
           └───────┬───────┘
                   ▼
           ┌───────────────┐
           │ Browse/Search │
           └───────┬───────┘
                   ▼
           ┌───────────────┐
           │ Select Food   │
           └───────┬───────┘
                   ▼
           ┌───────────────┐
           │   Add Cart    │
           └───────┬───────┘
                   ▼
           ┌───────────────┐
           │   Checkout    │
           └───────┬───────┘
                   ▼
           ┌───────────────┐
           │    Payment    │
           └───────┬───────┘
                   ▼
           ┌───────────────┐
           │ Create Order  │
           └───────┬───────┘
                   ▼
           ┌───────────────┐
           │ Track Order   │
           └───────┬───────┘
                   ▼
           ┌───────────────┐
           │    Complete   │
           └───────────────┘
```

---

## 🔐 Authentication

```text
Register / Login
       ↓
Express API
       ↓
Credential Validation
       ↓
JWT Token
       ↓
Authenticated User
       ↓
Protected Routes
```

JWT is used to authenticate users and protect application resources.

---

## 🌐 API Areas

The backend is organized around REST APIs for major application modules:

```text
Authentication
/api/auth/*

Food
/api/foods/*

Categories
/api/categories/*

Orders
/api/orders/*

Users
/api/users/*

Payments
/api/payments/*
```

Exact endpoints should be checked against the current backend implementation.

---

## 🗄️ Core Data Model

### User

```text
User
├── name
├── email
├── password
├── profile information
├── role
├── createdAt
└── updatedAt
```

### Food

```text
Food
├── name
├── description
├── category
├── price
├── image
├── availability
├── createdAt
└── updatedAt
```

### Order

```text
Order
├── user
├── items
├── totalAmount
├── paymentStatus
├── orderStatus
├── delivery/order information
├── createdAt
└── updatedAt
```

---

## 🧪 Testing

Recommended tools and testing areas:

- Postman
- Thunder Client
- Browser
- Frontend integration

Test the major flows:

```text
✓ Registration
✓ Login
✓ Protected routes
✓ Food listing
✓ Search/filter
✓ Cart operations
✓ Checkout
✓ Payment
✓ Order creation
✓ Order history
✓ Order status
✓ Admin operations
```

---

## 📸 Screenshots

Place screenshots in:

```text
docs/screenshots/
```

Suggested files:

```text
home.png
foods.png
food-details.png
cart.png
checkout.png
orders.png
admin-dashboard.png
```

Then add them to this README:

```markdown
## 🏠 Home

![Home](docs/screenshots/home.png)

## 🍔 Food Listing

![Food Listing](docs/screenshots/foods.png)

## 🛒 Cart

![Cart](docs/screenshots/cart.png)

## 📦 Orders

![Orders](docs/screenshots/orders.png)

## 📊 Admin Dashboard

![Admin Dashboard](docs/screenshots/admin-dashboard.png)
```

---

## 🚀 Deployment

The project reference includes deployment with services such as:

- Firebase
- Vercel
- Render
- Railway
- MongoDB Atlas

The current live frontend is hosted at:

https://foodyfyapplication.web.app/

---

## 🔒 Security Practices

Foodify uses:

- JWT authentication
- Protected routes
- Role-based authorization
- Middleware
- Environment variables
- Backend validation
- Restricted admin operations
- Error handling

Never commit:

```text
.env
API keys
Database credentials
JWT secrets
Payment secrets
Cloudinary secrets
```

---

## 🚀 Future Enhancements

- 📍 Live delivery tracking
- 🔔 Push notifications
- ⭐ Food reviews and ratings
- 🎟️ Coupon and discount system
- 📊 Advanced analytics
- 🤖 AI food recommendations
- 📱 Mobile application
- 🗺️ Map-based delivery integration
- 🐳 Docker
- ⚙️ CI/CD pipeline

---

## 🎯 Learning Outcomes

Building Foodify provided practical experience with:

- React and Vite
- Redux Toolkit
- REST API architecture
- Node.js and Express.js
- MongoDB and Mongoose
- JWT authentication
- Payment integration
- Socket.io
- Cloudinary
- Full-stack application deployment
- Git and GitHub

---

## 👨‍💻 Developer

### Aditya Mishra

**B.Tech Computer Science & Engineering**  
**Specialization: Artificial Intelligence & Machine Learning**

Interested in:

- Artificial Intelligence
- Machine Learning
- Deep Learning
- Full-Stack Development
- MERN Stack
- Python
- React.js
- Node.js
- Backend Development
- Database Systems

---

## 📄 License

This project is licensed under the **MIT License**.

---

## ⭐ Support the Project

If you find Foodify useful:

- ⭐ Star the repository
- 🍴 Fork the repository
- 🐛 Report issues
- 💡 Suggest improvements
- 🤝 Contribute

---

## ❤️ Thank You

Thank you for visiting **Foodify**.

> **🍔 Foodify — Delicious Food. Delivered Simply.**

**Built with ❤️ by Aditya Mishra**
