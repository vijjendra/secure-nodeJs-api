import express from "express";
import authController from "../controllers/authController"; // Import the controller functions
import HmacTokenService from "../middlewares/hmacTokenService";
import rateLimiter from "../middlewares/rateLimiter";
import JWTTokenMiddleware from "../middlewares/JWTTokenMiddleware";

const router = express.Router();

// Route for user signup
router.post(
  "/signup",
  rateLimiter,
  JWTTokenMiddleware.authenticateStaticBearerToken,
  HmacTokenService.hmacAuthentication,
  authController.signup
);

// Route for user login
router.post(
  "/login",
  rateLimiter,
  JWTTokenMiddleware.authenticateStaticBearerToken,
  HmacTokenService.hmacAuthentication,
  authController.login
);


export default router;
