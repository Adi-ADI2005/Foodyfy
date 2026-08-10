# 🍔 Foodify

> **“Delicious Food. Delivered Simply.”**
>
> A modern full-stack food delivery platform built to make discovering food, ordering meals, making payments, and tracking orders simple and convenient.

---

# 📌 Project Overview

## 🍽️ About the Project

**Foodify** is a full-stack MERN food-delivery web application designed to provide a complete digital platform for customers, restaurants/food management, and administrators.

The main goal of Foodify is to simplify the food-ordering process by bringing **food discovery, search, cart management, checkout, online payment, order history, order tracking, user management, and administration** into one centralized platform.

The application provides:

- 🍔 Food browsing
- 🔍 Search and filtering
- 🛒 Shopping cart
- 💳 Online payment
- 📦 Order placement and history
- 🚚 Order tracking
- 👤 User authentication and profiles
- 🔔 Real-time order updates and notifications
- 🛡️ Protected routes and access control
- 📊 Admin dashboard
- 🥗 Food and category management
- 👥 User management
- 📱 Responsive interface

Foodify is developed as a practical **MERN Stack full-stack project**, using React on the frontend, Node.js and Express.js on the backend, and MongoDB for data management.

---

# ✨ Key Features

## 🍔 Food Browsing

Users can explore available food items and view:

- Food name
- Category
- Description
- Price
- Food images
- Availability

## 🔍 Search & Filter

Users can quickly discover suitable food using search and filtering functionality.

## 🛒 Shopping Cart

Users can:

- Add food items to the cart
- Update quantities
- Remove items
- Review cart contents
- Calculate the order total

## 💳 Checkout & Online Payment

The checkout flow supports:

- Customer/order information
- Order summary
- Total amount calculation
- Online payment integration
- Payment status handling

Payment gateway support includes **Stripe/Razorpay**, depending on the configured project environment.

## 📦 Orders

Users can:

- Place orders
- View order history
- Check order details
- Track order status
- Receive real-time updates

## 👤 Authentication & Profile

Users can:

- Register
- Login
- Logout
- Manage their profile
- Access protected features
- View their orders

Authentication is implemented using **JWT**.

## 🔔 Real-Time Updates

**Socket.io** is used for real-time communication such as order-status updates and notifications.

## 🛡️ Admin Dashboard

Administrators can manage:

### 🍔 Food Management
- Add food items
- Update food details
- Delete food items
- Upload food images
- Manage availability

### 📂 Category Management
- Create and manage food categories
- Organize food items

### 📦 Order Management
- View orders
- Monitor order status
- Update order status
- Track order activity

### 👥 User Management
- View registered users
- Manage user accounts
- Monitor customer activity

### 💳 Payment Management
- Monitor payment information and status

## ☁️ Image Management

**Cloudinary** can be used for food-image uploads and cloud-based media storage.

## 📱 Responsive Design

The application is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile

---

# 🛠️ Technology Stack

## 🎨 Frontend

- React.js
- Vite
- JavaScript / JSX
- Redux Toolkit
- React Router
- Axios
- CSS

## ⚙️ Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- Middleware
- Socket.io

## 🗄️ Database

- MongoDB
- Mongoose
- MongoDB Atlas

## ☁️ Additional Services

- Cloudinary
- Stripe / Razorpay
- Git
- GitHub
- Firebase
- Vercel
- Render / Railway

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   React + Vite      │
                         │ Redux Toolkit / JSX │
                         └──────────┬──────────┘
                                    │
                              HTTP / REST API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Node.js + Express   │
                         │     Backend API     │
                         └───────┬─────┬───────┘
                                 │     │
                    ┌────────────┘     └──────────────┐
                    ▼                                 ▼
             ┌──────────────┐                  ┌──────────────┐
             │   MongoDB    │                  │  Socket.io   │
             │  + Mongoose  │                  │ Real-time    │
             └──────────────┘                  └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │  Cloudinary  │
             │    Images    │
             └──────────────┘

                 External Services
                       │
              ┌────────┴────────┐
              ▼                 ▼
        Payment Gateway     Deployment
        Stripe/Razorpay     Firebase/Vercel
                            Render/Railway
```

---

# 📂 Project Structure

```text
FOODYFY/
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

---

# 🔄 Application Workflow

```text
User Visits Foodify
        │
        ▼
Browse Food
        │
        ▼
Search / Filter
        │
        ▼
Select Food
        │
        ▼
Add to Cart
        │
        ▼
Review Cart
        │
        ▼
Checkout
        │
        ▼
Online Payment
        │
        ▼
Order Created
        │
        ▼
Real-Time Order Tracking
        │
        ▼
Order Completed
```

---

# 🔐 Authentication Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Backend API
 │
 ▼
Validate Credentials
 │
 ├───────────────┐
 │               │
 ▼               ▼
Invalid         Valid
 │               │
 ▼               ▼
Error          JWT Token
                 │
                 ▼
        Authenticated Session
                 │
                 ▼
          Protected Routes
```

---

# 📦 Order Workflow

```text
Select Food
    │
    ▼
Add to Cart
    │
    ▼
Review Cart
    │
    ▼
Checkout
    │
    ▼
Payment
    │
    ▼
Create Order
    │
    ▼
Order Confirmation
    │
    ▼
Real-Time Status Updates
    │
    ▼
