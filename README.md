# **Lifestyle Preferences Survey Application**

![Project Banner](https://via.placeholder.com/1200x400?text=Lifestyle+Survey+App)

A **full-stack web application** designed to collect, analyze, and visualize lifestyle preference data through an interactive survey and analytics dashboard.

---

## 🧭 **Table of Contents**

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [Configuration](#configuration)
* [API Documentation](#api-documentation)
* [Project Structure](#project-structure)
* [Development](#development)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [License](#license)

---

## ✨ **Features**

### 📝 Survey Form

* Multi-step form with real-time validation
* Mobile-friendly, fully responsive UI
* Progress tracking and completion state
* Clear error messages and success feedback
* Option to submit multiple surveys

### 📊 Results Dashboard

* Real-time analytics powered by Chart.js
* Demographics and food preference insights
* Average ratings with visual charts
* Filterable tabs for overview, demographics, and preferences

---

## 🧰 **Tech Stack**

### **Frontend**

| Technology          | Purpose                          |
| ------------------- | -------------------------------- |
| **React**           | Component-based UI framework     |
| **Tailwind CSS**    | Utility-first CSS styling        |
| **Axios**           | API communication                |
| **React Hook Form** | Simplified form state management |

### **Backend**

| Technology     | Purpose                          |
| -------------- | -------------------------------- |
| **Node.js**    | Server runtime                   |
| **Express.js** | REST API framework               |
| **Prisma ORM** | Database management              |
| **SQLite**     | Lightweight, file-based database |

---

## ⚙️ **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/jackson951/surveying-app.git
   cd surveying-app
   ```

2. **Install dependencies**

   ```bash
   # For both frontend and backend
   npm run setup

   # Or separately:
   cd client && npm install
   cd ../server && npm install
   ```

3. **Configure environment variables**
   (see [Configuration](#configuration) below)

4. **Run the application**

   ```bash
   npm run dev
   ```

---

## 🔐 **Configuration**

Create the following `.env` files:

### **server/.env**

```
PORT=5000
DATABASE_URL="file:./survey.db"
NODE_ENV=development
```

### **client/.env**

```
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

---

## 📡 **API Documentation**

**Base URL:**

```
http://localhost:5000/api
```

### **Endpoints**

| Endpoint   | Method | Description                       |
| ---------- | ------ | --------------------------------- |
| `/surveys` | `POST` | Submit a new survey               |
| `/results` | `GET`  | Fetch aggregated survey analytics |
| `/health`  | `GET`  | Check API health status           |

### **Sample Request – POST `/api/surveys`**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "dob": "1993-05-15",
  "favoriteFoods": ["Pizza", "Pasta"],
  "eatOutRating": 4,
  "watchMoviesRating": 5,
  "watchTVRating": 3,
  "listenToRadioRating": 2
}
```

### **Sample Response – GET `/api/results`**

```json
{
  "total": 42,
  "avgAge": 28.4,
  "foodPreferences": {
    "pizza": 45.2,
    "pasta": 35.7,
    "papAndWors": 19.1
  },
  "averageRatings": {
    "eatOut": 4.2,
    "movies": 4.5,
    "tv": 3.1,
    "radio": 2.8
  }
}
```

---

## 🗂️ **Project Structure**

```
surveying-app/
├── client/                # React frontend
│   ├── src/               # Components, pages, and charts
│   └── package.json
│
├── server/                # Express + Prisma backend
│   ├── controllers/       # API controllers
│   ├── routes/            # Route definitions
│   ├── prisma/            # Prisma schema and client
│   ├── index.js           # Server entry point
│   └── package.json
│
├── package.json           # Root scripts and setup
└── README.md
```

---

## 🧑‍💻 **Development**

**Available Scripts**

```bash
# Install all dependencies
npm run setup

# Start both client and server concurrently
npm run dev

# Run tests
npm test

# Build frontend for production
npm run build
```

---

## 🚀 **Deployment**

### 🐳 Docker (Recommended)

```bash
docker-compose up --build
```

### Manual Deployment

1. **Build frontend**

   ```bash
   npm run build
   ```

2. **Start backend**

   ```bash
   cd server && npm start
   ```

---

## 🤝 **Contributing**

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

---

Would you like me to include a **diagram (image)** showing how the frontend and backend interact (API flow + Prisma database)?
It would make the README even clearer for presentation or GitHub viewers.
