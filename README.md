# 🎫 AI-Ticket-Assistant

Welcome to the **AI-Powered Ticket Management System**\!

This is a web application that uses **AI** to automatically **categorize, prioritize, and assign support tickets** to the most appropriate moderators.

🔗 **Live Demo:** [AI Ticket Assistant](https://ai-powered-ticket-assignment-system.vercel.app/)

-----

## ✨ Overview

A smart ticket management system that leverages AI to:

  - Automatically categorize support tickets
  - Assign priority levels
  - Match moderators based on skills
  - Generate helpful notes for faster ticket resolution

-----

## 🚀 Features

### AI-Powered Ticket Processing

  - Automatic ticket categorization
  - Smart priority assignment
  - Skill-based moderator matching
  - AI-generated helpful notes

### Smart Moderator Assignment

  - Auto-assign tickets to moderators based on skills
  - Fallback to **Admin** if no moderator is found
  - Regex-based skill routing system

### User Management

  - Role-based access control (**User, Moderator, Admin**)
  - Moderator skill management
  - Secure authentication with **JWT**

### Background Processing

  - Event-driven architecture using **Inngest**
  - Automated **email notifications**
  - Asynchronous ticket processing

-----

## 🛠 Tech Stack

  - **Backend:** Node.js with Express
  - **Database:** MongoDB
  - **Authentication:** JWT
  - **Background Jobs:** Inngest
  - **AI Integration:** Google Gemini API
  - **Email:** Nodemailer with Mailtrap
  - **Development:** Nodemon (hot reloading)

-----

## 📋 Prerequisites

  - Node.js (v14 or higher)
  - MongoDB installed or Atlas account
  - Google Gemini API Key
  - Mailtrap account (for email testing)

-----

## ⚙️ Installation

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd ai-ticket-assistant
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory and add the following:

    ```
    # MongoDB
    MONGO_URI=your_mongodb_uri

    # JWT
    JWT_SECRET=your_jwt_secret

    # Email (Mailtrap)
    MAILTRAP_SMTP_HOST=your_mailtrap_host
    MAILTRAP_SMTP_PORT=your_mailtrap_port
    MAILTRAP_SMTP_USER=your_mailtrap_user
    MAILTRAP_SMTP_PASS=your_mailtrap_password

    # AI (Gemini)
    GEMINI_API_KEY=your_gemini_api_key

    # Application
    APP_URL=http://localhost:3000
    ```

## Running the Application

  - **Start the main server**
    ```bash
    npm run dev
    ```
  - **Start the Inngest dev server**
    ```bash
    npm run inngest-dev
    ```

-----

## API Endpoints

### 🔑 Authentication

  - `POST /api/auth/signup` → Register a new user
  - `POST /api/auth/login` → Login and get JWT token
  - `POST /api/auth/logout` → Logout user

### 🎫 Tickets

  - `POST /api/tickets` → Create a new ticket
  - `GET /api/tickets` → Get all tickets for logged-in user
  - `GET /api/tickets/:id` → Get ticket details

### 👨‍💻 Admin

  - `GET /api/auth/users` → Get all users (Admin only)
  - `POST /api/auth/update-user` → Update user role & skills (Admin only)

-----

## Ticket Processing Flow

1.  **Ticket Creation:** User submits a ticket (title + description). The system saves the initial record.

2.  **AI Processing:** An `on-ticket-created` event is triggered by Inngest. Gemini AI analyzes the ticket and generates:

      - Required skills
      - Priority level
      - Helpful notes
      - Ticket type

3.  **Moderator Assignment:** The system searches for moderators with the required skills using a regex-based skill matching. It falls back to **Admin** if no match is found.

4.  **Notification:** The assigned moderator receives an email with ticket details and AI-generated notes.

-----

## Testing

Run the Inngest dev server:

```bash
npm run inngest-dev
```

Test ticket creation with `curl`:

```bash
curl -X POST http://localhost:3000/api/tickets \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-d '{
  "title": "Database Connection Issue",
  "description": "Experiencing intermittent database connection timeouts"
}'
```

-----

## 🔍 Troubleshooting

  - **Port Conflicts**

      - If you see "address already in use":
        ```bash
        lsof -i :8288
        kill -9 <PID>
        ```

  - **AI Processing Errors**

      - Check `GEMINI_API_KEY` in `.env`.
      - Verify API quota and limits.
      - Validate the request body format.

  - **Email Issues**

      - Verify Mailtrap credentials.
      - Check SMTP settings.
      - Monitor delivery logs.

-----

## 📚 Dependencies

  - `@inngest/agent-kit: ^0.7.3`
  - `bcrypt: ^5.1.1`
  - `cors: ^2.8.5`
  - `dotenv: ^16.5.0`
  - `express: ^5.1.0`
  - `inngest: ^3.35.0`
  - `jsonwebtoken: ^9.0.2`
  - `mongoose: ^8.13.2`
  - `nodemailer: ^6.10.1`
