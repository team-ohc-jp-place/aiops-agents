# Pet Shop E-commerce Platform

A full-featured e-commerce platform for pet shops with user management and inventory tracking capabilities.

## Environment Configuration

Before running the application, you need to set up your environment variables:

1. Copy the `.env.example` file to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Fill in the environment variables in `.env` with your actual values:
   - Database Configuration:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `PGHOST`: PostgreSQL host
     - `PGPORT`: PostgreSQL port
     - `PGUSER`: PostgreSQL username
     - `PGPASSWORD`: PostgreSQL password
     - `PGDATABASE`: PostgreSQL database name
   
   - Session Configuration:
     - `SESSION_SECRET`: A secure random string for session encryption
   
   - Server Configuration:
     - `PORT`: The port number for the server (default: 5000)
     - `NODE_ENV`: The environment mode (development/production)

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run database migrations:
   ```bash
   npm run db:migrate
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5000
