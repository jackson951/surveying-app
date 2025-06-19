# Lifestyle Preferences Survey Application

![Project Banner](https://via.placeholder.com/1200x400?text=Lifestyle+Survey+App)

A full-stack web application for collecting and analyzing lifestyle preference data.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Survey Form
- Multi-step form with progress indicator
- Responsive design for all devices
- Comprehensive validation with error messages
- Interactive UI elements
- Success state with multiple actions

### Results Dashboard
- Real-time analytics with charts
- Participant demographics
- Food preference percentages
- Activity rating averages

## Tech Stack

### Frontend
| Technology        | Purpose               |
|-------------------|-----------------------|
| React             | Frontend framework    |
| Tailwind CSS      | CSS framework         |
| Axios             | HTTP client           |
| React Hook Form   | Form management       |

### Backend
| Technology     | Purpose           |
|----------------|-------------------|
| Node.js        | Runtime           |
| Express        | Web framework     |
| SQLite         | Database          |

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/lifestyle-survey-app.git
cd lifestyle-survey-app
```

2. Install dependencies:
```bash
# For both frontend and backend
npm run setup

# Or separately:
cd client && npm install
cd ../server && npm install
```

3. Configure environment variables (see Configuration)

4. Start the application:
```bash
npm run dev
```

## Configuration

Create these `.env` files:

**server/.env**
```
PORT=5000
DB_PATH=./survey.db
NODE_ENV=development
```

**client/.env**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## API Documentation

Base URL: `http://localhost:5000/api`

| Endpoint    | Method | Description        |
|-------------|--------|--------------------|
| `/surveys`  | POST   | Submit new survey  |
| `/results`  | GET    | Get survey results |
| `/health`   | GET    | Check API health   |

**Sample Request (POST /surveys):**
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

## Project Structure

```
lifestyle-survey-app/
├── public/ # Static files
├── src/ # Source code
├── package.json # Frontend dependencies
├── server/ # Backend Node.js
│ ├── routes/ # API routes
│ └── package.json # Backend dependencies
└── README.md # Project documentation
```

## Development

**Available Scripts:**

```bash
# Install all dependencies
npm run setup

# Run both frontend and backend
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Deployment

### Docker (Recommended)
```bash
docker-compose up --build
```

### Manual Deployment

1. Build frontend:
```bash
cd client && npm run build
```

2. Start backend:
```bash
cd server && npm start
```

