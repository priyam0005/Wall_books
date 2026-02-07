# 📚 Wallbooks

<div align="center">
  <img src="frontend/public/logo.png" alt="Wallbooks Logo" width="120"/>
  
  ### Share Your Thoughts, Display Your Wall
  
  A modern social platform where your thoughts come alive on a beautiful digital wall.
  
  [![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://your-vercel-url.vercel.app)
  [![Backend](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge)](https://your-render-url.onrender.com)
  [![License](https://img.shields.io/badge/license-ISC-blue?style=for-the-badge)](LICENSE)
</div>

---

## 🌟 About

**Wallbooks** is a minimalist social platform that reimagines how we share thoughts online. Instead of endless scrolling feeds, your posts are beautifully displayed as cards on a wall - making every thought feel special and intentional.

Whether it's a fleeting idea, a profound realization, or just a casual "hello" - Wallbooks gives your thoughts the canvas they deserve.

---

## ✨ Features

- 🎨 **Beautiful Wall Display** - Your thoughts displayed as elegant cards
- 👤 **User Profiles** - Personalized profiles with bio and avatar
- 🎭 **Theme Customization** - Multiple color themes to match your mood
- 💬 **Real-time Messaging** - Connect and chat with other users
- 🔍 **Advanced Search** - Find people by display name or username
- 👥 **Friend System** - Build your network and see friends' thoughts
- 🔔 **Notifications** - Stay updated with interactions
- 🌓 **Dark Mode** - Sleek dark interface for comfortable viewing
- 📱 **Responsive Design** - Beautiful on all devices

---

## 🛠️ Tech Stack

### Frontend
- **React** (v18.2.0) - UI library
- **React Router DOM** (v6.9.4) - Navigation
- **Redux Toolkit** (v2.9.1) - State management
- **Tailwind CSS** (v3.4.18) - Styling
- **Vite** (v7.1.11) - Build tool
- **Axios** (v1.12.2) - HTTP client
- **React Icons** (v5.5.0) - Icon library
- **Framer Motion** (v12.23.24) - Animations

### Backend
- **Node.js** - Runtime environment
- **Express** (v5.1.0) - Web framework
- **MongoDB** (v6.10.0) - Database
- **Mongoose** (v0.18.0) - ODM
- **Socket.io** (v4.8.1) - Real-time communication
- **JWT** - Authentication
- **Bcrypt** (v3.0.2) - Password hashing
- **Passport.js** - Authentication middleware
- **Dotenv** (v17.2.1) - Environment variables

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB account (for database)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/priyam0005/Wall_books.git
cd Wall_books
```

2. **Setup Backend**
```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

### Running Locally

1. **Start Backend Server**
```bash
cd Backend
npm run dev
```

2. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to see the app in action!

---

## 📁 Project Structure

```
Wall_books/
├── Backend/
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── node_modules/      # Dependencies
│   ├── routes/           # API routes
│   ├── schemas/          # Mongoose schemas
│   ├── services/         # Business logic
│   ├── utility/          # Helper functions
│   ├── app.js           # Express app setup
│   ├── package.json     # Backend dependencies
│   └── .env             # Environment variables
│
├── frontend/
│   ├── node_modules/     # Dependencies
│   ├── public/          # Static assets
│   ├── src/             # Source files
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   └── App.jsx      # Main app component
│   ├── package.json     # Frontend dependencies
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 🎯 Usage

1. **Sign Up / Sign In** - Create an account or log in
2. **Create Your Profile** - Add a bio and avatar
3. **Share Thoughts** - Post your thoughts to the wall
4. **Explore** - Discover other users and their thoughts
5. **Connect** - Add friends and start conversations
6. **Customize** - Choose your favorite theme
7. **Engage** - Like and comment on posts

---

## 🖼️ Screenshots

### Home Wall
![Home Wall](screenshots/home.png)

### User Profile
![Profile](screenshots/profile.png)

### Explore Page
![Explore](screenshots/explore.png)

---

## 🔑 Key Features Explained

### Wall Display
Your thoughts are displayed as beautiful cards with timestamps and user information, creating a visually appealing and organized view.

### Theme Customization
Choose from multiple color themes (Green, Blue, Purple, Orange, Pink) to personalize your experience.

### Real-time Messaging
Built with Socket.io for instant message delivery and real-time updates.

### Advanced Search
Search for users by display name or username, with filters for blog entries, forum topics, groups, and layouts.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Priyam Pathak**

- GitHub: [@priyam0005](https://github.com/priyam0005)
- Project Link: [https://github.com/priyam0005/Wall_books](https://github.com/priyam0005/Wall_books)

---

## 🙏 Acknowledgments

- Inspired by the desire to make sharing thoughts more meaningful
- Built with modern web technologies and best practices
- Special thanks to the open-source community

---

<div align="center">
  
### ⭐ If you like this project, please give it a star!

**Designed and Managed by PRIYAM PATHAK**

Made with ❤️ using MERN Stack

</div>
