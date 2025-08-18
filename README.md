# MERN Authentication Project
[![Click here to visit site]](https://user-auth-mern-project.netlify.app/)

This repository contains a full-stack MERN (MongoDB, Express, React, Node.js) application that provides a complete user authentication system. It includes user registration, login, session management with JWT tokens, email verification, and password reset functionality.

## Features

-   **User Authentication:** Secure registration and login with password hashing using `bcryptjs`.
-   **JWT & Cookies:** Session management using JSON Web Tokens (JWT) stored in secure, HTTP-only cookies.
-   **Email Verification:** New users receive an OTP via email to verify their account.
-   **Password Reset:** Users can securely reset their password using an email-based OTP system.
-   **Protected Routes:** Middleware to protect backend routes, ensuring only authenticated users can access specific data.
-   **Responsive UI:** A clean user interface built with React, Vite, and Tailwind CSS.
-   **Real-time Notifications:** User-friendly feedback for actions like login, registration, and errors using `react-toastify`.

## Tech Stack

### Frontend
-   **React:** A JavaScript library for building user interfaces.
-   **Vite:** A fast build tool and development server for modern web projects.
-   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
-   **React Router:** For declarative routing in the React application.
-   **Axios:** A promise-based HTTP client for making requests to the backend.
-   **React Toastify:** For displaying notifications.

### Backend
-   **Node.js:** A JavaScript runtime environment.
-   **Express.js:** A minimal and flexible Node.js web application framework.
-   **MongoDB:** A NoSQL database for storing user data.
-   **Mongoose:** An ODM library for MongoDB and Node.js.
-   **JSON Web Token (JWT):** For creating access tokens.
-   **BcryptJS:** For hashing user passwords.
-   **Nodemailer:** For sending emails (e.g., OTP for verification and password reset).
-   **Cookie-Parser:** For parsing cookie headers.

## Setup and Installation

### Prerequisites
-   Node.js (v18 or higher)
-   npm (or yarn)
-   MongoDB (A local instance or a cloud service like MongoDB Atlas)

### Backend Setup

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `server` directory and add the following variables:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET_KEY=your_jwt_secret_key
    PORT=4000
    SMTP_PASS=your_email_app_password_for_nodemailer
    ```
4.  **Start the server:**
    ```bash
    npm start
    ```
    The server will be running on the port specified in your `.env` file (e.g., `http://localhost:4000`).

### Frontend Setup

1.  **Navigate to the client directory from the root:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `client` directory and add the backend URL:
    ```env
    VITE_BACKEND_URL=http://localhost:4000
    ```
4.  **Start the client development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

## API Endpoints

The following are the primary API routes available:

| Method | Endpoint                    | Description                                         | Protected |
| :----- | :-------------------------- | :-------------------------------------------------- | :-------- |
| `POST` | `/api/auth/register`        | Register a new user.                                | No        |
| `POST` | `/api/auth/login`           | Log in an existing user and set a session cookie.   | No        |
| `POST` | `/api/auth/logout`          | Log out the user and clear the session cookie.      | No        |
| `POST` | `/api/auth/send-verify-otp` | Sends an OTP to the user's email for verification.  | Yes       |
| `POST` | `/api/auth/verify-account`  | Verifies the user's account with the provided OTP.  | Yes       |
| `GET`  | `/api/auth/is-auth`         | Checks if the user is currently authenticated.      | Yes       |
| `POST` | `/api/auth/send-reset-otp`  | Sends a password reset OTP to the specified email.  | No        |
| `POST` | `/api/auth/reset-password`  | Resets the password using the OTP and new password. | No        |
| `GET`  | `/api/user/data`            | Fetches the authenticated user's data.              | Yes       |