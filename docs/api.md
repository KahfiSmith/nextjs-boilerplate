# API Documentation & Contracts

The application communicates directly with the backend API configured via `NEXT_PUBLIC_BACKEND_API_URL`.

## Authentication Architecture
- **Access Token**: In-memory only (stored in Zustand without persistence).
- **Refresh Token**: Handled automatically by the Go Fiber backend via HttpOnly cookies (`refresh_token`).
- **CSRF / XSS Protection**: JavaScript cannot read or manipulate the refresh token.

## Endpoints

### 1. Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "access_token": "<jwt-token>",
      "expires_in": 900,
      "user": {
        "id": "1",
        "name": "User Name",
        "email": "user@example.com"
      }
    }
  }
  ```

### 2. Refresh Session
- **Endpoint**: `POST /api/v1/auth/refresh`
- **Request Body**: None (Browser sends HttpOnly cookie automatically)
- **Response**: Same as Login data payload.

### 3. Logout
- **Endpoint**: `POST /api/v1/auth/logout`
- **Request Body**: None
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```