Order Delivered / Completed
```

---

# 🗄️ Database Structure

## 👤 User

```text
User
│
├── name
├── email
├── password
├── profile information
├── role
├── createdAt
└── updatedAt
```

## 🍔 Food

```text
Food
│
├── name
├── description
├── category
├── price
├── image
├── availability
├── createdAt
└── updatedAt
```

## 📦 Order

```text
Order
│
├── user
├── items
├── totalAmount
├── paymentStatus
├── orderStatus
├── delivery/order information
├── createdAt
└── updatedAt
```

> The exact schema can vary with the implementation in the repository.

---

# 🔗 Core Relationships

```text
                ┌──────────────┐
                │     User     │
                └──────┬───────┘
                       │
                       │ 1 : *
                       ▼
                ┌──────────────┐
                │    Order     │
                └──────┬───────┘
                       │
                       │ contains
                       ▼
                ┌──────────────┐
                │ Food / Items │
                └──────────────┘
```

A user can place multiple orders.

An order can contain multiple food items.

---

# 🌐 API Architecture

Foodify follows a REST API architecture for communication between the React frontend and Express backend.

Typical API areas include:

```text
/api/auth/*
/api/foods/*
/api/categories/*
/api/orders/*
/api/users/*
/api/payments/*
```

The exact endpoint names depend on the implementation in the repository.

---

# ⚙️ Installation Guide

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Adi-ADI2005/Foodyfy.git
cd Foodyfy
```

## 2️⃣ Frontend Setup

```bash
cd client
npm install
```

Configure the frontend environment variables according to the project configuration, then start the development server:

```bash
npm run dev
```

## 3️⃣ Backend Setup

Open another terminal:

```bash
cd server
npm install
```

Configure the backend `.env` file with the required database, authentication, cloud storage, payment, and frontend URL settings.

Then start the backend:

```bash
npm run dev
```

or:

```bash
npm start
```

> ⚠️ Never upload `.env` files containing passwords, tokens, database credentials, or API keys to GitHub.

---

# 🧪 Testing

Backend APIs can be tested using:

- Postman
- Thunder Client
- Browser
- Frontend integration

Important areas to test include:

```text
Authentication
Food Management
Cart
Checkout
Payments
Orders
Order Status
Admin APIs
```

---

# 🛡️ Security

Foodify follows basic full-stack security practices:

- 🔐 JWT-based authentication
- 🛡️ Protected routes
- 👮 Role-based access control
- ✅ Backend request validation
- 🔑 Environment variables for secrets
- 🚫 Restricted administrative APIs
- 🧩 Middleware-based authorization
- ⚠️ Centralized error handling

---

# 📸 Screenshots

Add screenshots to:

```text
docs/screenshots/
```

Suggested screenshots:

```text
home.png
foods.png
food-details.png
cart.png
checkout.png
orders.png
admin-dashboard.png
```

Example:

```markdown
## 🏠 Home Page

![Home Page](docs/screenshots/home.png)

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

# 🚀 Future Enhancements

- 📍 Live delivery location tracking
- 🔔 Advanced push notifications
- ⭐ Food ratings and reviews
- 🎟️ Coupons and discount management
- 📊 Advanced sales and revenue analytics
- 🤖 AI-powered food recommendations
- 📱 Dedicated mobile application
- 🗺️ Map and delivery-route integration
- 🐳 Docker support
- ⚙️ CI/CD automation

---

# 🎯 Project Objectives

1. Build a complete digital food-ordering platform.
2. Simplify food discovery and ordering.
3. Provide a convenient cart and checkout experience.
4. Support online payments.
5. Provide order history and tracking.
6. Provide real-time order updates.
7. Give administrators centralized control.
8. Practice production-oriented MERN Stack development.

---

# 💡 Why I Built Foodify

I developed **Foodify** as a practical full-stack project to understand how a real-world food-delivery platform works from end to end.

While building this project, I worked with:

- Frontend architecture
- REST API development
- MongoDB database design
- Authentication and authorization
- Redux state management
- Cart and order logic
- Payment integration
- Real-time communication
- Cloud image management
- Admin management
- Deployment

This project helped me understand how modern frontend, backend, database, payment, cloud, and real-time technologies can work together as one complete application.

---

# 📚 Learning Outcomes

Through Foodify, I strengthened my understanding of:

```text
React + Vite
    ↓
Redux Toolkit
    ↓
REST API
    ↓
Node.js + Express.js
    ↓
MongoDB + Mongoose
    ↓
JWT Authentication
    ↓
Payment Integration
    ↓
Socket.io
    ↓
Cloudinary
    ↓
Deployment
```

---

# 🌐 Live Project

**Live Application:**  
https://foodyfyapplication.web.app/

**GitHub Repository:**  
https://github.com/Adi-ADI2005/Foodyfy

---

# 👨‍💻 Developed By

## Aditya Mishra

**B.Tech Computer Science & Engineering**  
**Specialization: Artificial Intelligence & Machine Learning**

### 💻 Interests

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

# 🌟 Vision

> **To make food discovery, ordering, payment, and delivery tracking simple and accessible through a modern digital platform.**

```text
🔎 Discover
    ↓
🍔 Choose
    ↓
🛒 Add to Cart
    ↓
💳 Pay
    ↓
📦 Track
    ↓
😋 Enjoy
```

---

# 📜 License

This project is licensed under the **MIT License**.

---

# ⭐ Support

If you like **Foodify**:

- ⭐ Star the repository
- 🍴 Fork the project
- 🐛 Report bugs
- 💡 Suggest features
- 🤝 Contribute

---

# ❤️ Thank You

Thank you for checking out **Foodify**.

This project represents my practical experience in designing and developing a modern MERN Stack application with authentication, payments, real-time communication, cloud services, and database integration.

---

**🍔 Foodify — Delicious Food. Delivered Simply.**

**Built with ❤️ by Aditya Mishra**
