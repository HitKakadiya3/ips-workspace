# IPS Workspace Backend

A Node.js backend for the IPS Workspace application, built with Express and MongoDB.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

## Setup Instructions

Follow these steps to set up and run the project locally:

### 1. Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm install
```

### 2. Environment Configuration

1. Create a `.env` file in the root directory (you can copy `.env.example`).
2. Add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
```

For Generate Secret Keys (JWT and Refresh Token)
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the generated keys and paste them in the `.env` file as `JWT_SECRET` and `REFRESH_TOKEN_SECRET`.

### 3. Run the Application

#### For Development (with auto-reload):
```bash
npm run dev
```

#### For Production:
```bash
npm start
```

## API Endpoints

The API is accessible at `http://localhost:5000/api`.

### Authentication
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Login to your account
