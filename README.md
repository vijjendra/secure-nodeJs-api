# Secure Node.js Web API

A robust and secure Node.js API built with TypeScript, Express.js, and MongoDB, implementing best practices for security, authentication, and scalability.

## Features

- 🔐 Secure Authentication & Authorization
- 📝 Input Validation using Express Validator and Joi
- 🔒 Security Features (Helmet, Rate Limiting, CORS)
- 📦 MongoDB Integration with Mongoose
- 🚀 TypeScript Support
- 📝 Winston Logger with Daily Rotate File
- 🔍 Request Validation & Sanitization
- 🎯 Environment Configuration with dotenv
- 🏗️ Clean Architecture and Project Structure

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- TypeScript
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vijjendra/secure-nodeJs-api.git
   cd secure-nodeJs-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   # Server Configuration
   PORT=3000
   ENVIRONMENT=development # Options: development, production, test
   API_VERSION=v1
   WEBSITE_URL=http://localhost:5000

   # Database Configuration
   CONNECTION_STRING=mongodb://localhost:27017/your_database_name

   # Authentication Configuration
   BEARER_ACCESS_TOKEN=your_bearer_token
   HMACAUTH_SECRET_KEY=your_hmac_secret_key
   HMAC_TOKEN_EXPIRYIN=5m

   # JWT Configuration
   JWT_ACCESS_TOKEN_SECERT=your_jwt_access_token_secret
   JWT_REFRESH_TOKEN_SECERT=your_jwt_refresh_token_secret
   JWT_ACCESS_TOKEN_EXPIRYIN=1h
   JWT_REFRESH_TOKEN_EXPIRYIN=7d

   # Cookie Configuration
   ENABLE_COOKIES=false
   ```

### Environment Variables Description

#### Server Configuration
- **PORT**: Server port number (default: 3000)
- **ENVIRONMENT**: Application environment (options: development, production, test)
- **API_VERSION**: API version for URL routing (default: v1)
- **WEBSITE_URL**: Website URL (default: http://localhost:5000)

#### Database Configuration
- **CONNECTION_STRING**: MongoDB connection string
  - Format: `mongodb://[username:password@]host[:port]/database_name`
  - Example: `mongodb://localhost:27017/your_database_name`

#### Authentication Configuration
- **BEARER_ACCESS_TOKEN**: Token for bearer authentication
  - Used for API authentication using Bearer token scheme
- **HMACAUTH_SECRET_KEY**: Secret key for HMAC authentication
  - Used for generating and validating HMAC signatures
- **HMAC_TOKEN_EXPIRYIN**: HMAC token expiry time (default: 5m)
  - Supports time units: s (seconds), m (minutes), h (hours), d (days)

#### JWT Configuration
- **JWT_ACCESS_TOKEN_SECERT**: Secret for JWT access tokens
  - Used to sign and verify access tokens
  - Should be a strong, unique secret key
- **JWT_REFRESH_TOKEN_SECERT**: Secret for JWT refresh tokens
  - Used to sign and verify refresh tokens
  - Should be different from access token secret
- **JWT_ACCESS_TOKEN_EXPIRYIN**: Access token expiry time (default: 1h)
  - Supports time units: s (seconds), m (minutes), h (hours), d (days)
- **JWT_REFRESH_TOKEN_EXPIRYIN**: Refresh token expiry time (default: 7d)
  - Typically set to a longer duration than access token
  - Supports time units: s (seconds), m (minutes), h (hours), d (days)

#### Cookie Configuration
- **ENABLE_COOKIES**: Enable/disable cookie functionality (default: false)
  - Set to 'true' to enable cookie-based authentication
  - Set to 'false' to use only token-based authentication

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server in development mode with hot reloading.

### Production Mode
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middlewares/    # Custom middleware functions
├── models/        # Database models
├── routes/        # API routes
├── services/      # Business logic
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── validations/   # Request validation schemas
├── app.ts         # Express app configuration
└── server.ts      # Server entry point
```

## API Documentation

The API endpoints will be documented here or in a separate API documentation file.

## Security Features

- JWT Authentication
- Request Rate Limiting
- CORS Protection
- XSS Protection
- Security Headers (via Helmet)
- Input Validation and Sanitization
- Password Hashing
- Request Size Limiting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

Vijendra Singh Shakya

## Support

For support, please create an issue in the repository.
