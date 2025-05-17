import express from "express";
import userController from "../controllers/userController"; // Import the controller functions
import HmacTokenService from "../middlewares/hmacTokenService";
import JWTTokenMiddleware from "../middlewares/JWTTokenMiddleware";
import { validateUserId } from "../middlewares/validationMiddleware";
import rateLimiter from "../middlewares/rateLimiter";
const router = express.Router();

router.patch(
  "/change-password",
  rateLimiter,
  JWTTokenMiddleware.authorizeUser,
  HmacTokenService.hmacAuthentication,
  validateUserId,
  userController.changePassword
);

router.get(
  "/me",
  rateLimiter,
  JWTTokenMiddleware.authorizeUser,
  HmacTokenService.hmacAuthentication,
  validateUserId,
  userController.getCurrentUser
);


router.get(
  "/refresh-token",
  rateLimiter,
  JWTTokenMiddleware.authorizeRefreshToken,
  HmacTokenService.hmacAuthentication,
  validateUserId,
  userController.regenerateAccessToken
);

export default router;
