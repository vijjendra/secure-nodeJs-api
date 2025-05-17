# Secure Node.js API

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
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

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