# 🍔 Foodyfy — Full Stack MERN Food Delivery Application

A modern Full Stack Food Delivery Web Application built using the MERN Stack.

## Features
- User Authentication
- Food Ordering System
- Cart & Checkout
- Admin Dashboard
- Real-Time Updates with Socket.io
- Redux Toolkit State Management
- Cloudinary Image Upload
- Responsive UI

## Tech Stack
Frontend:
- React.js
- Vite
- Redux Toolkit
- CSS

Backend:
- Node.js
- Express.js
- MongoDB
- JWT
- Socket.io
  Folder Structure:
  ~~~
  FOOD-DELIVERY-APP/
│
├── client/                     # Frontend React App
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── FoodCard/
│   │   │   ├── Footer/
│   │   │   ├── IntroAnimation/
│   │   │   ├── Loader/
│   │   │   └── Navbar/
│   │   │
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   ├── Cart/
│   │   │   ├── Checkout/
│   │   │   ├── FoodDetails/
│   │   │   ├── Home/
│   │   │   ├── Login/
│   │   │   ├── Orders/
│   │   │   ├── Profile/
│   │   │   ├── Register/
│   │   │   └── Support/
│   │   │
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   └── store.js
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend Express Server
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── foodController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── userController.js
│   │
│   ├── middlewares/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   ├── routes/
│   ├── socket/
│   │   └── socketServer.js
│   │
│   ├── .env
│   ├── config.js
│   ├── db.js
│   ├── index.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
└── README.md

## Installation

### Clone Repository
git clone: [https://github.com/your-username/foodyfy.git](https://github.com/Adi-ADI2005/Foodyfy)

### Install Backend
cd server
npm install

### Install Frontend
cd client
npm install

## Run Application

### Start Backend
cd server
npm run dev

### Start Frontend
cd client
npm run dev

## Environment Variables

### Server .env
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

### Client .env
VITE_API_URL=http://localhost:8000/api

## Folder Structure
client/  -> Frontend React App
server/  -> Backend Express Server

## Future Improvements
- AI Recommendation
- Live Tracking
- Push Notifications
- PWA Support

## License
MIT License
