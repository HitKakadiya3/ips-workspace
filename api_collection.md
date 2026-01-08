# IPS API Collection

Base URL: `http://localhost:5000/api`

## Authentication

### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "role": "employee"
  }
  ```

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Refresh Token
- **URL**: `/auth/refresh-token`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```json
  {
    "refreshToken": "..."
  }
  ```

---

## Users

### Get Current User
- **URL**: `/users/me`
- **Method**: `GET`
- **Auth required**: Yes

### Update Profile
- **URL**: `/users/:userId`
- **Method**: `PATCH`
- **Auth required**: No
- **Body**: Fields to update (name, etc.)

### Get All Users
- **URL**: `/users`
- **Method**: `GET`
- **Auth required**: Yes (Admin typically)

---

## Leaves

### Get All Leaves
- **URL**: `/leaves`
- **Method**: `GET`
- **Auth required**: Yes
- **Query Params**: `status`, `page`, `limit`, `sortBy`, `order`

### Get Leave Detail
- **URL**: `/leaves/:id`
- **Method**: `GET`
- **Auth required**: Yes

### Get Leaves by User
- **URL**: `/leaves/user/:userId`
- **Method**: `GET`
- **Auth required**: Yes
- **Query Params**: `year` (optional)

### Add Leave Request
- **URL**: `/leaves/user/:userId`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**:
  ```json
  {
    "leaveType": "Sick",
    "startDate": "2026-01-10",
    "endDate": "2026-01-11",
    "reason": "..."
  }
  ```

### Update Leave Status
- **URL**: `/leaves/:id`
- **Method**: `PATCH`
- **Auth required**: Yes (Admin only)
- **Body**:
  ```json
  {
    "status": "Approved"
  }
  ```

### Get Leave Counts
- **URL**: `/leaves/user/:userId/count`
- **Method**: `GET`
- **Auth required**: Yes

---

## Projects

### Get All Projects
- **URL**: `/projects`
- **Method**: `GET`
- **Auth required**: Yes
- **Query Params**: `search` (searches name, client, pm, type)

### Get Project Detail
- **URL**: `/projects/:projectId`
- **Method**: `GET`
- **Auth required**: Yes

### Get Projects by User
- **URL**: `/projects/user/:userId`
- **Method**: `GET`
- **Auth required**: Yes

### Create Project
- **URL**: `/projects`
- **Method**: `POST`
- **Auth required**: Yes (Admin only)
- **Body**:
  ```json
  {
    "name": "Project Name",
    "startDate": "2026-01-01",
    "clientName": "...",
    "assignedUsers": ["userId1", "userId2"]
  }
  ```

---

## Documents

### Get All Documents
- **URL**: `/documents`
- **Method**: `GET`
- **Auth required**: Yes

### Upload Documents
- **URL**: `/documents`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**: `formData` with `title`, `description`, `accessType`, `files[]`

### Download Document
- **URL**: `/documents/download/:filename`
- **Method**: `GET`
- **Auth required**: Yes

### Delete Document
- **URL**: `/documents/:id`
- **Method**: `DELETE`
- **Auth required**: Yes

---

## Dashboard

### Get Dashboard Data
- **URL**: `/dashboard/:userId`
- **Method**: `GET`
- **Auth required**: No (depends on implementation)

---

## Utilities

### Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Auth required**: No

### Test Transaction
- **URL**: `/transactions/test`
- **Method**: `POST`
- **Auth required**: No

### Leave Stats
- **URL**: `/aggregates/stats`
- **Method**: `GET`
- **Auth required**: No
