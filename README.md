# Lifestyle Preferences Survey Application

A comprehensive web-based survey application designed to collect and analyze lifestyle preference data from users with real-time analytics dashboard.

## 📌 Project Overview

This full-stack application consists of:
1. **Frontend**: React.js with Tailwind CSS for responsive UI
2. **Backend**: Node.js with Express.js REST API
3. **Database**: SQLite (development) / SQL Server (production)

## 🚀 Features

### ✅ Survey Form
- Clean and responsive user interface
- Comprehensive data collection:
  - Personal details (Name, Age, Email, Date of Birth)
  - Multi-select favorite foods (Pizza, Pasta, Pap and Wors, Other)
  - Lifestyle activity ratings (1–5 scale)
  - Date picker integration
- Robust client-side and server-side validation
- Age validation (5-120 years)
- Email format validation
- Required field validation

### 📊 Survey Results Dashboard
Real-time analytics including:
- **Total Submissions**: Count of all survey responses
- **Age Analytics**: Average, minimum, and maximum participant age
- **Food Preferences**: Percentage breakdown of each food choice
- **Activity Ratings**: Average ratings for:
  - Eating Out
  - Watching Movies
  - Watching TV
  - Listening to Radio

## 🛠️ Tech Stack

### 🖥️ Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | Frontend framework |
| Tailwind CSS | Utility-first styling |
| Axios | API communication |
| React Hook Form | Form handling & validation |
| React Router DOM | Page routing/navigation |

### 🌐 Backend
| Technology | Purpose |
|------------|---------|
| Express.js | REST API framework |
| better-sqlite3 | Lightweight SQLite client |
| SQLite | Development database |
| Node.js | JavaScript runtime |
| CORS | Cross-origin resource sharing |

### 🧰 Development Tools
| Tool | Purpose |
|------|---------|
| VS Code | Source code editing |
| Postman | API testing |
| Git + GitHub | Version control |
| npm / yarn | Package management |



## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v16.0.0 or higher)
- **npm** (v7.0.0 or higher) or **yarn**
- **Git** for version control

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/lifestyle-survey-app.git
cd lifestyle-survey-app
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Initialize database
npm run init-db

# Start backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

#### 3. Frontend Setup
```bash
# Navigate to frontend directory (open new terminal)
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm start
```

The frontend application will start on `http://localhost:3000`

### 🔧 Environment Configuration

#### Backend Environment Variables (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_TYPE=sqlite
DATABASE_PATH=./database.sqlite

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Optional: SQL Server Configuration (Production)
SQL_SERVER_HOST=your-server-host
SQL_SERVER_DATABASE=lifestyle_survey
SQL_SERVER_USERNAME=your-username
SQL_SERVER_PASSWORD=your-password
```

#### Frontend Environment Variables (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=10000

# Application Configuration
REACT_APP_NAME=Lifestyle Survey App
REACT_APP_VERSION=1.0.0
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
   
2. **Start Frontend Server** (new terminal):
   ```bash
   cd frontend
   npm start
   ```

3. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - API Health Check: http://localhost:5000/api/health

### Production Mode

1. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Production Server**:
   ```bash
   cd backend
   npm start
   ```

## 📡 API Endpoints

### Survey Endpoints
- `GET /api/surveys` - Retrieve all survey submissions
- `POST /api/surveys` - Submit new survey response
- `GET /api/surveys/stats` - Get survey analytics/statistics
- `DELETE /api/surveys/:id` - Delete specific survey (admin)

### Health Check
- `GET /api/health` - API health status

## 🗄️ Database Schema

### Survey Table
```sql
CREATE TABLE surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK(age >= 5 AND age <= 120),
    email TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    favorite_foods TEXT NOT NULL, -- JSON array
    eat_out_rating INTEGER CHECK(eat_out_rating >= 1 AND eat_out_rating <= 5),
    watch_movies_rating INTEGER CHECK(watch_movies_rating >= 1 AND watch_movies_rating <= 5),
    watch_tv_rating INTEGER CHECK(watch_tv_rating >= 1 AND watch_tv_rating <= 5),
    listen_radio_rating INTEGER CHECK(listen_radio_rating >= 1 AND listen_radio_rating <= 5),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test                # Run all tests
npm run test:unit      # Unit tests only
npm run test:integration # Integration tests only
npm run test:coverage  # Test coverage report
```

### Frontend Testing
```bash
cd frontend
npm test               # Run tests in watch mode
npm run test:coverage  # Generate coverage report
npm run test:ci       # Run tests in CI mode
```

## 🚀 Deployment

### Using Docker (Recommended)

1. **Build and Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

### Manual Deployment

#### Backend Deployment
```bash
cd backend
npm ci --production
npm run build
npm start
```

#### Frontend Deployment
```bash
cd frontend
npm ci --production
npm run build
# Deploy build/ folder to your hosting service
```

### Environment-Specific Configurations

#### Production Environment
- Use SQL Server or PostgreSQL instead of SQLite
- Enable HTTPS
- Configure proper CORS origins
- Set up environment-specific logging
- Enable API rate limiting

## 🔧 Development Scripts

### Root Level Scripts
```bash
npm run install:all    # Install all dependencies
npm run dev           # Start both frontend and backend
npm run build         # Build frontend for production
npm run test:all      # Run all tests
npm run clean         # Clean node_modules and build files
```

### Backend Scripts
```bash
npm run dev           # Start development server with nodemon
npm start             # Start production server
npm run init-db       # Initialize database
npm run reset-db      # Reset database to initial state
npm run migrate       # Run database migrations
npm test              # Run tests
```

### Frontend Scripts
```bash
npm start             # Start development server
npm run build         # Build for production
npm test              # Run tests
npm run eject         # Eject from Create React App
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process using port 3000 or 5000
npx kill-port 3000
npx kill-port 5000
```

#### Database Connection Issues
```bash
# Reset database
cd backend
npm run reset-db
```

#### CORS Errors
- Ensure backend is running on port 5000
- Check FRONTEND_URL in backend .env file
- Verify API_URL in frontend .env file

#### Module Not Found Errors
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

### Code Style Guidelines
- Use ESLint and Prettier for code formatting
- Follow React best practices
- Write meaningful commit messages
- Add tests for new features

## 👥 Authors

- **Jackson Khuto** - *Initial work* - [GITHUB](https://github.com/jackson951)

## 🙏 Acknowledgments

- React team for the excellent framework
- Tailwind CSS for the utility-first styling approach
- Express.js community for the robust backend framework
- SQLite team for the lightweight database solution

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: jacksonkhuto591@gmail.com


---

**Happy Coding! 🚀**
