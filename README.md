# ManageX

ManageX is a robust backend API built with Node.js, Express, and TypeScript. It utilizes MongoDB for data storage and includes features like JWT-based authentication and email services. 

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/) & [bcrypt](https://www.npmjs.com/package/bcrypt)
- **Mailing:** [Nodemailer](https://nodemailer.com/)

## Project Structure

The project follows a layered architecture to ensure separation of concerns and maintainability:

```text
src/
├── config/        # Environment and configuration variables
├── controller/    # Request handlers parsing input and sending responses
├── errorHandler/  # Custom error handling classes and middleware
├── interfaces/    # TypeScript interfaces and type definitions
├── middleware/    # Express middleware (e.g., authentication)
├── models/        # Mongoose database schemas and models
├── repositories/  # Database access logic (data layer)
├── routes/        # API route definitions
├── services/      # Core business logic
├── utils/         # Utility functions and helpers
└── server.ts      # Application entry point
```

## Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file. You can use the `sample.env` file as a reference.

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ManageX
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your `.env` file:**
   Copy `sample.env` to `.env` and fill in your details.
   ```bash
   cp sample.env .env
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev`: Starts the development server with hot-reloading using `tsx`.
- `npm run build`: Compiles the TypeScript code into JavaScript.
- `npm start`: Runs the application.

## License

[ISC](https://choosealicense.com/licenses/isc/)
