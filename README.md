# ManageX - Advanced Project Management API

ManageX is a high-performance, enterprise-ready backend API designed to streamline project management, task tracking, and team collaboration. Built with a focus on scalability, security, and developer experience.

---

## Key Features

- **Robust Authentication:** JWT-based secure authentication with refresh token logic and password hashing via Bcrypt.
- **Workspace Management:** Create, manage, and collaborate within dedicated workspaces.
- **Team Collaboration:** Invite members via email, manage memberships, and define roles.
- **Task Orchestration:** Comprehensive task management system with support for statuses, assignments, and tracking.
- **Security First:** Integrated security layers including Helmet for header protection and Rate Limiting to prevent abuse.
- **Automated Notifications:** Built-in email service for invites and system notifications.

---

## Tech Stack

| Component     | Technology                                         |
| :------------ | :------------------------------------------------- |
| **Runtime**   | [Node.js](https://nodejs.org/)                     |
| **Framework** | [Express.js](https://expressjs.com/)               |
| **Language**  | [TypeScript](https://www.typescriptlang.org/)      |
| **Database**  | [MongoDB](https://www.mongodb.com/) (Mongoose ODM) |
| **Auth**      | JWT (JSON Web Tokens) & Bcrypt                     |
| **Mailing**   | Nodemailer                                         |
| **Security**  | Helmet & Express Rate Limit                        |

---

## Project Architecture

The codebase follows a **Clean Layered Architecture** to ensure maintainability and testability:

```text
src/
├── config/        # Environment configurations & Database connection
├── controller/    # HTTP Request handlers
├── errorHandler/  # Centralized error handling logic
├── interfaces/    # Type-safe contract definitions
├── middleware/    # Auth guards, validation, and security layers
├── models/        # Mongoose data schemas
├── repositories/  # Data access layer (abstraction over models)
├── routes/        # API endpoint mapping (versioned)
├── services/      # Business logic orchestration
├── utils/         # Reusable helper functions
└── server.ts      # Application bootstrap
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ManageX
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory (referencing `sample.env`):

   ```bash
   cp sample.env .env
   ```

   Fill in your credentials:

   ```env
   PORT=8080
   MONGODB_URI=your_mongodb_uri
   JWT_ACCESS_TOKEN=your_access_secret
   JWT_REFRESH_TOKEN=your_refresh_secret
   EMAIL_USER=your_email
   EMAIL_PASSWORD=your_password
   ```

4. **Launch the Server**
   ```bash
   npm run dev
   ```

---

## API Modules

The API is served under `/api/v1/` and includes the following primary modules:

- **User:** `/user` - Profile management and authentication.
- **Workspace:** `/workspace` - Creation and management of project spaces.
- **Task:** `/task` - Task lifecycle and management.
- **Invite:** `/invite` - Email-based team invitations.
- **Membership:** `/membership` - Team member role and access management.
- **Tokens:** `/token` - Token refresh and session management.

---

## Available Scripts

- `npm run dev`: Start development server with hot-reloading (`tsx watch`).
- `npm run build`: Compile TypeScript into production-ready JavaScript.
- `npm start`: Run the compiled production bundle.

---

## Security Measures

- **Helmet:** Protects against well-known web vulnerabilities by setting HTTP headers appropriately.
- **Rate Limiting:** Prevents Brute-force attacks (Default: 100 requests per 15 minutes).
- **Environment Isolation:** Sensitive data managed via `.env` files.

---

## License

Distributed under the [ISC License](https://choosealicense.com/licenses/isc/).
